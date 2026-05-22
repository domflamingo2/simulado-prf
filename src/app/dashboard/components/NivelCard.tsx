"use client";

import { motion } from "framer-motion";
import { Crown, Sparkles, TrendingUp, Trophy } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import ProgressRing from "@/components/ui/ProgressRing";

interface NivelCardProps {
  nivel: number;
  nivelNome: string;
  nivelCor: string;
  progressoNivel: number;
  xpParaProximo: number;
}

export function NivelCard({
  nivel,
  nivelNome,
  nivelCor,
  progressoNivel,
  xpParaProximo,
}: NivelCardProps) {
  const isMaxLevel = nivel >= 10;
  const isHighLevel = nivel >= 7;
  const xpRestante = xpParaProximo.toLocaleString("pt-BR");

  // Mensagem motivacional baseada no progresso
  const getMotivationalMessage = () => {
    if (isMaxLevel) return "🏆 Você atingiu o nível máximo!";
    if (progressoNivel >= 80) return "🚀 Quase lá! Continue firme!";
    if (progressoNivel >= 50) return "💪 Bom progresso, continue assim!";
    if (progressoNivel >= 25) return "📚 Ótimo começo! Não pare!";
    return "🌟 Comece sua jornada hoje!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="relative group"
    >
      {/* Efeito de glow */}
      <div
        className="absolute -inset-0.5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: `${nivelCor}20` }}
      />

      <GlassCard className="p-5 sm:p-6 relative overflow-hidden" glow="purple">
        {/* Gradiente decorativo */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-30"
          style={{ backgroundColor: nivelCor }}
        />

        {/* Ícone decorativo */}
        <div className="absolute bottom-2 right-2 opacity-10">
          {isMaxLevel ? (
            <Crown className="w-16 h-16" />
          ) : (
            <Trophy className="w-16 h-16" />
          )}
        </div>

        <div className="relative flex flex-col sm:flex-row items-center gap-5">
          {/* Progress Ring com animação */}
          <div className="relative">
            <ProgressRing
              progress={progressoNivel}
              size={100}
              strokeWidth={8}
              color={nivelCor}
            >
              <div className="text-center">
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-4xl font-bold text-white"
                >
                  {nivel}
                </motion.span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  NÍVEL
                </span>
              </div>
            </ProgressRing>

            {/* Badge de nível máximo */}
            {isMaxLevel && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -top-2 -right-2"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                  <Crown className="w-3.5 h-3.5 text-white" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Informações do nível */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl font-bold" style={{ color: nivelCor }}>
                {nivelNome}
              </h2>
              {isHighLevel && !isMaxLevel && (
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              )}
            </div>

            {/* Barra de progresso */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Progresso</span>
                <motion.span
                  key={progressoNivel}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="font-mono"
                  style={{ color: nivelCor }}
                >
                  {Math.round(progressoNivel)}%
                </motion.span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden shadow-inner">
                <motion.div
                  className="h-full rounded-full relative"
                  style={{ backgroundColor: nivelCor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressoNivel}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                >
                  {/* Efeito de brilho na barra */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["0%", "200%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* XP restante */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800/50 border border-white/10">
                <TrendingUp className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-400">
                  <span className="font-semibold text-white">{xpRestante}</span>{" "}
                  XP para o próximo nível
                </span>
              </div>
            </div>

            {/* Mensagem motivacional */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.4 }}
              className="text-[10px] text-slate-500 mt-2 text-center sm:text-left"
            >
              {getMotivationalMessage()}
            </motion.p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
