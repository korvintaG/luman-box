import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class KeywordSummaryDto {
  @ApiProperty({ description: 'ID ключевого слова', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название ключевого слова', example: 'Философия' })
  name: string;

  @ApiPropertyOptional({
    description: 'Хлебные крошки (иерархия ключевого слова)',
    example: '[{"id": 2172, "name": "Общество"}, {"id": 2569, "name": "Политика"}]',
    nullable: true,
  })
  bread_crumbs?: string | null;
}
