import {
  Ctx,
  Scene,
  SceneEnter,
  On,
  Action,
  Command,
  SceneLeave,
} from 'nestjs-telegraf';
import { Injectable } from '@nestjs/common';
import { MyContext } from '../telegram-sessions.types';
import { SceneContext } from 'telegraf/typings/scenes';
import { Update } from '@telegraf/types';
import { CallbackData, ScenesNames } from '../telegram-sessons.patterns';
import { replyMain } from './messages';

@Injectable()
@Scene(ScenesNames.MAIN)
export class MainScene {
  /**
   * Срабатывает при входе в сцену
   *
   * Константа message либо меняет предыдущее отправленное ботом сообщение (если оно есть), либо отправляет новое сообщение (если ранее переписка была удалена пользователем)
   *
   * Текст и кнопки формируются исходя из стейта
   */
  @SceneEnter()
  async enter(@Ctx() ctx: MyContext & SceneContext) {
    const message = await replyMain(ctx);
    ctx.session.msg_to_upd = message;
  }

  @Action(CallbackData.REGISTER)
  async onRegister(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.REGISTER) {
      if (ctx.session.name === 'null') {
        ctx.scene.enter(ScenesNames.SUBMIT_USERNAME);
      } else ctx.scene.enter(ScenesNames.REGISTRATION);
    }
  }

  @Action(CallbackData.AUTHORS)
  async onAuthors(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.AUTHORS) {
      ctx.scene.enter(ScenesNames.AUTHORS);
    }
  }

  @Action(CallbackData.SOURCES)
  async onSources(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.SOURCES) {
      ctx.scene.enter(ScenesNames.SOURCES);
    }
  }

  @Action(CallbackData.IDEAS)
  async onIdeas(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.IDEAS) {
      ctx.scene.enter(ScenesNames.IDEAS);
    }
  }

  @Action(CallbackData.KEYWORDS)
  async onKeywords(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.KEYWORDS) {
      ctx.scene.enter(ScenesNames.KEYWORDS);
    }
  }

  @Action(CallbackData.CONTACTS)
  async onContaces(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.CONTACTS) {
      ctx.scene.enter(ScenesNames.CONTACTS);
    }
  }

  /**
   * Срабатывает, когда пользователь вводит в поле сообщения команду /start или /menu. Сообщение удаляется, пользователь переходит в основную сцену
   */
  @Command(/menu|start/)
  async onMenu(@Ctx() ctx: MyContext & SceneContext) {
    ctx.deleteMessage();
    ctx.scene.enter(ScenesNames.MAIN);
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
  @SceneLeave() //действия при выходе из сцены
  async sceneLeave(@Ctx() ctx: MyContext & SceneContext): Promise<void> {
    // ctx.session.msg_to_upd = ctx.message.message_id;
    console.log(
      'scene leave with message id:' + ctx.session.msg_to_upd.message_id,
    );
  }
}
