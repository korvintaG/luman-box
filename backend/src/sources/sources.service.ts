import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Source } from './entities/source.entity'
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';

@Injectable()
export class SourcesService {

  constructor(
    @InjectRepository(Source)
    private readonly sourceRepository: Repository<Source>,
  ) {}

  create(createSourceDto: CreateSourceDto) {
    return this.sourceRepository.save(createSourceDto);
  }

  findAll() {
    return this.sourceRepository.find( {relations: { author: true }, order: { name: "ASC" }});
  }

  findOne(id: number) {
    return this.sourceRepository.findOne({where: { id }, relations: { author: true }});
  }

  update(id: number, updateSourceDto: UpdateSourceDto) {
    return this.sourceRepository.update({id}, updateSourceDto);
  }

  remove(id: number) {
    return this.sourceRepository.delete({ id });
  }
}
