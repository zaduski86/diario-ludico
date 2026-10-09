"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Pinyon_Script } from "next/font/google";
import { capitulos, getCapitulo, IMAGEM_CAPA } from "@/lib/arelah";
import SceneCanvas from "@/components/poema/SceneCanvas";

const caligrafia = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
});

export default function ArelahExperience({ numero }: { numero: number }) {
  const router = useRouter();

  const capitulo = getCapitulo(numero);
  if (!capitulo) return <CapituloAindaNaoEscrito />;

  const temProximo = numero < capitulos.length;

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
          className="object-cover blur-[6px] brightness-[0.3] saturate-[0.85]"
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
        <div className="h-[18vh]" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mx-auto mb-16 w-fit max-w-[min(100vw-48px,960px)] border border-[rgba(200,160,48,0.35)] shadow-[0_0_60px_rgba(0,0,0,0.6)]"
        >
          <Image
            src={capitulo.imagem ?? IMAGEM_CAPA}
            alt={capitulo.subtitulo}
            width={1376}
            height={768}
            priority
            sizes="(max-width: 1008px) 100vw, 960px"
            className="block h-auto max-h-[78vh] w-auto max-w-full object-contain"
          />
        </motion.div>
        {capitulo.paragrafos.map((p, i) => {
          const verso = p.startsWith("> ");
          return (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8 }}
              className={
                verso
                  ? "mx-auto mb-9 max-w-[560px] border-l border-[rgba(200,160,48,0.5)] pl-5 text-[clamp(20px,2.6vw,25px)] italic leading-[1.8] text-[#f0c84a]"
                  : "mb-9 text-[clamp(23px,3.1vw,30px)] italic leading-[1.9] text-[#f0ecff]"
              }
            >
              {verso ? p.slice(2) : p}
            </motion.p>
          );
        })}

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

        {capitulo.dedicatoria && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 2 }}
            className="mx-auto mt-40 max-w-[560px] text-center"
          >
            <p
              className={`${caligrafia.className} text-[clamp(30px,5vw,44px)] italic leading-[1.5] text-[#f0ecff]`}
            >
              {capitulo.dedicatoria}
            </p>
            <p className="mt-16 text-[11px] uppercase tracking-[8px] text-[#6a5898]">
              fim
            </p>
          </motion.div>
        )}

        <div className="flex flex-col items-center gap-6 py-24 text-center">
          {temProximo ? (
            <button
              onClick={() => router.push(`/arelah/${numero + 1}`)}
              className="border border-[rgba(200,160,48,0.6)] px-8 py-3 text-[12px] uppercase tracking-[3px] text-[#f0c84a] transition-colors hover:bg-[rgba(200,160,48,0.1)]"
            >
              próximo capítulo →
            </button>
          ) : capitulo.dedicatoria ? null : (
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

function CapituloAindaNaoEscrito() {
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
