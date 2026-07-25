-- ============================================================================
-- Migration: Add period_start column to profiles for monthly reset logic
-- Run in Supabase SQL editor or via `supabase db push`
-- ============================================================================

-- Add period_start column to profiles
alter table public.profiles
add column if not exists period_start timestamptz not null default now();

-- Add comment for documentation
comment on column public.profiles.period_start is 'Start of current billing period for monthly_video_count reset';

-- Set period_start for existing users (they start fresh)
update public.profiles set period_start = now() where period_start is null;