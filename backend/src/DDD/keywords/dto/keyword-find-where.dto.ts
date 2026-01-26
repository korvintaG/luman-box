import { ApiPropertyOptional } from '@nestjs/swagger';

export class KeywordFindWhereDto {
  @ApiPropertyOptional({
    description: 'Название ключевого слова',
    example: 'Враг',
  })
  name?: string;
}
