"use client";

import { useEffect, useRef, useState } from "react";
import { Howl, Howler } from "howler";
import type { Poema } from "@/lib/poemas";

export function useAudioPoema(poema: Poema) {
  const narrRef = useRef<Howl | null>(null);
  const trilhaRef = useRef<Howl | null>(null);
  const [narrTocando, setNarrTocando] = useState(false);
  const [trilhaTocando, setTrilhaTocando] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    const narr = new Howl({ src: [poema.narracao], html5: true });
    const trilha = new Howl({ src: [poema.trilha], loop: true, volume: 0 });
    narrRef.current = narr;
    trilhaRef.current = trilha;

    narr.on("end", () => setNarrTocando(false));
    narr.on("pause", () => setNarrTocando(false));
    narr.on("play", () => setNarrTocando(true));

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
      trilha.fade(trilha.volume(), 0.22, 2000);
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
