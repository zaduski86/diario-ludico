"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Poema } from "@/lib/poemas";
import { registrarVisita } from "@/lib/supabase";
import SceneCanvas from "./SceneCanvas";
import EstrofeDisplay from "./EstrofeDisplay";
import Contador from "./Contador";
import AudioPlayer from "./AudioPlayer";
import FimPoema from "./FimPoema";
import ParticleBurst, { type Burst } from "./ParticleBurst";
import { useAudioPoema } from "./useAudioPoema";

export default function PoemaExperience({
  poema,
  poemaIndex,
}: {
  poema: Poema;
  poemaIndex: number;
}) {
  const router = useRouter();
  const [estrofeAtual, setEstrofeAtual] = useState(-1);
  const [fim, setFim] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);

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

  function handleObjetoAtivado(
    index: number,
    screenPos: { x: number; y: number },
  ) {
    if (index !== estrofeAtual + 1) return;
    const id = burstId.current++;
    setBursts((b) => [...b, { id, ...screenPos }]);
    setTimeout(
      () => setBursts((b) => b.filter((x) => x.id !== id)),
      1000,
    );

    const proximo = estrofeAtual + 1;
    setEstrofeAtual(proximo);
    if (proximo >= poema.estrofes.length - 1) {
      setTimeout(() => setFim(true), 3200);
    }
  }

  const estrofeVisivel =
    estrofeAtual >= 0 ? poema.estrofes[estrofeAtual] : null;
  const ultimaEstrofe = poema.estrofes[poema.estrofes.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-dvh w-full overflow-hidden"
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

      {/* Camada 1: cena 3D */}
      <SceneCanvas
        poemaIndex={poemaIndex}
        poema={poema}
        estrofeAtual={estrofeAtual}
        onObjetoAtivado={handleObjetoAtivado}
      />

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

      {/* Área central: estrofe */}
      <div className="pointer-events-none relative z-[5] flex min-h-dvh items-center justify-center">
        {fim ? null : estrofeVisivel ? (
          <EstrofeDisplay
            versos={estrofeVisivel}
            estrofeKey={estrofeAtual}
            ultima={estrofeAtual === poema.estrofes.length - 1}
          />
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-[11px] uppercase tracking-[3px] text-[#6a5898]"
          >
            toque no símbolo dourado para começar
          </motion.p>
        )}
      </div>

      <Contador total={poema.estrofes.length} atual={estrofeAtual} />

      <AudioPlayer
        titulo={poema.titulo}
        narrTocando={narrTocando}
        trilhaTocando={trilhaTocando}
        onToggleNarracao={toggleNarracao}
        onToggleTrilha={toggleTrilha}
        analyser={analyser}
      />

      {bursts.map((b) => (
        <ParticleBurst key={b.id} burst={b} />
      ))}

      {fim && <FimPoema versos={ultimaEstrofe} />}
    </motion.div>
  );
}
