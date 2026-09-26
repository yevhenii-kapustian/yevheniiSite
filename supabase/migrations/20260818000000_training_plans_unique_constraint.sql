-- getOrCreateTrainingPlan did a plain "check if a plan exists for this week, if not insert
-- one" — not atomic, and with no unique constraint backing it, two requests landing close
-- together (multiple tabs, or several pages that each independently call
-- getTrainingPlanWithExercises around the same time) could both pass the "not found" check
-- and each insert their own training_plans row for the same user+week. The swap feature
-- exposed this concretely: a plan_exercise_id captured by an already-loaded page could
-- belong to a duplicate plan that a later request superseded, so a swap would silently
-- update a row that was no longer the "current" one the UI was reading from.
--
-- Clean up existing duplicates first — for each (user_id, week_number) with more than one
-- plan, keep whichever one actually has logged sets against it (so no real workout history
-- is lost), tie-broken by the most recently created. Cascades (on delete cascade on
-- plan_exercises.training_plan_id and workout_set_logs.plan_exercise_id) clean up the
-- losing plans' exercises and any logs tied only to those.
with ranked as (
    select
        tp.id,
        row_number() over (
            partition by tp.user_id, tp.week_number
            order by (
                select count(*)
                from workout_set_logs wsl
                join plan_exercises pe on pe.id = wsl.plan_exercise_id
                where pe.training_plan_id = tp.id
            ) desc, tp.id desc
        ) as rn
    from training_plans tp
)
delete from training_plans
where id in (select id from ranked where rn > 1);

alter table training_plans
    add constraint training_plans_user_week_unique unique (user_id, week_number);
