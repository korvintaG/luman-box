import {
  RelationId,
  JoinColumn,
  OneToMany,
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Author } from '../../authors/entities/author.entity';
import { User } from '../../users/entities/user.entity';
import { Idea } from '../../ideas/entities/idea.entity';

//{ id:1, author_id:1, name:'Как делать полезные заметки'},

@Entity('sources')
export class Source {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', select: false, nullable: true })
  id_out: string;

  @Column('varchar')
  name: string;

  @Column({ type: 'varchar', nullable: true})
  publication_year: string;

  @Column({ type: 'varchar', nullable: true})
  about_source: string;

  @Column({ type: 'varchar', nullable: true})
  image_URL: string;

  @Column({ type: 'int', nullable: true, name: 'moderated' })
  moderated: number;

  @ManyToOne(() => User, (user) => user.name, { nullable: true })
  @JoinColumn({ name: 'moderated' })
  moderator: User;

  @OneToMany(() => Idea, (idea) => idea.source)
  ideas: Idea[];

  /*@RelationId((source: Source) => source.ideas) // Получаем только ID постов
    ideaIds: number[];*/

  @ManyToOne(() => Author, (author) => author.name, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @ManyToOne(() => User, (user) => user.name, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
