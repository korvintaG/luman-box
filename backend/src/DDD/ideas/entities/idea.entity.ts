import {
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  JoinColumn,
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Source } from '../../sources/entities/source.entity';
import { Keyword } from '../../keywords/entities/keyword.entity';
import { User } from '../../users/entities/user.entity';
import { Attitude } from 'src/DDD/attitudes/entities/attitude.entity';
import { EntityCommonFull} from '../../../shared/entities/abstract.entity';

@Entity('ideas')
export class Idea extends EntityCommonFull {
  @ManyToOne(() => Source, (source) => source.name, { nullable: true })
  @JoinColumn({ name: 'source_id' })
  source: Source;

  @Column('text')
  original_text: string;

  @Column('text')
  content: string;

  @Column({ type: 'varchar', nullable: true})
  SVG: string;


  @ManyToMany(() => Keyword, (keyword) => keyword.ideas)
  @JoinTable({
    name: 'idea_keywords',
    joinColumn: {
      name: 'idea_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'keyword_id',
      referencedColumnName: 'id',
    },
  })
  keywords: Keyword[];

  @OneToMany(() => Attitude, (attitude) => attitude.idea)
  attitudes: Attitude[];
}
