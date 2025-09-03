import { Module, forwardRef } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { SourcesModule } from '../sources/sources.module';
import { FilesModule } from 'src/files/files.module';
import { ModeratorModule } from '../../shared/services/moderator.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Author]),
    forwardRef(() => SourcesModule),
    FilesModule,
    ModeratorModule,
  ],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
