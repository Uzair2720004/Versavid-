'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function makeDotTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function GlowCloud({ count, hueA, hueB }: { count: number; hueA: number; hueB: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const texture = useMemo(() => makeDotTexture(), []);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    const gaussian = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
    for (let i = 0; i < count; i++) {
      positions[i * 3] = gaussian() * 1.7;
      positions[i * 3 + 1] = gaussian() * 1.7;
      positions[i * 3 + 2] = gaussian() * 1.7;
      const t = Math.random();
      color.setHSL(hueA + (hueB - hueA) * t, 0.7, 0.62 + Math.random() * 0.15);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { positions, colors };
  }, [count, hueA, hueB]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.07;
    pointsRef.current.rotation.x = Math.sin(t * 0.15) * 0.12;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.24}
        map={texture}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Lightweight per-row companion visual. Uses additive-blended glow points
 * instead of solid geometry — cheap (single draw call, no lighting, no
 * bloom pass needed) and reads as a soft luminous cloud rather than hard
 * confetti. Lazy-mounts only when scrolled into view.
 */
export default function ParticleCompanion({
  count = 320,
  hueA = 0.7,
  hueB = 0.93,
}: {
  count?: number;
  hueA?: number;
  hueB?: number;
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
          <GlowCloud count={count} hueA={hueA} hueB={hueB} />
        </Canvas>
      )}
    </div>
  );
}