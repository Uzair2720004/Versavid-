-- ============================================================================
-- VersaVid — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Tables: profiles, credits, videos, transactions.
-- Includes Row Level Security so each user only sees their own rows, plus a
-- trigger that provisions a profile + 15 free credits on signup.
-- ============================================================================

-- Extensions ----------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- Enums ----------------------------------------------------------------------
do $$ begin
  create type video_status as enum ('draft','queued','generating','ready','failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type txn_type as enum ('purchase','subscription','usage','refund','bonus');
exception when duplicate_object then null; end $$;

do $$ begin
  create type txn_status as enum ('completed','pending','failed');
exception when duplicate_object then null; end $$;

-- profiles -------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  country     text,
  brand_name  text,
  created_at  timestamptz not null default now()
);

-- credits --------------------------------------------------------------------
create table if not exists public.credits (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  balance           integer not null default 15,
  total_purchased   integer not null default 0,
  total_used        integer not null default 0,
  monthly_allowance integer not null default 15,
  updated_at        timestamptz not null default now(),
  unique (user_id)
);

-- videos ---------------------------------------------------------------------
create table if not exists public.videos (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text not null,
  topic         text,
  format        text not null default '9:16',
  status        video_status not null default 'draft',
  script        text,
  video_url     text,
  thumbnail_url text,
  credits_used  integer not null default 0,
  duration      integer not null default 0,
  settings      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists videos_user_id_idx on public.videos (user_id);

-- transactions ---------------------------------------------------------------
create table if not exists public.transactions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  amount      numeric(10,2) not null default 0,
  credits     integer not null default 0,
  type        txn_type not null,
  status      txn_status not null default 'completed',
  payment_id  text,
  description text,
  created_at  timestamptz not null default now()
);
create index if not exists transactions_user_id_idx on public.transactions (user_id);

-- Row Level Security ---------------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.credits      enable row level security;
alter table public.videos       enable row level security;
alter table public.transactions enable row level security;

create policy "own profile"      on public.profiles     for all using (auth.uid() = id)      with check (auth.uid() = id);
create policy "own credits"      on public.credits      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own videos"       on public.videos       for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own transactions" on public.transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- New-user provisioning ------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );

  insert into public.credits (user_id, balance, monthly_allowance)
  values (new.id, 15, 15);

  insert into public.transactions (user_id, amount, credits, type, status, description)
  values (new.id, 0, 15, 'bonus', 'completed', 'Welcome bonus — 15 free credits');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
