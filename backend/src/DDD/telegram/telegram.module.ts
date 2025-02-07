import { DynamicModule, Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramBot } from './telegram.bot';
import { session } from 'telegraf';
import { TelegramSessionsService } from './telegram-sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramSessions } from './entities/telegram-sessions.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from 'src/authorization/auth.module';
import { MainScene } from './scenes/main.scene';
import { RegistrationScene } from './scenes/registration.scene';
import { SubmitPasswordScene } from './scenes/submitPassword.scene';
import { SubmitUsernameScene } from './scenes/submitUsername.scene';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class TelegramModule {
  static forRoot(): DynamicModule {
    const imports = [];
    const providers = [
      TelegramSessionsService,
      MainScene,
      RegistrationScene,
      SubmitPasswordScene,
      SubmitUsernameScene,
      TelegramBot,
    ];

    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (token) {
      imports.push(
        TelegrafModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
            middlewares: [session()],
            include: [TelegramModule],
          }),
          inject: [ConfigService],
        }),
      );
    } else {
      console.log(
        'Telegram bot token is not defined. Telegram bot will not start.',
        'TelegramModule',
      );
    }

    return {
      module: TelegramModule,
      imports: [
        ...imports,
        TypeOrmModule.forFeature([TelegramSessions]),
        UsersModule,
        AuthModule,
      ],
      providers,
    };
  }
}
