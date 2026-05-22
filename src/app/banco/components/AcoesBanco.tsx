"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bookmark,
  Check,
  Code,
  Download,
  FileText,
  Filter,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Table,
  X,
  Zap,
} from "lucide-react";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
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
  <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 to-rose-600/5 border border-rose-500/20 text-rose-400 flex items-start gap-3">
    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
    <div>
      <p className="font-semibold text-sm">Algo deu errado</p>
      <p className="text-xs text-rose-400/70 mt-0.5">
        Tente recarregar a página
      </p>
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
  variant?: "primary" | "secondary" | "ghost";
}

const RippleButton = memo(function RippleButton({
  children,
  onClick,
  className = "",
  disabled = false,
  loading = false,
  variant = "secondary",
  ...rest
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const idRef = useRef(0);

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25",
    secondary:
      "bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300",
    ghost:
      "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] text-slate-400",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // FIX 1: variável `id` conflitava com o atributo HTML `id` desestruturado
    // de ButtonHTMLAttributes. Renomeada para `idRef` (useRef).
    const rid = ++idRef.current;
    setRipples((p) => [
      ...p,
      { id: rid, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== rid)), 700);
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative overflow-hidden select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition-all duration-200 ${variantStyles[variant]} ${className}`}
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
  // FIX 2: `safePct` recebe (parcial, total) → (totalQuestoes, questoesSelecionadas).
  // O original passava os argumentos invertidos em StatsCard e ProgressBar,
  // resultando em percentuais sempre acima de 100% quando há filtro ativo.
  const pct = safePct(totalQuestoes, questoesSelecionadas);
  const filtered = totalQuestoes !== questoesSelecionadas;

  return (
    <div className="flex items-end gap-4 shrink-0">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-blue-500/20 blur-md opacity-50" />
        <motion.p
          key={totalQuestoes}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="text-4xl sm:text-5xl font-black tabular-nums bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent leading-none"
        >
          {totalQuestoes.toLocaleString("pt-BR")}
        </motion.p>
      </div>
      <div>
        <p className="text-sm text-slate-400">
          questão{totalQuestoes !== 1 ? "s" : ""} encontrada
          {totalQuestoes !== 1 ? "s" : ""}
        </p>
        {filtered && (
          <p className="text-xs text-slate-500">
            de {questoesSelecionadas.toLocaleString("pt-BR")} total •{" "}
            {pct.toFixed(0)}% exibidas
          </p>
        )}
      </div>
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
  // FIX 2 (continuação): mesma correção de ordem dos argumentos
  const pct = safePct(totalQuestoes, questoesSelecionadas);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
            Filtragem ativa
          </span>
        </div>
        <span className="text-[11px] font-mono text-blue-400 font-semibold">
          {Math.round(pct)}% das questões
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
});

// ─── Export Format Icons ──────────────────────────────────────────────────────

const EXPORT_ICONS: Record<ExportFormat, React.ReactElement> = {
  pdf: <FileText className="w-4 h-4" />,
  csv: <Table className="w-4 h-4" />,
  json: <Code className="w-4 h-4" />,
};

const EXPORT_LABELS: Record<ExportFormat, string> = {
  pdf: "PDF",
  csv: "CSV",
  json: "JSON",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function AcoesBanco({
  totalQuestoes,
  questoesSelecionadas,
  onExportar,
  onTreinar,
  onResetarFiltros,
}: AcoesBancoProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const handleExportRef = useRef<() => void>(() => {});
  const handleTrainRef = useRef<() => void>(() => {});

  // Close export menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === "e") {
        e.preventDefault();
        handleExportRef.current();
      }
      if (mod && e.key === "t") {
        e.preventDefault();
        handleTrainRef.current();
      }
      if (e.key === "Escape") {
        setShowConfirmReset(false);
        setShowExportMenu(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Export
  const debouncedExport = useDebouncedCallback(async (fmt: ExportFormat) => {
    if (isExporting) return;
    setIsExporting(true);
    const toastId = "exporting";
    toast.loading(`Exportando ${formatQuestoes(totalQuestoes)}...`, {
      id: toastId,
    });
    try {
      await onExportar(fmt);
      toast.success(
        `${formatQuestoes(totalQuestoes)} exportadas como ${fmt.toUpperCase()}!`,
        { id: toastId },
      );
    } catch {
      toast.error("Erro ao exportar questões", { id: toastId });
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  }, 500) as (fmt: ExportFormat) => void;

  const handleSelectAndExport = useCallback(
    (fmt: ExportFormat) => {
      setExportFormat(fmt);
      setShowExportMenu(false);
      if (totalQuestoes === 0) {
        toast.error("Nenhuma questão para exportar");
        return;
      }
      debouncedExport(fmt);
    },
    [totalQuestoes, debouncedExport],
  );

  const handleExport = useCallback(() => {
    if (totalQuestoes === 0) {
      toast.error("Nenhuma questão para exportar");
      return;
    }
    debouncedExport(exportFormat);
  }, [totalQuestoes, exportFormat, debouncedExport]);

  // FIX 3: `useCallback` dentro de `useDebouncedCallback` é inválido.
  // `useDebouncedCallback` já recebe uma função — envolver com `useCallback`
  // cria uma nova referência a cada render, quebrando o debounce e
  // violando as regras dos hooks (hooks não podem ser chamados condicionalmente
  // ou dentro de outros hooks de forma aninhada assim).
  // Solução: extrair a lógica para uma função comum e passar direto ao debounce.
  const trainFn = useCallback(async () => {
    if (isTraining) return;
    if (totalQuestoes === 0) {
      toast.error("Nenhuma questão selecionada");
      return;
    }
    setIsTraining(true);
    const toastId = "training";
    toast.loading("Preparando sessão de treino...", { id: toastId });
    try {
      await onTreinar();
      toast.success(
        `Iniciando treino com ${Math.min(totalQuestoes, 30)} questões! 🎯`,
        { id: toastId },
      );
    } catch {
      toast.error("Erro ao iniciar treino", { id: toastId });
    } finally {
      setIsTraining(false);
    }
  }, [isTraining, totalQuestoes, onTreinar]);

  const debouncedTrain = useDebouncedCallback(trainFn, 500);

  const handleTrain = useCallback(() => {
    debouncedTrain();
  }, [debouncedTrain]);

  // Reset
  const handleResetFilters = useCallback(() => {
    onResetarFiltros();
    setShowConfirmReset(false);
    toast.success("Filtros resetados com sucesso!");
  }, [onResetarFiltros]);

  // Quick actions
  const handleQuickTrain = useCallback(() => {
    if (totalQuestoes === 0) {
      toast.error("Nenhuma questão disponível");
      return;
    }
    toast.info("Modo rápido em breve!", {
      description: "Funcionalidade em desenvolvimento",
    });
  }, [totalQuestoes]);

  const handleSaveFilters = useCallback(() => {
    toast.info("Salvar filtros em breve!", {
      description: "Funcionalidade em desenvolvimento",
    });
  }, []);

  // FIX 4: useEffect sem array de dependências roda em todo render, mas
  // aqui a intenção é apenas manter as refs atualizadas com os callbacks
  // mais recentes (padrão "ref estável para event listeners").
  // Adicionar [handleExport, handleTrain] como deps é o correto — sem o
  // array o linter reclama e o comportamento é idêntico, mas explicitar
  // as deps torna a intenção clara e silencia warnings.
  useEffect(() => {
    handleExportRef.current = handleExport;
    handleTrainRef.current = handleTrain;
  }, [handleExport, handleTrain]);

  const noQuestoes = totalQuestoes === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <GlassCard variant="elevated" glow="blue" shimmer animated={false}>
        <div className="space-y-5">
          {/* Header com gradiente */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Banco de Questões
              </h3>
              <p className="text-[10px] text-slate-500">
                Gerencie e exporte suas questões
              </p>
            </div>
          </div>

          {/* Top row: stats + actions */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <StatsCard
              totalQuestoes={totalQuestoes}
              questoesSelecionadas={questoesSelecionadas}
            />

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
              {/* Export dropdown */}
              <div className="relative" ref={menuRef}>
                <RippleButton
                  onClick={() => setShowExportMenu((p) => !p)}
                  disabled={isExporting || noQuestoes}
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Exportar</span>
                  <span className="font-semibold uppercase text-xs bg-white/10 px-1.5 py-0.5 rounded">
                    {EXPORT_LABELS[exportFormat]}
                  </span>
                </RippleButton>

                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 min-w-[140px] rounded-xl bg-slate-900 border border-white/10 shadow-2xl shadow-black/40 overflow-hidden z-50"
                    >
                      {(["pdf", "csv", "json"] as ExportFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => handleSelectAndExport(fmt)}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all ${
                            exportFormat === fmt
                              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {EXPORT_ICONS[fmt]}
                          <span className="font-medium">
                            {EXPORT_LABELS[fmt]}
                          </span>
                          {exportFormat === fmt && (
                            <Check className="w-3.5 h-3.5 ml-auto text-blue-400" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Modo Rápido */}
              <RippleButton
                onClick={handleQuickTrain}
                disabled={noQuestoes}
                variant="ghost"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-violet-400 hover:text-violet-300"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Modo Rápido</span>
              </RippleButton>

              {/* Salvar Filtros */}
              <RippleButton
                onClick={handleSaveFilters}
                variant="ghost"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-emerald-400 hover:text-emerald-300"
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">Salvar</span>
              </RippleButton>

              {/* Reset com confirmação */}
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
                      variant="secondary"
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirmar</span>
                    </RippleButton>
                    <RippleButton
                      onClick={() => setShowConfirmReset(false)}
                      variant="secondary"
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl"
                    >
                      <X className="w-4 h-4" />
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
                      variant="ghost"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="hidden sm:inline">Resetar</span>
                    </RippleButton>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botão principal Treinar */}
              <RippleButton
                onClick={handleTrain}
                disabled={noQuestoes || isTraining}
                variant="primary"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold"
              >
                {isTraining ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Treinar ({Math.min(totalQuestoes, 30)})
              </RippleButton>
            </div>
          </div>

          {/* Progress bar */}
          <ProgressBar
            totalQuestoes={totalQuestoes}
            questoesSelecionadas={questoesSelecionadas}
          />

          {/* Keyboard hints */}
          <div className="hidden lg:flex items-center justify-end gap-4 pt-1">
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">
                E
              </kbd>
              <span>Exportar</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">
                T
              </kbd>
              <span>Treinar</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* FIX 6: `style jsx` é sintaxe do styled-jsx (Next.js Pages Router).
          Em projetos com App Router ("use client") ou sem styled-jsx instalado
          isso gera erro de compilação. A animação `shimmer` foi movida para
          uma tag <style> HTML padrão, que funciona em qualquer ambiente. */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
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
