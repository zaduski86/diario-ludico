"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SussurrosModal from "./SussurrosModal";

export default function SussurrosButton() {
  const [hover, setHover] = useState(false);
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <div
        className="fixed right-6 top-6 z-20 flex flex-col items-end gap-2"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <AnimatePresence>
          {hover && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-[190px] text-right text-[10px] italic leading-snug text-[#8a7fb0]"
            >
              Em dúvida sobre o que ler? Escute um sussurro.
            </motion.p>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAberto(true)}
          aria-label="Sussurros"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(200,160,48,0.35)] text-[13px] italic text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a]"
        >
          ?
        </button>
      </div>

      {aberto && <SussurrosModal onClose={() => setAberto(false)} />}
    </>
  );
}
