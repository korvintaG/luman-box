import {
    Max,
    IsOptional,
    IsInt,
    Min,
  } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
  
export class CreateAttitudeDto {
  @ApiPropertyOptional({
    description: 'Оценка "нравится" (0-4)',
    example: 3,
    minimum: 0,
    maximum: 4,
  })
  @IsOptional()
  @IsInt({ message: 'Поле [like] должно быть целым числом' })
  @Min(0, { message: 'Поле [like] должно быть больше или равно нуля' })
  @Max(4, { message: 'Поле [like] должно быть меньше или равно 4' })
  like: number;

  @ApiPropertyOptional({
    description: 'Оценка "важность" (0-4)',
    example: 4,
    minimum: 0,
    maximum: 4,
  })
  @IsOptional()
  @IsInt({ message: 'Поле [importance] должно быть целым числом' })
  @Min(0, { message: 'Поле [importance] должно быть больше или равно нуля' })
  @Max(4, { message: 'Поле [importance] должно быть меньше или равно 4' })
  importance: number;

  @ApiPropertyOptional({
    description: 'Оценка "истинность" (0-4)',
    example: 2,
    minimum: 0,
    maximum: 4,
  })
  @IsOptional()
  @IsInt({ message: 'Поле [truth] должно быть целым числом' })
  @Min(0, { message: 'Поле [truth] должно быть больше или равно нуля' })
  @Max(4, { message: 'Поле [truth] должно быть меньше или равно 4' })
  truth: number;
}
