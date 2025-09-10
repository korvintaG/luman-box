import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttitudeDto } from './dto/create-attitude.dto';
import { IUser } from '../../types/custom';
import { pick } from 'lodash';
import { Attitude } from './entities/attitude.entity';
import { Idea } from '../ideas/entities/idea.entity';
import { IdeasService } from '../ideas/ideas.service';

interface ILikeCount {
  value: number;
  count: number;
}

@Injectable()
export class AttitudesService {
  constructor(
    @InjectRepository(Attitude)
    private readonly attitudeRepository: Repository<Attitude>,
    @Inject(forwardRef(() => IdeasService))
    private readonly ideasService: IdeasService
 ) {}

  async create(user: IUser,ideaID:number, createAttitudeDto: CreateAttitudeDto) {
    /*const idea=await this.ideasService.findOne(ideaID, user);
    if (!idea)
      throw new NotFoundException({
        error:'NotFound',
        message: `Idea with id ${ideaID} not found`
      });*/
    if (!createAttitudeDto.importance)
      createAttitudeDto.importance=0;
    if (!createAttitudeDto.like)
      createAttitudeDto.like=0;
    if (!createAttitudeDto.truth)
      createAttitudeDto.truth=0;
    try {
      const found=await this.attitudeRepository.find({
        where:{user_id:user.id, 
              idea_id:ideaID}
        });
      if (found.length===0) {// не найдено
        if (createAttitudeDto.importance!==0 || createAttitudeDto.like!==0 || createAttitudeDto.truth!==0) {
          const res=await this.attitudeRepository.save({
            ...createAttitudeDto,
            user_id: user.id ,
            idea_id: ideaID
          });     
          return {
            success: true,
            id: res.id,
            idea_id: ideaID,
            user_id: user.id,
            message: `Attitude created successfully`
          };
        }
        else
          return {
            success: true,
            id: null,
            idea_id: ideaID,
            user_id: user.id,
            message: `Attitude not necessary to create`
          };
      }
      else {
        if (createAttitudeDto.importance===0 && createAttitudeDto.like===0 && createAttitudeDto.truth===0) {
          const res= this.attitudeRepository.delete({user_id:user.id, idea_id:ideaID});
          return {
            success: true,
            id: null,
            idea_id: ideaID,
            user_id: user.id,
            message: `Attitude deleted successfully`
          };
        }
        else {
          const res=await this.attitudeRepository.update({user_id:user.id, idea_id:ideaID}, 
            createAttitudeDto);      
          if (res.affected===0) {
            throw new NotFoundException({
              error:'NotFound',
              message: `Attitude with user_id ${user.id} and idea_id ${ideaID} not found to update`
            });
          }
          return {
            success: true,
            id: undefined,
            idea_id: ideaID,
            user_id: user.id,
            message: `Attitude updated successfully`
          };
        }
    }
    } catch (error) {
      throw new NotFoundException({
        error:'NotFound',
        message: `Idea with id ${ideaID} not found: ${error}`
      });
    }
  }

  async findOne(ideaID: number, user: IUser) {
    const attitudeNames=['like','importance','truth'];
    const attitudesGen : number [][]=[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
    for (let i = 0; i < attitudeNames.length; i++) {
      const attitude = await this.attitudeRepository.manager.query<ILikeCount[]>(    
        `SELECT "${attitudeNames[i]}" as value, COUNT(*) AS count
        FROM attitudes
        WHERE idea_id=$1 and "${attitudeNames[i]}"<>0
        GROUP BY "${attitudeNames[i]}"
        ORDER BY "${attitudeNames[i]}"`,[ideaID]) ;    
      for (const att1 of attitude) {
        attitudesGen[i][att1.value]=Number(att1.count);
      }
    } 
    let res={};
    for (let i = 0; i < attitudeNames.length; i++) {
      res={...res,[attitudeNames[i]]:attitudesGen[i]};
    }
    const attitudesAll={all:res};
    if (user) {
      const found=await this.attitudeRepository.find({
        where:{user_id:user.id, 
               idea_id:ideaID}
        });
      if (found.length===1) {// найдено      
        const attitudesUser=pick(found[0],attitudeNames);
        return {...attitudesAll,user:attitudesUser};
      }
      else {
        const attitudesUser = Object.fromEntries(
          attitudeNames.map(key => [key, 0])
        ) as { [key in typeof attitudeNames[number]]: number };
        return {...attitudesAll,user:attitudesUser};
      }
    }
    return {...attitudesAll};
  }

}
