import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InterconnectionEntityDto } from './dto/create-interconnection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdateInterconnectionDto } from './dto/update-interconnection.dto';
import { IUser, InterconnestionsCount, InterconnestionsTypes, IModerate } from '../../types/custom';
import { Interconnection } from './entities/interconnection.entity';
import { getUserSQLFilter } from 'src/utils/utils';
import { isEmpty } from 'lodash';
import { VerificationStatus } from 'src/shared/entities/abstract.entity';
import { ModeratorService } from '../../shared/services/moderator.service';
import { IdeasService } from '../ideas/ideas.service';

type ICTC={
  interconnection_type: number;
  cnt: number;
}

type IdeaInfo ={
  idea_id: number;
  name:string;
  source_name: string;
  source_id: number;
  SVG: string | null;
}

type IdeaInfoWithIC = IdeaInfo & {
  interconnection_name: string;
  interconnection_id: number;
}


@Injectable()
export class InterconnectionsService {
  constructor(
    @InjectRepository(Interconnection)
    private readonly interconnectionRepository: Repository<Interconnection>,
    @Inject(forwardRef(() => IdeasService))
    private ideasService: IdeasService,
    private moderatorService: ModeratorService,
 ) {}

 async create(user: IUser,interconnectionEntityDto: InterconnectionEntityDto) {
    if (interconnectionEntityDto.idea1_id===interconnectionEntityDto.idea2_id)
      throw new BadRequestException({
        error: 'Bad Request',
        message: `Взаимосвязь должна устанавливаться между разными идеями! Вы же пытаетесь внутри одной с ID=${interconnectionEntityDto.idea1_id}`
      });
    await this.moderatorService.checkDraftCount(
      this.interconnectionRepository,
      user,
      'Взаимосвязь'
    );
      return this.interconnectionRepository.save({
      ...interconnectionEntityDto,
      user_id: user.id 
    });        
;
  }

  async findOne(id: number, user:IUser) {
    const interconnection=await this.interconnectionRepository.findOne(
      {where: {id},relations: ['user', 'moderator'] });
    if (isEmpty(interconnection))
      throw new  NotFoundException({
        error: 'NotFound',
        message: `Взаимосвязи с ID=${id} не найдено!`
      });
    const addCond=getUserSQLFilter(user, 'ideas')
    const ideaCurrent=await this.interconnectionRepository.manager.query<IdeaInfo[]>(    
        `select ideas.id, ideas.name, sources.name || ' // ' || authors.name as source_name, source_id
        from ideas, sources, authors, interconnections 
        where interconnections.id=${id} 
          ${addCond}
          and ideas.id= interconnections.idea1_id
          and sources.id=ideas.source_id 
          and authors.id=sources.author_id`);
    if (isEmpty(ideaCurrent))
      throw new  NotFoundException({
        error: 'NotFound',
        message: `Не найдено 1-й идеи для взаимосвязи ID=${id}!`
      });
    const ideaInterconnect=await this.interconnectionRepository.manager.query<IdeaInfo[]>(    
        `select ideas.id, ideas.name, sources.name || ' // ' || authors.name as source_name, source_id
        from ideas, sources, authors, interconnections 
        where interconnections.id=${id} 
          ${addCond}
          and ideas.id= interconnections.idea2_id
          and sources.id=ideas.source_id 
          and authors.id=sources.author_id`);
    if (isEmpty(ideaInterconnect))
      throw new  NotFoundException({
        error: 'NotFound',
        message: `Не найдено 2-й идеи для взаимосвязи ID=${id}!`
      });

    return { ...interconnection, idea_current:ideaCurrent[0], idea_interconnect:ideaInterconnect[0] }
  }

  async findByCond(findInterconnectionWhere: FindOptionsWhere<Interconnection>) {
    return this.interconnectionRepository.find({where: findInterconnectionWhere});
  }

  async getByIdeaAndType(idea_id: number, type_id: number, user:IUser) {
    const addCond=getUserSQLFilter(user,'interconnections'); 
    const addIdeaCond=getUserSQLFilter(user,'ideas'); 
    const idea=await this.interconnectionRepository.manager.query<IdeaInfo[]>(    
      `select ideas.id, ideas.name, sources.name || ' // ' || authors.name as source_name, source_id, ideas."SVG"
      from ideas, sources, authors
      where ideas.id=${idea_id} ${addIdeaCond} and sources.id=ideas.source_id and authors.id=sources.author_id`);
    const ideasDirect=await this.interconnectionRepository.manager.query<IdeaInfoWithIC[]>(    
      `select ideas.id as id, ideas.name, sources.name || ' // ' || authors.name as source_name, source_id, ideas."SVG",
        interconnections.name_direct as interconnection_name,
        interconnections.id as interconnection_id,
        interconnections.verification_status
      from ideas, sources, authors, interconnections 
      where interconnections.idea1_id=${idea_id} 
        ${addCond}
        and sources.id=ideas.source_id 
        and authors.id=sources.author_id 
        and ideas.id=interconnections.idea2_id 
        and interconnection_type=${type_id}`);
    const ideasReverse=await this.interconnectionRepository.manager.query<IdeaInfoWithIC[]>(    
      `select ideas.id as id, ideas.name, sources.name || ' // ' || authors.name as source_name, source_id, ideas."SVG",
        interconnections.name_reverse as interconnection_name,
        interconnections.id as interconnection_id,
        interconnections.verification_status
      from ideas, sources, authors, interconnections 
      where interconnections.idea2_id=${idea_id} 
        ${addCond}
        and sources.id=ideas.source_id 
        and authors.id=sources.author_id 
        and ideas.id=interconnections.idea1_id 
        and interconnection_type=${type_id}`);
    return {idea: idea[0], interconnections_direct: ideasDirect, interconnections_reverse: ideasReverse};
  }
  
  /*async getForInterconnectAdd(idea_id: number, iitype_id: number) {
    const ideaCurrent=await this.interconnectionRepository.manager.query<IdeaInfo[]>(    
      `select ideas.id, ideas.name, sources.name || ' // ' || authors.name as source_name, source_id
      from ideas, sources, authors, interconnections 
      where interconnections.id=${idea_id} 
        and ideas.id= interconnections.idea1_id
        and sources.id=ideas.source_id 
        and authors.id=sources.author_id`);
  }*/

  async countAllByIdea(idea_id: number, user: IUser) {
    const addCond=getUserSQLFilter(user); 
    const ic1=await this.interconnectionRepository.manager.query<ICTC[]>(    
      `select interconnection_type, count(*) as cnt
      from interconnections
      where idea1_id=${idea_id}
      ${addCond}
      group by interconnection_type`);
    const ic2=await this.interconnectionRepository.manager.query<ICTC[]>(    
      `select interconnection_type, count(*) as cnt
      from interconnections
      where idea2_id=${idea_id}
      ${addCond}
      group by interconnection_type`);
      
    let res:InterconnestionsCount[]=[];
    for (const [name, value] of Object.entries(InterconnestionsTypes)) {
      if (isNaN(Number(name))) { // что не число точно
        let cnt1=0;
        let cnt2=0;
        const found1=ic2.find(el=>el.interconnection_type===value);
        if (found1)
          cnt1=Number(found1.cnt);
        const found2=ic1.find(el=>el.interconnection_type===value);
        if (found2)
          cnt2=Number(found2.cnt);
        res.push({id:Number(value), name, cnt1,cnt2})
      }
    }

    return res;
  }


  async update(user: IUser, id: number, updateInterconnectionDto: UpdateInterconnectionDto) {
    const recordOld = await this.moderatorService.checkDMLAccess(this.interconnectionRepository, id, user);
    const res = await this.interconnectionRepository.update({id},updateInterconnectionDto) 
    if (res.affected === 0) {
      throw new NotFoundException({
        error: 'NotFound',
        message: 'Не найдена взаимосвязь'
      });
    }
    else {
      return this.interconnectionRepository.findOne({ where: { id } });
    }
  }

  async remove(user: IUser, id: number) {
    const recordOld = await this.moderatorService.checkDMLAccess(this.interconnectionRepository, id, user);
    const res = await this.interconnectionRepository.delete({ id })
    if (res.affected === 0) {
      throw new NotFoundException({
        error: 'NotFound',
        message: 'Не найдена взаимосвязь'
      });
    }
    else {
      return {
        success: true,
        message: "Interconnection deleted successfully",
        id: id
      };
    }

  }

  async toModerate(id: number, user: IUser) {
    const ideas = await this.interconnectionRepository.manager.query<
      { id: number, verification_status: VerificationStatus }[]>
      (`select 
          ideas.id, 
          ideas.verification_status
        from ideas, interconnections as i
        where i.id=$1 and ideas.id in (i.idea2_id, i.idea1_id)`, [id]);
    for (const idea of ideas) {
      if (idea.verification_status === VerificationStatus.Creating) {
        await this.ideasService.toModerate(idea.id, user);
      }
    }

    return this.moderatorService.toModerateEntity(
      this.interconnectionRepository,
      id,
      user,
      process.env.ROUTE_INTERCONNECTION_DETAIL,
      'Взаимосвязь'
    );
  }

  async moderate(id: number, user: IUser, moderationResult: IModerate) {
    if (moderationResult.action === 'approve') {
      const ideas = await this.interconnectionRepository.manager.query<
        { id: number, verification_status: VerificationStatus }[]>
        (`select 
            ideas.id, 
            ideas.verification_status 
          from ideas, interconnections 
          where interconnections.id=$1 and ideas.id in (interconnections.idea2_id, interconnections.idea1_id)`, [id]);
      if (!ideas || ideas.length === 0) 
        throw new NotFoundException({
          error: 'NotFound',
          message: 'Не найдены идеи для взаимосвязи'
        });
      for (const idea of ideas) {
        if (idea.verification_status !== VerificationStatus.Moderated) 
          throw new BadRequestException({
            error: 'Bad Request',
            message: `Не одобрена идея. Чтобы одобрить, перейдите по ссылке: ${process.env.FRONTEND_URL}${process.env.ROUTE_IDEA_DETAIL}/${idea.id}`
          });
      }
    }
    return this.moderatorService.moderateEntity(
      this.interconnectionRepository,
      id,
      user,
      moderationResult,
      'Взаимосвязь'
    );
  }

}
