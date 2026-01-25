import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword, KeywordName, KeywordModeration } from './entities/keyword.entity';
import { ModeratorModule } from '../../shared/services/moderator/moderator.module';
import { PostgresFunctionModule } from '../../shared/services/postgres-function/postgres-function.module';
import { KeywordsValidationService } from './keywords-validation.service';
import { KeywordsModerationService } from './keywords-moderation.service';
import { KeywordsHelperService } from './keywords-helper.service';
import { TelegramMessagingModule } from '../telegram/messages/telegram-messages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Keyword, KeywordName, KeywordModeration]),
    ModeratorModule,
    PostgresFunctionModule,
    TelegramMessagingModule,
  ],
  controllers: [KeywordsController],
  providers: [KeywordsService, KeywordsValidationService, KeywordsModerationService, KeywordsHelperService],
  exports: [KeywordsService, KeywordsModerationService],
})
export class KeywordsModule {}
