import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsInt,
  Min,
  ValidateNested,
  IsOptional,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateKeywordUserDto {
  @ApiProperty({
    description: 'ID пользователя, создающего ключевое слово',
    example: 1,
  })
  @IsNotEmpty({ message: 'Поле ID пользователя не может быть пустым' })
  @IsInt({ message: 'Поле ID пользователя должно быть целым числом' })
  @Min(1, { message: 'Поле ID пользователя должно быть больше нуля' })
  id: number;
}

export class CreateKeywordDto {
  @ApiProperty({
    description: 'ID ключевого слова верхнего уровня (0 для корневого уровня)',
    example: 0,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'Поле [class_keyword_id] не может быть пустым' })
  @IsInt({ message: 'Поле [class_keyword_id] должно быть целым числом' })
  @Min(0, { message: 'Поле [class_keyword_id] должно быть больше или равно нулю' })
  class_keyword_id: number;

  @ApiProperty({
    description: 'Массив названий ключевого слова',
    example: ['Систематизация', 'Организация'],
    type: [String],
    minItems: 1,
  })
  @IsNotEmpty({ message: 'Поле [names] не может быть пустым' })
  @IsArray({ message: 'Поле [names] должно быть массивом' })
  @ArrayMinSize(1, {
    message: 'Для ключевого слова должно быть минимум одно название',
  })
  @IsNotEmpty({ each: true, message: 'Элементы массива [names] не могут быть пустыми строками' })
  names: string[];

  @ApiProperty({
    description: 'Индекс названия по умолчанию в массиве names',
    example: 0,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'Поле [default_name_index] не может быть пустым' })
  @IsInt({ message: 'Поле [default_name_index] должно быть целым числом' })
  @Min(0, { message: 'Поле [default_name_index] должно быть больше или равно нулю' })
  default_name_index: number;

  @ApiPropertyOptional({
    description: 'Определение ключевого слова',
    example: 'Процесс организации информации в систему',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Поле [definition] должно быть строкой' })
  @Length(0, 1000, {
    message: 'definition должен быть длиной от 0 до 1000 символов',
  })
  definition: string;
}
