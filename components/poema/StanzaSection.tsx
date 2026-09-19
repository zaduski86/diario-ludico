"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { EscalaFonte } from "./useFontScale";

const TAMANHOS: Record<EscalaFonte, { normal: string; final: string }> = {
  0: {
    normal: "text-[clamp(15px,1.6vw,21px)]",
    final: "text-[clamp(18px,2.1vw,25px)]",
  },
  1: {
    normal: "text-[clamp(17px,1.8vw,25px)]",
    final: "text-[clamp(20px,2.4vw,30px)]",
  },
  2: {
    normal: "text-[clamp(19px,2.1vw,29px)]",
    final: "text-[clamp(23px,2.7vw,35px)]",
  },
};

export default function StanzaSection({
  id,
  versos,
  ultima,
  estilo = "verso",
  escala = 1,
  onVersoClick,
}: {
  id?: string;
  versos: string[];
  ultima: boolean;
  estilo?: "verso" | "prosa";
  escala?: EscalaFonte;
  onVersoClick?: (verso: string) => void;
}) {
  const reduzirMovimento = useReducedMotion();
  const tamanhos = TAMANHOS[escala];

  return (
    <section
      id={id}
      className="relative z-[5] flex min-h-[70vh] w-full items-center justify-center px-5 pb-16 pt-24 sm:min-h-[85vh]"
    >
      <div
        className={
          estilo === "prosa"
            ? "w-[90%] max-w-[600px] text-center"
            : "w-[90%] max-w-[760px] text-center"
        }
      >
        {versos.map((verso, i) => {
          const isFinal = ultima && i === versos.length - 1;
          const inicial = reduzirMovimento
            ? { opacity: 0 }
            : { opacity: 0, y: 22, filter: "blur(6px)" };
          const animar = reduzirMovimento
            ? { opacity: 1 }
            : isFinal
              ? {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  textShadow: "0 0 14px rgba(240,200,74,0.45)",
                }
              : { opacity: 1, y: 0, filter: "blur(0px)" };
          return (
            <motion.p
              key={i}
              onClick={onVersoClick ? () => onVersoClick(verso) : undefined}
              className={
                (isFinal
                  ? `mt-3 ${tamanhos.final} italic text-[#f0c84a]`
                  : `${tamanhos.normal} leading-[1.9] tracking-[0.3px] text-[#f0ecff]`) +
                (onVersoClick
                  ? " cursor-pointer transition-opacity hover:opacity-80"
                  : "")
              }
              initial={inicial}
              whileInView={animar}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: reduzirMovimento ? 0.4 : isFinal ? 1.4 : 0.8,
                delay: reduzirMovimento ? 0 : i * 0.12,
                ease: "easeOut",
              }}
            >
              {verso}
            </motion.p>
          );
        })}
      </div>
    </section>
  );
}
