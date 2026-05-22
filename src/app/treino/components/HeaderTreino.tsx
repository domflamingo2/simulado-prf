"use client";

import { motion } from "framer-motion";
import { Brain, Flame, Sparkles, Target, TrendingUp } from "lucide-react";

interface HeaderTreinoProps {
  stats?: {
    totalQuestoes?: number;
    streak?: number;
    taxaAcerto?: number;
  };
}

export function HeaderTreino({ stats }: HeaderTreinoProps) {
  return (
    <div className="relative mb-12">
      {/* Efeito de glow de fundo */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10"
      >
        {/* Badge decorativo */}
        <div className="flex justify-center sm:justify-start mb-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Modo Estudo Personalizado
            </span>
          </motion.div>
        </div>

        {/* Título principal */}
        <div className="text-center sm:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Treino Específico
            </span>
          </motion.h1>

          {/* Linha decorativa */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4 mx-auto sm:mx-0"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto sm:mx-0 leading-relaxed"
          >
            Personalize sua sessão focando nas matérias que precisam de mais
            atenção.
          </motion.p>
        </div>

        {/* Stats rápidos (opcional) */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-6"
          >
            {stats.totalQuestoes !== undefined && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/10">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-slate-300">
                  <span className="font-bold text-white">
                    {stats.totalQuestoes}
                  </span>{" "}
                  questões disponíveis
                </span>
              </div>
            )}

            {stats.streak !== undefined && stats.streak > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs text-orange-300">
                  <span className="font-bold">{stats.streak}</span> dias de
                  streak
                </span>
              </div>
            )}

            {stats.taxaAcerto !== undefined && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-emerald-300">
                  Taxa de acerto:{" "}
                  <span className="font-bold">{stats.taxaAcerto}%</span>
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Dica de estudo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-3 rounded-lg bg-slate-800/30 border border-white/5 text-center max-w-md mx-auto sm:mx-0"
        >
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <Brain className="w-3 h-3" />
            💡 Escolha uma disciplina e quantidade de questões para começar
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
