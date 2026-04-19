"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bookmark,
  Check,
  Code,
  FileText,
  Loader2,
  Play,
  RotateCcw,
  Table,
  X,
  Zap,
} from "lucide-react";
import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { GlassCard } from "@/components/ui/GlassCard";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

// ─── Types ────────────────────────────────────────────────────────────────────

type ExportFormat = "pdf" | "csv" | "json";

export interface AcoesBancoProps {
  totalQuestoes: number;
  questoesSelecionadas: number;
  onExportar: (formato: ExportFormat) => void | Promise<void>;
  onTreinar: () => void | Promise<void>;
  onResetarFiltros: () => void;
}

// ─── Error Boundary ───────────────────────────────────────────────────────────

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

const ErrorFallback = () => (
  <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start gap-3">
    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
    <div>
      <p className="font-semibold text-sm">Algo deu errado</p>
      <p className="text-xs text-rose-400/70 mt-0.5">Tente recarregar a página</p>
    </div>
  </div>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const safePct = (a: number, b: number) =>
  b > 0 ? Math.min(100, Math.max(0, (a / b) * 100)) : 0;

const formatQuestoes = (n: number) =>
  n === 1 ? "1 questão" : `${n.toLocaleString("pt-BR")} questões`;

// ─── Ripple Button ────────────────────────────────────────────────────────────

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const RippleButton = memo(function RippleButton({
  children,
  onClick,
  className = "",
  disabled = false,
  loading = false,
  ...rest
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const id = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rid = ++id.current;
    setRipples((p) => [...p, { id: rid, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== rid)), 700);
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative overflow-hidden select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${className}`}
      {...rest}
    >
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.35 }}
          animate={{ scale: 22, opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="absolute w-5 h-5 rounded-full bg-white/25 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </button>
  );
});

// ─── Stats Card ───────────────────────────────────────────────────────────────

const StatsCard = memo(function StatsCard({
  totalQuestoes,
  questoesSelecionadas,
}: {
  totalQuestoes: number;
  questoesSelecionadas: number;
}) {
  const pct = safePct(totalQuestoes, questoesSelecionadas);
  const filtered = totalQuestoes !== questoesSelecionadas;

  return (
    <div className="flex items-end gap-3 shrink-0">
      <div>
        <motion.p
          key={totalQuestoes}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="text-4xl font-bold tabular-nums text-white leading-none"
        >
          {totalQuestoes.toLocaleString("pt-BR")}
        </motion.p>
        <p className="text-sm text-slate-500 mt-1">
          questão{totalQuestoes !== 1 ? "s" : ""} encontrada{totalQuestoes !== 1 ? "s" : ""}
        </p>
      </div>

      {filtered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-0.5 px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08]"
        >
          <p className="text-[11px] text-slate-500 leading-tight">
            de {questoesSelecionadas.toLocaleString("pt-BR")} total
          </p>
          <p className="text-[11px] font-semibold text-slate-400">
            {pct.toFixed(0)}% exibidas
          </p>
        </motion.div>
      )}
    </div>
  );
});

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressBar = memo(function ProgressBar({
  totalQuestoes,
  questoesSelecionadas,
}: {
  totalQuestoes: number;
  questoesSelecionadas: number;
}) {
  const pct = safePct(totalQuestoes, questoesSelecionadas);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[11px] text-slate-600 uppercase tracking-wider font-medium">
          Seleção
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
        />
      </div>
    </div>
  );
});

// ─── Export Format Icons ──────────────────────────────────────────────────────

const EXPORT_ICONS: Record<ExportFormat, React.ReactElement> = {
  pdf:  <FileText className="w-3.5 h-3.5" />,
  csv:  <Table    className="w-3.5 h-3.5" />,
  json: <Code     className="w-3.5 h-3.5" />,
};

// ─── Kbd hint ─────────────────────────────────────────────────────────────────

const KbdHint = ({ keys, label }: { keys: string[]; label: string }) => (
  <span className="flex items-center gap-1 text-slate-600">
    {keys.map((k, i) => (
      <React.Fragment key={k}>
        <kbd className="px-1.5 py-px rounded-md bg-white/[0.04] border border-white/[0.07] font-mono text-[10px] text-slate-500">
          {k}
        </kbd>
        {i < keys.length - 1 && <span className="text-[10px]">+</span>}
      </React.Fragment>
    ))}
    <span className="text-[10px] ml-0.5">{label}</span>
  </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export function AcoesBanco({
  totalQuestoes,
  questoesSelecionadas,
  onExportar,
  onTreinar,
  onResetarFiltros,
}: AcoesBancoProps) {
  const [isExporting, setIsExporting]         = useState(false);
  const [isTraining,  setIsTraining]          = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [exportFormat, setExportFormat]       = useState<ExportFormat>("pdf");
  const [showExportMenu, setShowExportMenu]   = useState(false);

  const menuRef        = useRef<HTMLDivElement>(null);
  const handleExportRef = useRef<() => void>(() => {});
  const handleTrainRef  = useRef<() => void>(() => {});

  // ── Close export menu on outside click ─────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Keyboard shortcuts (stable — reads latest handlers via refs) ────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === "e") { e.preventDefault(); handleExportRef.current(); }
      if (mod && e.key === "t") { e.preventDefault(); handleTrainRef.current(); }
      if (e.key === "Escape") {
        setShowConfirmReset(false);
        setShowExportMenu(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Export ─────────────────────────────────────────────────────────────────
  const debouncedExport = useDebouncedCallback(
    async (fmt: ExportFormat) => {
      if (isExporting) return;
      setIsExporting(true);
      try {
        await onExportar(fmt);
        toast.success(`${formatQuestoes(totalQuestoes)} exportadas como ${fmt.toUpperCase()}!`);
      } catch {
        toast.error("Erro ao exportar questões", { description: "Tente novamente." });
      } finally {
        setIsExporting(false);
        setShowExportMenu(false);
      }
    },
    500,
  ) as (fmt: ExportFormat) => void;

  // Seleciona formato e dispara a exportação sem depender do estado async
  const handleSelectAndExport = useCallback(
    (fmt: ExportFormat) => {
      setExportFormat(fmt);
      setShowExportMenu(false);
      if (totalQuestoes === 0) { toast.error("Nenhuma questão para exportar"); return; }
      debouncedExport(fmt);
    },
    [totalQuestoes, debouncedExport],
  );

  const handleExport = useCallback(() => {
    if (totalQuestoes === 0) { toast.error("Nenhuma questão para exportar"); return; }
    debouncedExport(exportFormat);
  }, [totalQuestoes, exportFormat, debouncedExport]);

  // ── Train ──────────────────────────────────────────────────────────────────
  const debouncedTrain = useDebouncedCallback(
    useCallback(async () => {
      if (isTraining) return;
      if (totalQuestoes === 0) { toast.error("Nenhuma questão selecionada"); return; }
      setIsTraining(true);
      const tid = "training";
      toast.loading("Preparando sessão…", { id: tid });
      try {
        await onTreinar();
        toast.success(`Iniciando com ${Math.min(totalQuestoes, 30)} questões`, { id: tid });
      } catch {
        toast.error("Erro ao iniciar treino", { id: tid });
      } finally {
        setIsTraining(false);
      }
    }, [isTraining, totalQuestoes, onTreinar]),
    500,
  );

  const handleTrain = useCallback(() => { debouncedTrain(); }, [debouncedTrain]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleResetFilters = useCallback(() => {
    onResetarFiltros();
    setShowConfirmReset(false);
    toast.info("Filtros resetados");
  }, [onResetarFiltros]);

  // ── Quick actions (not yet implemented) ────────────────────────────────────
  const handleQuickTrain = useCallback(() => {
    if (totalQuestoes === 0) { toast.error("Nenhuma questão disponível"); return; }
    toast.info("Modo rápido em breve!", { description: "Funcionalidade em desenvolvimento" });
  }, [totalQuestoes]);

  const handleSaveFilters = useCallback(() => {
    toast.info("Salvar filtros em breve!", { description: "Funcionalidade em desenvolvimento" });
  }, []);

  // ── Keep refs up-to-date ───────────────────────────────────────────────────
  useEffect(() => {
    handleExportRef.current = handleExport;
    handleTrainRef.current  = handleTrain;
  });

  const noQuestoes = totalQuestoes === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="sticky top-4 z-10"
    >
      <GlassCard className="p-5 sm:p-6 bg-slate-900/80 backdrop-blur-xl" glow="blue">
        <div className="space-y-5">

          {/* ── Top row: stats + actions ─── */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">

            <StatsCard
              totalQuestoes={totalQuestoes}
              questoesSelecionadas={questoesSelecionadas}
            />

            {/* ── Action buttons ── */}
            <div className="flex flex-wrap items-center gap-2 lg:ml-auto">

              {/* Export with dropdown */}
              <div className="relative" ref={menuRef}>
                <RippleButton
                  onClick={() => setShowExportMenu((p) => !p)}
                  disabled={isExporting || noQuestoes}
                  aria-haspopup="listbox"
                  aria-expanded={showExportMenu}
                  aria-label="Exportar questões"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isExporting
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : EXPORT_ICONS[exportFormat]}
                  Exportar{" "}
                  <span className="font-semibold uppercase text-xs">{exportFormat}</span>
                </RippleButton>

                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 min-w-[140px] rounded-xl bg-slate-900 border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden z-50"
                      role="listbox"
                    >
                      {(["pdf", "csv", "json"] as ExportFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => handleSelectAndExport(fmt)}
                          role="option"
                          aria-selected={exportFormat === fmt}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                            exportFormat === fmt
                              ? "bg-white/[0.07] text-white"
                              : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                          }`}
                        >
                          {EXPORT_ICONS[fmt]}
                          <span className="font-medium uppercase text-xs">{fmt}</span>
                          {exportFormat === fmt && (
                            <Check className="w-3 h-3 ml-auto text-blue-400" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick train */}
              <RippleButton
                onClick={handleQuickTrain}
                disabled={noQuestoes}
                aria-label="Modo rápido"
                title="10 questões aleatórias (em breve)"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/20 text-violet-400 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="w-3.5 h-3.5" />
                Modo Rápido
              </RippleButton>

              {/* Save filters */}
              <RippleButton
                onClick={handleSaveFilters}
                aria-label="Salvar filtros"
                title="Salvar filtros (em breve)"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 text-sm transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" />
                Salvar Filtros
              </RippleButton>

              {/* Reset with confirmation */}
              <AnimatePresence mode="wait">
                {showConfirmReset ? (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-1.5"
                  >
                    <RippleButton
                      onClick={handleResetFilters}
                      aria-label="Confirmar reset"
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/20 text-rose-400 text-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Confirmar
                    </RippleButton>
                    <RippleButton
                      onClick={() => setShowConfirmReset(false)}
                      aria-label="Cancelar reset"
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.07] text-slate-400 text-sm transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </RippleButton>
                  </motion.div>
                ) : (
                  <motion.div
                    key="reset"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <RippleButton
                      onClick={() => setShowConfirmReset(true)}
                      aria-label="Resetar filtros"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.07] text-slate-400 hover:text-slate-200 text-sm transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Resetar
                    </RippleButton>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Primary: Train */}
              <RippleButton
                onClick={handleTrain}
                disabled={noQuestoes || isTraining}
                aria-label="Iniciar treino"
                aria-busy={isTraining}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isTraining
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Play    className="w-3.5 h-3.5" />}
                Treinar ({Math.min(totalQuestoes, 30)})
              </RippleButton>
            </div>
          </div>

          {/* ── Progress + keyboard hints ─── */}
          <div className="space-y-3">
            <ProgressBar
              totalQuestoes={totalQuestoes}
              questoesSelecionadas={questoesSelecionadas}
            />

            <div className="hidden lg:flex items-center justify-end gap-4 pt-0.5">
              <KbdHint keys={["Ctrl", "E"]} label="Exportar" />
              <KbdHint keys={["Ctrl", "T"]} label="Treinar"  />
              <KbdHint keys={["Esc"]}       label="Fechar"   />
            </div>
          </div>

        </div>
      </GlassCard>
    </motion.div>
  );
}

// ─── With Error Boundary ──────────────────────────────────────────────────────

export function AcoesBancoWithErrorBoundary(props: AcoesBancoProps) {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <AcoesBanco {...props} />
    </ErrorBoundary>
  );
}