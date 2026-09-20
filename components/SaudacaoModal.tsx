"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gerarSaudacao } from "@/lib/boasVindas";

export default function SaudacaoModal({
  nome,
  onContinuar,
}: {
  nome: string;
  onContinuar: () => void;
}) {
  const mensagem = useMemo(() => gerarSaudacao(nome), [nome]);
  const [prosseguiu, setProsseguiu] = useState(false);

  // Tempo de leitura estimado (~200 palavras/min) + folga generosa, com piso
  // e teto razoáveis para frases curtas ou longas.
  const duracaoMs = Math.min(
    9000,
    Math.max(6000, (mensagem.split(/\s+/).length / 200) * 60000 + 3500),
  );

  useEffect(() => {
    const t = setTimeout(prosseguir, duracaoMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function prosseguir() {
    if (prosseguiu) return;
    setProsseguiu(true);
    onContinuar();
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        onClick={prosseguir}
        className="fixed inset-0 z-[400] flex cursor-pointer items-center justify-center bg-[rgba(6,4,15,0.94)] px-6 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center gap-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-[480px] text-center text-[clamp(16px,3vw,21px)] italic leading-relaxed text-[#f0ecff]"
          >
            &ldquo;{mensagem}&rdquo;
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="text-[9px] uppercase tracking-[3px] text-[#6a5898]"
          >
            toque para continuar
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
