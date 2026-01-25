import {
  IsString,
  IsInt,
  IsNotEmpty,
  Length,
  ValidateNested,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSourceAuthorDto {
  @ApiProperty({
    description: 'ID автора источника',
    example: 1,
  })
  @IsNotEmpty({ message: 'Поле ID Автора не может быть пустым' })
  @IsInt({ message: 'Поле ID Автора должно быть целым числом' })
  @Min(1, { message: 'Поле ID Автора должно быть больше нуля' })
  id: number;
}

export class CreateSourceUserDto {
  @ApiProperty({
    description: 'ID пользователя, создающего источник',
    example: 1,
  })
  @IsNotEmpty({ message: 'Поле ID пользователя не может быть пустым' })
  @IsInt({ message: 'Поле ID пользователя должно быть целым числом' })
  @Min(1, { message: 'Поле ID пользователя должно быть больше нуля' })
  id: number;
}

export class CreateSourceDto {
  @ApiProperty({
    description: 'Название источника',
    example: 'Как делать полезные заметки',
  })
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({ message: 'Поле [name] должно быть строкой' })
  @Length(5, 400, {
    message: 'Название источника должно быть от 5-ти до 400 символов длиной',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Ссылка на изображение источника',
    example: 'https://example.com/source.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Поле [image_URL] должно быть строкой' })
  @Length(0, 400, {
    message: 'image_URL должен быть длиной от 0 до 400 символов',
  })
  image_URL: string;

  @ApiPropertyOptional({
    description: 'Год публикации источника',
    example: '2012',
  })
  @IsOptional()
  @IsString({ message: 'Поле [publication_year] должно быть строкой' })
  @Length(0, 100, {
    message: 'publication_year должен быть длиной от 0 до 100 символов',
  })
  publication_year: string;

  @ApiPropertyOptional({
    description: 'Описание источника',
    example: 'Книга о методах ведения заметок.',
  })
  @IsOptional()
  @IsString({ message: 'Поле [about_source] должно быть строкой' })
  @Length(0, 1000, {
    message: 'about_source должен быть длиной от 0 до 1000 символов',
  })
  about_source: string;

  @ApiPropertyOptional({
    description: 'Автор источника',
    type: CreateSourceAuthorDto,
    example: { id: 1 },
  })
  @ValidateNested({ each: true })
  @Type(() => CreateSourceAuthorDto)
  author?: CreateSourceAuthorDto;

}
