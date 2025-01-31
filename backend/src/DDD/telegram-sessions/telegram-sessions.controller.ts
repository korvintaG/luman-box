import { Controller, Get } from '@nestjs/common';
import { TelegramSessionsService } from './telegram-sessions.service';

import {
  Telegraf,
  Context as ContextTelegraf,
  NarrowedContext,
} from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';

export interface Context extends NarrowedContext<ContextTelegraf, any> {
  match: RegExpMatchArray;
}

@Controller('telegram-sessions')
export class TelegramSessionsController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly telegramSessionsService: TelegramSessionsService,
  ) {}

  // @Get('all')
  // async getAllUsers() {
  //   return await this.telegramSessionsService.getAll();
  // }
}
