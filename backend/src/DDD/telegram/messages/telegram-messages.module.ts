import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramMessagingService } from './telegram-messages.service';
import { TelegramMessage } from './entities/telegram-message.entity';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramMessage]), UsersModule],
  providers: [TelegramMessagingService],
  exports: [TelegramMessagingService],
})
export class TelegramMessagingModule {}
