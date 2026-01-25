import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EntityModerateQueryDto {
  @ApiProperty({
    description: 'Действие модерации',
    enum: ['approve', 'reject'],
    example: 'approve',
  })
  action: 'approve' | 'reject';

  @ApiPropertyOptional({
    description: 'ID записи модерации (опционально)',
    example: 42,
  })
  moderation_record_id?: number;

  @ApiPropertyOptional({
    description: 'Комментарий модератора',
    example: 'Запись соответствует требованиям',
  })
  notes?: string;
}
