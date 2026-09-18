-- Diário Lúdico da Realidade Paralela
-- Estrutura para registrar visitas e comentários dos leitores.
-- Rode este arquivo no SQL Editor do projeto Supabase "Diario ludico".

create table if not exists visitas (
  id uuid primary key default gen_random_uuid(),
  poema_slug text not null,
  created_at timestamptz not null default now()
);

create table if not exists comentarios (
  id uuid primary key default gen_random_uuid(),
  poema_slug text not null,
  nome text not null check (char_length(nome) between 1 and 60),
  mensagem text not null check (char_length(mensagem) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table visitas enable row level security;
alter table comentarios enable row level security;

-- Qualquer visitante pode registrar uma visita ou comentário (inserção anônima).
create policy "permitir insercao de visitas" on visitas
  for insert to anon with check (true);

create policy "permitir leitura de comentarios" on comentarios
  for select to anon using (true);

create policy "permitir insercao de comentarios" on comentarios
  for insert to anon with check (true);
