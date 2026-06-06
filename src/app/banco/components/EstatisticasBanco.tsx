"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Database,
  Filter,
  PieChart,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

import type { StatsData } from "@/data/questoes";

// ─── Props ────────────────────────────────────────────────────────────────────

interface EstatisticasBancoProps {
  stats: StatsData;
  isLoading?: boolean;
  onFiltrarPorDificuldade?: (dificuldade: number | null) => void;
  onFiltrarPorBanca?: (banca: string | null) => void;
  onFiltrarPorAno?: (ano: string | null) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNumber = (num: number): string => {
  if (!Number.isFinite(num) || num < 0) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toLocaleString("pt-BR");
};

const safePct = (value: number, total: number): number =>
  total > 0 ? Math.min(100, Math.max(0, (value / total) * 100)) : 0;

// ─── Shimmer Skeleton ─────────────────────────────────────────────────────────

const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
    <div className="bg-white/[0.04] w-full h-full" />
    <style>{`@keyframes shimmer { to { transform: translateX(200%); } }`}</style>
  </div>
);

const StatsSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/30 border border-white/10 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Shimmer className="w-8 h-8 rounded-xl" />
            <Shimmer className="h-3 flex-1" />
          </div>
          <Shimmer className="h-8 w-3/4" />
          <Shimmer className="h-2 w-1/2" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-slate-800/30 border border-white/10 space-y-3"
        >
          <Shimmer className="h-5 w-1/3" />
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="space-y-1.5">
              <div className="flex justify-between">
                <Shimmer className="h-3 w-16" />
                <Shimmer className="h-3 w-20" />
              </div>
              <Shimmer className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyStats = ({ onRefresh }: { onRefresh?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/30 border border-white/10 text-center gap-4"
  >
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
      <div className="relative p-4 rounded-2xl bg-slate-800/50 border border-white/10">
        <Database className="w-10 h-10 text-slate-500" />
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white mb-1">Banco vazio</h3>
      <p className="text-sm text-slate-400 max-w-xs">
        Adicione questões ao banco para visualizar as estatísticas aqui.
      </p>
    </div>
    {onRefresh && (
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-all"
      >
        <RefreshCw className="w-4 h-4" /> Recarregar
      </button>
    )}
  </motion.div>
);

// ─── Metric Card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent: string;
  bg: string;
  border: string;
  delay?: number;
  trend?: "up" | "down" | "stable";
}

const MetricCard = ({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  bg,
  border,
  delay = 0,
  trend,
}: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    whileHover={{ y: -2 }}
    className={`group p-4 rounded-2xl bg-gradient-to-br ${bg} border ${border} transition-all duration-300 hover:shadow-lg`}
  >
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="p-1.5 rounded-xl bg-white/[0.06] border border-white/[0.07]">
          <Icon className={`w-4 h-4 ${accent}`} />
        </div>
        {trend && (
          <span
            className={`text-[10px] font-medium ${
              trend === "up"
                ? "text-emerald-400"
                : trend === "down"
                  ? "text-rose-400"
                  : "text-slate-400"
            }`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
        {label}
      </p>
      <p className={`text-2xl font-bold tabular-nums ${accent}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-500">{sub}</p>}
    </div>
  </motion.div>
);

// ─── Progress Bar Row ─────────────────────────────────────────────────────────

interface BarRowProps {
  label: string;
  value: number;
  total: number;
  color: string;
  delay?: number;
  onClick?: () => void;
  active?: boolean;
}

const BarRow = ({
  label,
  value,
  total,
  color,
  delay = 0,
  onClick,
  active,
}: BarRowProps) => {
  const pct = safePct(value, total);
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={`group rounded-xl p-3 transition-all duration-200 ${
        onClick ? "cursor-pointer hover:bg-white/[0.04]" : ""
      } ${active ? "bg-white/[0.06] border border-white/10" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-xs font-medium ${active ? "text-white" : "text-slate-400"}`}
        >
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs tabular-nums text-slate-500">
            {formatNumber(value)}
          </span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
              active
                ? "bg-white/10 text-white"
                : "bg-white/[0.04] text-slate-500"
            }`}
          >
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
          className={`h-full rounded-full ${color} ${
            active ? "opacity-100" : "opacity-70 group-hover:opacity-100"
          } transition-opacity`}
        />
      </div>
    </div>
  );
};

// ─── Filter Chip ──────────────────────────────────────────────────────────────

const FilterChip = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.85 }}
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 text-[11px] font-medium"
  >
    <Filter className="w-2.5 h-2.5" />
    {label}
    <button
      onClick={onRemove}
      className="hover:text-blue-300 transition-colors rounded-full p-0.5 hover:bg-blue-500/20"
    >
      <X className="w-2.5 h-2.5" />
    </button>
  </motion.span>
);

// ─── Collapsible Section ──────────────────────────────────────────────────────

const Section = ({
  title,
  icon: Icon,
  iconColor,
  children,
  delay = 0,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  children: React.ReactNode;
  delay?: number;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/30 border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-white/5 transition-colors"
        aria-expanded={open}
      >
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <span className="p-1.5 rounded-lg bg-white/[0.05]">
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </span>
          {title}
        </h3>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function EstatisticasBanco({
  stats,
  isLoading = false,
  onFiltrarPorDificuldade,
  onFiltrarPorBanca,
  onFiltrarPorAno,
}: EstatisticasBancoProps) {
  const [activeDificuldade, setActiveDificuldade] = useState<number | null>(
    null,
  );
  const [activeBanca, setActiveBanca] = useState<string | null>(null);
  const [activeAno, setActiveAno] = useState<string | null>(null);

  const toastRef = useRef<string | number | null>(null);
  const showToast = useCallback((msg: string) => {
    if (toastRef.current) toast.dismiss(toastRef.current);
    toastRef.current = toast.info(msg, { duration: 2000 });
  }, []);

  const handleDificuldade = useCallback(
    (d: number) => {
      const next = activeDificuldade === d ? null : d;
      setActiveDificuldade(next);
      onFiltrarPorDificuldade?.(next);
      showToast(
        next
          ? `Filtrando: ${next === 1 ? "Fácil" : next === 2 ? "Médio" : "Difícil"}`
          : "Filtro de dificuldade removido",
      );
    },
    [activeDificuldade, onFiltrarPorDificuldade, showToast],
  );

  const handleBanca = useCallback(
    (b: string) => {
      const next = activeBanca === b ? null : b;
      setActiveBanca(next);
      onFiltrarPorBanca?.(next);
      showToast(next ? `Filtrando banca: ${next}` : "Filtro de banca removido");
    },
    [activeBanca, onFiltrarPorBanca, showToast],
  );

  const handleAno = useCallback(
    (a: string) => {
      const next = activeAno === a ? null : a;
      setActiveAno(next);
      onFiltrarPorAno?.(next);
      showToast(next ? `Filtrando ano: ${next}` : "Filtro de ano removido");
    },
    [activeAno, onFiltrarPorAno, showToast],
  );

  const clearAll = useCallback(() => {
    setActiveDificuldade(null);
    setActiveBanca(null);
    setActiveAno(null);
    onFiltrarPorDificuldade?.(null);
    onFiltrarPorBanca?.(null);
    onFiltrarPorAno?.(null);
    showToast("Todos os filtros removidos");
  }, [onFiltrarPorDificuldade, onFiltrarPorBanca, onFiltrarPorAno, showToast]);

  // Memoized derivations from stats
  const totalSafe = useMemo(() => stats?.total ?? 0, [stats]);
  const porDif = useMemo(
    () => stats?.porDificuldade ?? { 1: 0, 2: 0, 3: 0 },
    [stats],
  );
  const bancas = useMemo(() => stats?.bancasPrincipais ?? {}, [stats]);
  const anos = useMemo(() => stats?.questoesPorAno ?? {}, [stats]);
  const ultimasAdd = useMemo(() => stats?.ultimasAdicoes ?? 0, [stats]);
  const taxaAcerto = useMemo(() => stats?.taxaAcertoMedia, [stats]);
  const mediaDificuldade = useMemo(() => stats?.mediaDificuldade, [stats]);

  const cards = useMemo(
    () => [
      {
        icon: Database,
        label: "Total",
        value: formatNumber(totalSafe),
        sub: "questões no banco",
        accent: "text-blue-400",
        bg: "bg-blue-500/5",
        border: "border-blue-500/20",
        delay: 0.05,
      },
      {
        icon: TrendingUp,
        label: "Dif. Média",
        value: mediaDificuldade ?? "—",
        sub: "1 = fácil · 3 = difícil",
        accent: "text-purple-400",
        bg: "bg-purple-500/5",
        border: "border-purple-500/20",
        delay: 0.1,
      },
      {
        icon: Brain,
        label: "Com Tags",
        value: formatNumber(stats?.totalComTags ?? 0),
        sub: `${safePct(stats?.totalComTags ?? 0, totalSafe).toFixed(1)}%`,
        accent: "text-emerald-400",
        bg: "bg-emerald-500/5",
        border: "border-emerald-500/20",
        delay: 0.15,
      },
      {
        icon: BookOpen,
        label: "Fonte Legal",
        value: formatNumber(stats?.totalComFonteLegal ?? 0),
        sub: `${safePct(stats?.totalComFonteLegal ?? 0, totalSafe).toFixed(1)}%`,
        accent: "text-amber-400",
        bg: "bg-amber-500/5",
        border: "border-amber-500/20",
        delay: 0.2,
      },
      {
        icon: Building2,
        label: "Bancas",
        value: formatNumber(Object.keys(bancas).length),
        sub: "organizadoras",
        accent: "text-rose-400",
        bg: "bg-rose-500/5",
        border: "border-rose-500/20",
        delay: 0.25,
      },
      {
        icon: Calendar,
        label: "Anos",
        value: formatNumber(Object.keys(anos).length),
        sub: "anos diferentes",
        accent: "text-cyan-400",
        bg: "bg-cyan-500/5",
        border: "border-cyan-500/20",
        delay: 0.3,
      },
      {
        icon: Target,
        label: "Taxa Acerto",
        value: taxaAcerto != null ? `${taxaAcerto.toFixed(1)}%` : "N/A",
        sub: taxaAcerto != null ? "média dos usuários" : undefined,
        accent: "text-indigo-400",
        bg: "bg-indigo-500/5",
        border: "border-indigo-500/20",
        delay: 0.35,
      },
      {
        icon: Award,
        label: "Recentes",
        value: formatNumber(ultimasAdd),
        sub: "últimos 2 anos",
        accent: "text-orange-400",
        bg: "bg-orange-500/5",
        border: "border-orange-500/20",
        delay: 0.4,
      },
    ],
    [stats, totalSafe, bancas, anos, taxaAcerto, ultimasAdd, mediaDificuldade],
  );

  const dificuldades = useMemo(
    () => [
      { label: "Fácil", value: porDif[1] ?? 0, color: "bg-emerald-500", d: 1 },
      { label: "Médio", value: porDif[2] ?? 0, color: "bg-amber-500", d: 2 },
      { label: "Difícil", value: porDif[3] ?? 0, color: "bg-rose-500", d: 3 },
    ],
    [porDif],
  );

  const bancasSorted = useMemo(
    () =>
      Object.entries(bancas)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6),
    [bancas],
  );

  const anosSorted = useMemo(
    () =>
      Object.entries(anos)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .slice(0, 8),
    [anos],
  );

  const activeFilters = useMemo(() => {
    const filters = [
      activeDificuldade != null && {
        label:
          activeDificuldade === 1
            ? "Fácil"
            : activeDificuldade === 2
              ? "Médio"
              : "Difícil",
        onRemove: () => handleDificuldade(activeDificuldade),
      },
      activeBanca && {
        label: activeBanca,
        onRemove: () => handleBanca(activeBanca),
      },
      activeAno && {
        label: activeAno,
        onRemove: () => handleAno(activeAno),
      },
    ].filter(Boolean) as { label: string; onRemove: () => void }[];
    return filters;
  }, [
    activeDificuldade,
    activeBanca,
    activeAno,
    handleDificuldade,
    handleBanca,
    handleAno,
  ]);

  if (isLoading) return <StatsSkeleton />;
  if (!totalSafe)
    return <EmptyStats onRefresh={() => window.location.reload()} />;

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="space-y-6">
        {/* Header com gradiente */}
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Estatísticas do Banco
            </h2>
            <p className="text-[10px] text-slate-500">
              Análise completa do banco de questões
            </p>
          </div>
        </div>

        {/* Active filter chips */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center flex-wrap gap-2 px-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mr-1">
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Filtros ativos:</span>
                </div>
                {activeFilters.map((f) => (
                  <FilterChip
                    key={f.label}
                    label={f.label}
                    onRemove={f.onRemove}
                  />
                ))}
                <button
                  onClick={clearAll}
                  className="ml-auto text-[10px] text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
                >
                  Limpar todos
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metric grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cards.map((c) => (
            <MetricCard key={c.label} {...c} />
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Dificuldade */}
          <Section
            title="Distribuição por Dificuldade"
            icon={PieChart}
            iconColor="text-purple-400"
            delay={0.45}
          >
            {dificuldades.map((d, i) => (
              <BarRow
                key={d.label}
                label={d.label}
                value={d.value}
                total={totalSafe}
                color={d.color}
                delay={0.5 + i * 0.07}
                active={activeDificuldade === d.d}
                onClick={() => handleDificuldade(d.d)}
              />
            ))}
          </Section>

          {/* Bancas */}
          {bancasSorted.length > 0 && (
            <Section
              title="Principais Bancas"
              icon={Building2}
              iconColor="text-rose-400"
              delay={0.5}
            >
              {bancasSorted.map(([banca, qty], i) => (
                <BarRow
                  key={banca}
                  label={
                    banca.length > 20 ? banca.substring(0, 18) + "..." : banca
                  }
                  value={qty}
                  total={totalSafe}
                  color="bg-rose-500"
                  delay={0.55 + i * 0.05}
                  active={activeBanca === banca}
                  onClick={() => handleBanca(banca)}
                />
              ))}
            </Section>
          )}

          {/* Anos */}
          {anosSorted.length > 0 && (
            <Section
              title="Distribuição por Ano"
              icon={Calendar}
              iconColor="text-cyan-400"
              delay={0.55}
            >
              <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {anosSorted.map(([ano, qty], i) => (
                  <BarRow
                    key={ano}
                    label={ano}
                    value={qty}
                    total={totalSafe}
                    color="bg-cyan-500"
                    delay={0.6 + i * 0.04}
                    active={activeAno === ano}
                    onClick={() => handleAno(ano)}
                  />
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Insight adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center"
        >
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            Dica: Clique nas barras para filtrar questões por dificuldade, banca
            ou ano!
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
