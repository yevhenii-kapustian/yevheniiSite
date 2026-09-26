-- A duplicate Stripe webhook delivery (or two near-simultaneous requests that each
-- recalculate the nutrition target) previously had no way to be deduplicated at the
-- database level — insertNutritionTarget was a plain insert. This constraint is what
-- makes the app's switch to upsert(onConflict: "user_id,week_number") actually enforce
-- "one target per user per week" instead of silently accepting duplicates.
--
-- If duplicate (user_id, week_number) rows already exist, keep only the most recent one
-- per pair before adding the constraint.
delete from nutrition_targets a
    using nutrition_targets b
    where a.user_id = b.user_id
      and a.week_number = b.week_number
      and a.created_at < b.created_at;

alter table nutrition_targets
    add constraint nutrition_targets_user_week_unique unique (user_id, week_number);
