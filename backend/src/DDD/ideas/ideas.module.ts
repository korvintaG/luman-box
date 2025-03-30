import { Module } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './entities/idea.entity';
import { KeywordsModule } from '../keywords/keywords.module';
import { AttitudesModule } from '../attitudes/attitudes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Idea]), KeywordsModule, AttitudesModule],
  controllers: [IdeasController],
  providers: [IdeasService],
  exports: [IdeasService],
})
export class IdeasModule {}
