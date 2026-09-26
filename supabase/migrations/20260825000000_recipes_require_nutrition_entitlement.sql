-- The app itself always reads `recipes` through the service-role client (bypassing RLS
-- entirely) and already gates the recipe pages on an active nutrition entitlement at the
-- Next.js level — but the table's own RLS policy was `select using (true)`, meaning anyone
-- with the public anon key (shipped in every browser bundle) could read the full recipe
-- catalog directly from Supabase's REST API, with no login and no subscription, entirely
-- bypassing the app's paywall for this content. Replacing it with a policy that actually
-- requires an authenticated user with an active nutrition entitlement closes that gap
-- without touching how the app itself reads recipes (still via service-role, unaffected).
drop policy if exists "Recipes are publicly readable" on recipes;

create policy "Recipes readable with an active nutrition subscription"
    on recipes for select
    using (
        exists (
            select 1 from entitlements
            where entitlements.user_id = auth.uid()
              and entitlements.module = 'nutrition'
              and entitlements.status = 'active'
        )
    );
