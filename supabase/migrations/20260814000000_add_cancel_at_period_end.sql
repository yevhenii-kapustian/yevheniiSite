-- Stripe keeps subscription.status = "active" for the whole paid period even after
-- the customer cancels via the billing portal (cancel_at_period_end = true) — without
-- this flag, Settings has no way to distinguish "will renew" from "canceled but still
-- active until period end".
alter table entitlements add column cancel_at_period_end boolean not null default false;
