"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, HelpCircle, XCircle } from "lucide-react";

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
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="grid grid-cols-2 gap-3 sm:gap-4 mb-8"
      >
        <div className="bg-slate-800/30 rounded-xl p-4 text-center border border-white/5">
          <div className="text-2xl font-bold text-white">
            {taxaAcerto.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Taxa de acerto</div>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-4 text-center border border-white/5">
          <div className="text-2xl font-bold text-white">{totalQuestoes}</div>
          <div className="text-xs text-slate-400 mt-1">Total de questões</div>
        </div>
      </motion.div>
    </>
  );
}
