import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class KeywordByClassQueryDto {
  @ApiPropertyOptional({
    description: 'ID ключевого слова верхнего уровня для фильтрации (опционально, 0 или не указано для корневого уровня)',
    example: '0',
  })
  @IsOptional()
  @IsString({ message: 'Поле [class_id] должно быть строкой' })
  class_id?: string;
}
