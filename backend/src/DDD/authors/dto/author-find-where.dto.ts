import { ApiPropertyOptional } from '@nestjs/swagger';

export class AuthorFindWhereDto {
  @ApiPropertyOptional({
    description: 'Имя автора',
    example: 'Лев Толстой',
  })
  name?: string;
}
