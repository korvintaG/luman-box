import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Source } from '../sources/entities/source.entity';
import { Idea } from '../ideas/entities/idea.entity';
import { SourcesService } from '../sources/sources.service';
import { IdeasService } from '../ideas/ideas.service';
import { KeywordsService } from '../keywords/keywords.service';
import { Keyword } from '../keywords/entities/keyword.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Author, Source, Idea, Keyword])],
  controllers: [AuthorsController],
  providers: [AuthorsService, SourcesService, IdeasService, KeywordsService],
})
export class AuthorsModule {}
