import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramBot } from './telegram.bot';
import { session } from 'telegraf';
import { TelegramSessionsService } from './telegram-sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramSessions } from './entities/telegram-sessions.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from 'src/authorization/auth.module';
import { MainScene } from './scenes/main.scene';
import { AuthorsScene } from './scenes/authors.scene';
import { ContactsScene } from './scenes/contacts.scene';
import { IdeasScene } from './scenes/ideas.scene';
import { KeywordsScene } from './scenes/keywords.scene';
import { RegistrationScene } from './scenes/registration.scene';
import { SourcesScene } from './scenes/sources.scene';
import { SubmitPasswordScene } from './scenes/submitPassword.scene';
import { SubmitUsernameScene } from './scenes/submitUsername.scene';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: () => ({
        token: process.env.TELEGRAM_BOT_TOKEN,
        middlewares: [session()],
        include: [TelegramModule],
      }),
    }),
    TypeOrmModule.forFeature([TelegramSessions]),
    UsersModule,
    AuthModule,
  ],

  providers: [
    TelegramBot,
    TelegramSessionsService,
    MainScene,
    AuthorsScene,
    ContactsScene,
    IdeasScene,
    KeywordsScene,
    RegistrationScene,
    SourcesScene,
    SubmitPasswordScene,
    SubmitUsernameScene,
  ],
})
export class TelegramModule {}
