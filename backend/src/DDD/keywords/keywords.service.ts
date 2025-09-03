import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { Repository, FindManyOptions, MoreThan } from 'typeorm';
import { Keyword } from './entities/keyword.entity';
import { IModerate, SimpleEntity } from '../../types/custom';
import { joinSimpleEntityFirst, checkAccess } from '../../utils/utils';
import { IUser, Role } from '../../types/custom';
import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import { ModeratorService } from '../../shared/services/moderator.service';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
    private moderatorService: ModeratorService,
  ) {}

  async create(user: IUser, createKeywordDto: CreateKeywordDto) {
    await this.moderatorService.checkDraftCount(
      this.keywordRepository,
      user,
      'Ключевое слово'
    );
    return this.keywordRepository.save({
      ...createKeywordDto,
      user: { id: user.id },
    });
  }

  findAll(user: IUser) {
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
  }

  findByCond(cond: FindManyOptions) {
    return this.keywordRepository.find(cond);
  }

  async findOne(id: number) {
    const authors = await this.keywordRepository.manager.query<SimpleEntity[]>(
      `select distinct authors.id, authors.name
        from keywords, idea_keywords , ideas, sources, authors 
        where keywords.id=$1 and idea_keywords.keyword_id=keywords.id and idea_keywords.idea_id=ideas.id
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
    );
    //const mainRes= await this.keywordRepository.findOne({where: { id }, relations: { user: true, moderator: true }});
    const mainRes = await this.keywordRepository
      .createQueryBuilder('keyword')
      .select([
        'keyword',
        'user.id',
        'user.name',
        'moderator.id',
        'moderator.name',
      ]) // Выбираем только нужные поля
      .leftJoin('keyword.user', 'user')
      .leftJoin('keyword.moderator', 'moderator')
      .where('keyword.id = :id', { id })
      .getOne();

    return { ...mainRes, authors, sources, ideas };
  }

  async update(id: number, user: IUser, updateKeywordDto: UpdateKeywordDto) {
    await checkAccess(this.keywordRepository, id, user);
    return await this.keywordRepository.update({ id }, updateKeywordDto);
  }

  async toModerate(id: number, user: IUser, isCascade: boolean = false) {
    return this.moderatorService.toModerateEntity(
      this.keywordRepository,
      id,
      user,
      process.env.ROUTE_KEYWORD_DETAIL,
      'Ключевое слово',
      isCascade
    );
  }


  async moderate(id: number, user: IUser, moderationResult: IModerate) {
    return this.moderatorService.moderateEntity(
      this.keywordRepository,
      id,
      user,
      moderationResult,
      'Ключевое слово'
    );
  }

  async remove(id: number, user: IUser) {
    await checkAccess(this.keywordRepository, id, user);
    try {
      return await this.keywordRepository.delete({ id });
    } catch (err) {
      let errMessage = err.message;
      if (err.code === '23503') {
        errMessage =
          'Нельзя удалять ключевое слово, которое закреплено за идеями: ';
        try {
          const result = await this.keywordRepository.manager.query<
            SimpleEntity[]
          >(
            `select i.id, i.name from idea_keywords as ik
            LEFT JOIN ideas as i on ik.idea_id=i.id
            where keyword_id=$1
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
      throw new HttpException(
        {
          message: errMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
