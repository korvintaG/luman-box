import { forwardRef, Module } from '@nestjs/common';
import { AttitudesService } from './attitudes.service';
import { AttitudesController } from './attitudes.controller';
import { Attitude } from './entities/attitude.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from '../ideas/entities/idea.entity';
import { IdeasModule } from '../ideas/ideas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attitude]), forwardRef(() => IdeasModule)],
  controllers: [AttitudesController],
  providers: [AttitudesService],
  exports: [AttitudesService]
})
export class AttitudesModule {}
