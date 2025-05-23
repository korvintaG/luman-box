# Назначение проекта

Проект является прототипом прототипа (заготовкой)
публичной базы знаний, основанной на модифицированной концепции
[ZettelKasten](https://ru.wikipedia.org/wiki/%D0%A6%D0%B5%D1%82%D1%82%D0%B5%D0%BB%D1%8C%D0%BA%D0%B0%D1%81%D1%82%D0%B5%D0%BD).

О теоритечском аспекте можно почитать на нашем [корпоративном блоге в Habr](https://habr.com/ru/companies/lumanbox/articles/).
Администрация Habr признала наш проект интересным и общественно-полезным,
поэтому бесплатно организовала корпоративный блог на своем ресурсе.

Примерный дизайн проекта доступен на [Figma](https://www.figma.com/community/file/1387406554424822333).
Поскольку это прототип прототипа, то всякие Pixel Perfect смысла не имеют,
так как проект будет еще сотни раз изменяться.
Тут главное - правильная архитектура проекта,
которая должна быть сделана "на вырост". На очень
большой вырост. Поскольку сейчас "ключевые слова" и "авторы" -
это почти идентичные компоненты. Но через пару спринтов
они будут кардинально отличаться друг от друга.

Структура проекта и подход к программированию были честно скопированы с проекта Yandex-практикум "Stellar-Burger".

Backend в проекте реализован на PostgreSQL.

Исходники проекта находятся [вот здесь](https://github.com/korvintaG/luman-box).

По всем вопросам пишите: [korvin@sarmat-soft.ru](mailto:korvin@sarmat-soft.ru)
или стучитесь в Telegram: [@KorvinTag](https://t.me/KorvinTag)

## Степень готовности

### Что уже сделано

Проект реализован мною лично с нуля. Реализовано отображение, добавление, редактирование, удаление следующих типов данных: авторы, источники, идеи, ключевые слова.  
Все это это сделано в адаптивной верстке - варианты для Desktop и мобильного.

Реализован и фронтенд, и бэкенд.
Так же сделана JWT-авторизация с refresh и access токенами.

Светланой Зиминой (github https://github.com/szimina) были реализованы следующие подсистемы для проекта:
* регистрация новых пользователей через Telegram-бот;
* смена/восстановление пароля через Telegram-бот;
* отслыка произвольных текстовых сообщений пользователям системы через Telegram;
* наведен порядок с версиями и зависимостями пакетов бэкенда.

За что ей огромнейшее спасибо!
 
### Деплой проекта
Проект для демонстрации выложен на https://sferatum.com

### Что еще не сделано

Нет информационных страниц по ссылкам из карточек на главной странице. Скорее всего, они будут реализованы в самом конце стартапа.

Нет совсем тестов никаких. Планируется добавить хоть какие то в ближайшее время.

## Доступные скрипты

Фронтенд запускается из каталога /frontend, бэкенд - из каталога /backend
Их нужно запустить по отдельности, перейдя в соотв. каталог и 

### `npm start`

## Запуск из докеров
Чтобы запустить как контейнеры, нужно склонировать исходники из github, заполнить два .env файла (для бэкенда и фронтенда), и выполнить команду из корня проекта:

### `docker compose up --build -d`

## Ваши замечания и предложения
Буду рад любым Вашим замечаниям и предложениям как по исходным кодам, так и по теоретическим вопросам.
 