import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UserDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  name: string;

  @IsNumber()
  chat_id: number;
}
