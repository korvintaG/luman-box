import {
  JoinTable,
  ManyToMany,
  OneToMany,
  JoinColumn,
  ManyToOne,
  Entity,
  Column,
  Index,
} from 'typeorm';
import { Source } from '../../sources/entities/source.entity';
import { Keyword } from '../../keywords/entities/keyword.entity';
import { Attitude } from 'src/DDD/attitudes/entities/attitude.entity';
import { EntityCommonFull} from '../../../shared/entities/abstract.entity';

@Entity('ideas')
@Index('UQ_idea_source_id_name', ['source_id', 'name' ], { unique: true })
export class Idea extends EntityCommonFull {
  @Column({ type: 'number'})
  source_id: number;

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
