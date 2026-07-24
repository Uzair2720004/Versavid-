-- ============================================================================
-- Migration: Add free-tier plan fields to profiles table
-- Run in Supabase SQL editor or via `supabase db push`
-- ============================================================================

-- Add plan, monthly_video_count, signup_ip columns to profiles
alter table public.profiles
add column if not exists plan text not null default 'free'
  check (plan in ('free', 'creator', 'pro', 'agency')),
add column if not exists monthly_video_count integer not null default 0,
add column if not exists signup_ip text;

-- Add index for monthly_video_count queries (e.g., admin dashboards, limits)
create index if not exists profiles_monthly_video_count_idx on public.profiles (monthly_video_count);

-- Add comment for documentation
comment on column public.profiles.plan is 'Current subscription tier: free, creator, pro, agency';
comment on column public.profiles.monthly_video_count is 'Videos generated this billing month (resets monthly)';
comment on column public.profiles.signup_ip is 'IP address at signup (for abuse prevention on free tier)';

-- Reset monthly_video_count for existing users (they start fresh)
update public.profiles set monthly_video_count = 0 where monthly_video_count is null;

-- Ensure RLS policy allows users to read their own plan
-- (existing "own profile" policy already covers this since it's on the profiles table)