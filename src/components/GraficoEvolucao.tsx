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
import { Award, Target, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

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

// Types strictos
interface HistoricoItem {
  data: string;
  pontuacao: number;
  percentual: number;
}

interface GraficoEvolucaoProps {
  historico: HistoricoItem[];
  altura?: number;
  mostrarMeta?: boolean;
  metaAprovacao?: number;
  titulo?: string;
}

type Tendencia = "up" | "down" | "neutral";

// Validação de dados
const isValidHistorico = (item: unknown): item is HistoricoItem => {
  if (!item || typeof item !== "object") return false;
  const h = item as Record<string, unknown>;
  return (
    typeof h.data === "string" &&
    typeof h.pontuacao === "number" &&
    !isNaN(h.pontuacao) &&
    typeof h.percentual === "number" &&
    !isNaN(h.percentual)
  );
};

export default function GraficoEvolucao({
  historico,
  altura = 300,
  mostrarMeta = true,
  metaAprovacao = 60,
  titulo = "Evolução do Desempenho",
}: GraficoEvolucaoProps) {
  const [isDark, setIsDark] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Hydration safety
  useEffect(() => {
    setIsClient(true);
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();

    // Observer para mudanças de tema
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Validação e filtragem de dados
  const dadosValidos = useMemo(() => {
    if (!Array.isArray(historico)) return [];
    return historico.filter(isValidHistorico);
  }, [historico]);

  // Dados processados (memoizados)
  const dados = useMemo(() => {
    return [...dadosValidos].reverse();
  }, [dadosValidos]);

  // Cálculos estatísticos memoizados
  const estatisticas = useMemo(() => {
    if (dados.length === 0) return null;

    const pontuacoes = dados.map((d) => d.pontuacao);
    const mediaPontuacao = Math.round(
      pontuacoes.reduce((a, b) => a + b, 0) / pontuacoes.length,
    );
    const melhorPontuacao = Math.max(...pontuacoes);
    const ultimaPontuacao = pontuacoes[pontuacoes.length - 1];
    const primeiraPontuacao = pontuacoes[0];
    const evolucao = ultimaPontuacao - primeiraPontuacao;

    // Tendência (últimos 3 vs 3 anteriores)
    let tendencia: Tendencia = "neutral";
    if (dados.length >= 6) {
      const recente = pontuacoes.slice(-3).reduce((a, b) => a + b, 0) / 3;
      const anterior = pontuacoes.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
      tendencia = recente > anterior ? "up" : "down";
    }

    return {
      mediaPontuacao,
      melhorPontuacao,
      ultimaPontuacao,
      evolucao,
      tendencia,
      total: dados.length,
    };
  }, [dados]);

  // Configuração do gráfico memoizada
  const chartData: ChartData<"line"> = useMemo(() => {
    const labels = dados.map((h) =>
      new Date(h.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
    );

    const pontuacoes = dados.map((h) => h.pontuacao);
    const percentuais = dados.map((h) => h.percentual);

    // Cores adaptativas ao tema
    const corPontuacao = isDark ? "#3b82f6" : "#2563eb";
    const corPercentual = isDark ? "#10b981" : "#059669";

    return {
      labels,
      datasets: [
        {
          label: "Pontuação CEBRASPE",
          data: pontuacoes,
          borderColor: corPontuacao,
          backgroundColor: (context: {
            chart: { ctx: CanvasRenderingContext2D };
          }) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, altura);
            gradient.addColorStop(
              0,
              isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)",
            );
            gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");
            return gradient;
          },
          tension: 0.4,
          fill: true,
          pointBackgroundColor: isDark ? "#1d4ed8" : "#3b82f6",
          pointBorderColor: isDark ? "#60a5fa" : "#93c5fd",
          pointBorderWidth: 2,
          pointRadius: (ctx) => (hoveredIndex === ctx.dataIndex ? 8 : 5),
          pointHoverRadius: 10,
          pointHoverBackgroundColor: corPontuacao,
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 3,
          borderWidth: 3,
          yAxisID: "y",
        },
        {
          label: "% Aproveitamento",
          data: percentuais,
          borderColor: corPercentual,
          backgroundColor: "transparent",
          tension: 0.4,
          fill: false,
          pointBackgroundColor: isDark ? "#059669" : "#10b981",
          pointBorderColor: isDark ? "#34d399" : "#6ee7b7",
          pointBorderWidth: 2,
          pointRadius: (ctx) => (hoveredIndex === ctx.dataIndex ? 6 : 4),
          pointHoverRadius: 8,
          borderWidth: 2,
          borderDash: [5, 5],
          yAxisID: "y1",
        },
        ...(mostrarMeta
          ? [
              {
                label: "Meta Aprovação",
                data: Array(dados.length).fill(metaAprovacao),
                borderColor: "#f59e0b",
                backgroundColor: "transparent",
                tension: 0,
                fill: false,
                pointRadius: 0,
                borderWidth: 2,
                borderDash: [10, 5] as [number, number],
                yAxisID: "y1" as const,
              },
            ]
          : []),
      ],
    };
  }, [dados, altura, isDark, hoveredIndex, mostrarMeta, metaAprovacao]);

  // Opções do gráfico memoizadas
  const options: ChartOptions<"line"> = useMemo(() => {
    const minPontuacao = Math.min(...dados.map((d) => d.pontuacao));
    const maxPontuacao = Math.max(...dados.map((d) => d.pontuacao));
    const padding = Math.max(5, (maxPontuacao - minPontuacao) * 0.1);

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      onHover: (_, elements) => {
        setHoveredIndex(elements.length > 0 ? elements[0].index : null);
      },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: isDark ? "#94a3b8" : "#475569",
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
            font: {
              size: 12,
              family: "system-ui, sans-serif",
            },
          },
        },
        tooltip: {
          backgroundColor: isDark
            ? "rgba(15, 23, 42, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          titleColor: isDark ? "#f8fafc" : "#0f172a",
          bodyColor: isDark ? "#cbd5e1" : "#334155",
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          displayColors: true,
          titleFont: { size: 13, weight: "bold" },
          bodyFont: { size: 12 },
          callbacks: {
            title: (items) => {
              const date = new Date(dados[items[0].dataIndex].data);
              return date.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
            },
            label: (context) => {
              let label = context.dataset.label || "";
              if (label) label += ": ";
              if (context.parsed.y !== null) {
                label += context.parsed.y;
                label += context.dataset.yAxisID === "y1" ? "%" : " pts";
              }
              return label;
            },
            afterBody: (items) => {
              const index = items[0].dataIndex;
              if (index === 0) return "";
              const diff = dados[index].pontuacao - dados[index - 1].pontuacao;
              if (diff === 0) return "\n➡️ Mesma pontuação";
              return `\n${diff > 0 ? "📈" : "📉"} ${diff > 0 ? "+" : ""}${diff} pts vs anterior`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
            drawBorder: false,
          },
          ticks: {
            color: isDark ? "#64748b" : "#94a3b8",
            font: { size: 11 },
            maxRotation: 45,
            minRotation: 0,
          },
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Pontuação",
            color: isDark ? "#3b82f6" : "#2563eb",
            font: { size: 11, weight: "bold" },
          },
          grid: {
            color: isDark
              ? "rgba(59, 130, 246, 0.1)"
              : "rgba(59, 130, 246, 0.05)",
            drawBorder: false,
          },
          ticks: {
            color: isDark ? "#3b82f6" : "#2563eb",
            font: { size: 11 },
            callback: (value) => `${value} pts`,
          },
          suggestedMin: Math.max(0, minPontuacao - padding),
          suggestedMax: maxPontuacao + padding,
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "% Acertos",
            color: isDark ? "#10b981" : "#059669",
            font: { size: 11, weight: "bold" },
          },
          grid: { drawOnChartArea: false },
          ticks: {
            color: isDark ? "#10b981" : "#059669",
            font: { size: 11 },
            callback: (value) => `${value}%`,
          },
          min: 0,
          max: 100,
        },
      },
      animation: {
        duration: 800,
        easing: "easeOutQuart",
      },
    };
  }, [dados, isDark]);

  // Estados de loading/erro
  if (!isClient) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 animate-pulse"
        style={{ height: altura }}
        aria-label="Carregando gráfico..."
      >
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  if (dadosValidos.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 p-6"
        style={{ height: altura }}
        role="status"
        aria-label="Nenhum dado disponível"
      >
        <TrendingUp className="w-12 h-12 mb-3 opacity-40" aria-hidden="true" />
        <p className="text-sm font-medium">Nenhum dado disponível</p>
        <p className="text-xs opacity-60 mt-1 text-center">
          Complete simulados para visualizar sua evolução no gráfico
        </p>
      </div>
    );
  }

  if (dadosValidos.length === 1 && estatisticas) {
    const item = dados[0];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6"
        style={{ height: altura }}
      >
        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <Award className="w-8 h-8" aria-hidden="true" />
          </div>

          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">
              Primeiro simulado realizado
            </p>
            <p className="text-slate-900 dark:text-white font-bold text-lg">
              {new Date(item.data).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex gap-8 justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {item.pontuacao}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-1">
                Pontos
              </p>
            </div>
            <div className="w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {item.percentual}%
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-1">
                Aproveitamento
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
            Complete mais simulados para visualizar seu progresso no gráfico de
            evolução
          </p>
        </div>
      </motion.div>
    );
  }

  if (!estatisticas) return null;

  const { mediaPontuacao, melhorPontuacao, evolucao, tendencia, total } =
    estatisticas;

  const getTendenciaInfo = () => {
    switch (tendencia) {
      case "up":
        return {
          cor: "text-emerald-600 dark:text-emerald-400",
          icone: "📈",
          label: "Em alta",
        };
      case "down":
        return {
          cor: "text-rose-600 dark:text-rose-400",
          icone: "📉",
          label: "Em queda",
        };
      default:
        return {
          cor: "text-blue-600 dark:text-blue-400",
          icone: "➡️",
          label: "Estável",
        };
    }
  };

  const tendenciaInfo = getTendenciaInfo();

  return (
    <div className="space-y-4" role="region" aria-label={titulo}>
      {/* Header com stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20`}>
            <TrendingUp
              className={`w-5 h-5 ${tendenciaInfo.cor}`}
              aria-hidden="true"
            />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-200 text-sm sm:text-base">
              {titulo}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {total} simulados realizados
              {evolucao !== 0 && (
                <span
                  className={
                    evolucao > 0
                      ? "text-emerald-600 dark:text-emerald-400 ml-1"
                      : "text-rose-600 dark:text-rose-400 ml-1"
                  }
                >
                  ({evolucao > 0 ? "+" : ""}
                  {evolucao} pts)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Mini stats */}
        <div className="flex gap-4 text-xs sm:text-sm">
          <div className="text-right">
            <p className="text-slate-500 dark:text-slate-400 text-xs">Média</p>
            <p className="font-bold text-blue-600 dark:text-blue-400">
              {mediaPontuacao} pts
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 dark:text-slate-400 text-xs">Melhor</p>
            <p className="font-bold text-emerald-600 dark:text-emerald-400">
              {melhorPontuacao} pts
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-4 shadow-sm dark:shadow-none"
        style={{ height: altura }}
      >
        <Line
          data={chartData}
          options={options}
          aria-label="Gráfico de evolução de desempenho"
        />

        {/* Badge de meta */}
        {mostrarMeta && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <Target
              className="w-3 h-3 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
              Meta: {metaAprovacao}%
            </span>
          </div>
        )}

        {/* Indicador de tendência */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs" aria-hidden="true">
            {tendenciaInfo.icone}
          </span>
          <span className={`text-[10px] font-medium ${tendenciaInfo.cor}`}>
            {tendenciaInfo.label}
          </span>
        </div>
      </motion.div>

      {/* Legenda customizada */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full bg-blue-500"
            aria-hidden="true"
          />
          <span>Pontuação</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full border-2 border-dashed border-emerald-500"
            aria-hidden="true"
          />
          <span>% Aproveitamento</span>
        </div>
        {mostrarMeta && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-0.5 border-t-2 border-dashed border-amber-500"
              aria-hidden="true"
            />
            <span>Meta Aprovação</span>
          </div>
        )}
      </div>
    </div>
  );
}
