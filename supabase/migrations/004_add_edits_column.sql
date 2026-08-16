-- Add an `edits` jsonb column to videos for storing post-generation
-- editor changes (clip swaps, caption style, music, volume) ahead of
-- a re-render, without disturbing the `settings` column.
-- Already applied by hand in the Supabase SQL editor (production) on
-- 2026-08-16. This file exists only as a record of what was run.
--
-- Run in the Supabase SQL editor (or supabase db push) if replaying
-- on a fresh environment.

alter table public.videos add column if not exists edits jsonb not null default '{}'::jsonb;
