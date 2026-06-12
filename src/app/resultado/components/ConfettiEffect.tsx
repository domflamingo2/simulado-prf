"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiEffectProps {
  isActive: boolean;
  intensity?: "low" | "medium" | "high";
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

const INTENSITY_MAP = {
  low: 60,
  medium: 120,
  high: 200,
};

interface Particle {
  id: number;
  color: string;
  size: number;
  startX: number;
  duration: number;
  delay: number;
  rotation: number;
  driftX: number;
  scale: number;
}

export function ConfettiEffect({
  isActive,
  intensity = "medium",
}: ConfettiEffectProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  // Atualiza dimensões da janela (apenas uma vez e em resize)
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Gera partículas quando o efeito é ativado
  useEffect(() => {
    // Guard puro — sem setState no corpo do efeito
    if (!isActive || dimensions.width === 0) return;

    const count = INTENSITY_MAP[intensity];
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.random() * 8,
      startX: Math.random() * dimensions.width,
      duration: 1.5 + Math.random() * 2,
      delay: Math.random() * 1.5,
      rotation: Math.random() * 720,
      driftX: (Math.random() - 0.5) * 150,
      scale: 0.5 + Math.random() * 0.8,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 4000);

    // Cancela o timer E limpa partículas se o efeito for
    // reexecutado antes do timeout (ex: isActive virar false)
    return () => {
      clearTimeout(timer);
      setParticles([]);
    };
  }, [isActive, dimensions.width, dimensions.height, intensity]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            y: -20,
            x: p.startX,
            opacity: 1,
            scale: 0,
            rotate: 0,
          }}
          animate={{
            y: dimensions.height + 100,
            x: p.startX + p.driftX,
            opacity: [1, 1, 0],
            scale: p.scale,
            rotate: p.rotation,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="absolute rounded-sm shadow-lg"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}80`,
          }}
        />
      ))}

      {/* Efeito de explosão */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 2, opacity: [0, 0.2, 0] }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30"
      />
    </div>
  );
}
