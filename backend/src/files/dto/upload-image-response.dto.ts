import { ApiProperty } from '@nestjs/swagger';

export class UploadImageResponseDto {
  @ApiProperty({ description: 'Сообщение об успешной загрузке', example: 'Image uploaded successfully' })
  message: string;

  @ApiProperty({ description: 'Имя загруженного файла', example: 'image-1234567890.jpg' })
  file_name: string;

  @ApiProperty({ description: 'Полный путь к загруженному файлу', example: 'uploads/images/image-1234567890.jpg' })
  full_file_name: string;
}
