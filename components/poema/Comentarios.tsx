"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  enviarComentario,
  getLeitorLocal,
  getSupabase,
  listarComentarios,
  type Comentario,
} from "@/lib/supabase";
import { apagarComentarioAdmin, isAdminSessao } from "@/components/useAdmin";

function tempoRelativo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "agora mesmo";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d}d`;
}

export default function Comentarios({ poemaSlug }: { poemaSlug: string }) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [disponivel, setDisponivel] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [apagando, setApagando] = useState<string | null>(null);
  const [confirmando, setConfirmando] = useState<string | null>(null);

  useEffect(() => {
    if (!getSupabase()) return;
    setDisponivel(true);
    setAdmin(isAdminSessao());
    const leitor = getLeitorLocal();
    if (leitor?.nome) setNome(leitor.nome);
    listarComentarios(poemaSlug).then(setComentarios);
  }, [poemaSlug]);

  async function apagar(id: string) {
    if (confirmando !== id) {
      setConfirmando(id);
      return;
    }
    setApagando(id);
    const ok = await apagarComentarioAdmin(id);
    setApagando(null);
    setConfirmando(null);
    if (ok) setComentarios((c) => c.filter((x) => x.id !== id));
  }

  async function enviar() {
    const nomeLimpo = nome.trim();
    const mensagemLimpa = mensagem.trim();
    if (!nomeLimpo || !mensagemLimpa || enviando) return;
    setEnviando(true);
    setErro(null);
    const { error } = await enviarComentario(
      poemaSlug,
      nomeLimpo,
      mensagemLimpa,
    );
    setEnviando(false);
    if (error) {
      setErro("Não foi possível enviar. Tenta de novo?");
      return;
    }
    setComentarios((c) => [
      {
        id: crypto.randomUUID(),
        poema_slug: poemaSlug,
        nome: nomeLimpo,
        mensagem: mensagemLimpa,
        created_at: new Date().toISOString(),
      },
      ...c,
    ]);
    setMensagem("");
  }

  if (!disponivel) return null;

  return (
    <section className="relative z-[5] mx-auto w-[90%] max-w-[620px] pb-24">
      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-center text-[11px] uppercase tracking-[4px] text-[#c8a030]"
      >
        comentários dos leitores
      </motion.h3>

      <div className="mb-8 flex flex-col gap-3 border border-[rgba(200,160,48,0.3)] bg-[rgba(13,8,32,0.7)] p-4">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="seu nome"
          maxLength={60}
          className="border-b border-[rgba(200,160,48,0.35)] bg-transparent px-1 py-1.5 text-sm text-[#f0ecff] placeholder:text-[#8a7fb0] focus:border-[#c8a030] focus:outline-none"
        />
        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="o que esse poema despertou em você?"
          maxLength={1000}
          rows={3}
          className="resize-none border-b border-[rgba(200,160,48,0.35)] bg-transparent px-1 py-1.5 text-sm text-[#f0ecff] placeholder:text-[#8a7fb0] focus:border-[#c8a030] focus:outline-none"
        />
        <div className="flex items-center justify-between">
          {erro ? (
            <span className="text-[11px] text-[#c85050]">{erro}</span>
          ) : (
            <span />
          )}
          <button
            onClick={enviar}
            disabled={!nome.trim() || !mensagem.trim() || enviando}
            className="border border-[rgba(200,160,48,0.4)] px-5 py-2 text-[10px] uppercase tracking-[3px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a] disabled:opacity-30"
          >
            {enviando ? "enviando…" : "comentar"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {comentarios.length === 0 && (
          <p className="text-center text-[12px] italic text-[#4a3f70]">
            Seja o primeiro a comentar.
          </p>
        )}
        {comentarios.map((c) => (
          <div key={c.id} className="border-l border-[rgba(200,160,48,0.25)] pl-4">
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-[12px] text-[#c8a030]">{c.nome}</span>
              <span className="text-[10px] text-[#4a3f70]">
                {tempoRelativo(c.created_at)}
              </span>
              {admin && (
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
              )}
            </div>
            <p className="text-[13px] leading-relaxed text-[#c8c0e0]">
              {c.mensagem}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
