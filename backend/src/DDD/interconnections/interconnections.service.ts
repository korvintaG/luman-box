import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InterconnectionEntityDto } from './dto/create-interconnection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateInterconnectionDto } from './dto/update-interconnection.dto';
import { IUser, InterconnestionsCount, InterconnestionsTypes } from '../../types/custom';
import { Interconnection } from './entities/interconnection.entity';
import { getUserSQLFilter } from 'src/utils/utils';
import { isEmpty } from 'lodash';

type ICTC={
  interconnection_type: number;
  cnt: number;
}

type IdeaInfo ={
  idea_id: number;
  name:string;
  source_name: string;
  source_id: number;
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
 ) {}

 create(user: IUser,interconnectionEntityDto: InterconnectionEntityDto) {
    if (interconnectionEntityDto.idea1_id===interconnectionEntityDto.idea2_id)
      throw new BadRequestException(`Взаимосвязь должна устанавливаться между разными идеями! Вы же пытаетесь внутри одной с ID=${interconnectionEntityDto.idea1_id}`);
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
      throw new  NotFoundException(`Взаимосвязи с ID=${id} не найдено!`);
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
      throw new  NotFoundException(`Не найдено 1-й идеи для взаимосвязи ID=${id}!`);
    const ideaInterconnect=await this.interconnectionRepository.manager.query<IdeaInfo[]>(    
        `select ideas.id, ideas.name, sources.name || ' // ' || authors.name as source_name, source_id
        from ideas, sources, authors, interconnections 
        where interconnections.id=${id} 
          ${addCond}
          and ideas.id= interconnections.idea2_id
          and sources.id=ideas.source_id 
          and authors.id=sources.author_id`);
    if (isEmpty(ideaInterconnect))
      throw new  NotFoundException(`Не найдено 2-й идеи для взаимосвязи ID=${id}!`);

    return { ...interconnection, ideaCurrent:ideaCurrent[0], ideaInterconnect:ideaInterconnect[0] }
  }

  async getByIdeaAndType(idea_id: number, type_id: number, user:IUser) {
    const addCond=getUserSQLFilter(user,'interconnections'); 
    const addIdeaCond=getUserSQLFilter(user,'ideas'); 
    const idea=await this.interconnectionRepository.manager.query<IdeaInfo[]>(    
      `select ideas.id, ideas.name, sources.name || ' // ' || authors.name as source_name, source_id
      from ideas, sources, authors
      where ideas.id=${idea_id} ${addIdeaCond} and sources.id=ideas.source_id and authors.id=sources.author_id`);
    const ideasDirect=await this.interconnectionRepository.manager.query<IdeaInfoWithIC[]>(    
      `select ideas.id as idea_id, ideas.name, sources.name || ' // ' || authors.name as source_name, source_id,
        interconnections.name_direct as interconnection_name,
        interconnections.id as interconnection_id
      from ideas, sources, authors, interconnections 
      where interconnections.idea1_id=${idea_id} 
        ${addCond}
        and sources.id=ideas.source_id 
        and authors.id=sources.author_id 
        and ideas.id=interconnections.idea2_id 
        and interconnection_type=${type_id}`);
    const ideasReverse=await this.interconnectionRepository.manager.query<IdeaInfoWithIC[]>(    
      `select ideas.id as idea_id, ideas.name, sources.name || ' // ' || authors.name as source_name, source_id,
        interconnections.name_reverse as interconnection_name,
        interconnections.id as interconnection_id
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
    return this.interconnectionRepository.update({id},updateInterconnectionDto)
  }

  remove(user: IUser, id: number) {
    return this.interconnectionRepository.delete({ id })
  }

  async moderate(id: number, user: IUser) {
    //await checkAccess(this.authorRepository,id, user.id);
    return this.interconnectionRepository.update({ id }, { moderated: user.id });
  }

}
