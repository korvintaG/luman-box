import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';

@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Post()
  create(@Body() createIdeaDto: CreateIdeaDto) {
    return this.ideasService.create(createIdeaDto);
  }

  @Get()
  findAll() {
    return this.ideasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ideasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIdeaDto: UpdateIdeaDto) {
    return this.ideasService.update(+id, updateIdeaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ideasService.remove(+id);
  }
}
