import { ApiProperty } from '@nestjs/swagger';

export class EntityDeleteResponseDto {
  @ApiProperty({ description: 'Признак успешного удаления', example: true })
  success: boolean;

  @ApiProperty({ description: 'Сообщение результата', example: 'Author deleted successfully' })
  message: string;

  @ApiProperty({ description: 'ID удаленной сущности', example: 1 })
  id: number;
}
