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
  const getConfig = (pct: number) => {
    if (pct >= 70) return { cor: "bg-emerald-500", texto: "text-emerald-400" };
    if (pct >= 60) return { cor: "bg-blue-500", texto: "text-blue-400" };
    if (pct >= 40) return { cor: "bg-amber-500", texto: "text-amber-400" };
    return { cor: "bg-rose-500", texto: "text-rose-400" };
  };

  const config = getConfig(percentual);
  const erros = total - acertos;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="text-sm text-slate-300 w-40 truncate">{nome}</span>
        <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentual}%` }}
            transition={{ delay: delay + 0.15, duration: 0.7, ease: "easeOut" }}
            className={`h-full rounded-full ${config.cor}`}
          />
        </div>
        <span className={`text-sm font-bold w-16 text-right ${config.texto}`}>
          {acertos}/{total}
        </span>
      </div>
      <div className="flex justify-between text-xs text-slate-500 pl-[11.5rem]">
        <span>{percentual.toFixed(0)}% acertos</span>
        <span>
          {erros} erro{erros !== 1 ? "s" : ""}
        </span>
      </div>
    </motion.div>
  );
}
