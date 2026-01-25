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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { KeywordsService } from './keywords.service';
import { KeywordsModerationService } from './keywords-moderation.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard';
import { RoleGuard } from '../../authorization/guards/role.guard';
import { WithRole } from '../../authorization/decorators/role.decorator';
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { IModerate, Role, StatusCode } from '../../types/custom';
import { FindOptionsWhere } from 'typeorm';
import { Keyword } from './entities/keyword.entity';
import { FindKeywordDto } from './dto/find-keyword.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthAdminSuperAdmin, JwtAuthUser } from 'src/shared/decorators/api-jwt-auth.decorator';
import { KeywordCreateResponceDto } from './dto/keyword-create-responce.dto';

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
  create(@Req() req: Request, @Body() createKeywordDto: CreateKeywordDto) {
    return this.keywordsService.create(req.user, createKeywordDto);
  }


  @Patch('class_id/:id')
  @JwtAuthAdminSuperAdmin()
  changeClassId(@Param('id') id: string, @Query() query: {new_class_id: string}) {
    return this.keywordsService.updateClassId(Number(id),query.new_class_id);
  }

  @Post('search') // нужен для поиска динамического по подстроке
  @UseGuards(JwtAuthGuard)
  findByToken(
    @Req() req: Request,
    @Body() findKeywordDto: FindKeywordDto) 
  {
    return this.keywordsService.findByToken(req.user, findKeywordDto);
  }

  @Get('find') // нужен для тестов, не удалять!!!!
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole(Role.SuperAdmin)
  find(
    @Body() findKeywordWhere: FindOptionsWhere<Keyword>,
  ) {
    return this.keywordsService.findByCond(findKeywordWhere);
  }

  
  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.keywordsService.findOne(+id, req.user);
  }

  @Get('')
  @UseGuards(OptionalJwtAuthGuard)
  findByClass(
    @Req() req: Request,
    @Query() query: {class_id?: string}
  ) {
    return this.keywordsService.findByClass(req.user, query.class_id);
  }

  @Get('/:id/summary')
  @UseGuards(OptionalJwtAuthGuard)
  findSummary(@Param('id') id: string, @Req() req: Request) {
    return this.keywordsService.findSummary(+id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateKeywordDto: UpdateKeywordDto,
  ) {
    return this.keywordsService.update(+id, req.user, updateKeywordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(StatusCode.successDelete)
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole([Role.User])
  @HttpCode(StatusCode.successToModerate)
  toModerate(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    console.log("@Post('to-moderate/:id')", req.user);
    return this.keywordsModerationService.toModerate(+id, req.user);
  }


  @Post('moderate/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole([Role.Admin, Role.SuperAdmin])
  @HttpCode(StatusCode.successModerate)
  moderate(
    @Param('id') id: string,
    @Req() req: Request,
    @Query() query: IModerate,
  ) {
    return this.keywordsModerationService.moderate(+id, req.user, query);
  }

}
