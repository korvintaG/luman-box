import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from './entities/keyword.entity';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { ExceptionType, IUser } from '../../types/custom';
import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import { PostgresFunctionService } from '../../shared/services/postgres-function/postgres-function.service';
import { throwException } from 'src/utils/utils';

@Injectable()
export class KeywordsValidationService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
    private postgresFunctionService: PostgresFunctionService,
  ) {}

  // проверка уникальности наименований массива строк
  checkNamesUniqueness(names: string[]) {
    const trimNames=names.map(el=>el.trim())
    const emptyNames=trimNames.filter(el=>!el)
    if (emptyNames.length>0)
      throwException(ExceptionType.BadRequestException,
         `Названия ключевых слов не должны быть пустыми строками!`);

    const uniqueNames = new Set(trimNames);
    if (uniqueNames.size !== trimNames.length) {
      // Находим дублирующиеся слова
      const nameCount = new Map<string, number>();
      trimNames.forEach(name => {
        nameCount.set(name, (nameCount.get(name) || 0) + 1);
      });
      
      const duplicates = Array.from(nameCount.entries())
        .filter(([_, count]) => count > 1)
        .map(([name, _]) => name);
      
      const duplicatesList = duplicates.join(', ');
      throwException(ExceptionType.BadRequestException,
         `Все названия ключевого слова должны быть уникальными! Найдены дубликаты: ${duplicatesList}`);
    }
  }

  async getClassName(id: number) {
    const breadCrumbsStr = await this.postgresFunctionService.callStringFunction(
      'get_keyword_bread_crumbs',
       id
    );
    const breadCrumbsJSON = breadCrumbsStr 
      ? (JSON.parse(`[${breadCrumbsStr}]`) as {id: number, name: string}[])
      : [];
    const reversedBreadCrumbs = [...breadCrumbsJSON].reverse();
    const classNameBefore = breadCrumbsJSON.map(item => item.name).join(' / ');
    const classNameAfter = reversedBreadCrumbs.map(name => name.name).join(' / ');
    return { breadCrumbsStr, classNameBefore, classNameAfter };
  }

  // есть ли в DTO новые синонимы для добавления?
  isUpdateHaveNewSynonyms(recOld: Keyword, updateKeywordDto: UpdateKeywordDto): boolean {
    const oldNameIds = recOld.names
      ? new Set(recOld.names.map(oldName => oldName.id))
      : new Set<number>();
    
    const namesToCreate = updateKeywordDto.names
      .filter(name => name.id === undefined || name.id === null || !oldNameIds.has(name.id));
    return namesToCreate.length > 0;
  }

  // проверка разрешений на исправления наименований синонимов
  checkUpdate(
    user: IUser,
    recOld: Keyword,
    updateKeywordDto: UpdateKeywordDto,
    checkLevel: Set<'notModerated' | 'own'>
  ) {
    const oldUpdate = recOld.names.filter((el) => {
      const found = updateKeywordDto.names.find((fel) => fel.id === el.id);
      return found && found.name !== el.name;
    });
    if (checkLevel.has('notModerated')) {
      const errUp = oldUpdate.filter(
        (el) => el.verification_status === VerificationStatus.Moderated
      );
      if (errUp.length > 0)
        throwException(ExceptionType.BadRequestException,
          `Нельзя править отмодерированные названия: ${errUp.map((el) => el.name).join(', ')}`);
    }
    if (checkLevel.has('own')) {
      const errUp = oldUpdate.filter((el) => el.user_id !== user.id);
      if (errUp.length > 0)
        throwException(ExceptionType.BadRequestException,
          `Нельзя править названия, добавленные не Вами: ${errUp.map((el) => el.name).join(', ')}`);
    }
  }

  // проверка разрешений на удаление наименований синонимов
  async checkNamesDelete(
    user: IUser,
    recOld: Keyword,
    updateKeywordDto: UpdateKeywordDto,
    checkLevel: Set<'links' | 'notModerated' | 'own'> = new Set(['links'])
  ) {
    const newNamesIds = new Set(
      updateKeywordDto.names
        .map((el) => el.id)
        .filter((id) => id !== undefined && id !== null)
    );
    const namesToDelete = recOld.names.filter(
      (oldName) => !newNamesIds.has(oldName.id)
    );
    // Проверка: можно ли удалять namesToDelete?
    // Нельзя удалять keyword_name, если есть связанные записи в idea_keyword_names
    if (namesToDelete.length > 0 && checkLevel.has('links')) {
      const namesToDeleteIds = namesToDelete.map((n) => n.id);
      const existingLinks =
        await this.keywordRepository.manager.query<{ keyword_name_id: number }[]>(
          `SELECT DISTINCT keyword_name_id
         FROM idea_keyword_names
         WHERE keyword_name_id = ANY($1)`,
          [namesToDeleteIds]
        );

      if (existingLinks.length > 0) {
        const linkedNames = namesToDelete.filter((n) =>
          existingLinks.some((link) => link.keyword_name_id === n.id)
        );
        const namesList = linkedNames.map((n) => n.name).join(', ');
        throwException(ExceptionType.BadRequestException,
           `Нельзя удалить названия, которые используются в идеях: ${namesList}`);
      }
    }

    // если указано, что проверять удаляемые на немодерированные
    if (checkLevel.has('notModerated')) {
      const errDel = namesToDelete.filter(
        (el) => el.verification_status === VerificationStatus.Moderated
      );
      if (errDel.length > 0)
        throwException(ExceptionType.BadRequestException,
          `Нельзя удалять отмодерированные названия [${errDel.map((el) => el.name).join('; ')}]!`);
    }

    // если только собственные
    if (checkLevel.has('own')) {
      const errDel = namesToDelete.filter((el) => el.user_id !== user.id);
      if (errDel.length > 0)
        throwException(ExceptionType.BadRequestException,
          `Нельзя удалять названия добавленные не Вами [${errDel.map((el) => el.name).join('; ')}]!`);
    }
  }

  // проверка, можно ли удалить все ключевое слово?
  async checkDelete(
    user: IUser,
    recOld: Keyword,
    checkLevel: Set<'links' | 'notModerated' | 'own'>
  ) {
    if (checkLevel.has('links')) {
      // Проверяем наличие связей и получаем детальную информацию
      const links =
        await this.keywordRepository.manager.query<{
          keyword_name_id: number;
          keyword_name: string;
          idea_id: number;
          idea_name: string;
        }[]>(
          `SELECT 
            kn.id as keyword_name_id,
            kn.name as keyword_name,
            i.id as idea_id,
            i.name as idea_name
         FROM keyword_names kn
         INNER JOIN idea_keyword_names ikn ON ikn.keyword_name_id = kn.id
         INNER JOIN ideas i ON i.id = ikn.idea_id
         WHERE kn.keyword_id = $1
         ORDER BY kn.name, i.name`,
          [recOld.id]
        );
      
      if (links.length > 0) {
        // Получаем уникальные названия синонимов
        const keywordNames = [...new Set(links.map(link => link.keyword_name))];
        // Получаем уникальные названия идей
        const ideaNames = [...new Set(links.map(link => link.idea_name))];
        
        throwException(ExceptionType.BadRequestException,
          `Нельзя удалять ключевое слово, на которое ссылаются идеи! Синонимы: ${keywordNames.join(', ')}. Идеи: ${ideaNames.join(', ')}`);
      }
    }
    if (checkLevel.has('notModerated')) {
      console.log('checkLevel.has(notModerated) recOld', recOld);
      if ([VerificationStatus.Moderated, VerificationStatus.ToModerate].
            includes(recOld.verification_status))
          throwException(ExceptionType.UnauthorizedException,
          'Нельзя удалять уже отмодерированное (или на модерации) ключевое слово!');
      const badDel = recOld.names.filter(
        (el) => el.verification_status === VerificationStatus.Moderated
      );
      if (badDel.length > 0) {
        const badDelNames = badDel.map((el) => el.name).join(', ');
        throwException(ExceptionType.BadRequestException,
          `Нельзя удалять ключевое слово, которое имеет отмодерированные синонимы: ${badDelNames}!`);
      }
    }

    if (checkLevel.has('own')) {
      if (recOld.user_id !== user.id)
        throwException(ExceptionType.UnauthorizedException,
          'Нельзя удалять ключевое слово добавленное не Вами!');

      const badDel = recOld.names.filter((el) => el.user_id !== user.id);
      if (badDel.length > 0) {
        const badDelNames = badDel.map((el) => el.name).join(', ');
        throwException(ExceptionType.UnauthorizedException,
            `Нельзя удалять синонимы ключевых слов, добавленных не Вами: ${badDelNames}!`);
      }
    }
  }
}

