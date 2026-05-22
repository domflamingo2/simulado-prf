"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { formatarTempoLegivel } from "@/lib/simulado-logic";
import { StatCard } from "./StatCard";

interface StatsResumoProps {
  acertos: number;
  erros: number;
  brancos: number;
  tempoTotal: number;
  totalQuestoes: number;
}

export function StatsResumo({
  acertos,
  erros,
  brancos,
  tempoTotal,
  totalQuestoes,
}: StatsResumoProps) {
  const taxaAcerto = (acertos / totalQuestoes) * 100;

  return (
    <div className="space-y-6 mb-8">
      {/* Grid de cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={CheckCircle2}
          value={acertos}
          label="Acertos"
          color="emerald"
          delay={0.3}
        />
        <StatCard
          icon={XCircle}
          value={erros}
          label="Erros"
          color="rose"
          delay={0.4}
        />
        <StatCard
          icon={HelpCircle}
          value={brancos}
          label="Em branco"
          color="amber"
          delay={0.5}
        />
        <StatCard
          icon={Clock}
          value={formatarTempoLegivel(tempoTotal)}
          label="Tempo"
          color="blue"
          delay={0.6}
        />
      </div>

      {/* Cards adicionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 rounded-xl p-4 border border-white/10"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              Taxa de Acerto
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {taxaAcerto.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${taxaAcerto}%` }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 rounded-xl p-4 border border-white/10 text-center"
        >
          <div className="text-2xl font-bold text-white">{totalQuestoes}</div>
          <div className="text-xs text-slate-400 mt-1">Total de questões</div>
          <div className="text-[10px] text-slate-500 mt-2">
            {acertos + erros} respondidas • {brancos} em branco
          </div>
        </motion.div>
      </div>
    </div>
  );
}
