import { Req, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { Request  } from 'express';
import { SourcesService } from './sources.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard'


@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @UseGuards(JwtAuthGuard)  
  @Post()
  create(@Req() req: Request,
         @Body() createSourceDto: CreateSourceDto) {
    return this.sourcesService.create(req.user,createSourceDto);
  }

  @Get()
  findAll() {
    return this.sourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sourcesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)  
  @Patch(':id')
  update(@Param('id') id: string, 
         @Req() req: Request,
         @Body() updateSourceDto: UpdateSourceDto) {
    return this.sourcesService.update(+id,req.user, updateSourceDto);
  }

  @UseGuards(JwtAuthGuard)  
  @Delete(':id')
  remove(@Param('id') id: string,
         @Req() req: Request) {
    return this.sourcesService.remove(+id,req.user);
  }
}
