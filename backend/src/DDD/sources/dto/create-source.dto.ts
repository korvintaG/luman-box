import {
  IsString,
  IsInt,
  IsNotEmpty,
  Length,
  ValidateNested,
  Min,
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

  @ValidateNested({ each: true })
  @Type(() => CreateSourceAuthorDto)
  author?: CreateSourceAuthorDto;

  @ValidateNested({ each: true })
  @Type(() => CreateSourceUserDto)
  user: CreateSourceUserDto;
}
