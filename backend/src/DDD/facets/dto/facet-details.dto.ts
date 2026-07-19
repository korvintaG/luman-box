import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FacetDetailsDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Категория' })
  name: string;

  @ApiPropertyOptional({ example: 'facet_external_1' })
  id_out?: string;

  @ApiProperty({ example: 1 })
  class_id: number;

  @ApiPropertyOptional({ example: 'class_external_1' })
  class_id_out?: string;

  @ApiProperty({ example: 0 })
  order_: number;

  @ApiProperty({ example: 0 })
  order_global: number;

  @ApiPropertyOptional({ example: 'до' })
  class_name_before?: string;

  @ApiPropertyOptional({ example: 'после' })
  class_name_after?: string;

  @ApiPropertyOptional({ example: 'Главная > Идеи > Категории' })
  bread_crumbs?: string;
}
