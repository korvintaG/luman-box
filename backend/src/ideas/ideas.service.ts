import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Idea } from './entities/idea.entity';
import { Keyword } from '../keywords/entities/keyword.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { isEmpty, omit }  from "lodash";


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
    if (!isEmpty(onlyIdea)) {
        await this.ideaRepository.update({id}, onlyIdea);
    }
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['keywords'], 
    });
    if (updateIdeaDto.keywords && updateIdeaDto.keywords.length>0) {
        const keywords = await this.keywordRepository.find({ where: { id: In(updateIdeaDto.keywords) }});
        idea.keywords = keywords; 
        return this.ideaRepository.save(idea); 
    }
    return idea;
  }

  remove(id: number) {
    return this.ideaRepository.delete({ id });
  }
}
