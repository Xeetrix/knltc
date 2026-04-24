create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  price numeric(10,2) not null default 0,
  image_url text,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null default '',
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.products add column if not exists title text;
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists description text;

update public.products
set
  title = coalesce(title, name),
  image_url = coalesce(image_url, featured_image),
  description = coalesce(description, short_description, full_description, '')
where title is null or image_url is null or description is null;

alter table public.products alter column title set not null;
alter table public.products alter column description set not null;

alter table public.blog_posts add column if not exists image_url text;

update public.blog_posts
set image_url = coalesce(image_url, cover_image)
where image_url is null;
