import {
  Ctx,
  Scene,
  SceneEnter,
  On,
  Action,
  SceneLeave,
  Command,
} from 'nestjs-telegraf';
import { Injectable } from '@nestjs/common';
import { MyContext, UserState } from '../telegram.types';
import { SceneContext } from 'telegraf/typings/scenes';
import { Update } from '@telegraf/types';
import { CallbackData, ScenesNames } from '../telegram.patterns';
import { replyMain } from './messages';
import { TelegramSessionsService } from '../telegram-sessions.service';
import { UsersService } from 'src/DDD/users/users.service';
import { ChatId, messagePushToDelAndUpd } from '../utils';

@Injectable()
@Scene(ScenesNames.MAIN)
export class MainScene {
  constructor(
    private readonly telegramUsersDB: TelegramSessionsService,
    private readonly usersDB: UsersService,
  ) {}

  /**
   * Срабатывает при входе в сцену
   *
   * Константа message либо меняет предыдущее отправленное ботом сообщение (если оно есть), либо отправляет новое сообщение (если ранее переписка была удалена пользователем)
   *
   * Текст и кнопки формируются исходя из стейта
   */
  @SceneEnter()
  async enter(@Ctx() ctx: MyContext & SceneContext, @ChatId() chatId: string) {
    console.log(`Вход в сцену ${ctx.session.__scenes.current}`);
    if (!ctx.session[chatId]) {
      //если нет стейта, то обновляем его
      const userState = await UserState.create(
        this.telegramUsersDB,
        this.usersDB,
        chatId,
      );
      ctx.session[chatId] = userState;
    }
    const message = await replyMain(ctx, chatId); //отправляем ответ
    const { id } = await messagePushToDelAndUpd(
      //сохраняем id последнего отправленного ботом сообщения
      message,
      ctx,
      chatId,
      this.telegramUsersDB,
    );
    if (!ctx.session[chatId].id) {
      ctx.session[chatId].id = id; //сохраняем в стейт id, если пользователь новый и до этого был undefined
    }
  }

  @Action(CallbackData.REGISTER)
  async onRegister(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
    @ChatId() chatId: string,
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.REGISTER) {
      if (ctx.session[chatId].name === 'null') {
        ctx.scene.enter(ScenesNames.SUBMIT_USERNAME);
      } else ctx.scene.enter(ScenesNames.REGISTRATION);
    }
  }

  /**
   * Срабатывает, если во время сцены пользователь отправляет любое сообщение, чтобы не засорять чат.
   */
  @Command(/^\/menu$/) // Регулярное выражение для точного совпадения с /menu
  @Command(/^\/start$/) // Регулярное выражение для точного совпадения с /start
  async onMenu(@Ctx() ctx: MyContext & SceneContext) {
    console.log('Написал start/menu из основной сцены');
    ctx.deleteMessage();
    ctx.scene.reenter();
  }

  /**
   * Срабатывает, если во время сцены пользователь отправляет любое сообщение, чтобы не засорять чат.
   */
  @On('message')
  async onAnswer(@Ctx() ctx: MyContext & SceneContext) {
    await ctx.deleteMessage();
    if (ctx.text === '/start') {
      //обработка ситуации, когда пользователь удалил чат полностью, а потом заходит по старту
      ctx.scene.reenter();
    }
  }

  /**
   * Срабатывает при выходе из сцены
   */
  @SceneLeave()
  async sceneLeave(
    @Ctx() ctx: MyContext & SceneContext,
    @ChatId() chatId: string,
  ): Promise<void> {
    ctx.session[chatId].prev_scene = ScenesNames.MAIN;
    console.log(`Выход со сцены ${ctx.session.__scenes.current}`);
  }
}
