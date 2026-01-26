import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../../../shared/entities/abstract.entity';

export class SourceAuthorDto {
  @ApiProperty({ description: 'ID автора', example: 1 })
  id: number;

  @ApiProperty({ description: 'Имя автора', example: 'Лев Толстой' })
  name: string;
}

export class SourceListItemDto {
  @ApiProperty({ description: 'ID источника', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название источника', example: 'Война и мир' })
  name: string;

  @ApiProperty({
    description: 'Статус модерации',
    enum: VerificationStatus,
    example: VerificationStatus.Moderated,
  })
  verification_status: VerificationStatus;

  @ApiProperty({ description: 'Автор источника', type: SourceAuthorDto})
  author: SourceAuthorDto;
}
