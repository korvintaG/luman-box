import {
  Req,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { SourcesService } from './sources.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard';
import { RoleGuard } from '../../authorization/guards/role.guard';
import { WithRole } from '../../authorization/decorators/role.decorator';
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { IModerate, Role, StatusCode } from '../../types/custom';
import { FindOptionsWhere } from 'typeorm';
import { Source } from './entities/source.entity';

@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() createSourceDto: CreateSourceDto) {
    return this.sourcesService.create(req.user, createSourceDto);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@Req() req: Request) {
    return this.sourcesService.findAll(req.user);
  }

  @Get('find')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole(Role.SuperAdmin)
  find(
    @Body() findSourceWhere: FindOptionsWhere<Source>,
  ) {
    return this.sourcesService.findByCond(findSourceWhere);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sourcesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateSourceDto: UpdateSourceDto,
  ) {
    return this.sourcesService.update(+id, req.user, updateSourceDto);
  }

  @Post('to-moderate/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(StatusCode.successToModerate)
  toModerate(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.sourcesService.toModerate(+id, req.user);
  }


  @Post('moderate/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole(Role.Admin)
  @HttpCode(StatusCode.successModerate)
  moderate(
    @Param('id') id: string,
    @Req() req: Request,
    @Query() query: IModerate,
  ) {
    return this.sourcesService.moderate(+id, req.user, query);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(StatusCode.successDelete)  
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.sourcesService.remove(+id, req.user);
  }
}
