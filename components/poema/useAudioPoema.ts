"use client";

import { useEffect, useRef, useState } from "react";
import { Howl, Howler } from "howler";
import type { Poema } from "@/lib/poemas";

const TRILHA_VOLUME_BASE = 0.4;
const TRILHA_VOLUME_DUCK = 0.12;

let compressorInstalado = false;

/**
 * Insere um compressor suave entre o master gain do Howler e a saída de
 * áudio, uma única vez por sessão — deixa o volume mais consistente entre
 * a narração e a trilha, sem precisar reprocessar os arquivos de origem.
 */
function instalarCompressor() {
  if (compressorInstalado) return;
  try {
    const ctx = Howler.ctx as AudioContext;
    const masterGain = (Howler as unknown as { masterGain: GainNode })
      .masterGain;
    if (!ctx || !masterGain) return;
    masterGain.disconnect();
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -22;
    compressor.knee.value = 24;
    compressor.ratio.value = 3.5;
    compressor.attack.value = 0.006;
    compressor.release.value = 0.25;
    masterGain.connect(compressor);
    compressor.connect(ctx.destination);
    compressorInstalado = true;
  } catch {
    // Sem suporte a Web Audio — segue tocando sem o compressor.
  }
}

export function useAudioPoema(poema: Poema) {
  const narrRef = useRef<Howl | null>(null);
  const trilhaRef = useRef<Howl | null>(null);
  const [narrTocando, setNarrTocando] = useState(false);
  const [trilhaTocando, setTrilhaTocando] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    const narr = new Howl({ src: [poema.narracao] });
    const trilha = new Howl({ src: [poema.trilha], loop: true, volume: 0 });
    narrRef.current = narr;
    trilhaRef.current = trilha;

    function abaixarTrilha() {
      const t = trilhaRef.current;
      if (t && t.playing()) t.fade(t.volume(), TRILHA_VOLUME_DUCK, 500);
    }
    function restaurarTrilha() {
      const t = trilhaRef.current;
      if (t && t.playing()) t.fade(t.volume(), TRILHA_VOLUME_BASE, 900);
    }

    narr.on("end", () => {
      setNarrTocando(false);
      restaurarTrilha();
    });
    narr.on("pause", () => {
      setNarrTocando(false);
      restaurarTrilha();
    });
    narr.on("play", () => {
      setNarrTocando(true);
      abaixarTrilha();
    });

    instalarCompressor();

    try {
      const ctx = Howler.ctx as AudioContext;
      const masterGain = (Howler as unknown as { masterGain: GainNode })
        .masterGain;
      if (ctx && masterGain) {
        const an = ctx.createAnalyser();
        an.fftSize = 128;
        masterGain.connect(an);
        setAnalyser(an);
      }
    } catch {
      // Visualizador é decorativo; ignorar se Web Audio não estiver disponível.
    }

    return () => {
      narr.stop();
      narr.unload();
      trilha.stop();
      trilha.unload();
    };
  }, [poema.narracao, poema.trilha]);

  function toggleNarracao() {
    const narr = narrRef.current;
    if (!narr) return;
    if (narr.playing()) narr.pause();
    else narr.play();
  }

  function toggleTrilha() {
    const trilha = trilhaRef.current;
    if (!trilha) return;
    if (trilha.playing()) {
      trilha.pause();
      setTrilhaTocando(false);
    } else {
      trilha.play();
      const alvo = narrRef.current?.playing()
        ? TRILHA_VOLUME_DUCK
        : TRILHA_VOLUME_BASE;
      trilha.fade(trilha.volume(), alvo, 2000);
      setTrilhaTocando(true);
    }
  }

  return {
    narrTocando,
    trilhaTocando,
    toggleNarracao,
    toggleTrilha,
    analyser,
  };
}
