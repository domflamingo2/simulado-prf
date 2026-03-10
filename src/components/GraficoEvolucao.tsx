"use client";

import {
  CategoryScale,
  Chart as ChartJS,
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
import { useEffect, useState } from "react";
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

interface GraficoEvolucaoProps {
  historico: { data: string; pontuacao: number; percentual: number }[];
  altura?: number;
  mostrarMeta?: boolean;
  metaAprovacao?: number; // padrão 60%
}

export default function GraficoEvolucao({
  historico,
  altura = 300,
  mostrarMeta = true,
  metaAprovacao = 60,
}: GraficoEvolucaoProps) {
  const [isDark, setIsDark] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Detecta tema (assumindo dark por padrão baseado no seu app)
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark") || true);
    };
    checkDark();
  }, []);

  // Estado vazio
  if (!historico || historico.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 text-slate-500"
        style={{ height: altura }}
      >
        <TrendingUp className="w-12 h-12 mb-3 opacity-50" />
        <p className="text-sm">Nenhum dado disponível</p>
        <p className="text-xs opacity-60">
          Complete simulados para ver sua evolução
        </p>
      </div>
    );
  }

  // Estado com poucos dados (1 ponto)
  if (historico.length === 1) {
    const item = historico[0];
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50"
        style={{ height: altura }}
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 text-blue-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">
              Primeiro simulado realizado em
            </p>
            <p className="text-white font-bold text-lg">
              {new Date(item.data).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-6 justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">
                {item.pontuacao}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Pontos
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">
                {item.percentual}%
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Aproveitamento
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dados = [...historico].reverse();

  // Calcula tendência (últimos 3 vs 3 anteriores)
  const tendencia =
    dados.length >= 6
      ? dados.slice(-3).reduce((a, b) => a + b.pontuacao, 0) / 3 >
        dados.slice(-6, -3).reduce((a, b) => a + b.pontuacao, 0) / 3
        ? "up"
        : "down"
      : "neutral";

  const data = {
    labels: dados.map((h) =>
      new Date(h.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
    ),
    datasets: [
      {
        label: "Pontuação CEBRASPE",
        data: dados.map((h) => h.pontuacao),
        borderColor: "#3b82f6", // blue-500
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, altura);
          gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
          gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#1d4ed8",
        pointBorderColor: "#60a5fa",
        pointBorderWidth: 2,
        pointRadius: (ctx: any) => (hoveredIndex === ctx.dataIndex ? 8 : 5),
        pointHoverRadius: 10,
        pointHoverBackgroundColor: "#3b82f6",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 3,
        borderWidth: 3,
      },
      {
        label: "% Aproveitamento",
        data: dados.map((h) => h.percentual),
        borderColor: "#10b981", // emerald-500
        backgroundColor: "transparent",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#059669",
        pointBorderColor: "#34d399",
        pointBorderWidth: 2,
        pointRadius: (ctx: any) => (hoveredIndex === ctx.dataIndex ? 6 : 4),
        pointHoverRadius: 8,
        borderWidth: 2,
        borderDash: [5, 5], // Linha tracejada para diferenciar
        yAxisID: "y1",
      },
      // Linha de meta de aprovação
      ...(mostrarMeta
        ? [
            {
              label: "Meta Aprovação",
              data: Array(dados.length).fill(metaAprovacao),
              borderColor: "#f59e0b", // amber-500
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

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    onHover: (event: any, elements: any[]) => {
      setHoveredIndex(elements.length > 0 ? elements[0].index : null);
    },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: "#94a3b8", // slate-400
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
            family: "system-ui",
          },
        },
      },
      title: {
        display: false, // Removido, usamos componente customizado
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)", // slate-900
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        callbacks: {
          title: (items: any[]) => {
            const date = new Date(dados[items[0].dataIndex].data);
            return date.toLocaleDateString("pt-BR", {
              weekday: "short",
              day: "2-digit",
              month: "long",
            });
          },
          label: (context: any) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
              if (context.dataset.yAxisID === "y1") {
                label += "%";
              } else {
                label += " pts";
              }
            }
            return label;
          },
          afterBody: (items: any[]) => {
            const index = items[0].dataIndex;
            const item = dados[index];
            const diff =
              index > 0 ? item.pontuacao - dados[index - 1].pontuacao : 0;
            if (diff !== 0) {
              return `\n${diff > 0 ? "📈" : "📉"} ${diff > 0 ? "+" : ""}${diff} pts vs anterior`;
            }
            return "";
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#64748b", // slate-500
          font: {
            size: 11,
          },
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Pontuação",
          color: "#3b82f6",
          font: {
            size: 11,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(59, 130, 246, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#3b82f6",
          font: {
            size: 11,
          },
          callback: (value: number) => value + " pts",
        },
        suggestedMin: Math.min(...dados.map((d) => d.pontuacao)) - 5,
        suggestedMax: Math.max(...dados.map((d) => d.pontuacao)) + 5,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "% Acertos",
          color: "#10b981",
          font: {
            size: 11,
            weight: "bold",
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "#10b981",
          font: {
            size: 11,
          },
          callback: (value: number) => value + "%",
        },
        min: 0,
        max: 100,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  // Estatísticas resumidas
  const mediaPontuacao = Math.round(
    dados.reduce((a, b) => a + b.pontuacao, 0) / dados.length,
  );
  const melhorPontuacao = Math.max(...dados.map((d) => d.pontuacao));
  const ultimaPontuacao = dados[dados.length - 1].pontuacao;
  const evolucao = ultimaPontuacao - dados[0].pontuacao;

  return (
    <div className="space-y-4">
      {/* Header com stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <TrendingUp
              className={`w-5 h-5 ${tendencia === "up" ? "text-emerald-400" : tendencia === "down" ? "text-rose-400" : "text-blue-400"}`}
            />
          </div>
          <div>
            <h3 className="font-bold text-slate-200 text-sm sm:text-base">
              Evolução do Desempenho
            </h3>
            <p className="text-xs text-slate-500">
              {dados.length} simulados realizados
              {evolucao !== 0 && (
                <span
                  className={
                    evolucao > 0
                      ? "text-emerald-400 ml-1"
                      : "text-rose-400 ml-1"
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
        <div className="flex gap-4 text-xs">
          <div className="text-right">
            <p className="text-slate-500">Média</p>
            <p className="font-bold text-blue-400">{mediaPontuacao} pts</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500">Melhor</p>
            <p className="font-bold text-emerald-400">{melhorPontuacao} pts</p>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-xl border border-slate-700/50 bg-slate-900/50 p-4"
        style={{ height: altura }}
      >
        <Line data={data} options={options} />

        {/* Badge de meta */}
        {mostrarMeta && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
            <Target className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-medium text-amber-400">
              Meta: {metaAprovacao}%
            </span>
          </div>
        )}
      </motion.div>

      {/* Legenda customizada (opcional, se quiser mais controle) */}
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-slate-400">Pontuação</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2 border-dashed border-emerald-500" />
          <span className="text-slate-400">% Aproveitamento</span>
        </div>
        {mostrarMeta && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-amber-500" />
            <span className="text-slate-400">Meta Aprovação</span>
          </div>
        )}
      </div>
    </div>
  );
}
