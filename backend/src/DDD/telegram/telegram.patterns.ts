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
  BUTTON_MANAGE_ACCOUNT = '✍️ Управление аккаунтом',

  ERROR = '🤷 Упс, что-то пошло не так!Напишите нашему админу @KorvinTag',
  HELLO = 'Привет',
  USERNAME_CURRENT = '<b>Ваш никнейм</b>: ',
  PASSWORD_CURRENT = '<b>Ваш пароль</b>: ',
  USERNAME_TEMP_CURRENT = '<b>Ваш временный никнейм</b>: ',
  PASSWORD_TEMP_CURRENT = '<b>Ваш временный пароль</b>: ',

  USERNAME_CREATE = 'Кажется, Вы у нас впервые. Добро пожаловать! 🤗\n\nВ этом разделе Вы можете зарегистрироваться, чтобы потом использовать никнейм и пароль для входа на сайт https://sferatum.com/\n\nПридумайте никнейм и впишите его ниже ответным сообщением  👇👇👇\n\n❗❗ Допускается минимум 5 символов (латинские буквы, цифры, тире и нижнее подчеркивание)',
  USERNAME_UPDATE = 'Придумайте новый никнейм и впишите его ниже ответным сообщением  👇👇👇\n\n❗❗ Допускается минимум 5 символов без пробелов: латинские буквы, цифры, тире и нижнее подчеркивание',
  USERNAME_SHORT = '⛔ Никнейм слишком короткий.\n\n❗❗ Допускается минимум 5 символов без пробелов: латинские буквы, цифры, тире и нижнее подчеркивание\n\nПопробуйте еще раз    👇👇👇',
  USERNAME_INVALID = '⛔ Никнейм не должен содержать кириллицу, пробелы и специальные символы (кроме тире и нижнего подчеркивания)\n\nПопробуйте еще раз    👇👇👇',
  USERNAME_BUSY = '⛔ Пользователь с таким никнеймом сущесвует...\n\nПопробуйте еще раз    👇👇👇',
  REGISTER_NEED_ACTION = 'Здесь Вы можете либо поменять свой текущий никнейм (после подтверждения регистрации его поменять уже не получится), либо задать пароль (его можно будет поменять после подтверждения регистрации)\n\nЖмите на соответствующую кнопку 👇👇👇',

  PASSWORD_CREATE = 'Придумайте пароль   👇👇👇\n\n❗❗ Допускается минимум 8 символов без пробелов:\nлатинские буквы, цифры и только эти спец.символы % * ) ? @ # $ ~ - _',
  PASSWORD_UPDATED = '✅ Пароль обновлен',
  PASSWORD_UPDATE = 'Задайте новый пароль   👇👇👇\n\n❗❗ Допускается минимум 8 символов без пробелов:\nлатинские буквы, цифры и только эти спец.символы % * ) ? @ # $ ~ - _',
  PASSWORD_SHORT = '⛔ Пароль слишком короткий. \n\nПридумайте пароль от 8 символов   👇👇👇\n\n❗❗ Допускается минимум 8 символов без пробелов:\nnлатинские буквы, цифры и только эти спец.символы % * ) ? @ # $ ~ - _',
  PASSWORD_INVALID = '⛔ Пароль не должен содержать кириллицу, пробелы и запрещенные спец. символы (кроме % * ) ? @ # $ ~ - _ )\n\nПопробуйте еще раз    👇👇👇',
  PASSWORD_IS_SECRET = '<b>Ваш пароль</b>: <tg-spoiler>мы сами не знаем и не храним</tg-spoiler>\n\nВы можете задать здесь новый пароль. Жмите на кнопку "Изменить пароль" 👇👇👇',
  REGISTER_STATUS_PROCESSED = '<b>Ваша процедура регистрация в статусе: в процессе 🔄</b>\n\n',
  REGISTER_STATUS_FINILIZED = '<b>Ваша процедура регистрация в статусе: подтверждена ✅</b>\n\n',
  REGISTER_NEED_TO_BE_FINISHED = 'Жмите на кнопку "Завершить процедуру регистрации" для окончательного подтверждения регистрации!',

  NOT_READY_PAGE = '🤷 Этот раздел пока что не готов.\n\nВозвращайтесь сюда позже',
}

export enum CallbackData {
  REGISTER = 'register',
  BACK_TO_MENU = 'back',
  CREATE_NAME = 'createName',
  CREATE_PASSWORD = 'createPassword',
  CHANGE_PASSWORD = 'changePassword',
  UPDATE_NAME = 'updateName',
  FINILIZE_REGISTRATION = 'finilizeRegistration',
}

export enum ScenesNames {
  START = 'start',
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
