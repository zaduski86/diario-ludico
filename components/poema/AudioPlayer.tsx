"use client";

import { useEffect, useRef } from "react";

export default function AudioPlayer({
  titulo,
  narrTocando,
  trilhaTocando,
  onToggleNarracao,
  onToggleTrilha,
  analyser,
}: {
  titulo: string;
  narrTocando: boolean;
  trilhaTocando: boolean;
  onToggleNarracao: () => void;
  onToggleTrilha: () => void;
  analyser: AnalyserNode | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
    let t = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      const mid = canvas.height / 2;
      let amp = 3;
      if (analyser && data) {
        analyser.getByteFrequencyData(data);
        amp = 2 + (data.reduce((a, b) => a + b, 0) / data.length / 255) * 10;
      }
      t += 0.12;
      for (let x = 0; x <= canvas.width; x += 2) {
        const y = mid + Math.sin(x * 0.15 + t) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#f0c84a";
      ctx.lineWidth = 1.4;
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [analyser]);

  return (
    <div className="fixed right-6 top-5 z-[200] flex items-center gap-2.5 rounded-full border border-[rgba(200,160,48,0.2)] bg-[rgba(13,8,32,0.88)] py-2 pl-2.5 pr-4 backdrop-blur-md">
      <button
        onClick={onToggleNarracao}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(200,160,48,0.4)] text-[11px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.1)]"
        title="Narração"
      >
        {narrTocando ? "⏸" : "▶"}
      </button>
      <canvas ref={canvasRef} width={64} height={24} className="opacity-80" />
      <button
        onClick={onToggleTrilha}
        className="text-[10px] uppercase tracking-[2px] text-[#6a5898] transition-colors hover:text-[#c8a030]"
        title="Trilha sonora"
      >
        {trilhaTocando ? "♪" : "♪̸"}
      </button>
      <div className="hidden flex-col gap-0.5 sm:flex">
        <span className="text-[8px] uppercase tracking-[2px] text-[#6a5898]">
          narração
        </span>
        <span className="whitespace-nowrap text-[10px] text-[#c8c0e0]">
          {titulo}
        </span>
      </div>
    </div>
  );
}
