"use client";

import { useEffect, useState } from "react";

type Star = {
  left: number;
  top: number;
  opacity: number;
  size: number;
  duration: number;
  delay: number;
};

export default function Starfield({ count = 120 }: { count?: number }) {
  const [stars, setStars] = useState<Star[] | null>(null);

  useEffect(() => {
    setStars(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.1,
        size: Math.random() < 0.12 ? 2 : 1,
        duration: Math.random() * 3 + 3,
        delay: Math.random() * 4,
      })),
    );
  }, [count]);

  if (!stars) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
