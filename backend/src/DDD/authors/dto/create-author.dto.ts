import {
  IsString,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({message: 'Поле [name] должно быть строкой'})
  @Length(3, 250, {message: 'ФИО автора должно быть от 3-х до 250 символов длиной'})
  name: string;
}

