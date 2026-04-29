alter table public.orders
add column if not exists delivery_area text;

alter table public.orders
add column if not exists delivery_charge numeric default 0;

alter table public.orders
add column if not exists grand_total numeric default 0;

alter table public.product_reviews
add column if not exists image_url text;

notify pgrst, 'reload schema';
