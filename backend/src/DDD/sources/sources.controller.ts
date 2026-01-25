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
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { IModerate, StatusCode } from '../../types/custom';
import { FindOptionsWhere } from 'typeorm';
import { Source } from './entities/source.entity';
import { JwtAuth, JwtAuthAdmin, JwtAuthOptional, JwtAuthSuperAdmin, JwtAuthUser } from '../../shared/decorators/api-jwt-auth.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SourceCreateResponseDto } from './dto/source-create-response.dto';

@ApiTags('Источники')
@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Post() 
  @JwtAuthUser()
  @ApiOkResponse({ description: 'Созданный источник', type: SourceCreateResponseDto })
  create(@Req() req: Request, @Body() createSourceDto: CreateSourceDto) {
    return this.sourcesService.create(req.user, createSourceDto);
  }

  @Get()
  @JwtAuthOptional()
  findAll(@Req() req: Request) {
    return this.sourcesService.findAll(req.user);
  }

  @Get('find')
  @JwtAuthSuperAdmin()
  find(
    @Body() findSourceWhere: FindOptionsWhere<Source>,
  ) {
    return this.sourcesService.findByCond(findSourceWhere);
  }


  @Get(':id')
  @JwtAuthOptional()
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.sourcesService.findOne(+id, req.user);
  }

  @Patch(':id')
  @JwtAuth()
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateSourceDto: UpdateSourceDto,
  ) {
    return this.sourcesService.update(+id, req.user, updateSourceDto);
  }

  @Post('to-moderate/:id')
  @JwtAuth()
  @HttpCode(StatusCode.successToModerate)
  toModerate(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.sourcesService.toModerate(+id, req.user);
  }


  @Post('moderate/:id')
  @JwtAuthAdmin()
  @HttpCode(StatusCode.successModerate)
  moderate(
    @Param('id') id: string,
    @Req() req: Request,
    @Query() query: IModerate,
  ) {
    return this.sourcesService.moderate(+id, req.user, query);
  }

  @Delete(':id')
  @JwtAuth()
  @HttpCode(StatusCode.successDelete)  
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.sourcesService.remove(+id, req.user);
  }
} 
