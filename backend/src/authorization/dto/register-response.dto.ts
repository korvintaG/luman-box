import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({ description: 'Успешность операции', example: true })
  success: boolean;
}
