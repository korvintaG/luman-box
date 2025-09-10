import {
  ManyToMany,
  Entity,
  Column,
  Index,
} from 'typeorm';
import { Idea } from '../../ideas/entities/idea.entity';
import { EntityCommonFull } from 'src/shared/entities/abstract.entity';

@Entity('keywords')
@Index('UQ_keyword_name', ['name'], { unique: true })
export class Keyword  extends EntityCommonFull{
  @Column({ type: 'varchar', nullable: true })
  definition: string;
  
  @ManyToMany(() => Idea, (idea) => idea.keywords, { cascade: true })
  ideas: Idea[];

}
