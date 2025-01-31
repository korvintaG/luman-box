import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramSessionsService } from './telegram-sessions.service';
import { TelegramSessionsController } from './telegram-sessions.controller';
import { TelegramSessions } from './entities/telegram-sessions.entity';
import { TelegramUserBot } from './telegram-sessions.bot';
import { UsersModule } from '../users/users.module';
import { MainScene } from './scenes/main.scene';
import { SubmitUsernameScene } from './scenes/submitUsername.scene';
import { AuthorsScene } from './scenes/authors.scene';
import { SourcesScene } from './scenes/sources.scene';
import { IdeasScene } from './scenes/ideas.scene';
import { KeywordsScene } from './scenes/keywords.scene';
import { ContactsScene } from './scenes/contacts.scene';
import { SubmitPasswordScene } from './scenes/submitPassword.scene';
import { RegistrationScene } from './scenes/registration.scene';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramSessions]), UsersModule],
  controllers: [TelegramSessionsController],
  providers: [
    TelegramSessionsService,
    TelegramUserBot,
    MainScene,
    RegistrationScene,
    SubmitUsernameScene,
    SubmitPasswordScene,
    AuthorsScene,
    SourcesScene,
    IdeasScene,
    KeywordsScene,
    ContactsScene,
  ],
  exports: [TelegramSessionsService, TelegramUserBot],
})
export class TelegramSessionsModule {}
