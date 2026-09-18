# Diário Lúdico da Realidade Paralela

Livro de poesia digital e interativo, construído com Next.js 14 (App Router),
TypeScript, Tailwind CSS, Three.js (via `@react-three/fiber`), Framer Motion e
Howler.js.

## Estrutura

- `app/page.tsx` — capa, com preloader e partículas douradas orbitando o retrato do autor
- `app/hub/page.tsx` — grade com os três poemas (cards com física de repulsão ao mouse)
- `app/poema/[slug]/page.tsx` — experiência de cada poema
- `components/poema/scenes/Scene1.tsx` / `Scene2.tsx` / `Scene3.tsx` — cenas 3D exclusivas de cada poema
- `components/poema/PoemaExperience.tsx` — orquestra cena 3D, imagem em marca d'água, estrofes, objetos interativos, áudio e tela final
- `lib/poemas.ts` — conteúdo dos três poemas (títulos, estrofes, objetos interativos)
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

O projeto está pronto para deploy na Vercel (basta conectar o repositório
GitHub `Bella Inversion/Diario ludico` e configurar as duas variáveis de
ambiente acima no painel do projeto).

## Assets

Os arquivos de áudio e imagem ficam em `public/assets/` (`audio/` e
`images/`), extraídos do protótipo original em HTML.
