# Diário Lúdico da Realidade Paralela

Livro de poesia digital e interativo, construído com Next.js 14 (App Router),
TypeScript, Tailwind CSS, Three.js (via `@react-three/fiber`) e Framer Motion.

## Estrutura

- `app/page.tsx` — capa, com preloader e partículas douradas orbitando o retrato do autor
- `app/hub/page.tsx` — grade com os poemas (cards com física de repulsão ao mouse)
- `app/poema/[slug]/page.tsx` — experiência de cada poema
- `components/poema/scenes/Scene1.tsx` / `Scene2.tsx` / `Scene3.tsx` — cenas 3D de fundo (aurora/brasas, outono/água/fios, cósmico/lua/poeira), reaproveitadas entre poemas via o campo `cena` de cada um
- `components/poema/PoemaExperience.tsx` — orquestra cena 3D, imagem em marca d'água e estrofes reveladas ao rolar a página (modo scroll)
- `lib/poemas.ts` — conteúdo de todos os poemas (títulos, estrofes, cena de fundo)
- `lib/supabase.ts` — cliente Supabase opcional para registrar visitas e comentários

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Variáveis de ambiente (Supabase)

Copie `.env.local.example` para `.env.local` e preencha a chave anônima do
projeto Supabase "Diario ludico":

```
NEXT_PUBLIC_SUPABASE_URL=https://glwogfuzolidawvdfgsx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave anon do projeto>
```

Sem essas variáveis o site funciona normalmente — apenas o registro de
visitas/comentários fica desativado.

Rode `supabase/schema.sql` no SQL Editor do projeto Supabase para criar as
tabelas `visitas` e `comentarios` antes de configurar as variáveis acima.

## Deploy

O projeto está publicado na Vercel, conectado ao repositório GitHub
`zaduski86/diario-ludico` — cada push em `main` dispara um novo deploy.

## Adicionando um novo poema

Edite `lib/poemas.ts`: adicione uma entrada ao array `poemas` com `slug`,
`numero`, `titulo`, `imagem` (arquivo em `public/assets/images/`), `preview`,
`cena` (0, 1 ou 2 — escolha a que combinar com o tema) e `estrofes` (array de
estrofes, cada uma um array de versos).

## Assets

As imagens ficam em `public/assets/images/`.
