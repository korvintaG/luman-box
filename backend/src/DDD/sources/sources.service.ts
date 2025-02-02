import { Repository, FindManyOptions } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Source } from './entities/source.entity'
import { IdeasService } from '../ideas/ideas.service'
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { joinSimpleEntityFirst, checkAccess } from '../../utils/utils'
import {IUser} from '../../types/custom'


@Injectable()
export class SourcesService {

  constructor(
    @InjectRepository(Source)
    private readonly sourceRepository: Repository<Source>,
    private ideasService: IdeasService
  ) {}

  create(user:IUser,createSourceDto: CreateSourceDto) {
    return this.sourceRepository.save({...createSourceDto, user:{id:user.id}});
  }

  findAll() {
    return this.sourceRepository.find( {relations: { author: true }, order: { name: "ASC" }});
  }

  findByCond(cond:FindManyOptions) {
    return this.sourceRepository.find( cond);
  }


  findOne(id: number) {
    return this.sourceRepository.findOne({where: { id }, relations: { author: true, user: true }});
  }

  async update(id: number, user:IUser, updateSourceDto: UpdateSourceDto) {
    await checkAccess(this.sourceRepository,id, user.id);
    return await this.sourceRepository.update({id}, updateSourceDto);
  }

  async remove(id: number,user:IUser) {
    await checkAccess(this.sourceRepository,id, user.id);
    try {
      return await this.sourceRepository.delete({ id });
    }
    catch (err) {
      let errMessage=err.message;
      if (err.code==="23503") {
        errMessage="Нельзя удалять источник, по которому есть идеи: ";
        try {
          const res=await this.ideasService.findByCond({select: {id:true, name:true}, where: {source:{id}}, take: 5});
          errMessage+=joinSimpleEntityFirst(res.map((el)=>({id: el.id, name: el.name})));
        }
        catch (find_err) {
            errMessage=errMessage+" [не удалось найти список закрепленных за источником идей из-за ошибки: "+find_err.message+']';
        } 

      }
      throw new HttpException({
        message: errMessage
      }, HttpStatus.BAD_REQUEST);

    }
  }
}
