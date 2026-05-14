"use client";

import { CheckCircle2, Clock, Trophy } from "lucide-react";

import StatCard from "@/components/ui/StatCard";

interface StatsGridProps {
  mediaGeral: number;
  tendencia: "up" | "down" | "stable";
  media7Dias: number;
  melhorPontuacao: number;
  piorPontuacao: number;
  totalSimulados: number;
  periodoFiltro: string;
  ultimoData: string;
  ultimaPontuacao: number;
}

export function StatsGrid({
  mediaGeral,
  tendencia,
  media7Dias,
  melhorPontuacao,
  piorPontuacao,
  totalSimulados,
  periodoFiltro,
  ultimoData,
  ultimaPontuacao,
}: StatsGridProps) {
  const getTrendValue = () => {
    if (tendencia === "stable") return undefined;
    const diff = media7Dias - mediaGeral;
    const percent = mediaGeral > 0 ? (diff / mediaGeral) * 100 : 0;
    return {
      value: Math.abs(percent),
      positive: tendencia === "up",
    };
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        icon={CheckCircle2}
        label="Média Geral"
        value={mediaGeral.toFixed(1)}
        subvalue="pontos"
        variant="emerald"
        trend={getTrendValue()}
      />
      <StatCard
        icon={Trophy}
        label="Melhor Pontuação"
        value={melhorPontuacao}
        subvalue={`pior: ${piorPontuacao}`}
        variant="purple"
        glow
      />
      <StatCard
        icon={Clock}
        label="Simulados"
        value={totalSimulados}
        subvalue={
          periodoFiltro === "todos" ? "no total" : `em ${periodoFiltro} dias`
        }
        variant="amber"
      />
      <StatCard
        icon={Clock}
        label="Último"
        value={ultimoData}
        subvalue={`${ultimaPontuacao} pts`}
        variant="cyan"
      />
    </div>
  );
}
