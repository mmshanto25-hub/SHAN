alter table public.chat_messages
  drop constraint if exists chat_messages_content_check;

alter table public.chat_messages
  add constraint chat_messages_content_check
  check (char_length(content) between 1 and 10000);

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
  if char_length(v_content) not between 1 and 10000 then
    raise exception 'Message must contain between 1 and 10000 characters.' using errcode = '22023';
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
