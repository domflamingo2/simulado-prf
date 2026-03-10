"use client";

import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type ConfettiShape = "square" | "circle" | "rectangle" | "triangle";
type ConfettiOrigin =
  | "center"
  | "top"
  | "bottom"
  | "cursor"
  | { x: number; y: number };

interface ConfettiPiece {
  id: number;
  color: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  shape: ConfettiShape;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
  delay: number;
}

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  count?: number;
  colors?: string[];
  origin?: ConfettiOrigin;
  spread?: number; // 0-1, quanto se espalha horizontalmente
  gravity?: number; // 0-1, velocidade de queda
  wind?: number; // -1 a 1, direção do vento
  shapes?: ConfettiShape[];
  particleSize?: { min: number; max: number };
  onComplete?: () => void;
  className?: string;
  zIndex?: number;
  disableOnMobile?: boolean;
}

const DEFAULT_COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // rose-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#ec4899", // pink-500
  "#f97316", // orange-500
];

const SHAPE_PATHS: Record<ConfettiShape, string> = {
  square: "",
  circle: "50%",
  rectangle: "",
  triangle: "polygon(50% 0%, 0% 100%, 100% 100%)",
};

export default function Confetti({
  trigger,
  duration = 3000,
  count = 80,
  colors = DEFAULT_COLORS,
  origin = "center",
  spread = 0.6,
  gravity = 0.8,
  wind = 0,
  shapes = ["square", "circle", "rectangle"],
  particleSize = { min: 6, max: 14 },
  onComplete,
  className = "",
  zIndex = 9999,
  disableOnMobile = false,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Detecta mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calcula origem
  const getOriginPosition = useCallback((): { x: number; y: number } => {
    if (typeof origin === "object") return origin;

    switch (origin) {
      case "top":
        return { x: 50, y: 0 };
      case "bottom":
        return { x: 50, y: 100 };
      case "center":
        return { x: 50, y: 50 };
      case "cursor":
        return { x: 50, y: 50 }; // Fallback, deveria receber coordenadas
      default:
        return { x: 50, y: 30 };
    }
  }, [origin]);

  // Gera peças de confetti
  const generatePieces = useCallback((): ConfettiPiece[] => {
    const originPos = getOriginPosition();

    return Array.from({ length: count }, (_, i) => {
      const angle =
        (Math.random() * spread * 180 - spread * 90) * (Math.PI / 180);
      const velocity = 15 + Math.random() * 20;
      const size =
        particleSize.min +
        Math.random() * (particleSize.max - particleSize.min);

      return {
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: originPos.x + (Math.random() - 0.5) * 10,
        y: originPos.y,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        velocityX: Math.sin(angle) * velocity * (1 + wind),
        velocityY: -Math.cos(angle) * velocity * 0.8,
        rotationSpeed: (Math.random() - 0.5) * 20,
        delay: Math.random() * 0.3,
      };
    });
  }, [count, colors, spread, wind, shapes, particleSize, getOriginPosition]);

  // Trigger effect
  useEffect(() => {
    if (!trigger) return;
    if (disableOnMobile && isMobile) return;

    const newPieces = generatePieces();
    setPieces(newPieces);

    // Limpa após duração
    const timer = setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, duration + 1000);

    return () => clearTimeout(timer);
  }, [
    trigger,
    generatePieces,
    duration,
    onComplete,
    disableOnMobile,
    isMobile,
  ]);

  // Renderiza shape específico
  const renderShape = (piece: ConfettiPiece) => {
    const baseStyle = {
      backgroundColor: piece.color,
      width: piece.shape === "rectangle" ? piece.scale * 12 : piece.scale * 8,
      height: piece.scale * 8,
      boxShadow: `0 0 ${piece.scale * 2}px ${piece.color}40`,
    };

    switch (piece.shape) {
      case "circle":
        return <div className="rounded-full" style={baseStyle} />;
      case "triangle":
        return (
          <div
            style={{
              ...baseStyle,
              clipPath: SHAPE_PATHS.triangle,
              backgroundColor: piece.color,
            }}
          />
        );
      case "rectangle":
        return (
          <div
            style={{
              ...baseStyle,
              width: piece.scale * 16,
              height: piece.scale * 6,
            }}
          />
        );
      default: // square
        return <div style={baseStyle} />;
    }
  };

  // Física de animação
  const getAnimationVariants = (piece: ConfettiPiece) => {
    const endX = piece.x + piece.velocityX * (gravity * 10);
    const endY = piece.y + 100 + Math.abs(piece.velocityY) * gravity * 5;
    const endRotation = piece.rotation + piece.rotationSpeed * 50;

    return {
      initial: {
        x: `${piece.x}vw`,
        y: `${piece.y}vh`,
        opacity: 1,
        rotate: piece.rotation,
        scale: 0,
      },
      animate: {
        x: `${endX}vw`,
        y: `${endY}vh`,
        opacity: [1, 1, 0.8, 0],
        rotate: endRotation,
        scale: [0, piece.scale, piece.scale, piece.scale * 0.8],
      },
      transition: {
        duration: (duration / 1000) * (0.8 + Math.random() * 0.4),
        delay: piece.delay,
        ease: [0.25, 0.46, 0.45, 0.94] as const, // easeOutQuad custom
        opacity: {
          times: [0, 0.6, 0.8, 1],
        },
        scale: {
          times: [0, 0.1, 0.9, 1],
        },
      },
    };
  };

  if (disableOnMobile && isMobile) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex }}
      aria-hidden="true"
    >
      <AnimatePresence mode="popLayout">
        {pieces.map((piece) => {
          const variants = getAnimationVariants(piece);

          return (
            <motion.div
              key={piece.id}
              initial={variants.initial}
              animate={variants.animate}
              exit={{ opacity: 0, scale: 0 }}
              transition={variants.transition}
              className="absolute will-change-transform"
              style={{
                left: 0,
                top: 0,
              }}
            >
              {renderShape(piece)}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Flash de luz no centro (opcional) */}
      <AnimatePresence>
        {pieces.length > 0 && origin === "center" && (
          <motion.div
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{ opacity: 0, scale: 3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/20 blur-3xl"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HOOK PARA CONTROLE PROGRAMÁTICO
// ═══════════════════════════════════════════════════════════

export function useConfetti() {
  const [isActive, setIsActive] = useState(false);
  const [key, setKey] = useState(0);

  const fire = useCallback(() => {
    setKey((k) => k + 1);
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  return { isActive, fire, stop, key };
}

// ═══════════════════════════════════════════════════════════
// VARIANTES ESPECIALIZADAS
// ═══════════════════════════════════════════════════════════

interface CelebrationConfettiProps extends Omit<
  ConfettiProps,
  "trigger" | "count" | "origin"
> {
  level?: "small" | "medium" | "large" | "epic";
}

export function CelebrationConfetti({
  level = "medium",
  ...props
}: CelebrationConfettiProps) {
  const configs = {
    small: { count: 30, duration: 2000, spread: 0.4 },
    medium: { count: 80, duration: 3000, spread: 0.6 },
    large: { count: 150, duration: 4000, spread: 0.8 },
    epic: { count: 300, duration: 5000, spread: 1, gravity: 0.6 },
  };

  const config = configs[level];

  return (
    <Confetti
      trigger={true}
      {...props}
      {...config}
      colors={[
        "#fbbf24",
        "#f59e0b",
        "#fcd34d", // golds
        "#ef4444",
        "#f87171", // reds
        "#3b82f6",
        "#60a5fa", // blues
        "#ffffff", // white
      ]}
      shapes={["circle", "square", "rectangle"]}
    />
  );
}

// Confetti de conquista (tema roxo/dourado)
export function AchievementConfetti(
  props: Omit<ConfettiProps, "trigger" | "colors">,
) {
  return (
    <Confetti
      trigger={true}
      {...props}
      count={60}
      colors={["#8b5cf6", "#a78bfa", "#fbbf24", "#f59e0b", "#ffffff"]}
      shapes={["circle", "star" as ConfettiShape]}
      origin="center"
      spread={0.5}
    />
  );
}
