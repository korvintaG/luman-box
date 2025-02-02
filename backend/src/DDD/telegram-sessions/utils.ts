import { SceneContext } from 'telegraf/typings/scenes';
import { MyContext } from './telegram-sessions.types';

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
 * Функция восстановления стейта на случай, если сервер разорвал соединение в процессе общения с пользователем в боте
 */
export function setSessionState(ctx: MyContext & SceneContext) {
  ctx.session.chat_id = ctx.chat.id | ctx.from.id | ctx.message.from.id;
}

/**
 * Функция удаляет все сообщения, которые есть в массиве ctx.session.msg_to_del и используется в случае, если пользователь многократно нажимает кнопку "Menu"
 */
export async function deleteMessages(ctx: MyContext) {
  for (let i = ctx.session.msg_to_del.length - 1; i >= 0; i--) {
    const message = ctx.session.msg_to_del[i];
    try {
      await ctx.telegram.deleteMessage(ctx.session.chat_id, message);
      ctx.session.msg_to_del.splice(i, 1);
    } catch (e) {
      if (e.code === 400) {
        console.log(`Сообщение ${message} не существует или уже удалено.`);
        ctx.session.msg_to_del.splice(i, 1);
      } else {
        console.error(`Ошибка при удалении сообщения ${message}:`, e);
      }
    }
  }
}
