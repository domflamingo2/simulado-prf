"use client";

import { motion, useAnimation } from "framer-motion";
import { Check, Target, TrendingUp, Trophy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ProgressRingVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "level"
  | "xp";
type ProgressRingSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: ProgressRingSize | number;
  strokeWidth?: number;
  color?: string;
  gradient?: [string, string]; // [startColor, endColor]
  children?: React.ReactNode;
  label?: string;
  sublabel?: string;
  variant?: ProgressRingVariant;
  animated?: boolean;
  showIcon?: boolean;
  glow?: boolean;
  className?: string;
  onComplete?: () => void;
  milestones?: number[]; // Pontos para marcar no ring [25, 50, 75]
}

const SIZE_MAP: Record<ProgressRingSize, number> = {
  xs: 48,
  sm: 64,
  md: 96,
  lg: 120,
  xl: 160,
};

const VARIANT_COLORS: Record<
  ProgressRingVariant,
  { primary: string; gradient: [string, string]; glow: string }
> = {
  default: {
    primary: "#3b82f6",
    gradient: ["#3b82f6", "#8b5cf6"],
    glow: "rgba(59, 130, 246, 0.5)",
  },
  success: {
    primary: "#10b981",
    gradient: ["#10b981", "#34d399"],
    glow: "rgba(16, 185, 129, 0.5)",
  },
  warning: {
    primary: "#f59e0b",
    gradient: ["#f59e0b", "#fbbf24"],
    glow: "rgba(245, 158, 11, 0.5)",
  },
  danger: {
    primary: "#ef4444",
    gradient: ["#ef4444", "#f87171"],
    glow: "rgba(239, 68, 68, 0.5)",
  },
  level: {
    primary: "#8b5cf6",
    gradient: ["#8b5cf6", "#ec4899"],
    glow: "rgba(139, 92, 246, 0.5)",
  },
  xp: {
    primary: "#fbbf24",
    gradient: ["#fbbf24", "#f59e0b"],
    glow: "rgba(251, 191, 36, 0.5)",
  },
};

export default function ProgressRing({
  progress,
  size = "md",
  strokeWidth: customStrokeWidth,
  color: customColor,
  gradient: customGradient,
  children,
  label,
  sublabel,
  variant = "default",
  animated = true,
  showIcon = true,
  glow = true,
  className = "",
  onComplete,
  milestones = [],
}: ProgressRingProps) {
  const [isComplete, setIsComplete] = useState(false);
  const controls = useAnimation();

  // Resolve tamanho
  const resolvedSize = typeof size === "string" ? SIZE_MAP[size] : size;

  // Resolve cores
  const variantConfig = VARIANT_COLORS[variant];
  const primaryColor = customColor || variantConfig.primary;
  const gradientColors = customGradient || variantConfig.gradient;
  const glowColor = variantConfig.glow;

  // Calcula dimensões
  const strokeWidth = customStrokeWidth || Math.max(4, resolvedSize / 15);
  const radius = (resolvedSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset =
    circumference - (Math.min(progress, 100) / 100) * circumference;

  // Calcula tamanhos de fonte proporcionais
  const fontSize = {
    main: Math.round(resolvedSize / 4),
    label: Math.round(resolvedSize / 8),
    sublabel: Math.round(resolvedSize / 10),
  };

  // Detecta completo
  useEffect(() => {
    if (progress >= 100 && !isComplete) {
      setIsComplete(true);
      onComplete?.();
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, ease: "easeOut" },
      });
    } else if (progress < 100 && isComplete) {
      setIsComplete(false);
    }
  }, [progress, isComplete, onComplete, controls]);

  // Ícone baseado no progresso/variante
  const renderIcon = useCallback(() => {
    if (!showIcon) return null;

    if (isComplete) {
      return <Trophy className="w-1/3 h-1/3 text-yellow-400" />;
    }

    switch (variant) {
      case "success":
        return <Check className="w-1/3 h-1/3 text-emerald-400" />;
      case "level":
        return <TrendingUp className="w-1/3 h-1/3 text-purple-400" />;
      case "xp":
        return <Target className="w-1/3 h-1/3 text-amber-400" />;
      default:
        return null;
    }
  }, [isComplete, showIcon, variant]);

  // ID único para gradiente
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <motion.div
      className={`relative inline-flex flex-col items-center justify-center ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="relative inline-flex items-center justify-center"
        animate={controls}
      >
        {/* Glow effect */}
        {glow && progress > 0 && (
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-50"
            style={{
              background: `conic-gradient(from 0deg, ${gradientColors[0]}, ${gradientColors[1]}, ${gradientColors[0]})`,
              transform: "scale(0.8)",
            }}
          />
        )}

        <svg
          width={resolvedSize}
          height={resolvedSize}
          className="transform -rotate-90"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || "Progresso"}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="100%" stopColor={gradientColors[1]} />
            </linearGradient>

            <filter id={`glow-${gradientId}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track background */}
          <circle
            cx={resolvedSize / 2}
            cy={resolvedSize / 2}
            r={radius}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Milestones markers */}
          {milestones.map((milestone) => {
            const angle = (milestone / 100) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const x = resolvedSize / 2 + radius * Math.cos(rad);
            const y = resolvedSize / 2 + radius * Math.sin(rad);

            return (
              <circle
                key={milestone}
                cx={x}
                cy={y}
                r={strokeWidth / 3}
                fill={
                  progress >= milestone
                    ? gradientColors[1]
                    : "rgba(255,255,255,0.2)"
                }
                className="transition-colors duration-300"
              />
            );
          })}

          {/* Progress arc */}
          <motion.circle
            cx={resolvedSize / 2}
            cy={resolvedSize / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            initial={animated ? { strokeDashoffset: circumference } : false}
            animate={{ strokeDashoffset: offset }}
            transition={
              animated ? { duration: 1.5, ease: "easeOut" } : { duration: 0 }
            }
            style={{
              strokeDasharray: circumference,
              filter: glow ? `url(#glow-${gradientId})` : undefined,
            }}
          />

          {/* Completion circle */}
          {isComplete && (
            <motion.circle
              cx={resolvedSize / 2}
              cy={resolvedSize / 2}
              r={radius + strokeWidth}
              fill="none"
              stroke={gradientColors[1]}
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          {children || (
            <>
              {renderIcon()}

              <motion.span
                className="font-bold text-white leading-none"
                style={{ fontSize: fontSize.main }}
                key={Math.round(progress)}
                initial={animated ? { scale: 0.5, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {Math.round(progress)}%
              </motion.span>

              {label && (
                <span
                  className="text-slate-400 font-medium mt-1"
                  style={{ fontSize: fontSize.label }}
                >
                  {label}
                </span>
              )}

              {sublabel && (
                <span
                  className="text-slate-500"
                  style={{ fontSize: fontSize.sublabel }}
                >
                  {sublabel}
                </span>
              )}
            </>
          )}
        </div>

        {/* Pulse effect when complete */}
        {isComplete && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${gradientColors[1]}` }}
              animate={{
                scale: [1, 1.2, 1.4],
                opacity: [0.5, 0.2, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${gradientColors[1]}` }}
              animate={{
                scale: [1, 1.3, 1.5],
                opacity: [0.3, 0.1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3,
              }}
            />
          </>
        )}
      </motion.div>

      {/* External label (optional) */}
      {(label || sublabel) && !children && (
        <div className="mt-2 text-center">
          {label && (
            <p className="text-sm font-medium text-slate-300">{label}</p>
          )}
          {sublabel && <p className="text-xs text-slate-500">{sublabel}</p>}
        </div>
      )}
    </motion.div>
  );
}

// Componentes especializados para casos comuns

export function LevelRing({
  nivel,
  xpAtual,
  xpProximo,
  ...props
}: {
  nivel: number;
  xpAtual: number;
  xpProximo: number;
} & Omit<ProgressRingProps, "progress" | "variant">) {
  const progress = (xpAtual / xpProximo) * 100;

  return (
    <ProgressRing
      progress={progress}
      variant="level"
      label={`Nv. ${nivel}`}
      sublabel={`${xpAtual}/${xpProximo} XP`}
      showIcon
      {...props}
    />
  );
}

export function XPRing({
  xp,
  xpMax = 1000,
  ...props
}: {
  xp: number;
  xpMax?: number;
} & Omit<ProgressRingProps, "progress" | "variant">) {
  const progress = Math.min((xp / xpMax) * 100, 100);

  return (
    <ProgressRing
      progress={progress}
      variant="xp"
      label={`${xp} XP`}
      sublabel={
        progress >= 100 ? "Máximo!" : `${Math.round(xpMax - xp)} para próximo`
      }
      showIcon
      {...props}
    />
  );
}

export function CompletionRing({
  completed,
  total,
  ...props
}: {
  completed: number;
  total: number;
} & Omit<ProgressRingProps, "progress">) {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const isComplete = completed >= total;

  return (
    <ProgressRing
      progress={progress}
      variant={isComplete ? "success" : "default"}
      label={`${completed}/${total}`}
      sublabel={isComplete ? "Concluído!" : `${total - completed} restantes`}
      showIcon={isComplete}
      milestones={[25, 50, 75]}
      {...props}
    />
  );
}
