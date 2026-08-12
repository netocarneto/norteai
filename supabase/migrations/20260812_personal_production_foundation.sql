-- NorteAI Pessoal production foundation.
-- PostgreSQL/Supabase schema prepared for User -> Workspace -> Financial Data.
-- No AI, MCP, Open Banking, Google Drive sync, broker sync, Family product, or Freelancer product is implemented here.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('PERSONAL', 'FAMILY', 'FREELANCER', 'BUSINESS')),
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  email text,
  role text not null check (role in ('owner', 'member')),
  ownership_percentage numeric(5,2),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  institution text not null,
  type text not null check (type in ('checking', 'savings', 'cash', 'broker', 'crypto', 'other')),
  balance numeric(14,2) not null default 0,
  currency text not null default 'EUR',
  ownership_type text not null check (ownership_type in ('personal', 'shared')),
  ownership_percentage numeric(5,2) not null default 100 check (ownership_percentage >= 0 and ownership_percentage <= 100),
  source text not null check (source in ('manual', 'csv', 'google_drive', 'open_banking', 'broker_api')),
  color text not null default '#6d28d9',
  icon text not null default 'card',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.account_ownerships (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  member_id uuid not null references public.workspace_members(id) on delete cascade,
  ownership_percentage numeric(5,2) not null check (ownership_percentage >= 0 and ownership_percentage <= 100)
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense', 'transfer', 'investment', 'withdrawal')),
  icon text not null default 'tag',
  color text not null default '#6d28d9'
);

create table if not exists public.category_rules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  merchant_keyword text not null,
  category_id uuid not null references public.categories(id) on delete cascade
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  date date not null,
  description text not null,
  merchant text not null,
  amount numeric(14,2) not null,
  currency text not null default 'EUR',
  type text not null check (type in ('income', 'expense', 'transfer', 'investment', 'withdrawal')),
  category text not null,
  category_id uuid references public.categories(id) on delete set null,
  notes text,
  source text not null check (source in ('manual', 'csv', 'google_drive', 'open_banking', 'broker_api')),
  external_reference text,
  import_batch_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  type text not null check (type in ('real_estate', 'vehicle', 'business', 'valuables', 'other')),
  value numeric(14,2) not null default 0,
  currency text not null default 'EUR',
  ownership_type text not null check (ownership_type in ('personal', 'shared')),
  ownership_percentage numeric(5,2) not null default 100 check (ownership_percentage >= 0 and ownership_percentage <= 100),
  valuation_date date not null default current_date,
  notes text
);

create table if not exists public.liabilities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  type text not null check (type in ('mortgage', 'personal_loan', 'auto_loan', 'credit_card', 'other')),
  balance numeric(14,2) not null default 0,
  monthly_payment numeric(14,2) not null default 0,
  interest_rate numeric(8,4) not null default 0,
  maturity_date date,
  currency text not null default 'EUR'
);

create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  ticker text not null,
  name text not null,
  type text not null check (type in ('ETF', 'Stock', 'Crypto', 'Fund', 'Bond', 'Cash', 'Other')),
  quantity numeric(18,6) not null default 0,
  average_price numeric(14,4) not null default 0,
  current_price numeric(14,4),
  current_value numeric(14,2) not null default 0,
  cost_basis numeric(14,2) not null default 0,
  institution text not null,
  currency text not null default 'EUR',
  source text not null check (source in ('manual', 'csv', 'google_drive', 'open_banking', 'broker_api')),
  updated_at timestamptz not null default now()
);

create table if not exists public.financial_goals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  target_value numeric(14,2) not null default 0,
  current_value numeric(14,2) not null default 0,
  deadline date not null,
  type text not null default 'outros',
  priority text not null default 'Media',
  status text not null default 'Ativo'
);

create table if not exists public.financial_scores (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  score integer not null check (score >= 0 and score <= 100),
  created_at timestamptz not null default now()
);

create table if not exists public.financial_snapshots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  snapshot_date date not null,
  snapshot_type text not null check (snapshot_type in ('INITIAL', 'MONTHLY', 'IMPORT_CORRECTION')),
  month text not null,
  net_worth numeric(14,2) not null default 0,
  liquid_assets numeric(14,2) not null default 0,
  income numeric(14,2) not null default 0,
  expenses numeric(14,2) not null default 0,
  savings_rate numeric(8,2),
  assets numeric(14,2) not null default 0,
  liabilities numeric(14,2) not null default 0,
  investment_value numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.data_sources (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  type text not null check (type in ('manual', 'csv', 'google_drive', 'open_banking', 'broker_api')),
  provider text not null,
  status text not null check (status in ('connected', 'updated', 'needs_update', 'processing', 'error', 'disconnected')),
  last_sync_at timestamptz,
  data_until date,
  created_at timestamptz not null default now(),
  unique (workspace_id, type, provider)
);

create index if not exists workspaces_owner_idx on public.workspaces(owner_id);
create index if not exists workspace_members_user_idx on public.workspace_members(user_id);
create index if not exists accounts_workspace_idx on public.accounts(workspace_id);
create index if not exists transactions_workspace_date_idx on public.transactions(workspace_id, date desc);
create index if not exists transactions_import_ref_idx on public.transactions(workspace_id, external_reference);
create index if not exists investments_workspace_idx on public.investments(workspace_id);
create index if not exists data_sources_workspace_idx on public.data_sources(workspace_id);

create or replace function public.user_can_access_workspace(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  );
$$;

create or replace function public.create_personal_workspace_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  personal_workspace_id uuid;
  display_name text;
begin
  display_name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Utilizador');

  insert into public.profiles (id, email, name)
  values (new.id, new.email, display_name)
  on conflict (id) do update
    set email = excluded.email,
        name = coalesce(public.profiles.name, excluded.name);

  insert into public.workspaces (owner_id, name, type)
  values (new.id, display_name || ' Pessoal', 'PERSONAL')
  returning id into personal_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, name, email, role, ownership_percentage)
  values (personal_workspace_id, new.id, display_name, new.email, 'owner', 100);

  insert into public.data_sources (workspace_id, type, provider, status, last_sync_at, data_until)
  values
    (personal_workspace_id, 'manual', 'Manual', 'updated', now(), current_date),
    (personal_workspace_id, 'csv', 'CSV', 'needs_update', null, null),
    (personal_workspace_id, 'google_drive', 'Google Drive', 'disconnected', null, null),
    (personal_workspace_id, 'open_banking', 'Open Banking', 'disconnected', null, null),
    (personal_workspace_id, 'broker_api', 'Broker API', 'disconnected', null, null);

  insert into public.categories (workspace_id, name, type, icon, color)
  values
    (personal_workspace_id, 'Salario', 'income', 'briefcase', '#10b981'),
    (personal_workspace_id, 'Rendimentos profissionais', 'income', 'building', '#0f766e'),
    (personal_workspace_id, 'Habitacao', 'expense', 'home', '#6366f1'),
    (personal_workspace_id, 'Supermercado', 'expense', 'utensils', '#f59e0b'),
    (personal_workspace_id, 'Restaurantes', 'expense', 'receipt', '#fb7185'),
    (personal_workspace_id, 'Transportes', 'expense', 'car', '#2563eb'),
    (personal_workspace_id, 'Combustivel', 'expense', 'fuel', '#0ea5e9'),
    (personal_workspace_id, 'Saude', 'expense', 'heart', '#ef4444'),
    (personal_workspace_id, 'Subscricoes', 'expense', 'repeat', '#06b6d4'),
    (personal_workspace_id, 'Compras', 'expense', 'bag', '#a855f7'),
    (personal_workspace_id, 'Lazer', 'expense', 'sparkles', '#8b5cf6'),
    (personal_workspace_id, 'ETF', 'investment', 'trending-up', '#6d28d9'),
    (personal_workspace_id, 'Acoes', 'investment', 'line-chart', '#2563eb'),
    (personal_workspace_id, 'Cripto', 'investment', 'bitcoin', '#f59e0b'),
    (personal_workspace_id, 'Outros', 'expense', 'tag', '#94a3b8');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_personal_workspace on auth.users;
create trigger on_auth_user_created_create_personal_workspace
after insert on auth.users
for each row execute function public.create_personal_workspace_for_new_user();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.accounts enable row level security;
alter table public.account_ownerships enable row level security;
alter table public.categories enable row level security;
alter table public.category_rules enable row level security;
alter table public.transactions enable row level security;
alter table public.assets enable row level security;
alter table public.liabilities enable row level security;
alter table public.investments enable row level security;
alter table public.financial_goals enable row level security;
alter table public.financial_scores enable row level security;
alter table public.financial_snapshots enable row level security;
alter table public.data_sources enable row level security;

create policy "profiles_select_own" on public.profiles for select using (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "workspaces_select_member" on public.workspaces for select using (public.user_can_access_workspace(id));
create policy "workspaces_insert_owner" on public.workspaces for insert with check (owner_id = auth.uid());
create policy "workspaces_update_owner" on public.workspaces for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "workspaces_delete_owner" on public.workspaces for delete using (owner_id = auth.uid());

create policy "workspace_members_select_member" on public.workspace_members for select using (public.user_can_access_workspace(workspace_id));
create policy "workspace_members_insert_owner" on public.workspace_members for insert with check (
  exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid())
);
create policy "workspace_members_update_owner" on public.workspace_members for update using (
  exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid())
) with check (
  exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid())
);
create policy "workspace_members_delete_owner" on public.workspace_members for delete using (
  exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid())
);

create policy "accounts_workspace_access" on public.accounts for all using (public.user_can_access_workspace(workspace_id)) with check (public.user_can_access_workspace(workspace_id));
create policy "account_ownerships_workspace_access" on public.account_ownerships for all using (public.user_can_access_workspace(workspace_id)) with check (public.user_can_access_workspace(workspace_id));
create policy "categories_workspace_access" on public.categories for all using (public.user_can_access_workspace(workspace_id)) with check (public.user_can_access_workspace(workspace_id));
create policy "category_rules_workspace_access" on public.category_rules for all using (public.user_can_access_workspace(workspace_id)) with check (public.user_can_access_workspace(workspace_id));
create policy "transactions_workspace_access" on public.transactions for all using (public.user_can_access_workspace(workspace_id)) with check (public.user_can_access_workspace(workspace_id));
create policy "assets_workspace_access" on public.assets for all using (public.user_can_access_workspace(workspace_id)) with check (public.user_can_access_workspace(workspace_id));
create policy "liabilities_workspace_access" on public.liabilities for all using (public.user_can_access_workspace(workspace_id)) with check (public.user_can_access_workspace(workspace_id));
create policy "investments_workspace_access" on public.investments for all using (public.user_can_access_workspace(workspace_id)) with check (public.user_can_access_workspace(workspace_id));
create policy "financial_goals_workspace_access" on public.financial_goals for all using (public.user_can_access_workspace(workspace_id)) with check (public.user_can_access_workspace(workspace_id));
create policy "financial_scores_workspace_access" on public.financial_scores for all using (public.user_can_access_workspace(workspace_id)) with check (public.user_can_access_workspace(workspace_id));
create policy "financial_snapshots_workspace_access" on public.financial_snapshots for all using (public.user_can_access_workspace(workspace_id)) with check (public.user_can_access_workspace(workspace_id));
create policy "data_sources_workspace_access" on public.data_sources for all using (public.user_can_access_workspace(workspace_id)) with check (public.user_can_access_workspace(workspace_id));
