import { Message, Update } from '@telegraf/types';
import { Context } from 'telegraf';

export interface ITelegramUser {
  chat_id: number;
  user_id: number;
  name: string;
  password: string;
}

/**
 * Расширяет стейт пользователя
 *
 * Параметр msg_status хранит в себе опцию ответа на сообщение (в зависимости от того, на каком шаге находится пользователь)
 *
 * Параметр msg_to_up хранит в себе последнее сообщение бота, чтобы его можно было возвращать на случай, если возникают какие-то ошибки
 *
 * Парамет msg_to_del хранит в себе список сообщений, которые пользователь получал от бота, чтобы удалить их при необходимости
 *
 * Параметр prev_scene сохраняет в себе название предыдущей сцены, с которой пришел пользователь
 */
export interface ITelegramUserState extends ITelegramUser {
  msg_status: number;
  msg_to_upd: Message.TextMessage;
  msg_to_del?: number[];
  prev_scene?: string;
}

// export class userState implements ITelegramUserState {
//   chat_id: number;
//   user_id: number;
//   name: string;
//   password: string;
//   msg_status: number;
//   msg_to_upd: Message.TextMessage;
//   msg_to_del: number[];
//   prev_scene: string;

//   constructor(
//     chat_id: number,
//     user_id: number,
//     name: string,
//     password: string,
//   ) {
//     this.chat_id = chat_id;
//     this.user_id = user_id;
//     this.name = name;
//     this.password = password;
//     this.msg_status = 0;
//     // this.msg_to_upd = { chat: { id: chat_id }, text: '', message_id: 0 }; // Стартовое значение для msg_to_upd
//     this.msg_to_del = [];
//     this.prev_scene = '';
//   }


// }
/**
 * Расширяет встроенный контекст, чтобы можно было хранить данные сессии без постоянного обращения к базе данных
 */
export interface MyContext<U extends Update = Update> extends Context<U> {
  session: ITelegramUserState;
}

/**
 * Инициирует дефольный стейт для сессии
 */
export const initialTelegramUserState: ITelegramUser[] = [];
// {
//   chat_id: 0,
//   user_id: 0,
//   name: 'null',
//   password: '',
// };
