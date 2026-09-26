-- The progress_photos table (added earlier) had no matching Storage bucket, so there was
-- nowhere to actually upload a file to — that's why this feature never got a UI. Files are
-- stored as {user_id}/{filename}, private bucket, and RLS restricts each user to their own
-- folder (Supabase Storage checks storage.foldername(name) against the path segments).
insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

create policy "Users can upload their own progress photos"
    on storage.objects for insert
    with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view their own progress photos"
    on storage.objects for select
    using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own progress photos"
    on storage.objects for delete
    using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);
