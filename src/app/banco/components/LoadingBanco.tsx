"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Brain,
  Database,
  Download,
  Filter,
  Loader2,
  LucideIcon,
  RefreshCw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// FIX: Toaster removido — deve estar em app/layout.tsx.
// Se montado dentro de um componente de loading que aparece/some, cria
// múltiplas instâncias que competem e causam toasts duplicados.

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
  /** Número de skeleton cards na lista. Default: 5 */
  skeletonCount?: number;
  /** Exibe skeleton em vez do spinner animado */
  showSkeleton?: boolean;
  onTimeout?: () => void;
}

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO DAS VARIANTES
// FIX: toda a configuração declarativa em um objeto — sem
// múltiplos ternários inline no JSX.
// FIX: cores como classes Tailwind literais (não dinâmicas) —
// Tailwind purge remove classes construídas com template literals.
// ═══════════════════════════════════════════════════════════

interface VariantConfig {
  icon: LucideIcon;
  titulo: string;
  subtitulo: string;
  // FIX: classes Tailwind literais — nunca construídas dinamicamente
  spinnerBorder: string;
  spinnerBorderTop: string;
  iconColor: string;
  progressBar: string;
  glowColor: string;
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
  },
};

// ═══════════════════════════════════════════════════════════
// SKELETON
// FIX: número de itens configurável (não hardcoded em 3)
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
        {/* Header */}
        <div className="h-16 bg-slate-800/40 rounded-xl animate-pulse" />

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="h-24 bg-slate-800/40 rounded-xl animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        {/* Filtros */}
        <div
          className="h-28 bg-slate-800/40 rounded-xl animate-pulse"
          style={{ animationDelay: "320ms" }}
        />

        {/* Lista de questões */}
        <div className="space-y-3">
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-slate-800/40 rounded-xl animate-pulse"
              style={{ animationDelay: `${400 + i * 60}ms` }}
            >
              {/* Borda lateral colorida */}
              <div className="w-1 rounded-full bg-slate-700/60 self-stretch flex-shrink-0" />
              <div className="flex-1 space-y-2.5">
                {/* Badges */}
                <div className="flex gap-2">
                  <div className="h-5 w-28 bg-slate-700/60 rounded-full" />
                  <div className="h-5 w-14 bg-slate-700/60 rounded-full" />
                </div>
                {/* Linhas de texto */}
                <div className="h-3.5 bg-slate-700/50 rounded w-full" />
                <div className="h-3.5 bg-slate-700/50 rounded w-5/6" />
                <div className="h-3.5 bg-slate-700/50 rounded w-2/3" />
                {/* Botões de ação */}
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

  // FIX: onTimeout em ref para evitar que a mudança da função do pai
  // cancele e recrie os timeouts, nunca chegando aos 10s
  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  // FIX: dependência estável [] — os timers são criados uma única vez
  useEffect(() => {
    const t1 = setTimeout(() => {
      setTimedOut(true);
      onTimeoutRef.current?.();
      toast.warning("O carregamento está demorando mais que o esperado", {
        id: "loading-timeout",
        duration: 5000,
      });
    }, 10_000);

    const t2 = setTimeout(() => {
      setHardError(true);
      toast.error("Não foi possível carregar. Verifique sua conexão.", {
        id: "loading-error",
        duration: 0, // persiste até o usuário fechar
      });
    }, 25_000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Exibe skeleton enquanto aguarda dados iniciais
  if (showSkeleton) {
    return <SkeletonBanco count={skeletonCount} />;
  }

  // Após hard error, mostra skeleton como fallback visual
  if (hardError) {
    return <SkeletonBanco count={skeletonCount} />;
  }

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
      <div className="flex flex-col items-center gap-6 max-w-sm w-full">
        {/* ── Spinner ── */}
        {/* FIX: CSS spin nativo em vez de motion rotate [0, 360].
            motion.div com rotate vai de 0→360 e recomeça do 0 com um salto
            visível. animate-spin é CSS transform contínuo sem salto. */}
        <div className="relative">
          {/* Anel externo — borda completa com baixa opacidade */}
          <div
            className={`
              w-20 h-20 rounded-2xl border-2
              ${cfg.spinnerBorder}
              ${!prefersReducedMotion ? "animate-spin" : ""}
              shadow-xl ${cfg.glowColor}
            `}
            style={
              !prefersReducedMotion
                ? {
                    animationDuration: "1.1s",
                    animationTimingFunction: "linear",
                  }
                : undefined
            }
          >
            {/* FIX: border-top transparent sobreposto ao anel — garante o arco visível */}
            <div
              className={`absolute inset-0 rounded-2xl border-2 border-transparent ${cfg.spinnerBorderTop}`}
            />
          </div>

          {/* Ícone central — não rotaciona */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            >
              <Icon className={`w-8 h-8 ${cfg.iconColor}`} aria-hidden="true" />
            </motion.div>
          </div>
        </div>

        {/* ── Mensagens ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-1.5"
        >
          <p className="text-slate-200 text-base font-semibold tracking-tight">
            {displayMessage}
          </p>
          <p className="text-slate-500 text-sm">{cfg.subtitulo}</p>
        </motion.div>

        {/* ── Barra de Progresso ── */}
        {showProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full space-y-2"
          >
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`h-full rounded-full ${cfg.progressBar}`}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Progresso</span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
          </motion.div>
        )}

        {/* ── Dica ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[11px] text-slate-700 text-center leading-relaxed"
        >
          💡 Use filtros para encontrar questões específicas mais rápido
        </motion.p>

        {/* ── Aviso de timeout ── */}
        {timedOut && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-3.5 bg-amber-500/8 border border-amber-500/20 rounded-xl"
          >
            <p className="text-xs text-amber-400 flex items-center gap-2 justify-center mb-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />O
              carregamento está demorando mais que o esperado
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors py-1"
            >
              <RefreshCw className="w-3 h-3" />
              Recarregar página
            </button>
          </motion.div>
        )}

        {/* ── Hint de acessibilidade ── */}
        <p
          className="text-[10px] text-slate-800 text-center select-none"
          aria-hidden="true"
        >
          Recarregue a página se o problema persistir
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CompactSpinner
// FIX: cores como classes literais — nunca dinâmicas
// ═══════════════════════════════════════════════════════════

// FIX: mapa de cores com classes Tailwind literais
// (construção dinâmica `border-${color}-500` é removida pelo Tailwind purge)
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
}: {
  size?: "sm" | "md";
  color?: CompactColor;
  text?: string;
}) {
  const borderClass = COMPACT_COLORS[color] ?? COMPACT_COLORS.blue;
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-6 h-6";

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
        aria-hidden="true"
      />
      {text && <span className="text-sm text-slate-400">{text}</span>}
    </span>
  );
}
