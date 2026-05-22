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

export function ConfettiEffect({
  isActive,
  intensity = "medium",
}: ConfettiEffectProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (isActive) {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Limpar após 4 segundos
      const timer = setTimeout(() => {
        setDimensions({ width: 0, height: 0 });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive || dimensions.width === 0) return null;

  const count = INTENSITY_MAP[intensity];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const size = 4 + Math.random() * 8;
        const startX = Math.random() * dimensions.width;
        const duration = 1.5 + Math.random() * 2;
        const delay = Math.random() * 1.5;
        const rotation = Math.random() * 720;
        const driftX = (Math.random() - 0.5) * 150;

        return (
          <motion.div
            key={i}
            initial={{
              y: -20,
              x: startX,
              opacity: 1,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              y: dimensions.height + 100,
              x: startX + driftX,
              opacity: [1, 1, 0],
              scale: 0.5 + Math.random() * 0.8,
              rotate: rotation,
            }}
            transition={{
              duration,
              delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute rounded-sm shadow-lg"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              boxShadow: `0 0 6px ${color}80`,
            }}
          />
        );
      })}

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
