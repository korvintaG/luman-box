import { PartialType } from '@nestjs/mapped-types';
import { CreateTelegramSessionsDto } from './create-telegram-sessions.dto';

export class UpdateTelegramSessionsDto extends PartialType(
  CreateTelegramSessionsDto,
) {}
