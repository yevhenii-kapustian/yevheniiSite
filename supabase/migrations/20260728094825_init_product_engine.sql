-- Profile & identity

create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    gender text,
    height_cm numeric,
    goal text check (goal in ('fat_loss', 'muscle_gain', 'maintenance')),
    activity_level text,
    trains_with_program boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users manage their own profile"
    on profiles for all
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- Entitlements (module access, driven by Stripe)

create table entitlements (
    id bigint generated always as identity primary key,
    user_id uuid not null references profiles(id) on delete cascade,
    module text not null check (module in ('nutrition', 'training')),
    status text not null check (status in ('active', 'canceled', 'expired')),
    stripe_subscription_id text,
    current_period_end timestamptz,
    created_at timestamptz not null default now(),
    unique (user_id, module)
);

alter table entitlements enable row level security;

create policy "Users read their own entitlements"
    on entitlements for select
    using (auth.uid() = user_id);

-- Nutrition engine

create table nutrition_targets (
    id bigint generated always as identity primary key,
    user_id uuid not null references profiles(id) on delete cascade,
    week_number int not null,
    calories int not null,
    protein_g int not null,
    fat_g int not null,
    carbs_g int not null,
    accounts_for_training boolean not null,
    created_at timestamptz not null default now()
);

alter table nutrition_targets enable row level security;

create policy "Users read their own nutrition targets"
    on nutrition_targets for select
    using (auth.uid() = user_id);

create table body_logs (
    id bigint generated always as identity primary key,
    user_id uuid not null references profiles(id) on delete cascade,
    logged_at date not null,
    weight_kg numeric not null,
    created_at timestamptz not null default now(),
    unique (user_id, logged_at)
);

alter table body_logs enable row level security;

create policy "Users manage their own body logs"
    on body_logs for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create table daily_intake_logs (
    id bigint generated always as identity primary key,
    user_id uuid not null references profiles(id) on delete cascade,
    logged_date date not null,
    calories int not null,
    protein_g int,
    fat_g int,
    carbs_g int,
    created_at timestamptz not null default now(),
    unique (user_id, logged_date)
);

alter table daily_intake_logs enable row level security;

create policy "Users manage their own intake logs"
    on daily_intake_logs for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Training engine

create table exercises (
    id bigint generated always as identity primary key,
    name text not null,
    muscle_group text not null,
    equipment text,
    created_at timestamptz not null default now()
);

alter table exercises enable row level security;

create policy "Exercise library is publicly readable"
    on exercises for select
    using (true);

create table training_plans (
    id bigint generated always as identity primary key,
    user_id uuid not null references profiles(id) on delete cascade,
    week_number int not null,
    template_name text not null,
    created_at timestamptz not null default now()
);

alter table training_plans enable row level security;

create policy "Users read their own training plans"
    on training_plans for select
    using (auth.uid() = user_id);

create table plan_exercises (
    id bigint generated always as identity primary key,
    training_plan_id bigint not null references training_plans(id) on delete cascade,
    exercise_id bigint not null references exercises(id),
    day_of_week int not null check (day_of_week between 1 and 7),
    target_sets int not null,
    target_reps int not null,
    target_weight_kg numeric,
    order_index int not null
);

alter table plan_exercises enable row level security;

create policy "Users read exercises on their own plans"
    on plan_exercises for select
    using (
        auth.uid() = (select user_id from training_plans where training_plans.id = plan_exercises.training_plan_id)
    );

create table workout_set_logs (
    id bigint generated always as identity primary key,
    user_id uuid not null references profiles(id) on delete cascade,
    plan_exercise_id bigint not null references plan_exercises(id) on delete cascade,
    performed_at timestamptz not null default now(),
    set_number int not null,
    actual_reps int not null,
    actual_weight_kg numeric not null,
    effort text not null check (effort in ('easy', 'moderate', 'hard', 'failed')),
    created_at timestamptz not null default now()
);

alter table workout_set_logs enable row level security;

create policy "Users manage their own workout logs"
    on workout_set_logs for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Bridge the existing PDF-store tables to the new module/entitlement model

alter table products
    add column grants_module text check (grants_module in ('nutrition', 'training')),
    add column is_subscription boolean not null default false;

alter table purchases
    add column user_id uuid references profiles(id);
