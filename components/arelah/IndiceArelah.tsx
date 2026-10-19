"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { capitulos, IMAGEM_CAPA, prefacio, romano, type Capitulo } from "@/lib/arelah";
import {
  getLidos,
  getProgressoCapitulo,
  getRetomada,
  PROGRESSO_MINIMO,
  type UltimaLeitura,
} from "@/lib/arelahProgresso";

type Estado = {
  lidos: number[];
  progressos: Record<number, number>;
  retomada: UltimaLeitura | null;
};

const ESTADO_VAZIO: Estado = { lidos: [], progressos: {}, retomada: null };

const TODOS: Capitulo[] = [prefacio, ...capitulos];

function rotuloNumero(numero: number): string {
  return numero === 0 ? "Prefácio" : `Capítulo ${romano(numero)}`;
}

export default function IndiceArelah() {
  const [estado, setEstado] = useState<Estado>(ESTADO_VAZIO);

  useEffect(() => {
    const progressos: Record<number, number> = {};
    for (const c of TODOS) progressos[c.numero] = getProgressoCapitulo(c.numero);
    setEstado({
      lidos: getLidos(),
      progressos,
      retomada: getRetomada(capitulos.length),
    });
  }, []);

  const { lidos, progressos, retomada } = estado;
  const terminouTudo = capitulos.every((c) => lidos.includes(c.numero));
  const alvoRetomada = retomada ? getCapituloPorNumero(retomada.numero) : null;

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-[760px] px-6 pb-24 pt-16">
      <Link
        href="/hub"
        className="text-[10px] uppercase tracking-[3px] text-[#6a5898] transition-colors hover:text-[#c8a030]"
      >
        ← Diário Lúdico
      </Link>

      <header className="mb-10 mt-10 text-center">
        <p className="mb-2 text-[10px] uppercase tracking-[6px] text-[#c8a030]">
          Magia do Caminho Estelar
        </p>
        <h1 className="text-[clamp(28px,6vw,42px)] italic text-[#f0ecff]">
          O Livro de Arelah
        </h1>
        <p className="mt-3 text-[13px] italic text-[#8a7fb0]">
          Prefácio e {capitulos.length} capítulos
        </p>
      </header>

      <section className="mb-10 flex flex-col items-center gap-3 text-center">
        {retomada && alvoRetomada ? (
          <>
            <Link
              href={`/arelah/${retomada.numero}`}
              className="border border-[rgba(200,160,48,0.6)] px-8 py-3 text-[12px] uppercase tracking-[3px] text-[#f0c84a] transition-colors hover:bg-[rgba(200,160,48,0.1)]"
            >
              continuar de onde parou →
            </Link>
            <p className="text-[13px] italic text-[#8a7fb0]">
              {rotuloNumero(retomada.numero)} · {alvoRetomada.subtitulo}
              {retomada.progresso > PROGRESSO_MINIMO
                ? ` · ${Math.round(retomada.progresso * 100)}%`
                : ""}
            </p>
          </>
        ) : terminouTudo ? (
          <p className="text-[14px] italic text-[#c8c0e0]">
            Você chegou ao fim. Releia o que quiser, ou escreva o que achou nos comentários.
          </p>
        ) : (
          <Link
            href="/arelah/0"
            className="border border-[rgba(200,160,48,0.6)] px-8 py-3 text-[12px] uppercase tracking-[3px] text-[#f0c84a] transition-colors hover:bg-[rgba(200,160,48,0.1)]"
          >
            começar pelo prefácio →
          </Link>
        )}
      </section>

      <ol className="flex flex-col gap-3">
        {TODOS.map((c) => {
          const lido = lidos.includes(c.numero);
          const progresso = progressos[c.numero] ?? 0;
          const emAndamento = !lido && progresso > PROGRESSO_MINIMO;
          const atual = retomada?.numero === c.numero;
          return (
            <li key={c.numero}>
              <Link
                href={`/arelah/${c.numero}`}
                className={`group flex items-center gap-4 border p-3 transition-colors hover:border-[rgba(200,160,48,0.6)] hover:bg-[rgba(200,160,48,0.05)] ${
                  atual
                    ? "border-[rgba(200,160,48,0.55)] bg-[rgba(200,160,48,0.06)]"
                    : "border-[rgba(200,160,48,0.2)]"
                }`}
              >
                <div className="relative h-[52px] w-[92px] shrink-0 overflow-hidden border border-[rgba(200,160,48,0.25)]">
                  <Image
                    src={c.imagem ?? IMAGEM_CAPA}
                    alt=""
                    fill
                    sizes="92px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] uppercase tracking-[3px] text-[#c8a030]">
                    {rotuloNumero(c.numero)}
                  </p>
                  <p className="truncate text-[17px] italic text-[#f0ecff]">
                    {c.subtitulo}
                  </p>
                </div>
                <div className="shrink-0 text-right text-[10px] uppercase tracking-[2px]">
                  {lido ? (
                    <span className="text-[#c8a030]">lido ✓</span>
                  ) : emAndamento ? (
                    <span className="text-[#8a7fb0]">
                      {Math.round(progresso * 100)}%
                    </span>
                  ) : (
                    <span className="text-[#4a3f70]">—</span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </main>
  );
}

function getCapituloPorNumero(numero: number): Capitulo | undefined {
  return TODOS.find((c) => c.numero === numero);
}
