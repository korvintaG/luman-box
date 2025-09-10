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
import { KeywordsService } from './keywords.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard';
import { RoleGuard } from '../../authorization/guards/role.guard';
import { WithRole } from '../../authorization/decorators/role.decorator';
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { IModerate, Role, StatusCode } from '../../types/custom';
import { FindOptionsWhere } from 'typeorm';
import { Keyword } from './entities/keyword.entity';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() createKeywordDto: CreateKeywordDto) {
    return this.keywordsService.create(req.user, createKeywordDto);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  findAll(@Req() req: Request) {
    return this.keywordsService.findAll(req.user);
  }

  @Get('find')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole(Role.SuperAdmin)
  find(
    @Body() findKeywordWhere: FindOptionsWhere<Keyword>,
  ) {
    return this.keywordsService.findByCond(findKeywordWhere);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keywordsService.findOne(+id);
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

  @Post('to-moderate/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(StatusCode.successToModerate)
  toModerate(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.keywordsService.toModerate(+id, req.user);
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
    return this.keywordsService.moderate(+id, req.user, query);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(StatusCode.successDelete)
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.keywordsService.remove(+id, req.user);
  }
}
