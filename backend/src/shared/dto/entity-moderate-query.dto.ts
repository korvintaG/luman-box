import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsInt, IsString } from 'class-validator';

export class EntityModerateQueryDto {
  @ApiProperty({
    description: 'Действие модерации',
    enum: ['approve', 'reject'],
    example: 'approve',
  })
  @IsEnum(['approve', 'reject'], { message: 'Поле [action] должно быть либо "approve", либо "reject"' })
  action: 'approve' | 'reject';

  @ApiPropertyOptional({
    description: 'ID записи модерации (опционально)',
    example: 42,
  })
  @IsOptional()
  @IsInt({ message: 'Поле [moderation_record_id] должно быть целым числом' })
  moderation_record_id?: number;

  @ApiPropertyOptional({
    description: 'Комментарий модератора',
    example: 'Запись соответствует требованиям',
  })
  @IsOptional()
  @IsString({ message: 'Поле [notes] должно быть строкой' })
  notes?: string;
}
