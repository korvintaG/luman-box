import { Module } from '@nestjs/common';
import { PostgresFunctionService } from './postgres-function.service';

@Module({
  providers: [PostgresFunctionService],
  exports: [PostgresFunctionService],
})
export class PostgresFunctionModule {}

