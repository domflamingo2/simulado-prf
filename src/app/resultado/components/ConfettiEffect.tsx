"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiEffectProps {
  isActive: boolean;
}

export function ConfettiEffect({ isActive }: ConfettiEffectProps) {
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    if (isActive) {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }
  }, [isActive]);

  if (!isActive || windowWidth === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -20,
            x: Math.random() * windowWidth,
            opacity: 1,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: windowHeight + 100,
            opacity: 0,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 1.5,
            ease: "easeOut",
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: [
              "#3b82f6",
              "#10b981",
              "#f59e0b",
              "#ef4444",
              "#8b5cf6",
              "#ec4899",
              "#06b6d4",
            ][Math.floor(Math.random() * 7)],
          }}
        />
      ))}
    </div>
  );
}
