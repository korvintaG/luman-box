import { Module } from '@nestjs/common';
import { InterconnectionsService } from './interconnections.service';
import { InterconnectionsController } from './interconnections.controller';
import { Interconnection } from './entities/interconnection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Interconnection])],
  controllers: [InterconnectionsController],
  providers: [InterconnectionsService],
  exports: [InterconnectionsService]
})
export class InterconnectionsModule {}
