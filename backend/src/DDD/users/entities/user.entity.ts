import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', select: false, nullable: true })
  id_out: string;

  //id по чату в TelegramBot
  @Column({ type: 'varchar' })
  chat_id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column('varchar', { select: false })
  password: string;
}
