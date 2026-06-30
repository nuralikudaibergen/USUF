-- YUSUF BRAND basic public-store schema.
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.

create table if not exists public.products (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text unique,
  sku text not null,
  category text not null check (category in ('men', 'women')),
  type text not null check (type in ('apparel', 'footwear')),
  price integer not null default 0,
  old_price integer,
  image text not null default '/placeholder.svg',
  images text[] not null default '{}',
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  material text not null default '',
  description text not null default '',
  is_new boolean not null default false,
  is_featured boolean not null default false,
  popularity integer not null default 50,
  rating numeric not null default 4.5,
  tag text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  label text not null,
  image text not null default '/placeholder.svg',
  href text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.promos (
  code text primary key,
  type text not null check (type in ('percent', 'fixed')),
  value integer not null default 0,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key default gen_random_uuid()::text,
  customer_name text not null,
  customer_phone text not null,
  customer_city text not null,
  customer_address text,
  promo_code text,
  subtotal integer not null default 0,
  discount integer not null default 0,
  total integer not null default 0,
  whatsapp_message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id text primary key default gen_random_uuid()::text,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  size text not null,
  color text not null,
  quantity integer not null default 1,
  price integer not null default 0
);

alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.promos enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Open policies because the current admin panel intentionally has no login.
-- For a production store with private admin access, replace these with authenticated/admin policies.
create policy "public read products" on public.products for select using (true);
create policy "public write products" on public.products for all using (true) with check (true);

create policy "public read categories" on public.categories for select using (true);
create policy "public write categories" on public.categories for all using (true) with check (true);

create policy "public read promos" on public.promos for select using (true);
create policy "public write promos" on public.promos for all using (true) with check (true);

create policy "public write orders" on public.orders for insert with check (true);
create policy "public read orders" on public.orders for select using (true);

create policy "public write order_items" on public.order_items for insert with check (true);
create policy "public read order_items" on public.order_items for select using (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

create policy "public read product images"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "public upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images');

create policy "public update product images"
on storage.objects for update
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

create policy "public delete product images"
on storage.objects for delete
using (bucket_id = 'product-images');
