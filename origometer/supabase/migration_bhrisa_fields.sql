-- Adds bhrisa-style post-type breakdown columns
-- Run this in Supabase SQL Editor after the initial schema.sql

alter table public.creators
  add column if not exists image_avg_likes       int,
  add column if not exists image_avg_comments    int,
  add column if not exists image_engagement_rate numeric(6,3),
  add column if not exists image_estimated_reach int,
  add column if not exists reel_avg_likes        int,
  add column if not exists reel_avg_comments     int,
  add column if not exists reel_avg_views        int,
  add column if not exists reel_engagement_rate  numeric(6,3),
  add column if not exists reel_estimated_reach  int;

select 'Bhrisa breakdown columns added ✓' as status;
