import { Module } from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { TelegramMessagingModule } from 'src/DDD/telegram/messages/telegram-messages.module';

@Module({
  providers: [ModeratorService],
  imports: [TelegramMessagingModule],
  exports: [ModeratorService],
})
export class ModeratorModule {} 