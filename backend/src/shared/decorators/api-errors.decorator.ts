import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BadRequestResponseDto, InternalServerErrorResponseDto, UnauthorizedResponseDto } from '../dto/error-response.dto';

export function ApiCreateEntityErrors() {
  return applyDecorators(
    ApiResponse({ status: 400, description: 'Ошибка валидации данных или превышен лимит черновиков', type: BadRequestResponseDto }),
    ApiResponse({ status: 401, description: 'Пользователь не авторизован или не имеет права создавать сущность', type: UnauthorizedResponseDto }),
    ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера', type: InternalServerErrorResponseDto })
      
  );
}


export function ApiFindAllEntityErrors() {
  return applyDecorators(
    ApiResponse({ status: 401, description: 'Токен пользователя просрочен или неорректен', type: UnauthorizedResponseDto }),
    ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера', type: InternalServerErrorResponseDto })
  );
}


