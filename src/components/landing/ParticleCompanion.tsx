'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ACCENT = '#8A7FFF';
const SIGNAL = '#E8577E';

function Cloud({ count, hue }: { count: number; hue: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.18), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff }), []);

  const seeds = useMemo(() => {
    const arr: { r: number; theta: number; phi: number; speed: number }[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        r: 1.2 + Math.random() * 1.4,
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos(2 * Math.random() - 1),
        speed: 0.15 + Math.random() * 0.25,
      });
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const theta = s.theta + t * s.speed * 0.3;
      const x = s.r * Math.sin(s.phi) * Math.cos(theta);
      const y = s.r * Math.sin(s.phi) * Math.sin(theta) * 0.6;
      const z = s.r * Math.cos(s.phi);
      dummy.position.set(x, y, z);
      dummy.rotation.set(t * 0.2 + i, t * 0.15, 0);
      const scale = 0.7 + 0.3 * Math.sin(t * 0.8 + i);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      const l = 0.55 + 0.25 * Math.sin(t * 1.3 + i * 2.1);
      color.setHSL(hue, 0.65, Math.max(0, Math.min(1, l)));
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    meshRef.current.rotation.y = t * 0.08;
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}

/**
 * Lightweight per-row companion visual. Lazy-mounts only when scrolled
 * into view (IntersectionObserver) and unmounts when scrolled well past,
 * so we never run more than ~1-2 of these Canvases at once. Do NOT add
 * bloom or OrbitControls here — kept intentionally cheap since this
 * renders up to 5 times down the Features section.
 */
export default function ParticleCompanion({
  count = 260,
  hue = 0.7, // 0.7 ~ violet (ACCENT), 0.93 ~ rose (SIGNAL)
}: {
  count?: number;
  hue?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '200px 0px', threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} aria-hidden="true">
      {visible && (
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 1.5]}>
          <Cloud count={count} hue={hue} />
        </Canvas>
      )}
    </div>
  );
}