import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

/**
 * Интерфейс для описания query параметра
 */
export interface ApiQueryParam {
  name: string;
  required?: boolean;
  type?: any;
  description?: string;
  example?: any;
  enum?: any[];
  isArray?: boolean;
}

/**
 * Универсальный декоратор для Swagger, который принимает массив query параметров
 * и преобразует их в отдельные @ApiQuery декораторы
 * 
 * @param params - массив объектов с описанием query параметров
 * @example
 * @ApiQueryMultiple([
 *   { name: 'source_id', required: false, type: Number, description: 'ID источника', example: 1 },
 *   { name: 'keyword_id', required: false, type: Number, description: 'ID ключевого слова', example: 1 }
 * ])
 */
export function ApiQueryMultiple(params: ApiQueryParam[]) {
  return applyDecorators(
    ...params.map(param => ApiQuery(param))
  );
}
