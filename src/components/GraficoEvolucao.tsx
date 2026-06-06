"use client";

import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { motion } from "framer-motion";
import { Award, Sparkles, Target, TrendingUp, Trophy } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";

// ============================================================================
// REGISTRO DO CHART.JS
// ============================================================================

function ensureChartRegistered() {
  if (ChartJS.registry.controllers.get("line")) return;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  );
}

// ============================================================================
// TYPES
// ============================================================================

export interface HistoricoItem {
  data: string;
  pontuacao: number;
  percentual: number;
}

export interface GraficoEvolucaoProps {
  historico: HistoricoItem[];
  altura?: number;
  mostrarMeta?: boolean;
  metaAprovacao?: number;
  titulo?: string;
}

type Tendencia = "up" | "down" | "neutral";

// ============================================================================
// VALIDAÇÃO
// ============================================================================

const isValidHistorico = (item: unknown): item is HistoricoItem => {
  if (!item || typeof item !== "object") return false;
  const h = item as Record<string, unknown>;
  return (
    typeof h.data === "string" &&
    typeof h.pontuacao === "number" &&
    Number.isFinite(h.pontuacao) &&
    typeof h.percentual === "number" &&
    Number.isFinite(h.percentual) &&
    h.percentual >= 0 &&
    h.percentual <= 100
  );
};

// ============================================================================
// TEMA
// ============================================================================

const THEME = {
  dark: {
    pontuacao: "#3b82f6",
    percentual: "#10b981",
    pontosAlpha: "rgba(59, 130, 246, 0.15)",
    grid: "rgba(255, 255, 255, 0.05)",
    gridPontuacao: "rgba(59, 130, 246, 0.08)",
    text: "#94a3b8",
    tooltipBg: "rgba(15, 23, 42, 0.98)",
    tooltipTitle: "#f8fafc",
    tooltipBody: "#cbd5e1",
    tooltipBorder: "rgba(255, 255, 255, 0.1)",
    pointBg: "#1d4ed8",
    pointBorder: "#60a5fa",
    pointBgPerc: "#059669",
    pointBorderPerc: "#34d399",
  },
  light: {
    pontuacao: "#2563eb",
    percentual: "#059669",
    pontosAlpha: "rgba(37, 99, 235, 0.08)",
    grid: "rgba(0, 0, 0, 0.04)",
    gridPontuacao: "rgba(37, 99, 235, 0.05)",
    text: "#475569",
    tooltipBg: "rgba(255, 255, 255, 0.98)",
    tooltipTitle: "#0f172a",
    tooltipBody: "#334155",
    tooltipBorder: "rgba(0, 0, 0, 0.1)",
    pointBg: "#3b82f6",
    pointBorder: "#93c5fd",
    pointBgPerc: "#10b981",
    pointBorderPerc: "#6ee7b7",
  },
} as const;

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const StatsCard = memo(function StatsCard({
  label,
  value,
  suffix = "",
  colorClass,
  icon: Icon,
}: {
  label: string;
  value: number;
  suffix?: string;
  colorClass: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-white/10">
      {Icon && <Icon className={`w-4 h-4 ${colorClass}`} />}
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className={`font-bold text-lg ${colorClass} tabular-nums`}>
          {value}
          {suffix}
        </p>
      </div>
    </div>
  );
});

const EmptyState = memo(function EmptyState({ altura }: { altura: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/30 border border-white/10"
      style={{ height: altura }}
    >
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-slate-400 font-medium">Nenhum dado disponível</p>
        <p className="text-xs text-slate-500 mt-1">
          Complete simulados para visualizar sua evolução
        </p>
      </div>
    </div>
  );
});

const SingleDataState = memo(function SingleDataState({
  item,
  altura,
}: {
  item: HistoricoItem;
  altura: number;
}) {
  const dataFormatada = useMemo(
    () =>
      new Date(item.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [item.data],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/30 border border-white/10"
      style={{ minHeight: altura, height: "auto" }}
    >
      <div className="text-center p-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <Award className="w-10 h-10 text-blue-400" />
        </div>
        <p className="text-slate-400 text-sm mb-2">Primeiro simulado</p>
        <p className="text-white font-bold text-lg">{dataFormatada}</p>
        <div className="flex gap-6 justify-center mt-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">{item.pontuacao}</p>
            <p className="text-xs text-slate-500">Pontos</p>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">
              {item.percentual}%
            </p>
            <p className="text-xs text-slate-500">Aproveitamento</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// HOOK: useChartTheme
// ============================================================================

function useChartTheme() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches,
      );
    };
    check();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", check);
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "class") {
          check();
          break;
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => {
      mq.removeEventListener("change", check);
      observer.disconnect();
    };
  }, []);

  return { isDark, mounted };
}

// ============================================================================
// HOOK: useChartHover
// ============================================================================

function useChartHover(chartRef: React.RefObject<ChartJS<"line"> | null>) {
  const hoveredIndexRef = useRef<number | null>(null);

  const onHover = useCallback(
    (_event: unknown, elements: Array<{ index: number }>) => {
      const newIndex = elements.length > 0 ? elements[0].index : null;
      if (newIndex === hoveredIndexRef.current) return;
      hoveredIndexRef.current = newIndex;
      const chart = chartRef.current;
      if (!chart) return;
      chart.data.datasets.forEach((dataset, di) => {
        if (di >= 2) return;
        const baseRadius = di === 0 ? 5 : 4;
        const hoveredRadius = di === 0 ? 8 : 6;
        dataset.pointRadius = (dataset.data as number[]).map((_, i) =>
          i === newIndex ? hoveredRadius : baseRadius,
        );
      });
      chart.update("none");
    },
    [chartRef],
  );

  return { onHover };
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const GraficoEvolucao = memo(function GraficoEvolucao({
  historico,
  altura = 300,
  mostrarMeta = true,
  metaAprovacao = 60,
  titulo = "Evolução do Desempenho",
}: GraficoEvolucaoProps) {
  const { isDark, mounted } = useChartTheme();
  const chartRef = useRef<ChartJS<"line"> | null>(null);
  const { onHover } = useChartHover(chartRef);

  useEffect(() => {
    ensureChartRegistered();
  }, []);

  const dadosValidos = useMemo(() => {
    if (!Array.isArray(historico)) return [];
    return historico.filter(isValidHistorico);
  }, [historico]);

  const dados = useMemo(
    () =>
      [...dadosValidos].sort(
        (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
      ),
    [dadosValidos],
  );

  const estatisticas = useMemo(() => {
    if (dados.length === 0) return null;
    const pontuacoes = dados.map((d) => d.pontuacao);
    const n = pontuacoes.length;
    const soma = pontuacoes.reduce((a, b) => a + b, 0);
    const media = Math.round(soma / n);
    let min = pontuacoes[0],
      max = pontuacoes[0];
    for (let i = 1; i < n; i++) {
      if (pontuacoes[i] < min) min = pontuacoes[i];
      if (pontuacoes[i] > max) max = pontuacoes[i];
    }
    const evolucao = pontuacoes[n - 1] - pontuacoes[0];
    let tendencia: Tendencia = "neutral";
    if (n >= 6) {
      const recente =
        (pontuacoes[n - 1] + pontuacoes[n - 2] + pontuacoes[n - 3]) / 3;
      const anterior =
        (pontuacoes[n - 4] + pontuacoes[n - 5] + pontuacoes[n - 6]) / 3;
      tendencia =
        recente > anterior ? "up" : recente < anterior ? "down" : "neutral";
    } else if (n >= 2) {
      tendencia = evolucao > 0 ? "up" : evolucao < 0 ? "down" : "neutral";
    }
    const padding = Math.max(5, (max - min) * 0.15);
    return {
      media,
      melhor: max,
      min,
      max,
      evolucao,
      tendencia,
      total: n,
      padding,
    };
  }, [dados]);

  const options = useMemo((): ChartOptions<"line"> & { onHover?: unknown } => {
    if (!estatisticas) return {};
    const t = isDark ? THEME.dark : THEME.light;
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      onHover,
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: t.text,
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
            font: { size: 11 },
          },
        },
        tooltip: {
          backgroundColor: t.tooltipBg,
          titleColor: t.tooltipTitle,
          bodyColor: t.tooltipBody,
          borderColor: t.tooltipBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          displayColors: true,
          callbacks: {
            title: (items) => {
              if (!items.length) return "";
              const idx = items[0].dataIndex;
              if (idx < 0 || idx >= dados.length) return "";
              return new Date(dados[idx].data).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
            },
            label: (ctx) =>
              `${ctx.dataset.label ?? ""}: ${ctx.parsed.y ?? "—"}${ctx.dataset.yAxisID === "y1" ? "%" : " pts"}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: t.grid },
          ticks: { color: t.text, font: { size: 10 }, maxRotation: 45 },
        },
        y: {
          position: "left",
          title: {
            display: true,
            text: "Pontuação",
            color: t.pontuacao,
            font: { size: 10 },
          },
          grid: { color: t.gridPontuacao },
          ticks: {
            color: t.pontuacao,
            font: { size: 10 },
            callback: (v) => `${v} pts`,
          },
          suggestedMin: Math.max(0, estatisticas.min - estatisticas.padding),
          suggestedMax: estatisticas.max + estatisticas.padding,
        },
        y1: {
          position: "right",
          title: {
            display: true,
            text: "% Acertos",
            color: t.percentual,
            font: { size: 10 },
          },
          grid: { drawOnChartArea: false },
          ticks: {
            color: t.percentual,
            font: { size: 10 },
            callback: (v) => `${v}%`,
          },
          min: 0,
          max: 100,
        },
      },
      animation: { duration: 600, easing: "easeOutQuart" },
    };
  }, [estatisticas, isDark, dados, onHover]);

  const chartData = useMemo((): ChartData<"line"> => {
    if (!estatisticas) return { labels: [], datasets: [] };
    const t = isDark ? THEME.dark : THEME.light;
    const labels = dados.map((h) =>
      new Date(h.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
    );
    return {
      labels,
      datasets: [
        {
          label: "Pontuação CEBRASPE",
          data: dados.map((h) => h.pontuacao),
          borderColor: t.pontuacao,
          backgroundColor: t.pontosAlpha,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: t.pointBg,
          pointBorderColor: t.pointBorder,
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 10,
          borderWidth: 3,
          yAxisID: "y",
        },
        {
          label: "% Aproveitamento",
          data: dados.map((h) => h.percentual),
          borderColor: t.percentual,
          backgroundColor: "transparent",
          tension: 0.4,
          fill: false,
          pointBackgroundColor: t.pointBgPerc,
          pointBorderColor: t.pointBorderPerc,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 8,
          borderWidth: 2,
          borderDash: [5, 5],
          yAxisID: "y1",
        },
        ...(mostrarMeta
          ? [
              {
                label: "Meta Aprovação",
                data: Array<number>(dados.length).fill(metaAprovacao),
                borderColor: "#f59e0b",
                backgroundColor: "transparent",
                tension: 0,
                fill: false,
                pointRadius: 0,
                borderWidth: 2,
                borderDash: [10, 5],
                yAxisID: "y1",
              },
            ]
          : []),
      ],
    };
  }, [dados, isDark, mostrarMeta, metaAprovacao, estatisticas]);

  const tendenciaInfo = useMemo(() => {
    if (!estatisticas) return null;
    return {
      up: { cor: "text-emerald-400", icone: "📈", label: "Em alta" },
      down: { cor: "text-rose-400", icone: "📉", label: "Em queda" },
      neutral: { cor: "text-blue-400", icone: "➡️", label: "Estável" },
    }[estatisticas.tendencia];
  }, [estatisticas]);

  if (dadosValidos.length === 0) return <EmptyState altura={altura} />;
  if (dadosValidos.length === 1)
    return <SingleDataState item={dados[0]} altura={altura} />;
  if (!mounted || !estatisticas || !tendenciaInfo) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-slate-800/30 border border-white/10"
        style={{ height: altura }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  const { media, melhor, evolucao, total } = estatisticas;

  return (
    <div className="space-y-4">
      {/* Header com gradiente */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-200 text-base">{titulo}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              {total} simulados realizados
              {evolucao !== 0 && (
                <span
                  className={
                    evolucao > 0 ? "text-emerald-400" : "text-rose-400"
                  }
                >
                  ({evolucao > 0 ? "+" : ""}
                  {evolucao} pts)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <StatsCard
            label="Média"
            value={media}
            suffix=" pts"
            colorClass="text-blue-400"
            icon={Trophy}
          />
          <StatsCard
            label="Melhor"
            value={melhor}
            suffix=" pts"
            colorClass="text-emerald-400"
            icon={Award}
          />
        </div>
      </div>

      {/* Gráfico */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/30 border border-white/10 p-4"
        style={{ height: altura }}
      >
        <Line
          key={dados.map((d) => d.data).join(",")}
          ref={chartRef}
          data={chartData}
          options={options as ChartOptions<"line">}
        />

        {mostrarMeta && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm">
            <Target className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-semibold text-amber-400">
              Meta: {metaAprovacao}%
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/50 border border-white/10 backdrop-blur-sm">
          <span className="text-xs">{tendenciaInfo.icone}</span>
          <span className={`text-[10px] font-medium ${tendenciaInfo.cor}`}>
            {tendenciaInfo.label}
          </span>
        </div>
      </motion.div>

      {/* Legenda */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Pontuação</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2 border-dashed border-emerald-500" />
          <span>% Aproveitamento</span>
        </div>
        {mostrarMeta && (
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0 border-t-2 border-dashed border-amber-500" />
            <span>Meta</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default GraficoEvolucao;
