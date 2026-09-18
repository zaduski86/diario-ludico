"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { Poema } from "@/lib/poemas";
import Scene1 from "./scenes/Scene1";
import Scene2 from "./scenes/Scene2";
import Scene3 from "./scenes/Scene3";
import InteractiveObject3D from "./InteractiveObject3D";

const CENAS = [Scene1, Scene2, Scene3];

function detectarGpuFraca(gl: WebGLRenderingContext): boolean {
  try {
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    if (!info) return false;
    const renderer = (
      gl.getParameter(info.UNMASKED_RENDERER_WEBGL) as string
    ).toLowerCase();
    return /(swiftshader|llvmpipe|software|intel hd|mali-4)/.test(renderer);
  } catch {
    return false;
  }
}

export default function SceneCanvas({
  poemaIndex,
  poema,
  estrofeAtual,
  onObjetoAtivado,
}: {
  poemaIndex: number;
  poema: Poema;
  estrofeAtual: number;
  onObjetoAtivado: (index: number, screenPos: { x: number; y: number }) => void;
}) {
  const [dprMax, setDprMax] = useState(1.5);
  const Cena = CENAS[poemaIndex % CENAS.length];
  const progress = Math.min(1, (estrofeAtual + 1) / poema.estrofes.length);
  const proximoObjeto =
    estrofeAtual + 1 < poema.estrofes.length ? estrofeAtual + 1 : -1;

  return (
    <div className="fixed inset-0 z-[3]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, dprMax]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          if (detectarGpuFraca(gl.getContext())) setDprMax(1);
        }}
      >
        <Suspense fallback={null}>
          <Cena progress={progress} />
          {poema.objetos.map((obj, i) => (
            <InteractiveObject3D
              key={i}
              objeto={obj}
              visible={i === proximoObjeto}
              onActivate={(pos) => onObjetoAtivado(i, pos)}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
