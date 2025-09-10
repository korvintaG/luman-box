import {
  RelationId,
  JoinColumn,
  OneToMany,
  ManyToOne,
  Entity,
  Column,
  Index,
} from 'typeorm';
import { Author } from '../../authors/entities/author.entity';
import { Idea } from '../../ideas/entities/idea.entity';
import { EntityCommonFull } from 'src/shared/entities/abstract.entity';

//{ id:1, author_id:1, name:'Как делать полезные заметки'},

@Entity('sources')
@Index('UQ_source_author_id_name', ['author_id', 'name' ], { unique: true })
export class Source extends EntityCommonFull {
  @Column({ type: 'number'})
  author_id: number;

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
