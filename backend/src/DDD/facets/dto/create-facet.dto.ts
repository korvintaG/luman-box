import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateFacetDto {
  @ApiProperty({
    description: 'Название фасета',
    example: 'Категория',
  })
  @IsString({ message: 'Поле [name] должно быть строкой' })
  @Length(1, 250, { message: 'name должен быть длиной от 1 до 250 символов' })
  name: string;

  @ApiPropertyOptional({
    description: 'Внешний ID фасета',
    example: 'facet_external_1',
  })
  @IsOptional()
  @IsString({ message: 'Поле [id_out] должно быть строкой' })
  @Length(0, 250, { message: 'id_out должен быть длиной от 0 до 250 символов' })
  id_out?: string;

  @ApiProperty({
    description: 'ID класса фасета',
    example: 1,
  })
  @IsInt({ message: 'Поле [class_id] должно быть целым числом' })
  class_id: number;

  @ApiPropertyOptional({
    description: 'Внешний ID класса фасета',
    example: 'class_external_1',
  })
  @IsOptional()
  @IsString({ message: 'Поле [class_id_out] должно быть строкой' })
  @Length(0, 250, { message: 'class_id_out должен быть длиной от 0 до 250 символов' })
  class_id_out?: string;

  @ApiPropertyOptional({
    description: 'Порядок в классе',
    example: 10,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Поле [order_] должно быть целым числом' })
  order_?: number;

  @ApiPropertyOptional({
    description: 'Глобальный порядок',
    example: 100,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Поле [order_global] должно быть целым числом' })
  order_global?: number;

  @ApiPropertyOptional({
    description: 'Префикс названия класса',
    example: 'до',
  })
  @IsOptional()
  @IsString({ message: 'Поле [class_name_before] должно быть строкой' })
  @Length(0, 250, {
    message: 'class_name_before должен быть длиной от 0 до 250 символов',
  })
  class_name_before?: string;

  @ApiPropertyOptional({
    description: 'Суффикс названия класса',
    example: 'после',
  })
  @IsOptional()
  @IsString({ message: 'Поле [class_name_after] должно быть строкой' })
  @Length(0, 250, {
    message: 'class_name_after должен быть длиной от 0 до 250 символов',
  })
  class_name_after?: string;

  @ApiPropertyOptional({
    description: 'Хлебные крошки',
    example: 'Главная > Идеи > Категории',
  })
  @IsOptional()
  @IsString({ message: 'Поле [bread_crumbs] должно быть строкой' })
  @Length(0, 500, {
    message: 'bread_crumbs должен быть длиной от 0 до 500 символов',
  })
  bread_crumbs?: string;
}
