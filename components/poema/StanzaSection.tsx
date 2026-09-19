"use client";

import { motion } from "framer-motion";

export default function StanzaSection({
  versos,
  ultima,
}: {
  versos: string[];
  ultima: boolean;
}) {
  return (
    <section className="relative z-[5] flex min-h-[70vh] w-full items-center justify-center px-5 pb-16 pt-24 sm:min-h-[85vh]">
      <div className="w-[90%] max-w-[760px] text-center">
        {versos.map((verso, i) => {
          const isFinal = ultima && i === versos.length - 1;
          return (
            <motion.p
              key={i}
              className={
                isFinal
                  ? "mt-3 text-[clamp(20px,2.4vw,30px)] italic text-[#f0c84a]"
                  : "text-[clamp(17px,1.8vw,25px)] leading-[1.9] tracking-[0.3px] text-[#f0ecff]"
              }
              initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
              whileInView={
                isFinal
                  ? {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      textShadow: "0 0 14px rgba(240,200,74,0.45)",
                    }
                  : { opacity: 1, y: 0, filter: "blur(0px)" }
              }
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: isFinal ? 1.4 : 0.8,
                delay: i * 0.12,
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
