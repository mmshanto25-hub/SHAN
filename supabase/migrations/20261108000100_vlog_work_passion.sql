-- Migration for Vlog, Work Showcase, and Passion modules
-- Date: 2026-11-08

-- 1. Vlog Posts Table
create table if not exists public.vlog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 200),
  slug text not null default '',
  summary text not null default '',
  content text not null default '',
  post_type text not null default 'article' check (post_type in ('article', 'video', 'gallery')),
  media_url text not null default '',
  thumbnail_url text not null default '',
  tags text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vlog_posts_created_at_idx on public.vlog_posts (created_at desc);

-- 2. Work Projects (Extended Showcase) Table
create table if not exists public.work_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 200),
  category text not null default 'Web Development',
  description text not null default '',
  tags text[] not null default '{}',
  image_url text not null default '',
  live_url text not null default '',
  repo_url text not null default '',
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists work_projects_display_order_idx on public.work_projects (display_order asc);

-- 3. Passion Items (Photography, Cinematography, Visual Arts) Table
create table if not exists public.passion_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 200),
  category text not null default 'photography' check (category in ('photography', 'cinematography', 'visual_art', 'other')),
  description text not null default '',
  media_url text not null default '',
  thumbnail_url text not null default '',
  location text not null default '',
  gear_info text not null default '',
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists passion_items_display_order_idx on public.passion_items (display_order asc);

-- Enable Row Level Security (RLS)
alter table public.vlog_posts enable row level security;
alter table public.work_projects enable row level security;
alter table public.passion_items enable row level security;

-- Public read policies
drop policy if exists "Public read vlog posts" on public.vlog_posts;
create policy "Public read vlog posts"
  on public.vlog_posts for select
  to anon, authenticated
  using (is_published = true or public.is_portfolio_admin());

drop policy if exists "Public read work projects" on public.work_projects;
create policy "Public read work projects"
  on public.work_projects for select
  to anon, authenticated
  using (is_visible = true or public.is_portfolio_admin());

drop policy if exists "Public read passion items" on public.passion_items;
create policy "Public read passion items"
  on public.passion_items for select
  to anon, authenticated
  using (is_visible = true or public.is_portfolio_admin());

-- Admin full management policies
drop policy if exists "Admin manage vlog posts" on public.vlog_posts;
create policy "Admin manage vlog posts"
  on public.vlog_posts for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists "Admin manage work projects" on public.work_projects;
create policy "Admin manage work projects"
  on public.work_projects for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists "Admin manage passion items" on public.passion_items;
create policy "Admin manage passion items"
  on public.passion_items for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());
