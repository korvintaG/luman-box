import { Command, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { MyContext } from './telegram-sessions.types';
import { SceneContext } from 'telegraf/typings/scenes';
import { ScenesNames } from './telegram-sessons.patterns';
import { TelegramSessionsService } from './telegram-sessions.service';
import { UsersService } from '../users/users.service';

@Update()
export class TelegramUserBot {
  constructor(
    @InjectBot() private readonly bot: Telegraf<MyContext>,
    private readonly telegramUsersDB: TelegramSessionsService,
    private readonly usersDB: UsersService,
  ) {}

  @Start()
  async start(@Ctx() ctx: MyContext & SceneContext) {
    if (!ctx.session.chat_id) {
      console.log(
        'Сессия инициализирована заново. Возможно, бот был перезапущен.',
      );
      ctx.session.msg_to_del = [];
    }
    ctx.session.chat_id = ctx.chat.id | ctx.from.id | ctx.message.from.id;
    //проверяем зарегистрирован ли клиент, задаем стейт ctx.session
    const telegramUser = await this.telegramUsersDB.findByChatId(
      ctx.session.chat_id,
    );
    if (telegramUser) {
      ctx.session.name = telegramUser.name;
      ctx.session.password = telegramUser.password;
    }
    const user = await this.usersDB.findOneByChatId(ctx.session.chat_id);
    if (user) {
      ctx.session.name = user.name;
      ctx.session.user_id = user.id;
    }
    console.log(ctx.message.chat.id);
    console.log(ctx.from.id);
    console.log(ctx.message.from.id);
    ctx.deleteMessage();
    ctx.session.prev_scene = ScenesNames.START;
    ctx.scene.enter(ScenesNames.MAIN);
  }

  @Command(/menu/)
  async onMenu(@Ctx() ctx: MyContext & SceneContext) {
    console.log(ctx.message.chat.id);
    console.log(ctx.from.id);
    console.log(ctx.message.from.id);
    ctx.deleteMessage();
    ctx.scene.enter(ScenesNames.MAIN);
  }
}
