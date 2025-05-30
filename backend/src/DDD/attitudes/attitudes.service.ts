import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttitudeDto } from './dto/create-attitude.dto';
import { IUser } from '../../types/custom';
import { pick } from 'lodash';
import { Attitude } from './entities/attitude.entity';

interface ILikeCount {
  value: number;
  count: number;
}

@Injectable()
export class AttitudesService {
  constructor(
    @InjectRepository(Attitude)
    private readonly attitudeRepository: Repository<Attitude>,
 ) {}

  async create(user: IUser,ideaID:number, createAttitudeDto: CreateAttitudeDto) {
    //console.log('AttitudesService create',user, ideaID, createAttitudeDto)
    const found=await this.attitudeRepository.find({
      where:{user_id:user.id, 
             idea_id:ideaID}
      });
    if (found.length===0) {// не найдено
      if (createAttitudeDto.importance!==0 || createAttitudeDto.like!==0 || createAttitudeDto.truth!==0)
        return this.attitudeRepository.save({
          ...createAttitudeDto,
          user_id: user.id ,
          idea_id: ideaID
        });        
      else
        return ({affected:0});
    }
    else {
      if (createAttitudeDto.importance===0 && createAttitudeDto.like===0 && createAttitudeDto.truth===0) {
        return this.attitudeRepository.delete({user_id:user.id, idea_id:ideaID});
      }
      else
        return this.attitudeRepository.update({user_id:user.id, idea_id:ideaID}, 
          createAttitudeDto);      
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
