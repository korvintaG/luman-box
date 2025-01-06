import {
  IsString,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class CreateKeywordDto {
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({message: 'Поле [name] должно быть строкой'})
  @Length(1, 100, {message: 'Ключевое слово должно быть от 1-го до 100 символов длиной'})
  name: string;
}
