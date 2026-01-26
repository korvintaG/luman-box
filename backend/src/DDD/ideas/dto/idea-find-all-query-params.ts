import { ApiQueryParam } from '../../../shared/decorators/api-query-multiple.decorator';

/**
 * Массив query параметров для метода findAll идей
 */
export const IdeaFindAllQueryParams: ApiQueryParam[] = [
  { 
    name: 'source_id', 
    required: false, 
    type: Number, 
    description: 'ID источника для фильтрации (опционально, используется вместе с keyword_id)', 
    example: 1 
  },
  { 
    name: 'keyword_id', 
    required: false, 
    type: Number, 
    description: 'ID ключевого слова для фильтрации (опционально, используется вместе с source_id)', 
    example: 1 
  },
];
