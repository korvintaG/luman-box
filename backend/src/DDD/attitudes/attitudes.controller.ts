import { Req, UseGuards,Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AttitudesService } from './attitudes.service';
import { CreateAttitudeDto } from './dto/create-attitude.dto';
import { JwtAuthGuard } from '../../authorization/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../authorization/guards/optional-jwt-auth.guard';
import { Request, Response } from 'express';
import { StatusCode } from 'src/types/custom';
import { JwtAuth, JwtAuthOptional } from 'src/shared/decorators/api-jwt-auth.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AttitudeCreateResponceDto } from './dto/attitude-create-responce.dto';

@ApiTags('Оценки идей')
@Controller('attitudes')
export class AttitudesController {
  constructor(private readonly attitudesService: AttitudesService) {}

  @Post(':idea_id')
  @JwtAuth()
  @ApiOkResponse({ description: 'Результат создания/обновления/удаления оценки', type: AttitudeCreateResponceDto })
  async create(@Param('idea_id') idea_id: string, 
    @Req() req: Request, 
    @Res() res: Response, 
    @Body() createAttitudeDto: CreateAttitudeDto) {
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
  @JwtAuthOptional()
  find(@Param('idea_id') idea_id: string, @Req() req: Request) {
    return this.attitudesService.findOne(Number(idea_id),req.user)
  }

}
