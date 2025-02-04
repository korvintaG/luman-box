import {
  Action,
  Command,
  Ctx,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { Injectable } from '@nestjs/common';
import { MyContext } from '../telegram.types';
import { SceneContext } from 'telegraf/typings/scenes';
import { CallbackData, ScenesNames } from '../telegram.patterns';
import { replyWithBackButton } from './messages';
import { ChatId, messagePushToDelAndUpd } from '../utils';
import { TelegramSessionsService } from '../telegram-sessions.service';

@Injectable()
@Scene(ScenesNames.AUTHORS)
export class AuthorsScene {
  constructor(private telegramUsersDB: TelegramSessionsService) {}

  /**
   * Срабатывает при входе в сцену
   *
   * Константа message либо меняет предыдущее отправленное ботом сообщение (если оно есть), либо отправляет новое сообщение (если ранее переписка была удалена пользователем)
   *
   * Текст и кнопки формируются исходя из стейта
   */
  @SceneEnter()
  async enter(@Ctx() ctx: MyContext & SceneContext, @ChatId() chatId: number) {
    const message = await replyWithBackButton(ctx, chatId);
    messagePushToDelAndUpd(message, ctx, chatId, this.telegramUsersDB);
  }

  /**
   * Срабатывает, когда пользователь вводит в поле сообщения команду /start или /menu. Сообщение удаляется, пользователь переходит в основную сцену
   */
  @Command(/menu|start/)
  async onMenu(@Ctx() ctx: MyContext & SceneContext, @ChatId() chatId: number) {
    ctx.deleteMessage();
    ctx.session[chatId].msg_status = 0;
    ctx.scene.enter(ScenesNames.MAIN);
  }

  @Action(CallbackData.BACK_TO_MENU)
  async onBackRequest(
    @Ctx()
    ctx: SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.BACK_TO_MENU) {
      ctx.scene.enter(ScenesNames.MAIN);
    }
  }

  /**
   * Срабатывает, если во время сцены пользователь отправляет любое сообщение, кроме /start или /menu
   */
  @On('message')
  async onAnswer(@Ctx() ctx: MyContext) {
    ctx.deleteMessage();
  }

  /**
   * Срабатывает при выходе из сцены
   */
  @SceneLeave()
  async sceneLeave(
    @Ctx() ctx: MyContext,
    @ChatId() chatId: number,
  ): Promise<void> {
    ctx.session[chatId].prev_scene = ScenesNames.AUTHORS;
  }
}
