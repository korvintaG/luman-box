import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindManyOptions, MoreThan } from 'typeorm';
import { Idea } from './entities/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import {IIdeaBySourceAndKeyword} from '../../types/custom'
import { isEmpty, omit }  from "lodash";
import {KeywordsService} from '../keywords/keywords.service'
import {IUser, Role} from '../../types/custom'
import { checkAccess } from '../../utils/utils'

 
@Injectable()
export class IdeasService {

  constructor(
    @InjectRepository(Idea)
    private readonly ideaRepository: Repository<Idea>,
    private keywordsService: KeywordsService

  ) {}

  async create(user:IUser,createIdeaDto: CreateIdeaDto) {
    let onlyIdea=omit(createIdeaDto, ["keywords", "date_time_create"]);
    if (onlyIdea.source && onlyIdea.source.id ===0) {
      onlyIdea=omit(onlyIdea, ["source"]);
    }
    let idea=this.ideaRepository.create(onlyIdea);
    if (createIdeaDto.keywords)
      if (createIdeaDto.keywords.length>0) {
        const keywords = await this.keywordsService.findByCond({ where: { id: In(createIdeaDto.keywords.map(el=>el.id)) }});
        idea.keywords = keywords;
      }
    return this.ideaRepository.save({...idea, user:{id:user.id}});
  }

  findAll(user:IUser) {
    //return this.ideaRepository.find( { relations: ['source.author', 'user'] , order: { name: "ASC" }});

    if (!user) // неавторизован, выводим все отмодерированное
      return this.ideaRepository.find( { where:{moderated:MoreThan(1)}, relations: ['source.author', 'user'] , order: { name: "ASC" }});
    else {
      if (user.role_id===Role.User) // простой пользователь - выводим отмодерированное и его
        return this.ideaRepository
          .createQueryBuilder('idea')
          .leftJoinAndSelect('idea.source', 'source')
          .leftJoinAndSelect('idea.user', 'user')
          .leftJoinAndSelect('source.author', 'author')
          .where('idea.moderated >0 ')
          .orWhere('idea.user_id = :user', { user: user.id})
          .orderBy('idea.name')
          .getMany();
      else // админ, выводим все
        return this.ideaRepository.find( { relations: ['source.author', 'user'] , order: { name: "ASC" }});
    }
  }

  async findBySrcKw(user:IUser, cond:IIdeaBySourceAndKeyword) {
    let founds:{id: number}[]=[];
    if (!user) // неавторизован, выводим все отмодерированное
      founds=await this.ideaRepository.manager.query<{id:number}[]>(
        `select ideas.id
        from ideas, idea_keywords as ik
        where ideas.source_id=$1 and ideas.moderated>0 and ik.idea_id=ideas.id and ik.keyword_id=$2`,[cond.source_id,cond.keyword_id]);
    else {
      if (user.role_id===Role.User) // простой пользователь - выводим отмодерированное и его
        founds=await this.ideaRepository.manager.query<{id:number}[]>(
          `select ideas.id
          from ideas, idea_keywords as ik
          where ideas.source_id=$1 and (ideas.moderated>0 or ideas.user_id=$2) and ik.idea_id=ideas.id and ik.keyword_id=$3`,[cond.source_id, user.id, cond.keyword_id]);
      else {// админ, выводим все
        founds=await this.ideaRepository.manager.query<{id:number}[]>(
          `select ideas.id
          from ideas, idea_keywords as ik
          where ideas.source_id=$1 and ik.idea_id=ideas.id and ik.keyword_id=$2`,[cond.source_id, cond.keyword_id]);
      }
    }
    return this.ideaRepository.find( { relations: ['source.author', 'user'] , where: { id: In(founds.map(el=>el.id))}, order: { name: "ASC" }});
  }

  async findBySourceKw(src:string, kw: string) {
     const founds=await this.ideaRepository.manager.query<{id:number}[]>(
        `select ideas.id
        from ideas, idea_keywords as ik
        where ideas.source_id=$1 and ik.idea_id=ideas.id and ik.keyword_id=$2`,[src,kw]);
      return this.findOne(founds[0].id);
  }

  findByCond(cond:FindManyOptions) {
    return this.ideaRepository.find( cond);
  }


  findOne(id: number) {
    return this.ideaRepository.findOne({where: {id}, relations: ['keywords', 'source.author', 'user']});
  }

  async update(id: number, user:IUser,updateIdeaDto: UpdateIdeaDto) {
    await checkAccess(this.ideaRepository,id, user.id);
    const onlyIdea=omit(updateIdeaDto, ["keywords"]);
    if (!isEmpty(onlyIdea)) {
        await this.ideaRepository.update({id}, onlyIdea);
    }
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['keywords'], 
    });
    if (updateIdeaDto.keywords && updateIdeaDto.keywords.length>0) {
        const keywords = await this.keywordsService.findByCond({ where: { id: In(updateIdeaDto.keywords.map(el=>el.id)) }});
        idea.keywords = keywords; 
        return this.ideaRepository.save(idea); 
    }
    return idea;
  }

  async moderate(id: number, user:IUser) {
    //await checkAccess(this.authorRepository,id, user.id);
    return this.ideaRepository.update({id}, {moderated: user.id});
  }


  async remove(id: number,user:IUser) {
    await checkAccess(this.ideaRepository,id, user.id);
    return  await this.ideaRepository.delete({ id });
  }
}
