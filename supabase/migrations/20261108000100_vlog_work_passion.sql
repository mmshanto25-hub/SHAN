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

-- Explicit Table Grants for Roles
grant select on public.vlog_posts to anon, authenticated;
grant select on public.work_projects to anon, authenticated;
grant select on public.passion_items to anon, authenticated;

grant insert, update, delete on public.vlog_posts to authenticated;
grant insert, update, delete on public.work_projects to authenticated;
grant insert, update, delete on public.passion_items to authenticated;

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

-- Admin full management policies (SELECT, INSERT, UPDATE, DELETE)
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

-- Seed default initial passion items if table is empty
insert into public.passion_items (title, category, description, media_url, thumbnail_url, location, gear_info, display_order, is_visible)
select
  'Golden Hour at the Old Riverbank',
  'photography',
  'Capturing the serenity of twilight reflections across still water and silhouetted fishermen boats.',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'Cox’s Bazar & Kuakata',
  'Sony A7 IV · 24-70mm f/2.8 GM · ISO 100',
  0,
  true
where not exists (select 1 from public.passion_items limit 1);

insert into public.passion_items (title, category, description, media_url, thumbnail_url, location, gear_info, display_order, is_visible)
select
  'Neon Noir: Dhaka City Nights',
  'cinematography',
  'Short cinematic mood film capturing rain-slicked asphalt, vibrant neon storefronts, and late-night rickshaw trails.',
  'https://www.youtube.com/watch?v=ScMzIvxBSi4',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
  'Dhaka City Nightscape',
  'Sony FX3 · Sirui 50mm Anamorphic · Cine D-Log',
  1,
  true
where not exists (select 1 from public.passion_items offset 1 limit 1);

insert into public.passion_items (title, category, description, media_url, thumbnail_url, location, gear_info, display_order, is_visible)
select
  'Monochrome Street Perspectives',
  'photography',
  'High-contrast black-and-white candid portraiture celebrating urban geometry, architecture, and raw human emotions.',
  'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80',
  'Old Town Heritage',
  'Fujifilm X-T5 · 35mm f/1.4 · Acros Film Simulation',
  2,
  true
where not exists (select 1 from public.passion_items offset 2 limit 1);

-- Seed default work projects if empty
insert into public.work_projects (title, category, description, tags, image_url, live_url, repo_url, display_order, is_visible)
select
  'PulsePay: Mobile Banking & Crypto Wallet',
  'App Development',
  'Next-gen cross-platform mobile application featuring biometric security, instant peer-to-peer microtransactions, and real-time crypto asset analytics.',
  array['React Native', 'TypeScript', 'Node.js', 'Tailwind', 'WebSockets'],
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80',
  'https://example.com/pulsepay',
  'https://github.com/mmshanto25-hub',
  0,
  true
where not exists (select 1 from public.work_projects limit 1);

insert into public.work_projects (title, category, description, tags, image_url, live_url, repo_url, display_order, is_visible)
select
  'OmniStudio: Enterprise SaaS Design System',
  'Web Development',
  'Comprehensive high-converting dashboard with multi-tenant collaboration, automated cloud deployments, dynamic theming, and Supabase RLS security.',
  array['Next.js', 'React', 'TailwindCSS', 'Supabase', 'PostgreSQL'],
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
  'https://example.com/omnistudio',
  'https://github.com/mmshanto25-hub',
  1,
  true
where not exists (select 1 from public.work_projects offset 1 limit 1);

insert into public.work_projects (title, category, description, tags, image_url, live_url, repo_url, display_order, is_visible)
select
  'NeuroCanvas: AI Generative Image Studio',
  'AI & Image Editing',
  'Automated creative studio tool providing instant AI background replacement, neural face enhancement, depth-of-field synthesis, and batch image export.',
  array['Python', 'FastAPI', 'PyTorch', 'React', 'Canvas API'],
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80',
  'https://example.com/neurocanvas',
  'https://github.com/mmshanto25-hub',
  2,
  true
where not exists (select 1 from public.work_projects offset 2 limit 1);
