"use client";

import type { EscalaFonte } from "./useFontScale";

export default function FontSizeToggle({
  escala,
  onChange,
}: {
  escala: EscalaFonte;
  onChange: (v: EscalaFonte) => void;
}) {
  return (
    <div className="fixed right-6 top-5 z-[200] flex items-center gap-1 rounded-full border border-[rgba(200,160,48,0.2)] bg-[rgba(13,8,32,0.88)] px-2 py-1.5 backdrop-blur-md">
      <button
        onClick={() => onChange(Math.max(0, escala - 1) as EscalaFonte)}
        disabled={escala === 0}
        className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.1)] disabled:opacity-30"
        title="Diminuir fonte"
        aria-label="Diminuir tamanho da fonte"
      >
        A−
      </button>
      <button
        onClick={() => onChange(1)}
        className="flex h-7 w-7 items-center justify-center rounded-full text-[13px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.1)]"
        title="Tamanho padrão"
        aria-label="Tamanho de fonte padrão"
      >
        A
      </button>
      <button
        onClick={() => onChange(Math.min(2, escala + 1) as EscalaFonte)}
        disabled={escala === 2}
        className="flex h-7 w-7 items-center justify-center rounded-full text-[15px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.1)] disabled:opacity-30"
        title="Aumentar fonte"
        aria-label="Aumentar tamanho da fonte"
      >
        A+
      </button>
    </div>
  );
}
