import { Module } from '@nestjs/common';
import { AuthorsModule } from './DDD/authors/authors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Author } from './DDD/authors/entities/author.entity';
import { Source } from './DDD/sources/entities/source.entity';
import { Keyword } from './DDD/keywords/entities/keyword.entity';
import { Idea } from './DDD/ideas/entities/idea.entity';
import { configProvider } from './app.config.provider';
import { SourcesModule } from './DDD/sources/sources.module';
import { KeywordsModule } from './DDD/keywords/keywords.module';
import { IdeasModule } from './DDD/ideas/ideas.module';
import { User } from './DDD/users/entities/user.entity';
import { UsersModule } from './DDD/users/users.module';
import { AuthModule } from './authorization/auth.module';
import { TelegramSessionsModule } from './DDD/telegram-sessions/telegram-sessions.module';
import { TelegramSessions } from './DDD/telegram-sessions/entities/telegram-sessions.entity';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { initialTelegramUserState } from './DDD/telegram-sessions/telegram-sessions.types';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [Author, Source, Keyword, Idea, User, TelegramSessions],
          synchronize: true,
        };
      },
    }),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      async useFactory(
        configService: ConfigService,
      ): Promise<TelegrafModuleOptions> {
        return {
          middlewares: [
            session({
              defaultSession: () => initialTelegramUserState,
            }),
          ],
          token: configService.get('TELEGRAM_BOT_TOKEN'),
        };
      },
    }),

    AuthorsModule,
    SourcesModule,
    KeywordsModule,
    IdeasModule,
    UsersModule,
    AuthModule,
    TelegramSessionsModule,
  ],
  providers: [configProvider],
})
export class AppModule {}
