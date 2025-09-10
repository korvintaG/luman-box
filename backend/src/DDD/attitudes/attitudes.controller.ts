import { Req, UseGuards,Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AttitudesService } from './attitudes.service';
import { CreateAttitudeDto } from './dto/create-attitude.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { Request, Response } from 'express';
import { StatusCode } from 'src/types/custom';


@Controller('attitudes')
export class AttitudesController {
  constructor(private readonly attitudesService: AttitudesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':idea_id')
  async create(@Param('idea_id') idea_id: string, @Req() req: Request, @Res() res: Response, @Body() createAttitudeDto: CreateAttitudeDto) {
    const result = await this.attitudesService.create(req.user, Number(idea_id), createAttitudeDto);
    let statusCode = StatusCode.successUpdate; // по умолчанию для обновления
    if (result.message.includes('created successfully')) {
      statusCode = StatusCode.successCreate;
    } else if (result.message.includes('deleted successfully')) {
      statusCode = StatusCode.successDelete;
    }
    return res.status(statusCode).json(result);    
  }

  @Get(':idea_id')
  @UseGuards(OptionalJwtAuthGuard)
  find(@Param('idea_id') idea_id: string, @Req() req: Request) {
    return this.attitudesService.findOne(Number(idea_id),req.user)
  }

}
