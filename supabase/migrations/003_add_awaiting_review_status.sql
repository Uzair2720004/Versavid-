-- Add 'awaiting_review' to the video_status enum.
-- Already applied by hand in the Supabase SQL editor (production) on
-- 2026-08-15. This file exists only as a record of what was run, per
-- this repo's existing migration convention (001, 002).
--
-- Run in the Supabase SQL editor (or supabase db push) if replaying
-- on a fresh environment.

alter type video_status add value 'awaiting_review';