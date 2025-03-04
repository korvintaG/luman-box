import { Repository, FindManyOptions, MoreThan } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';
import { IdeasService } from '../ideas/ideas.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { joinSimpleEntityFirst, checkAccess } from '../../utils/utils';
import { SimpleEntityWithCnt } from '../../types/custom';
import { IUser, Role } from '../../types/custom';

@Injectable()
export class SourcesService {
  constructor(
    @InjectRepository(Source)
    private readonly sourceRepository: Repository<Source>,
    private ideasService: IdeasService,
  ) {}

  create(user: IUser, createSourceDto: CreateSourceDto) {
    return this.sourceRepository.save({
      ...createSourceDto,
      user: { id: user.id },
    });
  }

  findAll(user: IUser) {
    if (!user)
      // неавторизован, выводим все отмодерированное
      return this.sourceRepository.find({
        relations: { author: true },
        where: { moderated: MoreThan(1) },
        order: { name: 'ASC' },
      });
    else {
      if (user.role_id === Role.User)
        // простой пользователь - выводим отмодерированное и его
        return this.sourceRepository
          .createQueryBuilder('source')
          .leftJoinAndSelect('source.author', 'author')
          .where('source.moderated >0 ')
          .orWhere('source.user_id = :user', { user: user.id })
          .orderBy('source.name')
          .getMany();
      // админ, выводим все
      else
        return this.sourceRepository.find({
          relations: { author: true },
          order: { name: 'ASC' },
        });
    }
  }

  findByCond(cond: FindManyOptions) {
    return this.sourceRepository.find(cond);
  }

  async findOne(id: number) {
    const mainRes = await this.sourceRepository
      .createQueryBuilder('source')
      .leftJoinAndSelect('source.ideas', 'idea')
      .leftJoinAndSelect('source.user', 'user')
      .leftJoinAndSelect('source.moderator', 'moderator')
      .leftJoinAndSelect('source.author', 'author')
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
      .where('source.id = :id', { id })
      .getOne();
    const kw = await this.sourceRepository.manager.query<SimpleEntityWithCnt[]>(
      `select keywords.name, keywords.id, count(ideas.*)::integer as cnt from ideas, idea_keywords as ik, keywords
        where ideas.source_id=$1 and ik.idea_id=ideas.id and keywords.id=ik.keyword_id
        group by keywords.name, keywords.id
        order by keywords.name`,
      [id],
    );
    return { ...mainRes, keywords: kw };
  }

  async update(id: number, user: IUser, updateSourceDto: UpdateSourceDto) {
    await checkAccess(this.sourceRepository, id, user);
    return await this.sourceRepository.update({ id }, updateSourceDto);
  }

  async moderate(id: number, user: IUser) {
    //await checkAccess(this.authorRepository,id, user.id);
    return this.sourceRepository.update({ id }, { moderated: user.id });
  }

  async remove(id: number, user: IUser) {
    await checkAccess(this.sourceRepository, id, user);
    try {
      return await this.sourceRepository.delete({ id });
    } catch (err) {
      let errMessage = err.message;
      if (err.code === '23503') {
        errMessage = 'Нельзя удалять источник, по которому есть идеи: ';
        try {
          const res = await this.ideasService.findByCond({
            select: { id: true, name: true },
            where: { source: { id } },
            take: 5,
          });
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
      throw new HttpException(
        {
          message: errMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
