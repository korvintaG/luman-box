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
import { TelegramSessionsService } from '../telegram-sessions.service';
import { UsersService } from 'src/DDD/users/users.service';

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
  async enter(@Ctx() ctx: MyContext & SceneContext) {
    console.log(ctx.message.chat.id);
    console.log(ctx.from.id);
    console.log(ctx.message.from.id);
    // if (!ctx.session.chat_id) {
    //   console.log(
    //     'Сессия инициализирована заново. Возможно, бот был перезапущен.',
    //   );
    //   ctx.session.msg_to_del = [];
    //   ctx.session.chat_id = ctx.chat.id | ctx.from.id | ctx.message.from.id;
    //   //проверяем зарегистрирован ли клиент, задаем стейт ctx.session
    //   const telegramUser = await this.telegramUsersDB.findByChatId(
    //     ctx.session.chat_id,
    //   );
    //   if (telegramUser) {
    //     ctx.session.name = telegramUser.name;
    //     ctx.session.password = telegramUser.password;
    //   }
    //   const user = await this.usersDB.findOneByChatId(ctx.session.chat_id);
    //   if (user) {
    //     ctx.session.name = user.name;
    //     ctx.session.user_id = user.id;
    //   }
    // }
    const message = await replyMain(ctx);
    ctx.session.msg_to_upd = message;
    ctx.session.msg_to_del.push(message.message_id);
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
    ctx.session.prev_scene = ScenesNames.MAIN;
    console.log(
      `Вышли из сцены Main, записано значение в предыдущую сцену ${ctx.session.prev_scene}`,
    );
  }
}
