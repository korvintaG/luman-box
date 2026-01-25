import { ApiProperty } from '@nestjs/swagger';
import { VerificationStatus } from '../entities/abstract.entity';

export class EntityToModerateResponseDto {
  @ApiProperty({ description: 'Признак успешной операции', example: true })
  success: boolean;

  @ApiProperty({ description: 'ID сущности', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Сообщение результата',
    example: 'Сущность переведена в статус на модерацию',
  })
  message: string;

  @ApiProperty({
    description: 'Новый статус модерации',
    enum: VerificationStatus,
    example: VerificationStatus.ToModerate,
  })
  moderationStatus: VerificationStatus;
}
