import {
  ManyToMany,
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Idea } from '../../ideas/entities/idea.entity';
import { EntityCommonFull, EntityModerate } from 'src/shared/entities/abstract.entity';

@Entity('keywords')
@Index('UQ_keyword_name', ['class_keyword_id', 'name'], { unique: true })
export class Keyword  extends EntityCommonFull{
  @Column({ type: 'varchar', nullable: true })
  definition: string;
  
  /*@ManyToMany(() => Idea, (idea) => idea.keywords, { cascade: true })
  ideas: Idea[];*/

  @OneToMany(() => KeywordName, (keywordName) => keywordName.keyword, { cascade: true })
  names: KeywordName[];

  @OneToMany(() => KeywordModeration, (keywordModeration) => keywordModeration.keyword, { cascade: true })
  moderation: KeywordModeration[];

  @Column({ type: 'integer', nullable: false, default: 0 })
  @Index()
  class_keyword_id: number;

  @Column({ type: 'varchar', nullable: true })
  class_keyword_id_out: string;

  @Column({ type: 'varchar', nullable: true })
  class_name_before: string;

  @Column({ type: 'varchar', nullable: true })
  class_name_after: string;

  @Column({ type: 'varchar', nullable: true })
  bread_crumbs: string;

}

@Entity('keyword_moderations')
export class KeywordModeration extends EntityModerate {
  @Column({ type: 'integer', nullable: false, select: false })
  keyword_id: number;

  @ManyToOne(() => Keyword, (keyword) => keyword.moderation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'keyword_id'})
  keyword: Keyword;

  @OneToMany(() => KeywordName, (keywordName) => keywordName.keywordModeration, { cascade: true })
  keywordNames: KeywordName[];
}

@Entity('keyword_names')
@Index('UQ_keyword_name_name', ['keyword_id', 'name'], { unique: true })
export class KeywordName extends EntityCommonFull {
  @Column({ type: 'integer', nullable: false, select: true })
  keyword_id: number;

  @ManyToOne(() => Keyword, (keyword) => keyword.names, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'keyword_id'})
  keyword: Keyword;

  @Column({ type: 'varchar', nullable: true, select: false })
  keyword_id_out: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  class_name_before: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  class_name_after: string;

  @ManyToMany(() => Idea, (idea) => idea.keyword_names, { cascade: true })
  ideas: Idea[];

  @Column({ type: 'integer', nullable: true, select: true })
  keyword_moderation_id: number;

  @ManyToOne(() => KeywordModeration, (keywordModeration) => keywordModeration.keywordNames, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'keyword_moderation_id'})
  keywordModeration: KeywordModeration;

}
