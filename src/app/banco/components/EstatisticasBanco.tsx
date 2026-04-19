"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Database,
  RefreshCw,
  SlidersHorizontal,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

// Import the shared type from data layer
import type { StatsData } from "@/data";

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
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
    <div className="bg-white/[0.04] w-full h-full" />
    <style>{`@keyframes shimmer { to { transform: translateX(200%); } }`}</style>
  </div>
);

const StatsSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3"
        >
          <div className="flex items-center gap-2">
            <Shimmer className="w-8 h-8 rounded-xl" />
            <Shimmer className="h-3 flex-1" />
          </div>
          <Shimmer className="h-7 w-3/4" />
          <Shimmer className="h-2 w-1/2" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3"
        >
          <Shimmer className="h-4 w-1/3" />
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
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center gap-4"
  >
    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
      <Database className="w-10 h-10 text-slate-500" />
    </div>
    <div>
      <h3 className="text-base font-semibold text-white mb-1">Banco vazio</h3>
      <p className="text-sm text-slate-500 max-w-xs">
        Adicione questões ao banco para visualizar as estatísticas aqui.
      </p>
    </div>
    {onRefresh && (
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-sm transition-colors"
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
}: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className={`group p-4 rounded-2xl border ${bg} ${border} overflow-hidden`}
  >
    <div className="flex flex-col gap-2">
      <div className="p-1.5 rounded-xl bg-white/[0.06] border border-white/[0.07] w-fit">
        <Icon className={`w-3.5 h-3.5 ${accent}`} />
      </div>
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider leading-none">
        {label}
      </p>
      <p className={`text-2xl font-bold tabular-nums ${accent}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-600">{sub}</p>}
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
      className={`group rounded-xl p-3 transition-colors ${
        onClick
          ? "cursor-pointer hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          : ""
      } ${active ? "bg-white/[0.06]" : ""}`}
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
                : "bg-white/[0.04] text-slate-600"
            }`}
          >
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
          className={`h-full rounded-full ${color} ${
            active ? "opacity-100" : "opacity-60 group-hover:opacity-80"
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
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-[11px] font-medium"
  >
    {label}
    <button
      onClick={onRemove}
      className="hover:text-blue-300 transition-colors rounded-full p-0.5 hover:bg-blue-500/20"
      aria-label={`Remover filtro ${label}`}
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
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  children: React.ReactNode;
  delay?: number;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-2xl bg-white/[0.025] border border-white/[0.06] overflow-hidden"
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        aria-expanded={open}
      >
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <span className="p-1.5 rounded-lg bg-white/[0.05]">
            <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
          </span>
          {title}
        </h3>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-600" />
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
            <div className="px-2 pb-4">{children}</div>
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

  const totalSafe = stats?.total ?? 0;
  const porDif = stats?.porDificuldade ?? { 1: 0, 2: 0, 3: 0 };
  const bancas = stats?.bancasPrincipais ?? {}; // ← correto agora
  const anos = stats?.questoesPorAno ?? {}; // ← correto agora
  const ultimasAdd = stats?.ultimasAdicoes ?? 0; // ← correto agora
  const taxaAcerto = stats?.taxaAcertoMedia; // number | null

  // ── Metric cards ──────────────────────────────────────────────────────────
  const cards = useMemo(
    () => [
      {
        icon: Database,
        label: "Total",
        value: formatNumber(totalSafe),
        sub: "questões no banco",
        accent: "text-sky-400",
        bg: "bg-sky-500/5",
        border: "border-sky-500/10",
        delay: 0.05,
      },
      {
        icon: TrendingUp,
        label: "Dif. Média",
        value: stats?.mediaDificuldade ?? "—",
        sub: "1 = fácil · 3 = difícil",
        accent: "text-violet-400",
        bg: "bg-violet-500/5",
        border: "border-violet-500/10",
        delay: 0.1,
      },
      {
        icon: Brain,
        label: "Com Tags",
        value: formatNumber(stats?.totalComTags ?? 0),
        sub: `${safePct(stats?.totalComTags ?? 0, totalSafe).toFixed(1)}% do total`,
        accent: "text-emerald-400",
        bg: "bg-emerald-500/5",
        border: "border-emerald-500/10",
        delay: 0.15,
      },
      {
        icon: BookOpen,
        label: "Fonte Legal",
        value: formatNumber(stats?.totalComFonteLegal ?? 0),
        sub: `${safePct(stats?.totalComFonteLegal ?? 0, totalSafe).toFixed(1)}% do total`,
        accent: "text-amber-400",
        bg: "bg-amber-500/5",
        border: "border-amber-500/10",
        delay: 0.2,
      },
      {
        icon: Building2,
        label: "Bancas",
        value: formatNumber(Object.keys(bancas).length),
        sub: "organizadoras",
        accent: "text-rose-400",
        bg: "bg-rose-500/5",
        border: "border-rose-500/10",
        delay: 0.25,
      },
      {
        icon: Calendar,
        label: "Anos",
        value: formatNumber(Object.keys(anos).length),
        sub: "anos diferentes",
        accent: "text-cyan-400",
        bg: "bg-cyan-500/5",
        border: "border-cyan-500/10",
        delay: 0.3,
      },
      {
        icon: Target,
        label: "Taxa Acerto",
        // taxaAcertoMedia é number | null — exibe "N/A" quando null
        value: taxaAcerto != null ? `${taxaAcerto}%` : "N/A",
        sub: taxaAcerto != null ? "média dos usuários" : undefined,
        accent: "text-indigo-400",
        bg: "bg-indigo-500/5",
        border: "border-indigo-500/10",
        delay: 0.35,
      },
      {
        icon: Award,
        label: "Recentes",
        // ultimasAdicoes = questões dos últimos 2 anos (calculado em getEstatisticasBanco)
        value: formatNumber(ultimasAdd),
        sub: "últimos 2 anos",
        accent: "text-orange-400",
        bg: "bg-orange-500/5",
        border: "border-orange-500/10",
        delay: 0.4,
      },
    ],
    [stats, totalSafe, bancas, anos, taxaAcerto, ultimasAdd],
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

  const activeFilters = [
    activeDificuldade != null && {
      label: `Dif: ${activeDificuldade === 1 ? "Fácil" : activeDificuldade === 2 ? "Médio" : "Difícil"}`,
      onRemove: () => handleDificuldade(activeDificuldade),
    },
    activeBanca && {
      label: `Banca: ${activeBanca}`,
      onRemove: () => handleBanca(activeBanca),
    },
    activeAno && {
      label: `Ano: ${activeAno}`,
      onRemove: () => handleAno(activeAno),
    },
  ].filter(Boolean) as { label: string; onRemove: () => void }[];

  // ── Render guards ──────────────────────────────────────────────────────────
  if (isLoading) return <StatsSkeleton />;
  if (!totalSafe)
    return <EmptyStats onRefresh={() => window.location.reload()} />;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(15,17,23,0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#e2e8f0",
            fontSize: "13px",
            backdropFilter: "blur(12px)",
          },
        }}
      />

      <div className="space-y-4">
        {/* ── Active filter chips ── */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              key="chips"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center flex-wrap gap-2 px-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mr-1">
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Filtros:</span>
                </div>
                {activeFilters.map((f) => (
                  <FilterChip key={f.label} {...f} />
                ))}
                <button
                  onClick={clearAll}
                  className="ml-auto text-[11px] text-slate-600 hover:text-slate-400 transition-colors underline underline-offset-2"
                >
                  Limpar tudo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Metric grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cards.map((c) => (
            <MetricCard key={c.label} {...c} />
          ))}
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Dificuldade */}
          <Section
            title="Distribuição por Dificuldade"
            icon={TrendingUp}
            iconColor="text-violet-400"
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

          {/* Bancas — só renderiza se há dados */}
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
                  label={banca}
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

          {/* Anos — só renderiza se há dados */}
          {anosSorted.length > 0 && (
            <Section
              title="Distribuição por Ano"
              icon={Calendar}
              iconColor="text-cyan-400"
              delay={0.55}
            >
              <div className="max-h-56 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
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
      </div>
    </>
  );
}
