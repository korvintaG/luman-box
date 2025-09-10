import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../../../types/custom';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', select: false, nullable: true })
  id_out: string;

  //id по чату в TelegramBot
  @Column({ type: 'varchar', nullable: true, default: '' })
  chat_id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column('varchar', { select: false })
  password: string;

  // варианты:
  // =0 - обычный
  // =1 - админ
  // =2 - удаленный
  // =3 - суперадмин
  @Column({ type: 'int', default: 0 })
  role_id: Role;

  /*@OneToMany(() => Attitude, (attitude) => attitude.user)
  attitudes: Attitude[];*/

}
