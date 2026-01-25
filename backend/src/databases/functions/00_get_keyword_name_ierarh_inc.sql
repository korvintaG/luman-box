-- Создание функции
CREATE OR REPLACE FUNCTION get_keyword_name_ierarh_inc(keyword_id INTEGER, direct INTEGER=1 )
RETURNS TEXT AS $$
DECLARE
    result_name TEXT;
	class_id INTEGER;
BEGIN
    -- а не 0 ли?
	if (coalesce(keyword_id,0)=0) then
	  return '';
	end if;
    -- Ищем name по id
    SELECT name, class_keyword_id INTO result_name, class_id
    FROM keywords
    WHERE id = keyword_id;

	if (class_id=0) then
      RETURN result_name;
	else
	  if (direct=1) then
	    RETURN get_keyword_name_ierarh_inc(class_id,direct)||' / '||result_name;
	  else
	    RETURN result_name||' / '||get_keyword_name_ierarh_inc(class_id, direct);
	  end if;
	end if;
END;
$$ LANGUAGE plpgsql;