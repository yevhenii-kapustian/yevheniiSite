-- insertBodyMeasurement does an upsert (insert ... on conflict do update) to merge same-day
-- entries, which needs UPDATE permission on the conflict path — only INSERT/SELECT/DELETE
-- policies existed. Everything currently goes through the service-role client so RLS is
-- bypassed regardless, but this closes the gap for defense-in-depth (and for correctness
-- if a future code path ever queries this table from the browser client directly).
--
-- entitlements/nutrition_targets/training_plans/plan_exercises are deliberately left
-- SELECT-only — those are always system-computed (webhook/plan generator), never something
-- a user should be able to write directly, so no write policy is added for them.
create policy "Users can update their own measurements"
    on body_measurements for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
