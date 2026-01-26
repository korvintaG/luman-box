import { ApiPropertyOptional } from '@nestjs/swagger';

export class IdeaFindWhereDto {
  @ApiPropertyOptional({
    description: 'Название идеи',
    example: 'Название идеи',
  })
  name?: string;
}
