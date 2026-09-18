"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function GoldParticles({ imploding }: { imploding: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();
  const count = 260;

  const { positions, radii, speeds, angles0 } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const radii = new Float32Array(count);
    const speeds = new Float32Array(count);
    const angles0 = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 1.5 + Math.random() * 1.6;
      const a = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.4;
      radii[i] = r;
      angles0[i] = a;
      speeds[i] = 0.08 + Math.random() * 0.18;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(a) * r;
    }
    return { positions, radii, speeds, angles0 };
  }, []);

  const t = useRef(0);
  const scaleRef = useRef(1);

  useFrame((_, delta) => {
    t.current += delta;
    scaleRef.current +=
      ((imploding ? 0.02 : 1) - scaleRef.current) * (imploding ? 0.08 : 0.05);
    const geom = pointsRef.current?.geometry;
    if (!geom) return;
    const arr = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const a = angles0[i] + t.current * speeds[i];
      const r = radii[i] * scaleRef.current;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] =
        Math.sin(t.current * speeds[i] * 1.3 + i) * 0.3 * scaleRef.current +
        (positions[i * 3 + 1] * scaleRef.current) / 2.2;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    geom.attributes.position.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.y +=
        (pointer.x * 0.3 - pointsRef.current.rotation.y) * 0.03;
      pointsRef.current.rotation.x +=
        (-pointer.y * 0.2 - pointsRef.current.rotation.x) * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#f0c84a"
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function CoverParticles({
  imploding = false,
}: {
  imploding?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      className="!absolute inset-0"
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <GoldParticles imploding={imploding} />
    </Canvas>
  );
}
