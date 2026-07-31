alter table daily_intake_logs
    drop constraint if exists daily_intake_logs_user_id_logged_date_key;

alter table daily_intake_logs
    add column meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
    add column name text;
