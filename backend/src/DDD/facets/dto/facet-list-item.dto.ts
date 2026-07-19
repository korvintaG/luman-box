import { ApiProperty } from '@nestjs/swagger';

export class FacetListItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Категория' })
  name: string;
}
