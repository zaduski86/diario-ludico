"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

const LEAF_COUNT = 70;
const PETAL_COUNT = 40;

function FolhasCaindo() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const leaves = useMemo(
    () =>
      Array.from({ length: LEAF_COUNT }, () => ({
        x: (Math.random() - 0.5) * 14,
        y: Math.random() * 10 - 2,
        z: (Math.random() - 0.5) * 6 - 1,
        speed: 0.25 + Math.random() * 0.35,
        swaySpeed: 0.5 + Math.random() * 1,
        swayAmp: 0.4 + Math.random() * 0.6,
        rotSpeed: (Math.random() - 0.5) * 2,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );

  useFrame((state, delta) => {
    const m = meshRef.current;
    if (!m) return;
    leaves.forEach((l, i) => {
      l.y -= l.speed * delta;
      if (l.y < -4) l.y = 6;
      const sway = Math.sin(state.clock.elapsedTime * l.swaySpeed + l.phase) * l.swayAmp;
      dummy.position.set(l.x + sway, l.y, l.z);
      dummy.rotation.set(
        state.clock.elapsedTime * l.rotSpeed,
        state.clock.elapsedTime * l.rotSpeed * 0.7,
        state.clock.elapsedTime * l.rotSpeed * 0.5,
      );
      dummy.scale.setScalar(0.12);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, LEAF_COUNT]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#c8501f"
        emissive="#8a3410"
        emissiveIntensity={0.3}
        side={THREE.DoubleSide}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  );
}

function Petalas() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }, () => ({
        x: (Math.random() - 0.5) * 12,
        y: Math.random() * 6 - 1,
        z: (Math.random() - 0.5) * 5,
        speed: 0.08 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );

  useFrame((state, delta) => {
    const m = meshRef.current;
    if (!m) return;
    petals.forEach((p, i) => {
      p.y -= p.speed * delta;
      if (p.y < -3) p.y = 4;
      const drift = Math.sin(state.clock.elapsedTime * 0.6 + p.phase) * 0.6;
      dummy.position.set(p.x + drift, p.y, p.z);
      dummy.rotation.z = state.clock.elapsedTime * 0.4 + p.phase;
      dummy.scale.setScalar(0.05);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PETAL_COUNT]}>
      <circleGeometry args={[1, 6]} />
      <meshBasicMaterial color="#f0b0c0" transparent opacity={0.55} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function Agua() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]}>
      <planeGeometry args={[24, 14]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={12}
        roughness={0.9}
        depthScale={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.2}
        color="#0a0818"
        metalness={0.4}
      />
    </mesh>
  );
}

function FiosDourados() {
  const group = useRef<THREE.Group>(null);
  const curves = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const y = -1 + i * 0.5;
      const points = Array.from({ length: 6 }, (_, j) => {
        const x = -6 + j * 2.4;
        return new THREE.Vector3(x, y + Math.sin(j + i) * 0.6, (Math.random() - 0.5) * 2);
      });
      return new THREE.CatmullRomCurve3(points);
    });
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 1.2 + i) * 0.2;
    });
  });

  return (
    <group ref={group}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 64, 0.008, 6, false]} />
          <meshBasicMaterial color="#f0c84a" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Nevoa() {
  const ref = useRef<THREE.Points>(null);
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = -2.4 + Math.random() * 1.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    const geom = ref.current?.geometry;
    if (!geom) return;
    const arr = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.06;
      if (arr[i * 3 + 1] > 0) arr[i * 3 + 1] = -2.6;
    }
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.5} color="#8878b0" transparent opacity={0.06} depthWrite={false} />
    </points>
  );
}

export default function Scene2({ progress }: { progress: number }) {
  return (
    <>
      <ambientLight intensity={0.3} color="#5a4a8a" />
      <directionalLight position={[2, 3, 2]} color="#f0a860" intensity={0.7 + progress * 0.2} />
      <FolhasCaindo />
      <Petalas />
      <FiosDourados />
      <Nevoa />
      <Agua />
      <fog attach="fog" args={["#0d0820", 5, 18]} />
    </>
  );
}
