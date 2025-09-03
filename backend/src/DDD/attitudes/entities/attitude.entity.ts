import { JoinColumn, ManyToOne, Index, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Min, Max, IsInt } from 'class-validator';
import { Idea } from '../../ideas/entities/idea.entity';
import { User } from '../../users/entities/user.entity';
import { EntityCreation} from '../../../shared/entities/abstract.entity';

@Entity({ name: 'attitudes' })
@Index(['idea_id', 'user_id'], { unique: true })
export class Attitude extends EntityCreation {

  @Column({ type: 'integer', nullable: false }) 
  idea_id: number;

  @ManyToOne(() => Idea, (idea) => idea.attitudes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idea_id' })
  idea: Idea;  

  @Column({ type: 'smallint', default:0 })
  @IsInt() // Проверка, что значение целое
  @Min(0)  // Минимальное значение = 0
  @Max(4)  // Максимальное значение = 4
  like: number;

  @Column({ type: 'smallint', default:0 })
  @IsInt() // Проверка, что значение целое
  @Min(0)  // Минимальное значение = 0
  @Max(4)  // Максимальное значение = 4
  importance: number;

  @Column({ type: 'smallint', default:0 })
  @IsInt() // Проверка, что значение целое
  @Min(0)  // Минимальное значение = 0
  @Max(4)  // Максимальное значение = 4
  truth: number;

}
