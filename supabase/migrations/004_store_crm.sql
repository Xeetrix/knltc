create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum ('pending', 'confirmed', 'processing', 'delivered', 'cancelled');
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'review_status') then
    create type public.review_status as enum ('pending', 'approved', 'rejected');
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'crm_lead_status') then
    create type public.crm_lead_status as enum ('new', 'contacted', 'interested', 'converted', 'lost');
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'crm_lead_source') then
    create type public.crm_lead_source as enum ('checkout', 'contact form', 'consultation form', 'manual admin entry');
  end if;
end$$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  customer_address text not null,
  customer_note text,
  total_amount numeric(10,2) not null default 0,
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  price numeric(10,2) not null,
  quantity integer not null default 1,
  subtotal numeric(10,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  source public.crm_lead_source not null,
  interest text,
  message text,
  notes text,
  status public.crm_lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists trg_crm_leads_updated_at on public.crm_leads;
create trigger trg_crm_leads_updated_at
before update on public.crm_leads
for each row execute function public.set_updated_at();

create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);
create index if not exists idx_reviews_product_id on public.product_reviews(product_id);
create index if not exists idx_reviews_status on public.product_reviews(status);
create index if not exists idx_crm_leads_status on public.crm_leads(status);
create index if not exists idx_crm_leads_source on public.crm_leads(source);
create index if not exists idx_crm_leads_created_at on public.crm_leads(created_at desc);

alter table public.orders disable row level security;
alter table public.order_items disable row level security;
alter table public.product_reviews disable row level security;
alter table public.crm_leads disable row level security;

notify pgrst, 'reload schema';
