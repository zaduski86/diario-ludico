"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import SussurrosModal from "./SussurrosModal";

function posAleatoria() {
  return {
    top: 14 + Math.random() * 64,
    left: 6 + Math.random() * 84,
  };
}

export default function GenioVoador() {
  const [pos, setPos] = useState(posAleatoria);
  const [visivel, setVisivel] = useState(true);
  const [aberto, setAberto] = useState(false);
  const [montado, setMontado] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    setMontado(true);
  }, []);

  useEffect(() => {
    function agendarProximoVoo() {
      const duracaoVooMs = 4000 + Math.random() * 5000;
      timeoutRef.current = setTimeout(() => {
        const vaiSumir = Math.random() < 0.35;
        if (vaiSumir) {
          setVisivel(false);
          const pausaMs = 2500 + Math.random() * 4000;
          timeoutRef.current = setTimeout(() => {
            setPos(posAleatoria());
            setVisivel(true);
            agendarProximoVoo();
          }, pausaMs);
        } else {
          setPos(posAleatoria());
          agendarProximoVoo();
        }
      }, duracaoVooMs);
    }
    agendarProximoVoo();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (!montado) return null;

  return createPortal(
    <>
      <motion.button
        onClick={() => setAberto(true)}
        aria-label="Um sussurro passa voando por perto"
        animate={{
          top: `${pos.top}vh`,
          left: `${pos.left}vw`,
          opacity: visivel ? 1 : 0,
        }}
        transition={{ duration: 5, ease: "easeInOut" }}
        style={{
          position: "fixed",
          pointerEvents: visivel ? "auto" : "none",
        }}
        className="z-[200] flex h-9 w-9 items-center justify-center rounded-full text-[19px] transition-transform hover:scale-125"
      >
        🧞
      </motion.button>

      {aberto && <SussurrosModal onClose={() => setAberto(false)} />}
    </>,
    document.body,
  );
}
