import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../../../shared/entities/abstract.entity';

class IdeaSourceDto {
  @ApiProperty({ description: 'ID источника', example: 1 })
  id: number;
}

class IdeaKeywordNameDto {
  @ApiProperty({ description: 'ID ключевого слова', example: 1 })
  id: number;
}

class IdeaUserDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  id: number;
}

export class IdeaCreateResponseDto {
  @ApiProperty({ description: 'ID идеи', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название идеи', example: 'Важность систематического подхода' })
  name: string;

  @ApiProperty({
    description: 'Исходная цитата',
    example: 'Систематический подход к решению задач позволяет достигать лучших результатов.',
  })
  original_text: string;

  @ApiProperty({
    description: 'Содержание идеи',
    example: 'Систематический подход к решению задач позволяет достигать лучших результатов, так как обеспечивает структурированность и последовательность действий.',
  })
  content: string;

  @ApiPropertyOptional({
    description: 'SVG изображение',
    example: '<svg>...</svg>',
  })
  SVG?: string;

  @ApiPropertyOptional({ description: 'Источник идеи', type: IdeaSourceDto })
  source?: IdeaSourceDto;

  @ApiProperty({ description: 'Ключевые слова', type: IdeaKeywordNameDto, isArray: true })
  keyword_names: IdeaKeywordNameDto[];

  @ApiProperty({ description: 'Пользователь создатель идеи', type: IdeaUserDto })
  user?: IdeaUserDto;

  @ApiProperty({
    description: 'Статус модерации',
    enum: VerificationStatus,
    example: VerificationStatus.Creating,
  })
  verification_status: VerificationStatus;
}
