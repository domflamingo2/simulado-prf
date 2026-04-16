"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Database,
  TrendingUp,
} from "lucide-react";

interface EstatisticasBancoProps {
  stats: {
    total: number;
    porDificuldade: { 1: number; 2: number; 3: number };
    mediaDificuldade: string;
    totalComTags: number;
    totalComFonteLegal: number;
    totalComBanca: number;
    totalComAssunto: number;
    totalComAno: number;
  };
}

export function EstatisticasBanco({ stats }: EstatisticasBancoProps) {
  const cards = [
    {
      icon: Database,
      label: "Total de Questões",
      value: stats.total,
      cor: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
      textCor: "text-blue-400",
      delay: 0.1,
    },
    {
      icon: TrendingUp,
      label: "Dificuldade Média",
      value: stats.mediaDificuldade,
      subvalue: "(1=Fácil, 3=Difícil)",
      cor: "from-purple-500/10 to-purple-600/5 border-purple-500/20",
      textCor: "text-purple-400",
      delay: 0.15,
    },
    {
      icon: Brain,
      label: "Questões com Tags",
      value: stats.totalComTags,
      subvalue: `${((stats.totalComTags / stats.total) * 100).toFixed(1)}%`,
      cor: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
      textCor: "text-emerald-400",
      delay: 0.2,
    },
    {
      icon: BookOpen,
      label: "Com Fonte Legal",
      value: stats.totalComFonteLegal,
      subvalue: `${((stats.totalComFonteLegal / stats.total) * 100).toFixed(1)}%`,
      cor: "from-amber-500/10 to-amber-600/5 border-amber-500/20",
      textCor: "text-amber-400",
      delay: 0.25,
    },
  ];

  const dificuldadeCards = [
    {
      label: "Fácil",
      value: stats.porDificuldade[1],
      percentual: (stats.porDificuldade[1] / stats.total) * 100,
      cor: "bg-emerald-500",
    },
    {
      label: "Médio",
      value: stats.porDificuldade[2],
      percentual: (stats.porDificuldade[2] / stats.total) * 100,
      cor: "bg-amber-500",
    },
    {
      label: "Difícil",
      value: stats.porDificuldade[3],
      percentual: (stats.porDificuldade[3] / stats.total) * 100,
      cor: "bg-rose-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay }}
            className={`p-4 rounded-xl bg-gradient-to-br ${card.cor} border`}
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.textCor}`} />
              <span className="text-xs text-slate-400">{card.label}</span>
            </div>
            <div className={`text-2xl font-bold ${card.textCor}`}>
              {card.value}
            </div>
            {card.subvalue && (
              <div className="text-[10px] text-slate-500 mt-1">
                {card.subvalue}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50"
      >
        <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          Distribuição por Dificuldade
        </h3>
        <div className="space-y-2">
          {dificuldadeCards.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{item.label}</span>
                <span>{item.value} questões</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentual}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className={`h-full rounded-full ${item.cor}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
