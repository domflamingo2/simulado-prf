"use client";

import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { motion } from "framer-motion";
import { Bar, Line } from "react-chartjs-2";

import { GlassCard } from "@/components/ui/GlassCard";
import {
  BarChart3,
  Brain,
  LineChart,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const BASE_PLUGIN_OPTIONS = {
  legend: {
    labels: {
      color: "rgba(255,255,255,0.8)",
      font: { size: 11, weight: "normal" as const },
      usePointStyle: true,
      pointStyle: "circle",
    },
    position: "top" as const,
    align: "center" as const,
  },
  tooltip: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    titleColor: "#fff",
    bodyColor: "rgba(255,255,255,0.8)",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    padding: 12,
    cornerRadius: 8,
    displayColors: true,
  },
};

const ESCALAS_CARTESIANAS = {
  x: {
    ticks: { color: "rgba(255,255,255,0.5)", font: { size: 10 } },
    grid: { color: "rgba(255,255,255,0.05)", drawBorder: false },
    border: { display: false },
  },
  y: {
    ticks: { color: "rgba(255,255,255,0.5)", font: { size: 10 } },
    grid: { color: "rgba(255,255,255,0.05)", drawBorder: false },
    border: { display: false },
    beginAtZero: true,
  },
};

const OPCOES_LINE = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: BASE_PLUGIN_OPTIONS,
  scales: ESCALAS_CARTESIANAS,
  elements: {
    line: {
      tension: 0.3,
      borderWidth: 2,
    },
    point: {
      radius: 3,
      hoverRadius: 5,
      borderWidth: 2,
    },
  },
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
};

const OPCOES_BAR = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    ...BASE_PLUGIN_OPTIONS,
    legend: { display: false },
  },
  scales: ESCALAS_CARTESIANAS,
  elements: {
    bar: {
      borderRadius: 6,
      borderSkipped: false as const,
    },
  },
};

interface GraficosEstatisticasProps {
  dadosLine?: ChartData<"line", number[], string>;
  dadosBar?: ChartData<"bar", number[], string>;
  isLoading?: boolean;
}

const SkeletonChart = () => (
  <div className="h-64 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
      <p className="text-xs text-slate-500">Carregando gráfico...</p>
    </div>
  </div>
);

export function GraficosEstatisticas({
  dadosLine,
  dadosBar,
  isLoading = false,
}: GraficosEstatisticasProps) {
  // Verificação segura: labels deve existir e ter pelo menos 2 itens
  const hasLineData = !!(dadosLine?.labels && dadosLine.labels.length >= 2);

  return (
    <>
      {/* Linha do tempo decorativa */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 mb-2"
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
          <BarChart3 className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
            Análise de Desempenho
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart - Desempenho por Disciplina */}
        <motion.div
          initial={{ opacity: 0, x: -20, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ y: -4 }}
        >
          <GlassCard
            className="p-5 h-full transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
            glow="purple"
          >
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Target className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-base font-bold text-white">
                Desempenho por Disciplina
              </h3>
              <span className="ml-auto text-[10px] text-slate-500">Radar</span>
            </div>
            {isLoading ? (
              <SkeletonChart />
            ) : hasLineData ? (
              <div className="h-64">
                <Line data={dadosLine} options={OPCOES_LINE} />
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center">
                <LineChart className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 text-center">
                  Necessário ao menos 2 simulados para exibir desempenho por
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                  Complete mais simulados para acompanhar sua progressão
                </p>
              </div>
            )}
            <p className="text-[10px] text-slate-500 text-center mt-3">
              📊 Quanto mais próximo da borda, melhor o desempenho
            </p>
          </GlassCard>
        </motion.div>

        {/* Análise Adaptativa */}
        <motion.div
          initial={{ opacity: 0, x: 20, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ y: -4 }}
        >
          <GlassCard
            className="p-5 h-full transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            glow="blue"
          >
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-base font-bold text-white">
                Análise Adaptativa
              </h3>
              <span className="ml-auto text-[10px] text-slate-500">IA</span>
            </div>
            <div className="flex flex-col items-center justify-center h-80 space-y-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">
                  Recomendação Personalizada
                </span>
              </div>
              <p className="text-sm text-slate-400 text-center leading-relaxed">
                Baseado no seu desempenho, foque nas disciplinas com menor taxa
                de acerto para evoluir mais rápido.
              </p>
              <div className="w-full mt-4 p-3 rounded-lg bg-slate-800/50 border border-white/5">
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <Brain className="w-3 h-3 text-purple-400" />A IA está
                  analisando seu histórico para recomendar os melhores próximos
                  passos.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Evolução Temporal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ y: -4 }}
        >
          <GlassCard className="p-5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-base font-bold text-white">
                Evolução Temporal
              </h3>
              <span className="ml-auto text-[10px] text-slate-500">
                Linha do Tempo
              </span>
            </div>
            {isLoading ? (
              <SkeletonChart />
            ) : hasLineData ? (
              <div className="h-64">
                <Line data={dadosLine} options={OPCOES_LINE} />
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center">
                <LineChart className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 text-center">
                  Necessário ao menos 2 simulados para exibir evolução
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                  Complete mais simulados para acompanhar sua progressão
                </p>
              </div>
            )}
            {hasLineData && (
              <p className="text-[10px] text-slate-500 text-center mt-3">
                📈 Acompanhe sua evolução ao longo do tempo
              </p>
            )}
          </GlassCard>
        </motion.div>

        {/* Distribuição de Erros */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ y: -4 }}
        >
          <GlassCard className="p-5 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-red-500">
                <XCircle className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-base font-bold text-white">
                Distribuição de Erros
              </h3>
              <span className="ml-auto text-[10px] text-slate-500">Barras</span>
            </div>
            {isLoading ? (
              <SkeletonChart />
            ) : dadosBar ? (
              <div className="h-64">
                <Bar data={dadosBar} options={OPCOES_BAR} />
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center">
                <BarChart3 className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 text-center">
                  Dados insuficientes para exibir o gráfico
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                  Complete mais simulados para visualizar a distribuição de
                  erros
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </>
  );
}
