"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { EscalaFonte } from "./useFontScale";

const TAMANHOS: Record<EscalaFonte, { normal: string; final: string }> = {
  0: {
    normal: "text-[clamp(19px,2.1vw,27px)]",
    final: "text-[clamp(23px,2.7vw,32px)]",
  },
  1: {
    normal: "text-[clamp(22px,2.3vw,32px)]",
    final: "text-[clamp(26px,3.1vw,39px)]",
  },
  2: {
    normal: "text-[clamp(25px,2.7vw,38px)]",
    final: "text-[clamp(30px,3.5vw,45px)]",
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
      className="relative z-[5] flex w-full items-center justify-center px-5 py-10 sm:py-12"
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
