import { Req, UseGuards, Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InterconnectionsService } from './interconnections.service';
import { InterconnectionEntityDto } from './dto/create-interconnection.dto';
import { UpdateInterconnectionDto } from './dto/update-interconnection.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { Request } from 'express';
import { IInterconnectionWay, IModerate, Role } from 'src/types/custom';
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

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.interconnectionsService.findOne(+id, req.user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/count-by-idea/:idea_id')
  countByIdea(@Param('idea_id') idea_id: string, @Req() req: Request) {
    return this.interconnectionsService.countAllByIdea(+idea_id, req.user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('/by-idea-and-type/:idea_id/:type_id')
  findAllByIdeaAndType(@Param('idea_id') idea_id: string, @Param('type_id') type_id: string, @Req() req: Request) {
    return this.interconnectionsService.getByIdeaAndType(+idea_id,+type_id, req.user);
  }

  /*@Get('/idea-for-interconnect/:id/:tid/:iid')
  findIdeaToInterconnect(@Param('id') id: string, @Param('tid') tid: string, @Param('iid') iid: string) {
    return this.interconnectionsService.getIdeaToInterconnect(+id,+tid,+iid);
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

  @Post('to-moderate/:id')
  @UseGuards(JwtAuthGuard)
  toModerate(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.interconnectionsService.toModerate(+id, req.user);
  }


  @Post('moderate/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @WithRole(Role.Admin)
  moderate(
    @Param('id') id: string,
    @Req() req: Request,
    @Query() query: IModerate,
  ) {
    return this.interconnectionsService.moderate(+id, req.user, query);
  }

}
