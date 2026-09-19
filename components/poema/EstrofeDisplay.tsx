"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function EstrofeDisplay({
  versos,
  estrofeKey,
  ultima,
}: {
  versos: string[];
  estrofeKey: number;
  ultima: boolean;
}) {
  return (
    <div className="relative z-[6] w-[90%] max-w-[760px] px-5 py-10 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={estrofeKey}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5 }}
        >
          {versos.map((verso, i) => {
            const isFinal = ultima && i === versos.length - 1;
            return (
              <motion.span
                key={i}
                className={
                  isFinal
                    ? "verso-final block text-[clamp(20px,2.4vw,30px)] italic text-[#f0c84a] mt-3"
                    : "block text-[clamp(17px,1.8vw,25px)] leading-[1.9] tracking-[0.3px] text-[#f0ecff]"
                }
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={
                  isFinal
                    ? {
                        opacity: [0, 1, 1],
                        y: 0,
                        filter: "blur(0px)",
                        textShadow: [
                          "0 0 0px rgba(240,200,74,0)",
                          "0 0 18px rgba(240,200,74,0.6)",
                          "0 0 8px rgba(240,200,74,0.35)",
                        ],
                      }
                    : { opacity: 1, y: 0, filter: "blur(0px)" }
                }
                transition={{
                  duration: isFinal ? 2.2 : 0.7,
                  delay: i * 0.28,
                  ease: "easeOut",
                }}
              >
                {verso}
              </motion.span>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
