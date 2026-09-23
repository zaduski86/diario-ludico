"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

export default function ChaveFlutuante({
  onSoltarNoLivro,
}: {
  onSoltarNoLivro: () => void;
}) {
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  if (!montado) return null;

  return createPortal(
    <motion.div
      draggable
      onDragEnd={(e) => {
        const alvo = document.elementFromPoint(
          (e as unknown as DragEvent).clientX,
          (e as unknown as DragEvent).clientY,
        );
        if (alvo?.closest("[data-livro-trancado]")) onSoltarNoLivro();
      }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: "fixed", bottom: 28, left: "50%", x: "-50%" }}
      className="z-[150] flex h-11 w-11 cursor-grab items-center justify-center rounded-full border border-[rgba(200,160,48,0.5)] bg-[rgba(13,8,32,0.85)] text-[20px] shadow-[0_0_25px_rgba(200,160,48,0.35)] active:cursor-grabbing"
      title="Sua chave — arraste até o livro"
    >
      🗝️
    </motion.div>,
    document.body,
  );
}
