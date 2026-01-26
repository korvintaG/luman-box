import {
  Req,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/files/multer.config';
import { FilesService } from './files.service';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuth } from 'src/shared/decorators/api-jwt-auth.decorator';
import { UploadImageResponseDto } from './dto/upload-image-response.dto';
import { UploadImageDto } from './dto/upload-image.dto';

@Controller('files')
@ApiTags('Загрузка файлов')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @JwtAuth()
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiOperation({ description: 'Загрузка изображения' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImageDto })
  @ApiOkResponse({ description: 'Изображение успешно загружено', type: UploadImageResponseDto })
  uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.filesService.uploadImage(file, req);
  }

}
