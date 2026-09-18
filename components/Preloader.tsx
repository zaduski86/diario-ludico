"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ASSETS = [
  "/assets/images/autor.png",
  "/assets/images/poema1.jpg",
  "/assets/images/poema2.jpg",
  "/assets/images/poema3.png",
];

export default function Preloader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [progresso, setProgresso] = useState(0);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let carregados = 0;
    const total = ASSETS.length;

    function avancar() {
      carregados++;
      setProgresso(Math.round((carregados / total) * 100));
      if (carregados >= total) {
        setTimeout(() => setPronto(true), 300);
      }
    }

    ASSETS.forEach((src) => {
      const img = new window.Image();
      img.onload = avancar;
      img.onerror = avancar;
      img.src = src;
    });
  }, []);

  return (
    <>
      <AnimatePresence>
        {!pronto && (
          <motion.div
            key="preloader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-[#06040f]"
          >
            <div className="mb-5 h-px w-40 overflow-hidden bg-[rgba(200,160,48,0.2)]">
              <motion.div
                className="h-full bg-[#c8a030]"
                animate={{ width: `${progresso}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-[10px] uppercase tracking-[4px] text-[#6a5898]">
              {progresso}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {pronto && children}
    </>
  );
}
