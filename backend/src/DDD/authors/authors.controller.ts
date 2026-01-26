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
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorUpdateRequestDto } from './dto/author-update-request.dto';
import { AuthorUpdateResponseDto } from './dto/author-update-response.dto';
import { EntityDeleteResponseDto } from '../../shared/dto/entity-delete-response.dto';
import { EntityToModerateResponseDto } from '../../shared/dto/entity-to-moderate-response.dto';
import { EntityModerateQueryDto } from '../../shared/dto/entity-moderate-query.dto';
import { EntityModerateResponseDto } from '../../shared/dto/entity-moderate-response.dto';
import { IModerate, StatusCode } from '../../types/custom';
import { FindOptionsWhere } from 'typeorm';
import { Author } from './entities/author.entity';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorDetailsDto } from './dto/author-details.dto';
import { AuthorListItemDto } from './dto/author-list-item.dto';
import { AuthorCreateResponseDto } from './dto/author-create-response.dto';
import { AuthorFindWhereDto } from './dto/author-find-where.dto';
import { JwtAuth, JwtAuthAdmin, JwtAuthOptional, JwtAuthSuperAdmin, JwtAuthUser } from '../../shared/decorators/api-jwt-auth.decorator';
import { ApiCreateEntityErrors, ApiFindAllEntityErrors } from 'src/shared/decorators/api-errors.decorator';

@ApiTags('Авторы')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) { }

  @Post()
  @JwtAuthUser()
  @ApiOkResponse({ description: 'Созданный автор', type: AuthorCreateResponseDto })
  @ApiCreateEntityErrors()
  create(@Req() req: Request, @Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(req.user, createAuthorDto);
  }

  @Get()
  @JwtAuthOptional()
  @ApiOkResponse({ type: AuthorListItemDto, isArray: true })
  @ApiFindAllEntityErrors()
  findAll(@Req() req: Request) {
    return this.authorsService.findAll(req.user);
  }

  @Get(':id')
  @JwtAuthOptional()
  @ApiParam({ name: 'id', description: 'ID автора', example: 1 })  
  @ApiOkResponse({ description: 'Детали автора', type: AuthorDetailsDto })
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.authorsService.findOne(+id, req.user);
  }
  @Post('find')
  @JwtAuthSuperAdmin()
  @ApiOperation({ description: 'Только для суперадмина для нужд тестирования' })
  @ApiBody({ type: AuthorFindWhereDto, description: 'Условия поиска авторов (TypeORM FindOptionsWhere)' })
  @ApiOkResponse({description: 'Список авторов по условию',type: AuthorListItemDto,isArray: true})
  find(
    @Body() findAuthorWhere: FindOptionsWhere<Author>,
  ) {
    return this.authorsService.findByCond(findAuthorWhere);
  }

  @Patch(':id')
  @JwtAuth()
  @ApiParam({ name: 'id', description: 'ID автора', example: 1 })
  @ApiBody({ type: AuthorUpdateRequestDto, description: 'Частичное обновление автора' })
  @ApiOkResponse({ description: 'Обновленный автор', type: AuthorUpdateResponseDto })
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorsService.update(+id, req.user, updateAuthorDto);
  }

  @Delete(':id')
  @JwtAuth()
  @HttpCode(StatusCode.successDelete)
  @ApiParam({ name: 'id', description: 'ID автора', example: 1 })
  @ApiResponse({ status: StatusCode.successDelete, description: 'Результат удаления автора', type: EntityDeleteResponseDto })
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.authorsService.remove(+id, req.user);
  }


  @Post('to-moderate/:id')
  @JwtAuth()
  @HttpCode(StatusCode.successToModerate)
  @ApiOkResponse({ description: 'Результат перевода в модерацию', type: EntityToModerateResponseDto })
  toModerate(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.authorsService.toModerate(+id, req.user);
  }


  @Post('moderate/:id')
  @JwtAuthAdmin()
  @HttpCode(StatusCode.successModerate)
  @ApiQuery({ type: EntityModerateQueryDto })
  @ApiOkResponse({ description: 'Результат модерации автора', type: EntityModerateResponseDto })
  moderate(
    @Param('id') id: string,
    @Req() req: Request,
    @Query() query: IModerate,
  ) {
    return this.authorsService.moderate(+id, req.user, query);
  }

}
