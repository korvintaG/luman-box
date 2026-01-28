import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Keyword, KeywordName, KeywordModeration } from './entities/keyword.entity';
import { ExceptionType, SimpleEntity } from '../../types/custom';
import { joinSimpleEntityFirst, throwException } from '../../utils/utils';
import { IUser, Role } from '../../types/custom';
import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import { ModeratorService } from '../../shared/services/moderator/moderator.service';
import { pick } from 'lodash';
import { KeywordsValidationService } from './keywords-validation.service';
import { KeywordsHelperService } from './keywords-helper.service';
import { FindKeywordDto } from './dto/find-keyword.dto';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
    @InjectRepository(KeywordName)
    private readonly keywordNameRepository: Repository<KeywordName>,
    @InjectRepository(KeywordModeration)
    private readonly keywordModerationRepository: Repository<KeywordModeration>,
    private moderatorService: ModeratorService,
    private keywordsValidationService: KeywordsValidationService,
    private keywordsHelperService: KeywordsHelperService,
  ) {}


  async create(user: IUser, createKeywordDto: CreateKeywordDto) {
    // Проверка уникальности названий
    this.keywordsValidationService.checkNamesUniqueness(createKeywordDto.names);

    // Проверка наличия ключевого слова верхнего уровня если оно задано
    if (createKeywordDto.class_keyword_id) {
      const classKeyword = await this.keywordRepository.findOne({where: {id: createKeywordDto.class_keyword_id}});
      if (!classKeyword) 
        throwException(ExceptionType.BadRequestException,
           'Ключевое слово верхнего уровня не найдено!');
       
    }

    await this.moderatorService.checkDraftCount(
      this.keywordRepository,
      user,
      'Ключевое слово'
    );

    const { breadCrumbsStr, classNameBefore, classNameAfter } = await this.keywordsValidationService.getClassName(createKeywordDto.class_keyword_id);
    const keyword = this.keywordRepository.create({
      name: createKeywordDto.names[createKeywordDto.default_name_index],
      class_keyword_id: createKeywordDto.class_keyword_id,
      definition: createKeywordDto.definition,
      bread_crumbs: breadCrumbsStr ? `[${breadCrumbsStr}]` : null,
      class_name_before: classNameBefore,
      class_name_after: classNameAfter,
      user: { id: user.id },
    });
    const savedKeyword = await this.keywordRepository.save(keyword);
    
    const keywordNames = createKeywordDto.names.map((name) => {
        return this.keywordNameRepository.create({
          name: name,
          keyword: savedKeyword,
          class_name_before: classNameBefore,
          class_name_after: classNameAfter,
          user: { id: user.id },
        })
      }
    );
    await this.keywordNameRepository.save(keywordNames);

    const resultKeyword=await this.keywordRepository.findOne(
      {where: {id: savedKeyword.id}, relations: ['names', 'user']});
    
    return resultKeyword;
  }


/*  findAll(user: IUser) {
    if (!user)
      // неавторизован, выводим все отмодерированное
      return this.keywordRepository.find({
        select: ['id', 'name', 'verification_status'],
        where: { verification_status: VerificationStatus.Moderated },
        order: { name: 'ASC' },
      });
    else {
      if (user.role_id === Role.User)
        // простой пользователь - выводим отмодерированное и его
        return this.keywordRepository
          .createQueryBuilder('keyword')
          .select(['keyword.id','keyword.name', 'keyword.verification_status'])
          .where('keyword.verification_status = :moderated', { moderated: VerificationStatus.Moderated })
          .orWhere('keyword.user_id = :user', { user: user.id })
          .orderBy('name')
          .getMany(); // админ, выводим все
      else 
        return this.keywordRepository.find({
          select: ['id', 'name', 'verification_status'],
          order: { name: 'ASC' } });
    }
  }*/


  findByCond(cond: FindOptionsWhere<Keyword>) {
    // Фильтруем условие, оставляя только прямые поля сущности Keyword
    // Исключаем связи (names, moderation) если они переданы в неправильном формате
    const filteredCond: any = {};
    
    // Автоматически получаем все колонки сущности из метаданных TypeORM
    // Это включает поля из базовых классов (EntityCommonFull и т.д.)
    const keywordFields = this.keywordRepository.metadata.columns.map(col => col.propertyName);
    
    // Получаем имена связей, чтобы их исключить
    const relationNames = this.keywordRepository.metadata.relations.map(rel => rel.propertyName);
    
    // Создаем Set для быстрого поиска
    const keywordFieldsSet = new Set(keywordFields);
    const relationNamesSet = new Set(relationNames);
    
    for (const key in cond) {
      // Включаем только колонки (не связи)
      if (keywordFieldsSet.has(key) && !relationNamesSet.has(key)) {
        filteredCond[key] = (cond as any)[key];
      }
    }
    
    return this.keywordRepository.find({
      where: filteredCond as FindOptionsWhere<Keyword>, 
      relations: ['names']
    });
  }

  async findByClass(user: IUser, class_keyword_id?: string) {
    //console.log('findByClass user=', user,' class_keyword_id=',class_keyword_id);
    let classKeywordId = class_keyword_id ? Number(class_keyword_id) : 0;
    let keywords=await this.keywordRepository.find({
      select: ['id', 'name', 'verification_status', 'user_id'], 
      where: {class_keyword_id: classKeywordId}, 
      order: {name: 'ASC'}});
    const userRole=this.keywordsHelperService.getUserRole(user);
    //console.log('findByClass keywords',keywords,'userRole',userRole)
    switch (userRole) {
      case (Role.Anonymous):
        //console.log('Role.Anonymous')
        keywords=keywords.filter(el=>
             el.verification_status === VerificationStatus.Moderated)
        break;
      case (Role.User):
        //console.log('Role.User')
        keywords=keywords.filter(el=>
          el.user_id===user.id 
            || el.verification_status === VerificationStatus.Moderated)
        break;
      case Role.Admin:
        keywords=keywords.filter(el=>
          [VerificationStatus.Moderated, VerificationStatus.ToModerate].includes(el.verification_status) )
        break;
      case Role.SuperAdmin:
        break;
    }
    if ([Role.User, Role.Admin, Role.SuperAdmin].includes(userRole)) {
        // Добавляем для каждой записи поле names_to_moderate = количества связанных записей в keyword_names, у которых verification_status=VerificationStatus.ToModerate
        if (keywords.length > 0) {
          const keywordIds = keywords.map(k => k.id);
          const counts = await this.keywordRepository.manager.query<{ keyword_id: number; cnt: number }[]>(
            `SELECT kn.keyword_id, COUNT(*)::integer as cnt
             FROM keyword_names kn
             WHERE kn.keyword_id = ANY($1::int[])
               AND kn.verification_status = $2
             GROUP BY kn.keyword_id`,
            [keywordIds, VerificationStatus.ToModerate],
          );
          
          if (counts.length>0) {
            const countsMap = new Map(counts.map(
              c => [c.keyword_id, c.cnt]));
            
            keywords.forEach(keyword => {
              (keyword as any).names_to_moderate = countsMap.get(keyword.id) || 0;
            });
          }
        }
    }
    if (classKeywordId) {
      const current = await this.keywordRepository.findOne({where: {id: classKeywordId}});
      let names_to_moderate:number|undefined=undefined;
      // TODO добавить в current поле names_to_moderate
      if ([Role.User, Role.Admin, Role.SuperAdmin].includes(userRole)) {
        const counts = await this.keywordRepository.manager.query<{ keyword_id: number; cnt: number }[]>(
          `SELECT kn.keyword_id, COUNT(*)::integer as cnt
          FROM keyword_names kn
          WHERE kn.keyword_id = $1
            AND kn.verification_status = $2
          GROUP BY kn.keyword_id`,
          [classKeywordId, VerificationStatus.ToModerate],
        );
        if (counts.length>0) {
          names_to_moderate=counts[0].cnt;
        }
      }
      return { current : {...current, names_to_moderate} , keywords : keywords };
    } else {
      return { current : { id: 0 }, keywords : keywords };
    }
  }

  async findByToken(user: IUser, findKeywordDto: FindKeywordDto) {
    const keywordNamesExist = findKeywordDto.keyword_names_exist || [];
    //console.log('findByToken keywordNamesExist',keywordNamesExist)
    
    // Если массив пустой, не добавляем условие исключения
    if (keywordNamesExist.length === 0) {
      return await this.keywordRepository.manager.query<SimpleEntity[]>(
        `select kn.id, kn.class_name_before, kn.name
         from keyword_names kn
         where kn.name ilike '%' || $1 || '%'
         order by kn.class_name_before, name`,
        [findKeywordDto.token]);
    }
    
    // Если массив не пустой, используем условие исключения
    return await this.keywordRepository.manager.query<SimpleEntity[]>(
      `select kn.id, kn.class_name_before, kn.name
       from keyword_names kn
       where kn.name ilike '%' || $1 || '%'
         and kn.keyword_id not in (
           select distinct keyword_id 
           from keyword_names 
           where id = ANY($2::int[])
         )
       order by kn.class_name_before, name`,
      [findKeywordDto.token, keywordNamesExist]);
  }

  async findSummary(id: number, user: IUser) {
    return await this.keywordRepository.findOne({where: {id}, select: ['id', 'name', 'bread_crumbs']})
  }


  async findOne(id: number, user: IUser) {
    let mainRes = await this.keywordRepository
      .createQueryBuilder('keyword')
      .select([
        'keyword',
        'user.id',
        'user.name',
        'moderator.id',
        'moderator.name',
        'names.id',
        'names.name',
        'names.user_id',
        'names.verification_status',
        'names.keyword_moderation_id',
        'names.moderation_notes'
      ]) // Выбираем только нужные поля
      .leftJoin('keyword.user', 'user')
      .leftJoin('keyword.moderator', 'moderator')
      .leftJoin('keyword.names', 'names')
      .where('keyword.id = :id', { id })
      .orderBy('names.id')
      .getOne();
    if (!mainRes) 
      throwException(ExceptionType.NotFoundException,
        'Не найдено или ключевое слово, или его автор, или его модератор!');

    const userRole=this.keywordsHelperService.getUserRole(user);
    switch (mainRes.verification_status) {
      case (VerificationStatus.Moderated):
        break;
      case (VerificationStatus.Creating, VerificationStatus.Rejected):
        if (!user || (user.id!== mainRes.user_id && ![Role.SuperAdmin, Role.Admin].includes(userRole)))
          throwException(ExceptionType.UnauthorizedException,
            'У Вас нет прав доступа к этому ключевому слову!');
        break;
      case (VerificationStatus.ToModerate):
        if (!user || (user.id!== mainRes.user_id && user.role_id===Role.User))
          throwException(ExceptionType.UnauthorizedException,
            'У Вас нет прав доступа к этому ключевому слову!');
        break;
    }

    // Подсчет количества записей в idea_keyword_names для каждого names одним запросом
    if (mainRes.names && mainRes.names.length > 0) {
      const counts = await this.keywordRepository.manager.query<{ keyword_name_id: number; cnt: string }[]>(
        `SELECT kn.id as keyword_name_id, COUNT(ikn.keyword_name_id)::integer as cnt
         FROM keyword_names kn
         LEFT JOIN idea_keyword_names ikn ON ikn.keyword_name_id = kn.id
         WHERE kn.keyword_id = $1
         GROUP BY kn.id`,
        [id],
      );
      
      // Добавляем счетчик к каждому names
      const countsMap = new Map(counts.map(
        c => [c.keyword_name_id, parseInt(c.cnt)]));

      mainRes.names.forEach(name => {
        (name as any).ideas_count = countsMap.get(name.id) || 0;
      });
    }
    
    /*await this.moderatorService.checkGetRecordAccess(mainRes, user);
    const authors = await this.keywordRepository.manager.query<SimpleEntity[]>(
      `select distinct authors.id, authors.name
        from keyword_names, idea_keyword_names , ideas, sources, authors 
        where keywords.id=$1 
          and idea_keyword_names.keyword_name_id=keywords.id 
          and idea_keyword_names.idea_id=ideas.id
          and sources.id=source_id and authors.id=author_id
        order by authors.name`,
      [id],
    );
    const sources = await this.keywordRepository.manager.query<SimpleEntity[]>(
      `select distinct sources.id, sources.name ||' // ' || authors.name as name
        from keywords, idea_keywords , ideas, sources, authors 
        where keywords.id=$1 and idea_keywords.keyword_id=keywords.id and idea_keywords.idea_id=ideas.id
          and sources.id=source_id and authors.id=author_id
        order by sources.name ||' // ' || authors.name`,
      [id],
    );
    const ideas = await this.keywordRepository.manager.query<SimpleEntity[]>(
      `select distinct ideas.id, ideas.name || ' ['||sources.name ||' // ' || authors.name||']' as name
        from keywords, idea_keywords , ideas, sources, authors 
        where keywords.id=$1 and idea_keywords.keyword_id=keywords.id and idea_keywords.idea_id=ideas.id
          and sources.id=source_id and authors.id=author_id
        order by ideas.name || ' ['||sources.name ||' // ' || authors.name||']'`,
      [id],
    );*/
    //console.log('findOne userRole',userRole)
    switch (userRole) {
    case Role.Anonymous:
      //console.log('Role.Anonymous names=',mainRes.names)
      mainRes = { ...mainRes, 
        names: mainRes.names.filter(el=>el.verification_status === VerificationStatus.Moderated)}
      break;
    case Role.User:
      mainRes = { ...mainRes, 
        names: mainRes.names.filter(el=>el.user_id===user.id || el.verification_status === VerificationStatus.Moderated)}
      break;
    case Role.Admin:
      mainRes = { ...mainRes, 
        names: mainRes.names.filter(el=>[VerificationStatus.Moderated, VerificationStatus.ToModerate].includes(el.verification_status) )}
      break;
    }
    const default_name_index=mainRes.names.findIndex((el=>el.name===mainRes.name))
    let moderationList: KeywordModeration[] = [];
    if ([Role.Admin, Role.SuperAdmin].includes(userRole)) {
      const moderationRecords = await this.keywordModerationRepository.find(
        {
          select: ['id', 'user','date_time_create'],
          where: {keyword_id:id, 
             verification_status: VerificationStatus.ToModerate},
          relations:['user']
        }
      )
      moderationList = moderationRecords;
    }
    return { ...mainRes, default_name_index, moderations: moderationList/*, authors, sources, ideas */};
  }



  /* для суперадмина:
   - исправлять название можно как угодно
   - удалять названия можно лишь те, за которыми нет идей
   - добавлять названия нельзя
   Для админов
   - исправлять название можно для неотмодерированных
   - удалять названия можно лишь неотмодерированные
   - добавлять названия нельзя
   Для пользователей
   - исправлять название можно для неотмодерированных своих
   - удалять названия можно лишь неотмодерированные свои, за которыми нет идей
   - можно добавлять названия
  */ 
  async update(id: number, user: IUser, updateKeywordDto: UpdateKeywordDto) {
    //const recordOld=await this.moderatorService.checkDMLAccess<Keyword>(this.keywordRepository, id, user, ['names']); 
    const recordOld=await this.keywordRepository.findOne({where: {id}, relations:['names']})
    if (!recordOld)
      throwException(ExceptionType.NotFoundException,
        'Ключевое слово не найдено!');

    if (recordOld.user_id !== user.id 
      && recordOld.verification_status === VerificationStatus.Creating) {
      throwException(ExceptionType.UnauthorizedException,
        'У Вас нет прав на редактирование ключевого слова, добавляемого не Вами!');
    }

    if (updateKeywordDto.names && updateKeywordDto.names.length>0)
      this.keywordsValidationService.checkNamesUniqueness(updateKeywordDto.names.map(name => name.name));
    /*const newClassId = updateKeywordDto.class_keyword_id === undefined || updateKeywordDto.class_keyword_id === null ?
      recordOld.class_keyword_id : updateKeywordDto.class_keyword_id;*/
    if (user.role_id!==Role.User) 
      if (this.keywordsValidationService.isUpdateHaveNewSynonyms(recordOld,updateKeywordDto))
        throwException(ExceptionType.BadRequestException,
          'Добавлять новые синонимы может только обычный пользователь!');
    
    if (updateKeywordDto.names && updateKeywordDto.names.length>0) {
      switch(user.role_id) {
      case Role.SuperAdmin: 
        await this.keywordsValidationService.checkNamesDelete(user, recordOld, updateKeywordDto) // проверка на удаление любых
        break;
      case Role.Admin:
        await this.keywordsValidationService.checkNamesDelete(user, recordOld, updateKeywordDto, 
          new Set(['links', 'notModerated'])) // проверка на удаление неотмодерированных
        this.keywordsValidationService.checkUpdate(user, recordOld, updateKeywordDto, 
          new Set(['notModerated']))
        break;
      case Role.User: 
        await this.keywordsValidationService.checkNamesDelete(user, recordOld, updateKeywordDto, 
          new Set(['links', 'notModerated', 'own'])); // проверка на удаление неотмодерированных
        // проверить исправления
        this.keywordsValidationService.checkUpdate(user, recordOld, updateKeywordDto, 
          new Set(['notModerated', 'own']));
        break;
      }
    }
    //return recordOld;

    if (updateKeywordDto.names && updateKeywordDto.names.length>0) {
      await this.keywordsHelperService.updateAndDeleteKeywordNames(recordOld.names, updateKeywordDto.names);
      await this.keywordsHelperService.createNewKeywordNames(
          recordOld.names, updateKeywordDto.names, id, recordOld.class_keyword_id, user.id);
    }
    
    const { breadCrumbsStr, classNameBefore, classNameAfter } = await this.keywordsValidationService.getClassName(recordOld.class_keyword_id);

    let updateWithoutNames:Partial<UpdateKeywordDto> & {name?:string}=
      pick(updateKeywordDto, ['definition', 'class_keyword_id']);
    if (updateKeywordDto.default_name_index!==undefined 
      && updateKeywordDto.names
      && updateKeywordDto.names.length>0)
      updateWithoutNames={...updateWithoutNames,
        name: updateKeywordDto.names[updateKeywordDto.default_name_index].name}
    const res=await this.keywordRepository.update({id}, 
      {...updateWithoutNames, 
        bread_crumbs: breadCrumbsStr ? `[${breadCrumbsStr}]` : null,
        class_name_before: classNameBefore,
        class_name_after: classNameAfter
      });
    if (res.affected === 0)
      throwException(ExceptionType.NotFoundException,
        'Почему то не обновилось ключевое слово');

    return this.keywordRepository.findOne(
      { where: { id }, relations: ['names', 'user', 'moderator'] });
    
  }


  /* Для суперадмина
    - можно удалить в любом состоянии, главное, чтобы идеи не ссылались
    для админа:
    - можно удалить в состоянии на модерацию, и чтобы идеи не ссылались
    для пользователя
    - можно удалить свои в состоянии черновика, и чтобы идеи не ссылались
  */
  async remove(id: number, user: IUser) {
    const recordOld = await this.keywordRepository.findOne({where: {id}, relations:['names']})
    if (!recordOld)
      throwException(ExceptionType.NotFoundException,
        'Ключевое слово для удаления не найдено!');

    switch (user.role_id){
      case Role.SuperAdmin:
        await this.keywordsValidationService.checkDelete(user, recordOld, 
          new Set(['links']))
        break;
      case Role.Admin:
        await this.keywordsValidationService.checkDelete(user, recordOld, 
          new Set(['links', 'notModerated']))
        break;
      case Role.User:
        await this.keywordsValidationService.checkDelete(user, recordOld, 
          new Set(['links', 'notModerated', 'own']))
        break;
    }

    try {
      const res=await this.keywordRepository.delete({ id });
      if (res.affected === 0) {
        throwException(ExceptionType.NotFoundException,
           'Ключевое слово для удаления не найдено!');

      }
      else
        return {
          success: true,
          message: "Keyword deleted successfully",
          id: id
        };

    } catch (err) {
      let errMessage = err.message;
      if (err.code === '23503') {
        errMessage =
          'Нельзя удалять ключевое слово, которое закреплено за идеями: ';
        try {
          const result = await this.keywordRepository.manager.query<
            SimpleEntity[]
          >(
            `select i.id, i.name 
            from idea_keyword_names as ikn, keyword_names kn
            LEFT JOIN ideas as i on ik.idea_id=i.id
            where kn.keyword_id=$1 and ikn,keyword_name_id=kn.id
            limit 5`,
            [id],
          );
          errMessage += joinSimpleEntityFirst(result);
        } catch (find_err) {
          errMessage =
            errMessage +
            ' [не удалось найти список закрепленных за ключевым слово идей из-за ошибки: ' +
            find_err.message +
            ']';
        }
      }
      throwException(ExceptionType.BadRequestException,
        errMessage);
    }
  }

  async updateClassId(id: number, new_class_id?:string) {
    const newClassId= new_class_id? Number(new_class_id) :0;
    const { breadCrumbsStr, classNameBefore, classNameAfter } = await this.keywordsValidationService.getClassName(newClassId);     
    const res = await this.keywordRepository.update(id, {
      class_keyword_id:newClassId,
      class_name_after: classNameAfter,
      class_name_before: classNameBefore
    })
    
    // Рекурсивно пересчитываем class_name_after и class_name_before для всех нижележащих ключевых слов
    await this.keywordsHelperService.recalculateChildKeywordsClassNames(id);
  }

}
