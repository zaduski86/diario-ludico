"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  getArelahProgresso,
  getLeitorLocal,
  jaDeixouSussurro,
  leuTodosPoemas,
  receberChave,
  destrancarLivro,
} from "@/lib/supabase";
import { capitulosLiberados } from "@/lib/arelah";
import BausModal from "./BausModal";
import ConviteSussurroModal from "./ConviteSussurroModal";
import ChaveModal from "./ChaveModal";
import ChaveFlutuante from "./ChaveFlutuante";
import LivroTrancado from "./LivroTrancado";

type Estado = "baus" | "convite" | "chave" | null;

function posAleatoria() {
  return {
    top: 14 + Math.random() * 64,
    left: 6 + Math.random() * 84,
  };
}

export default function ArelahHub() {
  const router = useRouter();

  const [todosLidos, setTodosLidos] = useState(false);
  const [jaSussurrou, setJaSussurrou] = useState(false);
  const [chaveRecebidaEm, setChaveRecebidaEm] = useState<string | null>(null);
  const [livroDestrancadoEm, setLivroDestrancadoEm] = useState<
    string | null
  >(null);

  const [modal, setModal] = useState<Estado>(null);
  const [chaveEhNova, setChaveEhNova] = useState(false);

  const recarregar = useCallback(async () => {
    const leitor = getLeitorLocal();
    if (!leitor) {
      setTodosLidos(false);
      setJaSussurrou(false);
      setChaveRecebidaEm(null);
      setLivroDestrancadoEm(null);
      return;
    }
    const [lidos, sussurrou, progresso] = await Promise.all([
      leuTodosPoemas(leitor.id),
      jaDeixouSussurro(leitor.id),
      getArelahProgresso(leitor.id),
    ]);
    setTodosLidos(lidos);
    setJaSussurrou(sussurrou);
    setChaveRecebidaEm(progresso.chaveRecebidaEm);
    setLivroDestrancadoEm(progresso.livroDestrancadoEm);
  }, []);

  useEffect(() => {
    recarregar();
    // Mesmo motivo do AmpulhetasProgresso: o hub pode voltar a ficar
    // visível sem remontar, deixando o estado do gênio/livro desatualizado.
    function aoVoltarAFicarVisivel() {
      if (document.visibilityState === "visible") recarregar();
    }
    window.addEventListener("focus", recarregar);
    document.addEventListener("visibilitychange", aoVoltarAFicarVisivel);
    return () => {
      window.removeEventListener("focus", recarregar);
      document.removeEventListener("visibilitychange", aoVoltarAFicarVisivel);
    };
  }, [recarregar]);

  const temChave = Boolean(chaveRecebidaEm) && !livroDestrancadoEm;
  const destrancado = Boolean(livroDestrancadoEm);

  async function clicarGenio() {
    if (!todosLidos) {
      setModal("baus");
      return;
    }
    if (!jaSussurrou) {
      setModal("convite");
      return;
    }
    if (!chaveRecebidaEm) {
      const leitor = getLeitorLocal();
      if (leitor) await receberChave(leitor);
      setChaveEhNova(true);
      setModal("chave");
      await recarregar();
      return;
    }
    if (!livroDestrancadoEm) {
      setChaveEhNova(false);
      setModal("chave");
      return;
    }
    setModal("baus");
  }

  async function usarChave() {
    const leitor = getLeitorLocal();
    if (!leitor) return;
    await destrancarLivro(leitor);
    await recarregar();
    router.push(`/arelah/${capitulosLiberados(new Date().toISOString())}`);
  }

  function abrirLivro() {
    if (!livroDestrancadoEm) return;
    router.push(`/arelah/${capitulosLiberados(livroDestrancadoEm)}`);
  }

  return (
    <>
      <GenioFlutuante onClick={clicarGenio} />
      {temChave && <ChaveFlutuante onSoltarNoLivro={usarChave} />}

      <LivroTrancado
        temChave={temChave}
        destrancado={destrancado}
        onAbrir={abrirLivro}
        onSoltarChave={usarChave}
      />

      {modal === "baus" && <BausModal onClose={() => setModal(null)} />}
      {modal === "convite" && (
        <ConviteSussurroModal
          onClose={() => setModal(null)}
          onEnviado={recarregar}
        />
      )}
      {modal === "chave" && (
        <ChaveModal primeiraVez={chaveEhNova} onClose={() => setModal(null)} />
      )}
    </>
  );
}

function GenioFlutuante({ onClick }: { onClick: () => void }) {
  const [pos, setPos] = useState(posAleatoria);
  const [visivel, setVisivel] = useState(true);
  const [montado, setMontado] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    setMontado(true);
    function agendarProximoVoo() {
      const duracaoVooMs = 4000 + Math.random() * 5000;
      timeoutRef.current = setTimeout(() => {
        const vaiSumir = Math.random() < 0.35;
        if (vaiSumir) {
          setVisivel(false);
          const pausaMs = 2500 + Math.random() * 4000;
          timeoutRef.current = setTimeout(() => {
            setPos(posAleatoria());
            setVisivel(true);
            agendarProximoVoo();
          }, pausaMs);
        } else {
          setPos(posAleatoria());
          agendarProximoVoo();
        }
      }, duracaoVooMs);
    }
    agendarProximoVoo();
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (!montado) return null;

  return createPortal(
    <motion.button
      onClick={onClick}
      aria-label="Um sussurro passa voando por perto"
      animate={{
        top: `${pos.top}vh`,
        left: `${pos.left}vw`,
        opacity: visivel ? 1 : 0,
      }}
      transition={{ duration: 5, ease: "easeInOut" }}
      style={{
        position: "fixed",
        pointerEvents: visivel ? "auto" : "none",
      }}
      className="z-[200] flex h-9 w-9 items-center justify-center rounded-full text-[19px] transition-transform hover:scale-125"
    >
      🧞
    </motion.button>,
    document.body,
  );
}
