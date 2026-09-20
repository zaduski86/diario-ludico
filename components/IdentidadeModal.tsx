"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IdentidadeModal({
  onConfirmar,
}: {
  onConfirmar: (nome: string) => void;
}) {
  const [nome, setNome] = useState("");
  const [enviando, setEnviando] = useState(false);

  function confirmar() {
    const limpo = nome.trim();
    if (!limpo || enviando) return;
    setEnviando(true);
    onConfirmar(limpo);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[400] flex items-center justify-center bg-[rgba(6,4,15,0.94)] px-6 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="w-full max-w-[420px] text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mb-2 text-[10px] uppercase tracking-[4px] text-[#6a5898]"
          >
            uma voz ecoa na escuridão
          </motion.p>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="mb-8 text-[clamp(17px,3vw,22px)] italic leading-relaxed text-[#f0ecff]"
          >
            &ldquo;Quem deseja adentrar neste reino da realidade
            paralela?&rdquo;
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmar()}
              placeholder="seu nome"
              maxLength={60}
              autoFocus
              className="w-full border-b border-[rgba(200,160,48,0.35)] bg-transparent px-2 py-2.5 text-center text-sm italic text-[#f0ecff] placeholder:text-[#4a3f70] focus:border-[#c8a030] focus:outline-none"
            />
            <button
              onClick={confirmar}
              disabled={!nome.trim() || enviando}
              className="mx-auto mt-7 block border border-[rgba(200,160,48,0.4)] px-9 py-2.5 text-[11px] uppercase tracking-[4px] text-[#c8a030] transition-colors duration-300 hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a] disabled:opacity-30"
            >
              Entrar
            </button>
            <p className="mt-6 text-[9px] italic leading-relaxed text-[#4a3f70]">
              Isso é só pra eu saber quem visitou o diário — sem senha,
              sem cadastro de verdade.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
