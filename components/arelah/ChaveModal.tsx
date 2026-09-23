"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function ChaveModal({
  primeiraVez,
  onClose,
}: {
  primeiraVez: boolean;
  onClose: () => void;
}) {
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
          <motion.div
            animate={{ rotate: [0, -8, 8, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 text-[40px]"
          >
            🗝️
          </motion.div>

          <p className="mb-2 text-[10px] uppercase tracking-[4px] text-[#6a5898]">
            o gênio fala
          </p>

          {primeiraVez ? (
            <h2 className="mb-8 text-[clamp(16px,2.8vw,20px)] italic leading-relaxed text-[#f0ecff]">
              &ldquo;Seis mundos atravessados, seis verdades absorvidas.
              Ou você é muito sábio — ou muito teimoso. De qualquer forma,
              isso é seu. Arraste com cuidado. As coisas boas
              pesam.&rdquo;
            </h2>
          ) : (
            <h2 className="mb-8 text-[clamp(16px,2.8vw,20px)] italic leading-relaxed text-[#f0ecff]">
              &ldquo;A chave ainda está com você. Leve-a até o livro,
              quando estiver pronto.&rdquo;
            </h2>
          )}

          <button
            onClick={onClose}
            className="text-[9px] uppercase tracking-[3px] text-[#4a3f70] transition-colors hover:text-[#c8a030]"
          >
            fechar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
