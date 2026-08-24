-- AtlasDesk — esquema do banco de dados (Supabase / PostgreSQL)
-- -----------------------------------------------------------------
-- Como usar: no painel do Supabase, vá em "SQL Editor" → "New query",
-- cole este arquivo inteiro e clique em "Run". Só precisa rodar uma vez.
--
-- Este esquema substitui o antigo server/data.json por um banco de
-- dados de verdade. Os usuários são autenticados pelo Supabase Auth
-- (tabela auth.users, gerenciada pelo Supabase) — aqui criamos só uma
-- tabela "profiles" com os dados extras que o chat precisa (nome,
-- cor do avatar, status online).

-- Extensão usada para gerar ids aleatórios curtos nas mensagens/canais.
create extension if not exists pgcrypto;

-- ------------------------------------------------------------------
-- Perfis (um por usuário autenticado no Supabase Auth)
-- ------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  avatar_color text not null default '#2563eb',
  online boolean not null default false,
  last_seen timestamptz not null default now()
);

-- Cria o perfil automaticamente quando alguém se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  palette text[] := array['#2563eb', '#059669', '#d946ef', '#ea580c', '#dc2626', '#0891b2'];
begin
  insert into public.profiles (id, name, avatar_color)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    palette[1 + (abs(hashtext(new.id::text)) % array_length(palette, 1))]
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------------
-- Canais
-- ------------------------------------------------------------------
create table if not exists public.channels (
  id text primary key,
  name text not null,
  is_private boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.channel_members (
  channel_id text not null references public.channels (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  primary key (channel_id, user_id)
);

insert into public.channels (id, name, is_private)
values ('geral', 'geral', false), ('comunicados', 'comunicados', false)
on conflict (id) do nothing;

-- ------------------------------------------------------------------
-- Conversas diretas (DMs)
-- ------------------------------------------------------------------
create table if not exists public.dms (
  id text primary key, -- par de ids de usuário ordenado, ex: "uuid1__uuid2"
  user_a uuid not null references public.profiles (id) on delete cascade,
  user_b uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------
-- Mensagens (canais, DMs e respostas em thread)
-- ------------------------------------------------------------------
create table if not exists public.messages (
  id text primary key default encode(gen_random_bytes(9), 'base64'),
  room_id text not null,
  room_type text not null check (room_type in ('channel', 'dm')),
  author_id uuid not null references public.profiles (id) on delete cascade,
  text text not null default '',
  file_url text,
  file_name text,
  file_type text,
  parent_id text references public.messages (id) on delete cascade,
  mentions uuid[] not null default '{}',
  reply_count integer not null default 0,
  last_reply_at timestamptz,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  reactions jsonb not null default '{}'::jsonb,
  read_by uuid[] not null default '{}'
);

create index if not exists messages_room_idx on public.messages (room_type, room_id, created_at);
create index if not exists messages_parent_idx on public.messages (parent_id);
create index if not exists messages_text_search_idx on public.messages using gin (to_tsvector('portuguese', text));

-- ------------------------------------------------------------------
-- Segurança (RLS)
-- ------------------------------------------------------------------
-- O servidor de chat acessa o banco com a "service role key" (secreta,
-- só no servidor), que ignora o RLS por padrão — por isso as políticas
-- abaixo são a rede de segurança caso algo um dia acesse o banco direto
-- do navegador com a chave pública ("anon key").

alter table public.profiles enable row level security;
alter table public.channels enable row level security;
alter table public.channel_members enable row level security;
alter table public.dms enable row level security;
alter table public.messages enable row level security;

create policy "Perfis são visíveis para usuários autenticados"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Canais são visíveis para usuários autenticados"
  on public.channels for select
  using (auth.role() = 'authenticated');

create policy "Participantes de uma DM podem vê-la"
  on public.dms for select
  using (auth.uid() = user_a or auth.uid() = user_b);

create policy "Mensagens visíveis para usuários autenticados"
  on public.messages for select
  using (auth.role() = 'authenticated');
