SELECT "like", COUNT(*) AS count
FROM attitudes
where idea_id=684
GROUP BY "like"
ORDER BY "like" ;