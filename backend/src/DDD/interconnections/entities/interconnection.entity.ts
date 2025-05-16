import { JoinColumn, ManyToOne, Index, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Min, Max, IsInt, IsString, MinLength, MaxLength } from 'class-validator';
import { Idea } from '../../ideas/entities/idea.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'interconnections' })
@Index(['idea1_id', 'idea2_id', 'interconnection_type'], { unique: true })
export class Interconnection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', select: false, nullable: true })
  id_out: string;

  @Column({ type: 'smallint', nullable: false})
  @IsInt() // Проверка, что значение целое
  @Min(0)  // Минимальное значение = 0
  @Max(30)  // Минимальное значение = 0
  interconnection_type: number;

  @Column({ type: 'integer', nullable: false }) 
  @IsInt() // Проверка, что значение целое
  idea1_id: number;

  @Column({ type: 'integer', nullable: false }) 
  @Index()
  @IsInt() // Проверка, что значение целое
  idea2_id: number;

  @Column({ type: 'integer', nullable: false })  // кто добавил
  @IsInt() // Проверка, что значение целое
  user_id: number;

  @ManyToOne(() => User, (user) => user.name, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Idea, (idea) => idea.attitudes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idea1_id' })
  idea1: Idea;  

  @ManyToOne(() => Idea, (idea) => idea.attitudes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idea2_id' })
  idea2: Idea;  

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @MinLength(10)
  @MaxLength(250)
  name_direct: string;

  @Column({ type: 'text', nullable: false })
  @IsString()
  @MinLength(10)
  @MaxLength(250)
  name_reverse: string;

  @Column({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_time_create: Date;

  @Column({ type: 'int', nullable: true, name: 'moderated' })
  moderated: number;

  @ManyToOne(() => User, (user) => user.name, { nullable: true })
  @JoinColumn({ name: 'moderated' })
  moderator: User;

  @Column({
    type: 'timestamp',
    nullable: true,
    precision: 0
  })
  date_time_moderated: Date;

}


