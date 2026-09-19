"use client";

import { motion } from "framer-motion";

export default function ResumoLeitura({
  onContinuar,
  onComecarDoInicio,
}: {
  onContinuar: () => void;
  onComecarDoInicio: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5 }}
      className="fixed left-1/2 top-[104px] z-[150] flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full border border-[rgba(200,160,48,0.25)] bg-[rgba(13,8,32,0.92)] px-4 py-2 text-[11px] backdrop-blur-md"
    >
      <span className="text-[#c8c0e0]">Continuar de onde parou?</span>
      <button
        onClick={onContinuar}
        className="text-[#c8a030] underline-offset-2 transition-colors hover:text-[#f0c84a] hover:underline"
      >
        continuar
      </button>
      <span className="text-[#4a3f70]">·</span>
      <button
        onClick={onComecarDoInicio}
        className="text-[#6a5898] underline-offset-2 transition-colors hover:text-[#c8a030] hover:underline"
      >
        começar do início
      </button>
    </motion.div>
  );
}
