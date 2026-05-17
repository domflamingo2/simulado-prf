// src/app/VideoAulas/components/GraficoProgresso.tsx

"use client";

import { Video } from "@/data/videoaulas/videoAulasData";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface GraficoProgressoProps {
  videos: Video[];
  videosAssistidos: Set<string>;
  categoriaNome: string;
}

// Converte strings de duração para minutos.
// Suporta: "1h30min", "1h30", "45min", "45", "1:30:00", "45:00"
function parseDurationToMinutes(duration: string): number {
  if (!duration) return 0;

  // Formato: "1h30min" ou "1h30"
  const hMin = duration.match(/(\d+)h\s*(\d*)(?:min)?/);
  if (hMin) {
    const hours = parseInt(hMin[1]);
    const minutes = parseInt(hMin[2] || "0");
    return hours * 60 + minutes;
  }

  // Formato: "45min" ou "45 min"
  const minOnly = duration.match(/^(\d+)\s*min$/i);
  if (minOnly) return parseInt(minOnly[1]);

  // Formato: "HH:MM:SS" ou "MM:SS"
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 60 + parts[1] + parts[2] / 60;
  }
  if (parts.length === 2) {
    return parts[0] + parts[1] / 60;
  }

  // Fallback: tenta converter diretamente
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

// Cores por nível de progresso
function progressColor(pct: number): string {
  if (pct >= 100) return "from-emerald-500 to-green-400";
  if (pct >= 60) return "from-blue-500 to-cyan-400";
  if (pct >= 30) return "from-yellow-500 to-orange-400";
  return "from-red-500 to-pink-400";
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

    // CORRIGIDO: usar 'duracao' em vez de 'duration'
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

    // Distribuição: assistidos, não assistidos
    const maxDur = Math.max(...duracoes, 1);
    const barras = videos.map((v: Video) => ({
      id: v.id,
      // CORRIGIDO: usar 'titulo' em vez de 'title'
      label: v.titulo.slice(0, 20),
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

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
        <span aria-hidden="true">📊</span>
        Estatísticas da matéria
      </h4>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <MetricCard
          label="Vídeos assistidos"
          value={`${assistidosCount}/${total}`}
        />
        <MetricCard label="Tempo médio" value={formatHoras(tempoMedio)} />
        <MetricCard label="Já estudado" value={formatHoras(duracaoAssistida)} />
        <MetricCard
          label="Tempo restante"
          value={duracaoRestante > 0 ? formatHoras(duracaoRestante) : "✓ Tudo"}
          highlight={duracaoRestante === 0}
        />
      </div>

      {/* Barra de progresso geral */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Progresso total</span>
          <motion.span
            key={assistidosCount}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="font-mono font-medium text-slate-300"
          >
            {Math.round(percentual)}%
          </motion.span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={false}
            animate={{ width: `${percentual}%` }}
            transition={{ duration: 0.6, type: "spring", damping: 20 }}
            className={`h-full bg-gradient-to-r ${gradiente} rounded-full`}
          />
        </div>
        {/* Tempo total da categoria */}
        <p className="text-xs text-slate-600 mt-1 text-right">
          {formatHoras(duracaoTotal)} no total
        </p>
      </div>

      {/* Mini-gráfico de barras horizontais por vídeo */}
      {barras.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 mb-2">Duração por vídeo</p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {barras.slice(0, 12).map((barra, idx) => (
              <div key={barra.id} className="flex items-center gap-2">
                <div className="w-full flex-1 h-3 bg-slate-700/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{ width: `${barra.widthPct}%` }}
                    transition={{ delay: idx * 0.03, duration: 0.4 }}
                    className={`h-full rounded-full ${
                      barra.assistido ? "bg-emerald-500/70" : "bg-slate-500/50"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] tabular-nums shrink-0 w-12 text-right ${
                    barra.assistido ? "text-emerald-400" : "text-slate-500"
                  }`}
                >
                  {barra.duracao > 0 ? `${Math.round(barra.duracao)}min` : "—"}
                </span>
              </div>
            ))}
            {barras.length > 12 && (
              <p className="text-[10px] text-slate-600 text-center pt-1">
                +{barras.length - 12} vídeos não exibidos
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Legend color="bg-emerald-500/70" label="Assistido" />
            <Legend color="bg-slate-500/50" label="Pendente" />
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-slate-700/30 rounded-lg px-3 py-2">
      <p className="text-[10px] text-slate-500 leading-tight">{label}</p>
      <p
        className={`text-sm font-bold mt-0.5 ${
          highlight ? "text-emerald-400" : "text-slate-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  );
}
