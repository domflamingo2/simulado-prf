"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, ReactNode, useState } from "react";

// ═══════════════════════════════════════════════════════════
// VARIANTES COM CVA (Class Variance Authority)
// ═══════════════════════════════════════════════════════════

const glassCardVariants = cva(
  // Base styles
  "relative overflow-hidden rounded-xl backdrop-blur-xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-slate-900/60 border-slate-700/50",
        elevated: "bg-slate-800/80 border-slate-600/50 shadow-2xl",
        subtle: "bg-slate-950/30 border-slate-800/30",
        premium:
          "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-600/50",
        danger: "bg-red-950/20 border-red-500/30",
        success: "bg-emerald-950/20 border-emerald-500/30",
        warning: "bg-amber-950/20 border-amber-500/30",
        info: "bg-blue-950/20 border-blue-500/30",
      },
      glow: {
        none: "",
        blue: "shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:border-blue-400/50",
        green:
          "shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:border-emerald-400/50",
        purple:
          "shadow-lg shadow-purple-500/10 hover:shadow-purple-500/25 hover:border-purple-400/50",
        yellow:
          "shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 hover:border-amber-400/50",
        cyan: "shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25 hover:border-cyan-400/50",
        red: "shadow-lg shadow-rose-500/10 hover:shadow-rose-500/25 hover:border-rose-400/50",
        pink: "shadow-lg shadow-pink-500/10 hover:shadow-pink-500/25 hover:border-pink-400/50",
        white:
          "shadow-lg shadow-white/5 hover:shadow-white/15 hover:border-white/30",
      },
      glowIntensity: {
        subtle: "",
        medium: "[--glow-opacity:0.15]",
        strong: "[--glow-opacity:0.3]",
      },
      border: {
        default: "border",
        none: "border-0",
        thick: "border-2",
      },
      interactive: {
        false: "",
        true: "cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
      },
      selected: {
        false: "",
        true: "ring-2 ring-offset-2 ring-offset-slate-950",
      },
    },
    compoundVariants: [
      {
        glow: "blue",
        glowIntensity: "strong",
        class: "shadow-blue-500/30 hover:shadow-blue-500/50",
      },
      {
        selected: true,
        glow: "blue",
        class: "ring-blue-500",
      },
      {
        selected: true,
        glow: "green",
        class: "ring-emerald-500",
      },
      {
        selected: true,
        glow: "purple",
        class: "ring-purple-500",
      },
    ],
    defaultVariants: {
      variant: "default",
      glow: "none",
      glowIntensity: "medium",
      border: "default",
      interactive: false,
      selected: false,
    },
  },
);

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

type GlowColor =
  | "none"
  | "blue"
  | "green"
  | "purple"
  | "yellow"
  | "cyan"
  | "red"
  | "pink"
  | "white";

interface GlassCardProps extends VariantProps<typeof glassCardVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  gradientBorder?: boolean;
  gradientBorderColors?: [string, string];
  animated?: boolean;
  loading?: boolean;
  disabled?: boolean;
  badge?: string | number;
  badgeColor?: "blue" | "green" | "red" | "amber" | "purple";
  hoverLift?: boolean;
  glow?:
    | "blue"
    | "purple"
    | "cyan"
    | "none"
    | "green"
    | "yellow"
    | "red"
    | "pink"
    | "white";
  intensity?: "subtle" | "medium" | "strong";
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL COM FORWARDREF
// ═══════════════════════════════════════════════════════════

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      variant,
      glow = "none",
      glowIntensity,
      border,
      interactive,
      selected,
      onClick,
      header,
      footer,
      gradientBorder = false,
      gradientBorderColors = ["#3b82f6", "#8b5cf6"],
      animated = false,
      loading = false,
      disabled = false,
      badge,
      badgeColor = "blue",
      hoverLift = true,
    },
    ref,
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
      if (!disabled && !loading && onClick) {
        onClick();
      }
    };

    // Configurações de badge
    const badgeColors = {
      blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      red: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    };

    const Component = animated ? motion.div : motion.div;
    const motionProps = animated
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          whileHover: hoverLift && !disabled ? { y: -4 } : undefined,
          transition: { duration: 0.3, ease: "easeOut" },
        }
      : {};

    return (
      <Component
        ref={ref}
        className={cn(
          glassCardVariants({
            variant,
            glow,
            glowIntensity,
            border,
            interactive: interactive || !!onClick,
            selected,
          }),
          disabled && "opacity-50 cursor-not-allowed",
          loading && "animate-pulse",
          className,
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...(motionProps as HTMLMotionProps<"div">)}
      >
        {/* Gradient Border Effect */}
        {gradientBorder && (
          <div
            className="absolute inset-0 rounded-xl p-[1px] pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${gradientBorderColors[0]}, ${gradientBorderColors[1]})`,
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: "1px",
            }}
          />
        )}

        {/* Shine effect on hover */}
        {hoverLift && !disabled && (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 pointer-events-none",
              isHovered && "opacity-100",
            )}
          />
        )}

        {/* Badge */}
        {badge !== undefined && (
          <div
            className={cn(
              "absolute -top-2 -right-2 px-2.5 py-1 rounded-full text-xs font-bold border",
              badgeColors[badgeColor],
            )}
          >
            {badge}
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm rounded-xl">
            <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Header */}
        {header && (
          <div className="px-5 py-4 border-b border-white/5">{header}</div>
        )}

        {/* Content */}
        <div
          className={cn(
            "relative z-10",
            !header && !footer ? "p-5" : null,
            header && !footer ? "px-5 py-4" : null,
            !header && footer ? "px-5 py-4" : null,
            header && footer ? "px-5 py-4" : null,
          )}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-white/5 bg-black/20">
            {footer}
          </div>
        )}
      </Component>
    );
  },
);

GlassCard.displayName = "GlassCard";

export default GlassCard;

// ═══════════════════════════════════════════════════════════
// COMPONENTES ESPECIALIZADOS
// ═══════════════════════════════════════════════════════════

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: ReactNode;
  glow?: GlowColor;
}

export function StatCard({
  label,
  value,
  trend,
  trendValue,
  icon,
  glow = "blue",
}: StatCardProps) {
  const trendColors = {
    up: "text-emerald-400",
    down: "text-rose-400",
    neutral: "text-slate-400",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  return (
    <GlassCard glow={glow} className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-xs mt-1 flex items-center gap-1",
                trendColors[trend],
              )}
            >
              <span>{trendIcons[trend]}</span>
              {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "p-3 rounded-xl",
              glow === "blue" && "bg-blue-500/10 text-blue-400",
              glow === "green" && "bg-emerald-500/10 text-emerald-400",
              glow === "purple" && "bg-purple-500/10 text-purple-400",
              glow === "yellow" && "bg-amber-500/10 text-amber-400",
              glow === "red" && "bg-rose-500/10 text-rose-400",
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
  glow?: GlowColor;
  disabled?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon,
  onClick,
  glow = "blue",
  disabled,
}: FeatureCardProps) {
  return (
    <GlassCard
      glow={glow}
      interactive={!disabled}
      onClick={onClick}
      disabled={disabled}
      className="group"
    >
      <div className="flex items-start gap-4 p-5">
        <div
          className={cn(
            "p-3 rounded-xl transition-transform group-hover:scale-110",
            glow === "blue" && "bg-blue-500/10 text-blue-400",
            glow === "green" && "bg-emerald-500/10 text-emerald-400",
            glow === "purple" && "bg-purple-500/10 text-purple-400",
            glow === "yellow" && "bg-amber-500/10 text-amber-400",
            glow === "cyan" && "bg-cyan-500/10 text-cyan-400",
            glow === "red" && "bg-rose-500/10 text-rose-400",
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-400 mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

// ═══════════════════════════════════════════════════════════
// UTILITÁRIO DE CLASSES (se não tiver no projeto)
// ═══════════════════════════════════════════════════════════

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}
