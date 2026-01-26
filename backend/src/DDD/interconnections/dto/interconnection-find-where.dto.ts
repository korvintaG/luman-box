import { ApiPropertyOptional } from '@nestjs/swagger';

export class InterconnectionFindWhereDto {
  @ApiPropertyOptional({
    description: 'Название прямое',
    example: 'Прямая связь',
  })
  name_direct?: string;
}
