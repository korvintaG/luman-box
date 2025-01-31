export enum Patterns {
  BUTTON_BACK = '◀️ Назад в основное меню',
  BUTTON_AUTHORS = '🧑‍🎓 Авторы',
  BUTTON_SOURCES = '📗 Источники',
  BUTTON_IDEAS = '💡 Идеи',
  BUTTON_KEYWORDS = '🗝️ Ключевые слова',
  BUTTON_CONTACTS = '☎️ Контакты ',

  BUTTON_REGISTER = '▶️ Зарегистрироваться',
  BUTTON_REGISTER_FINILIZE = '🏁 Завершить процедуру регистрации',

  BUTTON_CREATE_NAME = '✍️ Задать никнейм',
  BUTTON_UPDATE_NAME = '✍️ Изменить никнейм',
  BUTTON_CREATE_PASSWORD = '🤫 Задать пароль',
  BUTTON_CHANGE_PASSWORD = '🤫 Изменить пароль',

  ERROR = '🤷 Упс, что-то пошло не так!Напиши нашему админу @KorvinTag',
  HELLO = 'Привет',
  USERNAME_CURRENT = '<b>Твоё имя пользователя</b>: ',
  PASSWORD_CURRENT = '<b>Твой пароль</b>: ',
  USERNAME_TEMP_CURRENT = '<b>Твоё временное имя пользователя</b>: ',
  PASSWORD_TEMP_CURRENT = '<b>Твой временный пароль</b>: ',

  USERNAME_CREATE = 'Кажется, ты у нас впервые. Добро пожаловать! 🤗\n\nВ этом разделе ты можешь зарегистрироваться, чтобы потом использовать логин и пароль для входа на сайт http://www.piaris.net:8033/\n\nПридумай имя пользователя и впиши его ниже ответным сообщением  👇👇👇\n\n❗❗ Допускается минимум 5 символов (латинские буквы, цифры, тире и нижнее подчеркивание)',
  USERNAME_UPDATE = 'Придумай новое имя пользователя и впиши его ниже ответным сообщением  👇👇👇\n\n❗❗ Допускается минимум 5 символов (латинские буквы, цифры, тире и нижнее подчеркивание)',
  USERNAME_SHORT = '⛔ Имя пользователя слишком короткое.\n\n❗❗ Допускается минимум 5 символов (латинские буквы, цифры, тире и нижнее подчеркивание)\n\nПопробуй еще раз    👇👇👇',
  USERNAME_INVALID = '⛔ Имя пользователя не должно содержать кириллицу, специальные символы (кроме тире и нижнего подчеркивания)\n\nПопробуй еще раз    👇👇👇',
  USERNAME_BUSY = '⛔ Пользователь с таким никнеймом сущесвует...\n\nПопробуй еще раз    👇👇👇',

  REGISTER_NEED_ACTION = 'Здесь ты можешь либо поменять свой текущий логин (после подтверждения регистрации его поменять уже не получится), либо задать пароль (его можно будет поменять после подтверждения регистрации)\n\nЖми на соответствующую кнопку 👇👇👇',
  PASSWORD_CREATE = 'Придумай пароль   👇👇👇\n\n❗❗ Допускается минимум 8 символов:\nлатинские буквы, цифры и только эти спец.символы % * ) ? @ # $ ~ - _',
  PASSWORD_UPDATE = 'Задай новый пароль   👇👇👇\n\n❗❗ Допускается минимум 8 символов:\nлатинские буквы, цифры и только эти спец.символы % * ) ? @ # $ ~ - _',
  PASSWORD_SHORT = '⛔ Пароль слишком короткий. \n\nПридумай пароль от 8 символов   👇👇👇\n\n❗❗ Допускается минимум 8 символов:\nnлатинские буквы, цифры и только эти спец.символы % * ) ? @ # $ ~ - _',
  PASSWORD_INVALID = '⛔ Пароль не должен содержать кириллицу и запрещенные спец. символы (кроме % * ) ? @ # $ ~ - _ )\n\nПопробуй еще раз    👇👇👇',
  PASSWORD_IS_SECRET = '<b>Твой пароль</b>: <tg-spoiler>мы сами не знаем и не храним</tg-spoiler>\n\nТы можешь задать здесь новый пароль. Жми на кнопку "Изменить пароль" 👇👇👇',
  REGISTER_STATUS_PROCESSED = '<b>Твоя процедура регистрация в статусе: в процессе 🔄</b>\n\n',
  REGISTER_STATUS_FINILIZED = '<b>Твоя процедура регистрация в статусе: подтверждена ✅</b>\n\n',
  REGISTER_NEED_TO_BE_FINISHED = 'Жми на кнопку "Завершить процедуру регистрации" для окончательного подтверждения регистрации!',

  NOT_READY_PAGE = '🤷 Этот раздел пока что не готов.\n\nВозвращайся сюда позже',
}

export enum CallbackData {
  REGISTER = 'register',
  AUTHORS = 'authors',
  SOURCES = 'sources',
  IDEAS = 'ideas',
  KEYWORDS = 'keywords',
  CONTACTS = 'contacts',
  BACK_TO_MENU = 'back',
  CREATE_NAME = 'createName',
  CREATE_PASSWORD = 'createPassword',
  CHANGE_PASSWORD = 'changePassword',
  UPDATE_NAME = 'updateName',
  FINILIZE_REGISTRATION = 'finilizeRegistration',
}

export enum ScenesNames {
  MAIN = 'mainScene',
  AUTHORS = 'authorsScene',
  CONTACTS = 'contactsScene',
  IDEAS = 'ideasScene',
  KEYWORDS = 'keywordsScene',
  SOURCES = 'sourcesScene',
  REGISTRATION = 'registrationScene',
  SUBMIT_PASSWORD = 'submitPasswordScene',
  SUBMIT_USERNAME = 'submitUsernameScene',
}
