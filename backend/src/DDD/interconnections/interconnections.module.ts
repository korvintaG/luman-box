import { forwardRef, Module } from '@nestjs/common';
import { InterconnectionsService } from './interconnections.service';
import { InterconnectionsController } from './interconnections.controller';
import { Interconnection } from './entities/interconnection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeratorModule } from '../../shared/services/moderator.module';
import { IdeasModule } from '../ideas/ideas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interconnection]), 
    ModeratorModule, 
    forwardRef(() => IdeasModule),
  ],
  controllers: [InterconnectionsController],
  providers: [InterconnectionsService],
  exports: [InterconnectionsService]
})
export class InterconnectionsModule {}
