"use client";

import { GlassCard } from "@/components/ui/GlassCard"; // CORREÇÃO: Named Import
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  TrendingUp,
} from "lucide-react";
import React, {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"; // CORREÇÃO: Importar React explicitamente

// Lazy Loading com Fallback
const GraficoEvolucao = lazy(() =>
  import("@/components/GraficoEvolucao").catch(() => ({
    default: () => (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
        <AlertCircle className="w-8 h-8 text-rose-400" />
        <span className="text-sm">Erro ao carregar gráfico</span>
      </div>
    ),
  })),
);

const GraficoLoading = () => (
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

const GraficoErro = ({ onRetry }: { onRetry: () => void }) => (
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

// CORREÇÃO: Agora estende React.Component corretamente
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: any) {
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
    return this.state.hasError ? null : this.props.children;
  }
}

interface SecaoGraficoProps {
  historico: any[];
  maxItens?: number;
}

// Helper tipado
interface DadoGrafico {
  data: string;
  pontuacao: number;
  percentual: number;
}

export default memo(function SecaoGraficoEvolucao({
  historico,
  maxItens = 30,
}: SecaoGraficoProps) {
  const [pagina, setPagina] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [key, setKey] = useState(0);
  const [alturaContainer, setAlturaContainer] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const graficoRef = useRef<HTMLDivElement>(null);

  // Dados processados
  const dadosProcessados = useMemo((): DadoGrafico[] => {
    if (!historico?.length || !Array.isArray(historico)) return [];
    return historico
      .filter((h) => h?.data && h?.estatisticas)
      .slice()
      .reverse()
      .slice(0, maxItens)
      .map((h) => ({
        data: h.data,
        pontuacao: Math.max(-60, Math.min(60, h.estatisticas?.pontuacao ?? 0)),
        percentual: Math.max(0, Math.min(100, h.estatisticas?.percentual ?? 0)),
      }));
  }, [historico, maxItens]);

  // Paginação
  const itensPorPagina = 10;
  const totalPaginas = Math.max(
    1,
    Math.ceil(dadosProcessados.length / itensPorPagina),
  );
  const dadosPaginados = useMemo(() => {
    const inicio = pagina * itensPorPagina;
    return dadosProcessados.slice(inicio, inicio + itensPorPagina);
  }, [dadosProcessados, pagina]);

  const mediaPontuacao = useMemo(() => {
    if (!dadosProcessados.length) return 0;
    const soma = dadosProcessados.reduce(
      (acc, curr) => acc + curr.pontuacao,
      0,
    );
    return Number((soma / dadosProcessados.length).toFixed(1));
  }, [dadosProcessados]);

  // Handlers e Effects
  useEffect(() => {
    setPagina(0);
    setHasError(false);
  }, [historico?.length]);

  useEffect(() => {
    const handler = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      if (!isFs && graficoRef.current) {
        setTimeout(
          () => setAlturaContainer(graficoRef.current?.clientHeight ?? 0),
          100,
        );
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    if (!graficoRef.current || isFullscreen) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) setAlturaContainer(entry.contentRect.height);
    });
    resizeObserver.observe(graficoRef.current);
    return () => resizeObserver.disconnect();
  }, [isFullscreen]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setKey((prev) => prev + 1);
  }, []);
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement)
        await containerRef.current?.requestFullscreen();
      else await document.exitFullscreen();
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  // Empty State para gráfico
  if (dadosProcessados.length < 2) {
    return (
      <GlassCard className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Evolução do Desempenho
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Acompanhe seu progresso ao longo do tempo
            </p>
          </div>
        </div>
        <div className="h-56 flex flex-col items-center justify-center text-slate-500 gap-4 bg-slate-900/20 rounded-xl border border-slate-800/50 border-dashed">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-slate-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-400">
              Dados insuficientes
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Complete pelo menos 2 simulados para visualizar o gráfico
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      className={`${isFullscreen ? "fixed inset-0 z-50 rounded-none flex flex-col" : "p-5 sm:p-6"}`}
      ref={containerRef}
    >
      {/* Header */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 ${isFullscreen ? "p-5 sm:p-6 pb-0" : "mb-5"}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Evolução do Desempenho
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {dadosProcessados.length} simulados • Média: {mediaPontuacao} pts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {totalPaginas > 1 && (
            <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
              <button
                onClick={() => setPagina((p) => Math.max(0, p - 1))}
                disabled={pagina === 0}
                className="p-1.5 rounded-md hover:bg-slate-700 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>
              <span className="text-xs font-medium text-slate-400 px-2 min-w-[3rem] text-center tabular-nums">
                {pagina + 1} <span className="text-slate-600">/</span>{" "}
                {totalPaginas}
              </span>
              <button
                onClick={() =>
                  setPagina((p) => Math.min(totalPaginas - 1, p + 1))
                }
                disabled={pagina >= totalPaginas - 1}
                className="p-1.5 rounded-md hover:bg-slate-700 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 text-slate-400 hover:text-slate-200 transition-all"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Container Gráfico */}
      <div
        ref={graficoRef}
        className={`relative w-full bg-slate-900/30 rounded-xl border border-slate-800/50 ${isFullscreen ? "flex-1 mx-5 sm:mx-6 mb-5 sm:mb-6" : "h-64 sm:h-72 lg:h-80"}`}
      >
        <div className="absolute inset-0 p-3 sm:p-4">
          <AnimatePresence mode="wait">
            {hasError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
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
                className="h-full w-full"
              >
                <Suspense fallback={<GraficoLoading />}>
                  <div className="h-full w-full relative">
                    <ErrorBoundary onError={() => setHasError(true)}>
                      <GraficoEvolucao
                        historico={dadosPaginados}
                        altura={isFullscreen ? alturaContainer - 24 : undefined}
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
      </div>

      {/* Legenda */}
      {!isFullscreen && (
        <div className="mt-4 pt-4 border-t border-slate-800/50">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/30" />{" "}
                Pontuação CEBRASPE
              </span>
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-emerald-500" />{" "}
                % Aproveitamento
              </span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/50 text-slate-500">
              <span>Média geral:</span>
              <span className="font-bold text-slate-300 tabular-nums">
                {mediaPontuacao}
              </span>
              <span className="text-slate-600">pts</span>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
});
