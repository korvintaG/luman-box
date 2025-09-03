import {
  ManyToOne,
  JoinColumn,
  ManyToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Idea } from '../../ideas/entities/idea.entity';
import { User } from '../../users/entities/user.entity';
import { EntityCommonFull } from 'src/shared/entities/abstract.entity';

@Entity('keywords')
export class Keyword  extends EntityCommonFull{
  @Column({ type: 'varchar', nullable: true })
  definition: string;
  
  @ManyToMany(() => Idea, (idea) => idea.keywords, { cascade: true })
  ideas: Idea[];

}
