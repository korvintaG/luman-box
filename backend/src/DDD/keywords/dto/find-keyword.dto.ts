import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
  IsInt
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindKeywordDto {
  @ApiProperty({
    description: 'Токен для поиска ключевого слова',
    example: 'философия',
    minLength: 3,
    maxLength: 30,
  })
  @IsNotEmpty({ message: 'Поле token  не может быть пустым' })
  @IsString({ message: 'Поле token должно быть строкой' })
  @MinLength(3, { message: 'Поле token должно быть минимум 3 символа длиной' })
  @MaxLength(30, { message: 'Поле token должно быть максимум 30 символов длиной' })
  token: string;

  @ApiPropertyOptional({
    description: 'Массив ID существующих названий ключевых слов для исключения из поиска',
    example: [1, 2, 3],
    type: [Number],
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: 'Поле keyword_names_exist должно быть массивом' })
  @IsInt({ each: true, message: 'Элементы массива keyword_names_exist должны быть целыми числами' })
  keyword_names_exist?: number[];
}
