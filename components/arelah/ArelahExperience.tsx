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
  const [liberados, setLiberados] = useState(0);

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
      const qtdLiberados = capitulosLiberados(progresso.livroDestrancadoEm);
      setLiberados(qtdLiberados);
      setLiberado(numero <= qtdLiberados && numero <= capitulos.length);
      setCarregando(false);
    })();
  }, [numero, router]);

  if (carregando) return null;

  if (!liberado) return <CapituloTrancado />;

  const capitulo = getCapitulo(numero);
  if (!capitulo) return <CapituloTrancado />;

  // O próximo capítulo só está de fato disponível se ele existir E já tiver
  // sido liberado pra esse leitor hoje — não basta ter sido escrito.
  const proximoDisponivelAgora = numero < liberados && numero < capitulos.length;

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
        onClick={() => {
          window.location.href = "/hub";
        }}
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
            className="mb-9 text-[clamp(23px,3.1vw,30px)] italic leading-[1.9] text-[#f0ecff]"
          >
            {p}
          </motion.p>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1 }}
          className="mx-auto mt-4 max-w-[520px] border-y border-[rgba(200,160,48,0.3)] py-8 text-center"
        >
          <p className="mb-3 text-[9px] uppercase tracking-[5px] text-[#6a5898]">
            fragmento da profecia
          </p>
          <p className="text-[16px] italic leading-relaxed text-[#c8a030]">
            &ldquo;{capitulo.fragmentoProfecia}&rdquo;
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-6 py-24 text-center">
          {proximoDisponivelAgora ? (
            <p className="text-[13px] uppercase tracking-[3px] text-[#c8a030]">
              fim do capítulo — o próximo já está liberado
            </p>
          ) : (
            <p className="glitch-texto max-w-[460px] text-[19px] italic leading-relaxed text-[#c8c0e0]">
              mem...ória carr...egando — vol...te am...anhã
              <br />
              a magia de hoje... já foi.
            </p>
          )}
          <button
            onClick={() => {
              window.location.href = "/hub";
            }}
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
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_50%_30%,#1a1035_0%,#06040f_65%)] px-6 text-center">
      <p className="glitch-texto max-w-[460px] text-[19px] italic leading-relaxed text-[#c8c0e0]">
        mem...ória carr...egando — vol...te am...anhã
        <br />
        a magia de hoje... já foi.
      </p>
      <button
        onClick={() => {
          window.location.href = "/hub";
        }}
        className="border border-[rgba(200,160,48,0.4)] px-7 py-2.5 text-[10px] uppercase tracking-[3px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a]"
      >
        ← voltar ao início
      </button>
    </div>
  );
}
