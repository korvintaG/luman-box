import { Injectable,   HttpException, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { Repository } from 'typeorm';
import { Keyword } from './entities/keyword.entity';
import { Idea } from '../ideas/entities/idea.entity';

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

  async remove(id: number) {
    try {
      const ans= await this.keywordRepository.delete({ id })
      return ans
    }
    catch (err) {
      let errMessage=err.message;
      if (err.code==="23503") {
        errMessage="Нельзя удалять ключевое слово, которое закреплено за идеями: ";
        /*const res=await this.keywordRepository
          .createQueryBuilder("parent")
          .leftJoinAndSelect(
            subQuery => {
              return subQuery
                .select("child")
                .from(Idea, "child")
                .limit(5);
            },
            "children",
            "children.parentId = parent.id")          
          .where("p.id = :id", {id})
          .getOne();
        console.log('KeywordsService remove res=',res)*/
        /*try {
          const rel= await this.keywordRepository.findOne( { where: {id}, relations: {ideas:true}});
          for (let i in rel.ideas) {
            errMessage=errMessage+" ["+rel.ideas[i].name+' (id='+rel.ideas[i].id+')]'
          }
        }
        catch (find_err) {
          errMessage=errMessage+" [не удалось найти список закрепленных за ключевым слово идей из-за ошибки: "+find_err.message+']';
        } */
      }
      throw new HttpException({
        message: errMessage
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
