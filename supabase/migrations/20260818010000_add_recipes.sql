-- Recipes are fetched from Spoonacular (a metered, rate-limited third-party API) and
-- cached here permanently — the app never calls Spoonacular on a normal page view, only
-- through a separate, manually-triggered sync route. Same "publicly readable, no
-- user-writable" shape as the exercises table, since recipe content is system-managed,
-- not user data.
create table recipes (
    id bigint generated always as identity primary key,
    external_id text not null unique,
    title text not null,
    image_url text,
    servings int not null default 1,
    calories int not null,
    protein_g int not null,
    fat_g int not null,
    carbs_g int not null,
    ingredients text not null,
    instructions text not null,
    source_url text,
    created_at timestamptz not null default now()
);

alter table recipes enable row level security;

create policy "Recipes are publicly readable"
    on recipes for select
    using (true);
