import { Module } from '@nestjs/common';
import { AuthorsModule } from './authors/authors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author  } from './authors/entities/author.entity';
import { Source  } from './sources/entities/source.entity';
import { Keyword  } from './keywords/entities/keyword.entity';
import { Idea  } from './ideas/entities/idea.entity';
import { configProvider } from './app.config.provider';
import { SourcesModule } from './sources/sources.module';
import { KeywordsModule } from './keywords/keywords.module';
import { IdeasModule } from './ideas/ideas.module';


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
