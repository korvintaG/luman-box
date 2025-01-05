import { Module } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea  } from './entities/idea.entity';
import { Keyword } from '../keywords/entities/keyword.entity';
import {KeywordsService} from '../keywords/keywords.service'


@Module({
  imports: [TypeOrmModule.forFeature([Idea, Keyword])],  
  controllers: [IdeasController],
  providers: [IdeasService, KeywordsService],
})
export class IdeasModule {}
