import {
  OneToMany,
  ManyToOne,
  JoinColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Index } from 'typeorm';
import { Source } from '../../sources/entities/source.entity';
import { User } from '../../users/entities/user.entity';
import { EntityCommonFull } from '../../../shared/entities/abstract.entity';


@Entity('authors')
@Index('UQ_author_name_birth_date_birth_place', ['name', 'birth_date', 'birth_place'], { unique: true })
export class Author extends EntityCommonFull {
  @Column({ type: 'varchar', default: ''})
  birth_date: string;

  @Column({ type: 'varchar', default: ''})
  birth_place: string;

  @Column({ type: 'varchar', nullable: true})
  about_author: string;

  @Column({ type: 'varchar', nullable: true})
  image_URL: string;

  @OneToMany(() => Source, (source) => source.author)
  sources: Source[];

}
