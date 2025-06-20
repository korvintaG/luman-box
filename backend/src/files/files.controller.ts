import {
  Req,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/authorization/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/files/multer.config';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @UseGuards(JwtAuthGuard)
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.filesService.uploadImage(file, req);
  }

}
