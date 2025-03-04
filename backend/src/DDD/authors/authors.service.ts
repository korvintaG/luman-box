import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Author } from './entities/author.entity';
import { SourcesService } from '../sources/sources.service';
import { joinSimpleEntityFirst, checkAccess } from '../../utils/utils';
import { IModerate, IUser, Role } from '../../types/custom';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    private sourcesService: SourcesService,
  ) {}

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
          .getMany(); // админ, выводим все
      else return this.authorRepository.find({ order: { name: 'ASC' } });
    }
  }

  findOne(id: number) {
    //return this.authorRepository.findOne({where: { id }, relations: ['user','sources']});
    return this.authorRepository
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
  }

  async update(id: number, user: IUser, updateAuthorDto: UpdateAuthorDto) {
    await checkAccess(this.authorRepository, id, user);
    return this.authorRepository.update({ id }, updateAuthorDto);
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
