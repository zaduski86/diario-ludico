"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import CoverParticles from "./CoverParticles";
import Starfield from "./Starfield";
import IdentidadeModal from "./IdentidadeModal";
import { getLeitorLocal, identificarLeitor } from "@/lib/supabase";

const TITULO = "Diário Lúdico da Realidade Paralela";

export default function Capa() {
  const router = useRouter();
  const [imploding, setImploding] = useState(false);
  const [mostrarIdentidade, setMostrarIdentidade] = useState(false);

  function iniciarTransicao() {
    setImploding(true);
    setTimeout(() => router.push("/hub"), 650);
  }

  function entrar() {
    if (mostrarIdentidade) return;
    if (getLeitorLocal()) {
      iniciarTransicao();
    } else {
      setMostrarIdentidade(true);
    }
  }

  async function confirmarIdentidade(nome: string) {
    await identificarLeitor(nome);
    setMostrarIdentidade(false);
    iniciarTransicao();
  }

  return (
    <motion.div
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#1a1035_0%,#06040f_70%)]"
      animate={imploding ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onClick={entrar}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && entrar()}
    >
      <Starfield count={90} />

      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: "min(360px, 70vw)", height: "min(360px, 70vw)" }}
        animate={{
          boxShadow: [
            "0 0 80px rgba(200,160,48,0.15)",
            "0 0 120px rgba(200,160,48,0.28)",
            "0 0 80px rgba(200,160,48,0.15)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-[-60px] z-10">
          <CoverParticles imploding={imploding} />
        </div>
        <div className="relative z-0 h-full w-full overflow-hidden rounded-full border border-[rgba(200,160,48,0.3)]">
          <Image
            src="/assets/images/autor.png"
            alt="Retrato do autor"
            fill
            priority
            sizes="360px"
            className="object-cover object-top saturate-[0.85] brightness-90 transition-all duration-500 hover:saturate-100 hover:brightness-100"
          />
        </div>
      </motion.div>

      <div className="relative z-10 mt-7 text-center">
        <h1 className="flex flex-wrap justify-center px-6 text-[clamp(12px,2.2vw,17px)] uppercase leading-[1.8] tracking-[4px] text-[#f0c84a]">
          {TITULO.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.028, duration: 0.5 }}
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-2.5 text-[10px] italic tracking-[2px] text-[#6a5898]"
        >
          clique para entrar
        </motion.p>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.7 }}
        onClick={(e) => {
          e.stopPropagation();
          entrar();
        }}
        className="relative z-10 mt-6 overflow-hidden border border-[rgba(200,160,48,0.4)] px-8 py-2.5 text-[10px] uppercase tracking-[4px] text-[#c8a030] transition-colors duration-300 hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a]"
      >
        <span className="relative z-10">Entrar</span>
      </motion.button>

      {mostrarIdentidade && (
        <IdentidadeModal onConfirmar={confirmarIdentidade} />
      )}
    </motion.div>
  );
}
