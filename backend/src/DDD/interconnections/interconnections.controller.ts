import { Req, Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode } from '@nestjs/common';
import { InterconnectionsService } from './interconnections.service';
import { InterconnectionEntityDto } from './dto/create-interconnection.dto';
import { UpdateInterconnectionDto } from './dto/update-interconnection.dto';
import { Request } from 'express';
import { IModerate, StatusCode } from 'src/types/custom';
import { FindOptionsWhere } from 'typeorm';
import { Interconnection } from './entities/interconnection.entity';
import { JwtAuth, JwtAuthAdmin, JwtAuthOptional, JwtAuthSuperAdmin, JwtAuthUser } from 'src/shared/decorators/api-jwt-auth.decorator';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InterconnectionCreateResponceDto } from './dto/interconnection-create-responce.dto';
import { InterconnectionByIdeaAndTypeResponseDto } from './dto/interconnection-by-idea-and-type-response.dto';
import { InterconnectionCountItemDto } from './dto/interconnection-count-response.dto';
import { InterconnectionFindWhereDto } from './dto/interconnection-find-where.dto';
import { ApiCreateEntityErrors, ApiDeleteEntityErrors, ApiFindAllEntityErrors, ApiGetEntityErrors, ApiModerateEntityErrors, ApiToModerateEntityErrors, ApiUpdateEntityErrors } from 'src/shared/decorators/api-errors.decorator';
import { EntityToModerateResponseDto } from 'src/shared/dto/entity-to-moderate-response.dto';
import { EntityModerateResponseDto } from 'src/shared/dto/entity-moderate-response.dto';

@ApiTags('Взаимосвязи')
@Controller('interconnections')
export class InterconnectionsController {
  constructor(private readonly interconnectionsService: InterconnectionsService) {}

  @Post()
  @JwtAuthUser()
  @ApiOkResponse({ description: 'Созданная связь', type: InterconnectionCreateResponceDto })
  @ApiCreateEntityErrors()
  create(@Req() req: Request, @Body() interconnectionEntityDto: InterconnectionEntityDto) {
    return this.interconnectionsService.create(req.user,interconnectionEntityDto);
  }

  @Get('/count-by-idea/:idea_id')
  @JwtAuthOptional()
  @ApiParam({ name: 'idea_id', description: 'ID идеи', example: 1 })
  @ApiOkResponse({ description: 'Калькуляция взаимосвязей идеи по типам', type: InterconnectionCountItemDto, isArray: true })
  @ApiFindAllEntityErrors()
  countByIdea(@Param('idea_id') idea_id: string, @Req() req: Request) {
    return this.interconnectionsService.countAllByIdea(+idea_id, req.user);
  }

  @Get('/by-idea-and-type/:idea_id/:type_id')
  @JwtAuthOptional()
  @ApiParam({ name: 'idea_id', description: 'ID идеи', example: 1 })
  @ApiParam({ name: 'type_id', description: 'ID типа взаимосвязи', example: 1 })
  @ApiOkResponse({ description: 'Взаимосвязи идеи по типу', type: InterconnectionByIdeaAndTypeResponseDto })
  @ApiFindAllEntityErrors()
  findAllByIdeaAndType(@Param('idea_id') idea_id: string, 
    @Param('type_id') type_id: string, 
    @Req() req: Request) {
    return this.interconnectionsService.getByIdeaAndType(+idea_id,+type_id, req.user);
  }

  @Get(':id')
  @JwtAuthOptional()
  @ApiParam({ name: 'id', description: 'ID взаимосвязи', example: 1 })
  @ApiOkResponse({ description: 'Детали взаимосвязи', type: InterconnectionCreateResponceDto })
  @ApiGetEntityErrors()
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.interconnectionsService.findOne(+id, req.user);
  }

  @Patch(':id')
  @JwtAuth()
  @ApiParam({ name: 'id', description: 'ID взаимосвязи', example: 1 })
  @ApiBody({ type: UpdateInterconnectionDto, description: 'Частичное обновление взаимосвязи' })
  @ApiOkResponse({ description: 'Обновленная взаимосвязь', type: InterconnectionCreateResponceDto })
  @ApiUpdateEntityErrors()
  update(@Req() req: Request, @Param('id') id: string, @Body() updateInterconnectionDto: UpdateInterconnectionDto) {
    return this.interconnectionsService.update(req.user, +id, updateInterconnectionDto);
  }

  @Delete(':id')
  @JwtAuth()
  @HttpCode(StatusCode.successDelete)
  @ApiDeleteEntityErrors()
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.interconnectionsService.remove(req.user,+id);
  }

  @Post('find')
  @JwtAuthSuperAdmin()
  @HttpCode(StatusCode.successFind)
  @ApiOperation({ description: 'Только для суперадмина для нужд тестирования' })
  @ApiBody({ type: InterconnectionFindWhereDto, description: 'Условия поиска взаимосвязей (TypeORM FindOptionsWhere)' })
  @ApiResponse({ status: StatusCode.successFind, description: 'Список взаимосвязей по условию', type: InterconnectionCreateResponceDto, isArray: true })
  @ApiFindAllEntityErrors()
  find(
    @Body() findInterconnectionWhere: FindOptionsWhere<Interconnection>,
  ) {
    return this.interconnectionsService.findByCond(findInterconnectionWhere);
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
    return this.interconnectionsService.toModerate(+id, req.user);
  }

  @Post('moderate/:id')
  @JwtAuthAdmin()
  @HttpCode(StatusCode.successModerate)
  @ApiOkResponse({ description: 'Результат модерации взаимосвязи', type: EntityModerateResponseDto })
  @ApiModerateEntityErrors()
  moderate(
    @Param('id') id: string,
    @Req() req: Request,
    @Query() query: IModerate,
  ) {
    return this.interconnectionsService.moderate(+id, req.user, query);
  }

}
