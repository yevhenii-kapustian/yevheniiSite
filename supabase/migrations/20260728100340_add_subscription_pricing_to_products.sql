alter table products
    add column stripe_price_id text,
    add column billing_interval text check (billing_interval in ('month', 'year'));
