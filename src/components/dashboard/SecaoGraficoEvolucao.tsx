// src/components/charts/GraficoEvolucao.tsx
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
import { memo, useMemo } from "react";
import { Line } from "react-chartjs-2";

// Registrar componentes do Chart.js
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

// ============================================================================
// TYPES
// ============================================================================

interface DadoGrafico {
  data: string;
  dataFormatada: string;
  pontuacao: number;
  percentual: number;
  label: string;
}

interface GraficoEvolucaoProps {
  historico: DadoGrafico[];
  altura?: number;
  mostrarMeta?: boolean;
  metaAprovacao?: number;
  onTooltipChange?: (
    data: {
      visible: boolean;
      x: number;
      y: number;
      content: string;
    } | null,
  ) => void;
  theme?: "light" | "dark";
}

// ============================================================================
// CONFIGURAÇÕES DO GRÁFICO
// ============================================================================

const getChartOptions = (
  theme: "light" | "dark",
  mostrarMeta: boolean,
  metaAprovacao: number,
  onTooltipChange?: ( // ← NOVO PARÂMETRO
    data: {
      visible: boolean;
      x: number;
      y: number;
      content: string;
    } | null,
  ) => void,
): ChartOptions<"line"> => {
  const isDark = theme === "dark";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const zeroLineColor = isDark ? "#475569" : "#cbd5e1";

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: "easeOutQuart" as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, // Desabilitado para usar tooltip customizado
        external: (context) => {
          const tooltip = context.tooltip;
          if (onTooltipChange) {
            if (tooltip.opacity === 0) {
              onTooltipChange(null);
              return;
            }
            const { chart } = context;
            const tooltipModel = tooltip;
            const position = chart.canvas.getBoundingClientRect();
            const body = tooltipModel.body;

            if (body?.[0]?.lines?.[0]) {
              onTooltipChange({
                visible: true,
                x: tooltipModel.caretX,
                y: tooltipModel.caretY - 10,
                content: body[0].lines[0],
              });
            }
          }
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: textColor,
          font: { size: 10, family: "system-ui" },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
          padding: 8,
        },
        border: {
          display: true,
          color: gridColor,
          width: 1,
        },
      },
      y: {
        min: -60,
        max: 60,
        grid: {
          color: (context) =>
            context.tick.value === 0 ? zeroLineColor : gridColor,
          lineWidth: (context) => (context.tick.value === 0 ? 2 : 1),
        },
        ticks: {
          color: textColor,
          font: { size: 9, family: "system-ui" },
          padding: 8,
          callback: (value) => `${value}`,
          stepSize: 20,
        },
        border: {
          display: true,
          color: gridColor,
          width: 1,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };
};

// ============================================================================
// COMPONENTE
// ============================================================================

export default memo(function GraficoEvolucao({
  historico,
  altura,
  mostrarMeta = true,
  metaAprovacao = 60,
  onTooltipChange,
  theme = "dark",
}: GraficoEvolucaoProps) {
  // Preparar dados para o Chart.js
  const chartData = useMemo((): ChartData<"line"> => {
    const labels = historico.map((d) => d.dataFormatada);
    const pontuacoes = historico.map((d) => d.pontuacao);
    const percentuais = historico.map((d) => d.percentual);

    return {
      labels,
      datasets: [
        {
          label: "Pontuação",
          data: pontuacoes,
          borderColor: "rgb(59, 130, 246)", // blue-500
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 2.5,
          pointBackgroundColor: "rgb(30, 64, 175)", // blue-800
          pointBorderColor: "rgb(59, 130, 246)",
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgb(30, 64, 175)",
          pointHoverBorderColor: "rgb(96, 165, 250)",
          fill: true,
          tension: 0.4,
        },
        // Linha de percentual (opcional, secundária)
        // {
        //   label: "Aproveitamento %",
        //   data: percentuais,
        //   borderColor: "rgba(16, 185, 129, 0.8)",
        //   borderDash: [5, 5],
        //   borderWidth: 1.5,
        //   pointRadius: 0,
        //   yAxisID: "y1",
        // },
      ],
    };
  }, [historico]);

  const options = useMemo(
    () => getChartOptions(theme, mostrarMeta, metaAprovacao),
    [theme, mostrarMeta, metaAprovacao],
  );

  // Plugin para linha de meta
  const metaPlugin = useMemo(
    () =>
      mostrarMeta
        ? {
            id: "metaAprovacao",
            beforeDraw: (chart: ChartJS) => {
              const { ctx, chartArea, scales } = chart;
              if (!scales.y || !chartArea) return;

              const yMeta = scales.y.getPixelForValue(metaAprovacao);

              ctx.save();
              ctx.beginPath();
              ctx.setLineDash([6, 4]);
              ctx.moveTo(chartArea.left, yMeta);
              ctx.lineTo(chartArea.right, yMeta);
              ctx.strokeStyle = "rgba(16, 185, 129, 0.6)"; // emerald-500
              ctx.lineWidth = 2;
              ctx.stroke();

              // Label da meta
              ctx.font = "10px system-ui";
              ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
              ctx.textAlign = "right";
              ctx.fillText(
                `${metaAprovacao} pts`,
                chartArea.right - 8,
                yMeta - 6,
              );
              ctx.restore();
            },
          }
        : undefined,
    [mostrarMeta, metaAprovacao],
  );

  const plugins = useMemo(() => (metaPlugin ? [metaPlugin] : []), [metaPlugin]);

  return (
    <div
      className="h-full w-full"
      style={{ height: altura ? `${altura}px` : "100%" }}
    >
      <Line data={chartData} options={options} plugins={plugins} />
    </div>
  );
});
