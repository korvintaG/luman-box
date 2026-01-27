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
import { KeywordsService } from './keywords.service';
import { KeywordsModerationService } from './keywords-moderation.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { IModerate, StatusCode } from '../../types/custom';
import { FindOptionsWhere } from 'typeorm';
import { Keyword } from './entities/keyword.entity';
import { FindKeywordDto } from './dto/find-keyword.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuth, JwtAuthAdminSuperAdmin, JwtAuthOptional, JwtAuthSuperAdmin, JwtAuthUser } from 'src/shared/decorators/api-jwt-auth.decorator';
import { KeywordCreateResponceDto } from './dto/keyword-create-responce.dto';
import { KeywordByClassResponseDto, KeywordItemDto } from './dto/keyword-by-class-response.dto';
import { KeywordFindWhereDto } from './dto/keyword-find-where.dto';
import { KeywordSummaryDto } from './dto/keyword-summary.dto';
import { ApiCreateEntityErrors, ApiDeleteEntityErrors, ApiFindAllEntityErrors, ApiGetEntityErrors, ApiModerateEntityErrors, ApiToModerateEntityErrors, ApiUpdateEntityErrors } from 'src/shared/decorators/api-errors.decorator';
import { EntityToModerateResponseDto } from 'src/shared/dto/entity-to-moderate-response.dto';
import { EntityModerateResponseDto } from 'src/shared/dto/entity-moderate-response.dto';

@ApiTags('Ключевые слова')
@Controller('keywords')
export class KeywordsController {
  constructor(
    private readonly keywordsService: KeywordsService,
    private readonly keywordsModerationService: KeywordsModerationService,
  ) {}

  @Post()
  @JwtAuthUser()
  @ApiOkResponse({ description: 'Созданное ключевое слово', type: KeywordCreateResponceDto })
  @ApiCreateEntityErrors()
  create(@Req() req: Request, @Body() createKeywordDto: CreateKeywordDto) {
    return this.keywordsService.create(req.user, createKeywordDto);
  }

  @Get('')
  @JwtAuthOptional()
  @ApiQuery({ name: 'class_id', required: false, type: String, description: 'ID ключевого слова верхнего уровня для фильтрации (опционально, 0 или не указано для корневого уровня)', example: '0' })
  @ApiOkResponse({ description: 'Ключевые слова по классу', type: KeywordByClassResponseDto })
  @ApiFindAllEntityErrors()
  findByClass(
    @Req() req: Request,
    @Query() query: {class_id?: string}
  ) {
    return this.keywordsService.findByClass(req.user, query.class_id);
  }

  @Patch('class_id/:id')
  @JwtAuthAdminSuperAdmin()
  changeClassId(@Param('id') id: string, @Query() query: {new_class_id: string}) {
    return this.keywordsService.updateClassId(Number(id),query.new_class_id);
  }

  @Post('search') // нужен для поиска динамического по подстроке
  @JwtAuth()
  @ApiOkResponse({ description: 'Ключевые слова по токену', type: KeywordItemDto, isArray: true })
  @ApiFindAllEntityErrors()
  findByToken(
    @Req() req: Request,
    @Body() findKeywordDto: FindKeywordDto) 
  {
    return this.keywordsService.findByToken(req.user, findKeywordDto);
  }

  @Post('find')
  @JwtAuthSuperAdmin()
  @HttpCode(StatusCode.successFind)
  @ApiOperation({ description: 'Только для суперадмина для нужд тестирования' })
  @ApiBody({ type: KeywordFindWhereDto, description: 'Условия поиска ключевых слов (TypeORM FindOptionsWhere)' })
  @ApiResponse({ status: StatusCode.successFind, description: 'Список ключевых слов по условию', type: KeywordCreateResponceDto, isArray: true })
  find(
    @Body() findKeywordWhere: FindOptionsWhere<Keyword>,
  ) {
    return this.keywordsService.findByCond(findKeywordWhere);
  }

  @Get(':id')
  @JwtAuthOptional()
  @ApiOkResponse({ description: 'Детали ключевого слова', type: KeywordCreateResponceDto })
  @ApiGetEntityErrors()
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.keywordsService.findOne(+id, req.user);
  }


  @Get('/:id/summary')
  @JwtAuthOptional()
  @ApiOkResponse({ description: 'Сводка ключевого слова', type: KeywordSummaryDto })
  @ApiGetEntityErrors()
  findSummary(@Param('id') id: string, @Req() req: Request) {
    return this.keywordsService.findSummary(+id, req.user);
  }

  @Patch(':id')
  @JwtAuth()
  @ApiBody({ type: UpdateKeywordDto, description: 'Частичное обновление ключевого слова' })
  @ApiOkResponse({ description: 'Обновленное ключевое слово', type: KeywordCreateResponceDto })
  @ApiUpdateEntityErrors()
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateKeywordDto: UpdateKeywordDto,
  ) {
    return this.keywordsService.update(+id, req.user, updateKeywordDto);
  }

  @Delete(':id')
  @JwtAuth()
  @HttpCode(StatusCode.successDelete)
  @ApiDeleteEntityErrors()
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.keywordsService.remove(+id, req.user);
  }


  /*@Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@Req() req: Request) {
    return this.keywordsService.findAll(req.user);
  }*/


  /*@Get('by-class/')
  @UseGuards(OptionalJwtAuthGuard)
  findByClassDef(
    @Req() req: Request,
  ) {
    return this.keywordsService.findByClass(req.user);
  }*/


  @Post('to-moderate/:id')
  @JwtAuthUser()
  @HttpCode(StatusCode.successToModerate)
  @ApiOkResponse({ description: 'Результат перевода в модерацию', type: EntityToModerateResponseDto })
  @ApiToModerateEntityErrors()
  toModerate(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    console.log("@Post('to-moderate/:id')", req.user);
    return this.keywordsModerationService.toModerate(+id, req.user);
  }


  @Post('moderate/:id')
  @JwtAuthAdminSuperAdmin()
  @HttpCode(StatusCode.successModerate)
  @ApiOkResponse({ description: 'Результат модерации ключевого слова', type: EntityModerateResponseDto })
  @ApiModerateEntityErrors()
  moderate(
    @Param('id') id: string,
    @Req() req: Request,
    @Query() query: IModerate,
  ) {
    return this.keywordsModerationService.moderate(+id, req.user, query);
  }

}
