import { Module } from '@nestjs/common';
import { AuthorsModule } from './DDD/authors/authors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author  } from './DDD/authors/entities/author.entity';
import { Source  } from './DDD/sources/entities/source.entity';
import { Keyword  } from './DDD/keywords/entities/keyword.entity';
import { Idea  } from './DDD/ideas/entities/idea.entity';
import { configProvider } from './app.config.provider';
import { SourcesModule } from './DDD/sources/sources.module';
import { KeywordsModule } from './DDD/keywords/keywords.module';
import { IdeasModule } from './DDD/ideas/ideas.module';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: configProvider.useValue.database.username,
    password: configProvider.useValue.database.password,
    database: configProvider.useValue.database.databaseName,
    entities: [Author, Source, Keyword, Idea],
    synchronize: true,
  }), AuthorsModule, SourcesModule, KeywordsModule, IdeasModule],
  providers: [configProvider],
})
export class AppModule {}
