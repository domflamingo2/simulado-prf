// src/app/VideoAulas/components/GraficoProgresso.tsx

"use client";

import { Video } from "@/data/videoaulas/videoAulasData";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";

interface GraficoProgressoProps {
  videos: Video[];
  videosAssistidos: Set<string>;
  categoriaNome: string;
}

// Converte strings de duração para minutos
function parseDurationToMinutes(duration: string): number {
  if (!duration) return 0;

  const hMin = duration.match(/(\d+)h\s*(\d*)(?:min)?/);
  if (hMin) {
    const hours = parseInt(hMin[1]);
    const minutes = parseInt(hMin[2] || "0");
    return hours * 60 + minutes;
  }

  const minOnly = duration.match(/^(\d+)\s*min$/i);
  if (minOnly) return parseInt(minOnly[1]);

  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 60 + parts[1] + parts[2] / 60;
  }
  if (parts.length === 2) {
    return parts[0] + parts[1] / 60;
  }

  const num = parseInt(duration);
  return isNaN(num) ? 0 : num;
}

function formatHoras(minutos: number): string {
  if (minutos <= 0) return "0 min";
  if (minutos < 60) return `${Math.round(minutos)} min`;
  const h = Math.floor(minutos / 60);
  const m = Math.round(minutos % 60);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function progressColor(pct: number): string {
  if (pct >= 100) return "from-emerald-500 to-green-400";
  if (pct >= 60) return "from-blue-500 to-cyan-400";
  if (pct >= 30) return "from-yellow-500 to-orange-400";
  return "from-rose-500 to-pink-400";
}

function getInsightMessage(percentual: number, restante: number): string {
  if (percentual === 100) return "🎉 Parabéns! Você completou todos os vídeos!";
  if (percentual >= 75) return "🚀 Quase lá! Continue com esse ritmo!";
  if (percentual >= 50) return "💪 Bom progresso! Continue assim!";
  if (percentual >= 25) return "📚 Ótimo começo! Não pare agora!";
  return "🌟 Comece hoje mesmo sua jornada de estudos!";
}

export function GraficoProgresso({
  videos,
  videosAssistidos,
}: GraficoProgressoProps) {
  const stats = useMemo(() => {
    const total = videos.length;
    if (total === 0) return null;

    const assistidos = videos.filter((v: Video) => videosAssistidos.has(v.id));
    const naoAssistidos = videos.filter(
      (v: Video) => !videosAssistidos.has(v.id),
    );

    const duracoes = videos.map((v: Video) =>
      parseDurationToMinutes(v.duracao),
    );
    const duracaoTotal = duracoes.reduce((a: number, b: number) => a + b, 0);
    const tempoMedio = duracaoTotal / total;

    const duracaoRestante = naoAssistidos.reduce(
      (acc: number, v: Video) => acc + parseDurationToMinutes(v.duracao),
      0,
    );

    const duracaoAssistida = assistidos.reduce(
      (acc: number, v: Video) => acc + parseDurationToMinutes(v.duracao),
      0,
    );

    const percentual = (assistidos.length / total) * 100;

    const maxDur = Math.max(...duracoes, 1);
    const barras = videos.map((v: Video) => ({
      id: v.id,
      label: v.titulo.slice(0, 25),
      duracao: parseDurationToMinutes(v.duracao),
      assistido: videosAssistidos.has(v.id),
      widthPct: (parseDurationToMinutes(v.duracao) / maxDur) * 100,
    }));

    return {
      total,
      assistidosCount: assistidos.length,
      percentual,
      tempoMedio,
      duracaoRestante,
      duracaoAssistida,
      duracaoTotal,
      barras,
    };
  }, [videos, videosAssistidos]);

  if (!stats) return null;

  const {
    total,
    assistidosCount,
    percentual,
    tempoMedio,
    duracaoRestante,
    duracaoAssistida,
    duracaoTotal,
    barras,
  } = stats;

  const gradiente = progressColor(percentual);
  const insightMessage = getInsightMessage(percentual, duracaoRestante);
  const isCompleto = percentual === 100;

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/30 backdrop-blur-sm border border-white/10 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <h4 className="text-sm font-semibold text-slate-200">
            Estatísticas da matéria
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Target className="w-3 h-3" />
          <span>{total} vídeos</span>
        </div>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <MetricCard
          icon={PlayCircle}
          label="Vídeos assistidos"
          value={`${assistidosCount}/${total}`}
          color="emerald"
        />
        <MetricCard
          icon={Clock}
          label="Tempo médio"
          value={formatHoras(tempoMedio)}
          color="blue"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Já estudado"
          value={formatHoras(duracaoAssistida)}
          color="purple"
        />
        <MetricCard
          icon={Clock}
          label="Tempo restante"
          value={
            duracaoRestante > 0 ? formatHoras(duracaoRestante) : "✓ Concluído"
          }
          color={duracaoRestante === 0 ? "emerald" : "amber"}
          highlight={duracaoRestante === 0}
        />
      </div>

      {/* Barra de progresso geral */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            Progresso total
          </span>
          <motion.span
            key={assistidosCount}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="font-mono font-semibold text-slate-300"
          >
            {Math.round(percentual)}%
          </motion.span>
        </div>
        <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentual}%` }}
            transition={{ duration: 0.6, type: "spring", damping: 20 }}
            className={`h-full bg-gradient-to-r ${gradiente} rounded-full relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </motion.div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-600 mt-1.5">
          <span>{formatHoras(duracaoAssistida)} assistido</span>
          <span>Total: {formatHoras(duracaoTotal)}</span>
          <span>{formatHoras(duracaoRestante)} restante</span>
        </div>
      </div>

      {/* Insight motivacional */}
      <div
        className={`mb-5 p-3 rounded-xl ${isCompleto ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-blue-500/10 border border-blue-500/20"}`}
      >
        <div className="flex items-center gap-2">
          <Sparkles
            className={`w-4 h-4 ${isCompleto ? "text-emerald-400" : "text-yellow-500"}`}
          />
          <p
            className={`text-xs ${isCompleto ? "text-emerald-400" : "text-slate-300"}`}
          >
            {insightMessage}
          </p>
        </div>
      </div>

      {/* Mini-gráfico de barras horizontais */}
      {barras.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded-lg bg-slate-700/30">
              <span className="text-[10px]">📊</span>
            </div>
            <p className="text-xs text-slate-500">Duração por vídeo</p>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {barras.slice(0, 12).map((barra, idx) => (
              <motion.div
                key={barra.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="flex items-center gap-2 group"
              >
                <div className="w-full flex-1 h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barra.widthPct}%` }}
                    transition={{ delay: idx * 0.03, duration: 0.4 }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      barra.assistido
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400 group-hover:from-emerald-400 group-hover:to-emerald-300"
                        : "bg-slate-600/70 group-hover:bg-slate-500/70"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] tabular-nums shrink-0 w-14 text-right transition-colors ${
                    barra.assistido
                      ? "text-emerald-400 font-medium"
                      : "text-slate-500"
                  }`}
                  title={barra.label}
                >
                  {barra.duracao > 0 ? `${Math.round(barra.duracao)}min` : "—"}
                </span>
              </motion.div>
            ))}
            {barras.length > 12 && (
              <p className="text-[10px] text-slate-600 text-center pt-2">
                +{barras.length - 12} vídeos não exibidos
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-2 border-t border-white/10">
            <Legend color="from-emerald-500 to-emerald-400" label="Assistido" />
            <Legend color="bg-slate-600/70" label="Pendente" />
            {percentual === 100 && (
              <div className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Matéria concluída!</span>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
  highlight = false,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  const colors = {
    emerald:
      "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30",
    blue: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30",
    purple:
      "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30",
    amber:
      "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30",
  };

  return (
    <div
      className={`rounded-xl bg-gradient-to-br ${colors[color as keyof typeof colors]} border p-2.5 transition-all duration-200 hover:scale-105`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3" />
        <p className="text-[9px] text-slate-500 uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p
        className={`text-sm font-bold ${highlight ? "text-emerald-400" : "text-slate-200"} tabular-nums`}
      >
        {value}
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  const isGradient = color.includes("from-");
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-2.5 h-2.5 rounded-sm ${isGradient ? `bg-gradient-to-r ${color}` : color}`}
      />
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  );
}
