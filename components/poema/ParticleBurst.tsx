"use client";

import { motion } from "framer-motion";

export type Burst = { id: number; x: number; y: number };

export default function ParticleBurst({ burst }: { burst: Burst }) {
  const particles = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 40 + Math.random() * 70;
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      delay: Math.random() * 0.08,
    };
  });

  return (
    <div
      className="pointer-events-none fixed z-[15]"
      style={{ left: burst.x, top: burst.y }}
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-[#f0c84a]"
          style={{ boxShadow: "0 0 8px rgba(240,200,74,0.9)" }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.9, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
