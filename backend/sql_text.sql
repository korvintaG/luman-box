select * from telegram_sessions;
delete from telegram_sessions where name='Lisenok' or chat_id='7366758638';
select chat_id, name from users;
delete from users where name='Lisenok';
select * from telegram_messages;
delete from telegram_messages where chat_id is null;