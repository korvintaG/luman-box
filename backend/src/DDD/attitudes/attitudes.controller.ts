import { Req, UseGuards,Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttitudesService } from './attitudes.service';
import { CreateAttitudeDto } from './dto/create-attitude.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { Request } from 'express';


@Controller('attitudes')
export class AttitudesController {
  constructor(private readonly attitudesService: AttitudesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  create(@Param('id') id: string, @Req() req: Request,@Body() createAttitudeDto: CreateAttitudeDto) {
    return this.attitudesService.create(req.user, Number(id), createAttitudeDto);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  find(@Param('id') id: string, @Req() req: Request) {
    return this.attitudesService.findOne(Number(id),req.user)
  }

}
