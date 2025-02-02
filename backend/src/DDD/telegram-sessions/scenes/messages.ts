import { SceneContext } from 'telegraf/typings/scenes';
import { MyContext } from '../telegram-sessions.types';
import {
  Patterns,
  CallbackData,
  ScenesNames,
} from '../telegram-sessons.patterns';
import { Message } from '@telegraf/types';
import { deleteMessages } from '../utils';

/**
 * Возвращает текст кнопки регистрации в зависимости от статуса пользователя (зарегистрирован? изменить пароль : задать/изменить логин и пароль )
 */
const regButtonText = (ctx: MyContext & SceneContext) =>
  ctx.session.name === 'null'
    ? Patterns.BUTTON_REGISTER
    : ctx.session.user_id === 0
      ? Patterns.BUTTON_REGISTER_FINILIZE
      : Patterns.BUTTON_MANAGE_ACCOUNT;

/**
 * Возвращает инлайновый набор кнопок основного меню
 */
const mainKeyboard = (ctx: MyContext & SceneContext) => {
  return {
    inline_keyboard: [
      [
        {
          text: regButtonText(ctx),
          callback_data: CallbackData.REGISTER,
        },
      ],
      [
        {
          text: Patterns.BUTTON_AUTHORS,
          callback_data: CallbackData.AUTHORS,
        },
        {
          text: Patterns.BUTTON_SOURCES,
          callback_data: CallbackData.SOURCES,
        },
      ],
      [
        {
          text: Patterns.BUTTON_IDEAS,
          callback_data: CallbackData.IDEAS,
        },
        {
          text: Patterns.BUTTON_KEYWORDS,
          callback_data: CallbackData.KEYWORDS,
        },
      ],
      [
        {
          text: Patterns.BUTTON_CONTACTS,
          callback_data: CallbackData.CONTACTS,
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
const registrationKeyboard = (ctx: MyContext & SceneContext) => {
  if (ctx.session.user_id !== 0) {
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
  } else if (ctx.session.password === '') {
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
): Promise<Message.TextMessage> {
  const messageText =
    ctx.session.name !== 'null'
      ? `${Patterns.HELLO}, ${ctx.session.name}! 👋 `
      : `${Patterns.HELLO}, ${ctx.from.username}! 👋 `;

  try {
    const reply = await ctx.telegram.editMessageText(
      ctx.session.chat_id,
      ctx.session.msg_to_upd.message_id,
      undefined,
      messageText,
      {
        reply_markup: mainKeyboard(ctx),
        parse_mode: 'HTML',
      },
    );
    return reply as Message.TextMessage;
  } catch (e) {
    const reply = await ctx.reply(messageText, {
      reply_markup: mainKeyboard(ctx),
      parse_mode: 'HTML',
    });
    if (
      e.message.includes(
        'new message content and reply markup are exactly the same',
      )
    ) {
      if ((ctx.session.prev_scene = ScenesNames.START)) {
        //если предыдущая сцена была Start, то возможно пользователь зашел после того, как до этого удалил все сообщения чата, при этом последнее сообщение которое было отправлено ботом, хранится в стейте и будет возвращать ошибку, что нечего править
        //удаляем все старые сообщения, которые теоретически могли бы быть, если пользователь многократно жал на старт, но до этого не удалял чат
        deleteMessages(ctx);
        return reply;
      } else return ctx.session.msg_to_upd;
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
): Promise<Message.TextMessage> {
  const messageText =
    ctx.session.msg_status === 1
      ? Patterns.USERNAME_SHORT
      : ctx.session.msg_status === 2
        ? Patterns.USERNAME_INVALID
        : ctx.session.msg_status === 3
          ? Patterns.USERNAME_BUSY
          : ctx.session.name !== 'null'
            ? Patterns.USERNAME_UPDATE
            : Patterns.USERNAME_CREATE;

  try {
    const reply = await ctx.telegram.editMessageText(
      ctx.session.chat_id,
      ctx.session.msg_to_upd.message_id,
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
      return ctx.session.msg_to_upd;
    }
    const reply = await ctx.reply(messageText, {
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
): Promise<Message.TextMessage> {
  const messageText =
    ctx.session.msg_status === 1
      ? Patterns.PASSWORD_SHORT
      : ctx.session.msg_status === 2
        ? Patterns.PASSWORD_INVALID
        : ctx.session.msg_status === 3
          ? Patterns.PASSWORD_UPDATED
          : Patterns.PASSWORD_CREATE;

  try {
    const reply = await ctx.telegram.editMessageText(
      ctx.session.chat_id,
      ctx.session.msg_to_upd.message_id,
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
      return ctx.session.msg_to_upd;
    }
    const reply = await ctx.reply(messageText, {
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
): Promise<Message.TextMessage> {
  const messageText =
    ctx.session.user_id !== 0
      ? `${Patterns.REGISTER_STATUS_FINILIZED}${Patterns.USERNAME_CURRENT} ${ctx.session.name}\n${Patterns.PASSWORD_IS_SECRET}`
      : ctx.session.password === '' && ctx.session.name !== 'null'
        ? `${Patterns.REGISTER_STATUS_PROCESSED}${Patterns.USERNAME_TEMP_CURRENT} ${ctx.session.name} \n\n${Patterns.REGISTER_NEED_ACTION}`
        : `${Patterns.REGISTER_STATUS_PROCESSED}${Patterns.USERNAME_TEMP_CURRENT} ${ctx.session.name} \n\n${Patterns.PASSWORD_TEMP_CURRENT} <tg-spoiler>${ctx.session.password}</tg-spoiler>\n\n${Patterns.REGISTER_NEED_TO_BE_FINISHED}`;

  try {
    const reply = await ctx.telegram.editMessageText(
      ctx.session.chat_id,
      ctx.session.msg_to_upd.message_id,
      undefined,
      messageText,
      {
        reply_markup: registrationKeyboard(ctx),
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
      return ctx.session.msg_to_upd;
    }
    const reply = await ctx.reply(messageText, {
      reply_markup: registrationKeyboard(ctx),
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
): Promise<Message.TextMessage> {
  const messageText = Patterns.NOT_READY_PAGE;
  try {
    const reply = await ctx.telegram.editMessageText(
      ctx.session.chat_id,
      ctx.session.msg_to_upd.message_id,
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
      return ctx.session.msg_to_upd;
    }
    const reply = await ctx.reply(messageText, {
      reply_markup: onlyBackButtonKeyboard(),
      parse_mode: 'HTML',
    });
    return reply;
  }
}
