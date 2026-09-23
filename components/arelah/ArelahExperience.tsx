"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  capitulos,
  capitulosLiberados,
  getCapitulo,
  IMAGEM_CAPA,
} from "@/lib/arelah";
import { getArelahProgresso, getLeitorLocal } from "@/lib/supabase";
import SceneCanvas from "@/components/poema/SceneCanvas";

export default function ArelahExperience({ numero }: { numero: number }) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [liberado, setLiberado] = useState(false);

  useEffect(() => {
    (async () => {
      const leitor = getLeitorLocal();
      if (!leitor) {
        router.replace("/hub");
        return;
      }
      const progresso = await getArelahProgresso(leitor.id);
      if (!progresso.livroDestrancadoEm) {
        router.replace("/hub");
        return;
      }
      const liberados = capitulosLiberados(progresso.livroDestrancadoEm);
      setLiberado(numero <= liberados && numero <= capitulos.length);
      setCarregando(false);
    })();
  }, [numero, router]);

  if (carregando) return null;

  if (!liberado) return <CapituloTrancado />;

  const capitulo = getCapitulo(numero);
  if (!capitulo) return <CapituloTrancado />;

  const proximoLiberado = numero < capitulos.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-dvh w-full"
    >
      <div className="fixed inset-0 z-[1]">
        <Image
          src={capitulo.imagem ?? IMAGEM_CAPA}
          alt={capitulo.titulo}
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.5] saturate-[0.85]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 48% at 50% 52%, rgba(6,4,15,0.86) 0%, rgba(6,4,15,0.62) 45%, rgba(6,4,15,0.28) 78%, rgba(6,4,15,0.12) 100%)",
          }}
        />
      </div>

      <SceneCanvas cena={capitulo.cena} progress={0.4} />

      <div className="pointer-events-none fixed left-0 right-0 top-0 z-10 bg-gradient-to-b from-[rgba(6,4,15,0.9)] via-[rgba(6,4,15,0.6)] to-transparent px-5 pb-6 pt-[60px] text-center">
        <p className="mb-1 text-[10px] uppercase tracking-[4px] text-[#c8a030]">
          {capitulo.titulo}
        </p>
        <h1 className="text-[clamp(18px,3.8vw,30px)] italic tracking-[1px] text-[#f0ecff]">
          {capitulo.subtitulo}
        </h1>
      </div>

      <button
        onClick={() => router.push("/hub")}
        className="fixed left-6 top-6 z-20 text-[10px] uppercase tracking-[3px] text-[#6a5898] transition-colors hover:text-[#c8a030]"
      >
        ← Diário Lúdico
      </button>

      <main className="relative z-[5] mx-auto max-w-[720px] px-6">
        <div className="h-[22vh]" />
        {capitulo.paragrafos.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
            className="mb-9 text-[clamp(18px,2.4vw,23px)] italic leading-[1.9] text-[#f0ecff]"
          >
            {p}
          </motion.p>
        ))}

        <div className="flex flex-col items-center gap-6 py-24 text-center">
          {proximoLiberado ? (
            <p className="text-[11px] uppercase tracking-[3px] text-[#4a3f70]">
              fim do capítulo — volte para continuar
            </p>
          ) : (
            <p className="glitch-texto max-w-[420px] text-[15px] italic leading-relaxed text-[#8a7fb0]">
              mem...ória carr...egando — vol...te am...anhã
              <br />
              a magia de hoje... já foi.
            </p>
          )}
          <button
            onClick={() => router.push("/hub")}
            className="border border-[rgba(200,160,48,0.4)] px-7 py-2.5 text-[10px] uppercase tracking-[3px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a]"
          >
            ← voltar ao início
          </button>
        </div>
      </main>
    </motion.div>
  );
}

function CapituloTrancado() {
  const router = useRouter();
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_50%_30%,#1a1035_0%,#06040f_65%)] px-6 text-center">
      <p className="glitch-texto max-w-[420px] text-[16px] italic leading-relaxed text-[#c8c0e0]">
        mem...ória carr...egando — vol...te am...anhã
        <br />
        a magia de hoje... já foi.
      </p>
      <button
        onClick={() => router.push("/hub")}
        className="border border-[rgba(200,160,48,0.4)] px-7 py-2.5 text-[10px] uppercase tracking-[3px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a]"
      >
        ← voltar ao início
      </button>
    </div>
  );
}
