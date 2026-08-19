-- Run this file in the Supabase SQL Editor after creating a project.
-- Every application table is owned by auth.users and protected with RLS.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  age text not null default '',
  height text not null default '',
  weight text not null default '',
  gender text not null default 'other',
  goal text not null default 'maintenance',
  activity text not null default 'moderate',
  units text not null default 'metric',
  experience text not null default 'beginner',
  equipment text not null default '',
  schedule text not null default '',
  dietary_preferences text not null default 'none',
  injuries text not null default 'none',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.progress_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  weight text not null default '',
  workouts text not null default '0',
  water text not null default '',
  sleep text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.saved_plans enable row level security;
alter table public.progress_entries enable row level security;

create policy "Users manage their own profile"
  on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage their own saved plans"
  on public.saved_plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own progress"
  on public.progress_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
