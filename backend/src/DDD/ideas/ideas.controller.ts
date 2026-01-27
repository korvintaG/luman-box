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
import { IdeasService } from './ideas.service';
import { IIdeaBySourceAndKeyword, IModerate, Role, StatusCode } from '../../types/custom';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { FindOptionsWhere } from 'typeorm';
import { Idea } from './entities/idea.entity';
import { JwtAuth, JwtAuthAdmin, JwtAuthOptional, JwtAuthSuperAdmin, JwtAuthUser } from 'src/shared/decorators/api-jwt-auth.decorator';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdeaCreateResponseDto } from './dto/idea-create-response.dto';
import { IdeaFindAllQueryDto } from './dto/idea-find-all-query.dto';
import { IdeaListItemDto } from './dto/idea-list-item.dto';
import { IdeaFindWhereDto } from './dto/idea-find-where.dto';
import { ApiQueryMultiple } from '../../shared/decorators/api-query-multiple.decorator';
import { IdeaFindAllQueryParams } from './dto/idea-find-all-query-params';
import { EntityDeleteResponseDto } from 'src/shared/dto/entity-delete-response.dto';
import { ApiCreateEntityErrors, ApiDeleteEntityErrors, ApiFindAllEntityErrors, ApiGetEntityErrors, ApiModerateEntityErrors, ApiToModerateEntityErrors, ApiUpdateEntityErrors } from 'src/shared/decorators/api-errors.decorator';
import { EntityToModerateResponseDto } from 'src/shared/dto/entity-to-moderate-response.dto';
import { EntityModerateResponseDto } from 'src/shared/dto/entity-moderate-response.dto';

@ApiTags('Идеи')
@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Post()
  @JwtAuthUser()
  @ApiOkResponse({ description: 'Добавленная идея', type: IdeaCreateResponseDto })
  @ApiCreateEntityErrors()
  create(@Req() req: Request, @Body() createIdeaDto: CreateIdeaDto) {
    return this.ideasService.create(req.user, createIdeaDto);
  }

  @Get()
  @JwtAuthOptional()
  @ApiOperation({ description: 'Получить список идей. Все query-параметры опциональны. Если указаны оба параметра (source_id и keyword_id), выполняется фильтрация по источнику и ключевому слову.' })
  @ApiQueryMultiple(IdeaFindAllQueryParams)
  @ApiOkResponse({ description: 'Список идей', type: IdeaListItemDto, isArray: true })
  @ApiFindAllEntityErrors()
  findAll(
    @Req() req: Request,
    @Query() query: Partial<IIdeaBySourceAndKeyword>,
  ) {
    if (query.keyword_id && query.source_id)
      return this.ideasService.findBySrcKw(req.user, {
        source_id: query.source_id,
        keyword_id: query.keyword_id,
      });
    else return this.ideasService.findAll(req.user);
  }

  @Get(':id')
  @JwtAuthOptional()
  @ApiOkResponse({ description: 'Детали идеи', type: IdeaCreateResponseDto })
  @ApiGetEntityErrors()
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.ideasService.findOne(+id,req.user);
  }

  @Patch(':id')
  @JwtAuth()
  @ApiOkResponse({ description: 'Обновленная идея', type: IdeaCreateResponseDto })  
  @ApiUpdateEntityErrors()
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateIdeaDto: UpdateIdeaDto,
  ) {
    return this.ideasService.update(+id, req.user, updateIdeaDto);
  }
  
  @Delete(':id')
  @JwtAuth()
  @HttpCode(StatusCode.successDelete)
  @ApiResponse({ status: StatusCode.successDelete, description: 'Результат удаления идеи', type: EntityDeleteResponseDto })
  @ApiDeleteEntityErrors()
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.ideasService.remove(+id, req.user);
  }

  @Get('/find-by-source-kw/:src/:kw')
  @JwtAuthOptional()
  @ApiOkResponse({ description: 'Идеи по источнику и ключевому слову', type: IdeaListItemDto, isArray: true })
  @ApiFindAllEntityErrors()
  findBySourceKw(@Param('src') src: string, 
    @Param('kw') kw: string, 
    @Req() req: Request) {
    return this.ideasService.findBySourceKw(src, kw,req.user);
  }
 
  @Post('find')
  @JwtAuthSuperAdmin()
  @HttpCode(StatusCode.successFind)
  @ApiOperation({ description: 'Только для суперадмина для нужд тестирования' })
  @ApiBody({ type: IdeaFindWhereDto, description: 'Условия поиска идей (TypeORM FindOptionsWhere)' })
  @ApiResponse({ status: StatusCode.successFind, description: 'Список идей по условию', type: IdeaListItemDto, isArray: true })
  @ApiFindAllEntityErrors()
  find(
    @Body() findIdeaWhere: FindOptionsWhere<Idea>,
  ) {
    return this.ideasService.findByCond(findIdeaWhere);
  }
  

  @Get('/for-list/:id')
  @JwtAuthOptional()
  @ApiGetEntityErrors()
  findForList(@Param('id') id: string, @Req() req: Request) {
    return this.ideasService.findForList(+id,req.user);
  }

  @Post('to-moderate/:id')
  @JwtAuth()
  @HttpCode(StatusCode.successToModerate)
  @ApiOkResponse({ description: 'Результат перевода в модерацию', type: EntityToModerateResponseDto })
  @ApiToModerateEntityErrors()
  toModerate(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.ideasService.toModerate(+id, req.user);
  }

  @Post('moderate/:id')
  @JwtAuthAdmin()
  @HttpCode(StatusCode.successModerate)
  @ApiOkResponse({ description: 'Результат модерации автора', type: EntityModerateResponseDto })
  @ApiModerateEntityErrors()
  moderate(
    @Param('id') id: string,
    @Req() req: Request,
    @Query() query: IModerate,
  ) {
    return this.ideasService.moderate(+id, req.user, query);
  }

}
