import { Module, forwardRef } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from './entities/source.entity';
import { IdeasModule } from '../ideas/ideas.module';
import { FilesModule } from 'src/files/files.module';
import { ModeratorModule } from '../../shared/services/moderator/moderator.module';
import { AuthorsModule } from '../authors/authors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Source]), 
    IdeasModule, 
    FilesModule, 
    ModeratorModule, 
    forwardRef(() => AuthorsModule),
  ],
  controllers: [SourcesController],
  providers: [SourcesService],
  exports: [SourcesService],
})
export class SourcesModule {}
