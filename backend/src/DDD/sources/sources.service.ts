import { Repository, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { Injectable, Inject, forwardRef, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';
import { IdeasService } from '../ideas/ideas.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { joinSimpleEntityFirst } from '../../utils/utils';
import { SimpleEntityWithCnt, SimpleEntity, IModerate } from '../../types/custom';
import { IUser, Role } from '../../types/custom';
import { FilesService } from 'src/files/files.service';
import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import { ModeratorService } from '../../shared/services/moderator/moderator.service';
import { AuthorsService } from '../authors/authors.service';

@Injectable()
export class SourcesService {
  constructor(
    @InjectRepository(Source)
    private readonly sourceRepository: Repository<Source>,
    private ideasService: IdeasService,
    @Inject(forwardRef(() => AuthorsService))
    private authorsService: AuthorsService,
    private filesService: FilesService,
    private moderatorService: ModeratorService,
  ) { }

  async create(user: IUser, createSourceDto: CreateSourceDto) {
    await this.moderatorService.checkDraftCount(
      this.sourceRepository,
      user,
      'Источник'
    );
    const update_image_URL=await this.filesService.createRecordImage(createSourceDto.image_URL, 'source_from_');
    return this.sourceRepository.save({
      ...createSourceDto,
      image_URL: update_image_URL,
      user: { id: user.id },
    });
  }

  findAll(user: IUser) {
    if (!user)
      // неавторизован, выводим все отмодерированное
      return this.sourceRepository.find({
        select: {
          id: true,
          name: true,
          verification_status: true,
          author: {
            id: true,
            name: true
          }
        },
        relations: { author: true },
        where: { verification_status: VerificationStatus.Moderated },
        order: { name: 'ASC' },
      });
    else {
      if (user.role_id === Role.User)
        // простой пользователь - выводим отмодерированное и его
        return this.sourceRepository
          .createQueryBuilder('source')
          .select([
            'source.id',
            'source.name',
            'source.verification_status',
            'author.id',
            'author.name'
          ])
          .leftJoin('source.author', 'author')
          .where('source.verification_status = :moderated', { moderated: VerificationStatus.Moderated })
          .orWhere('source.user_id = :user', { user: user.id })
          .orderBy('source.name')
          .getMany();
      // админ, выводим все
      else
        return this.sourceRepository.find({
          select: {
            id: true,
            name: true,
            verification_status: true,
            author: {
              id: true,
              name: true
            }
          },
          relations: { author: true },
          order: { name: 'ASC' },
        });
    }
  }

  findByCond(cond: FindOptionsWhere<Source>, take: number = 100) {
    return this.sourceRepository.find({
      where: cond,
      relations: { author: true },
      order: { name: 'ASC' },
      take: take,
    });
  }

  async findOne(id: number, user: IUser) {
    const mainRes = await this.sourceRepository
      .createQueryBuilder('source')
      .select([
        'source',
        'idea.id',
        'idea.name',
        'user.id',
        'user.name',
        'author.id',
        'author.name',
        'moderator.id',
        'moderator.name',
      ]) // Выбираем только нужные поля
      .leftJoin('source.ideas', 'idea')
      .leftJoin('source.user', 'user')
      .leftJoin('source.moderator', 'moderator')
      .leftJoin('source.author', 'author')
      .where('source.id = :id', { id })
      .getOne();
    await this.moderatorService.checkGetRecordAccess(mainRes, user);
    const keywords = await this.sourceRepository.manager.query<SimpleEntityWithCnt[]>(
      `select keywords.name, keywords.id, count(ideas.*)::integer as cnt 
        from ideas, idea_keyword_names as ikn, keyword_names as kn, keywords
        where 
          ideas.source_id=$1 
          and ikn.idea_id=ideas.id 
          and keywords.id=kn.keyword_id 
          and ikn.keyword_name_id=kn.id
        group by keywords.name, keywords.id
        order by keywords.name`,
      [id],
    );
    const ideas = await this.sourceRepository.manager.query<SimpleEntity[]>(
      `select distinct ideas.id, ideas.name 
        from ideas
        where source_id=$1
        order by ideas.name`,
      [id],
    );

    return { ...mainRes, keywords, ideas };
  }

  async update(id: number, user: IUser, updateSourceDto: UpdateSourceDto) {
    const recordOld = await this.moderatorService.checkDMLAccess(this.sourceRepository, id, user);
    const old_image_URL = recordOld.image_URL;
    const new_image_URL: string | undefined = updateSourceDto.image_URL;
    const update_image_URL = await this.filesService.updateRecordImage(
      old_image_URL,
      new_image_URL,
      'source_from_',
    );

    const res = await this.sourceRepository.update({ id },
      { ...updateSourceDto, image_URL: update_image_URL }
    );
    if (res.affected === 0) {
      throw new NotFoundException({
        error: 'NotFound',
        message: 'Не найден источник'
      });
    }
    else {
      return this.sourceRepository.findOne({ where: { id } });
    }
  }

  async toModerate(id: number, user: IUser, isCascade: boolean = false) {
    const author = await this.sourceRepository.manager.query<
      { id: number, verification_status: VerificationStatus }[]>
      (`select 
          authors.id, 
          authors.verification_status 
        from authors, sources 
        where sources.id=$1 and sources.author_id=authors.id`, [id]);
    if (!author || author.length === 0) {
      throw new NotFoundException({
        error: 'NotFound',
        message: 'Не найден автор источника'
      });
    }
    if (author[0].verification_status === VerificationStatus.Creating) {
      await this.authorsService.toModerate(author[0].id, user, true);
    }
    return this.moderatorService.toModerateEntity(
      this.sourceRepository,
      id,
      user,
      process.env.ROUTE_SOURCE_DETAIL,
      'Источник',
      isCascade
    );
  }

  async moderate(id: number, user: IUser, moderationResult: IModerate) {
    if (moderationResult.action === 'approve') { // если одобряем источник, то проверяем, одобрен ли автор?
      const author = await this.sourceRepository.manager.query<
        { id: number, verification_status: VerificationStatus }[]>
        (`select 
            authors.id, 
            authors.verification_status 
          from authors, sources 
          where sources.id=$1 and sources.author_id=authors.id`, [id]);
      if (!author || author.length === 0) 
        throw new NotFoundException({
          error: 'NotFound',
          message: 'Не найден автор источника'
        });
      if (author && author.length > 0 && author[0].verification_status !== VerificationStatus.Moderated) 
        throw new BadRequestException({
          error: 'Bad Request',
          message: `Не одобрен автор источника. Чтобы одобрить, перейдите по ссылке: ${process.env.FRONTEND_URL}${process.env.ROUTE_AUTHOR_DETAIL}/${author[0].id}`
        });
    }
    return this.moderatorService.moderateEntity(
      this.sourceRepository,
      id,
      user,
      moderationResult,
      'Источник'
    );
  }

  async getImageURL(id: number): Promise<string | null> {
    try {
      const imageURL = await this.sourceRepository.manager.query<{ image_URL: (string | null) }[]>(
        `select "image_URL"
        from sources
        where id=$1`,
        [id],
      );
      return imageURL[0].image_URL;
    } catch {
      return null;
    }
  }


  async remove(id: number, user: IUser) {
    const recordOld = await this.moderatorService.checkDMLAccess(this.sourceRepository, id, user);
    try { 
      const res = await this.sourceRepository.delete({ id });
      if (res.affected === 0) {
        throw new NotFoundException({
          error: 'NotFound',
          message: 'Источник не найден'
        });
      }
      else {
        if (recordOld.image_URL) {
          await this.filesService.deleteImage(recordOld.image_URL);
        }
        return {
          success: true,
          message: "Source deleted successfully",
          id: id
        };
      }
    } catch (err) {
      let errMessage = err.message;
      if (err.code === '23503') {
        errMessage = 'Нельзя удалять источник, по которому есть идеи: ';
        try {
          const res = await this.ideasService.findByCond(
            //select: { id: true, name: true },
            { source: { id } }
            //take: 5,
          );
          errMessage += joinSimpleEntityFirst(
            res.map((el) => ({ id: el.id, name: el.name })),
          );
        } catch (find_err) {
          errMessage =
            errMessage +
            ' [не удалось найти список закрепленных за источником идей из-за ошибки: ' +
            find_err.message +
            ']';
        }
      }
      throw new BadRequestException({
        error: 'Bad Request',
        message: errMessage
      });
    }
  }
}
