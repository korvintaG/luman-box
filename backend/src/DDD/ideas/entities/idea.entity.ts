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
import { Keyword, KeywordName } from '../../keywords/entities/keyword.entity';
import { Attitude } from 'src/DDD/attitudes/entities/attitude.entity';
import { EntityCommonFull} from '../../../shared/entities/abstract.entity';

@Entity('ideas')
@Index('UQ_idea_source_id_name', ['source_id', 'name' ], { unique: true })
export class Idea extends EntityCommonFull {
  @Column({ type: 'integer'})
  source_id: number;

  @ManyToOne(() => Source, (source) => source.ideas, { nullable: true })
  @JoinColumn({ name: 'source_id' })
  source: Source;

  @Column('text')
  original_text: string;

  @Column('text')
  content: string;

  @Column({ type: 'varchar', nullable: true})
  SVG: string;

  @ManyToMany(() => KeywordName, (keywordName) => keywordName.ideas)
  @JoinTable({
    name: 'idea_keyword_names',
    joinColumns: [
      {
        name: 'idea_id',
        referencedColumnName: 'id',
      },
    ],
    inverseJoinColumns: [
      {
        name: 'keyword_name_id',
        referencedColumnName: 'id',
      },
    ],
  })
  keyword_names: KeywordName[];

  @OneToMany(() => Attitude, (attitude) => attitude.idea)
  attitudes: Attitude[];
}
