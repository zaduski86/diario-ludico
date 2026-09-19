"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Poema } from "@/lib/poemas";
import { registrarVisita } from "@/lib/supabase";
import SceneCanvas from "./SceneCanvas";
import StanzaSection from "./StanzaSection";
import EndSection from "./EndSection";
import AudioPlayer from "./AudioPlayer";
import { useAudioPoema } from "./useAudioPoema";

export default function PoemaExperience({ poema }: { poema: Poema }) {
  const router = useRouter();
  const [progresso, setProgresso] = useState(0);
  const tickAgendado = useRef(false);

  const {
    narrTocando,
    trilhaTocando,
    toggleNarracao,
    toggleTrilha,
    analyser,
  } = useAudioPoema(poema);

  useEffect(() => {
    registrarVisita(poema.slug);
  }, [poema.slug]);

  useEffect(() => {
    function medir() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? window.scrollY / total : 0;
      setProgresso(Math.min(1, Math.max(0, p)));
      tickAgendado.current = false;
    }
    function aoRolar() {
      if (tickAgendado.current) return;
      tickAgendado.current = true;
      requestAnimationFrame(medir);
    }
    medir();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-dvh w-full"
    >
      {/* Camada 2: imagem em marca d'água */}
      <div className="fixed inset-0 z-[1]">
        <Image
          src={poema.imagem}
          alt={poema.titulo}
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.62] saturate-[0.9]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 48% at 50% 52%, rgba(6,4,15,0.82) 0%, rgba(6,4,15,0.55) 45%, rgba(6,4,15,0.22) 78%, rgba(6,4,15,0.1) 100%)",
          }}
        />
      </div>

      {/* Camada 1: cena 3D ambiente */}
      <SceneCanvas cena={poema.cena} progress={progresso} />

      {/* Cabeçalho */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-10 bg-gradient-to-b from-[rgba(6,4,15,0.9)] via-[rgba(6,4,15,0.6)] to-transparent px-5 pb-5 pt-[60px] text-center">
        <h1 className="text-[clamp(16px,3.5vw,28px)] tracking-[2px] text-[#f0ecff]">
          {poema.titulo}
        </h1>
        {poema.sub && (
          <p className="mt-1.5 text-[11px] italic tracking-[3px] text-[#c8a030]">
            {poema.sub}
          </p>
        )}
      </div>

      <button
        onClick={() => router.push("/hub")}
        className="fixed left-6 top-6 z-20 text-[10px] uppercase tracking-[3px] text-[#6a5898] transition-colors hover:text-[#c8a030]"
      >
        ← Diário Lúdico
      </button>

      {/* Barra de progresso de leitura */}
      <div className="fixed left-0 top-0 z-30 h-[2px] w-full bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-[#c8a030] to-[#f0c84a] transition-[width] duration-150 ease-out"
          style={{ width: `${progresso * 100}%` }}
        />
      </div>

      <AudioPlayer
        titulo={poema.titulo}
        narrTocando={narrTocando}
        trilhaTocando={trilhaTocando}
        onToggleNarracao={toggleNarracao}
        onToggleTrilha={toggleTrilha}
        analyser={analyser}
      />

      {/* Conteúdo — estrofes reveladas ao rolar a página */}
      <main className="relative z-[5]">
        <div className="h-[20vh]" />
        {poema.estrofes.map((versos, i) => (
          <StanzaSection
            key={i}
            versos={versos}
            ultima={i === poema.estrofes.length - 1}
          />
        ))}
        <EndSection />
      </main>
    </motion.div>
  );
}
