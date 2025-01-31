import { SceneContext } from 'telegraf/typings/scenes';
import { MyContext } from './telegram-sessions.types';

/**
 * Функция проверки логина на наличие запрещенных знаков.Выкидывает все знаки, кроме латинских букв, цифр, тире и нижнего подчеркивания
 */
export function sanitizeUsername(pattern: string): string {
  return pattern.replace(/[^a-zA-Z1-9_-]/g, '');
}

/**
 * Функция проверки пароля на наличие запрещенных знаков.Выкидывает все знаки, кроме латинских букв, цифр и символов - _ @ ~ ? $ # % *
 */
export function sanitizePassword(pattern: string): string {
  return pattern.replace(/[^a-zA-Z1-9@~?$#%*)_-]/g, '');
}

/**
 * Функция восстановления стейта на случай, если сервер разорвал соединение в процессе общения с пользователем в боте
 */
export function setSessionState(ctx: MyContext & SceneContext) {
  ctx.session.chat_id = ctx.chat.id | ctx.from.id | ctx.message.from.id;
}
