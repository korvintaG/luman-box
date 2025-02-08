import { Req, Controller, Get, Post, Body, Patch, Param, Delete,  UseGuards, Query } from '@nestjs/common';
import { Request  } from 'express';
import { IdeasService } from './ideas.service';
import {IIdeaBySourceAndKeyword} from '../../types/custom'
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard'


@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @UseGuards(JwtAuthGuard)  
  @Post()
  create(@Req() req: Request,
         @Body() createIdeaDto: CreateIdeaDto) {
    return this.ideasService.create(req.user,createIdeaDto);
  }

  @Get()
  findAll(@Query() query:Partial<IIdeaBySourceAndKeyword>) {
    if (query.keyword_id && query.source_id)
      return this.ideasService.findBySrcKw({source_id:query.source_id , keyword_id: query.keyword_id });
    else
      return this.ideasService.findAll();
  }

  @Get('/find-by-source-kw/:src/:kw')
  findBySourceKw(@Param('src') src: string, @Param('kw') kw: string) {
    return this.ideasService.findBySourceKw(src,kw);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ideasService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)  
  @Patch(':id')
  update(@Param('id') id: string, 
         @Req() req: Request,
         @Body() updateIdeaDto: UpdateIdeaDto) {
    return this.ideasService.update(+id, req.user,updateIdeaDto);
  }

  @UseGuards(JwtAuthGuard)  
  @Post('moderate/:id')
  moderate(@Param('id') id: string, 
         @Req() req: Request) {
    return this.ideasService.moderate(+id, req.user);
  }

  @UseGuards(JwtAuthGuard)  
  @Delete(':id')
  remove(@Param('id') id: string,
         @Req() req: Request) {
    return this.ideasService.remove(+id,req.user);
  }
}
