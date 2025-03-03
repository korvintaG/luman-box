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
import { TelegramSessionsService } from '../telegram.service';
import { MyContext } from '../telegram.types';
import { SceneContext } from 'telegraf/typings/scenes';
import { CallbackData, Patterns, ScenesNames } from '../telegram.patterns';
import { replyRegistration } from './messages';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../../authorization/auth.service';
import {
  ChatId,
  customLog,
  deletMessageWithLog,
  onStartOrMenuCommand,
  updateMessageState,
} from '../utils';

@Injectable()
@Scene(ScenesNames.REGISTRATION)
export class RegistrationScene {
  constructor(
    private telegramUsersDB: TelegramSessionsService,
    private usersDB: UsersService,
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
  async enter(@Ctx() ctx: MyContext & SceneContext, @ChatId() chatId: string) {
    customLog(
      'TelegramBot',
      chatId,
      ctx.session.__scenes.current,
      `Вход в сцену`,
    );
    if (!ctx.session[chatId].chat_id) {
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `При входе в сцену не обраружен state, перенаправляем на mainScene`,
      );
      ctx.scene.enter(ScenesNames.MAIN);
    }
    const message = await replyRegistration(ctx, chatId);
    updateMessageState(message, ctx, chatId, this.telegramUsersDB);
  }

  @Action(CallbackData.BACK_TO_MENU)
  async onBackRequest(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
    @ChatId() chatId: string,
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.BACK_TO_MENU) {
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `Пользователь нажал кнопку "Назад в основное меню"`,
      );
      ctx.scene.enter(ScenesNames.MAIN);
    }
  }

  @Action(CallbackData.CHANGE_PASSWORD)
  async onChangePassword(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
    @ChatId() chatId: string,
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.CHANGE_PASSWORD) {
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `Пользователь нажал кнопку "Изменить пароль"`,
      );
      ctx.scene.enter(ScenesNames.SUBMIT_PASSWORD);
    }
  }

  @Action(CallbackData.UPDATE_NAME)
  async onUpdateName(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
    @ChatId() chatId: string,
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.UPDATE_NAME) {
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `Пользователь нажал кнопку "Изменить никнейм"`,
      );
      ctx.scene.enter(ScenesNames.SUBMIT_USERNAME);
    }
  }

  @Action(CallbackData.CREATE_PASSWORD)
  async onCreatePassword(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
    @ChatId() chatId: string,
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.CREATE_PASSWORD) {
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `Пользователь нажал кнопку "Создать пароль"`,
      );
      ctx.scene.enter(ScenesNames.SUBMIT_PASSWORD);
    }
  }

  @Action(CallbackData.FINILIZE_REGISTRATION)
  async onFinilizeRegistration(
    @Ctx()
    ctx: MyContext & SceneContext & { update: Update.CallbackQueryUpdate },
    @ChatId() chatId: string,
  ) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = 'data' in cbQuery ? cbQuery.data : null;
    if (userAnswer === CallbackData.FINILIZE_REGISTRATION) {
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `Пользователь нажал кнопку "Завершить процедуру регистрации"`,
      );
      const authUser = await this.authService.register(ctx.session[chatId]);
      if (authUser.success) {
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Данные пользователя успешно прошли процедуру Auth"`,
        );
        ctx.session[chatId].password = '';
        if (ctx.session[chatId].password === '') {
          customLog(
            'TelegramBot',
            chatId,
            ctx.session.__scenes.current,
            `Пароль пользователя удален из стейта`,
          );
        }
        const { id } = await this.usersDB.findOneByChatId(
          ctx.session[chatId].chat_id,
        );
        ctx.session[chatId].user_id = id;
        if (ctx.session[chatId].user_id === id) {
          customLog(
            'TelegramBot',
            chatId,
            ctx.session.__scenes.current,
            `Параметр user_id успешно записан в стейт`,
          );
        }
        const telegramUser = await this.telegramUsersDB.saveUser(
          ctx.session[chatId],
        );
        if (telegramUser) {
          customLog(
            'TelegramBot',
            chatId,
            ctx.session.__scenes.current,
            `Данные пользователя обновлены в таблице telegram-sessions. Процедура закончена и пользователь будет перенаправлен на сцену registrationScene`,
          );
          ctx.scene.enter(ScenesNames.REGISTRATION);
        } else {
          customLog(
            'TelegramBot',
            chatId,
            ctx.session.__scenes.current,
            `Ошибка! Данные пользователя по каким-то причинам не смогли обновиться в telegram-sessions. Пользователю будет отправлено сообщение об ошибке`,
          );
          await ctx.telegram.sendMessage(chatId, Patterns.ERROR);
          await ctx.scene.leave();
        }
      } else {
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Ошибка! Процедура Auth не успешна. Пользователю будет отправлено сообщение об ошибке`,
        );
        await ctx.telegram.sendMessage(chatId, Patterns.ERROR);
        await ctx.scene.leave();
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
   * Срабатывает, если во время сцены пользователь отправляет любое сообщение, кроме /start или /menu
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
      ctx.scene.enter(ScenesNames.MAIN);
    }
    deletMessageWithLog(ctx, chatId);
  }

  @SceneLeave()
  async sceneLeave(
    @Ctx() ctx: MyContext & SceneContext,
    @ChatId() chatId: string,
  ): Promise<void> {
    customLog(
      'TelegramBot',
      chatId,
      ctx.session.__scenes.current,
      `Выход со сцены`,
    );
  }
}
