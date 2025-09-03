import {
  OneToMany,
  ManyToOne,
  JoinColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Source } from '../../sources/entities/source.entity';
import { User } from '../../users/entities/user.entity';
import { EntityCommonFull } from '../../../shared/entities/abstract.entity';

@Entity('authors')
export class Author extends EntityCommonFull {
  @Column({ type: 'varchar', nullable: true})
  birth_date: string;

  @Column({ type: 'varchar', nullable: true})
  birth_place: string;

  @Column({ type: 'varchar', nullable: true})
  about_author: string;

  @Column({ type: 'varchar', nullable: true})
  image_URL: string;

  @OneToMany(() => Source, (source) => source.author)
  sources: Source[];

}
