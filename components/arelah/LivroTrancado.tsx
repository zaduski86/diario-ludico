"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { IMAGEM_CAPA } from "@/lib/arelah";

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
      className={`relative mx-auto mt-4 flex min-h-[280px] w-full max-w-[1100px] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden border px-8 py-14 text-center transition-colors ${
        arrastandoSobre
          ? "border-[#f0c84a]"
          : "border-[rgba(200,160,48,0.3)] hover:border-[rgba(200,160,48,0.5)]"
      }`}
    >
      <Image
        src={IMAGEM_CAPA}
        alt="Capa do Livro de Arelah"
        fill
        sizes="1100px"
        className={`object-cover object-center transition-all duration-500 ${
          destrancado
            ? "opacity-45 saturate-100 brightness-90"
            : "opacity-25 saturate-[0.4] brightness-50 blur-[1px]"
        }`}
      />
      <div
        className={`absolute inset-0 ${
          arrastandoSobre ? "bg-[rgba(200,160,48,0.15)]" : "bg-[rgba(6,4,15,0.55)]"
        }`}
      />

      <span className="relative z-10 text-[46px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
        {destrancado ? "📖" : "📕"}
      </span>
      {!destrancado && (
        <span className="relative z-10 -mt-2 text-[20px]">🔒</span>
      )}

      <h3 className="relative z-10 mt-2 text-[13px] uppercase tracking-[4px] text-[#c8a030]">
        O Livro de Arelah
      </h3>

      {destrancado ? (
        <p className="relative z-10 max-w-[420px] text-[12px] italic text-[#c8c0e0]">
          o livro está aberto — clique pra continuar a leitura.
        </p>
      ) : temChave ? (
        <p className="relative z-10 max-w-[420px] text-[12px] italic text-[#c8c0e0]">
          você tem a chave. arraste-a até aqui — ou clique pra usá-la.
        </p>
      ) : (
        <p className="relative z-10 max-w-[420px] text-[12px] italic text-[#8a7fb0]">
          um livro antigo, trancado. algo diz que a chave está por aí.
        </p>
      )}

      {avisoSemChave && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 text-[11px] italic text-[#e88080]"
        >
          você precisa de uma chave para abrir essa parte.
        </motion.p>
      )}
    </motion.div>
  );
}
