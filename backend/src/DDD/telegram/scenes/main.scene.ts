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
import {
  ChatId,
  customLog,
  deletMessageWithLog,
  onStartOrMenuCommand,
  updateMessageState,
} from '../utils';

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
    customLog(
      'TelegramBot',
      chatId,
      ctx.session.__scenes.current,
      `Вход в сцену`,
    );
    if (!ctx.session[chatId]) {
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `При входе в сцену не обраружен state, создаем state`,
      );
      const userState = await UserState.create(
        this.telegramUsersDB,
        this.usersDB,
        chatId,
      );
      ctx.session[chatId] = userState;
    }
    const message = await replyMain(ctx, chatId);
    updateMessageState(message, ctx, chatId, this.telegramUsersDB);
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
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `Пользователь нажал кнопку "Управление аккаунтом"`,
      );
      if (ctx.session[chatId].name === 'null') {
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Так как пользователь новый и имя в стейте прописано как null, отправляем его сразу на сцену SubmitUsername`,
        );
        ctx.scene.enter(ScenesNames.SUBMIT_USERNAME);
      } else {
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Так как пользователь уже частично или полностью зарегистрирован, отправляем  его на сцену registrationScene`,
        );
        ctx.scene.enter(ScenesNames.REGISTRATION);
      }
    }
  }

  /**
   * Срабатывает, когда пользователь вводит в поле сообщения команду /start или /menu. Сообщение удаляется, пользователь переходит в основную сцену
   */
  @Command(/^\/menu$/) // Регулярное выражение для точного совпадения с /menu
  @Command(/^\/start$/) // Регулярное выражение для точного совпадения с /start
  async onMenu(@Ctx() ctx: MyContext & SceneContext, @ChatId() chatId: string) {
    onStartOrMenuCommand(ctx, chatId);
  }

  /**
   * Срабатывает, если во время сцены пользователь отправляет любое сообщение, чтобы не засорять чат.
   */
  @On('message')
  async onAnswer(
    @Ctx() ctx: MyContext & SceneContext,
    @ChatId() chatId: string,
  ) {
    if (ctx.text === '/start') {
      //обработка ситуации, когда пользователь удалил чат полностью, а потом заходит по старту
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `Возможно, пльзователь до этого удалил чат полностью и теперь жмет на кнопку /start`,
      );
      try {
        await ctx.telegram.deleteMessage(
          chatId,
          ctx.session[chatId].msg_to_del,
        );
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Удалено старое сообщение от бота, которое было в чате`,
        );
      } catch (e) {
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Старое сообщение, которое надо удалить, не удалсь удалить`,
        );
      }
      ctx.scene.reenter();
    }
    deletMessageWithLog(ctx, chatId);
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
    customLog(
      'TelegramBot',
      chatId,
      ctx.session.__scenes.current,
      `Выход со сцены`,
    );
  }
}
