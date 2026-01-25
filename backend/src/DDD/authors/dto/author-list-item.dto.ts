import { ApiProperty } from '@nestjs/swagger';
import { VerificationStatus } from '../../../shared/entities/abstract.entity';

export class AuthorListItemDto {
  @ApiProperty({ description: 'ID автора', example: 1 })
  id: number;

  @ApiProperty({ description: 'ФИО автора', example: 'Лев Николаевич Толстой' })
  name: string;

  @ApiProperty({ description: 'Дата рождения автора', example: '1828-09-09' })
  birth_date: string;

  @ApiProperty({
    description: 'Статус модерации',
    enum: VerificationStatus,
    example: VerificationStatus.Moderated,
  })
  verification_status: VerificationStatus;
}
