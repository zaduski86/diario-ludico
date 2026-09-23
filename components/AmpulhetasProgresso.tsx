"use client";

import { useCallback, useEffect, useState } from "react";
import { poemas } from "@/lib/poemas";
import { getLeitorLocal, listarPoemasLidos } from "@/lib/supabase";

const CHAVE_PROGRESSO = (slug: string) => `diario-ludico:progresso:${slug}`;

function lerProgressoLocal(slug: string): number {
  try {
    const salvo = Number(window.localStorage.getItem(CHAVE_PROGRESSO(slug)) ?? "0");
    return Math.round(Math.min(1, Math.max(0, salvo)) * 100);
  } catch {
    return 0;
  }
}

export default function AmpulhetasProgresso() {
  const [percentuais, setPercentuais] = useState<number[] | null>(null);

  const recarregar = useCallback(async () => {
    const leitor = getLeitorLocal();
    const lidosSet = new Set(leitor ? await listarPoemasLidos(leitor.id) : []);
    setPercentuais(
      poemas.map((p) => (lidosSet.has(p.slug) ? 100 : lerProgressoLocal(p.slug))),
    );
  }, []);

  useEffect(() => {
    recarregar();
    // O hub pode voltar a ficar visível sem remontar (cache de navegação do
    // Next.js, ou o navegador restaurando a aba) — sem isso, as ampulhetas
    // ficam presas no valor de quando a página carregou pela primeira vez.
    function aoVoltarAFicarVisivel() {
      if (document.visibilityState === "visible") recarregar();
    }
    window.addEventListener("focus", recarregar);
    document.addEventListener("visibilitychange", aoVoltarAFicarVisivel);
    return () => {
      window.removeEventListener("focus", recarregar);
      document.removeEventListener("visibilitychange", aoVoltarAFicarVisivel);
    };
  }, [recarregar]);

  if (!percentuais) return null;

  return (
    <div className="relative z-10 mt-10 flex flex-wrap items-end justify-center gap-5 px-4">
      {poemas.map((p, i) => {
        const pct = percentuais[i];
        return (
          <div key={p.slug} className="flex w-16 flex-col items-center gap-1.5">
            <span className="text-[22px]" title={p.titulo}>
              {pct >= 100 ? "⌛" : "⏳"}
            </span>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(200,160,48,0.15)]">
              <div
                className="h-full bg-gradient-to-r from-[#c8a030] to-[#f0c84a] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[9px] uppercase tracking-[2px] text-[#8a7fb0]">
              {p.numero} · {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
