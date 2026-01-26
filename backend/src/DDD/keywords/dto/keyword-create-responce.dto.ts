import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../../../shared/entities/abstract.entity';

class KeywordNameDto {
  @ApiProperty({ description: 'ID названия ключевого слова', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название ключевого слова', example: 'Враг' })
  name: string;
}

class KeywordUserDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  id: number;
}

export class KeywordCreateResponceDto {
  @ApiProperty({ description: 'ID ключевого слова', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название ключевого слова', example: 'Враг' })
  name: string;

  @ApiProperty({
    description: 'ID ключевого слова верхнего уровня',
    example: 0,
  })
  class_keyword_id: number;

  @ApiPropertyOptional({
    description: 'Определение ключевого слова',
    example: 'Враг — противник, недруг, тот, кто находится в состоянии борьбы с кем-либо, а также приносит вред и зло.',
  })
  definition?: string;

  @ApiPropertyOptional({
    description: 'Хлебные крошки (иерархия)',
    example: '[{\"id\" : 2172, \"name\" : \"Общество\"} , {\"id\" : 2569, \"name\" : \"Политика\"}]',
  })
  bread_crumbs?: string;

  @ApiPropertyOptional({
    description: 'Название класса метод ДО',
    example: 'Общество / Политика',
  })
  class_name_before?: string;

  @ApiPropertyOptional({
    description: 'Название класса метод ПОСЛЕ',
    example: 'Политика / Общество',
  })
  class_name_after?: string;

  @ApiProperty({
    description: 'Названия ключевого слова',
    type: KeywordNameDto,
    isArray: true,
  })
  names: KeywordNameDto[];

  @ApiProperty({ description: 'Пользователь создатель ключевого слова', type: KeywordUserDto })
  user?: KeywordUserDto;

  @ApiProperty({
    description: 'Статус модерации',
    enum: VerificationStatus,
    example: VerificationStatus.Creating,
  })
  verification_status: VerificationStatus;
}
