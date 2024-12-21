import { Module } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea  } from './entities/idea.entity';
import { Keyword } from '../keywords/entities/keyword.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Idea, Keyword])],  
  controllers: [IdeasController],
  providers: [IdeasService],
})
export class IdeasModule {}
