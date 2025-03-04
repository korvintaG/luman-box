import { Injectable } from '@nestjs/common';
import { Ctx, Start, Update, Command, On, Action } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { TelegramSessionsService } from './telegram.service';
import { UsersService } from '../../users/users.service';
import { ChatId, customLog, deletMessageWithLog } from './utils';
import { MyContext, UserState } from './telegram.types';
import { ScenesNames } from './telegram.patterns';
import { TelegramMessagingService } from '../messages/telegram-messages.service';
import { throws } from 'assert';

@Update()
@Injectable()
export class TelegramBot {
  constructor(
    private readonly telegramUsersDB: TelegramSessionsService,
    private readonly usersDB: UsersService,
    private readonly telegramMessagingService: TelegramMessagingService,
  ) {}

 /**
   * Пример использования метода отправки сообщений из очереди
   */
  async notifyUser(userId: number, message: string) {
    await this.telegramMessagingService.sendMessage(userId, message);
  }

  /**
   * Срабатывает только при первом входе по кнопке Start или если сервер был перезагружен. Все остальные команды /start переадресуют на сцену mainScene
   */
  @Start()
  @Command(/^\/menu$/)
  @On('message')
  async start(
    @Ctx() ctx: Scenes.SceneContext & MyContext,
    @ChatId() chatId: string,
  ) {
    // Добавляем задержку в 500 мс
    await new Promise((resolve) => setTimeout(resolve, 500));
    customLog(
      'TelegramBot',
      chatId,
      ctx.session.__scenes.current,
      `Вход в сцену по сообщению "${ctx.text}" `,
    );

    const userState = await UserState.create(
      this.telegramUsersDB,
      this.usersDB,
      chatId,
    );
    ctx.session[chatId] = userState;
    customLog(
      'TelegramBot',
      chatId,
      ctx.session.__scenes.current,
      `Задан стейт ${JSON.stringify(ctx.session[chatId], null, 2)}`,
    );

    deletMessageWithLog(ctx, chatId);
    if (ctx.session[chatId].msg_to_del) {
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
    }
    customLog(
      'TelegramBot',
      chatId,
      ctx.session.__scenes.current,
      `Выход со сцены`,
    );
    await ctx.scene.enter(ScenesNames.MAIN);
  }

  /**
   * Обработка всех callback-запросов на случай, если до этого сервер был перезапущен и кнопки предыдущего сообщения бота не отвечают
   */
  @Action(/.*/) // Ловим все callback-запросы
  async onCallbackQuery(
    @Ctx()
    ctx: Scenes.SceneContext & MyContext,
    @ChatId() chatId: string,
  ) {
    // Проверяем, был ли callback-запрос обработан
    if (!ctx.callbackQuery) {
      return;
    }

    // Если callback-запрос не был обработан (например, бот был перезапущен)
    if (!ctx.session[chatId]) {
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        'Пользователь нажал на неработающую кнопку после перезагрузки бота. Отправили всплывающее сообщение о том, что он будет перенаправлен в главное меню',
      );
      //всплывающее сообщение-уведомление вверху чата. работает, к сожалению, только при нажатии на кнопки!
      await ctx.answerCbQuery(
        'Бот был перезапущен, поэтому Вы были перенаправлены в основное меню.',
      );
      if (!ctx.session[chatId]) {
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Не обраружен state, создаем state`,
        );
        const userState = await UserState.create(
          this.telegramUsersDB,
          this.usersDB,
          chatId,
        );
        ctx.session[chatId] = userState;
      }
      if (ctx.session[chatId].msg_to_del) {
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
      }
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `Выход со сцены`,
      );
      await ctx.scene.enter(ScenesNames.MAIN);
    }

    // Если callback-запрос был обработан, продолжаем как обычно
    await ctx.answerCbQuery(); // Подтверждаем нажатие кнопки
  }
}
