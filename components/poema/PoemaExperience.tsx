"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { poemas, type Poema } from "@/lib/poemas";
import {
  registrarVisita,
  marcarPoemaLido,
  leuTodosPoemas,
  getLeitorLocal,
} from "@/lib/supabase";
import SceneCanvas from "./SceneCanvas";
import StanzaSection from "./StanzaSection";
import EndSection from "./EndSection";
import ProgressDots from "./ProgressDots";
import FontSizeToggle from "./FontSizeToggle";
import ResumoLeitura from "./ResumoLeitura";
import QuoteCard from "./QuoteCard";
import Comentarios from "./Comentarios";
import GenioModal from "../GenioModal";
import { useFontScale } from "./useFontScale";

const CHAVE_PROGRESSO = (slug: string) => `diario-ludico:progresso:${slug}`;
const CHAVE_GENIO_VISTO = "diario-ludico:genio-visto";

export default function PoemaExperience({ poema }: { poema: Poema }) {
  const [progresso, setProgresso] = useState(0);
  const [estrofeAtual, setEstrofeAtual] = useState(0);
  const [versoCompartilhar, setVersoCompartilhar] = useState<string | null>(
    null,
  );
  const [mostrarResumo, setMostrarResumo] = useState(false);
  const [mostrarGenio, setMostrarGenio] = useState(false);
  const [escala, setEscala] = useFontScale();
  const tickAgendado = useRef(false);
  const ultimoSalvo = useRef(0);
  const resumoDecidido = useRef(false);
  const leituraMarcada = useRef(false);

  const indiceAtual = poemas.findIndex((p) => p.slug === poema.slug);
  const proximo = poemas[indiceAtual + 1];

  useEffect(() => {
    registrarVisita(poema.slug);
  }, [poema.slug]);

  // Oferece retomar a leitura de onde parou, se houver progresso salvo.
  useEffect(() => {
    resumoDecidido.current = false;
    try {
      const salvo = Number(
        window.localStorage.getItem(CHAVE_PROGRESSO(poema.slug)) ?? "0",
      );
      if (salvo > 0.05 && salvo < 0.95) setMostrarResumo(true);
    } catch {
      // Sem localStorage — segue sem oferecer retomada.
    }
  }, [poema.slug]);

  useEffect(() => {
    const primeiraChamada = { valor: true };

    function medir() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? window.scrollY / total : 0;
      const clamped = Math.min(1, Math.max(0, p));
      setProgresso(clamped);
      tickAgendado.current = false;

      // A primeira medição acontece no mount, antes do leitor decidir se
      // quer retomar a leitura salva — não pode sobrescrever esse valor.
      if (primeiraChamada.valor) {
        primeiraChamada.valor = false;
        return;
      }

      const agora = Date.now();
      if (agora - ultimoSalvo.current > 400) {
        ultimoSalvo.current = agora;
        try {
          // Mantém o valor salvo mesmo perto do fim — é a única fonte de
          // verdade pras ampulhetas do hub quando o registro de "leitura
          // completa" no banco falha ou demora (ex.: rede instável no
          // celular). O banner de retomada já ignora valores >=0.95 por
          // conta própria, então isso não afeta aquela lógica.
          window.localStorage.setItem(
            CHAVE_PROGRESSO(poema.slug),
            String(clamped),
          );
        } catch {
          // Preferência de retomada não será salva.
        }
      }
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
  }, [poema.slug]);

  // Ao terminar o poema, marca a leitura (silenciosamente) e, se essa era a
  // última peça faltando, revela o gênio que libera os sussurros.
  useEffect(() => {
    if (leituraMarcada.current || progresso < 0.85) return;
    leituraMarcada.current = true;
    (async () => {
      const leitor = getLeitorLocal();
      if (!leitor) return;
      await marcarPoemaLido(poema.slug);
      let jaVisto = false;
      try {
        jaVisto = window.localStorage.getItem(CHAVE_GENIO_VISTO) === "1";
      } catch {
        // Assume que não viu ainda.
      }
      if (jaVisto) return;
      const completou = await leuTodosPoemas(leitor.id);
      if (completou) setMostrarGenio(true);
    })();
  }, [progresso, poema.slug]);

  function fecharGenio() {
    setMostrarGenio(false);
    try {
      window.localStorage.setItem(CHAVE_GENIO_VISTO, "1");
    } catch {
      // Sem localStorage — pode reaparecer numa próxima visita.
    }
  }

  // Marca qual estrofe está mais próxima do centro da tela (para os pontos de navegação).
  useEffect(() => {
    const secoes = poema.estrofes.map((_, i) =>
      document.getElementById(`estrofe-${i}`),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = secoes.findIndex((el) => el === entry.target);
            if (i >= 0) setEstrofeAtual(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    secoes.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [poema.estrofes, poema.slug]);

  function continuarLeitura() {
    setMostrarResumo(false);
    resumoDecidido.current = true;
    try {
      const salvo = Number(
        window.localStorage.getItem(CHAVE_PROGRESSO(poema.slug)) ?? "0",
      );
      const total = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: salvo * total, behavior: "smooth" });
    } catch {
      // Sem localStorage — nada a retomar.
    }
  }

  function comecarDoInicio() {
    setMostrarResumo(false);
    resumoDecidido.current = true;
    try {
      window.localStorage.removeItem(CHAVE_PROGRESSO(poema.slug));
    } catch {
      // Nada a limpar.
    }
  }

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

      {/* Matiz sutil para diferenciar poemas que reaproveitam a mesma cena */}
      {poema.corAmbiente && (
        <div
          className="pointer-events-none fixed inset-0 z-[4]"
          style={{
            backgroundColor: poema.corAmbiente,
            opacity: 0.1,
            mixBlendMode: "overlay",
          }}
        />
      )}

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
        onClick={() => {
          window.location.href = "/hub";
        }}
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

      <FontSizeToggle escala={escala} onChange={setEscala} />
      <ProgressDots total={poema.estrofes.length} atual={estrofeAtual} />

      <AnimatePresence>
        {mostrarResumo && (
          <ResumoLeitura
            onContinuar={continuarLeitura}
            onComecarDoInicio={comecarDoInicio}
          />
        )}
      </AnimatePresence>

      {mostrarGenio && <GenioModal onClose={fecharGenio} />}

      {versoCompartilhar && (
        <QuoteCard
          slug={poema.slug}
          verso={versoCompartilhar}
          titulo={poema.titulo}
          imagem={poema.imagem}
          onClose={() => setVersoCompartilhar(null)}
        />
      )}

      {/* Conteúdo — estrofes reveladas ao rolar a página */}
      <main className="relative z-[5]">
        <div className="h-[14vh]" />
        {poema.estrofes.map((versos, i) => (
          <StanzaSection
            key={i}
            id={`estrofe-${i}`}
            versos={versos}
            ultima={i === poema.estrofes.length - 1}
            estilo={poema.estilo}
            escala={escala}
            onVersoClick={setVersoCompartilhar}
          />
        ))}
        <EndSection
          slug={poema.slug}
          titulo={poema.titulo}
          proximoPoema={
            proximo ? { slug: proximo.slug, titulo: proximo.titulo } : undefined
          }
        />
        <Comentarios poemaSlug={poema.slug} />
      </main>
    </motion.div>
  );
}
