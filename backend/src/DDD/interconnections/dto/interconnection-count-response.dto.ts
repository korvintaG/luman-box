import { ApiProperty } from '@nestjs/swagger';

export class InterconnectionCountItemDto {
  @ApiProperty({ description: 'ID типа взаимосвязи', example: 1 })
  id: number;

  @ApiProperty({ description: 'Название типа взаимосвязи', example: 'Связано' })
  name: string;

  @ApiProperty({ description: 'Количество взаимосвязей в прямом направлении (idea1_id)', example: 5 })
  cnt1: number;

  @ApiProperty({ description: 'Количество взаимосвязей в обратном направлении (idea2_id)', example: 3 })
  cnt2: number;
}
