import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Author } from './entities/author.entity';
import { SourcesService } from '../sources/sources.service';
import {
  joinSimpleEntityFirst,
  checkAccess,
  safeRename,
} from '../../utils/utils';
import { IModerate, IUser, Role, SimpleEntity } from '../../types/custom';
import { basename, join } from 'path';
import { rename, unlink } from 'fs/promises';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    private sourcesService: SourcesService,
    private filesService: FilesService,
  ) { }

  create(user: IUser, createAuthorDto: CreateAuthorDto) {
    return this.authorRepository.save({
      ...createAuthorDto,
      user: { id: user.id },
    });
  }

  async findAll(user: IUser) {
    if (!user)
      // неавторизован, выводим все отмодерированное
      return this.authorRepository.find({
        where: { moderated: MoreThan(1) },
        order: { name: 'ASC' },
      });
    else {
      if (user.role_id === Role.User)
        // простой пользователь - выводим отмодерированное и его
        return this.authorRepository
          .createQueryBuilder('author')
          .where('author.moderated >0 ')
          .orWhere('author.user_id = :user', { user: user.id })
          .orderBy('name')
          .getMany();
      // админ, выводим все
      else return this.authorRepository.find({ order: { name: 'ASC' } });
    }
  }

  async findOne(id: number) {
    const author = await this.authorRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.sources', 'source')
      .leftJoinAndSelect('author.user', 'user')
      .leftJoinAndSelect('author.moderator', 'moderator')
      .select([
        'author',
        'source.id',
        'source.name',
        'user.id',
        'user.name',
        'moderator.id',
        'moderator.name',
      ]) // Выбираем только нужные поля
      .where('author.id = :id', { id })
      .getOne();
    const sources = await this.authorRepository.manager.query<SimpleEntity[]>(
      `select distinct sources.id, sources.name 
        from sources
        where sources.author_id=$1
        order by sources.name`,
      [id],
    );
    const ideas = await this.authorRepository.manager.query<SimpleEntity[]>(
      `select distinct ideas.id, ideas.name 
        from ideas, sources
        where sources.id=source_id and author_id=$1
        order by ideas.name`,
      [id],
    );
    const keywords = await this.authorRepository.manager.query<SimpleEntity[]>(
      `select distinct keywords.id, keywords.name
        from keywords, idea_keywords , ideas, sources
        where idea_keywords.keyword_id=keywords.id and idea_keywords.idea_id=ideas.id
          and sources.id=source_id and author_id=$1
        order by keywords.name`,
      [id],
    );

    return { ...author, sources, ideas, keywords };
  }

  async getImageURL(id: number): Promise<string | null> {
    try {
      const imageURL = await this.authorRepository.manager.query<{image_URL:(string | null)}[]>(
        `select "image_URL"
        from authors
        where id=$1`,
        [id],
      );
      //console.log('getImageURL',imageURL)
      return imageURL[0].image_URL;
    } catch {
      return null;
    }
  }

  async update(id: number, user: IUser, updateAuthorDto: UpdateAuthorDto) {
    await checkAccess(this.authorRepository, id, user);
    const old_image_URL = await this.getImageURL(id); 
    const new_image_URL: string | undefined = updateAuthorDto.image_URL;
    const update_image_URL = await this.filesService.updateRecordImage(
      old_image_URL,
      new_image_URL,
      'author_from_',
    );
    return this.authorRepository.update(
      { id },
      { ...updateAuthorDto, image_URL: update_image_URL },
    );
  }

  async moderate(id: number, user: IUser, { action }: IModerate) {
    //await checkAccess(this.authorRepository,id, user.id);
    if (action === 'approve')
      return this.authorRepository.update({ id }, { moderated: user.id });
    else return this.authorRepository.update({ id }, { moderated: -1 });
  }

  async remove(id: number, user: IUser) {
    await checkAccess(this.authorRepository, id, user);
    try {
      return await this.authorRepository.delete({ id });
    } catch (err) {
      let errMessage = err.message;
      if (err.code === '23503') {
        errMessage =
          'Нельзя удалять автора, который закреплен за источниками: ';
        try {
          const res = await this.sourcesService.findByCond({
            where: { author: { id } },
            take: 5,
          });
          errMessage += joinSimpleEntityFirst(
            res.map((el) => ({ id: el.id, name: el.name })),
          );
        } catch (find_err) {
          errMessage =
            errMessage +
            ' [не удалось найти список закрепленных за автором источников из-за ошибки: ' +
            find_err.message +
            ']';
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
}
