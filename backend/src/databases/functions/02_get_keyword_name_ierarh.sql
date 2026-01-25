-- Создание функции
CREATE OR REPLACE FUNCTION get_keyword_name_ierarh(keyword_id INTEGER, direct INTEGER=1)
RETURNS TEXT AS $$
DECLARE
	class_id INTEGER;
BEGIN
    SELECT coalesce(class_keyword_id,0) INTO class_id
    FROM keywords
    WHERE id = keyword_id;
    if (class_id=0) then
      RETURN '';
    else
      RETURN get_keyword_name_ierarh_inc(class_id, direct);
    end if;
END;
$$ LANGUAGE plpgsql;