import { PartialType } from '@nestjs/mapped-types';
import { CreateTelegramMessageDto } from './create-telegram-message.dto';

export class UpdateTelegramMessageDto extends PartialType(
  CreateTelegramMessageDto,
) {}
