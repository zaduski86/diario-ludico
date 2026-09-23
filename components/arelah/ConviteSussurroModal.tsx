"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { enviarSussurro, getLeitorLocal } from "@/lib/supabase";

export default function ConviteSussurroModal({
  onClose,
  onEnviado,
}: {
  onClose: () => void;
  onEnviado: () => void;
}) {
  const [nome, setNome] = useState(getLeitorLocal()?.nome ?? "");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function enviar() {
    const nomeLimpo = nome.trim();
    const mensagemLimpa = mensagem.trim();
    if (!nomeLimpo || !mensagemLimpa || enviando) return;
    setEnviando(true);
    const { error } = await enviarSussurro(nomeLimpo, mensagemLimpa);
    setEnviando(false);
    if (!error) {
      setEnviado(true);
      onEnviado();
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onClose}
        className="fixed inset-0 z-[400] flex items-center justify-center bg-[rgba(6,4,15,0.94)] px-6 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[460px] text-center"
        >
          <p className="mb-2 text-[10px] uppercase tracking-[4px] text-[#6a5898]">
            o gênio reconhece você
          </p>
          <h2 className="mb-8 text-[clamp(16px,2.8vw,20px)] italic leading-relaxed text-[#f0ecff]">
            &ldquo;Você atravessou os seis mundos. Deixe algo seu aqui —
            vai ficar eternizado nesta realidade, pra quem ainda vai
            chegar.&rdquo;
          </h2>

          {enviado ? (
            <p className="text-[14px] italic text-[#c8a030]">
              feito. seu sussurro agora mora aqui.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="seu nome"
                maxLength={60}
                className="border-b border-[rgba(200,160,48,0.35)] bg-transparent px-1 py-2 text-center text-base text-[#f0ecff] placeholder:text-[#8a7fb0] focus:border-[#c8a030] focus:outline-none"
              />
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="seu sussurro para quem ainda vai chegar"
                maxLength={300}
                rows={3}
                className="resize-none border-b border-[rgba(200,160,48,0.35)] bg-transparent px-1 py-2 text-center text-base text-[#f0ecff] placeholder:text-[#8a7fb0] focus:border-[#c8a030] focus:outline-none"
              />
              <button
                onClick={enviar}
                disabled={!nome.trim() || !mensagem.trim() || enviando}
                className="mx-auto mt-2 border border-[rgba(200,160,48,0.4)] px-8 py-2.5 text-[11px] uppercase tracking-[3px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a] disabled:opacity-30"
              >
                {enviando ? "sussurrando…" : "deixar meu sussurro"}
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-9 text-[9px] uppercase tracking-[3px] text-[#4a3f70] transition-colors hover:text-[#c8a030]"
          >
            {enviado ? "fechar" : "talvez depois"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
