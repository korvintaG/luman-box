import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Role } from '../../../types/custom';

export class UserDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  name: string;

  @IsNumber()
  chat_id: number;

  @Expose()
  @IsNumber()
  role_id: Role;
}
