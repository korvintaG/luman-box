import { JoinColumn, ManyToOne, Index, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Min, Max, IsInt, IsString, MinLength, MaxLength } from 'class-validator';
import { Idea } from '../../ideas/entities/idea.entity';
import { User } from '../../users/entities/user.entity';
import { EntityCommon } from 'src/shared/entities/abstract.entity';

@Entity({ name: 'interconnections' })
@Index(['idea1_id', 'idea2_id', 'interconnection_type'], { unique: true })
export class Interconnection extends EntityCommon{

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

}


