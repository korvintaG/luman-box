import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseDto {
  @ApiProperty({ description: 'Тип ошибки', example: 'Bad Request' })
  error: string;

  @ApiProperty({ description: 'Сообщение об ошибке', example: 'Поле [name] не может быть пустым' })
  message: string;
}

export class UnauthorizedResponseDto {
  @ApiProperty({ description: 'Тип ошибки', example: 'Unauthorized' })
  error: string;

  @ApiProperty({ description: 'Сообщение об ошибке', example: 'У Вас нет прав на эту операцию' })
  message: string;

}

export class InternalServerErrorResponseDto {
  @ApiProperty({ description: 'Сообщение об ошибке', example: 'Нарушение целостности данных по индексу...' })
  message: string;

}
