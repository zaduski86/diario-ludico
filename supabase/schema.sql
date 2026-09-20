-- Diário Lúdico da Realidade Paralela
-- Estrutura para registrar leitores, visitas, compartilhamentos e
-- comentários. Rode este arquivo (ou só a parte nova, abaixo) no SQL
-- Editor do projeto Supabase "Diario ludico".

create table if not exists leitores (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 1 and 60),
  criado_em timestamptz not null default now(),
  ultima_visita timestamptz not null default now()
);

create table if not exists visitas (
  id uuid primary key default gen_random_uuid(),
  poema_slug text not null,
  leitor_id uuid references leitores(id),
  created_at timestamptz not null default now()
);

-- Se a tabela "visitas" já existia (versão anterior, sem leitor_id):
alter table visitas add column if not exists leitor_id uuid references leitores(id);

create table if not exists compartilhamentos (
  id uuid primary key default gen_random_uuid(),
  poema_slug text not null,
  leitor_id uuid references leitores(id),
  tipo text not null check (tipo in ('link', 'cartao')),
  created_at timestamptz not null default now()
);

create table if not exists comentarios (
  id uuid primary key default gen_random_uuid(),
  poema_slug text not null,
  nome text not null check (char_length(nome) between 1 and 60),
  mensagem text not null check (char_length(mensagem) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table leitores enable row level security;
alter table visitas enable row level security;
alter table compartilhamentos enable row level security;
alter table comentarios enable row level security;

-- Leitores: qualquer visitante pode se cadastrar e atualizar seu próprio
-- registro (identificado pelo id salvo no navegador, não há senha).
drop policy if exists "permitir insercao de leitores" on leitores;
create policy "permitir insercao de leitores" on leitores
  for insert to anon with check (true);
drop policy if exists "permitir leitura de leitores" on leitores;
create policy "permitir leitura de leitores" on leitores
  for select to anon using (true);
drop policy if exists "permitir atualizacao de leitores" on leitores;
create policy "permitir atualizacao de leitores" on leitores
  for update to anon using (true) with check (true);

-- Visitas e compartilhamentos: inserção anônima livre (analytics).
drop policy if exists "permitir insercao de visitas" on visitas;
create policy "permitir insercao de visitas" on visitas
  for insert to anon with check (true);
drop policy if exists "permitir insercao de compartilhamentos" on compartilhamentos;
create policy "permitir insercao de compartilhamentos" on compartilhamentos
  for insert to anon with check (true);

-- Comentários: públicos para leitura, qualquer um pode comentar.
drop policy if exists "permitir leitura de comentarios" on comentarios;
create policy "permitir leitura de comentarios" on comentarios
  for select to anon using (true);
drop policy if exists "permitir insercao de comentarios" on comentarios;
create policy "permitir insercao de comentarios" on comentarios
  for insert to anon with check (true);
