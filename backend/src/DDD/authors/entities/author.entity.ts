import {
  OneToMany,
  ManyToOne,
  JoinColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Source } from '../../sources/entities/source.entity';
import { User } from '../../users/entities/user.entity';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', select: false, nullable: true })
  id_out: string;

  @Column('varchar')
  name: string;

  @Column({ type: 'varchar', nullable: true})
  birth_date: string;

  @Column({ type: 'varchar', nullable: true})
  birth_place: string;

  @Column({ type: 'varchar', nullable: true})
  about_author: string;

  @Column({ type: 'varchar', nullable: true})
  image_URL: string;

  @Column({ type: 'int', nullable: true, name: 'moderated' })
  moderated: number;

  @ManyToOne(() => User, (user) => user.name, { nullable: true })
  @JoinColumn({ name: 'moderated' })
  moderator: User;

  @OneToMany(() => Source, (source) => source.author)
  sources: Source[];

  @ManyToOne(() => User, (user) => user.name, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
