import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Length,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';

export class CreateAuthorUserDto {
  @IsNotEmpty({ message: 'Поле ID пользователя не может быть пустым' })
  @IsInt({ message: 'Поле ID пользователя должно быть целым числом' })
  @Min(1, { message: 'Поле ID пользователя должно быть больше нуля' })
  id: number;
}

export class CreateAuthorDto {
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({ message: 'Поле [name] должно быть строкой' })
  @Length(3, 250, {
    message: 'ФИО автора должно быть от 3-х до 250 символов длиной',
  })
  name: string;

  @IsOptional()
  @IsString({ message: 'Поле [birth_date] должно быть строкой' })
  @Length(0, 100, {
    message: 'birth_date должен быть длиной от 0 до 100 символов',
  })birth_date: string;

  @IsOptional()
  @IsString({ message: 'Поле [birth_place] должно быть строкой' })
  @Length(0, 100, {
    message: 'birth_place должен быть длиной от 0 до 100 символов',
  })birth_place: string;

  @IsOptional()
  @IsString({ message: 'Поле [about_author] должно быть строкой' })
  @Length(0, 1000, {
    message: 'about_author должен быть длиной от 0 до 1000 символов',
  })about_author: string;

  @IsOptional()
  @IsString({ message: 'Поле [image_URL] должно быть строкой' })
  @Length(0, 400, {
    message: 'image_URL должен быть длиной от 0 до 400 символов',
  })image_URL: string;

  @ValidateNested({ each: true })
  @Type(() => CreateAuthorUserDto)
  user: CreateAuthorUserDto;
}
