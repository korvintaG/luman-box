import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Idea } from './entities/idea.entity';
import { Keyword } from '../keywords/entities/keyword.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';

@Injectable()
export class IdeasService {

  constructor(
    @InjectRepository(Idea)
    private readonly ideaRepository: Repository<Idea>,
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,

  ) {}

  async create(createIdeaDto: CreateIdeaDto) {
    let onlyIdea: Omit<Idea, "keywords">;
    const newIdea = Object.assign({},createIdeaDto);
    delete newIdea.keywords;
    onlyIdea= JSON.parse(JSON.stringify(newIdea));
    console.log('create onlyIdea=',onlyIdea)
    let idea=this.ideaRepository.create(onlyIdea);
    console.log('create idea=',idea)
    if (createIdeaDto.keywords)
      if (createIdeaDto.keywords.length>0) {
        const keywords = await this.keywordRepository.find({ where: { id: In(createIdeaDto.keywords) }});
        console.log('create keywords=',keywords)
        idea.keywords = keywords;
      }
    return this.ideaRepository.save(idea);
  }

  findAll() {
    return this.ideaRepository.find( {order: { name: "ASC" }});
  }

  findOne(id: number) {
    return this.ideaRepository.findOneBy({ id });
  }

  update(id: number, updateIdeaDto: UpdateIdeaDto) {
    //return this.ideaRepository.update({id}, updateIdeaDto);
    return '???'
  }

  remove(id: number) {
    return this.ideaRepository.delete({ id });
  }
}
