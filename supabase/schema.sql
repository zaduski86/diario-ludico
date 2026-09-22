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

create table if not exists leituras_completas (
  id uuid primary key default gen_random_uuid(),
  leitor_id uuid not null references leitores(id) on delete cascade,
  poema_slug text not null,
  created_at timestamptz not null default now(),
  unique (leitor_id, poema_slug)
);

create table if not exists sussurros (
  id uuid primary key default gen_random_uuid(),
  leitor_id uuid references leitores(id) on delete set null,
  nome text not null check (char_length(nome) between 1 and 60),
  mensagem text not null check (char_length(mensagem) between 1 and 300),
  created_at timestamptz not null default now()
);

alter table leitores enable row level security;
alter table visitas enable row level security;
alter table compartilhamentos enable row level security;
alter table comentarios enable row level security;
alter table leituras_completas enable row level security;
alter table sussurros enable row level security;

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

-- Leituras completas: marca silenciosamente quando um leitor termina um
-- poema (usado para liberar os sussurros). Leitura própria, sem exposição
-- pública da lista inteira.
drop policy if exists "permitir insercao de leituras completas" on leituras_completas;
create policy "permitir insercao de leituras completas" on leituras_completas
  for insert to anon with check (true);
drop policy if exists "permitir leitura de leituras completas" on leituras_completas;
create policy "permitir leitura de leituras completas" on leituras_completas
  for select to anon using (true);

-- Sussurros: só quem já leu tudo pode deixar (checado no app), mas a
-- leitura é pública — são pistas para qualquer visitante desbloquear.
drop policy if exists "permitir leitura de sussurros" on sussurros;
create policy "permitir leitura de sussurros" on sussurros
  for select to anon using (true);
drop policy if exists "permitir insercao de sussurros" on sussurros;
create policy "permitir insercao de sussurros" on sussurros
  for insert to anon with check (true);
