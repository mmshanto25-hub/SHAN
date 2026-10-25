create table if not exists public.portfolio_settings (
  id text primary key default 'main' check (id = 'main'),
  data jsonb not null default '{}'::jsonb,
  section_visibility jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in (
    'stats',
    'about',
    'experience',
    'skillCategories',
    'skills',
    'services',
    'projects',
    'testimonials',
    'socials',
    'contact'
  )),
  parent_id uuid references public.portfolio_items(id) on delete cascade,
  content jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_items_section_order_idx
  on public.portfolio_items (section, display_order);

create table if not exists public.inbox_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null default '' check (char_length(sender_name) <= 120),
  sender_email text not null default '' check (char_length(sender_email) <= 320),
  content text not null check (char_length(content) between 1 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.portfolio_admins enable row level security;

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.portfolio_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

alter table public.portfolio_settings enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.inbox_messages enable row level security;

drop policy if exists "Public can read portfolio settings" on public.portfolio_settings;
create policy "Public can read portfolio settings"
  on public.portfolio_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated admins manage portfolio settings" on public.portfolio_settings;
create policy "Authenticated admins manage portfolio settings"
  on public.portfolio_settings for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists "Public can read visible portfolio items" on public.portfolio_items;
create policy "Public can read visible portfolio items"
  on public.portfolio_items for select
  to anon, authenticated
  using (is_visible = true);

drop policy if exists "Authenticated admins read all portfolio items" on public.portfolio_items;
create policy "Authenticated admins read all portfolio items"
  on public.portfolio_items for select
  to authenticated
  using (public.is_portfolio_admin());

drop policy if exists "Authenticated admins manage portfolio items" on public.portfolio_items;
create policy "Authenticated admins manage portfolio items"
  on public.portfolio_items for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists "Visitors can submit inbox messages" on public.inbox_messages;
create policy "Visitors can submit inbox messages"
  on public.inbox_messages for insert
  to anon, authenticated
  with check (
    char_length(content) between 1 and 5000
    and char_length(sender_name) <= 120
    and char_length(sender_email) <= 320
  );

drop policy if exists "Authenticated admins manage inbox messages" on public.inbox_messages;
create policy "Authenticated admins manage inbox messages"
  on public.inbox_messages for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view portfolio assets" on storage.objects;
create policy "Public can view portfolio assets"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'portfolio-assets');

drop policy if exists "Authenticated admins upload portfolio assets" on storage.objects;
create policy "Authenticated admins upload portfolio assets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());

drop policy if exists "Authenticated admins update portfolio assets" on storage.objects;
create policy "Authenticated admins update portfolio assets"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-assets' and public.is_portfolio_admin())
  with check (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());

drop policy if exists "Authenticated admins delete portfolio assets" on storage.objects;
create policy "Authenticated admins delete portfolio assets"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.portfolio_settings, public.portfolio_items;
  end if;
exception
  when duplicate_object then null;
end;
$$;
