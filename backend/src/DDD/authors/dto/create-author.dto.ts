import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Length,
  Min,
  ValidateNested,
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

  @ValidateNested({ each: true })
  @Type(() => CreateAuthorUserDto)
  user: CreateAuthorUserDto;
}
