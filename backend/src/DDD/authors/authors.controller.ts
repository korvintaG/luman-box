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
import { AuthorDeleteResponseDto } from './dto/author-delete-response.dto';
import { EntityToModerateResponseDto } from '../../shared/dto/entity-to-moderate-response.dto';
import { EntityModerateQueryDto } from '../../shared/dto/entity-moderate-query.dto';
import { EntityModerateResponseDto } from '../../shared/dto/entity-moderate-response.dto';
import { IModerate, StatusCode } from '../../types/custom';
import { FindOptionsWhere } from 'typeorm';
import { Author } from './entities/author.entity';
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorDetailsDto } from './dto/author-details.dto';
import { AuthorListItemDto } from './dto/author-list-item.dto';
import { AuthorCreateResponseDto } from './dto/author-create-response.dto';
import { JwtAuth, JwtAuthAdmin, JwtAuthOptional, JwtAuthSuperAdmin, JwtAuthUser } from '../../shared/decorators/api-jwt-auth.decorator';

@ApiTags('Авторы')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) { }

  @Post()
  @JwtAuthUser()
  @ApiOkResponse({ description: 'Созданный автор', type: AuthorCreateResponseDto })
  create(@Req() req: Request, @Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(req.user, createAuthorDto);
  }

  @Get()
  @JwtAuthOptional()
  @ApiOkResponse({ type: AuthorListItemDto, isArray: true })
  findAll(@Req() req: Request) {
    return this.authorsService.findAll(req.user);
  }

  @Get('find')
  @JwtAuthSuperAdmin()
  @ApiOperation({ description: 'Только для суперадмина для нужд тестирования' })
  @ApiOkResponse({description: 'Список авторов по условию',type: AuthorListItemDto,isArray: true})
  find(
    @Body() findAuthorWhere: FindOptionsWhere<Author>,
  ) {
    return this.authorsService.findByCond(findAuthorWhere);
  }

  @Get(':id')
  @JwtAuthOptional()
  @ApiOkResponse({ description: 'Детали автора', type: AuthorDetailsDto })
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.authorsService.findOne(+id, req.user);
  }

  @Patch(':id')
  @JwtAuth()
  @ApiBody({ type: AuthorUpdateRequestDto, description: 'Частичное обновление автора' })
  @ApiOkResponse({ description: 'Обновленный автор', type: AuthorUpdateResponseDto })
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorsService.update(+id, req.user, updateAuthorDto);
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

  @Delete(':id')
  @JwtAuth()
  @HttpCode(StatusCode.successDelete)
  @ApiResponse({ status: StatusCode.successDelete, description: 'Результат удаления автора', type: AuthorDeleteResponseDto })
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.authorsService.remove(+id, req.user);
  }
}
