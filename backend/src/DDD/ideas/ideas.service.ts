import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindManyOptions } from 'typeorm';
import { Idea } from './entities/idea.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { isEmpty, omit }  from "lodash";
import {KeywordsService} from '../keywords/keywords.service'


@Injectable()
export class IdeasService {

  constructor(
    @InjectRepository(Idea)
    private readonly ideaRepository: Repository<Idea>,
    private keywordsService: KeywordsService

  ) {}

  async create(createIdeaDto: CreateIdeaDto) {
    const onlyIdea=omit(createIdeaDto, ["keywords", "date_time_create"]);
    let idea=this.ideaRepository.create(onlyIdea);
    if (createIdeaDto.keywords)
      if (createIdeaDto.keywords.length>0) {
        const keywords = await this.keywordsService.findByCond({ where: { id: In(createIdeaDto.keywords.map(el=>el.id)) }});
        idea.keywords = keywords;
      }
    return this.ideaRepository.save(idea);
  }

  findAll() {
    return this.ideaRepository.find( { relations: ['source.author'] , order: { name: "ASC" }});
  }

  findByCond(cond:FindManyOptions) {
    return this.ideaRepository.find( cond);
  }


  findOne(id: number) {
    return this.ideaRepository.findOne({where: {id}, relations: ['keywords', 'source.author']});
  }

  async update(id: number, updateIdeaDto: UpdateIdeaDto) {
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

  remove(id: number) {
    return this.ideaRepository.delete({ id });
  }
}
