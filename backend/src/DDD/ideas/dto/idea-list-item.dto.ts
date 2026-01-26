import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../../../shared/entities/abstract.entity';

class IdeaSourceAuthorDto {
  @ApiProperty({ description: 'ID автора', example: 1 })
  id: number;

  @ApiProperty({ description: 'Имя автора', example: 'Лев Толстой' })
  name: string;
}

class IdeaSourceDto {
  @ApiProperty({ description: 'ID источника', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название источника', example: 'Война и мир' })
  name: string;

  @ApiProperty({ description: 'Автор источника', type: IdeaSourceAuthorDto })
  author: IdeaSourceAuthorDto;
}

class IdeaUserDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  id: number;

  @ApiProperty({ description: 'Имя пользователя', example: 'admin' })
  name: string;
}

export class IdeaListItemDto {
  @ApiProperty({ description: 'ID идеи', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название идеи', example: 'Важность систематического подхода' })
  name: string;

  @ApiProperty({ description: 'Дата создания', example: '2024-01-15T10:30:00Z' })
  date_time_create: Date;

  @ApiPropertyOptional({
    description: 'SVG изображение',
    example: '<svg>...</svg>',
  })
  SVG?: string;

  @ApiProperty({
    description: 'Статус модерации',
    enum: VerificationStatus,
    example: VerificationStatus.Moderated,
  })
  verification_status: VerificationStatus;

  @ApiProperty({ description: 'Источник идеи', type: IdeaSourceDto })
  source: IdeaSourceDto;

  @ApiProperty({ description: 'Пользователь создатель идеи', type: IdeaUserDto })
  user: IdeaUserDto;
}
