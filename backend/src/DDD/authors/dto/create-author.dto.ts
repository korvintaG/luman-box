import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({
    description: 'ФИО автора',
    example: 'Лев Николаевич Толстой',
  })
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({ message: 'Поле [name] должно быть строкой' })
  @Length(3, 250, {
    message: 'ФИО автора должно быть от 3-х до 250 символов длиной',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Дата рождения автора',
    example: '1828-09-09',
  })
  @IsOptional()
  @IsString({ message: 'Поле [birth_date] должно быть строкой' })
  @Length(0, 100, {
    message: 'birth_date должен быть длиной от 0 до 100 символов',
  })
  birth_date: string;

  @ApiPropertyOptional({
    description: 'Место рождения автора',
    example: 'Ясная Поляна, Тульская губерния',
  })
  @IsOptional()
  @IsString({ message: 'Поле [birth_place] должно быть строкой' })
  @Length(0, 100, {
    message: 'birth_place должен быть длиной от 0 до 100 символов',
  })
  birth_place: string;

  @ApiPropertyOptional({
    description: 'Краткая биография автора',
    example: 'Русский писатель, классик мировой литературы.',
  })
  @IsOptional()
  @IsString({ message: 'Поле [about_author] должно быть строкой' })
  @Length(0, 1000, {
    message: 'about_author должен быть длиной от 0 до 1000 символов',
  })
  about_author: string;

  @ApiPropertyOptional({
    description: 'Ссылка на изображение автора',
    example: 'https://example.com/author.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Поле [image_URL] должно быть строкой' })
  @Length(0, 400, {
    message: 'image_URL должен быть длиной от 0 до 400 символов',
  })
  image_URL: string;

}
