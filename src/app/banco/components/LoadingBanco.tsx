"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Database,
  Download,
  Filter,
  Loader2,
  LucideIcon,
  RefreshCw,
  Sparkles,
  Timer,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

export type LoadingVariant =
  | "initial"
  | "filtering"
  | "exporting"
  | "training"
  | "saving";

export interface LoadingBancoProps {
  variant?: LoadingVariant;
  message?: string;
  showProgress?: boolean;
  progress?: number;
  skeletonCount?: number;
  showSkeleton?: boolean;
  onTimeout?: () => void;
}

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO DAS VARIANTES
// ═══════════════════════════════════════════════════════════

interface VariantConfig {
  icon: LucideIcon;
  titulo: string;
  subtitulo: string;
  spinnerBorder: string;
  spinnerBorderTop: string;
  iconColor: string;
  progressBar: string;
  glowColor: string;
  bgGradient: string;
}

const VARIANT_CONFIG: Record<LoadingVariant, VariantConfig> = {
  initial: {
    icon: Database,
    titulo: "Carregando banco de questões",
    subtitulo: "Preparando seu ambiente de estudos...",
    spinnerBorder: "border-blue-500/30",
    spinnerBorderTop: "border-t-blue-500",
    iconColor: "text-blue-400",
    progressBar: "bg-blue-500",
    glowColor: "shadow-blue-500/20",
    bgGradient: "from-blue-500/10 to-purple-500/10",
  },
  filtering: {
    icon: Filter,
    titulo: "Aplicando filtros",
    subtitulo: "Organizando questões por relevância...",
    spinnerBorder: "border-cyan-500/30",
    spinnerBorderTop: "border-t-cyan-500",
    iconColor: "text-cyan-400",
    progressBar: "bg-cyan-500",
    glowColor: "shadow-cyan-500/20",
    bgGradient: "from-cyan-500/10 to-blue-500/10",
  },
  exporting: {
    icon: Download,
    titulo: "Exportando questões",
    subtitulo: "Gerando arquivo para download...",
    spinnerBorder: "border-emerald-500/30",
    spinnerBorderTop: "border-t-emerald-500",
    iconColor: "text-emerald-400",
    progressBar: "bg-emerald-500",
    glowColor: "shadow-emerald-500/20",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
  },
  training: {
    icon: Brain,
    titulo: "Preparando treino",
    subtitulo: "Selecionando questões ideais para você...",
    spinnerBorder: "border-purple-500/30",
    spinnerBorderTop: "border-t-purple-500",
    iconColor: "text-purple-400",
    progressBar: "bg-purple-500",
    glowColor: "shadow-purple-500/20",
    bgGradient: "from-purple-500/10 to-pink-500/10",
  },
  saving: {
    icon: Loader2,
    titulo: "Salvando configurações",
    subtitulo: "Aguarde um instante...",
    spinnerBorder: "border-amber-500/30",
    spinnerBorderTop: "border-t-amber-500",
    iconColor: "text-amber-400",
    progressBar: "bg-amber-500",
    glowColor: "shadow-amber-500/20",
    bgGradient: "from-amber-500/10 to-orange-500/10",
  },
};

// ═══════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════

function SkeletonBanco({ count = 5 }: { count?: number }) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-8"
      role="status"
      aria-label="Carregando conteúdo"
      aria-busy="true"
    >
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-800/60 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-slate-800/60 rounded-lg animate-pulse" />
              <div className="h-3 w-32 bg-slate-800/60 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-24 h-9 bg-slate-800/60 rounded-xl animate-pulse" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="h-28 bg-slate-800/40 rounded-xl animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        {/* Filtros skeleton */}
        <div className="space-y-3">
          <div className="h-12 bg-slate-800/40 rounded-xl animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="h-8 w-20 bg-slate-800/40 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Lista de questões skeleton */}
        <div className="space-y-3">
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-slate-800/40 rounded-xl animate-pulse"
              style={{ animationDelay: `${400 + i * 60}ms` }}
            >
              <div className="w-1 rounded-full bg-slate-700/60 self-stretch" />
              <div className="flex-1 space-y-2.5">
                <div className="flex gap-2">
                  <div className="h-5 w-28 bg-slate-700/60 rounded-full" />
                  <div className="h-5 w-14 bg-slate-700/60 rounded-full" />
                </div>
                <div className="h-3.5 bg-slate-700/50 rounded w-full" />
                <div className="h-3.5 bg-slate-700/50 rounded w-5/6" />
                <div className="h-3.5 bg-slate-700/50 rounded w-2/3" />
                <div className="flex gap-2 pt-1">
                  <div className="h-6 w-16 bg-slate-700/40 rounded-lg" />
                  <div className="h-6 w-20 bg-slate-700/40 rounded-lg" />
                  <div className="h-6 w-12 bg-slate-700/40 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function LoadingBanco({
  variant = "initial",
  message,
  showProgress = false,
  progress = 0,
  skeletonCount = 5,
  showSkeleton = false,
  onTimeout,
}: LoadingBancoProps) {
  const prefersReducedMotion = useReducedMotion();
  const [timedOut, setTimedOut] = useState(false);
  const [hardError, setHardError] = useState(false);
  const [dots, setDots] = useState("");

  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  // Animação de pontos
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Timeouts
  useEffect(() => {
    const t1 = setTimeout(() => {
      setTimedOut(true);
      onTimeoutRef.current?.();
      toast.warning("O carregamento está demorando mais que o esperado", {
        id: "loading-timeout",
      });
    }, 10000);

    const t2 = setTimeout(() => {
      setHardError(true);
      toast.error("Não foi possível carregar. Verifique sua conexão.", {
        id: "loading-error",
      });
    }, 25000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (showSkeleton) return <SkeletonBanco count={skeletonCount} />;
  if (hardError) return <SkeletonBanco count={skeletonCount} />;

  const cfg = VARIANT_CONFIG[variant];
  const Icon = cfg.icon;
  const displayMessage = message ?? cfg.titulo;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4"
      role="status"
      aria-live="polite"
      aria-label={`Carregando: ${displayMessage}`}
      aria-busy="true"
    >
      <div className="relative">
        {/* Efeito de glow */}
        <div
          className={`absolute -inset-8 bg-gradient-to-r ${cfg.bgGradient} rounded-full blur-3xl opacity-50`}
        />

        <div className="relative flex flex-col items-center gap-6 max-w-sm w-full">
          {/* Spinner principal */}
          <div className="relative">
            <div
              className={`
                w-24 h-24 rounded-2xl border-3
                ${cfg.spinnerBorder}
                ${!prefersReducedMotion ? "animate-spin" : ""}
                shadow-2xl ${cfg.glowColor}
              `}
              style={
                !prefersReducedMotion ? { animationDuration: "1s" } : undefined
              }
            >
              <div
                className={`absolute inset-0 rounded-2xl border-3 border-transparent ${cfg.spinnerBorderTop}`}
              />
            </div>

            {/* Ícone central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              >
                <div className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-sm">
                  <Icon className={`w-7 h-7 ${cfg.iconColor}`} />
                </div>
              </motion.div>
            </div>

            {/* Partículas decorativas */}
            {!prefersReducedMotion && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  className="absolute -top-2 -right-2 w-2 h-2 rounded-full bg-blue-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-2 -left-2 w-1.5 h-1.5 rounded-full bg-purple-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                  className="absolute top-1/2 -right-3 w-1 h-1 rounded-full bg-cyan-400"
                />
              </>
            )}
          </div>

          {/* Mensagens */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-2"
          >
            <p className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {displayMessage}
              <span className="inline-block w-6 text-left">{dots}</span>
            </p>
            <p className="text-slate-500 text-sm">{cfg.subtitulo}</p>
          </motion.div>

          {/* Barra de Progresso */}
          {showProgress && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full space-y-2"
            >
              <div className="flex justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Timer className="w-3 h-3" />
                  Progresso
                </span>
                <span className="font-mono text-blue-400 font-semibold">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, Math.max(0, progress))}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${cfg.progressBar} relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Dica motivacional */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
          >
            <Sparkles className="w-3 h-3 text-yellow-500" />
            <p className="text-[10px] text-slate-500">
              Enquanto carrega, respire fundo e prepare-se para estudar!
            </p>
          </motion.div>

          {/* Aviso de timeout */}
          {timedOut && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
            >
              <p className="text-xs text-amber-400 flex items-center gap-2 justify-center mb-3">
                <AlertCircle className="w-3.5 h-3.5" />O carregamento está
                demorando mais que o esperado
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-medium transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Recarregar página
              </button>
            </motion.div>
          )}

          {/* Dica de atalho */}
          <p
            className="text-[10px] text-slate-700 text-center"
            aria-hidden="true"
          >
            💡 Dica: Use Ctrl+K para buscar questões rapidamente
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CompactSpinner
// ═══════════════════════════════════════════════════════════

const COMPACT_COLORS = {
  blue: "border-blue-500",
  cyan: "border-cyan-500",
  emerald: "border-emerald-500",
  purple: "border-purple-500",
  amber: "border-amber-500",
  rose: "border-rose-500",
} as const;

type CompactColor = keyof typeof COMPACT_COLORS;

export function CompactSpinner({
  size = "sm",
  color = "blue",
  text,
  showCheck = false,
}: {
  size?: "sm" | "md";
  color?: CompactColor;
  text?: string;
  showCheck?: boolean;
}) {
  const borderClass = COMPACT_COLORS[color] ?? COMPACT_COLORS.blue;
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-6 h-6";

  if (showCheck) {
    return (
      <span className="inline-flex items-center gap-2" role="status">
        <CheckCircle2 className={`w-4 h-4 text-${color}-400`} />
        {text && <span className="text-sm text-slate-400">{text}</span>}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2"
      role="status"
      aria-label={text ?? "Carregando"}
    >
      <span
        className={`
          rounded-full border-2 border-t-transparent animate-spin
          ${sizeClass} ${borderClass}
        `}
        style={{ animationDuration: "0.8s" }}
        aria-hidden="true"
      />
      {text && <span className="text-sm text-slate-400">{text}</span>}
    </span>
  );
}
