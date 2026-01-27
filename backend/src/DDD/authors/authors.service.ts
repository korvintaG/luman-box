import { Injectable, Inject, forwardRef, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { SourcesService } from '../sources/sources.service';
import { joinSimpleEntityFirst, throwException } from '../../utils/utils';
import { ExceptionType, IModerate, IUser, Role, SimpleEntity } from '../../types/custom';
import { FilesService } from 'src/files/files.service';
import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import { ModeratorService } from '../../shared/services/moderator/moderator.service';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @Inject(forwardRef(() => SourcesService))
    private sourcesService: SourcesService,
    private filesService: FilesService,
    private moderatorService: ModeratorService,
  ) { }

  async create(user: IUser, createAuthorDto: CreateAuthorDto) {
    await this.moderatorService.checkDraftCount(
      this.authorRepository,
      user,
      'Автор'
    );
    const update_image_URL=await this.filesService.createRecordImage(createAuthorDto.image_URL, 'author_from_');
    return this.authorRepository.save({
      ...createAuthorDto,
      image_URL: update_image_URL,
      user: { id: user.id },
    });
  }

  async findByCond(whereCond: FindOptionsWhere<Author>) {
      return this.authorRepository.find({
        where: { ...whereCond },
        order: { name: 'ASC' },
      });
  }


  async findAll(user: IUser) {
    if (!user)
      // неавторизован, выводим все отмодерированное
      return this.authorRepository.find({
        select: ['id', 'name', 'birth_date', 'verification_status'],
        where: { verification_status: VerificationStatus.Moderated },
        order: { name: 'ASC' },
      });
    else {
      if (user.role_id === Role.User)
        // простой пользователь - выводим отмодерированное и его
        return this.authorRepository
          .createQueryBuilder('author')
          .select(['author.id', 'author.name', 'author.birth_date', 'author.verification_status'])
          .where('author.verification_status = :moderated', { moderated: VerificationStatus.Moderated })
          .orWhere('author.user_id = :user', { user: user.id })
          .orderBy('name')
          .getMany();
      // админ, выводим все
      else return this.authorRepository.find({
        select: ['id', 'name', 'birth_date', 'verification_status'],
         order: { name: 'ASC' } });
    }
  }

  async findOne(id: number, user: IUser) {
    const author = await this.authorRepository
      .createQueryBuilder('author')
      .select([
        'author',
        'source.id',
        'source.name',
        'user.id',
        'user.name',
        'moderator.id',
        'moderator.name',
      ]) // Выбираем только нужные поля
      .leftJoin('author.sources', 'source')
      .leftJoin('author.user', 'user')
      .leftJoin('author.moderator', 'moderator')
      .where('author.id = :id', { id })
      .getOne();
    if (!author)
      throwException(ExceptionType.NotFoundException, 'Автор не найден');
    await this.moderatorService.checkGetRecordAccess(author, user);
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
        from keywords, idea_keyword_names , ideas, sources, keyword_names
        where idea_keyword_names.keyword_name_id=keyword_names.id 
          and keyword_names.keyword_id=keywords.id 
          and idea_keyword_names.idea_id=ideas.id
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
    const recordOld = await this.moderatorService.checkDMLAccess(this.authorRepository, id, user);
    const old_image_URL = recordOld.image_URL; 
    const new_image_URL: string | undefined = updateAuthorDto.image_URL;
    const update_image_URL = await this.filesService.updateRecordImage(
      old_image_URL,
      new_image_URL,
      'author_from_',
    );
    const res = await this.authorRepository.update(
      { id },
      { ...updateAuthorDto, image_URL: update_image_URL },
    );
    if (res.affected === 0) 
      throw new NotFoundException(
        {
          error: 'NotFound',
          message: 'Автор не найден',
        },
      );
    else {
      return this.authorRepository.findOne({ where: { id } });
    }
  }

  async toModerate(id: number, user: IUser, isCascade: boolean = false) {
    return this.moderatorService.toModerateEntity(
      this.authorRepository,
      id,
      user,
      process.env.ROUTE_AUTHOR_DETAIL,
      'Автор',
      isCascade
    );
  }

  async moderate(id: number, user: IUser, moderationResult: IModerate) {
    return this.moderatorService.moderateEntity(
      this.authorRepository,
      id,
      user,
      moderationResult,
      'Автор'
    );
  }

  async remove(id: number, user: IUser) {
    const recordOld = await this.moderatorService.checkDMLAccess(this.authorRepository, id, user);
    try {
      //const author = await this.authorRepository.findOne({ where: { id } });
      const res = await this.authorRepository.delete({ id });
      if (res.affected === 0)
        throwException(ExceptionType.NotFoundException, 'Автор не найден');
      else {
          if (recordOld.image_URL) {
            await this.filesService.deleteImage(recordOld.image_URL);
          }
          return {
          success: true,
          message: "Author deleted successfully",
          id: id
        };
      }
    } catch (err) {
      let errMessage = err.message;
      if (err.code === '23503') {
        errMessage =
          'Нельзя удалять автора, который закреплен за источниками: ';
        try {
          const res = await this.sourcesService.findByCond(
            { author: { id } },
            // take: 5,
          );
          //console.log('remove res',res);
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

        throwException(ExceptionType.BadRequestException, errMessage);
      }
    }
  }
}
