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

@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() createIdeaDto: CreateIdeaDto) {
    return this.ideasService.create(req.user, createIdeaDto);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
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

  @Get('/find-by-source-kw/:src/:kw')
  @UseGuards(OptionalJwtAuthGuard)
  findBySourceKw(@Param('src') src: string, @Param('kw') kw: string, @Req() req: Request) {
    return this.ideasService.findBySourceKw(src, kw,req.user);
  }

  @Get('find')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole(Role.SuperAdmin)
  find(
    @Body() findIdeaWhere: FindOptionsWhere<Idea>,
  ) {
    return this.ideasService.findByCond(findIdeaWhere);
  }
  

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(StatusCode.successDelete)
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.ideasService.remove(+id, req.user);
  }
}
