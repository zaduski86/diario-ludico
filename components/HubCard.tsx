"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import type { Poema } from "@/lib/poemas";

export default function HubCard({
  poema,
  onSelect,
  pointer,
}: {
  poema: Poema;
  onSelect: () => void;
  pointer: { x: number; y: number } | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 14 });
  const springY = useSpring(y, { stiffness: 120, damping: 14 });

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotX = useSpring(rotateX, { stiffness: 150, damping: 16 });
  const springRotY = useSpring(rotateY, { stiffness: 150, damping: 16 });

  useEffect(() => {
    if (!ref.current || !pointer) {
      x.set(0);
      y.set(0);
      rotateX.set(0);
      rotateY.set(0);
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = cx - pointer.x;
    const dy = cy - pointer.y;
    const dist = Math.hypot(dx, dy);
    const radius = 220;
    if (dist < radius && dist > 0) {
      const force = (1 - dist / radius) * 26;
      x.set((dx / dist) * force);
      y.set((dy / dist) * force);
      rotateY.set(((pointer.x - cx) / rect.width) * 14);
      rotateX.set((-(pointer.y - cy) / rect.height) * 14);
    } else {
      x.set(0);
      y.set(0);
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [pointer, x, y, rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      onClick={onSelect}
      style={{
        x: springX,
        y: springY,
        rotateX: springRotX,
        rotateY: springRotY,
        transformPerspective: 900,
      }}
      whileHover={{ scale: 1.03 }}
      className="group relative cursor-pointer overflow-hidden rounded-sm border border-[rgba(200,160,48,0.12)] bg-[#0d0820] transition-colors duration-300 hover:border-[rgba(200,160,48,0.45)]"
      layoutId={`poema-card-${poema.slug}`}
    >
      <div className="relative h-[180px] w-full overflow-hidden">
        <Image
          src={poema.imagem}
          alt={poema.titulo}
          fill
          sizes="310px"
          className="object-cover brightness-[0.6] saturate-[0.75] transition-all duration-500 group-hover:scale-110 group-hover:brightness-[0.8] group-hover:saturate-100"
        />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-[#f0c84a]"
              style={{
                left: `${(i * 37) % 100}%`,
                top: i % 2 === 0 ? "-4px" : "184px",
                animation: `flutuarPartícula 1.8s ease-in-out ${i * 0.12}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="mb-1.5 text-[10px] tracking-[3px] text-[#c8a030] opacity-70">
          {poema.numero}
        </div>
        <div className="mb-1 text-sm leading-snug text-[#f0ecff]">
          {poema.titulo}
        </div>
        {poema.sub && (
          <div className="mb-1.5 text-[10px] italic text-[#6a5898]">
            {poema.sub}
          </div>
        )}
        <div className="text-[11px] italic leading-[1.7] text-[#c8c0e0] opacity-55">
          {poema.preview.map((v, i) => (
            <div key={i}>{v}</div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes flutuarPartícula {
          0%,
          100% {
            opacity: 0;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-14px);
          }
        }
      `}</style>
    </motion.div>
  );
}
