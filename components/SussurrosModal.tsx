"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  enviarSussurro,
  getLeitorLocal,
  leuTodosPoemas,
  listarSussurros,
  type Sussurro,
} from "@/lib/supabase";

export default function SussurrosModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [carregando, setCarregando] = useState(true);
  const [liberado, setLiberado] = useState(false);
  const [sussurro, setSussurro] = useState<Sussurro | null>(null);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    (async () => {
      const leitor = getLeitorLocal();
      if (leitor?.nome) setNome(leitor.nome);
      if (!leitor) {
        setCarregando(false);
        return;
      }
      const [pode, lista] = await Promise.all([
        leuTodosPoemas(leitor.id),
        listarSussurros(),
      ]);
      setLiberado(pode);
      if (lista.length > 0) {
        setSussurro(lista[Math.floor(Math.random() * lista.length)]);
      }
      setCarregando(false);
    })();
  }, []);

  async function enviar() {
    const nomeLimpo = nome.trim();
    const mensagemLimpa = mensagem.trim();
    if (!nomeLimpo || !mensagemLimpa || enviando) return;
    setEnviando(true);
    const { error } = await enviarSussurro(nomeLimpo, mensagemLimpa);
    setEnviando(false);
    if (!error) {
      setEnviado(true);
      setMensagem("");
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
          className="w-full max-w-[440px] text-center"
        >
          <p className="mb-2 text-[10px] uppercase tracking-[4px] text-[#6a5898]">
            sussurros
          </p>

          {carregando && (
            <p className="text-[13px] italic text-[#8a7fb0]">
              escutando…
            </p>
          )}

          {!carregando && !liberado && (
            <>
              <h2 className="mb-6 text-[clamp(16px,2.8vw,20px)] italic leading-relaxed text-[#f0ecff]">
                &ldquo;Os sussurros só se ouvem depois que se atravessa
                tudo.&rdquo;
              </h2>
              <p className="text-[11px] italic text-[#4a3f70]">
                volte quando a jornada estiver completa.
              </p>
            </>
          )}

          {!carregando && liberado && (
            <>
              {sussurro && (
                <motion.blockquote
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mb-8 border-l border-[rgba(200,160,48,0.35)] pl-4 text-left"
                >
                  <p className="text-[14px] italic leading-relaxed text-[#f0ecff]">
                    &ldquo;{sussurro.mensagem}&rdquo;
                  </p>
                  <footer className="mt-2 text-[10px] uppercase tracking-[2px] text-[#c8a030]">
                    — {sussurro.nome}
                  </footer>
                </motion.blockquote>
              )}
              {!sussurro && (
                <p className="mb-8 text-[12px] italic text-[#4a3f70]">
                  ainda não há sussurros — o primeiro pode ser seu.
                </p>
              )}

              {enviado ? (
                <p className="text-[12px] italic text-[#c8a030]">
                  seu sussurro agora faz parte deste lugar.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
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
                    placeholder="deixe seu sussurro para quem ainda vai chegar"
                    maxLength={300}
                    rows={3}
                    className="resize-none border-b border-[rgba(200,160,48,0.35)] bg-transparent px-1 py-1.5 text-center text-sm text-[#f0ecff] placeholder:text-[#8a7fb0] focus:border-[#c8a030] focus:outline-none"
                  />
                  <button
                    onClick={enviar}
                    disabled={!nome.trim() || !mensagem.trim() || enviando}
                    className="mx-auto mt-2 border border-[rgba(200,160,48,0.4)] px-8 py-2.5 text-[10px] uppercase tracking-[3px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a] disabled:opacity-30"
                  >
                    {enviando ? "sussurrando…" : "deixar meu sussurro"}
                  </button>
                </div>
              )}
            </>
          )}

          <button
            onClick={onClose}
            className="mt-8 text-[9px] uppercase tracking-[3px] text-[#4a3f70] transition-colors hover:text-[#c8a030]"
          >
            fechar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
