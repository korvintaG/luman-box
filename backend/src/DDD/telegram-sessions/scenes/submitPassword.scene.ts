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
import { TelegramSessionsService } from '../telegram-sessions.service';
import { MyContext } from '../telegram-sessions.types';
import { SceneContext } from 'telegraf/typings/scenes';
import {
  CallbackData,
  Patterns,
  ScenesNames,
} from '../telegram-sessons.patterns';
import { replySubmitPassword } from './messages';
import { UsersService } from 'src/DDD/users/users.service';
import { sanitizePassword } from '../utils';

@Injectable()
@Scene(ScenesNames.SUBMIT_PASSWORD)
export class SubmitPasswordScene {
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
  async enter(@Ctx() ctx: MyContext & SceneContext) {
    const message = await replySubmitPassword(ctx);
    ctx.session.msg_to_upd = message;
  }

  /**
   * Срабатывает, когда пользователь вводит в поле сообщения команду /start или /menu. Сообщение удаляется, пользователь переходит в основную сцену
   */
  @Command(/menu|start/)
  async onMenu(@Ctx() ctx: MyContext & SceneContext) {
    ctx.deleteMessage();
    console.log('сработала команда menu');
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
      console.log(ctx.session);
      ctx.scene.enter(ScenesNames.MAIN);
    }
  }

  /**
   * Срабатывает, если во время сцены пользователь отправляет любое сообщение, кроме /start или /menu
   */
  @On('message')
  async onAnswer(@Ctx() ctx: MyContext & SceneContext) {
    const userPassword = ctx.text;
    const userPasswordSanitized = sanitizePassword(userPassword);
    console.log('сработала текстовая команда');
    if (userPassword.length < 5) {
      ctx.session.msg_status = 1;
      ctx.scene.reenter();
    } else if (userPassword !== userPasswordSanitized) {
      ctx.session.msg_status = 2;
      ctx.scene.reenter();
    } else {
      ctx.session.password = userPasswordSanitized;
      const telegramUser = await this.telegramUsersDB.saveUser(ctx.session);
      if (telegramUser.password === userPasswordSanitized) {
        ctx.session.msg_status = 0;
        ctx.scene.enter(ScenesNames.REGISTRATION);
      } else {
        ctx.session.password = '';
        ctx.editMessageText(Patterns.ERROR, { parse_mode: 'HTML' });
        await ctx.scene.leave();
      }
    }
    await ctx.deleteMessage();
  }

  @SceneLeave() //действия при выходе из сцены
  async sceneLeave(@Ctx() ctx: MyContext & SceneContext): Promise<void> {
    console.log(
      'scene leave with message id:' + ctx.session.msg_to_upd.message_id,
    );
  }
}
