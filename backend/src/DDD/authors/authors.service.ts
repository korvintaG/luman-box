import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { SourcesService } from '../sources/sources.service';
import { joinSimpleEntityFirst } from '../../utils/utils'


@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    private sourcesService: SourcesService
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    return this.authorRepository.save(createAuthorDto);
  }

  findAll() {
    return this.authorRepository.find( {order: { name: "ASC" }});
  }

  findOne(id: number) {
    return this.authorRepository.findOneBy({ id });
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return this.authorRepository.update({id}, updateAuthorDto);
  }

  async remove(id: number) {
    try {
      return await this.authorRepository.delete({ id });
    }
    catch (err) {
      let errMessage=err.message;
      if (err.code==="23503") {
        errMessage="Нельзя удалять автора, который закреплен за источниками: ";
        try {
          const res=await this.sourcesService.findByCond({where: {author:{id}}, take: 5});
          errMessage+=joinSimpleEntityFirst(res.map((el)=>({id: el.id, name: el.name})));
        }
        catch (find_err) {
            errMessage=errMessage+" [не удалось найти список закрепленных за автором источников из-за ошибки: "+find_err.message+']';
        } 

        throw new HttpException({
          message: errMessage
          }, HttpStatus.BAD_REQUEST);
      }
    }
  }
}