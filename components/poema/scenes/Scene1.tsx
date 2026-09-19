"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { texturaParticulaSuave } from "./texturas";

const BIRD_COUNT = 9;
const EMBER_COUNT = 220;

function Embers() {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds, drifts } = useMemo(() => {
    const positions = new Float32Array(EMBER_COUNT * 3);
    const speeds = new Float32Array(EMBER_COUNT);
    const drifts = new Float32Array(EMBER_COUNT);
    for (let i = 0; i < EMBER_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      speeds[i] = 0.25 + Math.random() * 0.5;
      drifts[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, drifts };
  }, []);

  useFrame((state, delta) => {
    const geom = ref.current?.geometry;
    if (!geom) return;
    const arr = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < EMBER_COUNT; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      arr[i * 3] += Math.sin(state.clock.elapsedTime * 0.4 + drifts[i]) * 0.003;
      if (arr[i * 3 + 1] > 4.5) {
        arr[i * 3 + 1] = -4.5;
        arr[i * 3] = (Math.random() - 0.5) * 14;
      }
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        map={texturaParticulaSuave("240,200,74")}
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

function Vento() {
  const ref = useRef<THREE.Points>(null);
  const count = 60;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4 - 3;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    const geom = ref.current?.geometry;
    if (!geom) return;
    const arr = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += delta * 1.6;
      if (arr[i * 3] > 8) arr[i * 3] = -8;
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        map={texturaParticulaSuave("200,192,224")}
        color="#c8c0e0"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Passaros() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const birds = useMemo(
    () =>
      Array.from({ length: BIRD_COUNT }, () => ({
        offset: Math.random() * Math.PI * 2,
        radius: 2.5 + Math.random() * 2.5,
        speed: 0.15 + Math.random() * 0.15,
        height: (Math.random() - 0.5) * 3,
        depth: -1 - Math.random() * 3,
      })),
    [],
  );

  useFrame((state) => {
    const m = meshRef.current;
    if (!m) return;
    birds.forEach((b, i) => {
      const a = state.clock.elapsedTime * b.speed + b.offset;
      const x = Math.cos(a) * b.radius;
      const y = b.height + Math.sin(a * 2) * 0.3;
      const z = b.depth + Math.sin(a) * 0.5;
      dummy.position.set(x, y, z);
      dummy.rotation.z = Math.sin(a * 4) * 0.3;
      dummy.rotation.y = -a + Math.PI / 2;
      dummy.scale.setScalar(0.08);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, BIRD_COUNT]}>
      <coneGeometry args={[1, 0.3, 3]} />
      <meshBasicMaterial color="#1a1428" />
    </instancedMesh>
  );
}

export default function Scene1({ progress }: { progress: number }) {
  const light = useRef<THREE.DirectionalLight>(null);
  useFrame(() => {
    if (!light.current) return;
    const c1 = new THREE.Color("#2a3a6b");
    const c2 = new THREE.Color("#f0c84a");
    light.current.color.copy(c1).lerp(c2, progress);
    light.current.intensity = 0.6 + progress * 0.5;
  });

  return (
    <>
      <ambientLight intensity={0.25} color="#3a2f6b" />
      <directionalLight ref={light} position={[3, 2, 4]} />
      <Embers />
      <Vento />
      <Passaros />
      <fog attach="fog" args={["#06040f", 4, 16]} />
    </>
  );
}
