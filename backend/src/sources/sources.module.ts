import { Module } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Source])],  
  controllers: [SourcesController],
  providers: [SourcesService],
})
export class SourcesModule {}
