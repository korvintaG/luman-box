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
import { CallbackData, ScenesNames } from '../telegram-sessons.patterns';
import { replyRegistration } from './messages';
import { UsersService } from 'src/DDD/users/users.service';

@Injectable()
@Scene(ScenesNames.REGISTRATION)
export class RegistrationScene {
  constructor(
    private telegramUsersDB: TelegramSessionsService,
    private usersDB: UsersService,
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
    const message = await replyRegistration(ctx);
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
      ctx.scene.enter(ScenesNames.MAIN);
    }
  }

  @Action(CallbackData.CHANGE_PASSWORD)
  async onChangePassword(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.CHANGE_PASSWORD) {
      ctx.scene.enter(ScenesNames.SUBMIT_PASSWORD);
    }
  }

  @Action(CallbackData.UPDATE_NAME)
  async onUpdateName(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.UPDATE_NAME) {
      ctx.scene.enter(ScenesNames.SUBMIT_USERNAME);
    }
  }

  @Action(CallbackData.CREATE_PASSWORD)
  async onCreatePassword(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.CREATE_PASSWORD) {
      ctx.scene.enter(ScenesNames.SUBMIT_PASSWORD);
    }
  }

  @Action(CallbackData.FINILIZE_REGISTRATION)
  async onFinilizeRegistration(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.FINILIZE_REGISTRATION) {
      ctx.session.password = '';
      const databaseUser = await this.usersDB.create(ctx.session);
      if (databaseUser) {
        ctx.session.user_id = databaseUser.id;
        await this.telegramUsersDB.saveUser(ctx.session);
        ctx.scene.enter(ScenesNames.REGISTRATION);
      } //вот тут дописать если база вернула ошибку и вернуть финальное сообщение
    }
  }

  /**
   * Срабатывает, если во время сцены пользователь отправляет любое сообщение, кроме /start или /menu
   */
  @On('message')
  async onAnswer(@Ctx() ctx: MyContext & SceneContext) {
    ctx.deleteMessage();
    console.log('сработала текстовая команда');
  }

  @SceneLeave() //действия при выходе из сцены
  async sceneLeave(@Ctx() ctx: MyContext & SceneContext): Promise<void> {
    console.log(
      'scene leave with message id:' + ctx.session.msg_to_upd.message_id,
    );
  }
}
