import { Req, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { Request  } from 'express';
import { KeywordsService } from './keywords.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard'

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @UseGuards(JwtAuthGuard)  
  @Post()
  create(@Req() req: Request,
         @Body() createKeywordDto: CreateKeywordDto) {
    return this.keywordsService.create(req.user,createKeywordDto);
  }

  @Get()
  findAll() {
    return this.keywordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keywordsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)  
  @Patch(':id')
  update(@Param('id') id: string, 
         @Req() req: Request,
         @Body() updateKeywordDto: UpdateKeywordDto) {
    return this.keywordsService.update(+id,req.user, updateKeywordDto);
  }

  @UseGuards(JwtAuthGuard)  
  @Post('moderate/:id')
  moderate(@Param('id') id: string, 
         @Req() req: Request) {
    return this.keywordsService.moderate(+id, req.user);
  }


  @UseGuards(JwtAuthGuard)  
  @Delete(':id')
  remove(@Param('id') id: string,
         @Req() req: Request) {
    return this.keywordsService.remove(+id,req.user);
  }
}
