"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const IMAGEM_LIVRO = "/assets/images/arelah-livro.webp";

export default function LivroArelah({ onAbrir }: { onAbrir: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      onClick={onAbrir}
      className="group relative mx-auto mt-16 w-full max-w-[880px] cursor-pointer"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden border border-[rgba(200,160,48,0.35)] transition-colors group-hover:border-[rgba(200,160,48,0.6)]">
        <Image
          src={IMAGEM_LIVRO}
          alt="O Livro de Arelah"
          fill
          sizes="880px"
          className="object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,4,15,0.92)] via-[rgba(6,4,15,0.55)] to-transparent px-6 pb-5 pt-16 text-center">
          <h3 className="text-[15px] uppercase tracking-[5px] text-[#f0c84a]">
            O Livro de Arelah
          </h3>
          <p className="mt-2 text-[15px] italic text-[#f0ecff]">
            clique pra começar a ler.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
