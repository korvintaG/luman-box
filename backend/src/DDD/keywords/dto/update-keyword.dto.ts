import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateKeywordNameDto {
  @ApiProperty({
    description: 'Название ключевого слова',
    example: 'Враг',
  })
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({ message: 'Поле [name] должно быть строкой' })
  name: string;

  @ApiPropertyOptional({
    description: 'ID названия ключевого слова (для обновления существующего)',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Поле [id] должно быть целым числом' })
  id?: number;
}

export class UpdateKeywordDto {
  @ApiPropertyOptional({
    description: 'Массив названий ключевого слова',
    type: [UpdateKeywordNameDto],
    example: [{ name: 'Враг', id: 1 }, { name: 'Противник' }],
  })
  @IsOptional({ message: 'Поле [names] не может быть пустым' })
  @IsArray({ message: 'Поле [names] должно быть массивом' })
  @ArrayMinSize(1, {
    message: 'Для ключевого слова должно быть минимум одно название',
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateKeywordNameDto)
  names?: UpdateKeywordNameDto[];

  @ApiPropertyOptional({
    description: 'Индекс названия по умолчанию в массиве names',
    example: 0,
    minimum: 0,
  })
  @IsOptional({ message: 'Поле [default_name_index] не может быть пустым' })
  @IsInt({ message: 'Поле [default_name_index] должно быть целым числом' })
  @Min(0, { message: 'Поле [default_name_index] должно быть больше или равно нулю' })
  default_name_index?: number;

  @ApiPropertyOptional({
    description: 'Определение ключевого слова',
    example: 'Враг — противник, недруг, тот, кто находится в состоянии борьбы с кем-либо, а также приносит вред и зло.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Поле [definition] должно быть строкой' })
  @Length(0, 1000, {
    message: 'definition должен быть длиной от 0 до 1000 символов',
  })
  definition?: string;
}
