-- =============================================
-- WaitBoost Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES (extends auth.users)
-- =============================================
create table public.profiles (
  id            uuid not null references auth.users(id) on delete cascade primary key,
  email         text not null,
  full_name     text,
  avatar_url    text,
  stripe_customer_id      text unique,
  stripe_subscription_id  text,
  plan          text not null default 'free',  -- 'free' | 'pro'
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================
-- PROJECTS (waitlist campaigns)
-- =============================================
create table public.projects (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid not null references public.profiles(id) on delete cascade,
  name          text not null,
  slug          text not null unique,
  headline      text not null,
  subheadline   text,
  cta_text      text not null default 'Join the Waitlist',
  accent_color  text not null default '#6366f1',
  bg_color      text not null default '#0f0f1a',
  logo_url      text,
  -- milestones: [{count: 100, reward: "Early access"}, ...]
  milestones    jsonb not null default '[]'::jsonb,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================
-- WAITLIST ENTRIES
-- =============================================
create table public.waitlist_entries (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid not null references public.projects(id) on delete cascade,
  email           text not null,
  name            text,
  referral_code   text not null unique,
  referred_by_id  uuid references public.waitlist_entries(id) on delete set null,
  referral_count  integer not null default 0,
  position        integer not null,
  created_at      timestamptz not null default now(),
  constraint unique_project_email unique (project_id, email)
);

-- =============================================
-- INDEXES
-- =============================================
create index idx_projects_owner_id        on public.projects(owner_id);
create index idx_projects_slug            on public.projects(slug);
create index idx_entries_project_id       on public.waitlist_entries(project_id);
create index idx_entries_referral_code    on public.waitlist_entries(referral_code);
create index idx_entries_referred_by_id   on public.waitlist_entries(referred_by_id);
create index idx_entries_referral_count   on public.waitlist_entries(project_id, referral_count desc);
create index idx_entries_position         on public.waitlist_entries(project_id, position);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.profiles        enable row level security;
alter table public.projects        enable row level security;
alter table public.waitlist_entries enable row level security;

-- Profiles: users manage only their own
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Projects: owners manage their own; anyone can read active projects
create policy "projects_owner_all" on public.projects
  for all using (auth.uid() = owner_id);

create policy "projects_public_read" on public.projects
  for select using (is_active = true);

-- Waitlist entries: owners see all their entries; public can insert and read (for leaderboard)
create policy "entries_owner_select" on public.waitlist_entries
  for select using (
    exists (
      select 1 from public.projects
      where projects.id = waitlist_entries.project_id
        and projects.owner_id = auth.uid()
    )
  );

create policy "entries_public_insert" on public.waitlist_entries
  for insert with check (true);

create policy "entries_public_select" on public.waitlist_entries
  for select using (true);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Get next position for a project
create or replace function public.get_next_position(p_project_id uuid)
returns integer language plpgsql security definer as $$
declare
  next_pos integer;
begin
  select coalesce(max(position), 0) + 1
    into next_pos
    from public.waitlist_entries
   where project_id = p_project_id;
  return next_pos;
end;
$$;

-- Increment referral count (called server-side via service role)
create or replace function public.increment_referral_count(entry_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.waitlist_entries
     set referral_count = referral_count + 1
   where id = entry_id;
end;
$$;
