"use client";

import { useState } from "react";
import { registrarCompartilhamento } from "@/lib/supabase";

export default function CompartilharButton({
  slug,
  titulo,
}: {
  slug: string;
  titulo: string;
}) {
  const [feedback, setFeedback] = useState<string | null>(null);

  async function compartilhar() {
    const url = `${window.location.origin}/poema/${slug}`;
    registrarCompartilhamento(slug, "link");

    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
        return;
      } catch {
        // Usuário cancelou o compartilhamento nativo — segue para copiar.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setFeedback("link copiado!");
      setTimeout(() => setFeedback(null), 2000);
    } catch {
      setFeedback(url);
    }
  }

  return (
    <button
      onClick={compartilhar}
      className="flex flex-col items-center gap-1 border border-[rgba(200,160,48,0.4)] px-6 py-2.5 text-[11px] uppercase tracking-[3px] text-[#c8a030] transition-colors duration-300 hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a]"
    >
      <span>{feedback ?? "compartilhar este poema"}</span>
    </button>
  );
}
