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
import { MyContext } from '../telegram-sessions.types';
import { SceneContext } from 'telegraf/typings/scenes';
import { CallbackData, ScenesNames } from '../telegram-sessons.patterns';
import { replyWithBackButton } from './messages';

@Injectable()
@Scene(ScenesNames.IDEAS)
export class IdeasScene {
  /**
   * Срабатывает при входе в сцену
   *
   * Константа message либо меняет предыдущее отправленное ботом сообщение (если оно есть), либо отправляет новое сообщение (если ранее переписка была удалена пользователем)
   *
   * Текст и кнопки формируются исходя из стейта
   */
  @SceneEnter()
  async enter(@Ctx() ctx: MyContext & SceneContext) {
    const message = await replyWithBackButton(ctx);
    ctx.session.msg_to_upd = message;
  }

  /**
   * Срабатывает, когда пользователь вводит в поле сообщения команду /start или /menu. Сообщение удаляется, пользователь переходит в основную сцену
   */
  @Command(/menu|start/)
  async onMenu(@Ctx() ctx: MyContext & SceneContext) {
    ctx.deleteMessage();
    ctx.session.msg_status = 0;
    ctx.scene.enter(ScenesNames.MAIN);
  }

  @Action(CallbackData.BACK_TO_MENU)
  async onBackRequest(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
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
  async onAnswer(@Ctx() ctx: MyContext & SceneContext) {
    ctx.deleteMessage();
  }

  /**
   * Срабатывает при выходе из сцены
   */
  @SceneLeave()
  async sceneLeave(@Ctx() ctx: MyContext & SceneContext): Promise<void> {
    console.log(
      'scene leave with message id:' + ctx.session.msg_to_upd.message_id,
    );
  }
}
