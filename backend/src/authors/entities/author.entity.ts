import { OneToMany, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Source } from '../../sources/entities/source.entity'

@Entity('authors')
export class Author {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar',
              select: false,
              nullable: true})
    id_out: string;
  
    @Column('varchar')
    name: string;

    @OneToMany(() => Source, (source) => source.author)
    sources: Source[];
 
}
