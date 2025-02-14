import { SceneContext } from 'telegraf/typings/scenes';
import { MyContext } from '../telegram.types';
import { Patterns, CallbackData } from '../telegram.patterns';
import { Message } from '@telegraf/types';

/**
 * Возвращает текст кнопки регистрации в зависимости от статуса пользователя (зарегистрирован? изменить пароль : задать/изменить логин и пароль )
 */
const regButtonText = (ctx: MyContext & SceneContext, chatId: string) =>
  ctx.session[chatId].name === 'null'
    ? Patterns.BUTTON_REGISTER
    : ctx.session[chatId].user_id === 0
      ? Patterns.BUTTON_REGISTER_FINILIZE
      : Patterns.BUTTON_MANAGE_ACCOUNT;

/**
 * Возвращает инлайновый набор кнопок основного меню
 */
const mainKeyboard = (ctx: MyContext & SceneContext, chatId: string) => {
  return {
    inline_keyboard: [
      [
        {
          text: regButtonText(ctx, chatId),
          callback_data: CallbackData.REGISTER,
        },
      ],
    ],
  };
};

/**
 * Возвращает клавиатуру с единственной кнопкой "Назад в сновное меню"
 */
const onlyBackButtonKeyboard = () => {
  return {
    inline_keyboard: [
      [
        {
          text: Patterns.BUTTON_BACK,
          callback_data: CallbackData.BACK_TO_MENU,
        },
      ],
    ],
  };
};

/**
 * Возвращает клавиатуру с кнопками для сцены регистрации
 */
const registrationKeyboard = (
  ctx: MyContext & SceneContext,
  chatId: string,
) => {
  if (ctx.session[chatId].user_id !== 0) {
    return {
      inline_keyboard: [
        [
          {
            text: Patterns.BUTTON_CHANGE_PASSWORD,
            callback_data: CallbackData.CHANGE_PASSWORD,
          },
        ],
        [
          {
            text: Patterns.BUTTON_BACK,
            callback_data: CallbackData.BACK_TO_MENU,
          },
        ],
      ],
    };
  } else if (ctx.session[chatId].password === '') {
    return {
      inline_keyboard: [
        [
          {
            text: Patterns.BUTTON_UPDATE_NAME,
            callback_data: CallbackData.UPDATE_NAME,
          },
          {
            text: Patterns.BUTTON_CREATE_PASSWORD,
            callback_data: CallbackData.CREATE_PASSWORD,
          },
        ],
        [
          {
            text: Patterns.BUTTON_BACK,
            callback_data: CallbackData.BACK_TO_MENU,
          },
        ],
      ],
    };
  } else {
    return {
      inline_keyboard: [
        [
          {
            text: Patterns.BUTTON_UPDATE_NAME,
            callback_data: CallbackData.UPDATE_NAME,
          },
          {
            text: Patterns.BUTTON_CHANGE_PASSWORD,
            callback_data: CallbackData.CHANGE_PASSWORD,
          },
        ],
        [
          {
            text: Patterns.BUTTON_REGISTER_FINILIZE,
            callback_data: CallbackData.FINILIZE_REGISTRATION,
          },
        ],
        [
          {
            text: Patterns.BUTTON_BACK,
            callback_data: CallbackData.BACK_TO_MENU,
          },
        ],
      ],
    };
  }
};

/**
 * Возвращает ответное сообщение и инлайновые кнопки для mainScene
 *
 * Контрукция try catch используется для того, чтобы отправить новое сообщение (если в чате все сообщения до этого были удалены) или изменить единсвтенное текущее сообщение для эффекта бота с одним сообщением
 *
 * В catch также проверяется возможность возникновения ошибки, когда пользователь более 2 раз совершает неправильное действие (например, дважды вводит короткий username или неоднократно вводит неуникальное имя пользователя) и метод возвращает ошибку, что сообщение изменить нельзя, т.к. оно не изменилось
 */
export async function replyMain(
  ctx: MyContext & SceneContext,
  chatId: string,
): Promise<Message.TextMessage> {
  const messageText =
    ctx.session[chatId].name !== 'null'
      ? `${Patterns.HELLO}, ${ctx.session[chatId].name}! 👋 `
      : `${Patterns.HELLO}, ${ctx.from.username}! 👋 `;
  try {
    const reply = await ctx.telegram.editMessageText(
      ctx.session[chatId].chat_id,
      ctx.session[chatId].msg_to_upd.message_id,
      undefined,
      messageText,
      {
        reply_markup: mainKeyboard(ctx, chatId),
        parse_mode: 'HTML',
      },
    );
    return reply as Message.TextMessage;
  } catch (e) {
    const reply = await ctx.telegram.sendMessage(chatId, messageText, {
      reply_markup: mainKeyboard(ctx, chatId),
      parse_mode: 'HTML',
    });
    if (
      e.message.includes(
        'new message content and reply markup are exactly the same',
      )
    ) {
      return ctx.session[chatId].msg_to_upd;
    }
    return reply;
  }
}

/**
 * Возвращает ответное сообщение и инлайновые кнопки для submitUsername.
 *
 * Статусы сообщения из ctx.session.msg_status:
 * * 1 - пользователь новый, еще не ввел имя пользователя
 * * 2 - пользователь ввел имя пользователя, но оно слишком короткое
 * * 3 - пользователь ввел имя пользователя ответным сообщением, но оно не прошло проверку на уникальность
 *
  * Контрукция try catch используется для того, чтобы отправить новое сообщение (если в чате все сообщения до этого были удалены) или изменить единсвтенное текущее сообщение для эффекта бота с одним сообщением
 *
 * В catch также проверяется возможность возникновения ошибки, когда пользователь более 2 раз совершает неправильное действие (например, дважды вводит короткий username или неоднократно вводит неуникальное имя пользователя) и метод возвращает ошибку, что сообщение изменить нельзя, т.к. оно не изменилось

 */
export async function replySubmitUsername(
  ctx: MyContext & SceneContext,
  chatId: string,
): Promise<Message.TextMessage> {
  const messageText =
    ctx.session[chatId].msg_status === 1
      ? Patterns.USERNAME_SHORT
      : ctx.session[chatId].msg_status === 2
        ? Patterns.USERNAME_INVALID
        : ctx.session[chatId].msg_status === 3
          ? Patterns.USERNAME_BUSY
          : ctx.session[chatId].name !== 'null'
            ? Patterns.USERNAME_UPDATE
            : Patterns.USERNAME_CREATE;

  try {
    const reply = await ctx.telegram.editMessageText(
      ctx.session[chatId].chat_id,
      ctx.session[chatId].msg_to_upd.message_id,
      undefined,
      messageText,
      {
        reply_markup: onlyBackButtonKeyboard(),
        parse_mode: 'HTML',
      },
    );
    return reply as Message.TextMessage;
  } catch (e) {
    if (
      e.message.includes(
        'new message content and reply markup are exactly the same',
      )
    ) {
      return ctx.session[chatId].msg_to_upd;
    }
    const reply = await ctx.telegram.sendMessage(chatId, messageText, {
      reply_markup: onlyBackButtonKeyboard(),
      parse_mode: 'HTML',
    });
    return reply;
  }
}

/**
 * Возвращает ответное сообщение и инлайновые кнопки для submitPassword.
 *
 * Статусы сообщения из ctx.session.msg_status:
 * * 0 - пользователь новый, еще не ввел пароль
 * * 1 - пользователь ввел пароль, но он слишком короткий
 * * 2 - пользователь ввел пароль ответным сообщением, но он не прошло проверку на уникальность
 * * 3 - пользователь уже есть в базе и он успешно поменял пароль
 *
  * Контрукция try catch используется для того, чтобы отправить новое сообщение (если в чате все сообщения до этого были удалены) или изменить единсвтенное текущее сообщение для эффекта бота с одним сообщением
 *
 * В catch также проверяется возможность возникновения ошибки, когда пользователь более 2 раз совершает неправильное действие (например, дважды вводит короткий пароль или неоднократно вводит пароль с запрещенными символами) и метод возвращает ошибку, что сообщение изменить нельзя, т.к. оно не изменилось

 */
export async function replySubmitPassword(
  ctx: MyContext & SceneContext,
  chatId: string,
): Promise<Message.TextMessage> {
  const messageText =
    ctx.session[chatId].msg_status === 1
      ? Patterns.PASSWORD_SHORT
      : ctx.session[chatId].msg_status === 2
        ? Patterns.PASSWORD_INVALID
        : ctx.session[chatId].msg_status === 3
          ? Patterns.PASSWORD_UPDATED
          : Patterns.PASSWORD_CREATE;

  try {
    const reply = await ctx.telegram.editMessageText(
      ctx.session[chatId].chat_id,
      ctx.session[chatId].msg_to_upd.message_id,
      undefined,
      messageText,
      {
        reply_markup: onlyBackButtonKeyboard(),
        parse_mode: 'HTML',
      },
    );
    return reply as Message.TextMessage;
  } catch (e) {
    if (
      e.message.includes(
        'new message content and reply markup are exactly the same',
      )
    ) {
      return ctx.session[chatId].msg_to_upd;
    }
    const reply = await ctx.telegram.sendMessage(chatId, messageText, {
      reply_markup: onlyBackButtonKeyboard(),
      parse_mode: 'HTML',
    });
    return reply;
  }
}

/**
 * Возвращает ответное сообщение и инлайновые кнопки для сцены Регистрации.
 *
 * Контрукция try catch используется для того, чтобы отправить новое сообщение (если в чате все сообщения до этого были удалены) или изменить единсвтенное текущее сообщение для эффекта бота с одним сообщением
 *
 * В catch также проверяется возможность возникновения ошибки, когда пользователь более 2 раз совершает неправильное действие (например, дважды вводит короткий пароль или неоднократно вводит пароль с запрещенными символами) и метод возвращает ошибку, что сообщение изменить нельзя, т.к. оно не изменилось

 */
export async function replyRegistration(
  ctx: MyContext & SceneContext,
  chatId: string,
): Promise<Message.TextMessage> {
  const messageText =
    ctx.session[chatId].user_id !== 0
      ? `${Patterns.REGISTER_STATUS_FINILIZED}${Patterns.USERNAME_CURRENT} ${ctx.session[chatId].name}\n${Patterns.PASSWORD_IS_SECRET}`
      : ctx.session[chatId].password === '' &&
          ctx.session[chatId].name !== 'null'
        ? `${Patterns.REGISTER_STATUS_PROCESSED}${Patterns.USERNAME_TEMP_CURRENT} ${ctx.session[chatId].name} \n\n${Patterns.REGISTER_NEED_ACTION}`
        : `${Patterns.REGISTER_STATUS_PROCESSED}${Patterns.USERNAME_TEMP_CURRENT} ${ctx.session[chatId].name} \n\n${Patterns.PASSWORD_TEMP_CURRENT} <tg-spoiler>${ctx.session[chatId].password}</tg-spoiler>\n\n${Patterns.REGISTER_NEED_TO_BE_FINISHED}`;

  try {
    const reply = await ctx.telegram.editMessageText(
      ctx.session[chatId].chat_id,
      ctx.session[chatId].msg_to_upd.message_id,
      undefined,
      messageText,
      {
        reply_markup: registrationKeyboard(ctx, chatId),
        parse_mode: 'HTML',
      },
    );
    return reply as Message.TextMessage;
  } catch (e) {
    if (
      e.message.includes(
        'new message content and reply markup are exactly the same',
      )
    ) {
      return ctx.session[chatId].msg_to_upd;
    }
    const reply = await ctx.telegram.sendMessage(chatId, messageText, {
      reply_markup: registrationKeyboard(ctx, chatId),
      parse_mode: 'HTML',
    });
    return reply;
  }
}

/**
 * Возвращает ответное сообщение-заглушку с кнопкой "назад"  для незаполненных сцен.
 *
 * Контрукция try catch используется для того, чтобы отправить новое сообщение (если в чате все сообщения до этого были удалены) или изменить единсвтенное текущее сообщение для эффекта бота с одним сообщением
 *
 * В catch также проверяется возможность возникновения ошибки, когда пользователь более 2 раз совершает неправильное действие (например, дважды вводит короткий пароль или неоднократно вводит пароль с запрещенными символами) и метод возвращает ошибку, что сообщение изменить нельзя, т.к. оно не изменилось

 */
export async function replyWithBackButton(
  ctx: MyContext & SceneContext,
  chatId: string,
): Promise<Message.TextMessage> {
  const messageText = Patterns.NOT_READY_PAGE;
  try {
    const reply = await ctx.telegram.editMessageText(
      ctx.session[chatId].chat_id,
      ctx.session[chatId].msg_to_upd.message_id,
      undefined,
      messageText,
      {
        reply_markup: onlyBackButtonKeyboard(),
        parse_mode: 'HTML',
      },
    );
    return reply as Message.TextMessage;
  } catch (e) {
    if (
      e.message.includes(
        'new message content and reply markup are exactly the same',
      )
    ) {
      return ctx.session[chatId].msg_to_upd;
    }
    const reply = await ctx.telegram.sendMessage(chatId, messageText, {
      reply_markup: onlyBackButtonKeyboard(),
      parse_mode: 'HTML',
    });
    return reply;
  }
}
