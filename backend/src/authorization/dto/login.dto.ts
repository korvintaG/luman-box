import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'admin',
  })
  @IsNotEmpty({ message: 'Поле [name] не может быть пустым' })
  @IsString({ message: 'Поле [name] должно быть строкой' })
  name: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password123',
    format: 'password',
  })
  @IsNotEmpty({ message: 'Поле [password] не может быть пустым' })
  @IsString({ message: 'Поле [password] должно быть строкой' })
  password: string;
}
