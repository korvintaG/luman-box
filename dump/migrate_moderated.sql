update authors 
set verification_status=3, 
    verified_user_id=(select id from users where role_id=3),
    date_time_to_moderate=date_time_create + interval '4 hours',
    date_time_moderated=date_time_create + interval '21 hours'
where id_out is not null;

update keywords 
set verification_status=3,  
    verified_user_id=(select id from users where role_id=3),
    date_time_to_moderate=date_time_create + interval '4 hours',
    date_time_moderated=date_time_create + interval '21 hours'
where id_out is not null;

update ideas 
set verification_status=3, 
    verified_user_id=(select id from users where role_id=3),
    date_time_to_moderate=date_time_create + interval '4 hours',
    date_time_moderated=date_time_create + interval '21 hours'
where id_out is not null;

update sources 
set verification_status=3, 
    verified_user_id=(select id from users where role_id=3),
    date_time_to_moderate=date_time_create + interval '4 hours',
    date_time_moderated=date_time_create + interval '21 hours'
where id_out is not null;

update interconnections 
set verification_status=3, 
    verified_user_id=(select id from users where role_id=3),
    date_time_to_moderate=date_time_create + interval '4 hours',
    date_time_moderated=date_time_create + interval '21 hours'
where id_out is not null;


