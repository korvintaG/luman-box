import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../../../shared/entities/abstract.entity';

class SourceAuthorDto {
  @ApiProperty({ description: 'ID автора', example: 1 })
  id: number;
}

class UserDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  id: number;
}


export class SourceCreateResponseDto {
  @ApiProperty({ description: 'ID источника', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название источника', example: 'Как делать полезные заметки' })
  name: string;

  @ApiPropertyOptional({ description: 'Год публикации источника', example: '2012' })
  publication_year?: string;

  @ApiPropertyOptional({
    description: 'Описание источника',
    example: 'Книга о методах ведения заметок.',
  })
  about_source?: string;

  @ApiPropertyOptional({
    description: 'Ссылка на изображение источника',
    example: 'https://example.com/source.jpg',
  })
  image_URL?: string;

  @ApiPropertyOptional({ description: 'Автор источника', type: SourceAuthorDto })
  author?: SourceAuthorDto;

  @ApiProperty({ description: 'Пользователь создатель источника', type: UserDto })
  user?: UserDto;


  @ApiProperty({
    description: 'Статус модерации',
    enum: VerificationStatus,
    example: VerificationStatus.Creating,
  })
  verification_status: VerificationStatus;
}
