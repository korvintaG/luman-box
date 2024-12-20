import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('authors')
export class Author {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar',
              nullable: true,})
    id_out: string;
  
    @Column('varchar')
    name: string;
  
}
