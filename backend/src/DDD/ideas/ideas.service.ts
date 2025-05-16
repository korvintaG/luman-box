import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindManyOptions, MoreThan } from 'typeorm';
import { Idea } from './entities/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { IIdeaBySourceAndKeyword, IdeaForList } from '../../types/custom';
import { isEmpty, omit } from 'lodash';
import { KeywordsService } from '../keywords/keywords.service';
import { IUser, Role } from '../../types/custom';
import { checkAccess } from '../../utils/utils';
import { AttitudesService } from '../attitudes/attitudes.service';
import { InterconnectionsService } from '../interconnections/interconnections.service';

@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea)
    private readonly ideaRepository: Repository<Idea>,
    private keywordsService: KeywordsService,
    private attitudesService: AttitudesService,
    private interconnectionsService: InterconnectionsService
  ) {}

  async create(user: IUser, createIdeaDto: CreateIdeaDto) {
    let onlyIdea = omit(createIdeaDto, ['keywords', 'date_time_create']);
    if (onlyIdea.source && onlyIdea.source.id === 0) {
      onlyIdea = omit(onlyIdea, ['source']);
    }
    let idea = this.ideaRepository.create(onlyIdea);
    if (createIdeaDto.keywords)
      if (createIdeaDto.keywords.length > 0) {
        const keywords = await this.keywordsService.findByCond({
          where: { id: In(createIdeaDto.keywords.map((el) => el.id)) },
        });
        idea.keywords = keywords;
      }
    return this.ideaRepository.save({ ...idea, user: { id: user.id } });
  }

  findAll(user: IUser) {
    if (!user)
      // неавторизован, выводим все отмодерированное
      return this.ideaRepository.find({
        where: { moderated: MoreThan(1) },
        relations: ['source.author', 'user'],
        order: { name: 'ASC' },
      });
    else {
      if (user.role_id === Role.User)
        // простой пользователь - выводим отмодерированное и его
        return this.ideaRepository
          .createQueryBuilder('idea')
          .leftJoinAndSelect('idea.source', 'source')
          .leftJoinAndSelect('idea.user', 'user')
          .leftJoinAndSelect('source.author', 'author')
          .where('idea.moderated >0 ')
          .orWhere('idea.user_id = :user', { user: user.id })
          .orderBy('idea.name')
          .getMany(); // админ, выводим все
      else
        return this.ideaRepository.find({
          relations: ['source.author', 'user'],
          order: { name: 'ASC' },
        });
    }
  }

  async findBySrcKw(user: IUser, cond: IIdeaBySourceAndKeyword) {
    let founds: { id: number }[] = [];
    if (!user)
      // неавторизован, выводим все отмодерированное
      founds = await this.ideaRepository.manager.query<{ id: number }[]>(
        `select ideas.id
        from ideas, idea_keywords as ik
        where ideas.source_id=$1 and ideas.moderated>0 and ik.idea_id=ideas.id and ik.keyword_id=$2`,
        [cond.source_id, cond.keyword_id],
      );
    else {
      if (user.role_id === Role.User)
        // простой пользователь - выводим отмодерированное и его
        founds = await this.ideaRepository.manager.query<{ id: number }[]>(
          `select ideas.id
          from ideas, idea_keywords as ik
          where ideas.source_id=$1 and (ideas.moderated>0 or ideas.user_id=$2) and ik.idea_id=ideas.id and ik.keyword_id=$3`,
          [cond.source_id, user.id, cond.keyword_id],
        );
      else {
        // админ, выводим все
        founds = await this.ideaRepository.manager.query<{ id: number }[]>(
          `select ideas.id
          from ideas, idea_keywords as ik
          where ideas.source_id=$1 and ik.idea_id=ideas.id and ik.keyword_id=$2`,
          [cond.source_id, cond.keyword_id],
        );
      }
    }
    return this.ideaRepository.find({
      relations: ['source.author', 'user'],
      where: { id: In(founds.map((el) => el.id)) },
      order: { name: 'ASC' },
    });
  }

  async findBySourceKw(src: string, kw: string, user:IUser) {
    const founds = await this.ideaRepository.manager.query<{ id: number }[]>(
      `select ideas.id
        from ideas, idea_keywords as ik
        where ideas.source_id=$1 and ik.idea_id=ideas.id and ik.keyword_id=$2`,
      [src, kw],
    );
    return this.findOne(founds[0].id,user);
  }

  findByCond(cond: FindManyOptions) {
    return this.ideaRepository.find(cond);
  }

  async findForList(id: number, user:IUser) {
    const idea=await this.ideaRepository.manager.query<IdeaForList[]>(    
      `select ideas.id, ideas.name, sources.name || ' // ' || authors.name as source_name, source_id
      from ideas, sources, authors
      where ideas.id=${id} and sources.id=ideas.source_id and authors.id=sources.author_id`);
    if (isEmpty(idea[0]))
      throw new  NotFoundException(`Идеи с ID=${id} не найдено!`);
    else
      return {...idea[0]}
  }


  async findOne(id: number, user:IUser) {
    let found=await this.ideaRepository
      .createQueryBuilder('idea')
      .leftJoinAndSelect('idea.keywords', 'keywords')
      .leftJoinAndSelect('idea.source', 'source')
      .leftJoinAndSelect('source.author', 'author')
      .leftJoinAndSelect('idea.user', 'user')
      .leftJoinAndSelect('idea.moderator', 'moderator')
      .select([
        'idea',
        'source',
        'author',
        'keywords',
        'user.id',
        'user.name',
        'moderator.id',
        'moderator.name',
      ]) // Выбираем только нужные поля
      .where('idea.id = :id', { id })
      .getOne();
    if (found.moderator) {
       const attitudes=await this.attitudesService.findOne(id,user);
       const interconnections=await this.interconnectionsService.countAllByIdea(id);
       return {...found,attitudes,interconnections}
    }
    return found
  }

  async update(id: number, user: IUser, updateIdeaDto: UpdateIdeaDto) {
    await checkAccess(this.ideaRepository, id, user);
    const onlyIdea = omit(updateIdeaDto, ['keywords']);
    if (!isEmpty(onlyIdea)) {
      await this.ideaRepository.update({ id }, onlyIdea);
    }
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['keywords'],
    });
    if (updateIdeaDto.keywords && updateIdeaDto.keywords.length > 0) {
      const keywords = await this.keywordsService.findByCond({
        where: { id: In(updateIdeaDto.keywords.map((el) => el.id)) },
      });
      idea.keywords = keywords;
      return this.ideaRepository.save(idea);
    }
    return idea;
  }

  async moderate(id: number, user: IUser) {
    //await checkAccess(this.authorRepository,id, user.id);
    return this.ideaRepository.update({ id }, { moderated: user.id });
  }

  async remove(id: number, user: IUser) {
    await checkAccess(this.ideaRepository, id, user);
    return await this.ideaRepository.delete({ id });
  }
}
