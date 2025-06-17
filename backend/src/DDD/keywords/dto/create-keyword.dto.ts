import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsInt,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';

export class CreateKeywordUserDto {
  @IsNotEmpty({ message: 'Поле ID пользователя не может быть пустым' })
  @IsInt({ message: 'Поле ID пользователя должно быть целым числом' })
  @Min(1, { message: 'Поле ID пользователя должно быть больше нуля' })
  id: number;
}

export class CreateKeywordDto {
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({ message: 'Поле [name] должно быть строкой' })
  @Length(1, 100, {
    message: 'Ключевое слово должно быть от 1-го до 100 символов длиной',
  })
  name: string;

  @IsOptional()
  @IsString({ message: 'Поле [definition] должно быть строкой' })
  @Length(0, 1000, {
    message: 'definition должен быть длиной от 0 до 1000 символов',
  })definition: string;


  @ValidateNested({ each: true })
  @Type(() => CreateKeywordUserDto)
  user: CreateKeywordUserDto;
}
