import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { Repository } from 'typeorm';
import { Keyword } from './entities/keyword.entity';

@Injectable()
export class KeywordsService {

  constructor(
    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,
  ) {}

  create(createKeywordDto: CreateKeywordDto) {
    return this.keywordRepository.save(createKeywordDto);
  }

  findAll() {
    return this.keywordRepository.find( {order: { name: "ASC" }});
  }

  findOne(id: number) {
    return this.keywordRepository.findOneBy({ id });
  }

  update(id: number, updateKeywordDto: UpdateKeywordDto) {
    return this.keywordRepository.update({id}, updateKeywordDto);
  }

  remove(id: number) {
    return this.keywordRepository.delete({ id });
  }
}
