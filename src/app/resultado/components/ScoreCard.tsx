"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { TendenciaBadge } from "./TendenciaBadge";

import { GlassCard } from "@/components/ui/GlassCard";

// ✅ Tipo completo e flexível (compatível com seu sistema)
type NivelDesempenho =
  | "excelente"
  | "bom"
  | "regular"
  | "insuficiente"
  | "critico";

interface ScoreCardProps {
  pontuacao: number;
  classificacao: {
    nivel: NivelDesempenho;
    mensagem: string;
  };
  comparacao?: {
    tendencia: "melhorou" | "piorou" | "estavel";
    diferencaPontos: number;
  };
}

export function ScoreCard({
  pontuacao,
  classificacao,
  comparacao,
}: ScoreCardProps) {
  // ✅ Glow dinâmico (corrigido com suporte a "critico")
  const getGlow = () => {
    switch (classificacao.nivel) {
      case "excelente":
        return "green";
      case "bom":
        return "blue";
      case "regular":
        return "yellow";
      case "insuficiente":
        return "orange";
      case "critico":
        return "red";
      default:
        return "blue";
    }
  };

  // ✅ Gradiente corrigido
  const getGradient = () => {
    switch (classificacao.nivel) {
      case "excelente":
        return "from-emerald-400 to-teal-400";
      case "bom":
        return "from-blue-400 to-cyan-400";
      case "regular":
        return "from-amber-400 to-orange-400";
      case "insuficiente":
        return "from-orange-400 to-red-400";
      case "critico":
        return "from-red-500 to-rose-600";
      default:
        return "from-blue-400 to-cyan-400";
    }
  };

  // ✅ Badge corrigido
  const getBadgeColor = () => {
    switch (classificacao.nivel) {
      case "excelente":
        return "bg-emerald-500/20 text-emerald-400";
      case "bom":
        return "bg-blue-500/20 text-blue-400";
      case "regular":
        return "bg-amber-500/20 text-amber-400";
      case "insuficiente":
        return "bg-orange-500/20 text-orange-400";
      case "critico":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="relative mb-8"
    >
      <GlassCard
        className="p-8 text-center"
        glow={getGlow()}
        glowIntensity="strong"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className={`text-7xl sm:text-8xl font-bold mb-2 bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent`}
        >
          {pontuacao}
        </motion.div>

        <p className="text-slate-400 mb-4">pontos (regra CEBRASPE)</p>

        {comparacao && (
          <div className="flex justify-center mb-4">
            <TendenciaBadge
              tendencia={comparacao.tendencia}
              valor={comparacao.diferencaPontos}
            />
          </div>
        )}

        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getBadgeColor()}`}
        >
          <Award className="w-4 h-4" />
          {classificacao.mensagem}
        </div>
      </GlassCard>
    </motion.div>
  );
}
