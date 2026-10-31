create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_token uuid not null unique,
  visitor_name text not null default '' check (char_length(visitor_name) <= 120),
  visitor_email text not null default '' check (char_length(visitor_email) <= 320),
  unread_by_admin boolean not null default false,
  unread_by_visitor boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender text not null check (sender in ('visitor', 'admin')),
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists chat_conversations_updated_at_idx
  on public.chat_conversations (updated_at desc);

create index if not exists chat_messages_conversation_created_at_idx
  on public.chat_messages (conversation_id, created_at);

alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

grant select, update on public.chat_conversations to authenticated;
grant select, insert, update, delete on public.chat_messages to authenticated;

drop policy if exists "Admins manage chat conversations" on public.chat_conversations;
create policy "Admins manage chat conversations"
  on public.chat_conversations for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

drop policy if exists "Admins manage chat messages" on public.chat_messages;
create policy "Admins manage chat messages"
  on public.chat_messages for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (
    public.is_portfolio_admin()
    and sender = 'admin'
  );

create or replace function public.update_chat_conversation_after_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.chat_conversations
  set updated_at = new.created_at,
      unread_by_admin = (new.sender = 'visitor'),
      unread_by_visitor = (new.sender = 'admin')
  where id = new.conversation_id;

  return new;
end;
$$;

drop trigger if exists chat_message_updates_conversation on public.chat_messages;
create trigger chat_message_updates_conversation
  after insert on public.chat_messages
  for each row execute function public.update_chat_conversation_after_message();

create or replace function public.get_visitor_chat(
  p_visitor_token uuid,
  p_mark_read boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_conversation public.chat_conversations%rowtype;
  v_messages jsonb;
begin
  select * into v_conversation
  from public.chat_conversations
  where visitor_token = p_visitor_token;

  if not found then
    return jsonb_build_object('conversation', null, 'messages', '[]'::jsonb);
  end if;

  if p_mark_read then
    update public.chat_conversations
    set unread_by_visitor = false
    where id = v_conversation.id;
    v_conversation.unread_by_visitor := false;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', m.id,
        'conversationId', m.conversation_id,
        'sender', m.sender,
        'content', m.content,
        'createdAt', m.created_at
      ) order by m.created_at, m.id
    ),
    '[]'::jsonb
  )
  into v_messages
  from public.chat_messages as m
  where m.conversation_id = v_conversation.id;

  return jsonb_build_object(
    'conversation',
    jsonb_build_object(
      'id', v_conversation.id,
      'visitorName', v_conversation.visitor_name,
      'visitorEmail', v_conversation.visitor_email,
      'unreadByAdmin', v_conversation.unread_by_admin,
      'unreadByVisitor', v_conversation.unread_by_visitor,
      'isArchived', v_conversation.is_archived,
      'createdAt', v_conversation.created_at,
      'lastMessageAt', v_conversation.updated_at
    ),
    'messages', v_messages
  );
end;
$$;

create or replace function public.send_visitor_chat_message(
  p_visitor_token uuid,
  p_content text,
  p_name text default '',
  p_email text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_conversation public.chat_conversations%rowtype;
  v_message public.chat_messages%rowtype;
  v_content text := btrim(coalesce(p_content, ''));
  v_name text := btrim(coalesce(p_name, ''));
  v_email text := btrim(coalesce(p_email, ''));
begin
  if p_visitor_token is null then
    raise exception 'A valid visitor token is required.' using errcode = '22023';
  end if;
  if char_length(v_content) not between 1 and 2000 then
    raise exception 'Message must contain between 1 and 2000 characters.' using errcode = '22023';
  end if;
  if char_length(v_name) > 120 or char_length(v_email) > 320 then
    raise exception 'Name or email is too long.' using errcode = '22023';
  end if;

  insert into public.chat_conversations (visitor_token, visitor_name, visitor_email)
  values (p_visitor_token, v_name, v_email)
  on conflict (visitor_token) do update
  set visitor_name = case when excluded.visitor_name = '' then public.chat_conversations.visitor_name else excluded.visitor_name end,
      visitor_email = case when excluded.visitor_email = '' then public.chat_conversations.visitor_email else excluded.visitor_email end,
      is_archived = false
  returning * into v_conversation;

  insert into public.chat_messages (conversation_id, sender, content)
  values (v_conversation.id, 'visitor', v_content)
  returning * into v_message;

  return jsonb_build_object(
    'message',
    jsonb_build_object(
      'id', v_message.id,
      'conversationId', v_message.conversation_id,
      'sender', v_message.sender,
      'content', v_message.content,
      'createdAt', v_message.created_at
    )
  );
end;
$$;

revoke all on function public.get_visitor_chat(uuid, boolean) from public;
revoke all on function public.send_visitor_chat_message(uuid, text, text, text) from public;
grant execute on function public.get_visitor_chat(uuid, boolean) to anon, authenticated;
grant execute on function public.send_visitor_chat_message(uuid, text, text, text) to anon, authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.chat_conversations, public.chat_messages;
  end if;
exception
  when duplicate_object then null;
end;
$$;
