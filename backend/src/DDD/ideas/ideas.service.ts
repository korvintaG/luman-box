import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindManyOptions } from 'typeorm';
import { Idea } from './entities/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
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
