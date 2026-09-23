"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { listarSussurros, type Sussurro } from "@/lib/supabase";

function escolherTres(lista: Sussurro[]): (Sussurro | null)[] {
  if (lista.length === 0) return [null, null, null];
  const embaralhado = [...lista].sort(() => Math.random() - 0.5);
  return [0, 1, 2].map((i) => embaralhado[i % embaralhado.length]);
}

export default function BausModal({ onClose }: { onClose: () => void }) {
  const [carregando, setCarregando] = useState(true);
  const [baus, setBaus] = useState<(Sussurro | null)[]>([null, null, null]);
  const [aberto, setAberto] = useState<number | null>(null);

  useEffect(() => {
    listarSussurros().then((lista) => {
      setBaus(escolherTres(lista));
      setCarregando(false);
    });
  }, []);

  const sussurroAberto = aberto !== null ? baus[aberto] : null;

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
            o gênio fala
          </p>
          <h2 className="mb-8 text-[clamp(16px,2.8vw,20px)] italic leading-relaxed text-[#f0ecff]">
            &ldquo;Você ainda não tem conhecimento suficiente para portar o
            que guardo. Mas pode escolher um baú.&rdquo;
          </h2>

          {carregando ? (
            <p className="text-[13px] italic text-[#8a7fb0]">
              os baús aparecem…
            </p>
          ) : sussurroAberto === null && aberto === null ? (
            <div className="flex items-center justify-center gap-6">
              {baus.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setAberto(i)}
                  whileHover={{ scale: 1.12, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-20 w-20 items-center justify-center rounded-lg border border-[rgba(200,160,48,0.35)] bg-[rgba(200,160,48,0.06)] text-[34px]"
                >
                  📦
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.blockquote
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="border-l border-[rgba(200,160,48,0.35)] pl-4 text-left"
            >
              {sussurroAberto ? (
                <>
                  <p className="text-[16px] italic leading-relaxed text-[#f0ecff]">
                    &ldquo;{sussurroAberto.mensagem}&rdquo;
                  </p>
                  <footer className="mt-2 text-[10px] uppercase tracking-[2px] text-[#c8a030]">
                    — {sussurroAberto.nome}
                  </footer>
                </>
              ) : (
                <p className="text-[13px] italic text-[#4a3f70]">
                  o baú está vazio — ninguém deixou sussurros ainda.
                </p>
              )}
            </motion.blockquote>
          )}

          <button
            onClick={onClose}
            className="mt-9 text-[9px] uppercase tracking-[3px] text-[#4a3f70] transition-colors hover:text-[#c8a030]"
          >
            fechar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
