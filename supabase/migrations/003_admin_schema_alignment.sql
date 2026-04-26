create extension if not exists "pgcrypto";

create type if not exists public.content_status as enum ('draft', 'published');
create type if not exists public.category_type as enum ('product', 'blog');

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type public.category_type not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  title text not null default '',
  slug text not null unique,
  sku text,
  category text,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(10,2) not null default 0,
  sale_price numeric(10,2),
  stock integer not null default 0,
  status public.content_status not null default 'draft',
  short_description text not null default '',
  description text not null default '',
  full_description text not null default '',
  image_url text,
  featured_image text,
  gallery text[] not null default '{}',
  featured boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  category text,
  category_id uuid references public.categories(id) on delete set null,
  tags text[] not null default '{}',
  author text not null default 'KNLTC',
  status public.content_status not null default 'draft',
  cover_image_url text,
  image_url text,
  cover_image text,
  published_at timestamptz,
  publish_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories add column if not exists updated_at timestamptz not null default now();

alter table public.products add column if not exists name text;
alter table public.products add column if not exists title text;
alter table public.products add column if not exists sku text;
alter table public.products add column if not exists category text;
alter table public.products add column if not exists category_id uuid references public.categories(id) on delete set null;
alter table public.products add column if not exists price numeric(10,2) not null default 0;
alter table public.products add column if not exists sale_price numeric(10,2);
alter table public.products add column if not exists stock integer not null default 0;
alter table public.products add column if not exists status public.content_status not null default 'draft';
alter table public.products add column if not exists short_description text;
alter table public.products add column if not exists description text;
alter table public.products add column if not exists full_description text;
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists featured_image text;
alter table public.products add column if not exists gallery text[] not null default '{}';
alter table public.products add column if not exists featured boolean not null default false;
alter table public.products add column if not exists is_featured boolean not null default false;
alter table public.products add column if not exists updated_at timestamptz not null default now();

alter table public.blog_posts add column if not exists excerpt text;
alter table public.blog_posts add column if not exists category text;
alter table public.blog_posts add column if not exists category_id uuid references public.categories(id) on delete set null;
alter table public.blog_posts add column if not exists tags text[] not null default '{}';
alter table public.blog_posts add column if not exists author text not null default 'KNLTC';
alter table public.blog_posts add column if not exists status public.content_status not null default 'draft';
alter table public.blog_posts add column if not exists cover_image_url text;
alter table public.blog_posts add column if not exists image_url text;
alter table public.blog_posts add column if not exists cover_image text;
alter table public.blog_posts add column if not exists published_at timestamptz;
alter table public.blog_posts add column if not exists publish_date date;
alter table public.blog_posts add column if not exists updated_at timestamptz not null default now();

update public.products
set
  name = coalesce(nullif(name, ''), nullif(title, ''), ''),
  title = coalesce(nullif(title, ''), nullif(name, ''), ''),
  description = coalesce(description, short_description, full_description, ''),
  short_description = coalesce(short_description, description, full_description, ''),
  full_description = coalesce(full_description, description, short_description, ''),
  image_url = coalesce(image_url, featured_image),
  featured_image = coalesce(featured_image, image_url),
  featured = coalesce(featured, is_featured, false),
  is_featured = coalesce(is_featured, featured, false),
  gallery = coalesce(gallery, '{}');

update public.blog_posts
set
  excerpt = coalesce(excerpt, ''),
  cover_image_url = coalesce(cover_image_url, image_url, cover_image),
  image_url = coalesce(image_url, cover_image_url, cover_image),
  cover_image = coalesce(cover_image, cover_image_url, image_url),
  tags = coalesce(tags, '{}'),
  published_at = coalesce(published_at, publish_date::timestamptz),
  publish_date = coalesce(publish_date, published_at::date);

alter table public.products alter column name set default '';
alter table public.products alter column title set default '';
alter table public.products alter column short_description set default '';
alter table public.products alter column description set default '';
alter table public.products alter column full_description set default '';

alter table public.products alter column name set not null;
alter table public.products alter column title set not null;
alter table public.products alter column short_description set not null;
alter table public.products alter column description set not null;
alter table public.products alter column full_description set not null;

alter table public.blog_posts alter column excerpt set default '';
alter table public.blog_posts alter column excerpt set not null;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_category_id on public.products(category_id);

create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_blog_posts_category on public.blog_posts(category);
create index if not exists idx_blog_posts_category_id on public.blog_posts(category_id);

create index if not exists idx_categories_slug on public.categories(slug);
