"use client";

import { motion } from "framer-motion";
import { Bar, Line, Radar } from "react-chartjs-2";

import { GlassCard } from "@/components/ui/GlassCard";

import { Brain, Target, TrendingUp, XCircle } from "lucide-react";

const BASE_PLUGIN_OPTIONS = {
  legend: {
    labels: {
      color: "rgba(255,255,255,0.8)",
      font: { size: 12 },
    },
    position: "top" as const,
  },
  tooltip: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    titleColor: "#fff",
    bodyColor: "rgba(255,255,255,0.8)",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    padding: 12,
    cornerRadius: 8,
  },
};

const ESCALAS_CARTESIANAS = {
  x: {
    ticks: { color: "rgba(255,255,255,0.5)", font: { size: 11 } },
    grid: { color: "rgba(255,255,255,0.05)" },
  },
  y: {
    ticks: { color: "rgba(255,255,255,0.5)", font: { size: 11 } },
    grid: { color: "rgba(255,255,255,0.05)" },
  },
};

const OPCOES_LINE = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: BASE_PLUGIN_OPTIONS,
  scales: ESCALAS_CARTESIANAS,
};

const OPCOES_BAR = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    ...BASE_PLUGIN_OPTIONS,
    legend: { display: false },
  },
  scales: ESCALAS_CARTESIANAS,
};

const OPCOES_RADAR = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: BASE_PLUGIN_OPTIONS,
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: {
        color: "rgba(255,255,255,0.5)",
        backdropColor: "transparent",
        stepSize: 20,
      },
      grid: { color: "rgba(255,255,255,0.1)" },
      pointLabels: {
        color: "rgba(255,255,255,0.8)",
        font: { size: 11, weight: "bold" as const },
      },
    },
  },
};

interface GraficosEstatisticasProps {
  dadosRadar: any;
  dadosLine: any;
  dadosBar: any;
}

export function GraficosEstatisticas({
  dadosRadar,
  dadosLine,
  dadosBar,
}: GraficosEstatisticasProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-6 h-full">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Desempenho por Disciplina
            </h3>
            <div className="h-80">
              <Radar data={dadosRadar} options={OPCOES_RADAR} />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-6 h-full" glow="purple">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Análise Adaptativa
            </h3>
            {/* Conteúdo da análise adaptativa será inserido pelo componente pai */}
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Evolução Temporal
            </h3>
            <div className="h-64">
              {dadosLine.labels.length >= 2 ? (
                <Line data={dadosLine} options={OPCOES_LINE} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                  Necessário ao menos 2 simulados para exibir evolução
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              Distribuição de Erros
            </h3>
            <div className="h-64">
              <Bar data={dadosBar} options={OPCOES_BAR} />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </>
  );
}
