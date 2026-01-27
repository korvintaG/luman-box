import {
  Req,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { SourcesService } from './sources.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { IModerate, StatusCode } from '../../types/custom';
import { FindOptionsWhere } from 'typeorm';
import { Source } from './entities/source.entity';
import { JwtAuth, JwtAuthAdmin, JwtAuthAdminSuperAdmin, JwtAuthOptional, JwtAuthSuperAdmin, JwtAuthUser } from '../../shared/decorators/api-jwt-auth.decorator';
import { ApiBody, ApiExtraModels, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { SourceCreateResponseDto } from './dto/source-create-response.dto';
import { SourceListItemDto, SourceAuthorDto } from './dto/source-list-item.dto';
import { SourceFindWhereDto } from './dto/source-find-where.dto';
import { ApiCreateEntityErrors, ApiDeleteEntityErrors, ApiFindAllEntityErrors, ApiGetEntityErrors, ApiModerateEntityErrors, ApiToModerateEntityErrors, ApiUpdateEntityErrors } from 'src/shared/decorators/api-errors.decorator';
import { EntityToModerateResponseDto } from 'src/shared/dto/entity-to-moderate-response.dto';
import { EntityModerateResponseDto } from 'src/shared/dto/entity-moderate-response.dto';
import { EntityDeleteResponseDto } from 'src/shared/dto/entity-delete-response.dto';

@ApiTags('Источники')
@ApiExtraModels(SourceListItemDto, SourceAuthorDto)
@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Post() 
  @JwtAuthUser()
  @ApiOkResponse({ description: 'Созданный источник', type: SourceCreateResponseDto })
  @ApiCreateEntityErrors()
  create(@Req() req: Request, @Body() createSourceDto: CreateSourceDto) {
    return this.sourcesService.create(req.user, createSourceDto);
  }

  @Get()
  @JwtAuthOptional()
  @ApiOkResponse({description: 'Список источников',type: SourceListItemDto,isArray: true})
  @ApiFindAllEntityErrors()
  findAll(@Req() req: Request) {
    return this.sourcesService.findAll(req.user);
  }

  @Get(':id')
  @JwtAuthOptional()
  @ApiParam({ name: 'id', description: 'ID источника', example: 1 })
  @ApiOkResponse({ description: 'Детали источника', type: SourceCreateResponseDto })
  @ApiGetEntityErrors()
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.sourcesService.findOne(+id, req.user);
  }

  @Post('find')
  @JwtAuthSuperAdmin()
  @HttpCode(StatusCode.successFind)
  @ApiOperation({ description: 'Только для суперадмина для нужд тестирования' })
  @ApiBody({ type: SourceFindWhereDto, description: 'Условия поиска источников (TypeORM FindOptionsWhere)' })
  @ApiResponse({ status: StatusCode.successFind, description: 'Список источников по условию', type: SourceListItemDto, isArray: true })
  @ApiFindAllEntityErrors()
  find(
    @Body() findSourceWhere: FindOptionsWhere<Source>,
  ) {
    return this.sourcesService.findByCond(findSourceWhere);
  }

  @Patch(':id')
  @JwtAuth()
  @ApiBody({ type: UpdateSourceDto, description: 'Частичное обновление источника' })
  @ApiOkResponse({ description: 'Обновленный источник', type: SourceCreateResponseDto })
  @ApiUpdateEntityErrors()
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateSourceDto: UpdateSourceDto,
  ) {
    return this.sourcesService.update(+id, req.user, updateSourceDto);
  }

  @Delete(':id')
  @JwtAuth()
  @HttpCode(StatusCode.successDelete)  
  @ApiResponse({ status: StatusCode.successDelete, description: 'Результат удаления источника', type: EntityDeleteResponseDto })
  @ApiDeleteEntityErrors()
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.sourcesService.remove(+id, req.user);
  }

  @Post('to-moderate/:id')
  @JwtAuthUser()
  @HttpCode(StatusCode.successToModerate)
  @ApiOkResponse({ description: 'Результат перевода в модерацию', type: EntityToModerateResponseDto })
  @ApiToModerateEntityErrors()
  toModerate(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.sourcesService.toModerate(+id, req.user);
  }


  @Post('moderate/:id')
  @JwtAuthAdminSuperAdmin()
  @HttpCode(StatusCode.successModerate)
  @ApiOkResponse({ description: 'Результат модерации источника', type: EntityModerateResponseDto })
  @ApiModerateEntityErrors()
  moderate(
    @Param('id') id: string,
    @Req() req: Request,
    @Query() query: IModerate,
  ) {
    return this.sourcesService.moderate(+id, req.user, query);
  }

} 
