import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Source } from '../sources/entities/source.entity';
import { Idea } from '../ideas/entities/idea.entity';
import { SourcesService } from 'src/sources/sources.service';
import { IdeasService } from 'src/ideas/ideas.service';
import { KeywordsService } from 'src/keywords/keywords.service';
import { Keyword } from 'src/keywords/entities/keyword.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Author, Source, Idea, Keyword])],
  controllers: [AuthorsController],
  providers: [AuthorsService, SourcesService, IdeasService, KeywordsService],
})
export class AuthorsModule {}
