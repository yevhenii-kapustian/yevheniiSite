-- Marks a generated training_plans row as a deload week so the UI can show it, instead
-- of the client having to re-derive it from plan count (which the client doesn't have).
alter table training_plans add column is_deload boolean not null default false;

-- Body measurements (waist, chest, hips, etc.) — separate from body_logs (weight-only)
-- since these are logged far less often and have a different, open-ended set of fields.
create table body_measurements (
    id bigint generated always as identity primary key,
    user_id uuid not null references profiles(id) on delete cascade,
    logged_at date not null,
    waist_cm numeric,
    chest_cm numeric,
    hips_cm numeric,
    thigh_cm numeric,
    arm_cm numeric,
    created_at timestamptz not null default now(),
    unique (user_id, logged_at)
);

alter table body_measurements enable row level security;

create policy "Users can view their own measurements"
    on body_measurements for select
    using (auth.uid() = user_id);

create policy "Users can insert their own measurements"
    on body_measurements for insert
    with check (auth.uid() = user_id);

create policy "Users can delete their own measurements"
    on body_measurements for delete
    using (auth.uid() = user_id);
