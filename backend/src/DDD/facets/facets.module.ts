import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacetsController } from './facets.controller';
import { FacetsService } from './facets.service';
import { FacetEntity, FacetMechanism } from './entities/facet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FacetEntity, FacetMechanism])],
  controllers: [FacetsController],
  providers: [FacetsService],
  exports: [FacetsService],
})
export class FacetsModule {}
