"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Calendar } from "lucide-react";
import { useState } from "react";

type PeriodoFiltro = "7" | "30" | "90" | "todos";

interface PeriodoFilterProps {
  periodo: PeriodoFiltro;
  onChange: (periodo: PeriodoFiltro) => void;
  hasDataInPeriod: boolean;
}

const opcoes: Array<{ value: PeriodoFiltro; label: string; icon: string }> = [
  { value: "7", label: "7 dias", icon: "📊" },
  { value: "30", label: "30 dias", icon: "📈" },
  { value: "90", label: "3 meses", icon: "📉" },
  { value: "todos", label: "Todo histórico", icon: "📚" },
];

export function PeriodoFilter({
  periodo,
  onChange,
  hasDataInPeriod,
}: PeriodoFilterProps) {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Label com ícone */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/50 border border-white/10">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-medium text-slate-400">Período:</span>
        </div>

        {/* Botões de filtro */}
        <div className="flex flex-wrap gap-1.5">
          {opcoes.map((p) => (
            <motion.button
              key={p.value}
              onClick={() => onChange(p.value)}
              onMouseEnter={() => setIsHovered(p.value)}
              onMouseLeave={() => setIsHovered(null)}
              aria-pressed={periodo === p.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 overflow-hidden ${
                periodo === p.value
                  ? "text-white shadow-lg"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
              style={{
                backgroundColor: periodo === p.value ? undefined : undefined,
              }}
            >
              {/* Gradiente do botão ativo */}
              {periodo === p.value && (
                <motion.div
                  layoutId="activePeriod"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}

              {/* Conteúdo */}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="text-sm">{p.icon}</span>
                {p.label}
              </span>

              {/* Efeito de brilho no hover */}
              {isHovered === p.value && periodo !== p.value && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Indicador de sem dados */}
        <AnimatePresence>
          {periodo !== "todos" && !hasDataInPeriod && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30"
            >
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] font-medium text-amber-400">
                Nenhum simulado neste período
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Linha decorativa */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
}
