import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ITelegramUser } from '../telegram.types';

@Entity({ name: 'telegram-sessions' })
export class TelegramSessions implements ITelegramUser {
  @PrimaryColumn()
  chat_id: number;

  @Column()
  user_id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  msg_to_del: number;
}
