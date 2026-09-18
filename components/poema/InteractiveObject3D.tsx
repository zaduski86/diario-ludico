"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { ObjetoInterativo } from "@/lib/poemas";

export default function InteractiveObject3D({
  objeto,
  visible,
  onActivate,
}: {
  objeto: ObjetoInterativo;
  visible: boolean;
  onActivate: (screenPos: { x: number; y: number }) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport, camera, size } = useThree();
  const [hovered, setHovered] = useState(false);
  const scaleState = useRef(0);
  const t = useRef(Math.random() * 10);

  const worldX = (objeto.x / 100 - 0.5) * viewport.width;
  const worldY = -(objeto.y / 100 - 0.5) * viewport.height;

  useFrame((_, delta) => {
    t.current += delta;
    const target = visible ? (hovered ? 1.25 : 1) : 0;
    scaleState.current += (target - scaleState.current) * 0.12;
    if (group.current) {
      group.current.scale.setScalar(scaleState.current);
      group.current.position.set(
        worldX,
        worldY + Math.sin(t.current * 0.9) * 0.08,
        0,
      );
    }
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.6;
      mesh.current.rotation.x += delta * 0.25;
    }
  });

  function handleClick(e: { stopPropagation: () => void }) {
    if (!visible) return;
    e.stopPropagation();
    const pos = worldToScreen(worldX, worldY, camera, size);
    onActivate(pos);
  }

  return (
    <group
      ref={group}
      onClick={handleClick}
      onPointerOver={() => {
        if (!visible) return;
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color="#c8a030"
          emissive="#f0c84a"
          emissiveIntensity={hovered ? 2.2 : 1.4}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.34, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <pointLight color="#f0c84a" intensity={visible ? 1.2 : 0} distance={1.6} />
      {visible && (
        <Sparkles count={14} scale={0.55} size={2.5} speed={0.4} color="#f0c84a" opacity={0.7} />
      )}
      {visible && (
        <Html center distanceFactor={8} pointerEvents="none" style={{ pointerEvents: "none" }}>
          <div className="flex flex-col items-center">
            <span className="text-[19px] drop-shadow-[0_0_6px_rgba(240,200,74,0.8)]">
              {objeto.simbolo}
            </span>
            <span className="mt-3.5 whitespace-nowrap text-[9px] uppercase tracking-[2px] text-[#f0c84a] opacity-70">
              {objeto.label}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

function worldToScreen(
  x: number,
  y: number,
  camera: THREE.Camera,
  size: { width: number; height: number },
) {
  const vector = new THREE.Vector3(x, y, 0).project(camera);
  return {
    x: (vector.x * 0.5 + 0.5) * size.width,
    y: (-vector.y * 0.5 + 0.5) * size.height,
  };
}
