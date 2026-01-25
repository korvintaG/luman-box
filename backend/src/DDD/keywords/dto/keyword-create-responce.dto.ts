import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../../../shared/entities/abstract.entity';

class KeywordNameDto {
  @ApiProperty({ description: 'ID названия ключевого слова', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название ключевого слова', example: 'Систематизация' })
  name: string;
}

class KeywordUserDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  id: number;
}

export class KeywordCreateResponceDto {
  @ApiProperty({ description: 'ID ключевого слова', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название ключевого слова', example: 'Систематизация' })
  name: string;

  @ApiProperty({
    description: 'ID ключевого слова верхнего уровня',
    example: 0,
  })
  class_keyword_id: number;

  @ApiPropertyOptional({
    description: 'Определение ключевого слова',
    example: 'Процесс организации информации в систему',
  })
  definition?: string;

  @ApiPropertyOptional({
    description: 'Хлебные крошки (иерархия)',
    example: '[Категория 1 > Категория 2]',
  })
  bread_crumbs?: string;

  @ApiPropertyOptional({
    description: 'Название класса до',
    example: 'Категория 1',
  })
  class_name_before?: string;

  @ApiPropertyOptional({
    description: 'Название класса после',
    example: 'Категория 2',
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
