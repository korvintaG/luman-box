import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AttitudeCreateResponceDto {
  @ApiProperty({ description: 'Успешность операции', example: true })
  success: boolean;

  @ApiPropertyOptional({
    description: 'ID оценки (может быть null при удалении или если не нужно создавать)',
    example: 1,
    nullable: true,
  })
  id?: number | null;

  @ApiProperty({ description: 'ID идеи', example: 1 })
  idea_id: number;

  @ApiProperty({ description: 'ID пользователя', example: 1 })
  user_id: number;

  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Attitude created successfully',
    enum: [
      'Attitude created successfully',
      'Attitude updated successfully',
      'Attitude deleted successfully',
      'Attitude not necessary to create',
    ],
  })
  message: string;
}
