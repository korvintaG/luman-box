import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AttitudeStatsDto {
  @ApiProperty({
    description: 'Массив количества оценок по значениям (индексы 0-4)',
    example: [0, 5, 10, 3, 2],
    type: [Number],
  })
  like: number[];

  @ApiProperty({
    description: 'Массив количества оценок по значениям (индексы 0-4)',
    example: [0, 2, 8, 7, 3],
    type: [Number],
  })
  importance: number[];

  @ApiProperty({
    description: 'Массив количества оценок по значениям (индексы 0-4)',
    example: [0, 1, 5, 10, 4],
    type: [Number],
  })
  truth: number[];
}

class AttitudeUserDto {
  @ApiProperty({ description: 'Оценка "нравится" пользователя (0-4)', example: 3 })
  like: number;

  @ApiProperty({ description: 'Оценка "важность" пользователя (0-4)', example: 4 })
  importance: number;

  @ApiProperty({ description: 'Оценка "истинность" пользователя (0-4)', example: 2 })
  truth: number;
}

export class AttitudeFindResponseDto {
  @ApiProperty({
    description: 'Статистика оценок всех пользователей',
    type: AttitudeStatsDto,
  })
  all: AttitudeStatsDto;

  @ApiPropertyOptional({
    description: 'Оценки текущего пользователя (если авторизован)',
    type: AttitudeUserDto,
  })
  user?: AttitudeUserDto;
}
