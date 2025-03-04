import {
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  JoinColumn,
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Source } from '../../sources/entities/source.entity';
import { Keyword } from '../../keywords/entities/keyword.entity';
import { User } from '../../users/entities/user.entity';

@Entity('ideas')
export class Idea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', select: false, nullable: true })
  id_out: string;

  @Column('varchar')
  name: string;

  @ManyToOne(() => Source, (source) => source.name, { nullable: true })
  @JoinColumn({ name: 'source_id' })
  source: Source;

  @ManyToOne(() => User, (user) => user.name, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text')
  original_text: string;

  @Column('text')
  content: string;

  //@Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  date_time_create: Date;

  @Column({ type: 'int', nullable: true, name: 'moderated' })
  moderated: number;

  @ManyToOne(() => User, (user) => user.name, { nullable: true })
  @JoinColumn({ name: 'moderated' })
  moderator: User;

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
}
