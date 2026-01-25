import { ApiProperty } from '@nestjs/swagger';
import { VerificationStatus } from '../../../shared/entities/abstract.entity';

class InterconnectionUserDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  id: number;
}

export class InterconnectionCreateResponceDto {
  @ApiProperty({ description: 'ID взаимосвязи', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Тип взаимосвязи',
    example: 1,
    minimum: 1,
    maximum: 30,
  })
  interconnection_type: number;

  @ApiProperty({ description: 'ID первой идеи', example: 1 })
  idea1_id: number;

  @ApiProperty({ description: 'ID второй идеи', example: 2 })
  idea2_id: number;

  @ApiProperty({
    description: 'Название связи в прямом направлении',
    example: 'Идея A связана с идеей B',
  })
  name_direct: string;

  @ApiProperty({
    description: 'Название связи в обратном направлении',
    example: 'Идея B связана с идеей A',
  })
  name_reverse: string;

  @ApiProperty({ description: 'Пользователь создатель взаимосвязи', type: InterconnectionUserDto })
  user?: InterconnectionUserDto;

  @ApiProperty({
    description: 'Статус модерации',
    enum: VerificationStatus,
    example: VerificationStatus.Creating,
  })
  verification_status: VerificationStatus;
}
