"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const W = 1080;
const H = 1350;

function quebrarLinhas(
  ctx: CanvasRenderingContext2D,
  texto: string,
  maxWidth: number,
): string[] {
  const palavras = texto.split(" ");
  const linhas: string[] = [];
  let atual = "";
  for (const palavra of palavras) {
    const teste = atual ? `${atual} ${palavra}` : palavra;
    if (ctx.measureText(teste).width > maxWidth && atual) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = teste;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

export default function QuoteCard({
  verso,
  titulo,
  imagem,
  onClose,
}: {
  verso: string;
  titulo: string;
  imagem: string;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imagem;
    img.onload = () => {
      canvas.width = W;
      canvas.height = H;

      const escala = Math.max(W / img.width, H / img.height);
      const iw = img.width * escala;
      const ih = img.height * escala;
      ctx.drawImage(img, (W - iw) / 2, (H - ih) / 2, iw, ih);

      const grad = ctx.createLinearGradient(0, H * 0.25, 0, H);
      grad.addColorStop(0, "rgba(6,4,15,0.15)");
      grad.addColorStop(0.55, "rgba(6,4,15,0.72)");
      grad.addColorStop(1, "rgba(6,4,15,0.92)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign = "center";
      ctx.fillStyle = "#f0c84a";
      ctx.font = "italic 500 52px Georgia, serif";
      const maxWidth = W - 160;
      const linhas = quebrarLinhas(ctx, verso, maxWidth);
      const lineHeight = 68;
      const blocoAltura = linhas.length * lineHeight;
      let y = H - 260 - blocoAltura + lineHeight;
      for (const linha of linhas) {
        ctx.fillText(linha, W / 2, y);
        y += lineHeight;
      }

      ctx.fillStyle = "rgba(240,236,255,0.75)";
      ctx.font = "26px Georgia, serif";
      ctx.fillText(titulo, W / 2, H - 140);

      ctx.fillStyle = "rgba(200,160,48,0.7)";
      ctx.font = "18px Georgia, serif";
      ctx.fillText("DIÁRIO LÚDICO DA REALIDADE PARALELA", W / 2, H - 90);

      setPronto(true);
    };
  }, [verso, titulo, imagem]);

  function baixar() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-verso.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-5 bg-[rgba(6,4,15,0.92)] p-6 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[70vh] w-full max-w-[340px] overflow-hidden rounded-sm border border-[rgba(200,160,48,0.3)] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          <canvas ref={canvasRef} className="block h-auto w-full" />
          {!pronto && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0d0820] text-[11px] uppercase tracking-[3px] text-[#6a5898]">
              gerando…
            </div>
          )}
        </motion.div>
        <div className="flex gap-3">
          <button
            onClick={baixar}
            disabled={!pronto}
            className="border border-[rgba(200,160,48,0.4)] px-6 py-2.5 text-[11px] uppercase tracking-[3px] text-[#c8a030] transition-colors hover:bg-[rgba(200,160,48,0.08)] hover:text-[#f0c84a] disabled:opacity-40"
          >
            Baixar imagem
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-[11px] uppercase tracking-[3px] text-[#6a5898] transition-colors hover:text-[#c8a030]"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
