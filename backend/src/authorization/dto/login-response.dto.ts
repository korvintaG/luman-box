import { ApiProperty } from '@nestjs/swagger';

class LoginUserDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  id: number;

  @ApiProperty({ description: 'Имя пользователя', example: 'admin' })
  name: string;

  @ApiProperty({ description: 'ID роли пользователя', example: 1 })
  role_id: number;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT токен доступа',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({ description: 'Успешность операции', example: true })
  success: boolean;

  @ApiProperty({ description: 'Данные пользователя', type: LoginUserDto })
  user: LoginUserDto;
}
