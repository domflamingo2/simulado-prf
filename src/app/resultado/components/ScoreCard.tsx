"use client";

import { motion } from "framer-motion";
import {
  Award,
  Crown,
  Minus,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";

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

  const getGradient = () => {
    switch (classificacao.nivel) {
      case "excelente":
        return "from-emerald-400 via-teal-400 to-emerald-300";
      case "bom":
        return "from-blue-400 via-cyan-400 to-blue-300";
      case "regular":
        return "from-amber-400 via-orange-400 to-amber-300";
      case "insuficiente":
        return "from-orange-400 via-red-400 to-orange-300";
      case "critico":
        return "from-red-500 via-rose-600 to-red-400";
      default:
        return "from-blue-400 via-cyan-400 to-blue-300";
    }
  };

  const getBadgeColor = () => {
    switch (classificacao.nivel) {
      case "excelente":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "bom":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "regular":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "insuficiente":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "critico":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getIcon = () => {
    switch (classificacao.nivel) {
      case "excelente":
        return <Crown className="w-4 h-4" />;
      case "bom":
        return <Star className="w-4 h-4" />;
      case "regular":
        return <Award className="w-4 h-4" />;
      case "insuficiente":
        return <TrendingDown className="w-4 h-4" />;
      case "critico":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const getTendenciaIcon = () => {
    if (!comparacao) return null;
    switch (comparacao.tendencia) {
      case "melhorou":
        return <TrendingUp className="w-4 h-4" />;
      case "piorou":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
      className="relative mb-8"
    >
      {/* Efeito de brilho de fundo */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${getGradient()} rounded-2xl blur-2xl opacity-20 animate-pulse`}
      />

      <GlassCard
        className="p-8 text-center relative overflow-hidden"
        glow={getGlow()}
        glowIntensity="strong"
      >
        {/* Partículas decorativas */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-xl" />

        {/* Ícone decorativo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.3, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 right-4"
        >
          {classificacao.nivel === "excelente" ? (
            <Sparkles className="w-5 h-5 text-yellow-400" />
          ) : (
            <Award className="w-5 h-5 text-slate-600" />
          )}
        </motion.div>

        {/* Pontuação principal */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="relative"
        >
          <div
            className={`text-8xl sm:text-9xl font-black mb-3 bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent drop-shadow-2xl`}
          >
            {pontuacao}
          </div>

          {/* Anel decorativo ao redor da pontuação */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-8 -left-8 w-32 h-32 rounded-full border-2 border-dashed border-white/10 hidden sm:block"
          />
        </motion.div>

        <p className="text-slate-400 mb-5 text-sm">pontos (regra CEBRASPE)</p>

        {/* Comparação com tendência */}
        {comparacao && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mb-5"
          >
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
                comparacao.tendencia === "melhorou"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : comparacao.tendencia === "piorou"
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    : "bg-slate-500/10 text-slate-400 border border-slate-500/30"
              }`}
            >
              {getTendenciaIcon()}
              <span className="text-xs font-medium">
                {comparacao.tendencia === "melhorou" && "+"}
                {comparacao.diferencaPontos} pontos em relação ao último
                simulado
              </span>
            </div>
          </motion.div>
        )}

        {/* Badge de classificação */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${getBadgeColor()} border shadow-lg`}
        >
          {getIcon()}
          {classificacao.mensagem}
        </motion.div>

        {/* Barra de progresso animada (opcional) */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </GlassCard>
    </motion.div>
  );
}
