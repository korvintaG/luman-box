import { ManyToMany, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Idea } from '../../ideas/entities/idea.entity'

@Entity('keywords')
export class Keyword {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar',
              select: false,
              nullable: true})
    id_out: string;
  
    @Column('varchar')
    name: string;

    @ManyToMany(() => Idea, (idea) => idea.keywords, { cascade: true })
    ideas: Idea[];

}
