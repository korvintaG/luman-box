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
import { replySubmitPassword } from './messages';
import { UsersService } from 'src/DDD/users/users.service';
import {
  ChatId,
  customLog,
  deletMessageWithLog,
  onStartOrMenuCommand,
  sanitizePassword,
  updateMessageState,
} from '../utils';
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
    const message = await replySubmitPassword(ctx, chatId);
    updateMessageState(message, ctx, chatId, this.telegramUsersDB);
  }

  /**
   * Срабатывает, когда пользователь вводит в поле сообщения команду /start или /menu. Сообщение удаляется, пользователь переходит в основную сцену
   */
  @Command(/^\/menu$/) // Регулярное выражение для точного совпадения с /menu
  @Command(/^\/start$/) // Регулярное выражение для точного совпадения с /start
  async onMenu(@Ctx() ctx: MyContext & SceneContext, @ChatId() chatId: string) {
    onStartOrMenuCommand(ctx, chatId);
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
      ctx.session[chatId].msg_status = 4;
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
    if (ctx.text === '/start') {
      //обработка ситуации, когда пользователь удалил чат полностью, а потом заходит по старту
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `Возможно, пльзователь до этого удалил чат полностью и теперь жмет на кнопку /start`,
      );
      deletMessageWithLog(ctx, chatId);
      ctx.scene.enter(ScenesNames.MAIN);
    } else {
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `Пользователь отправил сообщение, чтобы задать пароль"`,
      );
      const userPassword = ctx.text;
      const userPasswordSanitized = sanitizePassword(userPassword);
      if (userPassword.length < 5) {
        ctx.session[chatId].msg_status = 1;
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Пароль не прошел проверку на длинну`,
        );
        ctx.scene.reenter();
      } else if (userPassword !== userPasswordSanitized) {
        ctx.session[chatId].msg_status = 2;
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Пароль не прошел проверку на наличие запрещенных символов`,
        );
        ctx.scene.reenter();
      } else {
        ctx.session[chatId].password = userPasswordSanitized;
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Пароль прошел валидацию`,
        );
        try {
          await this.telegramUsersDB.saveUser(ctx.session[chatId]);
          customLog(
            'TelegramBot',
            chatId,
            ctx.session.__scenes.current,
            `Пароль, полученный от пользователя, временно записан telegram-users`,
          );
          if (ctx.session[chatId].user_id === 0) {
            customLog(
              'TelegramBot',
              chatId,
              ctx.session.__scenes.current,
              `Так как пользователя еще нет в базе users, пользователь сейчас будет перенаправлен на сцену registerScene для дальнейшего подтверждения процедуры регистрации`,
            );
            ctx.session[chatId].msg_status = 0;
            ctx.scene.enter(ScenesNames.REGISTRATION);
          } else {
            customLog(
              'TelegramBot',
              chatId,
              ctx.session.__scenes.current,
              `Пользователь ранее уже был зарегистрирован в users и просто меняет пароль, далее будет проведена процедура Auth по новому паролю`,
            );
            try {
              await this.authService.update(ctx.session[chatId]);
              customLog(
                'TelegramBot',
                chatId,
                ctx.session.__scenes.current,
                `Пользователь успешно прошел процедуру Auth по смене пароля`,
              );
              ctx.session[chatId].password = '';
              customLog(
                'TelegramBot',
                chatId,
                ctx.session.__scenes.current,
                `Временный пароль в стейте удален`,
              );
              try {
                await this.telegramUsersDB.saveUser(ctx.session[chatId]);
                customLog(
                  'TelegramBot',
                  chatId,
                  ctx.session.__scenes.current,
                  `Данные пользователя обновлены в таблице telegram-sessions, пароль обнулен`,
                );
              } catch (e) {
                customLog(
                  'TelegramBot',
                  chatId,
                  ctx.session.__scenes.current,
                  `Ошибка! Пароль пользователя по каким-то причинам не смог обнулиться в telegram-sessions. Пользователю будет отправлено сообщение об ошибке`,
                );
                await ctx.telegram.sendMessage(chatId, Patterns.ERROR);
                await ctx.scene.leave();
              }
              ctx.session[chatId].msg_status = 3;
              ctx.scene.reenter();
            } catch (e) {
              ctx.session[chatId].password = '';
              ctx.editMessageText(Patterns.ERROR, { parse_mode: 'HTML' });
              await ctx.scene.leave();
            }
          }
        } catch (e) {
          ctx.session[chatId].password = '';
          ctx.editMessageText(Patterns.ERROR, { parse_mode: 'HTML' });
          await ctx.scene.leave();
        }
      }
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
