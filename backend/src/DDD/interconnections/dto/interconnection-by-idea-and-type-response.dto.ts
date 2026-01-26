import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../../../shared/entities/abstract.entity';

class IdeaInfoDto {
  @ApiProperty({ description: 'ID идеи', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название идеи', example: 'Важность систематического подхода' })
  name: string;

  @ApiProperty({ description: 'Название источника и автора', example: 'Война и мир // Лев Толстой' })
  source_name: string;

  @ApiProperty({ description: 'ID источника', example: 1 })
  source_id: number;

  @ApiPropertyOptional({
    description: 'SVG изображение',
    example: '<svg>...</svg>',
  })
  SVG?: string | null;
}

class InterconnectionIdeaDto extends IdeaInfoDto {
  @ApiProperty({ description: 'Название взаимосвязи', example: 'Идея A связана с идеей B' })
  interconnection_name: string;

  @ApiProperty({ description: 'ID взаимосвязи', example: 1 })
  interconnection_id: number;

  @ApiProperty({
    description: 'Статус модерации взаимосвязи',
    enum: VerificationStatus,
    example: VerificationStatus.Moderated,
  })
  verification_status: VerificationStatus;
}

export class InterconnectionByIdeaAndTypeResponseDto {
  @ApiProperty({ description: 'Информация об идее', type: IdeaInfoDto })
  idea: IdeaInfoDto;

  @ApiProperty({
    description: 'Взаимосвязи в прямом направлении',
    type: InterconnectionIdeaDto,
    isArray: true,
  })
  interconnections_direct: InterconnectionIdeaDto[];

  @ApiProperty({
    description: 'Взаимосвязи в обратном направлении',
    type: InterconnectionIdeaDto,
    isArray: true,
  })
  interconnections_reverse: InterconnectionIdeaDto[];
}
