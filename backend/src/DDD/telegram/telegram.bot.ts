import { Injectable } from '@nestjs/common';
import { Ctx, Start, Update, Command } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { TelegramSessionsService } from './telegram-sessions.service';
import { UsersService } from '../users/users.service';
import { ChatId, deleteMessageReceivedAndRest } from './utils';
import { MyContext, UserState } from './telegram.types';
import { ScenesNames } from './telegram.patterns';

@Update()
@Injectable()
export class TelegramBot {
  constructor(
    private readonly telegramUsersDB: TelegramSessionsService,
    private readonly usersDB: UsersService,
  ) {}

  /**
   * Срабатывает только при первом входе по кнопке Start или если до этого весь чат был удален. Все остальные команды /start переадресуют на сцену mainScene
   */
  @Start()
  async start(
    @Ctx() ctx: Scenes.SceneContext & MyContext,
    @ChatId() chatId: string,
  ) {
    const userState = await UserState.create(
      this.telegramUsersDB,
      this.usersDB,
      chatId,
    );
    ctx.session[chatId] = userState;
    await deleteMessageReceivedAndRest(ctx, chatId);
    ctx.session[chatId].prev_scene = ScenesNames.START;
    await ctx.scene.enter(ScenesNames.MAIN);
  }

  /**
   * Срабатывает, когда пользователь вводит в поле сообщения команду /menu после перезагрузки сервера, а до этого у него оставались сообщения в чате выше: в этом случае кнопки предыдущего сообщения не отвечают и клиент что-то может писать или нажать на меню
   */
  @Command(/menu/)
  async onMenu(
    @Ctx() ctx: Scenes.SceneContext & MyContext,
    @ChatId() chatId: string,
  ) {
    if (!ctx.session[chatId]) {
      //если нет стейта, то обновляем его
      const userState = await UserState.create(
        this.telegramUsersDB,
        this.usersDB,
        chatId,
      );
      ctx.session[chatId] = userState;
    }
    deleteMessageReceivedAndRest(ctx, chatId);
    ctx.session[chatId].prev_scene = ScenesNames.START;
    ctx.scene.enter(ScenesNames.MAIN);
  }
}
