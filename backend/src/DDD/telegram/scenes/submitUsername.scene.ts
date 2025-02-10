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
import { ITelegramUser, MyContext } from '../telegram.types';
import { SceneContext } from 'telegraf/typings/scenes';
import { CallbackData, Patterns, ScenesNames } from '../telegram.patterns';
import { replySubmitUsername } from './messages';
import { UsersService } from 'src/DDD/users/users.service';
import { ChatId, messagePushToDelAndUpd, sanitizeUsername } from '../utils';

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
    console.log(`Вход в сцену ${ctx.session.__scenes.current}`);
    if (!ctx.session[chatId].chat_id) {
      //если после перехода на сцену был разрыв связи с сервером и стейт сбросился
      ctx.scene.enter(ScenesNames.MAIN);
    }
    const message = await replySubmitUsername(ctx, chatId);
    messagePushToDelAndUpd(message, ctx, chatId, this.telegramUsersDB);
  }

  /**
   * Срабатывает, когда пользователь вводит в поле сообщения команду /start или /menu. Сообщение удаляется, пользователь переходит в основную сцену
   */
  @Command(/^\/menu$/) // Регулярное выражение для точного совпадения с /menu
  @Command(/^\/start$/) // Регулярное выражение для точного совпадения с /start
  async onMenu(@Ctx() ctx: MyContext & SceneContext, @ChatId() chatId: string) {
    console.log('Написали start/menu из основной сцены');
    ctx.deleteMessage();
    ctx.session[chatId].msg_status = 0;
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
    @ChatId() chatId: string,
  ) {
    const telegramUser = await this.telegramUsersDB.saveUser(
      ctx.session[chatId],
    );
    ctx.session[chatId].id = telegramUser.id;
    const userName = ctx.text;
    const userNameSanitized = sanitizeUsername(userName);
    if (userName.length < 5) {
      ctx.session[chatId].msg_status = 1; //задаем стейт ответа, что пользователь не прошел проверку по длинне имени
      ctx.scene.reenter();
    } else if (userName !== userNameSanitized) {
      ctx.session[chatId].msg_status = 2; //задаем стейт ответа, что пользователь не прошел проверку по разрешенным знакам
      ctx.scene.reenter();
    } else if (
      (await this.checkIfNameIsUnique(
        userNameSanitized,
        ctx.session[chatId],
      )) === false
    ) {
      ctx.session[chatId].msg_status = 3; //задаем стейт ответа, что пользователь не прошел проверку пникальности
      ctx.scene.reenter();
    } else {
      ctx.session[chatId].name = userNameSanitized;
      const telegramUser = await this.telegramUsersDB.saveUser(
        ctx.session[chatId],
      );
      if (telegramUser.name === userNameSanitized) {
        ctx.session[chatId].name = userNameSanitized;
        ctx.session[chatId].msg_status = 0; //обнуляем стейт статуса ответа, т.к. переходим на новую сцену
        ctx.scene.enter(ScenesNames.REGISTRATION);
      } else {
        ctx.session[chatId].msg_status = 0; //обнуляем стейт ответа, т.к. ошибка
        ctx.editMessageText(Patterns.ERROR, { parse_mode: 'HTML' });
        await ctx.scene.leave();
      }
    }
    await ctx.deleteMessage();
  }

  /**
   * Срабатывает при выходе из сцены
   */
  @SceneLeave()
  async sceneLeave(
    @Ctx() ctx: MyContext & SceneContext,
    @ChatId() chatId: string,
  ): Promise<void> {
    console.log(`Выход со сцены ${ctx.session.__scenes.current}`);
    ctx.session[chatId].prev_scene = ScenesNames.SUBMIT_USERNAME;
  }
}
