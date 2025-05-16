import { Req, UseGuards, Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InterconnectionsService } from './interconnections.service';
import { InterconnectionEntityDto } from './dto/create-interconnection.dto';
import { UpdateInterconnectionDto } from './dto/update-interconnection.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { Request } from 'express';
import { IInterconnectionWay, Role } from 'src/types/custom';
import { RoleGuard } from 'src/authorization/guards/role.guard';
import { WithRole } from 'src/authorization/decorators/role.decorator';


@Controller('interconnections')
export class InterconnectionsController {
  constructor(private readonly interconnectionsService: InterconnectionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: Request, @Body() interconnectionEntityDto: InterconnectionEntityDto) {
    return this.interconnectionsService.create(req.user,interconnectionEntityDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string/*, @Query() query: Partial<IInterconnectionWay>,*/) {
    return this.interconnectionsService.findOne(+id/*, query*/);
  }

  @Get('/by-idea/:id')
  findAllByIdea(@Param('id') id: string) {
    return this.interconnectionsService.countAllByIdea(+id);
  }

  @Get('/by-idea-and-type/:id/:tid')
  findAllByIdeaAndType(@Param('id') id: string, @Param('tid') tid: string) {
    return this.interconnectionsService.getByIdeaAndType(+id,+tid);
  }

  @Get('/idea-for-interconnect/:id/:tid/:iid')
  findIdeaToInterconnect(@Param('id') id: string, @Param('tid') tid: string, @Param('iid') iid: string) {
    return this.interconnectionsService.getIdeaToInterconnect(+id,+tid,+iid);
  }

  /*@Get('/for-add/:idea_id/:iitype_id')
  findForInterconnectAdd(@Param('idea_id') idea_id: string, 
    @Param('iitype_id') iitype_id: string) {
    return this.interconnectionsService.getForInterconnectAdd(+idea_id,+iitype_id);
  }*/

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() updateInterconnectionDto: UpdateInterconnectionDto) {
    return this.interconnectionsService.update(req.user, +id, updateInterconnectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.interconnectionsService.remove(req.user,+id);
  }

  @Post('moderate/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole(Role.Admin)
  moderate(@Param('id') id: string, @Req() req: Request) {
    return this.interconnectionsService.moderate(+id, req.user);
  }

}
