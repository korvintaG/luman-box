import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { SourcesService } from '../sources/sources.service';
import { joinSimpleEntityFirst } from '../../utils/utils'
import {IUser} from '../../types/custom'

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
    return this.authorRepository.findOne({where: { id }, relations: { user: true }});
  }

  async checkAccess(id: number, user:IUser) {
    const [authorOld]=await this.authorRepository.find({where: {id}, relations:['user']});
    if (!authorOld)
      throw new HttpException({
        message: "Не найден автор для операции"
        }, HttpStatus.BAD_REQUEST);
    if (authorOld.user.id!==user.id)
      throw new UnauthorizedException({
        message: "У Вас нет прав на редактирование авторов, добавленных не Вами"
        });
  }

  async update(id: number, user:IUser, updateAuthorDto: UpdateAuthorDto) {
    await this.checkAccess(id, user);
    return this.authorRepository.update({id}, updateAuthorDto);
  }

  async remove(id: number, user:IUser) {
    await this.checkAccess(id, user);
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