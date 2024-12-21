import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Idea } from './entities/idea.entity';
import { Keyword } from '../keywords/entities/keyword.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { omit, assign }  from "lodash";

@Injectable()
export class IdeasService {

  constructor(
    @InjectRepository(Idea)
    private readonly ideaRepository: Repository<Idea>,
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,

  ) {}

  async create(createIdeaDto: CreateIdeaDto) {
    const onlyIdea=omit(createIdeaDto, ["keywords"]);
    let idea=this.ideaRepository.create(onlyIdea);
    if (createIdeaDto.keywords)
      if (createIdeaDto.keywords.length>0) {
        const keywords = await this.keywordRepository.find({ where: { id: In(createIdeaDto.keywords) }});
        idea.keywords = keywords;
      }
    return this.ideaRepository.save(idea);
  }

  findAll() {
    return this.ideaRepository.find( { relations: { keywords: true }, order: { name: "ASC" }});
  }

  findOne(id: number) {
    return this.ideaRepository.findOneBy({ id });
  }

  async update(id: number, updateIdeaDto: UpdateIdeaDto) {
    const onlyIdea=omit(updateIdeaDto, ["keywords"]);
    if (updateIdeaDto.keywords)
      if (updateIdeaDto.keywords.length>0) {
        const keywords = await this.keywordRepository.find({ where: { id: In(updateIdeaDto.keywords) }});
        assign(onlyIdea,{'keywords': keywords});
      }
    console.log('update',onlyIdea);
    return this.ideaRepository.update({id}, onlyIdea);
  }

  remove(id: number) {
    return this.ideaRepository.delete({ id });
  }
}
