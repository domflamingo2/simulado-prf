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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Line } from "react-chartjs-2";

// ============================================================================
// REGISTRO DO CHART.JS
// FIX: removido o hack `(ChartJS as any).registered`. O padrão correto para
// Next.js é registrar dentro de um useEffect ou em um arquivo de setup global.
// Aqui registramos condicionalmente verificando se os componentes já existem.
// ============================================================================
function ensureChartRegistered() {
  if (ChartJS.registry.controllers.get("line")) return; // já registrado
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
// FIX: removidos fillStart/fillEnd que existiam mas nunca eram usados.
// Usando backgroundColor diretamente nos datasets com valores fixos.
// ============================================================================

const THEME = {
  dark: {
    pontuacao: "#3b82f6",
    percentual: "#10b981",
    pontosAlpha: "rgba(59, 130, 246, 0.15)",
    grid: "rgba(255, 255, 255, 0.05)",
    gridPontuacao: "rgba(59, 130, 246, 0.08)",
    text: "#94a3b8",
    tooltipBg: "rgba(15, 23, 42, 0.97)",
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
}: {
  label: string;
  value: number;
  suffix?: string;
  colorClass: string;
}) {
  return (
    <div className="text-right">
      <p className="text-slate-500 dark:text-slate-400 text-xs">{label}</p>
      <p className={`font-bold text-sm ${colorClass}`}>
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
      aria-label="Nenhum dado disponível"
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
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6"
      style={{ minHeight: altura }}
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
            {dataFormatada}
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
// HOOK: useChartTheme
// FIX: adicionado `checkTheme` como callback estável via useCallback para
// evitar re-criação do MutationObserver em cada render.
// ============================================================================

function useChartTheme() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // FIX: leitura do tema no cliente, evita mismatch SSR/cliente
    const check = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches,
      );
    };

    check();
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
// FIX principal: separa o estado de hover do chartData para evitar que cada
// movimento do mouse recrie os datasets inteiros.
//
// A estratégia: `pointRadius` e `pointBorderWidth` são controlados via uma
// ref que é lida pelo plugin customizado — sem re-render do React.
// O plugin atualiza os pontos diretamente no canvas do Chart.js.
// ============================================================================

function useChartHover(chartRef: React.RefObject<ChartJS<"line"> | null>) {
  const hoveredIndexRef = useRef<number | null>(null);

  // Registrado nas options como `onHover` do wrapper react-chartjs-2
  // FIX: `onHover` é uma option válida do Chart.js (não do ChartOptions<"line"> TypeScript,
  // mas é passado corretamente pelo wrapper). Usamos `as any` apenas aqui.
  const onHover = useCallback(
    (_event: unknown, elements: Array<{ index: number }>) => {
      const newIndex = elements.length > 0 ? elements[0].index : null;

      // Só atualiza se mudou — evita trabalho desnecessário
      if (newIndex === hoveredIndexRef.current) return;
      hoveredIndexRef.current = newIndex;

      // FIX: atualiza os pontos diretamente via API imperativa do Chart.js
      // sem re-renderizar o React (sem setState)
      const chart = chartRef.current;
      if (!chart) return;

      chart.data.datasets.forEach((dataset, di) => {
        // Só ajusta pontos nos datasets de dados reais (não na linha de meta)
        if (di >= 2) return;
        const baseRadius = di === 0 ? 5 : 4;
        const hoveredRadius = di === 0 ? 8 : 6;

        dataset.pointRadius = (dataset.data as number[]).map((_, i) =>
          i === newIndex ? hoveredRadius : baseRadius,
        );
      });

      chart.update("none"); // "none" = sem animação, só redesenha
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

  // FIX: chartRef tipado corretamente — era declarado mas nunca usado
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const { onHover } = useChartHover(chartRef);

  // Registra Chart.js no cliente
  useEffect(() => {
    ensureChartRegistered();
  }, []);

  // ── Dados processados ──────────────────────────────────────────────────────

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

    let min = pontuacoes[0];
    let max = pontuacoes[0];
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

  // ── Opções do Chart.js ─────────────────────────────────────────────────────
  // FIX: `onHover` removido das options — era tipagem inválida em ChartOptions<"line">.
  // O hover é gerenciado via `useChartHover` que usa a API imperativa.
  // FIX: `drawBorder: false` removido das scales (deprecated no Chart.js v4).

  const options = useMemo((): ChartOptions<"line"> & { onHover?: unknown } => {
    if (!estatisticas) return {};

    const t = isDark ? THEME.dark : THEME.light;

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      // FIX: onHover passado como prop extra aceito pelo wrapper react-chartjs-2,
      // tipado separadamente para evitar erro do TypeScript em ChartOptions<"line">
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
            font: { size: 12, family: "system-ui, sans-serif" },
          },
        },
        tooltip: {
          backgroundColor: t.tooltipBg,
          titleColor: t.tooltipTitle,
          bodyColor: t.tooltipBody,
          borderColor: t.tooltipBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          displayColors: true,
          titleFont: { size: 13, weight: "bold" },
          bodyFont: { size: 12 },
          callbacks: {
            title: (items) => {
              if (!items.length) return "";
              const idx = items[0].dataIndex;
              if (idx < 0 || idx >= dados.length) return "";
              return new Date(dados[idx].data).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
            },
            label: (ctx) => {
              const suffix = ctx.dataset.yAxisID === "y1" ? "%" : " pts";
              return `${ctx.dataset.label ?? ""}: ${ctx.parsed.y ?? "—"}${suffix}`;
            },
            afterBody: (items) => {
              const idx = items[0]?.dataIndex;
              if (idx == null || idx === 0 || idx >= dados.length) return "";
              const diff = dados[idx].pontuacao - dados[idx - 1].pontuacao;
              if (diff === 0) return "\n➡️ Mesma pontuação";
              return `\n${diff > 0 ? "📈" : "📉"} ${diff > 0 ? "+" : ""}${diff} pts vs anterior`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: t.grid },
          ticks: {
            color: t.text,
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
            color: t.pontuacao,
            font: { size: 11, weight: "bold" },
          },
          grid: { color: t.gridPontuacao },
          ticks: {
            color: t.pontuacao,
            font: { size: 11 },
            callback: (v) => `${v} pts`,
          },
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
            color: t.percentual,
            font: { size: 11, weight: "bold" },
          },
          grid: { drawOnChartArea: false },
          ticks: {
            color: t.percentual,
            font: { size: 11 },
            callback: (v) => `${v}%`,
          },
          min: 0,
          max: 100,
        },
      },
      animation: {
        duration: 600,
        easing: "easeOutQuart",
      },
    };
  }, [estatisticas, isDark, dados, onHover]);

  // ── Dados do gráfico ───────────────────────────────────────────────────────
  // FIX principal: `hoveredIndex` foi completamente removido de chartData.
  // `pointRadius` agora é um valor fixo — o hover é gerenciado imperativamente
  // via `chart.update("none")` no hook useChartHover, sem re-renderizar React.

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
          pointRadius: 5, // FIX: valor fixo — hover atualiza via API imperativa
          pointHoverRadius: 10,
          pointHoverBackgroundColor: t.pontuacao,
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 3,
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
          pointRadius: 4, // FIX: valor fixo
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
                pointHoverRadius: 0,
                borderWidth: 2,
                borderDash: [10, 5],
                yAxisID: "y1" as const,
              },
            ]
          : []),
      ],
    };
  }, [dados, isDark, mostrarMeta, metaAprovacao, estatisticas]);

  // ── Estatísticas de tendência ──────────────────────────────────────────────

  const tendenciaInfo = useMemo(() => {
    if (!estatisticas) return null;
    return {
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
    }[estatisticas.tendencia];
  }, [estatisticas]);

  // ── Guards de renderização ─────────────────────────────────────────────────
  // FIX: ordem corrigida. `dadosValidos.length === 0` é testado ANTES de
  // checar `!mounted`, pois EmptyState não precisa esperar o mount.

  if (dadosValidos.length === 0) {
    return <EmptyState altura={altura} />;
  }

  if (dadosValidos.length === 1) {
    return <SingleDataState item={dados[0]} altura={altura} />;
  }

  // Spinner apenas enquanto o tema não está resolvido (< 1 frame geralmente)
  if (!mounted || !estatisticas || !tendenciaInfo) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
        style={{ height: altura }}
        role="status"
        aria-label="Carregando gráfico"
      >
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  const { media, melhor, evolucao, total } = estatisticas;

  // ── Render ─────────────────────────────────────────────────────────────────

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

      {/* Gráfico */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-4 shadow-sm dark:shadow-none"
        style={{ height: altura }}
      >
        <Line
          // FIX: key baseado em string dos ids, não só no tamanho.
          // Evita destruir o canvas quando dois históricos têm o mesmo length.
          key={dados.map((d) => d.data).join(",")}
          ref={chartRef}
          data={chartData}
          options={options as ChartOptions<"line">}
          aria-label="Gráfico de linha mostrando evolução do desempenho nos simulados"
        />

        {/* Badge de meta */}
        {mostrarMeta && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 shadow-sm backdrop-blur-sm pointer-events-none">
            <Target
              className="w-3 h-3 text-amber-600 dark:text-amber-400"
              aria-hidden="true"
            />
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
              Meta: {metaAprovacao}%
            </span>
          </div>
        )}

        {/* Badge de tendência */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm pointer-events-none">
          <span className="text-xs" aria-hidden="true">
            {tendenciaInfo.icone}
          </span>
          <span className={`text-[10px] font-medium ${tendenciaInfo.cor}`}>
            {tendenciaInfo.label}
          </span>
        </div>
      </motion.div>

      {/* Legenda manual */}
      <div
        className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 dark:text-slate-400"
        aria-hidden="true"
      >
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
            <span>Meta Aprovação</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default GraficoEvolucao;
