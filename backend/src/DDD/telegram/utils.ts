import { Message } from 'telegraf/typings/core/types/typegram';
import { MyContext } from './telegram.types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SceneContext } from 'telegraf/typings/scenes';
import { TelegramSessionsService } from './telegram.service';
import { Patterns, ScenesNames } from './telegram.patterns';

/**
 * Функция проверки логина на наличие запрещенных знаков.Выкидывает все знаки и пробелы, кроме латинских букв, цифр, тире и нижнего подчеркивания
 */
export function sanitizeUsername(pattern: string): string {
  return pattern.replace(/[^a-zA-Z1-9_-]/g, '');
}

/**
 * Функция проверки пароля на наличие запрещенных знаков.Выкидывает все знаки, пробелы, кроме латинских букв, цифр и символов - _ @ ~ ? $ # % *
 */
export function sanitizePassword(pattern: string): string {
  return pattern.replace(/[^a-zA-Z0-9@~?$#%*)_-]/g, '');
}

/**
 * Функция удаляет сообщения по chat_id и message_id
 */
export async function deleteMessage(ctx: MyContext, chatId: string) {
  const message = ctx.session[chatId].msg_to_del;
  try {
    await ctx.telegram.deleteMessage(ctx.session[chatId].chat_id, message);
  } catch (e) {
    if (e.code === 400) {
      console.log(
        `Уведомление: сообщение ${message} не существует или уже удалено. Сообщение будет пересоздано.`,
      );
    } else {
      console.error(`Ошибка при удалении сообщения ${message}:`, e);
    }
  }
}

/**
 * Декоратор \@ChatId()
 */
// export const ChatId = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const context = ctx.switchToHttp().getRequest();
//     return context.chat?.id || context.from?.id || context.message?.from?.id;
//   },
// );
export const ChatId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp().getRequest();
    const chatId =
      context.chat?.id || context.from?.id || context.message?.from?.id;
    return chatId ? chatId.toString() : null; // Преобразуем в строку, если значение существует
  },
);

/**
 * Логирование сообщений в формате: dd.mm.yy hh24:mi:ss:ms subsystem text
 * @param subsystem - Подсистема или модуль, из которого вызывается лог
 * @param chat_id - Идентификатор чата (если применимо)
 * @param text - Текст сообщения для логирования
 */
export function customLog(
  subsystem: string,
  chat_id: string,
  scene_name: string,
  text: string,
): void {
  const now = new Date();

  const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getFullYear()).slice(-2)}`;
  const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}:${String(now.getMilliseconds()).padStart(3, '0')}`;

  const logMessage = `${formattedDate} ${formattedTime} ${subsystem} ${chat_id} ${scene_name ? scene_name : 'startScene'} ${text}`;
  console.log(logMessage);
}

/**
 * Добавляет сообщение в стейт, если пользователь новый или если изменился id сообщения, то обновляет telegam-session
 */
export async function updateMessageState(
  message: Message.TextMessage,
  ctx: MyContext & SceneContext,
  chatId: string,
  database: TelegramSessionsService,
): Promise<void> {
  customLog(
    'TelegramBot',
    chatId,
    ctx.session.__scenes.current,
    `Пользователю отправлено ответное сообщение id:${message.message_id} text: ${message.text.slice(0, 20)} ...`,
  );
  ctx.session[chatId].msg_to_upd = message;
  //если сообщение было создано заново или пользователь новый, то соответственно обновляем пользователя или создаем нового в telegam-session
  if (
    !ctx.session[chatId].id ||
    message.message_id !== ctx.session[chatId].msg_to_del
  ) {
    ctx.session[chatId].msg_to_del = message.message_id;
    try {
      const { id } = await database.saveUser(ctx.session[chatId]);
      if (!ctx.session[chatId].id) {
        ctx.session[chatId].id = id;
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Создали запись по пользователю в telegam-sessions, добавили id пользователя в стейт`,
        );
      } else {
        customLog(
          'TelegramBot',
          chatId,
          ctx.session.__scenes.current,
          `Обновили запись по пользователю в telegam-sessions, т.к. изменился id сообщения`,
        );
      }
    } catch (e) {
      customLog(
        'TelegramBot',
        chatId,
        ctx.session.__scenes.current,
        `Ошибка ${e}! Данные пользователя по каким-то причинам не смогли обновиться в telegram-sessions. Пользователю будет отправлено сообщение об ошибке`,
      );
      await ctx.telegram.sendMessage(chatId, Patterns.ERROR);
    }
  }
}

/**
 * Удаляет полученное сообение и переадресовывает на mainScene
 */
export async function onStartOrMenuCommand(
  ctx: MyContext & SceneContext,
  chatId: string,
) {
  customLog(
    'TelegramBot',
    chatId,
    ctx.session.__scenes.current,
    `Пользователь отправил команду ${ctx.session.text}`,
  );
  deletMessageWithLog(ctx, chatId);
  customLog(
    'TelegramBot',
    chatId,
    ctx.session.__scenes.current,
    `Пользователь будет перенаправлен на сцену mainScene`,
  );
  ctx.scene.enter(ScenesNames.MAIN);
}

/**
 * Удаляет полученное сообщение и выводит лог
 */
export async function deletMessageWithLog(
  ctx: MyContext & SceneContext,
  chatId: string,
): Promise<void> {
  try {
    await ctx.deleteMessage();
    customLog(
      'TelegramBot',
      chatId,
      ctx.session.__scenes.current,
      `Сообщение "${ctx.text}", полученное от пользователя, было удалено успешно.`,
    );
  } catch (e) {
    customLog(
      'TelegramBot',
      chatId,
      ctx.session.__scenes.current,
      `Сообщение "${ctx.text}", полученное от пользователя, по каким-то причинам не удалилось`,
    );
  }
}
