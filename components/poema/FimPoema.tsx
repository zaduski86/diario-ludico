"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function FimPoema({ versos }: { versos: string[] }) {
  const router = useRouter();

  const estrelas = useMemo(
    () =>
      Array.from({ length: 40 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 60,
        delay: Math.random() * 0.6,
      })),
    [],
  );

  const chuva = useMemo(
    () =>
      Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        delay: Math.random() * 2.5,
        duration: 1.4 + Math.random() * 1.2,
      })),
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-[rgba(6,4,15,0.92)] px-10 text-center"
    >
      <div className="pointer-events-none absolute inset-0">
        {estrelas.map((s, i) => (
          <motion.span
            key={i}
            className="absolute h-[3px] w-[3px] rounded-full bg-[#f0c84a]"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.6], scale: [0, 1.4, 1] }}
            transition={{ duration: 1.5, delay: s.delay }}
          />
        ))}
        {chuva.map((c, i) => (
          <motion.span
            key={"r" + i}
            className="absolute top-[-10px] h-3 w-px bg-gradient-to-b from-[#f0c84a] to-transparent"
            style={{ left: `${c.x}%` }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 0.8, 0] }}
            transition={{
              duration: c.duration,
              delay: 3 + c.delay,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mb-6 text-[12px] uppercase tracking-[4px] text-[#6a5898]">
        fim
      </div>
      <div className="relative z-10 mb-10 max-w-2xl text-[clamp(19px,2.6vw,28px)] italic leading-[1.8] text-[#f0c84a]">
        {versos.map((v, i) => (
          <div key={i}>{v}</div>
        ))}
      </div>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.2, duration: 0.8 }}
        onClick={() => router.push("/hub")}
        className="relative z-10 border border-[rgba(200,160,48,0.4)] px-9 py-3 text-[11px] uppercase tracking-[4px] text-[#c8a030] transition-colors duration-300 hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a]"
      >
        ← Voltar ao início
      </motion.button>
    </motion.div>
  );
}
