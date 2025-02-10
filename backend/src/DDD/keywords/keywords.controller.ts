import { Req, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { Request  } from 'express';
import { KeywordsService } from './keywords.service';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard'
import { RoleGuard } from '../../authorization/guards/role.guard';
import { Role } from '../../authorization/decorators/role.decorator';
import { OptionalJwtAuthGuard } from 'src/authorization/guards/optional-jwt-auth.guard';

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
  @UseGuards(OptionalJwtAuthGuard)    
  findAll(@Req() req: Request) {
    return this.keywordsService.findAll(req.user);
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

  @Post('moderate/:id')
  @UseGuards(JwtAuthGuard,RoleGuard)  
  @Role(1)
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
