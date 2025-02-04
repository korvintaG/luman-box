import { Message } from 'telegraf/typings/core/types/typegram';
import { MyContext } from './telegram.types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SceneContext } from 'telegraf/typings/scenes';
import { TelegramSessionsService } from './telegram-sessions.service';

/**
 * Функция проверки логина на наличие запрещенных знаков.Выкидывает все знаки и пробелы, кроме латинских букв, цифр, тире и нижнего подчеркивания
 */
export function sanitizeUsername(pattern: string): string {
  return pattern.replace(/[^a-zA-Z1-9_-]|\s/g, '');
}

/**
 * Функция проверки пароля на наличие запрещенных знаков.Выкидывает все знаки, пробелы, кроме латинских букв, цифр и символов - _ @ ~ ? $ # % *
 */
export function sanitizePassword(pattern: string): string {
  return pattern.replace(/[^a-zA-Z1-9@~?$#%*)_-]\s/g, '');
}

/**
 * Функция удаляет сообщения по chat_id и message_id
 */
export async function deleteMessage(ctx: MyContext, chatId: number) {
  const message = ctx.session[chatId].msg_to_del;
  try {
    await ctx.telegram.deleteMessage(ctx.session[chatId].chat_id, message);
  } catch (e) {
    if (e.code === 400) {
      console.log(`Сообщение ${message} не существует или уже удалено.`);
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
  chatId: number,
) {
  const message = ctx.message;
  if (message.from.id === chatId) {
    await ctx.telegram.deleteMessage(chatId, message.message_id);
  }
  await deleteMessage(ctx, chatId);
}

/**
 * Декоратор \@ChatId()
 */
export const ChatId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp().getRequest();
    return context.chat?.id || context.from?.id || context.message?.from?.id;
  },
);

/**
 * Добавляет сообщение в список сообщений на удаление и изменение, обновляет базу TelegramUser
 */
export async function messagePushToDelAndUpd(
  message: Message.TextMessage,
  ctx: MyContext & SceneContext,
  chatId: number,
  database: TelegramSessionsService,
) {
  ctx.session[chatId].msg_to_upd = message;
  ctx.session[chatId].msg_to_del = message.message_id;
  await database.saveUser(ctx.session[chatId]);
}
