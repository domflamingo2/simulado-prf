"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps, type Transition } from "framer-motion";
import { forwardRef, ReactNode, useMemo } from "react";

import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════
// CVA
// ═══════════════════════════════════════════════════════════

const glassCardVariants = cva(
  [
    "group relative overflow-hidden rounded-2xl border",
    "backdrop-blur-xl",
    "transition-all duration-300 ease-out",
    "will-change-transform",
    "isolate",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-slate-900/60 border-slate-700/50 text-slate-100 shadow-black/10",

        elevated: "bg-slate-800/80 border-slate-600/50 text-white shadow-2xl",

        subtle:
          "bg-slate-950/30 border-slate-800/30 text-slate-200 shadow-none",

        premium:
          "bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/95 border-slate-600/40 text-white shadow-2xl",

        danger:
          "bg-red-950/20 border-red-500/30 text-red-100 shadow-red-950/20",

        success:
          "bg-emerald-950/20 border-emerald-500/30 text-emerald-100 shadow-emerald-950/20",

        warning:
          "bg-amber-950/20 border-amber-500/30 text-amber-100 shadow-amber-950/20",

        info: "bg-blue-950/20 border-blue-500/30 text-blue-100 shadow-blue-950/20",
      },

      glow: {
        none: "",

        blue: [
          "shadow-blue-500/10",
          "hover:shadow-blue-500/25",
          "hover:border-blue-400/40",
        ],

        purple: [
          "shadow-purple-500/10",
          "hover:shadow-purple-500/25",
          "hover:border-purple-400/40",
        ],

        green: [
          "shadow-emerald-500/10",
          "hover:shadow-emerald-500/25",
          "hover:border-emerald-400/40",
        ],

        red: [
          "shadow-rose-500/10",
          "hover:shadow-rose-500/25",
          "hover:border-rose-400/40",
        ],

        orange: [
          "shadow-orange-500/10",
          "hover:shadow-orange-500/25",
          "hover:border-orange-400/40",
        ],

        cyan: [
          "shadow-cyan-500/10",
          "hover:shadow-cyan-500/25",
          "hover:border-cyan-400/40",
        ],

        white: [
          "shadow-white/5",
          "hover:shadow-white/15",
          "hover:border-white/20",
        ],
      },

      glowIntensity: {
        sm: "shadow-md",
        md: "shadow-xl",
        lg: "shadow-2xl",
      },

      interactive: {
        true: [
          "cursor-pointer",
          "active:scale-[0.985]",
          "hover:-translate-y-1",
        ],

        false: "",
      },

      selected: {
        true: "ring-2 ring-offset-2 ring-offset-slate-950",
        false: "",
      },

      loading: {
        true: "pointer-events-none select-none",
        false: "",
      },

      fullHeight: {
        true: "h-full",
        false: "",
      },
    },

    compoundVariants: [
      {
        selected: true,
        glow: "blue",
        class: "ring-blue-500",
      },

      {
        selected: true,
        glow: "purple",
        class: "ring-purple-500",
      },

      {
        selected: true,
        glow: "green",
        class: "ring-emerald-500",
      },

      {
        selected: true,
        glow: "red",
        class: "ring-rose-500",
      },

      {
        selected: true,
        glow: "orange",
        class: "ring-orange-500",
      },

      {
        selected: true,
        glow: "cyan",
        class: "ring-cyan-500",
      },

      {
        glow: "none",
        glowIntensity: "lg",
        class: "shadow-2xl",
      },
    ],

    defaultVariants: {
      variant: "default",
      glow: "none",
      glowIntensity: "md",
      interactive: false,
      selected: false,
      loading: false,
      fullHeight: false,
    },
  },
);

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

// FIX 1: Tipo único para props de motion reutilizáveis no componente
type MotionDivProps = Omit<HTMLMotionProps<"div">, "children">;

// FIX 2: Separação entre props do Slot (HTML puro) e props de motion.
// GlassCardProps agora usa HTMLMotionProps apenas quando asChild=false.
// Quando asChild=true, apenas props HTML padrão são relevantes.
export interface GlassCardProps
  extends MotionDivProps, VariantProps<typeof glassCardVariants> {
  asChild?: boolean;

  children?: ReactNode;

  header?: ReactNode;
  footer?: ReactNode;

  badge?: ReactNode;

  shimmer?: boolean;

  animated?: boolean;

  gradientBorder?: boolean;

  overlay?: ReactNode;

  // FIX 3: motionProps serve para sobrescrever/complementar animationProps
  // de forma explícita, sem conflito com o spread de `props`
  motionProps?: MotionDivProps;

  hoverScale?: number;

  hoverY?: number;
}

// ═══════════════════════════════════════════════════════════
// MOTION
// ═══════════════════════════════════════════════════════════

const DEFAULT_TRANSITION: Transition = {
  duration: 0.28,
  ease: "easeOut",
};

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

// FIX 4: Extrai e descarta todas as props exclusivas de framer-motion
// antes de repassar para elementos HTML comuns (ex: Slot).
// Isso evita warnings de "unknown prop" no DOM.
const MOTION_ONLY_KEYS: Array<keyof HTMLMotionProps<"div">> = [
  "animate",
  "initial",
  "exit",
  "transition",
  "variants",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "onAnimationStart",
  "onAnimationComplete",
  "onDragStart",
  "onDragEnd",
  "onDrag",
  "layout",
  "layoutId",
  "layoutDependency",
];

function stripMotionProps<T extends Record<string, unknown>>(
  props: T,
): Omit<T, keyof HTMLMotionProps<"div">> {
  const result = { ...props };
  for (const key of MOTION_ONLY_KEYS) {
    delete result[key as string];
  }
  return result as Omit<T, keyof HTMLMotionProps<"div">>;
}

// ═══════════════════════════════════════════════════════════
// SHARED INTERNALS
// ═══════════════════════════════════════════════════════════

interface GlassCardInternalsProps {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  badge?: ReactNode;
  shimmer?: boolean;
  gradientBorder?: boolean;
  loading?: boolean | null;
  overlay?: ReactNode;
  // FIX 5: fullHeight precisa ser propagado para o wrapper interno
  // nos casos em que o layout externo exige h-full
  fullHeight?: boolean | null;
}

function GlassCardInternals({
  children,
  header,
  footer,
  badge,
  shimmer,
  gradientBorder,
  loading,
  overlay,
  fullHeight,
}: GlassCardInternalsProps) {
  return (
    <>
      {/* Gradient Border */}
      {gradientBorder && (
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0 rounded-2xl
            bg-gradient-to-br
            from-blue-500/20
            via-purple-500/20
            to-cyan-500/20
            opacity-70
          "
        />
      )}

      {/* Shine */}
      {shimmer && (
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0
            opacity-0 transition-opacity duration-500
            group-hover:opacity-100
          "
        >
          <div
            className="
              absolute inset-0
              bg-gradient-to-br
              from-white/[0.06]
              via-transparent
              to-transparent
            "
          />
        </div>
      )}

      {/* Badge */}
      {badge && <div className="absolute right-3 top-3 z-30">{badge}</div>}

      {/* Loading */}
      {loading && (
        <div
          className="
            absolute inset-0 z-40
            flex items-center justify-center
            rounded-2xl
            bg-black/30 backdrop-blur-sm
          "
        >
          <div
            className="
              h-8 w-8 animate-spin rounded-full
              border-2 border-white/20
              border-t-blue-500
            "
          />
        </div>
      )}

      {/* Overlay */}
      {overlay && <div className="absolute inset-0 z-20">{overlay}</div>}

      {/* Header */}
      {header && (
        <div className="relative z-10 border-b border-white/5 px-5 py-4">
          {header}
        </div>
      )}

      {/* Content */}
      {/* FIX 5: propaga h-full para o wrapper de conteúdo quando necessário */}
      <div className={cn("relative z-10 px-5 py-4", fullHeight && "h-full")}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div
          className="
            relative z-10
            border-t border-white/5
            bg-black/10
            px-5 py-4
          "
        >
          {footer}
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,

      variant,
      glow,
      glowIntensity,

      interactive,
      selected,

      loading,

      children,

      header,
      footer,

      badge,

      shimmer = true,

      animated = true,

      gradientBorder = false,

      overlay,

      asChild = false,

      fullHeight,

      // FIX 3: motionProps é desestruturado separadamente para merge controlado
      motionProps,

      hoverScale = 1.01,
      hoverY = -4,

      ...props
    },
    ref,
  ) => {
    const animationProps: MotionDivProps = useMemo(() => {
      if (!animated) return {};

      return {
        initial: {
          opacity: 0,
          y: 10,
        },

        animate: {
          opacity: 1,
          y: 0,
        },

        transition: DEFAULT_TRANSITION,

        whileHover: interactive
          ? {
              y: hoverY,
              scale: hoverScale,
            }
          : undefined,
      };
    }, [animated, interactive, hoverScale, hoverY]);

    const variantClasses = cn(
      glassCardVariants({
        variant,
        glow,
        glowIntensity,
        interactive,
        selected,
        loading,
        fullHeight,
      }),
      className,
    );

    const internals = (
      <GlassCardInternals
        header={header}
        footer={footer}
        badge={badge}
        shimmer={shimmer}
        gradientBorder={gradientBorder}
        loading={loading}
        overlay={overlay}
        fullHeight={fullHeight}
      >
        {children}
      </GlassCardInternals>
    );

    // ═══════════════════════════════════════════════════════
    // SLOT VERSION (SEM MOTION)
    // ═══════════════════════════════════════════════════════

    if (asChild) {
      // FIX 2 + 4: Remove todas as props de motion antes de passar ao Slot,
      // pois Slot renderiza um elemento HTML comum (não motion.div).
      // Passar props como `animate`, `whileHover`, etc. causaria erros no DOM.
      const safeProps = stripMotionProps(props as Record<string, unknown>);

      return (
        <Slot
          ref={ref}
          data-selected={selected}
          data-loading={loading}
          className={variantClasses}
          {...safeProps}
        >
          {internals}
        </Slot>
      );
    }

    // ═══════════════════════════════════════════════════════
    // MOTION VERSION
    // ═══════════════════════════════════════════════════════

    // FIX 3: Ordem correta de merge:
    // 1. animationProps  → defaults gerados internamente
    // 2. motionProps     → overrides explícitos do consumidor para motion
    // 3. props           → demais props HTML/event handlers (não sobrescrevem motion)
    return (
      <motion.div
        ref={ref}
        data-selected={selected}
        data-loading={loading}
        className={variantClasses}
        {...props}
        {...animationProps}
        {...motionProps}
      >
        {internals}
      </motion.div>
    );
  },
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
