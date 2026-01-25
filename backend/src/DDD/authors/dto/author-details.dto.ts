import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../../../shared/entities/abstract.entity';

class AuthorUserDto {
  @ApiProperty({ description: 'ID пользователя', example: 10 })
  id: number;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван Иванов' })
  name: string;
}

class AuthorSimpleEntityDto {
  @ApiProperty({ description: 'ID сущности', example: 5 })
  id: number;

  @ApiProperty({ description: 'Название', example: 'Сочинения, том 1' })
  name: string;
}

export class AuthorDetailsDto {
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
    example: VerificationStatus.Moderated,
  })
  verification_status: VerificationStatus;

  @ApiPropertyOptional({ description: 'Автор записи', type: AuthorUserDto })
  user?: AuthorUserDto;

  @ApiPropertyOptional({ description: 'Модератор записи', type: AuthorUserDto })
  moderator?: AuthorUserDto;

  @ApiProperty({ description: 'Источники автора', type: AuthorSimpleEntityDto, isArray: true })
  sources: AuthorSimpleEntityDto[];

  @ApiProperty({ description: 'Идеи автора', type: AuthorSimpleEntityDto, isArray: true })
  ideas: AuthorSimpleEntityDto[];

  @ApiProperty({ description: 'Ключевые слова автора', type: AuthorSimpleEntityDto, isArray: true })
  keywords: AuthorSimpleEntityDto[];
}
