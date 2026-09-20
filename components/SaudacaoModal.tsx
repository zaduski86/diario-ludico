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

  useEffect(() => {
    const t = setTimeout(prosseguir, 3400);
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
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-[480px] text-center text-[clamp(16px,3vw,21px)] italic leading-relaxed text-[#f0ecff]"
        >
          &ldquo;{mensagem}&rdquo;
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
