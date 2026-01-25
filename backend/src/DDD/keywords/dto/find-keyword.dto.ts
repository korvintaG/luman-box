import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
  IsInt
} from 'class-validator';

export class FindKeywordDto {
  @IsNotEmpty({ message: 'Поле token  не может быть пустым' })
  @IsString({ message: 'Поле token должно быть строкой' })
  @MinLength(3, { message: 'Поле token должно быть минимум 3 символа длиной' })
  @MaxLength(30, { message: 'Поле token должно быть максимум 30 символов длиной' })
  token: string;

  @IsOptional()
  @IsArray({ message: 'Поле keyword_names_exist должно быть массивом' })
  @IsInt({ each: true, message: 'Элементы массива keyword_names_exist должны быть целыми числами' })
  keyword_names_exist?: number[];
}
