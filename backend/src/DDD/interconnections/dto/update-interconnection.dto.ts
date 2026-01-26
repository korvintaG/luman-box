import { PartialType } from '@nestjs/mapped-types';
import { InterconnectionEntityDto } from './create-interconnection.dto';
import {
    Max,
    IsInt,
    IsString,
    MinLength,
    MaxLength,
    Min,
    IsOptional,
  } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInterconnectionDto extends PartialType(InterconnectionEntityDto) {
  @ApiPropertyOptional({
    description: 'Тип взаимосвязи',
    example: 1,
    minimum: 1,
    maximum: 30,
  })
  @IsOptional()
  @IsInt({ message: 'Поле [interconnection_type] должно быть целым числом' })
  @Min(1, { message: 'Поле [interconnection_type] должно быть больше нуля' })
  @Max(30, { message: 'Поле [interconnection_type] должно быть меньше или равно 30' })
  interconnection_type?: number;

  @ApiPropertyOptional({
    description: 'ID первой идеи',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Поле [idea1_id] должно быть целым числом' })
  @Min(1, { message: 'Поле [idea1_id] должно быть больше нуля' })
  idea1_id?: number;

  @ApiPropertyOptional({
    description: 'ID второй идеи',
    example: 2,
  })
  @IsOptional()
  @IsInt({ message: 'Поле [idea2_id] должно быть целым числом' })
  @Min(1, { message: 'Поле [idea2_id] должно быть больше нуля' })
  idea2_id?: number;

  @ApiPropertyOptional({
    description: 'Название связи в прямом направлении',
    example: 'Идея A связана с идеей B',
    minLength: 10,
    maxLength: 250,
  })
  @IsOptional()
  @IsString({ message: 'Поле [name_direct] должно быть строкой' })
  @MinLength(10, { message: 'Поле [name_direct] должно минимум 10 символов длиной' })
  @MaxLength(250, { message: 'Поле [name_direct] может бфть максимум 250 символов длиной' })
  name_direct?: string;

  @ApiPropertyOptional({
    description: 'Название связи в обратном направлении',
    example: 'Идея B связана с идеей A',
    minLength: 10,
    maxLength: 250,
  })
  @IsOptional()
  @IsString({ message: 'Поле [name_reverse] должно быть строкой' })
  @MinLength(10, { message: 'Поле [name_reverse] должно минимум 10 символов длиной' })
  @MaxLength(250, { message: 'Поле [name_reverse] может бфть максимум 250 символов длиной' })
  name_reverse?: string;
}
