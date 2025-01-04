import { Module } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';
import { Idea } from '../ideas/entities/idea.entity';
import { IdeasService } from '../ideas/ideas.service'
import {Author} from '../authors/entities/author.entity'
import { KeywordsService } from '../keywords/keywords.service'
import {Keyword} from '../keywords/entities/keyword.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Source, Idea, Keyword])],  
  controllers: [SourcesController],
  providers: [SourcesService, IdeasService, KeywordsService], 
})
export class SourcesModule {}
