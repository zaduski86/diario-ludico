"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const IMAGEM_LIVRO = "/assets/images/arelah-livro.webp";

export default function LivroTrancado({
  temChave,
  destrancado,
  onAbrir,
  onSoltarChave,
}: {
  temChave: boolean;
  destrancado: boolean;
  onAbrir: () => void;
  onSoltarChave: () => void;
}) {
  const [arrastandoSobre, setArrastandoSobre] = useState(false);
  const [avisoSemChave, setAvisoSemChave] = useState(false);

  function clicar() {
    if (destrancado) {
      onAbrir();
      return;
    }
    if (temChave) {
      onSoltarChave();
      return;
    }
    setAvisoSemChave(true);
    setTimeout(() => setAvisoSemChave(false), 2600);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      onClick={clicar}
      data-livro-trancado
      onDragOver={(e) => {
        if (!destrancado && temChave) {
          e.preventDefault();
          setArrastandoSobre(true);
        }
      }}
      onDragLeave={() => setArrastandoSobre(false)}
      onDrop={(e) => {
        e.preventDefault();
        setArrastandoSobre(false);
        if (!destrancado && temChave) onSoltarChave();
      }}
      className="group relative mx-auto mt-4 w-full max-w-[880px] cursor-pointer"
    >
      <motion.div
        animate={
          temChave && !destrancado
            ? {
                boxShadow: [
                  "0 0 40px rgba(200,160,48,0.25)",
                  "0 0 80px rgba(200,160,48,0.5)",
                  "0 0 40px rgba(200,160,48,0.25)",
                ],
              }
            : {}
        }
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className={`relative aspect-[16/9] w-full overflow-hidden border transition-colors ${
          arrastandoSobre
            ? "border-[#f0c84a]"
            : "border-[rgba(200,160,48,0.35)] group-hover:border-[rgba(200,160,48,0.6)]"
        }`}
      >
        <Image
          src={IMAGEM_LIVRO}
          alt="O Livro de Arelah"
          fill
          sizes="880px"
          className={`object-cover object-center transition-all duration-700 ${
            destrancado
              ? "brightness-100 saturate-100"
              : "brightness-[0.7] saturate-[0.85]"
          }`}
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,4,15,0.92)] via-[rgba(6,4,15,0.55)] to-transparent px-6 pb-5 pt-16 text-center">
          <h3 className="text-[15px] uppercase tracking-[5px] text-[#f0c84a]">
            O Livro de Arelah
          </h3>

          {destrancado ? (
            <p className="mt-2 text-[15px] italic text-[#f0ecff]">
              o livro está aberto — clique pra continuar a leitura.
            </p>
          ) : temChave ? (
            <p className="mt-2 text-[15px] italic text-[#f0ecff]">
              você tem a chave. arraste-a até aqui — ou clique pra usá-la.
            </p>
          ) : (
            <p className="mt-2 text-[15px] italic text-[#c8c0e0]">
              um livro antigo, trancado. algo diz que a chave está por aí.
            </p>
          )}

          {avisoSemChave && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-[13px] italic text-[#e88080]"
            >
              você precisa de uma chave para abrir essa parte.
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
