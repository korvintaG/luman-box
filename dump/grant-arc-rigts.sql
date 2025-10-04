-- Предоставляем права на все таблицы в схеме public
GRANT USAGE ON SCHEMA public TO arc;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO arc;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO arc;

-- Для новых таблиц, которые будут созданы в будущем
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO arc;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO arc;

-- Дополнительные права для pg_dump
GRANT CONNECT ON DATABASE sferatum TO arc;
GRANT USAGE ON SCHEMA public TO arc;