import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../../../shared/entities/abstract.entity';

export class KeywordItemDto {
  @ApiProperty({ description: 'ID ключевого слова', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название ключевого слова', example: 'Систематизация' })
  name: string;

  @ApiProperty({
    description: 'Статус модерации',
    enum: VerificationStatus,
    example: VerificationStatus.Moderated,
  })
  verification_status: VerificationStatus;

  @ApiProperty({ description: 'ID пользователя создателя', example: 1 })
  user_id: number;

  @ApiPropertyOptional({
    description: 'Количество названий на модерации (только для авторизованных пользователей)',
    example: 2,
  })
  names_to_moderate?: number;
}

class CurrentKeywordDto {
  @ApiProperty({ description: 'ID ключевого слова', example: 1 })
  id: number;

  @ApiPropertyOptional({ description: 'Название ключевого слова', example: 'Категория' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Статус модерации',
    enum: VerificationStatus,
    example: VerificationStatus.Moderated,
  })
  verification_status?: VerificationStatus;

  @ApiPropertyOptional({ description: 'ID пользователя создателя', example: 1 })
  user_id?: number;

  @ApiPropertyOptional({
    description: 'Количество названий на модерации (только для авторизованных пользователей)',
    example: 2,
  })
  names_to_moderate?: number;
}

export class KeywordByClassResponseDto {
  @ApiProperty({
    description: 'Текущее ключевое слово (если class_id указан) или { id: 0 } для корневого уровня',
    type: CurrentKeywordDto,
  })
  current: CurrentKeywordDto;

  @ApiProperty({
    description: 'Список ключевых слов',
    type: KeywordItemDto,
    isArray: true,
  })
  keywords: KeywordItemDto[];
}
