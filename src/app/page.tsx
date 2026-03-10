"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Clock,
  Download,
  Flame,
  Keyboard,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Search,
  Settings,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Upload,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Suspense,
  lazy,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import React, { Component } from "react";

const getBadgeLabel = (badgeId: string): string => {
  const labels: Record<string, string> = {
    "primeiro": "Primeiro Passo",
    "streak-7": "7 Dias Seguidos",
    "velocista": "Velocista",
    "cebraspe-master": "Mestre CEBRASPE",
    "polivalente": "Polivalente",
    "nivel-5": "Nível 5",
  };
  return labels[badgeId] || badgeId;
};

// ═══════════════════════════════════════════════════════════
// LAZY LOADING COM ERROR BOUNDARY
// ═══════════════════════════════════════════════════════════

const GraficoEvolucao = lazy(() =>
  import("@/components/GraficoEvolucao")
    .then((mod) => ({ default: mod.default }))
    .catch(() => ({
      default: () => (
        <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
          <AlertCircle className="w-8 h-8 text-rose-400" />
          <span className="text-sm">Erro ao carregar gráfico</span>
        </div>
      ),
    })),
);

const Confetti = lazy(() =>
  import("@/components/ui/Confetti").catch(() => ({
    default: () => null,
  })),
);

// ═══════════════════════════════════════════════════════════
// IMPORTS DIRETOS
// ═══════════════════════════════════════════════════════════

import Badge, { NewBadgeNotification } from "@/components/ui/Badge";
import GlassCard from "@/components/ui/GlassCard";
import ProgressRing from "@/components/ui/ProgressRing";
import { NIVEIS } from "@/data/gamificacao";
import { HistoricoSimulado } from "@/data/types";
import { useGamificacao } from "@/hooks/useGamificacao";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { classificarDesempenho } from "@/lib/simulado-logic";

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

type ModoEstudo = {
  href: string;
  icon: typeof Play;
  variant: "blue" | "amber" | "emerald" | "rose" | "purple" | "slate" | "cyan";
  title: string;
  description: string;
  xp: string;
  tag: string;
  disabled?: boolean;
  badge?: string;
  shortcut?: string;
};

type FiltroPeriodo = "7" | "30" | "90" | "todos";

type GlowColor =
  | "blue"
  | "cyan"
  | "green"
  | "pink"
  | "purple"
  | "red"
  | "white"
  | "yellow"
  | "none";

interface DadoGrafico {
  data: string;
  pontuacao: number;
  percentual: number;
}

// ═══════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════

const MODOS_ESTUDO: ModoEstudo[] = [
  {
    href: "/simulado?modo=completo",
    icon: Play,
    variant: "blue",
    title: "Simulado Completo",
    description: "60 questões • 4 horas • Ambiente real CEBRASPE",
    xp: "+50 XP",
    tag: "Prova oficial",
    shortcut: "Ctrl+N",
  },
  {
    href: "/simulado?modo=turbo",
    icon: Zap,
    variant: "amber",
    title: "Modo Turbo",
    description: "50 questões • 40 min • Revisão rápida",
    xp: "+30 XP",
    tag: "Desafio velocidade",
    shortcut: "Ctrl+T",
  },
  {
    href: "/treino",
    icon: BookOpen,
    variant: "emerald",
    title: "Treino Específico",
    description: "Foque na sua disciplina mais fraca",
    xp: "+20 XP",
    tag: "Explicação imediata",
  },
  {
    href: "/erros",
    icon: XCircle,
    variant: "rose",
    title: "Revisar Erros",
    description: "Banco de questões que você errou",
    xp: "+15 XP",
    tag: "Aprenda com falhas",
    shortcut: "Ctrl+E",
  },
  {
    href: "/simulado?modo=adaptativo",
    icon: Target,
    variant: "purple",
    title: "Adaptativo IA",
    description: "IA seleciona suas maiores dificuldades",
    xp: "+50 XP",
    tag: "Personalizado",
    badge: "IA",
  },
  {
    href: "/estatisticas",
    icon: BarChart3,
    variant: "cyan",
    title: "Estatísticas",
    description: "Análise profunda por disciplina",
    xp: "Visual",
    tag: "Gráficos completos",
  },
];

const BADGES_DISPLAY = [
  "primeiro",
  "streak-7",
  "velocista",
  "cebraspe-master",
  "polivalente",
  "nivel-5",
] as const;

const DISCIPLINAS_NOME: Record<string, string> = {
  PORTUGUES: "Português",
  ETICA: "Ética",
  RACIOCINIO_LOGICO: "Raciocínio Lógico",
  DIREITO_CONSTITUCIONAL: "Direito Const.",
  DIREITO_ADMINISTRATIVO: "Dir. Administrativo",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Legislação PRF",
};

// ═══════════════════════════════════════════════════════════
// HOOKS UTILITÁRIOS
// ═══════════════════════════════════════════════════════════

const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 300,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
};

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTES
// ═══════════════════════════════════════════════════════════

// ─── Loading do Gráfico ───────────────────────────────────

const GraficoLoading = memo(function GraficoLoading() {
  return (
    <div className="h-full min-h-[200px] flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
        <div
          className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-purple-500 animate-spin"
          style={{ animationDuration: "1.5s" }}
        />
      </div>
      <span className="text-xs text-slate-500 animate-pulse">
        Carregando gráfico...
      </span>
    </div>
  );
});

// ─── Erro do Gráfico ──────────────────────────────────────

const GraficoErro = memo(function GraficoErro({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-slate-500 gap-3 p-4">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-rose-400" />
      </div>
      <span className="text-sm font-medium">Erro ao carregar gráfico</span>
      <button
        onClick={onRetry}
        className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
});

// ─── Seção do Gráfico de Evolução ─────────────────────────

const SecaoGraficoEvolucao = memo(function SecaoGraficoEvolucao({
  historico,
  maxItens = 30,
}: {
  historico: HistoricoSimulado[];
  maxItens?: number;
}) {
  const [pagina, setPagina] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const dadosProcessados = useMemo((): DadoGrafico[] => {
    if (!historico?.length) return [];

    return historico
      .slice()
      .reverse()
      .slice(0, maxItens)
      .map((h) => ({
        data: h.data,
        pontuacao: Math.max(-60, Math.min(60, h.estatisticas?.pontuacao || 0)),
        percentual: Math.max(0, Math.min(100, h.estatisticas?.percentual || 0)),
      }));
  }, [historico, maxItens]);

  const itensPorPagina = 10;
  const totalPaginas = Math.ceil(dadosProcessados.length / itensPorPagina);
  const dadosPaginados = useMemo(() => {
    const inicio = pagina * itensPorPagina;
    return dadosProcessados.slice(inicio, inicio + itensPorPagina);
  }, [dadosProcessados, pagina]);

  useEffect(() => {
    setPagina(0);
    setHasError(false);
  }, [historico.length]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setKey((prev) => prev + 1);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  if (dadosProcessados.length < 2) {
    return (
      <GlassCard className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-bold text-slate-200">
            Evolução do Desempenho
          </h2>
        </div>
        <div className="h-48 flex flex-col items-center justify-center text-slate-500 gap-2">
          <BarChart3 className="w-10 h-10 opacity-30" />
          <p className="text-sm">Complete mais simulados para ver o gráfico</p>
          <p className="text-xs text-slate-600">
            Mínimo: 2 simulados (você tem {dadosProcessados.length})
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      className={`p-4 sm:p-5 ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}`}
      ref={containerRef}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-200">
              Evolução do Desempenho
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500">
              {dadosProcessados.length} simulados no período
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {totalPaginas > 1 && (
            <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
              <button
                onClick={() => setPagina((p) => Math.max(0, p - 1))}
                disabled={pagina === 0}
                className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>
              <span className="text-xs text-slate-500 px-2 min-w-[3rem] text-center">
                {pagina + 1}/{totalPaginas}
              </span>
              <button
                onClick={() =>
                  setPagina((p) => Math.min(totalPaginas - 1, p + 1))
                }
                disabled={pagina === totalPaginas - 1}
                className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Próxima página"
              >
                <ChevronRightIcon className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 transition-colors"
            aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Container do Gráfico */}
      <div
        className={`
          relative w-full bg-slate-900/30 rounded-xl border border-slate-800/50 overflow-hidden
          ${isFullscreen ? "h-[calc(100vh-120px)]" : "h-64 sm:h-72 lg:h-80"}
        `}
      >
        <AnimatePresence mode="wait">
          {hasError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <GraficoErro onRetry={handleRetry} />
            </motion.div>
          ) : (
            <motion.div
              key={`chart-${key}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full p-2 sm:p-4"
            >
              <Suspense fallback={<GraficoLoading />}>
                <div className="h-full w-full relative">
                  <ErrorBoundary onError={() => setHasError(true)}>
                    <GraficoEvolucao
                      historico={dadosPaginados}
                      altura={
                        isFullscreen ? window.innerHeight - 140 : undefined
                      }
                      mostrarMeta={true}
                      metaAprovacao={60}
                    />
                  </ErrorBoundary>
                </div>
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legenda */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Pontuação CEBRASPE
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full border border-dashed border-emerald-500" />
            % Aproveitamento
          </span>
        </div>
        <span>
          Média:{" "}
          {(
            dadosProcessados.reduce((a, b) => a + b.pontuacao, 0) /
            dadosProcessados.length
          ).toFixed(1)}{" "}
          pts
        </span>
      </div>
    </GlassCard>
  );
});

// ─── Error Boundary ───────────────────────────────────────

class ErrorBoundary extends Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ─── Stat Card ────────────────────────────────────────────

const StatCard = memo(function StatCard({
  icon: Icon,
  label,
  value,
  subvalue,
  variant,
  glow = false,
  trend,
  onClick,
}: {
  icon: typeof Trophy;
  label: string;
  value: string | number;
  subvalue?: string;
  variant: "emerald" | "purple" | "amber" | "cyan" | "rose" | "blue";
  glow?: boolean;
  trend?: { value: number; positive: boolean };
  onClick?: () => void;
}) {
  const variants = {
    emerald:
      "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20",
    purple:
      "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/20",
    amber:
      "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20",
    cyan: "from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/20",
    rose: "from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/20",
    blue: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/20",
  };

  const glowColor: GlowColor = {
    emerald: "green",
    purple: "purple",
    amber: "yellow",
    cyan: "cyan",
    rose: "red",
    blue: "blue",
  }[variant] as GlowColor;

  return (
    <GlassCard
      className={`p-3 sm:p-4 h-full transition-all duration-300 ${
        onClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : ""
      }`}
      glow={glow ? glowColor : undefined}
      intensity={glow ? "medium" : "subtle"}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-slate-400">
          <Icon
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${variants[variant].split(" ")[2]}`}
          />
          <span className="text-xs font-medium">{label}</span>
        </div>
        {trend && (
          <span
            className={`text-[10px] font-bold flex items-center gap-0.5 ${
              trend.positive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value).toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <span
          className={`text-2xl sm:text-3xl font-bold ${variants[variant].split(" ")[2]}`}
        >
          {value}
        </span>
        {subvalue && (
          <span className="text-[10px] sm:text-xs text-slate-500 block mt-0.5 truncate">
            {subvalue}
          </span>
        )}
      </div>
    </GlassCard>
  );
});

// ─── Modo Card ────────────────────────────────────────────

const ModoCard = memo(function ModoCard({
  modo,
  index,
}: {
  modo: ModoEstudo;
  index: number;
}) {
  const {
    icon: Icon,
    variant,
    title,
    description,
    xp,
    tag,
    badge,
    shortcut,
  } = modo;

  const baseColors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40",
    amber:
      "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40",
    emerald:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40",
    purple:
      "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40",
    slate:
      "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20 hover:border-slate-500/40",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        href={modo.href}
        className="block group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
        prefetch={false}
      >
        <div
          className={`
            relative overflow-hidden rounded-xl border p-4 sm:p-5 h-full
            bg-slate-800/40 backdrop-blur-sm
            transition-all duration-300
            ${baseColors[variant]}
            group-focus-visible:ring-2 group-focus-visible:ring-blue-500
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

          <div className="relative flex items-start gap-3 sm:gap-4">
            <div
              className={`
                w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0
                bg-current/10 group-hover:scale-110 transition-transform duration-300
              `}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-bold text-slate-100 text-sm sm:text-base group-hover:text-current transition-colors">
                  {title}
                </h3>
                {badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">
                    {badge}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                {description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-current/10 text-[10px] font-semibold border border-current/20">
                    {xp}
                  </span>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">
                    {tag}
                  </span>
                </div>
                {shortcut && (
                  <span className="text-[9px] text-slate-600 font-mono hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
                    {shortcut}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

// ─── Empty State ──────────────────────────────────────────

const EmptyState = memo(function EmptyState({
  onIniciar,
}: {
  onIniciar: () => void;
}) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isNavigating) return;
      setIsNavigating(true);
      onIniciar();
    },
    [onIniciar, isNavigating],
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[50vh] p-6"
    >
      <GlassCard
        className="p-8 sm:p-12 text-center max-w-lg w-full"
        glow="blue"
        intensity="strong"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center ring-4 ring-blue-500/20"
        >
          <Target className="w-12 h-12 text-blue-400" />
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Bem-vindo ao PRF Simulado!
        </h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
          Você ainda não realizou nenhum simulado. Comece agora e acompanhe sua
          evolução rumo à aprovação na Polícia Rodoviária Federal.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            type="button"
            whileHover={{ scale: isNavigating ? 1 : 1.05 }}
            whileTap={{ scale: isNavigating ? 1 : 0.95 }}
            onClick={handleClick}
            disabled={isNavigating}
            className={`
              inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
              bg-blue-500 hover:bg-blue-600 text-white font-semibold 
              transition-all shadow-lg shadow-blue-500/25 cursor-pointer
              disabled:opacity-70 disabled:cursor-not-allowed
              ${isNavigating ? "animate-pulse" : ""}
            `}
          >
            {isNavigating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Iniciar Primeiro Simulado
              </>
            )}
          </motion.button>

          <Link
            href="/como-funciona"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Como Funciona
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
});

// ─── Alerta de Desempenho ─────────────────────────────────

const AlertaDesempenho = memo(function AlertaDesempenho({
  tipo,
  mensagem,
  acao,
}: {
  tipo: "critico" | "alerta" | "info";
  mensagem: string;
  acao?: { label: string; href: string };
}) {
  const configs = {
    critico: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      text: "text-rose-300",
      icon: AlertTriangle,
    },
    alerta: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-300",
      icon: RotateCcw,
    },
    info: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-300",
      icon: TrendingUp,
    },
  };

  const config = configs[tipo];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      className={`p-4 rounded-xl ${config.bg} border ${config.border} flex items-center gap-3`}
    >
      <config.icon className={`w-5 h-5 ${config.text} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${config.text} text-sm`}>{mensagem}</p>
      </div>
      {acao && (
        <Link
          href={acao.href}
          className={`
            px-3 py-1.5 rounded-lg ${config.bg} ${config.text} 
            text-xs font-semibold hover:bg-current/20 transition-colors 
            flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-current/50
          `}
        >
          {acao.label}
        </Link>
      )}
    </motion.div>
  );
});

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function Dashboard() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNewBadge, setShowNewBadge] = useState<string | null>(null);
  const [periodoFiltro, setPeriodoFiltro] = useState<FiltroPeriodo>("todos");
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const { progress, novasConquistas, showLevelUp, dismissLevelUp } =
    useGamificacao();

  const { value: historicoStorage, setValue: setHistoricoStorage } =
    useLocalStorage<HistoricoSimulado[]>({
      key: "prf_historico",
      defaultValue: [],
    });

  const lastSyncRef = useRef<number>(0);
  const isUpdatingRef = useRef(false);

  // ─── Effects ─────────────────────────────────────────────

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const params = new URLSearchParams(window.location.search);
    const conquista = params.get("conquista");
    if (conquista) {
      setShowNewBadge(conquista);
      setShowConfetti(true);
      window.history.replaceState({}, "", window.location.pathname);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== "prf_historico" || !e.newValue || isUpdatingRef.current)
        return;
      const now = Date.now();
      if (now - lastSyncRef.current < 1000) return;
      lastSyncRef.current = now;
      try {
        const parsed = JSON.parse(e.newValue);
        if (
          Array.isArray(parsed) &&
          JSON.stringify(parsed) !== JSON.stringify(historicoStorage)
        ) {
          isUpdatingRef.current = true;
          setHistoricoStorage(parsed);
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 100);
        }
      } catch (err) {
        console.error("Erro ao sincronizar storage:", err);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [mounted, historicoStorage, setHistoricoStorage]);

  useEffect(() => {
    if (!mounted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        switch (key) {
          case "n":
            e.preventDefault();
            router.push("/simulado?modo=completo");
            break;
          case "t":
            e.preventDefault();
            router.push("/simulado?modo=turbo");
            break;
          case "e":
            e.preventDefault();
            router.push("/erros");
            break;
          case "s":
            e.preventDefault();
            document.getElementById("search-modos")?.focus();
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mounted, router]);

  useEffect(() => {
    if (novasConquistas.length > 0 && !showNewBadge && mounted) {
      setShowConfetti(true);
      setShowNewBadge(novasConquistas[0]);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [novasConquistas, showNewBadge, mounted]);

  // ─── Memos ───────────────────────────────────────────────

  const historicoFiltrado = useMemo(() => {
    if (!historicoStorage?.length) return [];
    if (periodoFiltro === "todos") return historicoStorage;
    const dias = parseInt(periodoFiltro);
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);
    return historicoStorage.filter((h) => {
      try {
        return new Date(h.data) >= dataLimite;
      } catch {
        return false;
      }
    });
  }, [historicoStorage, periodoFiltro]);

  const estatisticas = useMemo(() => {
    if (!historicoFiltrado?.length) return null;
    const ultimos7 = historicoFiltrado.slice(0, 7);
    const total = historicoFiltrado.length;

    const calcularMedia = (arr: HistoricoSimulado[]) => {
      if (!arr.length) return 0;
      const soma = arr.reduce(
        (acc, h) => acc + (h.estatisticas?.pontuacao ?? 0),
        0,
      );
      return soma / arr.length;
    };

    const mediaGeral = calcularMedia(historicoFiltrado);
    const media7Dias = calcularMedia(ultimos7);
    const tendencia =
      media7Dias > mediaGeral
        ? ("up" as const)
        : media7Dias < mediaGeral
          ? ("down" as const)
          : ("stable" as const);

    const pontuacoes = historicoFiltrado
      .map((h) => h.estatisticas?.pontuacao)
      .filter((p): p is number => typeof p === "number" && !isNaN(p));

    const melhor = pontuacoes.length ? Math.max(...pontuacoes) : 0;
    const pior = pontuacoes.length ? Math.min(...pontuacoes) : 0;

    const disciplinaStats = new Map<
      string,
      { acertos: number; total: number }
    >();
    historicoFiltrado.forEach((h) => {
      if (!Array.isArray(h.questoes)) return;
      h.questoes.forEach((q) => {
        if (!q?.disciplina) return;
        if (!disciplinaStats.has(q.disciplina)) {
          disciplinaStats.set(q.disciplina, { acertos: 0, total: 0 });
        }
        const stats = disciplinaStats.get(q.disciplina)!;
        stats.total++;
        if (q.respostaUsuario === q.resposta) stats.acertos++;
      });
    });

    const disciplinasOrdenadas = Array.from(disciplinaStats.entries()).sort(
      ([, a], [, b]) => a.acertos / a.total - b.acertos / b.total,
    );
    const disciplinaMaisFraca = disciplinasOrdenadas[0];

    const ultimoSimulado = historicoFiltrado[0];
    const ultimaPontuacao = ultimoSimulado?.estatisticas?.pontuacao ?? 0;
    const ultimoTotalQuestoes = ultimoSimulado?.questoes?.length ?? 60;
    const ultimoPercentual =
      ultimoTotalQuestoes > 0
        ? ((ultimaPontuacao + ultimoTotalQuestoes) /
            (2 * ultimoTotalQuestoes)) *
          100
        : 0;

    return {
      ultimo: ultimoSimulado,
      media: mediaGeral,
      media7Dias,
      tendencia,
      melhor,
      pior,
      total,
      classificacao: classificarDesempenho(ultimoPercentual, 60),
      disciplinaFraca: disciplinaMaisFraca
        ? {
            nome:
              DISCIPLINAS_NOME[disciplinaMaisFraca[0]] ||
              disciplinaMaisFraca[0],
            aproveitamento:
              (disciplinaMaisFraca[1].acertos / disciplinaMaisFraca[1].total) *
              100,
          }
        : null,
    };
  }, [historicoFiltrado]);

  const nivelAtual = useMemo(
    () => NIVEIS.find((n) => n.nivel === progress?.nivel) || NIVEIS[0],
    [progress?.nivel],
  );

  const progressoNivel = useMemo(() => {
    const total =
      (progress?.xpAtual ?? 0) + (progress?.xpParaProximoNivel ?? 100);
    return total > 0 ? ((progress?.xpAtual ?? 0) / total) * 100 : 0;
  }, [progress?.xpAtual, progress?.xpParaProximoNivel]);

  const modosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return MODOS_ESTUDO;
    const term = searchTerm.toLowerCase().trim();
    return MODOS_ESTUDO.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term) ||
        m.tag.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  // ─── Handlers ───────────────────────────────────────────

  const handleIniciarPrimeiroSimulado = useDebouncedCallback(() => {
    router.push("/simulado?modo=completo");
  }, 500);

  const exportarDados = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const dados = {
        historico: localStorage.getItem("prf_historico"),
        progresso: localStorage.getItem("prf_user_progress"),
        erros: localStorage.getItem("prf_erros"),
        config: localStorage.getItem("prf_config"),
        timestamp: new Date().toISOString(),
        versao: "2.0",
        app: "prf-simulado",
      };
      const blob = new Blob([JSON.stringify(dados, null, 2)], {
        type: "application/json",
      });

      if (
        "showSaveFilePicker" in window &&
        typeof window.showSaveFilePicker === "function"
      ) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: `prf-backup-${new Date().toISOString().split("T")[0]}.json`,
            types: [
              {
                description: "JSON",
                accept: { "application/json": [".json"] },
              },
            ],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
        } catch (err) {
          if ((err as Error).name !== "AbortError") throw err;
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `prf-backup-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        requestAnimationFrame(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      }
      setShowExportModal(false);
    } catch (err) {
      console.error("Erro ao exportar:", err);
      alert("Erro ao exportar dados. Verifique o console para detalhes.");
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  const importarDados = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        if (!file.type.includes("json") && !file.name.endsWith(".json")) {
          throw new Error("O arquivo deve ser um JSON válido");
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("Arquivo muito grande (máx. 10MB)");
        }
        const text = await file.text();
        let dados: Record<string, unknown>;
        try {
          dados = JSON.parse(text);
        } catch {
          throw new Error("Arquivo JSON inválido ou corrompido");
        }
        if (!dados.versao || typeof dados.versao !== "string") {
          throw new Error("Arquivo inválido: versão não encontrada");
        }
        if (dados.app !== "prf-simulado") {
          throw new Error("Arquivo não pertence a este aplicativo");
        }
        const versaoMajor = parseInt(dados.versao.split(".")[0]);
        if (isNaN(versaoMajor) || versaoMajor < 1 || versaoMajor > 2) {
          throw new Error(`Versão do arquivo incompatível: ${dados.versao}`);
        }
        const historicoAtual = dados.historico
          ? (JSON.parse(dados.historico as string)?.length ?? 0)
          : 0;
        if (
          confirm(
            `Isso substituirá ${historicoAtual} simulados existentes. Deseja continuar? (Recomendado: faça backup primeiro)`,
          )
        ) {
          const keysToImport = [
            "prf_historico",
            "prf_user_progress",
            "prf_erros",
            "prf_config",
          ];
          keysToImport.forEach((key) => {
            const value = dados[key.replace("prf_", "")] || dados[key];
            if (value && typeof value === "string") {
              localStorage.setItem(key, value);
            }
          });
          window.location.reload();
        }
      } catch (err) {
        console.error("Erro na importação:", err);
        alert(
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao importar arquivo",
        );
      }
      e.target.value = "";
    },
    [],
  );

  // ─── Render ─────────────────────────────────────────────

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-slate-800" />
          <div className="w-48 h-4 rounded bg-slate-800" />
          <div className="w-32 h-3 rounded bg-slate-800" />
        </div>
      </div>
    );
  }

  const hasData = historicoFiltrado.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white selection:bg-blue-500/30">
      <Suspense fallback={null}>
        <Confetti trigger={showConfetti && !prefersReducedMotion} />
      </Suspense>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Pular para conteúdo principal
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  PRF Simulado
                </h1>
                <p className="text-xs text-slate-400">Banca CEBRASPE</p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              {progress?.streakDias > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30"
                >
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                  <span className="text-xs sm:text-sm font-bold text-orange-300">
                    {progress.streakDias} dias
                  </span>
                </motion.div>
              )}

              <div
                className="px-2 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:ring-current"
                style={{
                  backgroundColor: `${nivelAtual?.cor || "#3b82f6"}15`,
                  borderColor: `${nivelAtual?.cor || "#3b82f6"}40`,
                  color: nivelAtual?.cor || "#3b82f6",
                }}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {nivelAtual?.nome || "Iniciante"}
                </span>
                <span className="sm:hidden">Nv.{progress?.nivel || 1}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
      >
        {!hasData ? (
          <EmptyState onIniciar={handleIniciarPrimeiroSimulado} />
        ) : (
          <>
            {/* Filtro de Período */}
            <nav
              aria-label="Filtro de período"
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-slate-500 font-medium">
                Período:
              </span>
              {[
                { value: "7" as const, label: "7 dias" },
                { value: "30" as const, label: "30 dias" },
                { value: "90" as const, label: "3 meses" },
                { value: "todos" as const, label: "Todo histórico" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriodoFiltro(p.value)}
                  aria-pressed={periodoFiltro === p.value}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    ${
                      periodoFiltro === p.value
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                    }
                  `}
                >
                  {p.label}
                </button>
              ))}
            </nav>

            {/* Grid Principal */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Card de Nível */}
              <GlassCard className="p-5 sm:p-6" glow="purple">
                <div className="flex items-center gap-5">
                  <ProgressRing
                    progress={progressoNivel}
                    size={90}
                    strokeWidth={8}
                    color={nivelAtual?.cor || "#3b82f6"}
                  >
                    <div className="text-center">
                      <span className="text-3xl font-bold text-white">
                        {progress?.nivel || 1}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        NÍVEL
                      </span>
                    </div>
                  </ProgressRing>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white mb-1">
                      {nivelAtual?.nome || "Iniciante"}
                    </h2>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: nivelAtual?.cor || "#3b82f6",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressoNivel}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">
                      {(progress?.xpParaProximoNivel || 0).toLocaleString()} XP
                      para próximo nível
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Stats Grid */}
              {estatisticas ? (
                <div className="xl:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatCard
                    icon={CheckCircle2}
                    label="Média Geral"
                    value={estatisticas.media.toFixed(1)}
                    subvalue="pontos"
                    variant="emerald"
                    trend={
                      estatisticas.tendencia !== "stable"
                        ? {
                            value: Math.abs(
                              ((estatisticas.media7Dias - estatisticas.media) /
                                (estatisticas.media || 1)) *
                                100,
                            ),
                            positive: estatisticas.tendencia === "up",
                          }
                        : undefined
                    }
                  />
                  <StatCard
                    icon={Trophy}
                    label="Melhor Pontuação"
                    value={estatisticas.melhor}
                    subvalue={`de ${estatisticas.pior} (pior)`}
                    variant="purple"
                    glow
                  />
                  <StatCard
                    icon={Calendar}
                    label="Simulados"
                    value={estatisticas.total}
                    subvalue={`${periodoFiltro === "todos" ? "no total" : `em ${periodoFiltro} dias`}`}
                    variant="amber"
                  />
                  <StatCard
                    icon={Clock}
                    label="Último Simulado"
                    value={new Date(
                      estatisticas.ultimo?.data || Date.now(),
                    ).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                    subvalue={`${estatisticas.ultimo?.estatisticas?.pontuacao || 0} pts`}
                    variant="cyan"
                  />
                </div>
              ) : (
                <div className="xl:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-slate-800/50 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Alertas */}
            <div
              className="space-y-3"
              role="region"
              aria-label="Alertas de desempenho"
            >
              {estatisticas?.classificacao?.nivel === "critico" && (
                <AlertaDesempenho
                  tipo="critico"
                  mensagem="Seu último simulado foi significativamente abaixo da média. Recomendamos revisar erros antes de continuar."
                  acao={{ label: "Revisar Erros", href: "/erros" }}
                />
              )}
              {estatisticas?.disciplinaFraca &&
                estatisticas.disciplinaFraca.aproveitamento < 50 && (
                  <AlertaDesempenho
                    tipo="alerta"
                    mensagem={`${estatisticas.disciplinaFraca.nome} está com apenas ${estatisticas.disciplinaFraca.aproveitamento.toFixed(0)}% de aproveitamento. Que tal um treino focado?`}
                    acao={{ label: "Treinar", href: "/treino" }}
                  />
                )}
              {(progress?.streakDias || 0) >= 3 && (
                <AlertaDesempenho
                  tipo="info"
                  mensagem={`Você está em uma sequência de ${progress.streakDias} dias! Mantenha o ritmo para maximizar seus resultados.`}
                />
              )}
            </div>

            {/* Conquistas */}
            <GlassCard className="p-5 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      Conquistas
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {progress?.badges?.length || 0} de {BADGES_DISPLAY.length}{" "}
                      desbloqueadas
                    </p>
                  </div>
                </div>

                <Link
                  href="/conquistas"
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                >
                  Ver todas
                  <ChevronRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Grid de Badges */}
              <div className="relative">
                {/* Container com padding interno para evitar corte nas bordas */}
                <div className="flex gap-3 overflow-x-auto pb-3 pt-1 px-1 -mx-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent sm:grid sm:grid-cols-6 sm:overflow-visible sm:pb-0 sm:pt-0 sm:px-0 sm:mx-0">
                  {BADGES_DISPLAY.map((badge, index) => {
                    const isUnlocked =
                      progress?.badges?.some((b) => b.id === badge) || false;

                    return (
                      <motion.div
                        key={badge}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.3 }}
                        whileHover={
                          isUnlocked ? { scale: 1.08, y: -3 } : { scale: 1.02 }
                        }
                        className={`
              flex-shrink-0 relative flex flex-col items-center gap-2 p-3 rounded-xl
              transition-all duration-300
              ${
                isUnlocked
                  ? "bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/30 shadow-lg shadow-black/20"
                  : "bg-slate-900/30 border border-slate-800/50 opacity-60 grayscale"
              }
            `}
                      >
                        {/* Badge */}
                        <div className="relative">
                          <Badge type={badge} unlocked={isUnlocked} size="md" />

                          {/* Indicador de status */}
                          {isUnlocked && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                              <CheckCircle2 className="w-2 h-2 text-slate-900" />
                            </div>
                          )}
                        </div>

                        {/* Label do badge */}
                        <span
                          className={`
              text-[10px] font-medium text-center leading-tight max-w-[70px]
              ${isUnlocked ? "text-slate-300" : "text-slate-600"}
            `}
                        >
                          {getBadgeLabel(badge)}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Indicador de scroll mobile */}
                <div className="sm:hidden flex justify-center gap-1.5 mt-2">
                  {BADGES_DISPLAY.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === 0 ? "bg-amber-500" : "bg-slate-700"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="mt-5 pt-5 border-t border-slate-800/50">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Progresso geral</span>
                  <span className="font-bold text-amber-400">
                    {Math.round(
                      ((progress?.badges?.length || 0) /
                        BADGES_DISPLAY.length) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 rounded-full shadow-lg shadow-amber-500/20"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((progress?.badges?.length || 0) / BADGES_DISPLAY.length) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  Complete simulados e mantenha sua sequência de estudos para
                  desbloquear mais conquistas.
                </p>
              </div>
            </GlassCard>

            {/* Gráfico de Evolução - COMPONENTE APERFEIÇOADO */}
            {historicoFiltrado.length > 1 && (
              <SecaoGraficoEvolucao
                historico={historicoFiltrado}
                maxItens={30}
              />
            )}

            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="search-modos"
                type="text"
                placeholder="Buscar modos de estudo... (Ctrl+S)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                aria-label="Buscar modos de estudo"
              />
            </div>

            {/* Modos */}
            <section aria-label="Modos de estudo">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-200">
                <Star className="w-5 h-5 text-amber-400" />
                Escolha seu Modo
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-500 ml-auto font-mono">
                  <Keyboard className="w-3 h-3" />
                  Atalhos: Ctrl+N, Ctrl+T, Ctrl+E
                </span>
              </h2>

              {modosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-slate-500" role="status">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    Nenhum modo encontrado para "{searchTerm}"
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-blue-400 text-xs mt-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-2 py-1"
                  >
                    Limpar busca
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modosFiltrados.map((modo, index) => (
                    <ModoCard key={modo.href} modo={modo} index={index} />
                  ))}
                </div>
              )}
            </section>

            {/* Regras e Backup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard className="p-5" variant="info">
                <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-slate-200">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Regra de Pontuação CEBRASPE
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      label: "Acerto",
                      value: "+1",
                      color: "emerald",
                      desc: "Ganha 1 ponto",
                    },
                    {
                      label: "Erro",
                      value: "-1",
                      color: "rose",
                      desc: "Perde 1 ponto",
                    },
                    {
                      label: "Em branco",
                      value: "0",
                      color: "slate",
                      desc: "Não altera",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between p-3 rounded-lg bg-${item.color}-500/10 border border-${item.color}-500/20`}
                    >
                      <div>
                        <span
                          className={`text-${item.color}-400 text-sm font-medium block`}
                        >
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.desc}
                        </span>
                      </div>
                      <span
                        className={`font-bold text-lg text-${item.color}-400`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
                  * Um erro anula um acerto. Questões em branco não penalizam,
                  mas não pontuam.
                </p>
              </GlassCard>

              <GlassCard className="p-5">
                <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-slate-200">
                  <Settings className="w-5 h-5 text-purple-400" />
                  Backup e Sincronização
                </h3>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                  Exporte seus dados para fazer backup ou transferir para outro
                  dispositivo.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowExportModal(true)}
                    disabled={isExporting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {isExporting ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isExporting ? "Exportando..." : "Exportar Dados"}
                  </button>
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all text-sm font-medium focus-within:ring-2 focus-within:ring-blue-500">
                    <Upload className="w-4 h-4" />
                    Importar
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={importarDados}
                      className="hidden"
                      aria-label="Importar dados de backup"
                    />
                  </label>
                </div>
              </GlassCard>
            </div>
          </>
        )}
      </main>

      {/* Modal Export */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => !isExporting && setShowExportModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-title"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3
                id="export-title"
                className="text-lg font-bold text-white mb-2"
              >
                Exportar Dados
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Seus dados serão salvos em um arquivo JSON para backup local.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-3 mb-4 text-xs text-slate-500 font-mono">
                {historicoFiltrado?.length || 0} simulados •{" "}
                {progress?.badges?.length || 0} conquistas • Nível{" "}
                {progress?.nivel || 1}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportarDados}
                  disabled={isExporting}
                  className="flex-1 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {isExporting ? "Exportando..." : "Confirmar"}
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  disabled={isExporting}
                  className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notificações */}
      <AnimatePresence>
        {showNewBadge && (
          <NewBadgeNotification
            badgeType={showNewBadge as any}
            onClose={() => setShowNewBadge(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={dismissLevelUp}
            role="dialog"
            aria-modal="true"
            aria-label="Level Up"
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }
                }
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-7xl mb-6"
                aria-hidden="true"
              >
                🎉
              </motion.div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                LEVEL UP!
              </h2>
              <p className="text-lg text-slate-300 mb-4">Você alcançou</p>
              <div
                className="inline-block px-8 py-4 rounded-2xl bg-slate-800/80 border-2 mb-6"
                style={{ borderColor: nivelAtual?.cor || "#3b82f6" }}
              >
                <span className="text-3xl font-bold text-white block">
                  {nivelAtual?.nome || "Novo Nível"}
                </span>
                <span className="text-sm text-slate-400">
                  Nível {progress?.nivel || 1}
                </span>
              </div>
              <button
                onClick={dismissLevelUp}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold transition-all shadow-lg shadow-blue-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Continuar Jornada
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
