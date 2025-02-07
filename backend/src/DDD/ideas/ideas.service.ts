import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindManyOptions } from 'typeorm';
import { Idea } from './entities/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import {IIdeaBySourceAndKeyword} from '../../types/custom'
import { isEmpty, omit }  from "lodash";
import {KeywordsService} from '../keywords/keywords.service'
import {IUser} from '../../types/custom'
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

  findAll() {
    return this.ideaRepository.find( { relations: ['source.author', 'user'] , order: { name: "ASC" }});
  }

  async findBySrcKw(cond:IIdeaBySourceAndKeyword) {
    const founds=await this.ideaRepository.manager.query<{id:number}[]>(
      `select ideas.id
      from ideas, idea_keywords as ik
      where ideas.source_id=$1 and ik.idea_id=ideas.id and ik.keyword_id=$2`,[cond.source_id,cond.keyword_id]);
    return this.ideaRepository.find( { relations: ['source.author', 'user'] , where: { id: In(founds.map(el=>el.id))}, order: { name: "ASC" }});
  }

  async findBySourceKw(src:string, kw: string) {
     const founds=await this.ideaRepository.manager.query<{id:number}[]>(
        `select ideas.id
        from ideas, idea_keywords as ik
        where ideas.source_id=$1 and ik.idea_id=ideas.id and ik.keyword_id=$2`,[src,kw]);
      return founds[0];
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

  async remove(id: number,user:IUser) {
    await checkAccess(this.ideaRepository,id, user.id);
    return  await this.ideaRepository.delete({ id });
  }
}
