"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function EndSection({
  proximoPoema,
}: {
  proximoPoema?: { slug: string; titulo: string };
}) {
  const router = useRouter();

  return (
    <section className="relative z-[5] flex min-h-[60vh] w-full flex-col items-center justify-center gap-8 px-5 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1 }}
        className="h-px w-24 bg-gradient-to-r from-transparent via-[#c8a030] to-transparent"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-[11px] uppercase tracking-[4px] text-[#6a5898]"
      >
        fim
      </motion.div>

      {proximoPoema && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.8 }}
          onClick={() => router.push(`/poema/${proximoPoema.slug}`)}
          className="group flex flex-col items-center gap-1"
        >
          <span className="text-[9px] uppercase tracking-[3px] text-[#6a5898]">
            próximo poema
          </span>
          <span className="text-sm italic text-[#f0ecff] transition-colors group-hover:text-[#f0c84a]">
            {proximoPoema.titulo} →
          </span>
        </motion.button>
      )}

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
        onClick={() => router.push("/hub")}
        className="border border-[rgba(200,160,48,0.4)] px-9 py-3 text-[11px] uppercase tracking-[4px] text-[#c8a030] transition-colors duration-300 hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a]"
      >
        ← Voltar ao início
      </motion.button>
    </section>
  );
}
