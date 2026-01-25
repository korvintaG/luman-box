import { ApiProperty } from '@nestjs/swagger';

export class EntityModerateResponseDto {
  @ApiProperty({ description: 'Признак успешной операции', example: true })
  success: boolean;

  @ApiProperty({ description: 'ID сущности', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Сообщение результата',
    example: 'Сущность moderated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Результат модерации',
    enum: ['approve', 'reject'],
    example: 'approve',
  })
  moderationStatus: 'approve' | 'reject';
}
