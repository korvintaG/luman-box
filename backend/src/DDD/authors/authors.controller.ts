import { Req, Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { Request  } from 'express';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard'


@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @UseGuards(JwtAuthGuard)  
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  findAll() {
    return this.authorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)  
  @Patch(':id')
  update(@Param('id') id: string, 
         @Req() req: Request,
         @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorsService.update(+id, req.user, updateAuthorDto);
  }

  @UseGuards(JwtAuthGuard)  
  @Delete(':id')
  remove(@Param('id') id: string,
         @Req() req: Request) {
    return this.authorsService.remove(+id, req.user);
  }
}
