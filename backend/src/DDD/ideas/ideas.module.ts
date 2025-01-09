import { Module } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea  } from './entities/idea.entity';
import { KeywordsModule} from '../keywords/keywords.module';

@Module({
  imports: [TypeOrmModule.forFeature([Idea]),KeywordsModule],  
  controllers: [IdeasController],
  providers: [IdeasService],
  exports: [IdeasService]
})
export class IdeasModule {}
