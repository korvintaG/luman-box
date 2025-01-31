import { Message, Update } from '@telegraf/types';
import { Context } from 'telegraf';

export interface ITelegramUser {
  chat_id: number;
  user_id: number;
  name: string;
  password: string;
}

/**
 * Расширяет стейт пользователя.
 *
 * Параметр msg_status хранит в себе опцию ответа на сообщение (в зависимости от того, на каком шаге находится пользователь)
 *
 * Параметр msg_to_up хранит в себе последнее сообщение бота, чтобы его можно было возвращать на случай, если возникают какие-то ошибки
 */
export interface ITelegramUserState extends ITelegramUser {
  msg_status: number;
  msg_to_upd: Message.TextMessage;
}

/**
 * Расширяет встроенный контекст, чтобы можно было хранить данные сессии без постоянного обращения к базе данных
 */
export interface MyContext<U extends Update = Update> extends Context<U> {
  session: ITelegramUserState;
}

/**
 * Инициирует дефольный стейт для сессии
 */
export const initialTelegramUserState: ITelegramUser = {
  chat_id: 0,
  user_id: 0,
  name: 'null',
  password: '',
};
