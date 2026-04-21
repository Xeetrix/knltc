create extension if not exists "pgcrypto";

create type public.content_status as enum ('draft', 'published');
create type public.category_type as enum ('product', 'blog');

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type public.category_type not null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  short_description text not null,
  full_description text not null default '',
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  stock integer not null default 0,
  featured_image text,
  gallery text[] default '{}',
  status public.content_status not null default 'draft',
  is_featured boolean not null default false,
  sku text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null default '',
  cover_image text,
  category_id uuid references public.categories(id) on delete set null,
  tags text[] default '{}',
  author text not null default 'KNLTC',
  publish_date date,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.categories (name, slug, type)
values
  ('Japanese Books', 'japanese-books', 'product'),
  ('JLPT Materials', 'jlpt-materials', 'product'),
  ('Stationery', 'stationery', 'product'),
  ('Learning Accessories', 'learning-accessories', 'product'),
  ('Japan Study Guide', 'japan-study-guide', 'blog'),
  ('Visa Tips', 'visa-tips', 'blog'),
  ('Japanese Language', 'japanese-language', 'blog'),
  ('Career in Japan', 'career-in-japan', 'blog'),
  ('News & Updates', 'news-updates', 'blog')
on conflict (slug) do nothing;

insert into public.products (name, slug, category_id, short_description, full_description, price, stock, status)
select 'Minna no Nihongo Book 1', 'minna-no-nihongo-book-1', id,
'Beginner-level Japanese textbook for foundational grammar and vocabulary.',
'Ideal for beginner learners starting sentence structure and basic communication.',
850, 20, 'published'
from public.categories where slug = 'japanese-books'
on conflict (slug) do nothing;

insert into public.products (name, slug, category_id, short_description, full_description, price, stock, status)
select 'JLPT N5 Vocabulary Book', 'jlpt-n5-vocabulary-book', id,
'Vocabulary preparation book for JLPT N5 learners.',
'Focused vocabulary practice with exam-oriented examples and drills.',
650, 15, 'published'
from public.categories where slug = 'jlpt-materials'
on conflict (slug) do nothing;

insert into public.products (name, slug, category_id, short_description, full_description, price, stock, status)
select 'Japanese Writing Notebook', 'japanese-writing-notebook', id,
'Practice notebook for kana and basic writing exercises.',
'Grid-style writing practice notebook for Hiragana, Katakana and introductory Kanji.',
180, 40, 'published'
from public.categories where slug = 'stationery'
on conflict (slug) do nothing;

insert into public.products (name, slug, category_id, short_description, full_description, price, stock, status)
select 'Kana Flash Cards Set', 'kana-flash-cards-set', id,
'Hiragana and Katakana flash cards for fast memorization.',
'Portable flash cards to strengthen Kana recall using repetition techniques.',
300, 25, 'published'
from public.categories where slug = 'learning-accessories'
on conflict (slug) do nothing;

insert into public.blog_posts (title, slug, excerpt, content, category_id, author, publish_date, status)
select 'জাপানে স্টুডেন্ট ভিসার জন্য কী কী লাগে', 'japan-student-visa-checklist',
'জাপানে স্টুডেন্ট ভিসার জন্য প্রয়োজনীয় কাগজপত্র ও প্রস্তুতি সম্পর্কে সংক্ষিপ্ত গাইড।',
'প্রয়োজনীয় ডকুমেন্ট, ফাইন্যান্সিয়াল প্রস্তুতি এবং টাইমলাইন নিয়ে এই গাইডে আলোচনা করা হয়েছে।',
id, 'KNLTC', current_date, 'published'
from public.categories where slug = 'visa-tips'
on conflict (slug) do nothing;

insert into public.blog_posts (title, slug, excerpt, content, category_id, author, publish_date, status)
select 'JLPT N5 শুরু করবেন কীভাবে', 'jlpt-n5-start-guide',
'একদম beginner হিসেবে JLPT N5 প্রস্তুতি শুরু করার practical উপায়।',
'স্টাডি প্ল্যান, রিসোর্স নির্বাচন এবং দৈনিক রুটিন সেটআপ নিয়ে একটি প্রাথমিক রোডম্যাপ।',
id, 'KNLTC', current_date, 'published'
from public.categories where slug = 'japanese-language'
on conflict (slug) do nothing;

insert into public.blog_posts (title, slug, excerpt, content, category_id, author, publish_date, status)
select 'জাপানে কাজের সুযোগ সম্পর্কে প্রাথমিক ধারণা', 'career-opportunities-in-japan',
'জাপানে কাজের ক্ষেত্র, প্রাথমিক যোগ্যতা এবং প্রস্তুতির ধাপগুলো।',
'জব সেক্টর, ভাষা দক্ষতা এবং ডকুমেন্ট প্রস্তুতি সম্পর্কে প্রাথমিক ধারণা দেওয়া হয়েছে।',
id, 'KNLTC', current_date, 'published'
from public.categories where slug = 'career-in-japan'
on conflict (slug) do nothing;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.blog_posts enable row level security;

create policy "Public can read published products" on public.products
for select using (status = 'published');

create policy "Public can read published blog posts" on public.blog_posts
for select using (status = 'published');

create policy "Public can read categories" on public.categories
for select using (true);
