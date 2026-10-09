"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCapitulo, romano } from "@/lib/arelah";
import { getPoemaBySlug } from "@/lib/poemas";
import { getSupabase, listarTodosComentarios, type Comentario } from "@/lib/supabase";
import {
  apagarComentarioAdmin,
  isAdminSessao,
  loginAdmin,
  logoutAdmin,
} from "./useAdmin";

const CHAVE_ULTIMA_VISITA = "diario-ludico:admin-ultima-visita";

type Grupo = {
  slug: string;
  rotulo: string;
  href: string;
  /** Posição para ordenar os filtros: prefácio e capítulos primeiro, depois poemas. */
  ordem: number;
};

function descreverGrupo(slug: string): Grupo {
  const livro = slug.match(/^arelah-(\d+)$/);
  if (livro) {
    const n = Number(livro[1]);
    const capitulo = getCapitulo(n);
    const rotulo =
      n === 0
        ? "Livro · Prefácio"
        : `Livro · Capítulo ${romano(n)}${capitulo ? ` — ${capitulo.subtitulo}` : ""}`;
    return { slug, rotulo, href: `/arelah/${n}`, ordem: n };
  }
  const poema = getPoemaBySlug(slug);
  if (poema) {
    return {
      slug,
      rotulo: `Poema ${poema.numero} — ${poema.titulo}`,
      href: `/poema/${slug}`,
      ordem: 1000,
    };
  }
  return { slug, rotulo: slug, href: "/hub", ordem: 2000 };
}

function dataCompleta(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function lerUltimaVisita(): number {
  try {
    const bruto = window.localStorage.getItem(CHAVE_ULTIMA_VISITA);
    return bruto ? Number(bruto) || 0 : 0;
  } catch {
    return 0;
  }
}

function gravarUltimaVisita(): void {
  try {
    window.localStorage.setItem(CHAVE_ULTIMA_VISITA, String(Date.now()));
  } catch {
    // localStorage indisponível: os destaques de "novo" simplesmente não persistem.
  }
}

const estiloBotao =
  "border border-[rgba(200,160,48,0.4)] px-5 py-2 text-[10px] uppercase tracking-[3px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a] disabled:opacity-30";

export default function AdminComentarios() {
  const [pronto, setPronto] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);

  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [indisponivel, setIndisponivel] = useState(false);
  const [ultimaVisita, setUltimaVisita] = useState(0);
  const [filtro, setFiltro] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [apagando, setApagando] = useState<string | null>(null);
  const [erroApagar, setErroApagar] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!getSupabase()) {
      setIndisponivel(true);
      return;
    }
    setCarregando(true);
    setComentarios(await listarTodosComentarios());
    setCarregando(false);
  }, []);

  useEffect(() => {
    setAutenticado(isAdminSessao());
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!autenticado) return;
    setUltimaVisita(lerUltimaVisita());
    // Os destaques de "novo" usam a visita anterior; a atual vira a referência da próxima.
    gravarUltimaVisita();
    carregar();
  }, [autenticado, carregar]);

  async function entrar() {
    if (!senha.trim() || entrando) return;
    setEntrando(true);
    setErroLogin(null);
    const ok = await loginAdmin(senha);
    setEntrando(false);
    if (!ok) {
      setErroLogin("Senha incorreta, ou o administrador não está configurado.");
      return;
    }
    setSenha("");
    setAutenticado(true);
  }

  function sair() {
    logoutAdmin();
    setAutenticado(false);
    setComentarios([]);
  }

  async function apagar(id: string) {
    if (confirmando !== id) {
      setConfirmando(id);
      return;
    }
    setApagando(id);
    setErroApagar(null);
    const ok = await apagarComentarioAdmin(id);
    setApagando(null);
    setConfirmando(null);
    if (ok) {
      setComentarios((c) => c.filter((x) => x.id !== id));
    } else {
      setErroApagar("Não foi possível apagar. A senha ainda vale? Tente sair e entrar de novo.");
    }
  }

  const grupos = useMemo(() => {
    const contagem = new Map<string, number>();
    for (const c of comentarios) {
      contagem.set(c.poema_slug, (contagem.get(c.poema_slug) ?? 0) + 1);
    }
    return [...contagem.entries()]
      .map(([slug, total]) => ({ ...descreverGrupo(slug), total }))
      .sort((a, b) => a.ordem - b.ordem || a.rotulo.localeCompare(b.rotulo));
  }, [comentarios]);

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return comentarios.filter((c) => {
      if (filtro !== "todos" && c.poema_slug !== filtro) return false;
      if (!termo) return true;
      return (
        c.nome.toLowerCase().includes(termo) ||
        c.mensagem.toLowerCase().includes(termo)
      );
    });
  }, [comentarios, filtro, busca]);

  const novos = useMemo(
    () =>
      ultimaVisita
        ? comentarios.filter((c) => new Date(c.created_at).getTime() > ultimaVisita)
            .length
        : 0,
    [comentarios, ultimaVisita],
  );

  if (!pronto) return null;

  if (!autenticado) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col justify-center gap-6 px-6 text-center">
        <p className="text-[10px] uppercase tracking-[5px] text-[#c8a030]">
          administração
        </p>
        <h1 className="text-[26px] italic text-[#f0ecff]">Só para quem guarda as chaves</h1>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && entrar()}
          placeholder="senha de administrador"
          autoComplete="current-password"
          className="border-b border-[rgba(200,160,48,0.35)] bg-transparent px-1 py-2 text-center text-sm text-[#f0ecff] placeholder:text-[#8a7fb0] focus:border-[#c8a030] focus:outline-none"
        />
        {erroLogin && <p className="text-[12px] text-[#c85050]">{erroLogin}</p>}
        <button
          onClick={entrar}
          disabled={!senha.trim() || entrando}
          className={estiloBotao}
        >
          {entrando ? "entrando…" : "entrar"}
        </button>
        <a
          href="/hub"
          className="text-[10px] uppercase tracking-[3px] text-[#6a5898] transition-colors hover:text-[#c8a030]"
        >
          ← voltar ao site
        </a>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[860px] px-6 py-14">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(200,160,48,0.25)] pb-6">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[5px] text-[#c8a030]">
            administração
          </p>
          <h1 className="text-[28px] italic text-[#f0ecff]">Comentários dos leitores</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={carregar} disabled={carregando} className={estiloBotao}>
            {carregando ? "atualizando…" : "atualizar"}
          </button>
          <button onClick={sair} className={estiloBotao}>
            sair
          </button>
        </div>
      </header>

      {indisponivel && (
        <p className="mb-8 text-[13px] italic text-[#c85050]">
          O banco de dados não está configurado neste ambiente, então não há como listar os comentários.
        </p>
      )}

      <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="border border-[rgba(200,160,48,0.25)] p-4">
          <p className="text-[28px] italic text-[#f0c84a]">{comentarios.length}</p>
          <p className="text-[10px] uppercase tracking-[3px] text-[#6a5898]">no total</p>
        </div>
        <div className="border border-[rgba(200,160,48,0.25)] p-4">
          <p className="text-[28px] italic text-[#f0c84a]">{novos}</p>
          <p className="text-[10px] uppercase tracking-[3px] text-[#6a5898]">
            novos desde a última visita
          </p>
        </div>
        <div className="col-span-2 border border-[rgba(200,160,48,0.25)] p-4 sm:col-span-1">
          <p className="text-[28px] italic text-[#f0c84a]">{grupos.length}</p>
          <p className="text-[10px] uppercase tracking-[3px] text-[#6a5898]">
            páginas com comentários
          </p>
        </div>
      </section>

      <section className="mb-8 flex flex-col gap-4">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="buscar por nome ou palavra…"
          className="border-b border-[rgba(200,160,48,0.35)] bg-transparent px-1 py-2 text-sm text-[#f0ecff] placeholder:text-[#8a7fb0] focus:border-[#c8a030] focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltro("todos")}
            className={`border px-3 py-1.5 text-[10px] uppercase tracking-[2px] transition-colors ${
              filtro === "todos"
                ? "border-[#c8a030] text-[#f0c84a]"
                : "border-[rgba(200,160,48,0.25)] text-[#8a7fb0] hover:text-[#c8a030]"
            }`}
          >
            todos ({comentarios.length})
          </button>
          {grupos.map((g) => (
            <button
              key={g.slug}
              onClick={() => setFiltro(g.slug)}
              className={`border px-3 py-1.5 text-[10px] uppercase tracking-[2px] transition-colors ${
                filtro === g.slug
                  ? "border-[#c8a030] text-[#f0c84a]"
                  : "border-[rgba(200,160,48,0.25)] text-[#8a7fb0] hover:text-[#c8a030]"
              }`}
            >
              {g.rotulo} ({g.total})
            </button>
          ))}
        </div>
      </section>

      {erroApagar && <p className="mb-6 text-[12px] text-[#c85050]">{erroApagar}</p>}

      <section className="flex flex-col gap-6">
        {!carregando && visiveis.length === 0 && (
          <p className="py-10 text-center text-[14px] italic text-[#4a3f70]">
            {comentarios.length === 0
              ? "Ainda não há comentários. O silêncio também é uma resposta."
              : "Nenhum comentário com esse filtro."}
          </p>
        )}
        {visiveis.map((c) => {
          const grupo = descreverGrupo(c.poema_slug);
          const novo = ultimaVisita > 0 && new Date(c.created_at).getTime() > ultimaVisita;
          return (
            <article
              key={c.id}
              className="border-l border-[rgba(200,160,48,0.3)] pl-5"
            >
              <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[14px] text-[#c8a030]">{c.nome}</span>
                <span className="text-[11px] text-[#6a5898]">
                  {dataCompleta(c.created_at)}
                </span>
                {novo && (
                  <span className="border border-[#c8a030] px-1.5 py-0.5 text-[9px] uppercase tracking-[2px] text-[#f0c84a]">
                    novo
                  </span>
                )}
                <button
                  onClick={() => apagar(c.id)}
                  disabled={apagando === c.id}
                  className="ml-auto text-[10px] uppercase tracking-[2px] text-[#c85050] transition-colors hover:text-[#e87070] disabled:opacity-40"
                >
                  {apagando === c.id
                    ? "apagando…"
                    : confirmando === c.id
                      ? "confirmar?"
                      : "apagar"}
                </button>
              </div>
              <a
                href={grupo.href}
                className="mb-2 inline-block text-[10px] uppercase tracking-[2px] text-[#8a7fb0] underline-offset-2 transition-colors hover:text-[#c8a030] hover:underline"
              >
                {grupo.rotulo} →
              </a>
              <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#c8c0e0]">
                {c.mensagem}
              </p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
