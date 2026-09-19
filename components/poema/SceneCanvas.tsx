"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Scene1 from "./scenes/Scene1";
import Scene2 from "./scenes/Scene2";
import Scene3 from "./scenes/Scene3";

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
  progress,
}: {
  poemaIndex: number;
  progress: number;
}) {
  const [dprMax, setDprMax] = useState(1.5);
  const [bloomAtivo, setBloomAtivo] = useState(true);
  const Cena = CENAS[poemaIndex % CENAS.length];

  return (
    <div className="fixed inset-0 z-[3]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, dprMax]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          if (detectarGpuFraca(gl.getContext())) {
            setDprMax(1);
            setBloomAtivo(false);
          }
        }}
      >
        <Suspense fallback={null}>
          <Cena progress={progress} />
          {bloomAtivo && (
            <EffectComposer multisampling={0}>
              <Bloom
                intensity={0.5}
                luminanceThreshold={0.5}
                luminanceSmoothing={0.25}
                mipmapBlur
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
