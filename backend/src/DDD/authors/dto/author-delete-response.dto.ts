import { ApiProperty } from '@nestjs/swagger';

export class AuthorDeleteResponseDto {
  @ApiProperty({ description: 'Признак успешного удаления', example: true })
  success: boolean;

  @ApiProperty({ description: 'Сообщение результата', example: 'Author deleted successfully' })
  message: string;

  @ApiProperty({ description: 'ID удаленного автора', example: 1 })
  id: number;
}
