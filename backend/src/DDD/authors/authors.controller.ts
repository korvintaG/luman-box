import {
  Req,
  Query,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { RoleGuard } from '../../authorization/guards/role.guard';
import { WithRole } from '../../authorization/decorators/role.decorator';
import { IModerate, Role } from '../../types/custom';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/files/multer.config';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(req.user, createAuthorDto);
  }

 /* @Post('upload-photo')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadPhoto(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    // Здесь file содержит информацию о загруженном файле
    // Можно сохранить путь к файлу в базе данных
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }

    if (!file) {
      throw new BadRequestException('Файл не был загружен');
    }
    return {
      message: 'Photo uploaded successfully',
      filename: file.filename,
      path: file.path,
    };
  }*/

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@Req() req: Request) {
    return this.authorsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorsService.update(+id, req.user, updateAuthorDto);
  }

  @Post('moderate/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole(Role.Admin)
  moderate(
    @Param('id') id: string,
    @Req() req: Request,
    @Query() query: IModerate,
  ) {
    return this.authorsService.moderate(+id, req.user, query);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.authorsService.remove(+id, req.user);
  }
}
