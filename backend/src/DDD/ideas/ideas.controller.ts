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
import { IdeasService } from './ideas.service';
import { IIdeaBySourceAndKeyword, IModerate, Role, StatusCode } from '../../types/custom';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard';
import { RoleGuard } from '../../authorization/guards/role.guard';
import { WithRole } from '../../authorization/decorators/role.decorator';
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { FindOptionsWhere } from 'typeorm';
import { Idea } from './entities/idea.entity';
import { JwtAuth, JwtAuthOptional, JwtAuthSuperAdmin, JwtAuthUser } from 'src/shared/decorators/api-jwt-auth.decorator';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdeaCreateResponseDto } from './dto/idea-create-response.dto';
import { IdeaFindAllQueryDto } from './dto/idea-find-all-query.dto';
import { IdeaListItemDto } from './dto/idea-list-item.dto';
import { IdeaFindWhereDto } from './dto/idea-find-where.dto';
import { ApiQueryMultiple } from '../../shared/decorators/api-query-multiple.decorator';
import { IdeaFindAllQueryParams } from './dto/idea-find-all-query-params';
import { EntityDeleteResponseDto } from 'src/shared/dto/entity-delete-response.dto';
import { ApiCreateEntityErrors } from 'src/shared/decorators/api-errors.decorator';

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

  @Delete(':id')
  @JwtAuth()
  @HttpCode(StatusCode.successDelete)
  @ApiParam({ name: 'id', description: 'ID идеи', example: 1 })
  @ApiResponse({ status: StatusCode.successDelete, description: 'Результат удаления идеи', type: EntityDeleteResponseDto })
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.ideasService.remove(+id, req.user);
  }


  @Get('/find-by-source-kw/:src/:kw')
  @UseGuards(OptionalJwtAuthGuard)
  findBySourceKw(@Param('src') src: string, @Param('kw') kw: string, @Req() req: Request) {
    return this.ideasService.findBySourceKw(src, kw,req.user);
  }

 
  @Post('find')
  @JwtAuthSuperAdmin()
  @ApiOperation({ description: 'Только для суперадмина для нужд тестирования' })
  @ApiBody({ type: IdeaFindWhereDto, description: 'Условия поиска идей (TypeORM FindOptionsWhere)' })
  @ApiOkResponse({ description: 'Список идей по условию', type: IdeaListItemDto, isArray: true })
  find(
    @Body() findIdeaWhere: FindOptionsWhere<Idea>,
  ) {
    return this.ideasService.findByCond(findIdeaWhere);
  }
  

  @Get(':id')
  @JwtAuthOptional()
  @ApiParam({ name: 'id', description: 'ID идеи', example: 1 })
  @ApiOkResponse({ description: 'Детали идеи', type: IdeaCreateResponseDto })
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.ideasService.findOne(+id,req.user);
  }

  @Get('/for-list/:id')
  @UseGuards(OptionalJwtAuthGuard)
  findForList(@Param('id') id: string, @Req() req: Request) {
    return this.ideasService.findForList(+id,req.user);
  }


  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateIdeaDto: UpdateIdeaDto,
  ) {
    return this.ideasService.update(+id, req.user, updateIdeaDto);
  }

  @Post('to-moderate/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(StatusCode.successToModerate)
  toModerate(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.ideasService.toModerate(+id, req.user);
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
    return this.ideasService.moderate(+id, req.user, query);
  }

}
