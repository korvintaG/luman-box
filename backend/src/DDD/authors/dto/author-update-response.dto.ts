import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../../../shared/entities/abstract.entity';

export class AuthorUpdateResponseDto {
  @ApiProperty({ description: 'ID автора', example: 1 })
  id: number;

  @ApiProperty({ description: 'ФИО автора', example: 'Лев Николаевич Толстой' })
  name: string;

  @ApiProperty({ description: 'Дата рождения автора', example: '1828-09-09' })
  birth_date: string;

  @ApiPropertyOptional({
    description: 'Место рождения автора',
    example: 'Ясная Поляна, Тульская губерния',
  })
  birth_place?: string;

  @ApiPropertyOptional({
    description: 'Краткая биография автора',
    example: 'Русский писатель, классик мировой литературы.',
  })
  about_author?: string;

  @ApiPropertyOptional({
    description: 'Ссылка на изображение автора',
    example: 'https://example.com/author.jpg',
  })
  image_URL?: string;

  @ApiProperty({
    description: 'Статус модерации',
    enum: VerificationStatus,
    example: VerificationStatus.Creating,
  })
  verification_status: VerificationStatus;
}
