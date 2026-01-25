import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword, KeywordName } from './entities/keyword.entity';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { IUser, Role } from 'src/types/custom';
import { KeywordsValidationService } from './keywords-validation.service';

@Injectable()
export class KeywordsHelperService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
    @InjectRepository(KeywordName)
    private readonly keywordNameRepository: Repository<KeywordName>,
    private keywordsValidationService: KeywordsValidationService
  ) {}

  async updateAndDeleteKeywordNames(
    oldNames: KeywordName[],
    newNames: UpdateKeywordDto['names']
  ): Promise<void> {
    if (!oldNames || oldNames.length === 0) {
      return;
    }

    // Удаляем названия, которые отсутствуют в обновленных данных
    const updatedNameIds = new Set(
      newNames
        .filter(name => name.id !== undefined && name.id !== null)
        .map(name => name.id)
    );
    
    const namesToDelete = oldNames.filter(
      oldName => !updatedNameIds.has(oldName.id)
    );
    
    if (namesToDelete.length > 0) {
      //console.log('namesToDelete', namesToDelete);
      await this.keywordNameRepository.remove(namesToDelete);
    }

    // Обновляем названия, которые существуют и в старых, и в новых данных, но изменились
    const updatedNamesMap = new Map(
      newNames
        .filter(name => name.id !== undefined && name.id !== null)
        .map(name => [name.id, name.name])
    );
    
    const namesToUpdate = oldNames
      .filter(oldName => updatedNamesMap.has(oldName.id))
      .filter(oldName => {
        const newName = updatedNamesMap.get(oldName.id);
        return newName && oldName.name !== newName;
      })
      .map(oldName => {
        const updatedName = this.keywordNameRepository.create({
          id: oldName.id,
          name: updatedNamesMap.get(oldName.id),
        });
        return updatedName;
      });
    
    if (namesToUpdate.length > 0) {
      //console.log('namesToUpdate', namesToUpdate);
      await this.keywordNameRepository.save(namesToUpdate);
    }
  }

  getUserRole(user:IUser):Role {
    return user && user.role_id!==undefined ? user.role_id : Role.Anonymous;
  }

  async createNewKeywordNames(
    oldNames: KeywordName[] | undefined,
    newNames: UpdateKeywordDto['names'],
    keywordId: number,
    classKeywordID: number,
    userId: number
  ): Promise<void> {
    // Добавляем новые названия ключевых слов, те записи из updateKeywordDto.names, которых нет в recordOld.names (по ID)
    const oldNameIds = oldNames 
      ? new Set(oldNames.map(oldName => oldName.id))
      : new Set<number>();
    
    const { classNameBefore, classNameAfter } = await this.keywordsValidationService.getClassName(classKeywordID);
    const namesToCreate = newNames
      .filter(name => name.id === undefined || name.id === null || !oldNameIds.has(name.id))
      .map(name => 
        this.keywordNameRepository.create({
          name: name.name,
          keyword: { id: keywordId },
          user: { id: userId },
          class_name_after: classNameAfter,
          class_name_before: classNameBefore,
        })
      );
    
    if (namesToCreate.length > 0) {
      console.log('namesToCreate', namesToCreate);
      await this.keywordNameRepository.save(namesToCreate);
    }
  }

  /**
   * Рекурсивно пересчитывает class_name_after и class_name_before 
   * для всех дочерних ключевых слов
   * @param parentId - ID родительского ключевого слова
   */
  async recalculateChildKeywordsClassNames(parentId: number): Promise<void> {
    // Находим все дочерние ключевые слова
    const childKeywords = await this.keywordRepository.find({
      where: { class_keyword_id: parentId },
    });

    // Для каждого дочернего ключевого слова пересчитываем class_name_before и class_name_after
    for (const childKeyword of childKeywords) {
      const { classNameBefore, classNameAfter } = await this.keywordsValidationService.getClassName(childKeyword.id);
      
      // Обновляем ключевое слово
      await this.keywordRepository.update(childKeyword.id, {
        class_name_after: classNameAfter,
        class_name_before: classNameBefore,
      });

      // Обновляем все связанные названия (KeywordName)
      await this.keywordNameRepository.update(
        { keyword_id: childKeyword.id },
        {
          class_name_after: classNameAfter,
          class_name_before: classNameBefore,
        },
      );

      // Рекурсивно обрабатываем потомков текущего дочернего ключевого слова
      await this.recalculateChildKeywordsClassNames(childKeyword.id);
    }
  }
}

