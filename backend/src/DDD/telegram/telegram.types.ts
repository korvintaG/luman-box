import { Message, Update } from '@telegraf/types';
import { Context } from 'telegraf';

import { UsersService } from '../users/users.service';
import { TelegramSessionsService } from './telegram-sessions.service';

export interface ITelegramUser {
  chat_id: number;
  user_id: number;
  name: string;
  password: string;
  msg_to_del: number;
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
  msg_to_upd?: Message.TextMessage;
  prev_scene?: string;
}

export class UserState implements ITelegramUserState {
  chat_id: number;
  user_id: number;
  name: string;
  password: string;
  msg_status: number;
  msg_to_upd?: Message.TextMessage;
  msg_to_del: number;
  prev_scene: string;

  private constructor(
    chat_id: number,
    user_id: number,
    name: string,
    password: string,
    msg_to_del: number,
  ) {
    this.chat_id = chat_id;
    this.user_id = user_id;
    this.name = name;
    this.password = password;
    this.msg_status = 0;
    this.msg_to_del = msg_to_del;
    this.prev_scene = '';
  }

  // Фабричный метод для асинхронной инициализации
  public static async create(
    telegramUsersDB: TelegramSessionsService,
    usersDB: UsersService,
    chat_id: number,
  ): Promise<UserState> {
    const telegramUser = await telegramUsersDB.findByChatId(chat_id);
    const userDB = await usersDB.findOneByChatId(chat_id);
    return new UserState(
      chat_id,
      userDB ? userDB.id : 0,
      telegramUser ? telegramUser.name : 'null',
      telegramUser ? telegramUser.password : '',
      telegramUser ? telegramUser.msg_to_del : 0,
    );
  }
}
/**
 * Расширяет встроенный контекст, чтобы можно было хранить данные сессии без постоянного обращения к базе данных
 */
export interface MyContext<U extends Update = Update> extends Context<U> {
  session: {
    [chatId: number]: UserState;
  };
}
