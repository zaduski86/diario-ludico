"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { texturaNuvens, texturaParticulaSuave, texturaPena } from "./texturas";

const DUST_COUNT = 200;
const FEATHER_COUNT = 14;

function Poeira() {
  const ref = useRef<THREE.Points>(null);
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const seeds = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      seeds[i * 3] = Math.random() * 10;
      seeds[i * 3 + 1] = Math.random() * 10;
      seeds[i * 3 + 2] = Math.random() * 10;
    }
    return { positions, seeds };
  }, []);

  useFrame((state) => {
    const geom = ref.current?.geometry;
    if (!geom) return;
    const arr = geom.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < DUST_COUNT; i++) {
      arr[i * 3] += Math.sin(t * 0.5 + seeds[i * 3]) * 0.002;
      arr[i * 3 + 1] += Math.cos(t * 0.4 + seeds[i * 3 + 1]) * 0.002;
      arr[i * 3 + 2] += Math.sin(t * 0.3 + seeds[i * 3 + 2]) * 0.001;
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        map={texturaParticulaSuave("200,192,224")}
        color="#c8c0e0"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

function Lua() {
  const cloudsRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => (typeof document !== "undefined" ? texturaNuvens() : null), []);

  useFrame((_, delta) => {
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group position={[-3.2, 2.2, -5]}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#e8e4f0" emissive="#dcd8ee" emissiveIntensity={0.4} roughness={0.9} />
      </mesh>
      {texture && (
        <mesh ref={cloudsRef} scale={1.04}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial map={texture} transparent opacity={0.5} depthWrite={false} />
        </mesh>
      )}
      <pointLight color="#e8e4f0" intensity={1.4} distance={8} />
    </group>
  );
}

function PenasEspiral() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const feathers = useMemo(
    () =>
      Array.from({ length: FEATHER_COUNT }, () => ({
        radius: 2.8 + Math.random() * 3,
        speed: 0.2 + Math.random() * 0.3,
        yStart: Math.random() * 8 - 2,
        fallSpeed: 0.15 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );

  useFrame((state, delta) => {
    const m = meshRef.current;
    if (!m) return;
    feathers.forEach((f, i) => {
      f.yStart -= f.fallSpeed * delta;
      if (f.yStart < -4) f.yStart = 5;
      const a = state.clock.elapsedTime * f.speed + f.phase;
      const x = Math.cos(a) * f.radius;
      const z = Math.sin(a) * f.radius - 4;
      dummy.position.set(x, f.yStart, z);
      dummy.rotation.set(a, a * 0.6, Math.sin(a) * 0.5);
      dummy.scale.setScalar(0.07);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, FEATHER_COUNT]}>
      <planeGeometry args={[0.4, 1]} />
      <meshBasicMaterial
        map={texturaPena()}
        transparent
        opacity={0.6}
        alphaTest={0.1}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

export default function Scene3({ progress }: { progress: number }) {
  return (
    <>
      <ambientLight intensity={0.2} color="#2a2050" />
      <directionalLight position={[-3, 3, 2]} color="#8878c8" intensity={0.5} />
      <Lua />
      <Poeira />
      <PenasEspiral />
      <fog attach="fog" args={["#06040f", 3 + progress * 2, 16]} />
    </>
  );
}
