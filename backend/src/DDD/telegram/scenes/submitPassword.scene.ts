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
import { MyContext } from '../telegram.types';
import { SceneContext } from 'telegraf/typings/scenes';
import { CallbackData, Patterns, ScenesNames } from '../telegram.patterns';
import { replySubmitPassword } from './messages';
import { UsersService } from 'src/DDD/users/users.service';
import { ChatId, messagePushToDelAndUpd, sanitizePassword } from '../utils';
import { AuthService } from 'src/authorization/auth.service';

@Injectable()
@Scene(ScenesNames.SUBMIT_PASSWORD)
export class SubmitPasswordScene {
  constructor(
    private readonly telegramUsersDB: TelegramSessionsService,
    private readonly usersDB: UsersService,
    private authService: AuthService,
  ) {}

  /**
   * Срабатывает при входе в сцену
   *
   * Константа message либо меняет предыдущее отправленное ботом сообщение (если оно есть), либо отправляет новое сообщение (если ранее переписка была удалена пользователем)
   *
   * Текст и кнопки формируются исходя из стейта
   */
  @SceneEnter()
  async enter(@Ctx() ctx: MyContext & SceneContext, @ChatId() chatId: number) {
    if (!ctx.session[chatId].chat_id) {
      //если после перехода на сцену был разрыв связи с сервером и стейт сбросился
      ctx.scene.enter(ScenesNames.MAIN);
    }
    const message = await replySubmitPassword(ctx, chatId);
    messagePushToDelAndUpd(message, ctx, chatId, this.telegramUsersDB);
  }

  /**
   * Срабатывает, когда пользователь вводит в поле сообщения команду /start или /menu. Сообщение удаляется, пользователь переходит в основную сцену
   */
  @Command(/menu|start/)
  async onMenu(@Ctx() ctx: MyContext & SceneContext) {
    ctx.deleteMessage();
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
  async onAnswer(
    @Ctx() ctx: MyContext & SceneContext,
    @ChatId() chatId: number,
  ) {
    const userPassword = ctx.text;
    const userPasswordSanitized = sanitizePassword(userPassword);
    if (userPassword.length < 5) {
      ctx.session[chatId].msg_status = 1;
      ctx.scene.reenter();
    } else if (userPassword !== userPasswordSanitized) {
      ctx.session[chatId].msg_status = 2;
      ctx.scene.reenter();
    } else {
      ctx.session[chatId].password = userPasswordSanitized;
      const telegramUser = await this.telegramUsersDB.saveUser(
        ctx.session[chatId],
      );
      if (telegramUser.password === userPasswordSanitized) {
        if (ctx.session[chatId].user_id === 0) {
          //если новый пользователь задает пароль
          ctx.session[chatId].msg_status = 0;
          ctx.scene.enter(ScenesNames.REGISTRATION);
        } else {
          //если зарегистрированный пользователь меняет пароль
          const authUser = await this.authService.update(ctx.session[chatId]);
          ctx.session[chatId].password = '';
          if (authUser.success) {
            const { id } = await this.usersDB.findOneByChatId(
              ctx.session[chatId].chat_id,
            );
            ctx.session[chatId].user_id = id;
            ctx.session[chatId].msg_status = 3;
            await this.telegramUsersDB.saveUser(ctx.session[chatId]);
            ctx.scene.reenter();
          } else {
            ctx.editMessageText(Patterns.ERROR, { parse_mode: 'HTML' });
            await ctx.scene.leave();
          }
        }
      } else {
        ctx.session[chatId].password = '';
        ctx.editMessageText(Patterns.ERROR, { parse_mode: 'HTML' });
        await ctx.scene.leave();
      }
    }
    await ctx.deleteMessage();
  }

  @SceneLeave() //действия при выходе из сцены
  async sceneLeave(
    @Ctx() ctx: MyContext & SceneContext,
    @ChatId() chatId: number,
  ): Promise<void> {
    ctx.session[chatId].prev_scene = ScenesNames.SUBMIT_PASSWORD;
  }
}
