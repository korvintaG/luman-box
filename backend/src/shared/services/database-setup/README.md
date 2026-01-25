# Database Setup Service

## Описание

`DatabaseSetupService` автоматически создает SQL функции в базе данных при запуске приложения.

## Как это работает

1. Сервис реализует интерфейс `OnModuleInit` из NestJS
2. При старте приложения автоматически вызывается метод `onModuleInit()`
3. Сервис читает SQL файлы из папки `dump/functions/`
4. Каждая функция создается в базе данных через `CREATE OR REPLACE FUNCTION`

## Текущие функции

- `get_keyword_full_name.sql` - рекурсивная функция для получения полного имени ключевого слова с учетом иерархии

## Добавление новых функций

1. Создайте SQL файл в папке `dump/functions/`
2. Добавьте имя функции в массив `functions` в файле `database-setup.service.ts`:

```typescript
const functions = ['get_keyword_full_name', 'my_new_function'];
```

3. Перезапустите приложение

## Логирование

Сервис логирует процесс создания функций:
- `Starting database functions setup...` - начало процесса
- `✓ Function {name} created successfully` - успешное создание функции
- `Failed to create function {name}: {error}` - ошибка при создании функции
- `Database functions setup completed` - завершение процесса

## Примечания

- Используется `CREATE OR REPLACE`, поэтому функция обновляется при каждом запуске
- Если создание одной функции провалилось, остальные функции все равно будут созданы
- Все ошибки логируются, но не прерывают работу приложения
