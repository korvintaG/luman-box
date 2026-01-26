import { ApiPropertyOptional } from '@nestjs/swagger';

export class SourceFindWhereDto {
  @ApiPropertyOptional({
    description: 'Название источника',
    example: 'Война и мир',
  })
  name?: string;
}
