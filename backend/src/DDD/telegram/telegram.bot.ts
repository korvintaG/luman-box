import { Injectable } from '@nestjs/common';
import { Ctx, Start, Update, Command, On, Action } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { TelegramSessionsService } from './telegram-sessions.service';
import { UsersService } from '../users/users.service';
import { ChatId, deleteMessageReceivedAndRest } from './utils';
import { MyContext, UserState } from './telegram.types';
import { ScenesNames } from './telegram.patterns';

@Update()
@Injectable()
export class TelegramBot {
  constructor(
    private readonly telegramUsersDB: TelegramSessionsService,
    private readonly usersDB: UsersService,
  ) {}

  /**
   * Срабатывает только при первом входе по кнопке Start или если до этого весь чат был удален. Все остальные команды /start переадресуют на сцену mainScene
   */
  @Start()
  async start(
    @Ctx() ctx: Scenes.SceneContext & MyContext,
    @ChatId() chatId: string,
  ) {
    // Добавляем задержку в 500 мс
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log('Вход в сцену Start');
    const userState = await UserState.create(
      this.telegramUsersDB,
      this.usersDB,
      chatId,
    );
    ctx.session[chatId] = userState;
    await deleteMessageReceivedAndRest(ctx, chatId);
    ctx.session[chatId].prev_scene = ScenesNames.START;
    console.log('Выход со цены Start');
    await ctx.scene.enter(ScenesNames.MAIN);
  }

  /**
   * Срабатывает, когда пользователь вводит в поле сообщения команду /menu после перезагрузки сервера, а до этого у него оставались сообщения в чате выше: в этом случае кнопки предыдущего сообщения не отвечают и клиент что-то может писать или нажать на меню
   */
  @Command(/^\/menu$/) // Регулярное выражение для точного совпадения с /menu
  @On('message')
  async onMenu(
    @Ctx() ctx: Scenes.SceneContext & MyContext,
    @ChatId() chatId: string,
  ) {
    console.log(
      'Написали /menu или любое другое сообщение из сцены Start, после того как бот был перезапущен сервером и все кнопки были недоступны',
    );
    if (!ctx.session[chatId]) {
      //если нет стейта, то обновляем его
      const userState = await UserState.create(
        this.telegramUsersDB,
        this.usersDB,
        chatId,
      );
      ctx.session[chatId] = userState;
    }
    deleteMessageReceivedAndRest(ctx, chatId);
    ctx.session[chatId].prev_scene = ScenesNames.START;
    ctx.scene.enter(ScenesNames.MAIN);
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
      console.log(
        'Пользователь нажал на неработающую кнопку после перезагрузки бота',
      );
      //всплывающее сообщение-уведомление вверху чата
      await ctx.answerCbQuery(
        'Бот был перезапущен, поэтому Вы были перенаправлены в основное меню.',
      );
      if (!ctx.session[chatId]) {
        //если нет стейта, то обновляем его
        const userState = await UserState.create(
          this.telegramUsersDB,
          this.usersDB,
          chatId,
        );
        ctx.session[chatId] = userState;
      }
      deleteMessageReceivedAndRest(ctx, chatId);
      ctx.session[chatId].prev_scene = ScenesNames.START;
      ctx.scene.enter(ScenesNames.MAIN);
    }

    // Если callback-запрос был обработан, продолжаем как обычно
    await ctx.answerCbQuery(); // Подтверждаем нажатие кнопки
  }
}
