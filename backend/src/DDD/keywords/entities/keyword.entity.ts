import { ManyToOne,JoinColumn, ManyToMany, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Idea } from '../../ideas/entities/idea.entity'
import { User } from '../../users/entities/user.entity'


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

    @ManyToOne(() => User, (user) => user.name, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToMany(() => Idea, (idea) => idea.keywords, { cascade: true })
    ideas: Idea[];

}
