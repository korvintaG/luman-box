DO $$
DECLARE cnt bigint;
BEGIN
 delete from ideas;
 delete from sources;
 delete from keywords;
 delete from authors;
 delete from idea_keywords;
 delete from users where LENGTH(password)<10;
  select count(*) from users into cnt;
  if cnt=0 then
insert into users (name, id_out, password) select 'Altay' , 'korvintag_85', '-' where not exists (select * from users where id_out='korvintag_85');
update users set name='Altay' where id_out='korvintag_85';
insert into users (name, id_out, password) select 'Budda_from_Dnipro' , 'korvintag_45', '-' where not exists (select * from users where id_out='korvintag_45');
update users set name='Budda_from_Dnipro' where id_out='korvintag_45';
insert into users (name, id_out, password) select 'Budda_from_Moscow' , 'korvintag_109', '-' where not exists (select * from users where id_out='korvintag_109');
update users set name='Budda_from_Moscow' where id_out='korvintag_109';
insert into users (name, id_out, password) select 'Chtun' , 'korvintag_40', '-' where not exists (select * from users where id_out='korvintag_40');
update users set name='Chtun' where id_out='korvintag_40';
insert into users (name, id_out, password) select 'DonJuan' , 'korvintag_6', '-' where not exists (select * from users where id_out='korvintag_6');
update users set name='DonJuan' where id_out='korvintag_6';
insert into users (name, id_out, password) select 'Ilonushka' , 'korvintag_19', '-' where not exists (select * from users where id_out='korvintag_19');
update users set name='Ilonushka' where id_out='korvintag_19';
insert into users (name, id_out, password) select 'Prince-Gos' , 'korvintag_30', '-' where not exists (select * from users where id_out='korvintag_30');
update users set name='Prince-Gos' where id_out='korvintag_30';
insert into users (name, id_out, password) select 'Psychologist' , 'korvintag_57', '-' where not exists (select * from users where id_out='korvintag_57');
update users set name='Psychologist' where id_out='korvintag_57';
insert into users (name, id_out, password) select 'RussianZettel' , 'korvintag_1', '-' where not exists (select * from users where id_out='korvintag_1');
update users set name='RussianZettel' where id_out='korvintag_1';
insert into users (name, id_out, password) select 'SelfDeveloper' , 'korvintag_24', '-' where not exists (select * from users where id_out='korvintag_24');
update users set name='SelfDeveloper' where id_out='korvintag_24';
insert into users (name, id_out, password) select 'Socionics' , 'korvintag_139', '-' where not exists (select * from users where id_out='korvintag_139');
update users set name='Socionics' where id_out='korvintag_139';
insert into users (name, id_out, password) select 'Warrior33' , 'korvintag_140', '-' where not exists (select * from users where id_out='korvintag_140');
update users set name='Warrior33' where id_out='korvintag_140';
insert into authors (name, id_out, user_id) select 'Зонке Аренс' , 'korvintag_1', (select id from users where id_out='korvintag_1') where not exists (select * from authors where id_out='korvintag_1');
update authors set name='Зонке Аренс' where id_out='korvintag_1';
insert into authors (name, id_out, user_id) select 'Кастанеда Карлос' , 'korvintag_6', (select id from users where id_out='korvintag_6') where not exists (select * from authors where id_out='korvintag_6');
update authors set name='Кастанеда Карлос' where id_out='korvintag_6';
insert into authors (name, id_out, user_id) select 'Харгадон Эндрю' , 'korvintag_19', (select id from users where id_out='korvintag_19') where not exists (select * from authors where id_out='korvintag_19');
update authors set name='Харгадон Эндрю' where id_out='korvintag_19';
insert into authors (name, id_out, user_id) select 'Гуревич Павел Семенович' , 'korvintag_21', (select id from users where id_out='korvintag_6') where not exists (select * from authors where id_out='korvintag_21');
update authors set name='Гуревич Павел Семенович' where id_out='korvintag_21';
insert into authors (name, id_out, user_id) select 'Лоулесс Джим' , 'korvintag_24', (select id from users where id_out='korvintag_24') where not exists (select * from authors where id_out='korvintag_24');
update authors set name='Лоулесс Джим' where id_out='korvintag_24';
insert into authors (name, id_out, user_id) select 'Пелевин Виктор' , 'korvintag_30', (select id from users where id_out='korvintag_30') where not exists (select * from authors where id_out='korvintag_30');
update authors set name='Пелевин Виктор' where id_out='korvintag_30';
insert into authors (name, id_out, user_id) select 'Щепетнов Евгений' , 'korvintag_40', (select id from users where id_out='korvintag_40') where not exists (select * from authors where id_out='korvintag_40');
update authors set name='Щепетнов Евгений' where id_out='korvintag_40';
insert into authors (name, id_out, user_id) select 'Поварнин Сергей' , 'korvintag_41', (select id from users where id_out='korvintag_1') where not exists (select * from authors where id_out='korvintag_41');
update authors set name='Поварнин Сергей' where id_out='korvintag_41';
insert into authors (name, id_out, user_id) select 'Дас Сатья' , 'korvintag_45', (select id from users where id_out='korvintag_45') where not exists (select * from authors where id_out='korvintag_45');
update authors set name='Дас Сатья' where id_out='korvintag_45';
insert into authors (name, id_out, user_id) select 'Мужицкая Татьяна' , 'korvintag_57', (select id from users where id_out='korvintag_57') where not exists (select * from authors where id_out='korvintag_57');
update authors set name='Мужицкая Татьяна' where id_out='korvintag_57';
insert into authors (name, id_out, user_id) select 'Шабанов Сергей' , 'korvintag_106', (select id from users where id_out='korvintag_24') where not exists (select * from authors where id_out='korvintag_106');
update authors set name='Шабанов Сергей' where id_out='korvintag_106';
insert into authors (name, id_out, user_id) select 'Толле Экхарт' , 'korvintag_109', (select id from users where id_out='korvintag_109') where not exists (select * from authors where id_out='korvintag_109');
update authors set name='Толле Экхарт' where id_out='korvintag_109';
insert into authors (name, id_out, user_id) select 'Синсеро Джен' , 'korvintag_113', (select id from users where id_out='korvintag_24') where not exists (select * from authors where id_out='korvintag_113');
update authors set name='Синсеро Джен' where id_out='korvintag_113';
insert into authors (name, id_out, user_id) select 'Ошо' , 'korvintag_115', (select id from users where id_out='korvintag_109') where not exists (select * from authors where id_out='korvintag_115');
update authors set name='Ошо' where id_out='korvintag_115';
insert into authors (name, id_out, user_id) select 'Чалдини Роберт' , 'korvintag_120', (select id from users where id_out='korvintag_24') where not exists (select * from authors where id_out='korvintag_120');
update authors set name='Чалдини Роберт' where id_out='korvintag_120';
insert into authors (name, id_out, user_id) select 'Клир Джеймс' , 'korvintag_121', (select id from users where id_out='korvintag_24') where not exists (select * from authors where id_out='korvintag_121');
update authors set name='Клир Джеймс' where id_out='korvintag_121';
insert into authors (name, id_out, user_id) select 'Новых Анастасия' , 'korvintag_125', (select id from users where id_out='korvintag_85') where not exists (select * from authors where id_out='korvintag_125');
update authors set name='Новых Анастасия' where id_out='korvintag_125';
insert into authors (name, id_out, user_id) select 'Сакс Оливер' , 'korvintag_130', (select id from users where id_out='korvintag_57') where not exists (select * from authors where id_out='korvintag_130');
update authors set name='Сакс Оливер' where id_out='korvintag_130';
insert into authors (name, id_out, user_id) select 'Элленхорн Росс' , 'korvintag_131', (select id from users where id_out='korvintag_24') where not exists (select * from authors where id_out='korvintag_131');
update authors set name='Элленхорн Росс' where id_out='korvintag_131';
insert into authors (name, id_out, user_id) select 'Гуленко Виктор' , 'korvintag_139', (select id from users where id_out='korvintag_139') where not exists (select * from authors where id_out='korvintag_139');
update authors set name='Гуленко Виктор' where id_out='korvintag_139';
insert into authors (name, id_out, user_id) select 'Грин Роберт' , 'korvintag_140', (select id from users where id_out='korvintag_140') where not exists (select * from authors where id_out='korvintag_140');
update authors set name='Грин Роберт' where id_out='korvintag_140';
insert into keywords (name, id_out, user_id) select 'Противоречие' , 'korvintag_2', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_2');
update keywords set name='Противоречие' where id_out='korvintag_2';
insert into keywords (name, id_out, user_id) select 'Понимание' , 'korvintag_11', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_11');
update keywords set name='Понимание' where id_out='korvintag_11';
insert into keywords (name, id_out, user_id) select 'Ошибки' , 'korvintag_36', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_36');
update keywords set name='Ошибки' where id_out='korvintag_36';
insert into keywords (name, id_out, user_id) select 'Решение (процесс принятия)' , 'korvintag_42', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_42');
update keywords set name='Решение (процесс принятия)' where id_out='korvintag_42';
insert into keywords (name, id_out, user_id) select 'Привычки' , 'korvintag_52', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_52');
update keywords set name='Привычки' where id_out='korvintag_52';
insert into keywords (name, id_out, user_id) select 'Сомнение' , 'korvintag_62', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_62');
update keywords set name='Сомнение' where id_out='korvintag_62';
insert into keywords (name, id_out, user_id) select 'Глупость' , 'korvintag_63', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_63');
update keywords set name='Глупость' where id_out='korvintag_63';
insert into keywords (name, id_out, user_id) select 'Успех' , 'korvintag_70', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_70');
update keywords set name='Успех' where id_out='korvintag_70';
insert into keywords (name, id_out, user_id) select 'Сопротивление' , 'korvintag_76', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_76');
update keywords set name='Сопротивление' where id_out='korvintag_76';
insert into keywords (name, id_out, user_id) select 'ЧСВ' , 'korvintag_83', (select id from users where id_out='korvintag_57') where not exists (select * from keywords where id_out='korvintag_83');
update keywords set name='ЧСВ' where id_out='korvintag_83';
insert into keywords (name, id_out, user_id) select 'Цель' , 'korvintag_106', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_106');
update keywords set name='Цель' where id_out='korvintag_106';
insert into keywords (name, id_out, user_id) select 'Путь (дао)' , 'korvintag_126', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_126');
update keywords set name='Путь (дао)' where id_out='korvintag_126';
insert into keywords (name, id_out, user_id) select 'Мистика' , 'korvintag_288', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_288');
update keywords set name='Мистика' where id_out='korvintag_288';
insert into keywords (name, id_out, user_id) select 'Смерть' , 'korvintag_297', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_297');
update keywords set name='Смерть' where id_out='korvintag_297';
insert into keywords (name, id_out, user_id) select 'Условности восприятия' , 'korvintag_298', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_298');
update keywords set name='Условности восприятия' where id_out='korvintag_298';
insert into keywords (name, id_out, user_id) select 'Восприятие' , 'korvintag_299', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_299');
update keywords set name='Восприятие' where id_out='korvintag_299';
insert into keywords (name, id_out, user_id) select 'Сталкинг' , 'korvintag_302', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_302');
update keywords set name='Сталкинг' where id_out='korvintag_302';
insert into keywords (name, id_out, user_id) select 'Сновидение' , 'korvintag_303', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_303');
update keywords set name='Сновидение' where id_out='korvintag_303';
insert into keywords (name, id_out, user_id) select 'ЛГБТ-движение' , 'korvintag_304', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_304');
update keywords set name='ЛГБТ-движение' where id_out='korvintag_304';
insert into keywords (name, id_out, user_id) select 'Тело человека' , 'korvintag_305', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_305');
update keywords set name='Тело человека' where id_out='korvintag_305';
insert into keywords (name, id_out, user_id) select 'Нагваль' , 'korvintag_307', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_307');
update keywords set name='Нагваль' where id_out='korvintag_307';
insert into keywords (name, id_out, user_id) select 'Место силы' , 'korvintag_311', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_311');
update keywords set name='Место силы' where id_out='korvintag_311';
insert into keywords (name, id_out, user_id) select 'Страх' , 'korvintag_368', (select id from users where id_out='korvintag_24') where not exists (select * from keywords where id_out='korvintag_368');
update keywords set name='Страх' where id_out='korvintag_368';
insert into keywords (name, id_out, user_id) select 'Враг' , 'korvintag_386', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_386');
update keywords set name='Враг' where id_out='korvintag_386';
insert into keywords (name, id_out, user_id) select 'Внутренний диалог' , 'korvintag_417', (select id from users where id_out='korvintag_30') where not exists (select * from keywords where id_out='korvintag_417');
update keywords set name='Внутренний диалог' where id_out='korvintag_417';
insert into keywords (name, id_out, user_id) select 'Фокусировка внимания' , 'korvintag_574', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_574');
update keywords set name='Фокусировка внимания' where id_out='korvintag_574';
insert into keywords (name, id_out, user_id) select 'Сознание' , 'korvintag_590', (select id from users where id_out='korvintag_30') where not exists (select * from keywords where id_out='korvintag_590');
update keywords set name='Сознание' where id_out='korvintag_590';
insert into keywords (name, id_out, user_id) select 'Важность' , 'korvintag_602', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_602');
update keywords set name='Важность' where id_out='korvintag_602';
insert into keywords (name, id_out, user_id) select 'Воля' , 'korvintag_687', (select id from users where id_out='korvintag_30') where not exists (select * from keywords where id_out='korvintag_687');
update keywords set name='Воля' where id_out='korvintag_687';
insert into keywords (name, id_out, user_id) select 'Действие' , 'korvintag_699', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_699');
update keywords set name='Действие' where id_out='korvintag_699';
insert into keywords (name, id_out, user_id) select 'Проблема' , 'korvintag_838', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_838');
update keywords set name='Проблема' where id_out='korvintag_838';
insert into keywords (name, id_out, user_id) select 'Необходимость' , 'korvintag_867', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_867');
update keywords set name='Необходимость' where id_out='korvintag_867';
insert into keywords (name, id_out, user_id) select 'Знание' , 'korvintag_909', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_909');
update keywords set name='Знание' where id_out='korvintag_909';
insert into keywords (name, id_out, user_id) select 'Сила' , 'korvintag_924', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_924');
update keywords set name='Сила' where id_out='korvintag_924';
insert into keywords (name, id_out, user_id) select 'Победа' , 'korvintag_950', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_950');
update keywords set name='Победа' where id_out='korvintag_950';
insert into keywords (name, id_out, user_id) select 'Саморазвитие' , 'korvintag_958', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_958');
update keywords set name='Саморазвитие' where id_out='korvintag_958';
insert into keywords (name, id_out, user_id) select 'Развитие' , 'korvintag_968', (select id from users where id_out='korvintag_24') where not exists (select * from keywords where id_out='korvintag_968');
update keywords set name='Развитие' where id_out='korvintag_968';
insert into keywords (name, id_out, user_id) select 'Проигрыш' , 'korvintag_972', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_972');
update keywords set name='Проигрыш' where id_out='korvintag_972';
insert into keywords (name, id_out, user_id) select 'Механизм' , 'korvintag_983', (select id from users where id_out='korvintag_24') where not exists (select * from keywords where id_out='korvintag_983');
update keywords set name='Механизм' where id_out='korvintag_983';
insert into keywords (name, id_out, user_id) select 'Суть' , 'korvintag_989', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_989');
update keywords set name='Суть' where id_out='korvintag_989';
insert into keywords (name, id_out, user_id) select 'Общество' , 'korvintag_998', (select id from users where id_out='korvintag_40') where not exists (select * from keywords where id_out='korvintag_998');
update keywords set name='Общество' where id_out='korvintag_998';
insert into keywords (name, id_out, user_id) select 'Жизнь' , 'korvintag_1019', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_1019');
update keywords set name='Жизнь' where id_out='korvintag_1019';
insert into keywords (name, id_out, user_id) select 'Слабость' , 'korvintag_1022', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_1022');
update keywords set name='Слабость' where id_out='korvintag_1022';
insert into keywords (name, id_out, user_id) select 'Концентрация' , 'korvintag_1027', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_1027');
update keywords set name='Концентрация' where id_out='korvintag_1027';
insert into keywords (name, id_out, user_id) select 'Человек' , 'korvintag_1031', (select id from users where id_out='korvintag_30') where not exists (select * from keywords where id_out='korvintag_1031');
update keywords set name='Человек' where id_out='korvintag_1031';
insert into keywords (name, id_out, user_id) select 'Разум' , 'korvintag_1037', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_1037');
update keywords set name='Разум' where id_out='korvintag_1037';
insert into keywords (name, id_out, user_id) select 'Иллюзия' , 'korvintag_1045', (select id from users where id_out='korvintag_1') where not exists (select * from keywords where id_out='korvintag_1045');
update keywords set name='Иллюзия' where id_out='korvintag_1045';
insert into keywords (name, id_out, user_id) select 'Бытие' , 'korvintag_1046', (select id from users where id_out='korvintag_109') where not exists (select * from keywords where id_out='korvintag_1046');
update keywords set name='Бытие' where id_out='korvintag_1046';
insert into keywords (name, id_out, user_id) select 'Результат' , 'korvintag_1118', (select id from users where id_out='korvintag_109') where not exists (select * from keywords where id_out='korvintag_1118');
update keywords set name='Результат' where id_out='korvintag_1118';
insert into keywords (name, id_out, user_id) select 'Отсутсвие' , 'korvintag_1302', (select id from users where id_out='korvintag_109') where not exists (select * from keywords where id_out='korvintag_1302');
update keywords set name='Отсутсвие' where id_out='korvintag_1302';
insert into keywords (name, id_out, user_id) select 'Усталость' , 'korvintag_1337', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_1337');
update keywords set name='Усталость' where id_out='korvintag_1337';
insert into keywords (name, id_out, user_id) select 'Преодоление' , 'korvintag_1380', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_1380');
update keywords set name='Преодоление' where id_out='korvintag_1380';
insert into keywords (name, id_out, user_id) select 'Потенциал' , 'korvintag_1384', (select id from users where id_out='korvintag_24') where not exists (select * from keywords where id_out='korvintag_1384');
update keywords set name='Потенциал' where id_out='korvintag_1384';
insert into keywords (name, id_out, user_id) select 'Получение' , 'korvintag_1419', (select id from users where id_out='korvintag_109') where not exists (select * from keywords where id_out='korvintag_1419');
update keywords set name='Получение' where id_out='korvintag_1419';
insert into keywords (name, id_out, user_id) select 'Плато' , 'korvintag_1467', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_1467');
update keywords set name='Плато' where id_out='korvintag_1467';
insert into keywords (name, id_out, user_id) select 'Помеха' , 'korvintag_1526', (select id from users where id_out='korvintag_109') where not exists (select * from keywords where id_out='korvintag_1526');
update keywords set name='Помеха' where id_out='korvintag_1526';
insert into keywords (name, id_out, user_id) select 'Творец мира' , 'korvintag_1565', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_1565');
update keywords set name='Творец мира' where id_out='korvintag_1565';
insert into keywords (name, id_out, user_id) select 'Страдание' , 'korvintag_1600', (select id from users where id_out='korvintag_109') where not exists (select * from keywords where id_out='korvintag_1600');
update keywords set name='Страдание' where id_out='korvintag_1600';
insert into keywords (name, id_out, user_id) select 'Уверенность' , 'korvintag_1604', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_1604');
update keywords set name='Уверенность' where id_out='korvintag_1604';
insert into keywords (name, id_out, user_id) select 'Принятие' , 'korvintag_1685', (select id from users where id_out='korvintag_109') where not exists (select * from keywords where id_out='korvintag_1685');
update keywords set name='Принятие' where id_out='korvintag_1685';
insert into keywords (name, id_out, user_id) select 'Формирование' , 'korvintag_1805', (select id from users where id_out='korvintag_24') where not exists (select * from keywords where id_out='korvintag_1805');
update keywords set name='Формирование' where id_out='korvintag_1805';
insert into keywords (name, id_out, user_id) select 'Принцип' , 'korvintag_1872', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_1872');
update keywords set name='Принцип' where id_out='korvintag_1872';
insert into keywords (name, id_out, user_id) select 'Радость' , 'korvintag_1981', (select id from users where id_out='korvintag_85') where not exists (select * from keywords where id_out='korvintag_1981');
update keywords set name='Радость' where id_out='korvintag_1981';
insert into keywords (name, id_out, user_id) select 'Состояние' , 'korvintag_2077', (select id from users where id_out='korvintag_109') where not exists (select * from keywords where id_out='korvintag_2077');
update keywords set name='Состояние' where id_out='korvintag_2077';
insert into keywords (name, id_out, user_id) select 'Чудеса' , 'korvintag_2192', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2192');
update keywords set name='Чудеса' where id_out='korvintag_2192';
insert into keywords (name, id_out, user_id) select 'Повторение' , 'korvintag_2200', (select id from users where id_out='korvintag_24') where not exists (select * from keywords where id_out='korvintag_2200');
update keywords set name='Повторение' where id_out='korvintag_2200';
insert into keywords (name, id_out, user_id) select 'Уважение' , 'korvintag_2235', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2235');
update keywords set name='Уважение' where id_out='korvintag_2235';
insert into keywords (name, id_out, user_id) select 'Серьезность' , 'korvintag_2259', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2259');
update keywords set name='Серьезность' where id_out='korvintag_2259';
insert into keywords (name, id_out, user_id) select 'Пробуждение' , 'korvintag_2261', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2261');
update keywords set name='Пробуждение' where id_out='korvintag_2261';
insert into keywords (name, id_out, user_id) select 'Бестолковость' , 'korvintag_2262', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2262');
update keywords set name='Бестолковость' where id_out='korvintag_2262';
insert into keywords (name, id_out, user_id) select 'Сердитость' , 'korvintag_2264', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2264');
update keywords set name='Сердитость' where id_out='korvintag_2264';
insert into keywords (name, id_out, user_id) select 'Люди' , 'korvintag_2265', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2265');
update keywords set name='Люди' where id_out='korvintag_2265';
insert into keywords (name, id_out, user_id) select 'Мгновение' , 'korvintag_2266', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2266');
update keywords set name='Мгновение' where id_out='korvintag_2266';
insert into keywords (name, id_out, user_id) select 'Человек знания' , 'korvintag_2267', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2267');
update keywords set name='Человек знания' where id_out='korvintag_2267';
insert into keywords (name, id_out, user_id) select 'Ясность' , 'korvintag_2268', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2268');
update keywords set name='Ясность' where id_out='korvintag_2268';
insert into keywords (name, id_out, user_id) select 'Порабощение' , 'korvintag_2269', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2269');
update keywords set name='Порабощение' where id_out='korvintag_2269';
insert into keywords (name, id_out, user_id) select 'Самоконтроль' , 'korvintag_2270', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2270');
update keywords set name='Самоконтроль' where id_out='korvintag_2270';
insert into keywords (name, id_out, user_id) select 'Старость' , 'korvintag_2271', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2271');
update keywords set name='Старость' where id_out='korvintag_2271';
insert into keywords (name, id_out, user_id) select 'Отступление' , 'korvintag_2272', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2272');
update keywords set name='Отступление' where id_out='korvintag_2272';
insert into keywords (name, id_out, user_id) select 'Останов' , 'korvintag_2460', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2460');
update keywords set name='Останов' where id_out='korvintag_2460';
insert into keywords (name, id_out, user_id) select 'Избавление' , 'korvintag_2476', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2476');
update keywords set name='Избавление' where id_out='korvintag_2476';
insert into keywords (name, id_out, user_id) select 'Тяжелость' , 'korvintag_2481', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2481');
update keywords set name='Тяжелость' where id_out='korvintag_2481';
insert into keywords (name, id_out, user_id) select 'Неуклюжесть' , 'korvintag_2482', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2482');
update keywords set name='Неуклюжесть' where id_out='korvintag_2482';
insert into keywords (name, id_out, user_id) select 'Самодовольство' , 'korvintag_2483', (select id from users where id_out='korvintag_6') where not exists (select * from keywords where id_out='korvintag_2483');
update keywords set name='Самодовольство' where id_out='korvintag_2483';
insert into keywords (name, id_out, user_id) select 'Покой' , 'korvintag_3752', (select id from users where id_out='korvintag_109') where not exists (select * from keywords where id_out='korvintag_3752');
update keywords set name='Покой' where id_out='korvintag_3752';
insert into keywords (name, id_out, user_id) select 'Настоящее' , 'korvintag_3754', (select id from users where id_out='korvintag_109') where not exists (select * from keywords where id_out='korvintag_3754');
update keywords set name='Настоящее' where id_out='korvintag_3754';
insert into keywords (name, id_out, user_id) select 'Петля обратной связи' , 'korvintag_4204', (select id from users where id_out='korvintag_24') where not exists (select * from keywords where id_out='korvintag_4204');
update keywords set name='Петля обратной связи' where id_out='korvintag_4204';
insert into sources (name, id_out, user_id) select 'Предисловие к книге Карлоса Кастанеды "Учение Дона Хуана: путь знания индейцев Яки"' , 'korvintag_4', (select id from users where id_out='korvintag_6') where not exists (select * from sources where id_out='korvintag_4');
update sources set name='Предисловие к книге Карлоса Кастанеды "Учение Дона Хуана: путь знания индейцев Яки"' where id_out='korvintag_4';
insert into sources (name, id_out, user_id) select 'Учение Дона Хуана: путь знания индейцев Яки' , 'korvintag_28', (select id from users where id_out='korvintag_6') where not exists (select * from sources where id_out='korvintag_28');
update sources set name='Учение Дона Хуана: путь знания индейцев Яки' where id_out='korvintag_28';
insert into sources (name, id_out, user_id) select 'Отдельная реальность' , 'korvintag_318', (select id from users where id_out='korvintag_6') where not exists (select * from sources where id_out='korvintag_318');
update sources set name='Отдельная реальность' where id_out='korvintag_318';
insert into sources (name, id_out, user_id) select 'Сила настоящего' , 'korvintag_419', (select id from users where id_out='korvintag_109') where not exists (select * from sources where id_out='korvintag_419');
update sources set name='Сила настоящего' where id_out='korvintag_419';
insert into sources (name, id_out, user_id) select 'Ни сы. Восточная мудрость, которая гласит: будь уверен в своих силах и не позволяй сомнениям мешать тебе двигаться вперед' , 'korvintag_448', (select id from users where id_out='korvintag_24') where not exists (select * from sources where id_out='korvintag_448');
update sources set name='Ни сы. Восточная мудрость, которая гласит: будь уверен в своих силах и не позволяй сомнениям мешать тебе двигаться вперед' where id_out='korvintag_448';
insert into sources (name, id_out, user_id) select 'Психология влияния' , 'korvintag_470', (select id from users where id_out='korvintag_24') where not exists (select * from sources where id_out='korvintag_470');
update sources set name='Психология влияния' where id_out='korvintag_470';
insert into sources (name, id_out, user_id) select 'Атомные привычки. Как приобрести хорошие привычки и избавиться от плохих' , 'korvintag_472', (select id from users where id_out='korvintag_24') where not exists (select * from sources where id_out='korvintag_472');
update sources set name='Атомные привычки. Как приобрести хорошие привычки и избавиться от плохих' where id_out='korvintag_472';
insert into sources (name, id_out, user_id) select 'Сэнсэй. Исконный Шамбалы' , 'korvintag_492', (select id from users where id_out='korvintag_85') where not exists (select * from sources where id_out='korvintag_492');
update sources set name='Сэнсэй. Исконный Шамбалы' where id_out='korvintag_492';
update sources set author_id=(select id from authors where id_out='korvintag_21') where id_out='korvintag_4';
update sources set author_id=(select id from authors where id_out='korvintag_6') where id_out='korvintag_28';
update sources set author_id=(select id from authors where id_out='korvintag_6') where id_out='korvintag_318';
update sources set author_id=(select id from authors where id_out='korvintag_109') where id_out='korvintag_419';
update sources set author_id=(select id from authors where id_out='korvintag_113') where id_out='korvintag_448';
update sources set author_id=(select id from authors where id_out='korvintag_120') where id_out='korvintag_470';
update sources set author_id=(select id from authors where id_out='korvintag_121') where id_out='korvintag_472';
update sources set author_id=(select id from authors where id_out='korvintag_125') where id_out='korvintag_492';
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Смерть как средство, позволяющее выйти за пределы условностей' , 'korvintag_260' , 'Пожалуй, только люди, возвращенные к жизни после клинической смерти, способны поделиться таким опытом в чистом виде. Они, как свидетельствуют современные исследования, видели себя со стороны и в то же время осознавали, что все это происходит именно с ними.' , 'Видимо, переживание смерти заставляет человека отбросить все принятые ранее условности воприятия, и иногда он может воспринимать перед смертью в более широком диапазоне возможностей.
Вопрос - а почему бы при жизни не научиться воспринимать в широком диапазоне?', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2022 17:24:24', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_260');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Сознание не только отражает реальность, но и творит' , 'korvintag_261' , 'Означает ли это, что Кастанеда интересуется не столько воздействием наркотиков на психику, сколько природой сознания как такового? Оно достойно внимания, потому что разорвано, противоречиво... При этом, судя по всему, обладает одним удивительным свойством. Сознание не только отражает реальность, оно, оказывается, способно творить ее по собственному произволу. “Главный принцип его книг, — пишет о Кастанеде Пол Рисман, — в том, что опыт — не то, что просто происходит, а то, что мы создаем преимущественно сами — хотя очень редко осознаем свою созидательную роль”' , 'Мы привыкли, что сознание отражает реальность. Процесс того, как оно еще и творит эту реальность, ускользает от нашего рационального анализа. Тогда как именно в этом, креативном аспекте сознания, и кроется множество открытий, необходимых для эволюции человека.
Т.е. нужна анализировать регулярно моменты творения нашим сознанием нашей реальности. К сожалению, это происходит бесконтрольно для нашего рационального сознаний.', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2022 18:31:06', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_261');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Миражи нашей земной участи' , 'korvintag_262' , '...творите, творите без стеснения!

Но какой смысл в этих призрачных картинах? Только ли в раскрытии всепроникающей силы сознания? В книгах Кастанеды ответ в известной мере простодушен: миражи позволяют уйти от самого себя... Каждый человек пожизненно приговорен к конкретной земной участи. Это немножко безрадостно. Так хочется преодолеть свое “Я”. По крайней, мере разломать его жесткое ядро, расширить рамки сугубо индивидуального. Что и говорить, такое стремление оправданно: это глубинная, труднонасыщаемая человеческая потребность.' , 'Люди живут в миражах. И эти миражи позволяют уйти от самого себя. Но если наш приговор земной участи есть такой же мираж, наше творение, то может быть имеет смысл его постичь? И перетворить?

И где границы этих миражей, точнее говоря границы перетворения своей жизни через изменение миражей?', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2022 18:41:05', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_262');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Противоречие жизнедеятельности человека' , 'korvintag_263' , 'С одной стороны, человек изо всех сил старается закрепиться в собственной психологической нише, обжить ее. А с другой — сам же ее взрывает. И наше столетие наглядно демонстрирует эту потребность. Молодые радикалы 60-х годов во многих западных странах представляли индивидуальную жизнь как смену карнавальных масок. Хватит быть клерком, поеду в индейскую резервацию. И наркотики пришлись ко времени... Другой пример этого же феномена — желание с помощью хирурга сменить пол. Рождается мода. Человек изо всех сил старается выскочить из самого себя.' , 'С одной стороны человек очень много тратит сил на обживание в своей психологической нише. С другой стороны не меньше сил тратит на то, чтобы взорвать ее. Какой то странный процесс, в котором смешиваются абсолютно противоречивые желания. Сталкинг и сновидение? Фиксация своего состояния и резкое его изменение?', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2022 19:31:47', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_263');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Тело как инструмент познания' , 'korvintag_264' , '...душа человека — целая вселенная. Но почему только душа? Тело, согласно Кастанеде, тоже обладает способностью познавать. Это зависит от того, как оно дышит, как человек стоит или бежит, как направляет глаза на объект. Для многих из нас, как оказывается, тела несут в себе нечто интеллектуальное. У них свой язык, другие знаки. Телесность помогает преодолеть диктат сознания. Знание вообще призвано устранить “разномыслие” рассудка и тела. Тут, разумеется, выстраивается своеобразная антропология. Стало быть, правы те исследователи, которые полагают, что Кастанеда всю свою жизнь, том за томом, наращивал некое антропологическое знание?' , 'Не только разум, но и тело человека может наращивать знание. Как дышит, двигается, смотрит.
Следовательно, физические тренировки не столь уж и бессмысленны в плане саморазвития. И не только в смысле "в здоровом теле здоровый дух".
Кроме того, проблема человека в противоречии между его телом и рассудком. Наверное целостность - это и есть состояние преодоления этого противоречия.', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2022 20:46:57', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_264');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Роль сомнения в разрушении догматов' , 'korvintag_265' , '...реальность — не что иное, как порождение определенного способа описания мира. Его навязывают нам с младых ногтей. Мы как бы сообща включаемся в сотворение действительности, и она становится для нас одинаковой. Создающие мир восприятия образуют сплошной, непроницаемый поток. Истинность возникшего мира никогда не подвергается сомнению. Но стоит изменить практическую установку (забегая вперед, скажем: у Кастанеды это называется “точкой сборки”) — и откроется неизведанное... “Большая часть критиков Кастанеды признали, — пишет Ричард Де-Миль, — кто нехотя, а кто и с восторгом, что его усилиями наш мир стал чуть интереснее, не сделавшись от этого хуже, чем он есть на самом деле. Те же, кто оказался в дураках, должны винить в этом только себя самих. И если так посмотреть, сам Кастанеда — Койот, настоящий индейский шаман. Он трикстер, тот, кто, злоупотребляя доверчивостью людей, внушает им ценнейшие уроки”' , 'Окружающий нас мир стоит подвергать сомнению. Возможно, выработать новую привычку сомневаться.
Тогда может открыться неизведанное.', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2022 20:53:54', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_265');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Доступ к нагвалю только через свое тело' , 'korvintag_270' , 'Каждый индивид состоит, по дону Хуану, из двух сущностей — тоналя и нагваля. Тональ — это все, что мы есть, то, что мы знаем. Это не только мы, люди, но и весь наш мир. В известном смысле тональ — это все видимое, окружающее нас. Эта сущность человека приводит хаос мира в состояние упорядоченности, помогает обозначить и описать его. Тональ начинается с рождения и заканчивается смертью. Она творит мир в соответствии со своими законами. Тональ составляет правила, посредством которых она способна понимать окружающее.

Но тональю не исчерпывается человек. В нем есть и другая сущность — нагваль. Так Кастанеда называет часть нас самих, с которой мы вообще не вступаем в контакт. Это нечто, не имеющее определения (ни слов, ни имен, ни ощущений, ни значения), но тем не менее неотторжимый компонент нас самих. Можно оказаться свидетелем нагваля, но определить ее невозможно. Ее способно наблюдать только тело, отнюдь не разум. Нагваль обнаруживается в непостижимых проявлениях.' , 'Проявления Нагваля можно заметить только через тело. Через разум, тональ, нагваля не видно. Его как бы нет. Потому для доступа к Нагвалю нужно лучше изучить свое тело, и обращать внимание на его ощущения.', (select id from users where id_out='korvintag_6'), to_timestamp( '12.08.2022 10:35:11', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_270');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Поиск места силы' , 'korvintag_274' , '...мне надо найти на полу пятно, где я мог бы сидеть без усталости.

...и наставительно проговорил, что пятно — это место, где человек естественным образом чувствует себя счастливым и сильным.

Он предложил мне ходить по веранде, пока пятно не найдется.


...и объяснил, что не на всяком месте хорошо сидеть или вообще находиться и что в пределах веранды обязательно есть одно уникальное место, самое лучшее для меня «пятно». Мне нужно разыскать его среди всех остальных мест. По общей схеме, я должен «прочувствовать» все возможные места, пока без всяких сомнений смогу определить, какое из них правильное.

Должно быть, я проходил около часа или более того, но не случилось ничего, что подсказало бы мне местонахождение пятна. Я устал шагать и сел. Через несколько минут пересаживался на другое место, а затем еще на одно, пока таким полусистематическим образом не покрыл весь пол. Я старательно пытался «чувствовать» разницу между местами, но у меня не было критерия для их различения.

И я лег на спину, подложил руку под голову, вместо подушки, а затем перекатился на живот и полежал некоторое время. Так перекатывался по всему полу. Впервые мне показалось, что нашелся хоть какой-то критерий. Я чувствовал себя теплее, лежа на спине.

...и сообщил, что его это не удивляет, потому что действовал я неправильно — не пользовался глазами. Это было так, но ведь я был вполне уверен, что мне нужно — по его словам — «ощутить» разницу. Я упомянул об этом, но он возразил, что ощущать можно и глазами — когда не вглядываешься в предметы прямо. Что касается меня, сказал он, то нет другого средства решить эту задачу, как только пользуясь единственным, что у меня есть, — моими глазами.

Я снова начал кататься, так как эта процедура была самой удобной. Но на этот раз я клал подбородок на руки и всматривался в каждую деталь.
Через некоторое время темнота вокруг меня изменилась. Когда я фокусировал взгляд в точке прямо перед глазами, вся периферийная зона моего поля зрения однообразно окрашивалась сверкающим зеленовато-желтым цветом. Эффект был поразителен. Удерживая глаза скошенными в точку прямо перед собой, я начал отползать на животе в сторону, передвигаясь на фут примерно за один раз.

Внезапно я осознал перемену оттенка в точке, находящейся примерно на середине пола. Справа от меня, по-прежнему на периферии поля зрения, зеленовато-желтый оттенок стал ярко-пурпурным. Я переключил внимание туда. Пурпур поблек, но был все еще блестящим и оставался таким постоянно, пока я удерживал на нем свое внимание.

На этот раз я быстро передвигался с места на место, минуя точку дона Хуана, до края пола, затем развернулся, чтобы захватить и внешний его край. Попав в центр, я понял, что произошло еще одно изменение в окраске, опять на периферии поля моего зрения. Однообразный зеленовато-желтый цвет, который я видел повсюду, превратился в одном месте, справа от меня, в яркий серо-зеленый. Какое-то мгновение этот оттенок держался, а затем внезапно переменился на другой постоянный оттенок, отличный от того, что я видел раньше. Сняв один ботинок, я отметил эту точку и продолжал кататься, пока не покрыл пол во всех возможных направлениях. Больше никаких изменений окраски не было.

Вернувшись к точке, отмеченной ботинком, я осмотрел ее. Она находилась в пяти-шести футах на юго-восток от той, где лежал пиджак. Рядом был большой камень. Совсем ненадолго я прилег рядом, пытаясь найти отгадку, приглядываясь к каждой детали, но не чувствовал никакой разницы.

Я решил опробовать другую точку. Быстро опустившись на колени, я уже собирался лечь на свой пиджак, но внезапно испытал нечто необычное. Больше всего это было похоже на физическое ощущение чего-то, давящего мне в живот. Я отскочил одним махом. Почувствовал, как поднялись волосы на шее. Ноги подогнулись, туловище наклонилось вперед, руки напряженно поднялись, а пальцы согнулись как клешни. Я заметил странность своей позы и еще больше испугался.' , 'Алгоритм поиска места силы:
- цель - искать пятно, где можно сидеть без усталости, ощущая себя счастливым и сильным
- попробывать разные позы сидения - лежания для активации чувств
- ощущать разницу глазами, не вглядываясь в предметы прямо
- замирать и вглядываться в каждую деталь
- фокусировать взгляд в точке прямо перед глазами, обращать внимание на переферию
- смена позиции на фут (0,3 м) за каждую итерацию
- в фоне идет зеленовато-желтый свет
- во враждебном пятне оттенок становится ярко-пурупурным
- на своем месте свет серо-зеленый разных оттенков
- во враждебном пятне тело особым образом реагирует
  - давит на живот что-то
  - волосы дыбом на шее 
  - ноги подгинаются
  - пальцы сгинаются', (select id from users where id_out='korvintag_6'), to_timestamp( '12.08.2022 16:55:07', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_274');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Серьезность и усталость' , 'korvintag_2252' , 'Ты единственный, которого я видел играющим с Мескалито. Ты не привык к такой жизни. Поэтому указания (omens) прошли мимо тебя. Да, ты серьезный человек, но твоя серьезность привязана к тому, что ты делаешь, а не к тому, что происходит вне тебя. Ты слишком застреваешь на самом себе. В этом беда. И это порождает ужасную усталость.

Ищи чудес повсюду вокруг себя и смотри на них. Ты устаешь от глядения на одного себя, и эта усталость делает тебя глухим и слепым ко всему остальному.
— Ты попал в точку, дон Хуан. Но как мне измениться?' , 'Серьезность не должна быть привязана только к тому, что мы делаем. Серьезно нужно относиться и к тому, что происходит вне нас. Односторонняя серьезность порождает сильную усталость. Именно усталость не дает нам замечать чудеса.', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2023 11:14:21', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2252');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Как нужно идти к знанию?' , 'korvintag_2254' , 'Человек идет к знанию так же, как идет на войну: полностью проснувшись, со страхом, с уважением и с абсолютной уверенностью. Идти к знанию или идти на войну как-либо иначе — ошибка; тот, кто совершает ее, будет всю жизнь сожалеть о сделанных шагах.' , 'Идти к знанию нужно:
- полностью проснувшись
- со страхом
- с уважением
- с абсолютной уверенностью

Иначе будут проблемы', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2023 12:22:25', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2254');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Преодоление бестолковости' , 'korvintag_2255' , 'Я спросил, почему это так, и он ответил, что при соблюдении человеком этих четырех требований любую ошибку можно принять в расчет, в таких условиях его действия теряют бестолковый характер действий дурака. Если такой человек терпит неудачу или поражение, то проигрывает только битву — и тогда ему не о чем сожалеть.' , 'Только соблюдая 4 принципа похода за знаниями можно преодолеть бестолковость дурака.', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2023 12:24:33', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2255');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Сердиться - признавать важность других людей' , 'korvintag_2257' , '— Ты не сердишься на меня, дон Хуан? — спросил я, когда он вернулся. Его, по-видимому, удивил мой вопрос.
— Нет, я никогда ни на кого не сержусь. Никому из людей не удастся сделать что-то, достаточно для этого важное. На людей сердишься, когда веришь, что их поступки важны. Ничему подобному я больше не верю.' , 'Если ты сердишься на людей, то это значит, что ты веришь, что их поступки важны. А может стоить посомневаться в важности их поступков? Тогда и сердитость исчезнет?', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2023 14:50:33', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2257');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Страх - первый природный враг' , 'korvintag_2259' , '— Когда человек начинает учиться, он никогда не знает ясно своих целей. Его замысел ошибочен, а намерение смутно. Он надеется на вознаграждения, которых никогда не получит, потому что еще ничего не знает о тяготах учения.
Он медленно начинает учиться — сначала понемногу, шаг за шагом, а потом большими скачками. И скоро у него ум зайдет за разум. То, что он узнает, всегда оказывается не тем, что он себе рисовал или воображал, и поэтому он начинает пугаться. Учение никогда не даст того, чего от него ожидают. Каждый шаг — это новая задача, и страх, испытываемый человеком, накапливается безжалостно и неуклонно. Замысел оказывается полем битвы.
И таким образом он натыкается на первого из своих природных врагов. Страх! Ужасный враг — вероломный и трудноодолимый. Он таится на каждом повороте пути, маскируется, выжидает. И если человек, испугавшись непосредственной близости страха, побежит прочь, враг положит конец его поискам.

— И что же делать, чтобы одолеть страх?
— Ответ очень прост. Он не должен убегать. Он должен победить свой страх и вопреки ему сделать следующий шаг в учении, еще шаг и еще. Будучи всецело во власти страха, он все же не должен останавливаться. Таково правило! И придет миг, когда его первый враг отступит. Человек начнет чувствовать уверенность в себе. Его намерение крепнет. Учение — уже не пугающая задача. В этот радостный миг человек может сказать без колебаний, что он победил своего первого природного врага.

— Это произойдет сразу, дон Хуан, или мало-помалу?
— Это произойдет мало-помалу, но страх исчезнет внезапно и быстро.' , 'Страх - первый враг на пути к знанию. При столкновении с ним нужно идти дальше, невзирая на страх. И он уйдет. И появится уверенность.', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2023 16:32:42', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2259');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Ясность как ошибка' , 'korvintag_2260' , '— Нет, однажды уничтожив страх, он свободен от него до конца своей жизни, потому что вместо страха он приобрел ясность — ясность ума, которая рассеивает страх. К этому времени человек знает свои желания, знает, как удовлетворить эти желания. Он умеет предвидеть новые шаги в учении, и острая ясность сознавания сопутствует всему, что он делает. Человек понимает, что нет ничего скрытого.
И вот так он встречает своего второго врага: ясность! Эта ясность сознания, которую так трудно достичь, рассеивает страх, но вместе с тем ослепляет.
Она заставляет человека никогда не сомневаться в себе. Она дает ему уверенность, что можно делать все, что ему нравится, — потому что он все видит ясно, насквозь. И он храбр — ибо ясно видит, и он ни перед чем не остановится — ибо ясно видит. Но все это — ошибка; в этом есть что-то незавершенное. Если человек поддается этому мнимому могуществу, значит, он побежден своим вторым врагом и будет топтаться на месте, когда надо быть стремительным. И он будет мямлей в учении, пока не выдохнется, неспособный научиться чему бы то ни было.
— Что случится с человеком, который побежден таким образом, дон Хуан? Он что, в результате умрет?
— Нет, не умрет. Второй враг просто остановил его на месте и охладил его попытки стать человеком знания. Вместо этого он обратится в бодрого воина или в клоуна. Но ясность ума, за которую он так дорого заплатил, никогда уже не сменится тьмой и страхом. Он будет ясен до конца своих дней, но никогда не будет учиться чему-нибудь или томиться по чему-то.
— Но что же он должен делать, чтобы избежать поражения?
— Он должен делать то же самое, что делал со страхом. Он должен победить свою ясность мысли и использовать ее лишь для того, чтобы видеть, терпеливо ждать, тщательно все измерять и взвешивать, прежде чем сделать новый шаг. И главное, он должен думать, что ясность его ума — это почти ошибка. И придет мгновение, когда он поймет, что его ясность была лишь точкой перед глазами. Так он одолеет своего второго природного врага и займет позицию, где ничто уже не сможет ему повредить. Это не будет ошибкой. Это не будет точкой перед глазами. Это будет истинной силой.' , 'После победы над страхом приходит ясность. Которая есть ошибка. Поскольку она не есть знание. А всего лишь первые заключения ума.

Эту ошибку нужно преодолеть. Ни в коей мере не следует ей сдаваться.', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2023 16:38:10', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2260');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Сила как враг' , 'korvintag_2261' , 'Вот тут он узнает, что сила, за которой он так долго гонялся, наконец принадлежит ему. Он сможет делать с ней все, что захочет. Союзник в его подчинении. Его желание — закон. Он видит все, что есть вокруг. Но он наткнулся вместе с тем на своего третьего врага: Силу!
Сила — самый могущественный из всех врагов. И естественно, самое легкое, что можно сделать, — это уступить ей. В конце концов, человек действительно неуязвим. Он командует, он начинает с того, что идет на рассчитанный риск, а кончает тем, что устанавливает законы, потому что он — мастер.
Человек на этой стадии вряд ли замечает третьего врага, что надвигается на него. И внезапно, сам того не замечая, он проигрывает битву. Враг превратит его в жестокого и капризного воина.

— Человек, побежденный силой, так и умрет, не узнав на самом деле, как с этой силой обращаться. Сила — лишь бремя в его судьбе. Такой человек не имеет власти над самим собой и не умеет сказать, когда и как использовать силу.' , 'Сила тоже становится врагом. Порабощая человека. Нужно как-то ею управлять. Иначе сила будет лишь бременем.', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2023 19:15:14', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2261');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Когда человек побежден?' , 'korvintag_2262' , '— Конечно, оно окончательно. Раз уж какой-нибудь из этих врагов пересилил человека, то тому уже ничем нельзя помочь.
— Возможно ли, например, чтобы человек; побежденный силой, увидел свою ошибку и исправил свой путь?
— Нет, раз человек сдался, с ним покончено.
— Ну а что, если он лишь на время ослеплен силой и потом откажется от нее?
— Это значит, что его битва все еще не проиграна и продолжается. Это значит, что он все еще пытается стать человеком знания. 
Человек побежден лишь тогда, когда больше не пытается и отказывается от самого себя.' , 'Человек проигрывает тогда, когда:
- больше не пытается ничего делать
- отказывается от самого себя', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2023 19:17:01', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2262');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Силу можно преодолеть пониманием' , 'korvintag_2263' , '— Как можно победить своего третьего врага, дон Хуан?
— Его нужно победить пониманием. Человек должен прийти к пониманию того, что сила, которую он, казалось бы, покорил, в действительности никогда ему не принадлежала. Он все время должен придерживаться своей линии, обращаясь осторожно и добросовестно со всем, что узнал. Если он сумеет увидеть, что ясность и сила без контроля над самим собой еще хуже, чем ошибки, достигнет такой точки, где все схвачено. Тут он будет знать, когда и как использовать свою силу. И таким образом победит своего третьего врага.' , 'Своеволие силы можно победить лишь пониманием. Того, что сила ему не принадлежит. Нужен самоконтроль!', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2023 20:18:21', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2263');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Старость как враг' , 'korvintag_2264' , 'К тому времени человек будет завершать свой путь учения и почти без предупреждения столкнется со своим последним врагом. Старость! Этот враг — самый жестокий из всех. Враг, которого никогда не победить полностью, можно лишь заставить его отступить.

К этому времени у человека нет больше страхов, нет больше терпеливой ясности ума. Тогда вся его сила при нем, но тогда же возникает неотступное желание отдохнуть. Если он целиком поддается своему желанию лечь и забыться, если потакает себе в своей усталости — он проиграет свою последнюю битву, и враг обратит его в старое слабое существо. Желание уступить пересилит всю его ясность, всю его силу и все его знание.' , 'Старость невозможно победить, можно лишь заставить отступить.
Нельзя сдаваться своей усталости!', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2023 20:21:09', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2264');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Цель человека знания' , 'korvintag_2265' , 'Но если человек преодолеет свою усталость и проживет свою судьбу полностью — тогда его можно назвать человеком знания. Если хотя бы на одно краткое мгновение он отобьется от своего последнего, непобедимого врага! Этого мгновения ясности, силы и знания достаточно.' , 'Цель - мгновения ясности, силы и знания. Эти мгонвения стоят того, чтобы жить!', (select id from users where id_out='korvintag_6'), to_timestamp( '11.08.2023 20:23:26', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2265');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Слабое и ошибающее создание' , 'korvintag_2496' , 'Одно только его общество заставило меня произвести глубокую переоценку моих моделей поведения. Я был приучен — как, пожалуй, любой другой — видеть в человеке слабое по сути своей и ошибающееся создание. Меня поражало, что дон Хуан не оставлял ни малейшего впечатления слабости и бессилия, и, просто находясь с ним рядом, я видел, что сравнение его поведения с моим будет не в мою пользу.' , 'Кастанеда как антрополог паривык, что человек - слабое и все время ошибающееся создание. Он удивился, когда увидел, что Дона Хуан принципиально иной. Получается, слабость и постоянные ошибки - не обязательный удел человека?', (select id from users where id_out='korvintag_6'), to_timestamp( '31.08.2023 9:01:00', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2496');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Странная усталость' , 'korvintag_2498' , '— Ты слишком много думаешь о себе, — сказал он и улыбнулся. — А это приводит к странной усталости, которая заставляет тебя отгораживаться от окружающего мира и цепляться за собственные рассуждения. Поэтому проблемы — это единственное, что у тебя есть. Я тоже всего лишь человек, но я вкладываю в это совсем другой смысл.
— Что ты имеешь в виду?
— Я избавился от своих проблем. Очень плохо, что моя жизнь слишком коротка и я не могу взяться за все то, за что мне хотелось бы. Но это не проблема. Это просто сожаление.
Мне понравился тон его высказывания. В нем не было отчаяния или жалости к самому себе.' , 'У людей есть странная усталость, возникающая из-за постоянной концентрации на проблемах. 
Можно избавиться от всех проблем. Для этого нужно перестать отгораживаться от окружающего мира и цепляться за собственные размышления.', (select id from users where id_out='korvintag_6'), to_timestamp( '31.08.2023 9:07:16', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2498');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'ЧСВ' , 'korvintag_2501' , '— Ты испугался и удрал из-за того, что чувствуешь себя чертовски важным, — сказал он, объясняя мой предыдущий уход. — Чувство важности делает человека тяжелым, неуклюжим и самодовольным. А чтобы стать человеком знания, надо быть легким и текучим.' , 'Важность делает человека 
- тяжелым, 
- неуклюжим 
- и самодовольным. 

А в идеале нужно быть легким и текучим.', (select id from users where id_out='korvintag_6'), to_timestamp( '31.08.2023 10:07:43', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2501');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Остановить человека своей волей' , 'korvintag_2505' , 'Судя по всему, Сакатека узнал меня.
— О, это вы, — сказал он улыбаясь. — Как Хуан?
— У него все в порядке. А как ваши дела, дон Элиас?
Он не отвечал. Казалось, он нервничает. Внешне он был очень спокоен, но я чувствовал, что он не в своей тарелке.
— Хуан прислал тебя с каким-то поручением?
— Нет, я сам приехал.
— Но чего же ради? — Его вопрос выдал самое искреннее удивление.
— Просто хотелось побеседовать с вами, — сказал я, стараясь говорить как можно естественнее. — Дон Хуан рассказывал мне о вас чудесные вещи, я заинтересовался и захотел вас немного расспросить.
Сакатека стоял прямо передо мной. Тело его было тощим и жилистым. Он был одет в рубашку и штаны цвета хаки. Его глаза были прищурены, и он казался сонным или, может быть, пьяным. Его рот был слегка приоткрыт, и нижняя губа отвисла. Я заметил, что он глубоко дышит и вроде бы даже похрапывает. Мне пришла в голову мысль, что Сакатека пьян до одури. Но она была нелепой, потому что всего несколько минут назад, выходя из дома, он был настороже и внимательно смотрел на меня.
— О чем ты хочешь говорить? — сказал он наконец.
У него был очень усталый голос — он словно выдавливал из себя каждое слово. Мне стало очень неловко. Его усталость как будто передалась мне.
— Ни о чем особенном, — ответил я. — Просто приехал поболтать с вами по-дружески. Вы ведь как-то приглашали меня к себе домой.
— Да, приглашал, но сейчас все иначе.
— Почему все иначе?
— Разве ты не говоришь с Хуаном?
— Говорю.
— Так что же ты хочешь от меня?
— Я думал, что смогу задать вам несколько вопросов.
— Спроси Хуана. Разве он не учит тебя?
— Он учит, но все равно мне хотелось бы спросить вас о том, чему он учит, и узнать ваше мнение. Тогда бы я понял, что делать.
— Зачем тебе это? Ты не веришь Хуану?
— Верю.
— Тогда почему ты не попросишь его рассказать о том, что ты хочешь знать?
— Я так и делаю. И он мне рассказывает. Но если бы вы тоже рассказали мне о том, чему он меня учит, я, возможно, лучше бы это понял.
— Хуан может рассказать тебе все. Он может сделать это один. Неужели тебе это не ясно?
— Понимаю. Но я также хочу говорить с людьми вроде вас, дон Элиас. Не каждый день встречаешься с человеком знания.
— Хуан — человек знания.
— Я знаю.
— Тогда почему ты говоришь со мной?
— Я же сказал, что приехал как друг.
— Нет, это не так. На этот раз в тебе есть что-то еще.
Я хотел объясниться, но, кроме несвязного бормотания, ничего не вышло. Сакатека молчал. Казалось, он внимательно слушает. Его глаза опять наполовину закрылись, но я чувствовал, что он всматривается в меня. Он едва уловимо кивнул. Затем его веки раскрылись, и я увидел его глаза. Он смотрел как бы мимо меня и небрежно притоптывал носком правой ноги как раз позади левой пятки. Его ноги были слегка согнуты; руки расслабленно висели вдоль тела. Затем он поднял правую руку — ее открытая ладонь была повернута перпендикулярно земле, а пальцы вытянуты и направлены на меня. Он позволил своей руке пару раз качнуться, а потом поднял ее на высоту моего лица. В таком положении он задержал ее на секунду, а потом сказал мне несколько слов. Его голос был очень ясным, и все же речь нельзя было разобрать.
Через секунду он уронил руку вдоль тела и замер в странной позе — он стоял на носке левой ноги, а его правая нога заходила за пятку левой, мягко и ритмично постукивая носком по полу.
Я ощутил что-то неприятное, своего рода беспокойство. Мои мысли стали бессвязными. Я думал о вещах, не связанных с происходящим. Заметив это, я попытался вернуть свои мысли к действительности, но не мог этого сделать, несмотря на огромные усилия. Словно какая-то сила мешала мне сосредоточиться, мешала думать связно.
Сакатека не сказал ни слова, и я не знал, что еще сказать или сделать. Совершенно автоматически я повернулся и ушел.
Позднее я счел себя обязанным рассказать дону Хуану о своей встрече с Сакатекой. Дон Хуан расхохотался.
— Что же в действительности произошло? — спросил я.
— Сакатека танцевал! Он увидел тебя, а затем танцевал.
— Что он сделал со мной? Я чувствовал холод, и у меня все плыло перед глазами.
— Очевидно, ты ему не понравился, и он остановил тебя, бросив на тебя слово.
— Каким образом он мог это сделать? — недоверчиво воскликнул я.
— Очень просто — остановил тебя своей волей.
— Как ты сказал?
— Он остановил тебя своей волей.' , 'Человек знания может остановить волей другого человека. Вмешавшись в ход его мыслей и во внутренний диалог. Мы опрометчиво думаем, что наш внутренний мир закрыт для всех кроме нас. Это не так. Вообще то наш внутренний мир очень слабо зависит от нас.', (select id from users where id_out='korvintag_6'), to_timestamp( '31.08.2023 10:40:32', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_2505');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Что нам нужно от жизни?' , 'korvintag_3850' , 'Следующие пять месяцев я прожил в состоянии непрерывного глубокого покоя и блаженства. Затем эти ощущения немного потеряли яркость; а может быть, мне так только казалось, потому что я к ним привык. Я по-прежнему мог функционировать в обществе, хотя и сознавал: всё, что я делаю, не способно ничего прибавить к тому, что у меня уже есть.' , 'То, что нам реально нужно, не в состоянии дать никакая деятельность в обществе. То, что есть у нас, но скрыто из-за настроек нашего разума, есть высшая ценность.', (select id from users where id_out='korvintag_109'), to_timestamp( '27.12.2023 18:28:02', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_3850');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Сильнейшая радость' , 'korvintag_3852' , 'Я провёл почти 2 года, сидя в парках на скамейках в состоянии сильнейшей радости.
Но даже самый прекрасный опыт начинается и заканчивается. Пожалуй, крепче любого пережитого мной опыта оказалось постоянное ощущение покоя, которое меня больше не покидало. Иногда оно настолько ощутимо, почти осязаемо, что его чувствуют и другие люди.

Позднее люди стали подходить ко мне и говорить: «Я тоже хочу то, что есть у тебя. Ты можешь мне это как-то дать или показать, как это получить?» Я отвечал им: «У вас это уже есть. Вы просто этого не чувствуете, потому что ваш разум слишком громко шумит». Со временем из этого ответа выросла книга, которую вы читаете.' , 'Есть внутреннее состояние, в котором мы можем находиться. Радости и покоя. И попадание в это состояние может быть целью.

Попасть в это состояние нам мешает разум, поскольку он очень громкий.', (select id from users where id_out='korvintag_109'), to_timestamp( '27.12.2023 18:38:34', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_3852');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Страданию необходимо время' , 'korvintag_4038' , 'Вся суть учения дзен состоит в том, чтобы постоянно балансировать на острие Настоящего, присутствовать в Настоящем так глубоко, так полно, чтобы изжить все свои проблемы и страдания, всё, что не является вашей сутью. В Настоящем, где нет времени, все наши проблемы исчезают. Страданию необходимо время, оно не способно выжить в Настоящем.' , 'Чтобы страдать, нам нужно понятие времени. В настоящем нет страдания.
Только задействуя концепты времени - прошлого и будущего. приходит страдание.', (select id from users where id_out='korvintag_109'), to_timestamp( '06.01.2024 19:38:52', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_4038');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Обязательно примите всё, что есть' , 'korvintag_4083' , 'Старайтесь уделять больше внимания самому деланию, а не результату, которого вы хотите добиться. Полностью погрузитесь во всё, что дарит вам настоящий момент. При этом обязательно примите всё, что есть, потому что вы не можете полностью погрузиться в то, чему сопротивляйтесь.' , 'Нужно фокусироваться на действии, а не на ожидании результата. При этом нужно принимать настоящее, а не сопротивляться ему. Чтобы полностью погрузиться в настоящее.', (select id from users where id_out='korvintag_109'), to_timestamp( '09.01.2024 10:36:29', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_4083');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Важнее не состояние, а тренд изменений' , 'korvintag_4456' , 'Исходя их этого, не очень важно, насколько вы успешны или неуспешны в данный момент. Самое важное – это то, насколько привычки способны привести вас на путь успеха. Вы должны в гораздо большей степени беспокоиться о траектории развития, а не о достигнутых на данный момент результатах. Если вы миллионер, но при этом ваши ежемесячные траты превышают доходы, то вы находитесь на неправильной траектории развития. Если ваши привычки тратить деньги не изменятся, вы придете к плохому результату. И наоборот, если вы изменитесь и начнете каждый месяц экономить даже небольшую сумму, то встанете на путь, который приведет к финансовой свободе, даже если вы будете двигаться медленнее, чем хотелось бы.' , 'Важнее не состояние, которое мы занимаем в жизни здесь и сейчас, а тренд наших изменений. Важнее то, где мы окажемся завтра, через месяц, через год. Нужно выбирать привычки, которые приведут нас на перспективную траекторию нашей жизни. И не стоит слишком много внимания уделять неприятным текущим и ближайшим состояниям на этом пути.', (select id from users where id_out='korvintag_24'), to_timestamp( '21.02.2024 18:54:53', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_4456');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Мы получаем то, что регулярно повторяем' , 'korvintag_4457' , 'Достижения представляют собой отложенную проекцию привычек. Ваше финансовое состояние – результат привычек в отношении денег. Ваш вес – результат пищевых привычек. Ваши знания – результат привычек в отношении обучения. Беспорядок и хаос в доме – результат привычек в отношении уборки. Вы получаете то, что регулярно повторяете.' , 'Мы получаем в результате нашей жизни то, что регулярно повторяем. Хотим от нашей чего другого? Так и повторять нужно что-то другое, чем то, что мы повторяем сейчас.', (select id from users where id_out='korvintag_24'), to_timestamp( '21.02.2024 18:57:51', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_4457');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Плато скрытого потенциала' , 'korvintag_4459' , 'Люди совершают некоторое количество небольших изменений, но не видят осязаемого результата и решают прекратить эксперимент. Но для того чтобы привести к существенным изменениям, привычки должны существовать в течение достаточно длительного времени – тогда вы сможете преодолеть это плато, которое я назвал Плато скрытого потенциала.

Часто это связано с тем, что вы еще не пересекли Плато скрытого потенциала. Жалобы на то, что вы не добились успеха, несмотря на напряженную работу, подобны переживаниям по поводу того, что кубик льда не тает при температуре от двадцати пяти до тридцати одного градуса. Ваша напряженная работа не напрасна; она постепенно накапливается. Все изменения станут заметны после достижения температуры тридцать два градуса.

Когда вы, наконец, преодолеете Плато скрытого потенциала, окружающие будут говорить о вашем мгновенном успехе.' , 'Плато скрытого потенциала - это когда Вы работаете долго, привычки уже поменяли, а результата нет. Не стоит из-за него прекращать попытки. Просто его нужно пересечь, как обычное плато где-то в горах. Чтобы достигнуть цели и получить желаемый результат.', (select id from users where id_out='korvintag_24'), to_timestamp( '21.02.2024 19:01:00', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_4459');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Петля обратной связи' , 'korvintag_4740' , 'После того как вы получите неожиданное вознаграждение, вы измените свою стратегию на будущее. Мозг незамедлительно начнет фиксировать те события, которые предшествовали вознаграждению. Погоди-ка – это было приятно. Что я делал непосредственно перед этим моментом?
Это и есть та самая петля обратной связи, которая стоит за всеми поступками человека: пробовать, ошибаться, учиться, пробовать иным образом. С практикой бесполезные действия прекращаются, а полезные действия закрепляются. Это и есть формирование привычки.' , 'Привычки формируются под воздействием т.н. петли обратной связи. Когда мы что-то сделали удачное, наш мозг получает гормоны. А гормоны заставляют мозг запомнить хорошее и сформировать новую привычку.', (select id from users where id_out='korvintag_24'), to_timestamp( '12.03.2024 21:42:59', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_4740');
insert into ideas (name, id_out, original_text, content, user_id, date_time_create) select 'Зачем мозг формирует привычки?' , 'korvintag_4782' , 'Привычка – это поведение, которое повторилось достаточное количество раз для того, чтобы стать автоматическим. Процесс ее формирования начинается со стадии проб и ошибок. Каждый раз, когда вы сталкиваетесь с новой жизненной ситуацией, мозгу приходится принимать решение. Как реагировать на эту ситуацию? Когда вы впервые сталкиваетесь с проблемой, то не уверены в том, каким образом ее следует решать. Подобно кошке Торндайка, вы сначала испытываете все предметы, чтобы проверить, что сработает.' , 'Привычки нужны нашему мозгу, чтобы экономить время и ресурсы при решении регулярно возникаемых похожих проблем.', (select id from users where id_out='korvintag_24'), to_timestamp( '16.03.2024 10:16:18', 'DD.MM.YYYY HH24:MI:SS') where not exists (select * from sources where id_out='korvintag_4782');
update ideas set source_id=(select id from sources where id_out='korvintag_4') where id_out='korvintag_260';
update ideas set source_id=(select id from sources where id_out='korvintag_4') where id_out='korvintag_261';
update ideas set source_id=(select id from sources where id_out='korvintag_4') where id_out='korvintag_262';
update ideas set source_id=(select id from sources where id_out='korvintag_4') where id_out='korvintag_263';
update ideas set source_id=(select id from sources where id_out='korvintag_4') where id_out='korvintag_264';
update ideas set source_id=(select id from sources where id_out='korvintag_4') where id_out='korvintag_265';
update ideas set source_id=(select id from sources where id_out='korvintag_4') where id_out='korvintag_270';
update ideas set source_id=(select id from sources where id_out='korvintag_28') where id_out='korvintag_274';
update ideas set source_id=(select id from sources where id_out='korvintag_28') where id_out='korvintag_2252';
update ideas set source_id=(select id from sources where id_out='korvintag_28') where id_out='korvintag_2254';
update ideas set source_id=(select id from sources where id_out='korvintag_28') where id_out='korvintag_2255';
update ideas set source_id=(select id from sources where id_out='korvintag_28') where id_out='korvintag_2257';
update ideas set source_id=(select id from sources where id_out='korvintag_28') where id_out='korvintag_2259';
update ideas set source_id=(select id from sources where id_out='korvintag_28') where id_out='korvintag_2260';
update ideas set source_id=(select id from sources where id_out='korvintag_28') where id_out='korvintag_2261';
update ideas set source_id=(select id from sources where id_out='korvintag_28') where id_out='korvintag_2262';
update ideas set source_id=(select id from sources where id_out='korvintag_28') where id_out='korvintag_2263';
update ideas set source_id=(select id from sources where id_out='korvintag_28') where id_out='korvintag_2264';
update ideas set source_id=(select id from sources where id_out='korvintag_28') where id_out='korvintag_2265';
update ideas set source_id=(select id from sources where id_out='korvintag_318') where id_out='korvintag_2496';
update ideas set source_id=(select id from sources where id_out='korvintag_318') where id_out='korvintag_2498';
update ideas set source_id=(select id from sources where id_out='korvintag_318') where id_out='korvintag_2501';
update ideas set source_id=(select id from sources where id_out='korvintag_318') where id_out='korvintag_2505';
update ideas set source_id=(select id from sources where id_out='korvintag_419') where id_out='korvintag_3850';
update ideas set source_id=(select id from sources where id_out='korvintag_419') where id_out='korvintag_3852';
update ideas set source_id=(select id from sources where id_out='korvintag_419') where id_out='korvintag_4038';
update ideas set source_id=(select id from sources where id_out='korvintag_419') where id_out='korvintag_4083';
update ideas set source_id=(select id from sources where id_out='korvintag_472') where id_out='korvintag_4456';
update ideas set source_id=(select id from sources where id_out='korvintag_472') where id_out='korvintag_4457';
update ideas set source_id=(select id from sources where id_out='korvintag_472') where id_out='korvintag_4459';
update ideas set source_id=(select id from sources where id_out='korvintag_472') where id_out='korvintag_4740';
update ideas set source_id=(select id from sources where id_out='korvintag_472') where id_out='korvintag_4782';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_297' and  ideas.id_out='korvintag_260';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_298' and  ideas.id_out='korvintag_260';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_299' and  ideas.id_out='korvintag_260';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_3214' and  ideas.id_out='korvintag_260';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_590' and  ideas.id_out='korvintag_261';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_885' and  ideas.id_out='korvintag_261';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_999' and  ideas.id_out='korvintag_261';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1565' and  ideas.id_out='korvintag_261';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1045' and  ideas.id_out='korvintag_262';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_5971' and  ideas.id_out='korvintag_262';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_5972' and  ideas.id_out='korvintag_262';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_5973' and  ideas.id_out='korvintag_262';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2' and  ideas.id_out='korvintag_263';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_302' and  ideas.id_out='korvintag_263';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_303' and  ideas.id_out='korvintag_263';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_304' and  ideas.id_out='korvintag_263';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_955' and  ideas.id_out='korvintag_263';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1816' and  ideas.id_out='korvintag_263';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2' and  ideas.id_out='korvintag_264';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_206' and  ideas.id_out='korvintag_264';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_305' and  ideas.id_out='korvintag_264';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1037' and  ideas.id_out='korvintag_264';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_52' and  ideas.id_out='korvintag_265';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_62' and  ideas.id_out='korvintag_265';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_591' and  ideas.id_out='korvintag_265';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_305' and  ideas.id_out='korvintag_270';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_307' and  ideas.id_out='korvintag_270';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2068' and  ideas.id_out='korvintag_270';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_311' and  ideas.id_out='korvintag_274';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1528' and  ideas.id_out='korvintag_274';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_838' and  ideas.id_out='korvintag_2252';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_885' and  ideas.id_out='korvintag_2252';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1337' and  ideas.id_out='korvintag_2252';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2192' and  ideas.id_out='korvintag_2252';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2259' and  ideas.id_out='korvintag_2252';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_126' and  ideas.id_out='korvintag_2254';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_368' and  ideas.id_out='korvintag_2254';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_884' and  ideas.id_out='korvintag_2254';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_909' and  ideas.id_out='korvintag_2254';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1604' and  ideas.id_out='korvintag_2254';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2235' and  ideas.id_out='korvintag_2254';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2261' and  ideas.id_out='korvintag_2254';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_63' and  ideas.id_out='korvintag_2255';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1380' and  ideas.id_out='korvintag_2255';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1872' and  ideas.id_out='korvintag_2255';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2262' and  ideas.id_out='korvintag_2255';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_62' and  ideas.id_out='korvintag_2257';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_602' and  ideas.id_out='korvintag_2257';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2264' and  ideas.id_out='korvintag_2257';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2265' and  ideas.id_out='korvintag_2257';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_5974' and  ideas.id_out='korvintag_2257';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_126' and  ideas.id_out='korvintag_2259';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_368' and  ideas.id_out='korvintag_2259';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1380' and  ideas.id_out='korvintag_2259';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1604' and  ideas.id_out='korvintag_2259';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_36' and  ideas.id_out='korvintag_2260';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_368' and  ideas.id_out='korvintag_2260';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_386' and  ideas.id_out='korvintag_2260';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2268' and  ideas.id_out='korvintag_2260';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_3938' and  ideas.id_out='korvintag_2260';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_386' and  ideas.id_out='korvintag_2261';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_924' and  ideas.id_out='korvintag_2261';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2269' and  ideas.id_out='korvintag_2261';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_972' and  ideas.id_out='korvintag_2262';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_989' and  ideas.id_out='korvintag_2262';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_3906' and  ideas.id_out='korvintag_2262';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_11' and  ideas.id_out='korvintag_2263';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_386' and  ideas.id_out='korvintag_2263';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_924' and  ideas.id_out='korvintag_2263';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1380' and  ideas.id_out='korvintag_2263';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2270' and  ideas.id_out='korvintag_2263';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_386' and  ideas.id_out='korvintag_2264';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_950' and  ideas.id_out='korvintag_2264';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1337' and  ideas.id_out='korvintag_2264';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2271' and  ideas.id_out='korvintag_2264';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2272' and  ideas.id_out='korvintag_2264';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_106' and  ideas.id_out='korvintag_2265';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_909' and  ideas.id_out='korvintag_2265';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_924' and  ideas.id_out='korvintag_2265';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2266' and  ideas.id_out='korvintag_2265';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2268' and  ideas.id_out='korvintag_2265';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_36' and  ideas.id_out='korvintag_2496';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_989' and  ideas.id_out='korvintag_2496';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1022' and  ideas.id_out='korvintag_2496';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1031' and  ideas.id_out='korvintag_2496';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1068' and  ideas.id_out='korvintag_2496';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_838' and  ideas.id_out='korvintag_2498';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1027' and  ideas.id_out='korvintag_2498';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1337' and  ideas.id_out='korvintag_2498';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2476' and  ideas.id_out='korvintag_2498';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_3761' and  ideas.id_out='korvintag_2498';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_83' and  ideas.id_out='korvintag_2501';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2481' and  ideas.id_out='korvintag_2501';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2482' and  ideas.id_out='korvintag_2501';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2483' and  ideas.id_out='korvintag_2501';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_98' and  ideas.id_out='korvintag_2505';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_417' and  ideas.id_out='korvintag_2505';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_687' and  ideas.id_out='korvintag_2505';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1031' and  ideas.id_out='korvintag_2505';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2267' and  ideas.id_out='korvintag_2505';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2460' and  ideas.id_out='korvintag_2505';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_106' and  ideas.id_out='korvintag_3850';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_867' and  ideas.id_out='korvintag_3850';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_998' and  ideas.id_out='korvintag_3850';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1419' and  ideas.id_out='korvintag_3850';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2220' and  ideas.id_out='korvintag_3850';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_106' and  ideas.id_out='korvintag_3852';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1037' and  ideas.id_out='korvintag_3852';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1526' and  ideas.id_out='korvintag_3852';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1981' and  ideas.id_out='korvintag_3852';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2077' and  ideas.id_out='korvintag_3852';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2783' and  ideas.id_out='korvintag_3852';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_3752' and  ideas.id_out='korvintag_3852';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_934' and  ideas.id_out='korvintag_4038';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1302' and  ideas.id_out='korvintag_4038';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1600' and  ideas.id_out='korvintag_4038';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1708' and  ideas.id_out='korvintag_4038';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_3754' and  ideas.id_out='korvintag_4038';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_5485' and  ideas.id_out='korvintag_4038';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_76' and  ideas.id_out='korvintag_4083';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_374' and  ideas.id_out='korvintag_4083';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_574' and  ideas.id_out='korvintag_4083';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_699' and  ideas.id_out='korvintag_4083';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1685' and  ideas.id_out='korvintag_4083';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_3754' and  ideas.id_out='korvintag_4083';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_602' and  ideas.id_out='korvintag_4456';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_968' and  ideas.id_out='korvintag_4456';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1449' and  ideas.id_out='korvintag_4456';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2077' and  ideas.id_out='korvintag_4456';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_5969' and  ideas.id_out='korvintag_4456';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1118' and  ideas.id_out='korvintag_4457';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1326' and  ideas.id_out='korvintag_4457';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2200' and  ideas.id_out='korvintag_4457';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_70' and  ideas.id_out='korvintag_4459';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_106' and  ideas.id_out='korvintag_4459';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_884' and  ideas.id_out='korvintag_4459';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1384' and  ideas.id_out='korvintag_4459';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1467' and  ideas.id_out='korvintag_4459';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_2783' and  ideas.id_out='korvintag_4459';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_5970' and  ideas.id_out='korvintag_4459';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_52' and  ideas.id_out='korvintag_4740';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_983' and  ideas.id_out='korvintag_4740';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1805' and  ideas.id_out='korvintag_4740';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_4204' and  ideas.id_out='korvintag_4740';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_42' and  ideas.id_out='korvintag_4782';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_313' and  ideas.id_out='korvintag_4782';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_838' and  ideas.id_out='korvintag_4782';
insert into idea_keywords(keyword_id, idea_id) select keywords.id kid, ideas.id iid from keywords, ideas  where keywords.id_out='korvintag_1805' and  ideas.id_out='korvintag_4782';
  end if;
END $$;
