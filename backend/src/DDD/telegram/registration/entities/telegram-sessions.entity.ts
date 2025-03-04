import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ITelegramUser } from '../telegram.types';


@Entity({ name: 'telegram_sessions' })
export class TelegramSessions implements ITelegramUser {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ unique: true })
  @Index()
  chat_id: string;

  @Column()
  user_id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  msg_to_del: number;
}
