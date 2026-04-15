"use client";

import { motion } from "framer-motion";

interface DisciplinaBarProps {
  nome: string;
  acertos: number;
  total: number;
  percentual: number;
  delay: number;
}

export function DisciplinaBar({
  nome,
  acertos,
  total,
  percentual,
  delay,
}: DisciplinaBarProps) {
  const getColor = (pct: number) => {
    if (pct >= 70) return "bg-emerald-500";
    if (pct >= 60) return "bg-amber-500";
    if (pct >= 40) return "bg-orange-500";
    return "bg-rose-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="group"
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="text-sm text-slate-300 w-40 truncate">{nome}</span>
        <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentual}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${getColor(percentual)} relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
          </motion.div>
        </div>
        <span className="text-sm font-bold w-16 text-right text-slate-400">
          {acertos}/{total}
        </span>
      </div>
      <div className="flex justify-between text-xs text-slate-500 pl-[11.5rem]">
        <span>{percentual.toFixed(0)}% acertos</span>
        <span>{total - acertos} erros</span>
      </div>
    </motion.div>
  );
}
