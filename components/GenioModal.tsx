"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { enviarSussurro, getLeitorLocal } from "@/lib/supabase";
import Starfield from "./Starfield";

export default function GenioModal({ onClose }: { onClose: () => void }) {
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
    if (!error) setEnviado(true);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[500] flex items-center justify-center overflow-y-auto bg-[rgba(6,4,15,0.97)] px-6 py-16 backdrop-blur-sm"
      >
        <Starfield count={140} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[460px] text-center"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 60px rgba(200,160,48,0.2)",
                "0 0 100px rgba(200,160,48,0.4)",
                "0 0 60px rgba(200,160,48,0.2)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(200,160,48,0.5)] text-[26px]"
          >
            🧞
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mb-3 text-[10px] uppercase tracking-[4px] text-[#6a5898]"
          >
            algo desperta
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9 }}
            className="mb-8 text-[clamp(17px,3vw,22px)] italic leading-relaxed text-[#f0ecff]"
          >
            &ldquo;Você atravessou tudo o que havia pra atravessar aqui.
            Por isso, e só por isso, ganha o direito de deixar uma marca
            sua neste lugar — pra sempre, pra quem vier depois de
            você.&rdquo;
          </motion.h2>

          {enviado ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[13px] italic text-[#c8a030]"
            >
              feito. seu sussurro agora mora aqui.
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.9 }}
              className="flex flex-col gap-3"
            >
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="seu nome"
                maxLength={60}
                className="border-b border-[rgba(200,160,48,0.35)] bg-transparent px-1 py-1.5 text-center text-sm text-[#f0ecff] placeholder:text-[#8a7fb0] focus:border-[#c8a030] focus:outline-none"
              />
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="seu sussurro para quem ainda vai chegar"
                maxLength={300}
                rows={3}
                className="resize-none border-b border-[rgba(200,160,48,0.35)] bg-transparent px-1 py-1.5 text-center text-sm text-[#f0ecff] placeholder:text-[#8a7fb0] focus:border-[#c8a030] focus:outline-none"
              />
              <button
                onClick={enviar}
                disabled={!nome.trim() || !mensagem.trim() || enviando}
                className="mx-auto mt-2 border border-[rgba(200,160,48,0.4)] px-8 py-2.5 text-[10px] uppercase tracking-[3px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a] disabled:opacity-30"
              >
                {enviando ? "gravando…" : "deixar minha marca"}
              </button>
            </motion.div>
          )}

          <button
            onClick={onClose}
            className="mt-9 text-[9px] uppercase tracking-[3px] text-[#4a3f70] transition-colors hover:text-[#c8a030]"
          >
            {enviado ? "voltar" : "talvez depois"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
