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
import { ITelegramUser, MyContext } from '../telegram.types';
import { SceneContext } from 'telegraf/typings/scenes';
import { CallbackData, Patterns, ScenesNames } from '../telegram.patterns';
import { replySubmitUsername } from './messages';
import { UsersService } from '../../users/users.service';
import {
  ChatId,
  customLog,
  deletMessageWithLog,
  onStartOrMenuCommand,
  sanitizeUsername,
  updateMessageState,
} from '../utils';

@Injectable()
@Scene(ScenesNames.SUBMIT_USERNAME)
export class SubmitUsernameScene {
  constructor(
    private readonly telegramUsersDB: TelegramSessionsService,
    private readonly usersDB: UsersService,
  ) {}

  /**
   * Метод проверяет на уникальность введенный name по 2 таблицам:users и telegram-session, без учета регистра
   */
  async checkIfNameIsUnique(userName: string, user: ITelegramUser) {
    const checkTelegramBD =
      await this.telegramUsersDB.findNameCaseInsensitive(userName);
    const checkUsersDB = await this.usersDB.findNameCaseInsensitive(userName);
    return (
      Boolean(checkTelegramBD.length === 0) ||
      (Boolean(checkTelegramBD[0].chat_id === user.chat_id) &&
        (Boolean(checkUsersDB.length === 0) ||
          Boolean((checkUsersDB[0].chat_id = user.chat_id))))
    );
  }

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
    const message = await replySubmitUsername(ctx, chatId);
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
      deletMessageWithLog(ctx, chatId);
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
    } else {
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `Пользователь отправил сообщение "${ctx.text}", чтобы задать юзернейм"`,
      );
      if (!ctx.session[chatId]) {
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Пользователь зашел впервые, поэтому создадим для него стейт и запись в telegram-sessions`,
        );
        try {
          const { id } = await this.telegramUsersDB.saveUser(
            ctx.session[chatId],
          );
          ctx.session[chatId].id = id;
          customLog(
            'TelegramBot',
            chatId,
            ctx.session.__scenes.current,
            `Новая запись о пользователе создана в telegram-sessions успешно`,
          );
        } catch (e) {
          customLog(
            'TelegramBot',
            chatId,
            ctx.session.__scenes.current,
            `Ошибка! Что-то пошло не так и новая запись о пользователе создана в telegram-sessions не была создана. Пользователю будет отправлено сообщение об ошибке`,
          );
          await ctx.telegram.sendMessage(chatId, Patterns.ERROR);
          await ctx.scene.leave();
        }
      }
      const userName = ctx.text;
      const userNameSanitized = sanitizeUsername(userName);
      if (userName.length < 5) {
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Юзернейм не прошел проверку на длинну`,
        );
        ctx.session[chatId].msg_status = 1; //задаем стейт ответа, что пользователь не прошел проверку по длинне имени
        ctx.scene.reenter();
      } else if (userName !== userNameSanitized) {
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Юзернейм не прошел проверку на наличие запрещенных символов`,
        );
        ctx.session[chatId].msg_status = 2; //задаем стейт ответа, что пользователь не прошел проверку по разрешенным знакам
        ctx.scene.reenter();
      } else if (
        (await this.checkIfNameIsUnique(
          userNameSanitized,
          ctx.session[chatId],
        )) === false
      ) {
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Юзернейм не прошел проверку на уникальность`,
        );
        ctx.session[chatId].msg_status = 3; //задаем стейт ответа, что пользователь не прошел проверку пникальности
        ctx.scene.reenter();
      } else {
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Юзернейм прошел все проверки`,
        );
        ctx.session[chatId].name = userNameSanitized;
        try {
          await this.telegramUsersDB.saveUser(ctx.session[chatId]);
          customLog(
            'TelegramBot',
            chatId,
            ctx.session.__scenes.current,
            `Обновлена запись о пользователе в telegram-users, пользователь будет перемещен в сцену registrationScene`,
          );
          ctx.session[chatId].name = userNameSanitized;
          ctx.session[chatId].msg_status = 0;
          ctx.scene.enter(ScenesNames.REGISTRATION);
        } catch (e) {
          ctx.session[chatId].msg_status = 0;
          customLog(
            'TelegramBot',
            chatId,
            ctx.session.__scenes.current,
            `Ошибка! Данные пользователя по каким-то причинам не сохранились в telegam-users. Пользователю будет отправлено сообщение об ошибке`,
          );
          await ctx.telegram.sendMessage(chatId, Patterns.ERROR);
          await ctx.scene.leave();
        }
      }
      deletMessageWithLog(ctx, chatId);
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
    customLog(
      'TelegramBot',
      chatId,
      ctx.session.__scenes.current,
      `Выход со сцены`,
    );
  }
}
