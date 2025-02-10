import { Message } from 'telegraf/typings/core/types/typegram';
import { MyContext } from './telegram.types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SceneContext } from 'telegraf/typings/scenes';
import { TelegramSessionsService } from './telegram-sessions.service';
import { TelegramSessions } from './entities/telegram-sessions.entity';

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
 * Функция удаляет полученное от пользователя сообщение, а также инициирует удаление сообщения, которое хранится в стейте msg_to_del
 */
export async function deleteMessageReceivedAndRest(
  ctx: MyContext,
  chatId: string,
) {
  const message = ctx.message;
  await deleteMessage(ctx, chatId);
  console.log('пытаемся удалить все ненужные сообщения в чате с пользователем');
  try {
    if ((ctx.from.id || ctx.chat?.id) === Number(chatId)) {
      await ctx.telegram.deleteMessage(chatId, message.message_id);
    }
  } catch (e) {
    console.error(
      'Уведомление: не обнаружены сообщения для удаления после перезагрузки бота',
    );
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
 * Добавляет сообщение в список сообщений на удаление и изменение, обновляет базу TelegramUser
 */
export async function messagePushToDelAndUpd(
  message: Message.TextMessage,
  ctx: MyContext & SceneContext,
  chatId: string,
  database: TelegramSessionsService,
): Promise<TelegramSessions> {
  ctx.session[chatId].msg_to_upd = message;
  ctx.session[chatId].msg_to_del = message.message_id;
  const telegramUser = await database.saveUser(ctx.session[chatId]);
  return telegramUser;
}
