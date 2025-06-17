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

export class CreateSourceAuthorDto {
  @IsNotEmpty({ message: 'Поле ID Автора не может быть пустым' })
  @IsInt({ message: 'Поле ID Автора должно быть целым числом' })
  @Min(1, { message: 'Поле ID Автора должно быть больше нуля' })
  id: number;
}

export class CreateSourceUserDto {
  @IsNotEmpty({ message: 'Поле ID пользователя не может быть пустым' })
  @IsInt({ message: 'Поле ID пользователя должно быть целым числом' })
  @Min(1, { message: 'Поле ID пользователя должно быть больше нуля' })
  id: number;
}

export class CreateSourceDto {
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({ message: 'Поле [name] должно быть строкой' })
  @Length(5, 400, {
    message: 'Название источника должно быть от 5-ти до 400 символов длиной',
  })
  name: string;

  @IsOptional()
  @IsString({ message: 'Поле [image_URL] должно быть строкой' })
  @Length(0, 400, {
    message: 'image_URL должен быть длиной от 0 до 400 символов',
  })image_URL: string;

  @IsOptional()
  @IsString({ message: 'Поле [publication_year] должно быть строкой' })
  @Length(0, 100, {
    message: 'publication_year должен быть длиной от 0 до 100 символов',
  })publication_year: string;

  @IsOptional()
  @IsString({ message: 'Поле [about_source] должно быть строкой' })
  @Length(0, 1000, {
    message: 'about_source должен быть длиной от 0 до 1000 символов',
  })about_source: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSourceAuthorDto)
  author?: CreateSourceAuthorDto;

  @ValidateNested({ each: true })
  @Type(() => CreateSourceUserDto)
  user: CreateSourceUserDto;
}
