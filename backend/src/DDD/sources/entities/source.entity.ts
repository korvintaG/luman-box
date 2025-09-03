import {
  RelationId,
  JoinColumn,
  OneToMany,
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Author } from '../../authors/entities/author.entity';
import { User } from '../../users/entities/user.entity';
import { Idea } from '../../ideas/entities/idea.entity';
import { EntityCommonFull } from 'src/shared/entities/abstract.entity';

//{ id:1, author_id:1, name:'Как делать полезные заметки'},

@Entity('sources')
export class Source extends EntityCommonFull {
  @Column({ type: 'varchar', nullable: true})
  publication_year: string;

  @Column({ type: 'varchar', nullable: true})
  about_source: string;

  @Column({ type: 'varchar', nullable: true})
  image_URL: string;

  @OneToMany(() => Idea, (idea) => idea.source)
  ideas: Idea[];

  /*@RelationId((source: Source) => source.ideas) // Получаем только ID постов
    ideaIds: number[];*/

  @ManyToOne(() => Author, (author) => author.name, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: Author;

}
