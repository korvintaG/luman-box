-- Создание функции
CREATE OR REPLACE FUNCTION get_keyword_bread_crumbs(keyword_id INTEGER)
RETURNS TEXT AS $$
DECLARE
    result_name TEXT;
	class_id INTEGER;
    cur_json TEXT;
BEGIN
    -- Ищем name по id
    if (keyword_id=0) then
      return '';
    end if;
    SELECT name, class_keyword_id INTO result_name, class_id
    FROM keywords
    WHERE id = keyword_id;
    -- Используем json_build_object для правильного экранирования спецсимволов
    cur_json = json_build_object('id', keyword_id, 'name', result_name)::text;
	if (class_id=0) then
      RETURN cur_json;
	else
      RETURN get_keyword_bread_crumbs(class_id)||' , '||cur_json;
	end if;
END;
$$ LANGUAGE plpgsql;