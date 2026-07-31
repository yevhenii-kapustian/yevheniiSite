create table progress_photos (
    id bigint generated always as identity primary key,
    user_id uuid not null references profiles(id) on delete cascade,
    storage_path text not null,
    label text not null check (label in ('before', 'after', 'progress')),
    taken_at date not null default current_date,
    created_at timestamptz not null default now()
);

alter table progress_photos enable row level security;

create policy "Users manage their own photos"
    on progress_photos for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
