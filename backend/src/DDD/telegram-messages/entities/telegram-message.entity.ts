import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'telegram_message' })
export class TelegramMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  chat_id: string;

  @Column({ default: 0 })
  status: number;

  @Column({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_time_create: Date;

  @Column({ type: 'timestamp', precision: 0, default: null })
  date_time_send: Date | null;

  @Column()
  text: string;
}
