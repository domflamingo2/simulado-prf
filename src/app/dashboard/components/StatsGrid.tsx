"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Clock, Trophy } from "lucide-react";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Grid principal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div variants={itemVariants}>
          <StatCard
            icon={CheckCircle2}
            label="Média Geral"
            value={mediaGeral.toFixed(1)}
            subvalue="pontos"
            variant="emerald"
            trend={getTrendValue()}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={Trophy}
            label="Melhor Pontuação"
            value={melhorPontuacao}
            subvalue={`pior: ${piorPontuacao}`}
            variant="purple"
            glow
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={Clock}
            label="Simulados"
            value={totalSimulados}
            subvalue={
              periodoFiltro === "todos"
                ? "no total"
                : `em ${periodoFiltro} dias`
            }
            variant="amber"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            icon={Calendar}
            label="Último"
            value={ultimoData}
            subvalue={`${ultimaPontuacao} pts`}
            variant="cyan"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
