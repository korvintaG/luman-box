import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BadRequestResponseDto, InternalServerErrorResponseDto, NotFoundResponseDto, UnauthorizedResponseDto } from '../dto/error-response.dto';

export function ApiCreateEntityErrors() {
  return applyDecorators(
    ApiResponse({ status: 400, description: 'Ошибка валидации данных или превышен лимит черновиков', type: BadRequestResponseDto }),
    ApiResponse({ status: 401, description: 'Пользователь не авторизован или не имеет права создавать сущность', type: UnauthorizedResponseDto }),
    ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера', type: InternalServerErrorResponseDto })
      
  );
}

export function ApiFindAllEntityErrors() {
  return applyDecorators(
    ApiResponse({ status: 401, description: 'Токен пользователя просрочен или некорректен', type: UnauthorizedResponseDto }),
    ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера', type: InternalServerErrorResponseDto })
  );
}

export function ApiGetEntityErrors() {
  return applyDecorators(
    ApiResponse({ status: 400, description: 'Ошибка задания параметров запроса', type: BadRequestResponseDto }),
    ApiResponse({ status: 401, description: 'Токен пользователя просрочен или некорректен', type: UnauthorizedResponseDto }),
    ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера', type: InternalServerErrorResponseDto })
  );
}

export function ApiUpdateEntityErrors() {
  return applyDecorators(
    ApiResponse({ status: 400, description: 'Ошибка валидации данных', type: BadRequestResponseDto }),
    ApiResponse({ status: 401, description: 'Пользователь не авторизован или не имеет права модифицировать сущность', type: UnauthorizedResponseDto }),
    ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера', type: InternalServerErrorResponseDto })
  );
}

export function ApiDeleteEntityErrors() {
  return applyDecorators(
    ApiResponse({ status: 404, description: 'Сущность не найдена', type: NotFoundResponseDto }),
    ApiResponse({ status: 401, description: 'Пользователь не авторизован или не имеет права удалять сущность', type: UnauthorizedResponseDto }),
    ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера', type: InternalServerErrorResponseDto })
  );
}


export function ApiToModerateEntityErrors() {
  return applyDecorators(
    ApiResponse({ status: 404, description: 'Сущность не найдена', type: NotFoundResponseDto }),
    ApiResponse({ status: 400, description: 'Сущность находится не в статусе создания', type: BadRequestResponseDto }),
    ApiResponse({ status: 401, description: 'Пользователь не авторизован или не имеет права переводить в статус на модерацию сущность, которого не создавал', type: UnauthorizedResponseDto }),
    ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера', type: InternalServerErrorResponseDto })
  );
}

export function ApiModerateEntityErrors() {
  return applyDecorators(
    ApiResponse({ status: 404, description: 'Сущность не найдена', type: NotFoundResponseDto }),
    ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера', type: InternalServerErrorResponseDto })
  );
}