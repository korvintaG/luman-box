import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar',
              select: false,
              nullable: true})
    id_out: string;
  
    @Column({type:'varchar', unique: true })
    name: string;

    @Column('varchar', {select: false})
    password: string;

}
