import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../types/custom';

export class UserDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  @Expose()
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Имя пользователя', example: 'admin' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'ID чата пользователя', example: 123456 })
  @IsNumber()
  chat_id: number;

  @ApiProperty({ description: 'ID роли пользователя', example: 1})
  @Expose()
  @IsNumber()
  role_id: Role;
}
