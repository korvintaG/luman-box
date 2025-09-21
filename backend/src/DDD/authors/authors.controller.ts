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
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { RoleGuard } from '../../authorization/guards/role.guard';
import { WithRole } from '../../authorization/decorators/role.decorator';
import { IModerate, Role, StatusCode } from '../../types/custom';
import { FindOptionsWhere } from 'typeorm';
import { Author } from './entities/author.entity';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(req.user, createAuthorDto);
  }


  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@Req() req: Request) {
    return this.authorsService.findAll(req.user);
  }

  @Get('find')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole(Role.SuperAdmin)
  find(
    @Body() findAuthorWhere: FindOptionsWhere<Author>,
  ) {
    return this.authorsService.findByCond(findAuthorWhere);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.authorsService.findOne(+id, req.user);
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


  @Post('to-moderate/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(StatusCode.successToModerate)
  toModerate(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.authorsService.toModerate(+id, req.user);
  }


  @Post('moderate/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(StatusCode.successModerate)
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
  @HttpCode(StatusCode.successDelete)
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.authorsService.remove(+id, req.user);
  }
}
