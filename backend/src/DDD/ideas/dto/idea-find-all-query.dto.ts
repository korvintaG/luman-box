import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class IdeaFindAllQueryDto {
  @ApiPropertyOptional({
    description: 'ID источника для фильтрации (используется вместе с keyword_id)',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Поле [source_id] должно быть целым числом' })
  @Min(1, { message: 'Поле [source_id] должно быть больше нуля' })
  source_id?: number;

  @ApiPropertyOptional({
    description: 'ID ключевого слова для фильтрации (используется вместе с source_id)',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Поле [keyword_id] должно быть целым числом' })
  @Min(1, { message: 'Поле [keyword_id] должно быть больше нуля' })
  keyword_id?: number;
}
