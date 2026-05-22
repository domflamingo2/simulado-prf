"use client";

import { motion } from "framer-motion";

interface BackgroundGlowProps {
  variant?: "default" | "treino" | "simulado" | "estatisticas";
  intensity?: "low" | "medium" | "high";
  animated?: boolean;
}

export function BackgroundGlow({
  variant = "default",
  intensity = "medium",
  animated = true,
}: BackgroundGlowProps) {
  const intensityMap = {
    low: "opacity-30",
    medium: "opacity-50",
    high: "opacity-70",
  };

  const variants = {
    default: {
      colors: [
        {
          bg: "bg-blue-500/10",
          size: "w-[500px] h-[500px]",
          top: "top-0",
          left: "left-1/4",
        },
        {
          bg: "bg-purple-500/10",
          size: "w-[500px] h-[500px]",
          bottom: "bottom-0",
          right: "right-1/4",
        },
        {
          bg: "bg-cyan-500/5",
          size: "w-[400px] h-[400px]",
          top: "top-1/3",
          left: "left-1/3",
        },
      ],
    },
    treino: {
      colors: [
        {
          bg: "bg-emerald-500/10",
          size: "w-[500px] h-[500px]",
          top: "top-0",
          left: "left-1/4",
        },
        {
          bg: "bg-teal-500/10",
          size: "w-[500px] h-[500px]",
          bottom: "bottom-0",
          right: "right-1/4",
        },
        {
          bg: "bg-green-500/5",
          size: "w-[400px] h-[400px]",
          top: "top-1/2",
          left: "left-1/3",
        },
      ],
    },
    simulado: {
      colors: [
        {
          bg: "bg-blue-500/10",
          size: "w-[500px] h-[500px]",
          top: "top-0",
          left: "left-1/4",
        },
        {
          bg: "bg-indigo-500/10",
          size: "w-[500px] h-[500px]",
          bottom: "bottom-0",
          right: "right-1/4",
        },
        {
          bg: "bg-purple-500/5",
          size: "w-[400px] h-[400px]",
          top: "top-1/3",
          right: "right-1/3",
        },
      ],
    },
    estatisticas: {
      colors: [
        {
          bg: "bg-purple-500/10",
          size: "w-[500px] h-[500px]",
          top: "top-0",
          left: "left-1/4",
        },
        {
          bg: "bg-pink-500/10",
          size: "w-[500px] h-[500px]",
          bottom: "bottom-0",
          right: "right-1/4",
        },
        {
          bg: "bg-amber-500/5",
          size: "w-[400px] h-[400px]",
          top: "top-1/2",
          left: "left-1/3",
        },
      ],
    },
  };

  const config = variants[variant];
  const opacityClass = intensityMap[intensity];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {config.colors.map((color, index) => (
        <motion.div
          key={index}
          initial={animated ? { scale: 0.8, opacity: 0 } : false}
          animate={animated ? { scale: 1, opacity: 1 } : false}
          transition={{
            duration: 1.5,
            delay: index * 0.3,
            ease: "easeOut",
          }}
          className={`
            absolute rounded-full blur-[120px] ${color.size} ${color.bg} ${opacityClass}
            ${color.top || ""} ${color.left || ""} ${color.bottom || ""} ${color.right || ""}
          `}
          style={{
            animation: animated
              ? `pulse ${3 + index}s ease-in-out infinite`
              : "none",
          }}
        />
      ))}

      {/* Partículas decorativas */}
      {animated && (
        <>
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: 0,
            }}
            className="absolute top-1/4 left-1/5 w-1 h-1 rounded-full bg-white/20 blur-sm"
          />
          <motion.div
            animate={{
              y: [0, 30, 0],
              x: [0, -15, 0],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: 1,
            }}
            className="absolute bottom-1/3 right-1/5 w-1.5 h-1.5 rounded-full bg-white/15 blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -25, 0],
              x: [0, 20, 0],
              opacity: [0, 0.25, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              delay: 2,
            }}
            className="absolute top-2/3 left-1/3 w-1 h-1 rounded-full bg-white/20 blur-sm"
          />
        </>
      )}

      {/* Gradiente de borda */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30 pointer-events-none" />

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
