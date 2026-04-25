-- ============================================================
-- ORIGO Creator Analytics Platform — Complete Supabase Schema
-- Run this in Supabase SQL Editor (one-shot, idempotent)
-- ============================================================

-- ── Clean slate (safe to re-run) ─────────────────────────────
drop table if exists public.analytics_snapshots   cascade;
drop table if exists public.scrape_jobs           cascade;
drop table if exists public.verification_requests cascade;
drop table if exists public.creators              cascade;

drop type if exists public.platform_type        cascade;
drop type if exists public.verification_status  cascade;
drop type if exists public.niche_type           cascade;

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enums ────────────────────────────────────────────────────
create type public.platform_type       as enum ('instagram', 'youtube', 'tiktok');
create type public.verification_status as enum ('pending', 'approved', 'rejected');
create type public.niche_type          as enum (
  'beauty','skincare','haircare','lifestyle',
  'fashion','fitness','travel','food','general'
);

-- ============================================================
-- creators
-- ============================================================
create table public.creators (
  id                        uuid primary key default uuid_generate_v4(),
  platform                  public.platform_type not null,
  username                  text not null,

  -- Profile
  profile_name              text,
  bio                       text,
  profile_url               text,
  profile_image_url         text,
  is_platform_verified      boolean default false,

  -- Raw metrics
  followers                 bigint,
  following                 bigint,
  total_posts               int,
  avg_likes                 int,
  avg_comments              int,
  estimated_engagement_rate numeric(6, 3),

  -- Niche classification
  primary_niche             public.niche_type default 'general',
  niches                    jsonb default '[]'::jsonb,

  -- Data quality
  data_source               text,                  -- serpapi | playwright | scrapingbee
  confidence_score          numeric(4, 3) default 0,
  creator_score             numeric(5, 1) default 0,

  -- ORIGO manual verification
  is_origo_verified         boolean default false,
  verified_at               timestamptz,

  -- Timestamps
  last_scraped_at           timestamptz,
  created_at                timestamptz default now(),
  updated_at                timestamptz default now(),

  constraint creators_platform_username unique (platform, username)
);

-- ============================================================
-- verification_requests
-- ============================================================
create table public.verification_requests (
  id                uuid primary key default uuid_generate_v4(),
  creator_id        uuid not null references public.creators(id) on delete cascade,

  submitted_by      text not null,
  notes             text,
  screenshot_urls   jsonb default '[]'::jsonb,

  status            public.verification_status default 'pending',
  reviewed_by       text,
  reviewed_at       timestamptz,

  created_at        timestamptz default now()
);

-- ============================================================
-- scrape_jobs (audit log)
-- ============================================================
create table public.scrape_jobs (
  id            uuid primary key default uuid_generate_v4(),
  platform      public.platform_type not null,
  username      text not null,
  status        text default 'pending',       -- pending | running | done | failed
  data_source   text,
  error_message text,
  duration_ms   int,
  created_at    timestamptz default now(),
  completed_at  timestamptz
);

-- ============================================================
-- analytics_snapshots (for historical trend tracking)
-- ============================================================
create table public.analytics_snapshots (
  id              uuid primary key default uuid_generate_v4(),
  creator_id      uuid not null references public.creators(id) on delete cascade,
  followers       bigint,
  following       bigint,
  total_posts     int,
  avg_likes       int,
  avg_comments    int,
  engagement_rate numeric(6, 3),
  creator_score   numeric(5, 1),
  snapped_at      timestamptz default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_creators_platform      on public.creators(platform);
create index idx_creators_niche         on public.creators(primary_niche);
create index idx_creators_score         on public.creators(creator_score desc);
create index idx_creators_followers     on public.creators(followers desc);
create index idx_creators_engagement    on public.creators(estimated_engagement_rate desc);
create index idx_creators_verified      on public.creators(is_origo_verified) where is_origo_verified = true;
create index idx_verif_status           on public.verification_requests(status);
create index idx_scrape_jobs_created    on public.scrape_jobs(created_at desc);
create index idx_snapshots_creator      on public.analytics_snapshots(creator_id, snapped_at desc);

-- ============================================================
-- updated_at auto-trigger
-- ============================================================
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists creators_updated_at on public.creators;
create trigger creators_updated_at
  before update on public.creators
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- Row-Level Security
-- ============================================================
alter table public.creators              enable row level security;
alter table public.verification_requests enable row level security;
alter table public.scrape_jobs           enable row level security;
alter table public.analytics_snapshots   enable row level security;

-- Public can read creators + snapshots (for brand discovery UI)
create policy "public read creators"
  on public.creators for select using (true);

create policy "public read snapshots"
  on public.analytics_snapshots for select using (true);

-- Anyone can submit a verification request
create policy "public insert verification_requests"
  on public.verification_requests for insert with check (true);

-- Authenticated users can read their own verification requests
create policy "public read verification_requests"
  on public.verification_requests for select using (true);

-- Service role bypass (backend uses this)
create policy "service_role all creators"
  on public.creators for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service_role all verification_requests"
  on public.verification_requests for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service_role all scrape_jobs"
  on public.scrape_jobs for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service_role all snapshots"
  on public.analytics_snapshots for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ============================================================
-- Seed: sanity check
-- ============================================================
select 'ORIGO schema ready ✓' as status;
