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
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

// Registro único global (evita duplicação em hot reload ou múltiplas instâncias)
if (typeof window !== "undefined" && !(ChartJS as any).registered) {
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
  (ChartJS as any).registered = true;
}

// ============================================================================
// TYPES & CONFIGS
// ============================================================================

interface HistoricoItem {
  data: string; // ISO String
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

// Guard de tipo strict para segurança de dados
const isValidHistorico = (item: unknown): item is HistoricoItem => {
  if (!item || typeof item !== "object") return false;
  const h = item as Record<string, unknown>;
  return (
    typeof h.data === "string" &&
    typeof h.pontuacao === "number" &&
    Number.isFinite(h.pontuacao) &&
    typeof h.percentual === "number" &&
    Number.isFinite(h.percentual)
  );
};

// Constantes de tema (evita recriação a cada render)
const THEME_COLORS = {
  dark: {
    pontuacao: "#3b82f6",
    percentual: "#10b981",
    grid: "rgba(255, 255, 255, 0.05)",
    text: "#94a3b8",
    tooltipBg: "rgba(15, 23, 42, 0.95)",
  },
  light: {
    pontuacao: "#2563eb",
    percentual: "#059669",
    grid: "rgba(0, 0, 0, 0.05)",
    text: "#475569",
    tooltipBg: "rgba(255, 255, 255, 0.95)",
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
}: {
  label: string;
  value: number;
  suffix?: string;
  colorClass: string;
}) {
  return (
    <div className="text-right">
      <p className="text-slate-500 dark:text-slate-400 text-xs">{label}</p>
      <p className={`font-bold ${colorClass}`}>
        {value}
        {suffix}
      </p>
    </div>
  );
});

const EmptyState = memo(function EmptyState({ altura }: { altura: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 p-6"
      style={{ height: altura }}
      role="status"
    >
      <TrendingUp className="w-12 h-12 mb-3 opacity-40" aria-hidden="true" />
      <p className="text-sm font-medium">Nenhum dado disponível</p>
      <p className="text-xs opacity-60 mt-1 text-center">
        Complete simulados para visualizar sua evolução
      </p>
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
          Complete mais simulados para visualizar seu progresso no gráfico
        </p>
      </div>
    </motion.div>
  );
});

// ============================================================================
// HOOK CUSTOMIZADO: useChartTheme (Otimizado)
// ============================================================================

function useChartTheme() {
  // Usa matchMedia para detecção mais performática de tema do que MutationObserver
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Verifica classe 'dark' no html
    const checkTheme = () => {
      const hasDarkClass = document.documentElement.classList.contains("dark");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDark(hasDarkClass || prefersDark);
    };

    // Listener para mudanças de mídia (sistema)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkTheme);

    // Listener para mudanças manuais (toggle botão) - usando MutationObserver otimizado
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      mediaQuery.removeEventListener("change", checkTheme);
      observer.disconnect();
    };
  }, []);

  return { isDark, mounted };
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

  // Estado para hover (para destacar pontos)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Validação e ordenação de dados
  const dadosValidos = useMemo(() => {
    if (!Array.isArray(historico)) return [];
    return historico.filter(isValidHistorico);
  }, [historico]);

  const dados = useMemo(() => {
    return [...dadosValidos].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
    );
  }, [dadosValidos]);

  // Cálculos estatísticos robustos
  const estatisticas = useMemo(() => {
    if (dados.length === 0) return null;

    const pontuacoes = dados.map((d) => d.pontuacao);
    const total = pontuacoes.length;
    const soma = pontuacoes.reduce((a, b) => a + b, 0);

    // Cálculo Min/Max em um único loop
    let min = pontuacoes[0];
    let max = pontuacoes[0];
    for (let i = 1; i < total; i++) {
      if (pontuacoes[i] < min) min = pontuacoes[i];
      if (pontuacoes[i] > max) max = pontuacoes[i];
    }

    const media = Math.round(soma / total);
    const evolucao = pontuacoes[total - 1] - pontuacoes[0];

    // Cálculo de tendência (média móvel simples)
    let tendencia: Tendencia = "neutral";
    if (total >= 6) {
      const recente =
        (pontuacoes[total - 1] +
          pontuacoes[total - 2] +
          pontuacoes[total - 3]) /
        3;
      const anterior =
        (pontuacoes[total - 4] +
          pontuacoes[total - 5] +
          pontuacoes[total - 6]) /
        3;
      tendencia =
        recente > anterior ? "up" : recente < anterior ? "down" : "neutral";
    } else if (total >= 2) {
      tendencia = evolucao > 0 ? "up" : evolucao < 0 ? "down" : "neutral";
    }

    return {
      media,
      melhor: max,
      evolucao,
      tendencia,
      total,
      min,
      max,
      padding: Math.max(5, (max - min) * 0.15), // Padding visual
    };
  }, [dados]);

  // Handler de Hover com otimização
  const handleHover = useCallback((_: unknown, elements: unknown[]) => {
    const index =
      Array.isArray(elements) && elements.length > 0
        ? (elements[0] as { index: number }).index
        : null;

    setHoveredIndex(index);
  }, []);

  // Configuração de Dados do Gráfico (Memoizado)
  const chartData: ChartData<"line"> = useMemo(() => {
    if (!estatisticas) return { labels: [], datasets: [] };

    const theme = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

    const labels = dados.map((h) =>
      new Date(h.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
    );

    const pontuacoes = dados.map((h) => h.pontuacao);
    const percentuais = dados.map((h) => h.percentual);

    return {
      labels,
      datasets: [
        {
          label: "Pontuação CEBRASPE",
          data: pontuacoes,
          borderColor: theme.pontuacao,
          // Gradiente de fundo criado sob demanda
          backgroundColor: (context: any) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return null;

            const gradient = ctx.createLinearGradient(
              0,
              chartArea.bottom,
              0,
              chartArea.top,
            );
            gradient.addColorStop(
              0,
              isDark ? "rgba(59, 130, 246, 0.05)" : "rgba(59, 130, 246, 0.0)",
            );
            gradient.addColorStop(
              1,
              isDark ? "rgba(59, 130, 246, 0.4)" : "rgba(59, 130, 246, 0.2)",
            );
            return gradient;
          },
          tension: 0.4,
          fill: true,
          pointBackgroundColor: isDark ? "#1d4ed8" : "#3b82f6",
          pointBorderColor: isDark ? "#60a5fa" : "#93c5fd",
          pointBorderWidth: 2,
          pointRadius: (ctx) => (hoveredIndex === ctx.dataIndex ? 8 : 5),
          pointHoverRadius: 10,
          pointHoverBackgroundColor: theme.pontuacao,
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 3,
          borderWidth: 3,
          yAxisID: "y",
        },
        {
          label: "% Aproveitamento",
          data: percentuais,
          borderColor: theme.percentual,
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
                borderDash: [10, 5],
                yAxisID: "y1" as const,
              },
            ]
          : []),
      ],
    };
  }, [dados, isDark, hoveredIndex, mostrarMeta, metaAprovacao, estatisticas]);

  // Configuração de Opções do Gráfico (Memoizado)
  const options: ChartOptions<"line"> = useMemo(() => {
    if (!estatisticas) return {};

    const theme = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      onHover: handleHover,
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: theme.text,
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
          backgroundColor: theme.tooltipBg,
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
              if (!items.length) return "";
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
              if (context.parsed.y != null) {
                label += context.parsed.y;
                label += context.dataset.yAxisID === "y1" ? "%" : " pts";
              }
              return label;
            },
            afterBody: (items) => {
              const index = items[0]?.dataIndex;
              if (index == null || index === 0) return "";
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
            color: theme.grid,
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
            color: theme.pontuacao,
            font: { size: 11, weight: "bold" },
          },
          grid: {
            color: isDark
              ? "rgba(59, 130, 246, 0.1)"
              : "rgba(59, 130, 246, 0.05)",
            drawBorder: false,
          },
          ticks: {
            color: theme.pontuacao,
            font: { size: 11 },
            callback: (value) => `${value} pts`,
          },
          // Padding visual dinâmico
          suggestedMin: Math.max(0, estatisticas.min - estatisticas.padding),
          suggestedMax: estatisticas.max + estatisticas.padding,
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "% Acertos",
            color: theme.percentual,
            font: { size: 11, weight: "bold" },
          },
          grid: { drawOnChartArea: false }, // Remove grid duplicado
          ticks: {
            color: theme.percentual,
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
  }, [estatisticas, isDark, dados, handleHover]);

  // Guarda de hidratação e dados válidos
  if (!mounted || !estatisticas) {
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
    return <EmptyState altura={altura} />;
  }

  if (dadosValidos.length === 1) {
    return <SingleDataState item={dados[0]} altura={altura} />;
  }

  const { media, melhor, evolucao, tendencia, total } = estatisticas;

  const tendenciaInfo = {
    up: {
      cor: "text-emerald-600 dark:text-emerald-400",
      icone: "📈",
      label: "Em alta",
    },
    down: {
      cor: "text-rose-600 dark:text-rose-400",
      icone: "📉",
      label: "Em queda",
    },
    neutral: {
      cor: "text-blue-600 dark:text-blue-400",
      icone: "➡️",
      label: "Estável",
    },
  }[tendencia];

  return (
    <div className="space-y-4" role="region" aria-label={titulo}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
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

        <div className="flex gap-4 text-xs sm:text-sm">
          <StatsCard
            label="Média"
            value={media}
            suffix=" pts"
            colorClass="text-blue-600 dark:text-blue-400"
          />
          <StatsCard
            label="Melhor"
            value={melhor}
            suffix=" pts"
            colorClass="text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>

      {/* Container do Gráfico */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-4 shadow-sm dark:shadow-none"
        style={{ height: altura }}
      >
        {/* 
           CHAVE: Usar 'key' força o remount do canvas quando o histórico muda.
           Isso corrige bugs visuais e vazamentos de memória do Chart.js 
           ao atualizar dados dinamicamente.
        */}
        <Line
          key={dados.length} // Força limpeza do canvas se a quantidade de pontos mudar
          data={chartData}
          options={options}
          aria-label="Gráfico de evolução de desempenho"
        />

        {/* Badges flutuantes */}
        {mostrarMeta && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 shadow-sm backdrop-blur-sm">
            <Target
              className="w-3 h-3 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
              Meta: {metaAprovacao}%
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
          <span className="text-xs" aria-hidden="true">
            {tendenciaInfo.icone}
          </span>
          <span className={`text-[10px] font-medium ${tendenciaInfo.cor}`}>
            {tendenciaInfo.label}
          </span>
        </div>
      </motion.div>

      {/* Legenda */}
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
});

export default GraficoEvolucao;
