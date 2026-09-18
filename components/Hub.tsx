"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { poemas } from "@/lib/poemas";
import HubCard from "./HubCard";
import Starfield from "./Starfield";

export default function Hub() {
  const router = useRouter();
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(
    null,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onMouseMove={(e) => setPointer({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setPointer(null)}
      className="relative flex min-h-dvh w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_30%,#1a1035_0%,#06040f_65%)] px-6 pb-16 pt-28"
    >
      <Starfield count={100} />
      <nav className="fixed left-0 right-0 top-0 z-20 flex items-center bg-gradient-to-b from-[rgba(6,4,15,0.95)] to-transparent px-7 py-3.5">
        <span
          onClick={() => router.push("/")}
          className="cursor-pointer text-[10px] uppercase tracking-[3px] text-[#6a5898] transition-colors hover:text-[#c8a030]"
        >
          ← Diário Lúdico
        </span>
      </nav>

      <h2 className="relative z-10 mb-13 text-[11px] uppercase tracking-[5px] text-[#6a5898]">
        Escolha por onde entrar
      </h2>

      <div className="relative z-10 grid w-full max-w-[1020px] grid-cols-[repeat(auto-fit,minmax(250px,310px))] justify-center gap-6">
        {poemas.map((p) => (
          <HubCard
            key={p.slug}
            poema={p}
            pointer={pointer}
            onSelect={() => router.push(`/poema/${p.slug}`)}
          />
        ))}
      </div>
    </motion.div>
  );
}
