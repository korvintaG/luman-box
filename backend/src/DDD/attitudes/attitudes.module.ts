import { Module } from '@nestjs/common';
import { AttitudesService } from './attitudes.service';
import { AttitudesController } from './attitudes.controller';
import { Attitude } from './entities/attitude.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Attitude])],
  controllers: [AttitudesController],
  providers: [AttitudesService],
  exports: [AttitudesService]
})
export class AttitudesModule {}
