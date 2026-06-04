"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Grid3x3,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

import { Disciplina } from "@/data/questoes/index";

interface DisciplinaCardProps {
  disciplina: {
    value: Disciplina;
    label: string;
    icon: any;
    color: string;
    bgGradient: string;
    iconBg: string;
  };
  count: number;
  isSelected: boolean;
  onSelect: () => void;
  performance?: "bom" | "medio" | "baixo" | null;
}

export function DisciplinaCard({
  disciplina,
  count,
  isSelected,
  onSelect,
  performance,
}: DisciplinaCardProps) {
  const Icon = disciplina.icon;

  const getPerformanceConfig = () => {
    if (!performance) return null;
    switch (performance) {
      case "bom":
        return {
          icon: TrendingUp,
          color: "text-emerald-400",
          bg: "bg-emerald-500/20",
          label: "Bom desempenho",
        };
      case "medio":
        return {
          icon: Star,
          color: "text-amber-400",
          bg: "bg-amber-500/20",
          label: "Desempenho médio",
        };
      case "baixo":
        return {
          icon: Sparkles,
          color: "text-rose-400",
          bg: "bg-rose-500/20",
          label: "Precisa atenção",
        };
      default:
        return null;
    }
  };

  const perfConfig = getPerformanceConfig();
  const PerfIcon = perfConfig?.icon;

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        relative text-left p-5 rounded-2xl border transition-all duration-300 group
        flex flex-col justify-between h-32 w-full overflow-hidden
        ${
          isSelected
            ? "bg-gradient-to-br from-slate-800/90 to-slate-800/60 border-emerald-500/50 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500/30"
            : "bg-slate-900/40 border-white/10 hover:border-white/20 hover:bg-slate-800/60"
        }
      `}
    >
      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      {/* Ícone decorativo de fundo */}
      <div className="absolute bottom-2 right-2 opacity-5">
        <Icon className="w-12 h-12" />
      </div>

      <div className="relative z-10">
        {/* Header com ícone e badge de seleção */}
        <div className="flex justify-between items-start">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`p-2.5 rounded-xl ${disciplina.iconBg} transition-all duration-300 shadow-lg`}
          >
            <Icon className={`w-5 h-5 ${disciplina.color}`} />
          </motion.div>

          <div className="flex items-center gap-2">
            {/* Badge de performance */}
            {perfConfig && PerfIcon && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full ${perfConfig.bg} border border-current/30`}
              >
                <PerfIcon className={`w-2.5 h-2.5 ${perfConfig.color}`} />

                <span className={`text-[9px] font-medium ${perfConfig.color}`}>
                  {perfConfig.label.split(" ")[0]}
                </span>
              </div>
            )}

            {isSelected && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-emerald-500/20 p-1 rounded-full"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Conteúdo inferior */}
        <div className="mt-3">
          <h3
            className={`font-bold text-base mb-1 transition-colors ${
              isSelected
                ? "text-white"
                : "text-slate-200 group-hover:text-white"
            }`}
          >
            {disciplina.label}
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <Grid3x3 className="w-3 h-3 text-slate-500" />
            <span className="text-slate-500">
              {count.toLocaleString("pt-BR")}{" "}
              {count === 1 ? "questão" : "questões"}
            </span>
          </div>
        </div>
      </div>

      {/* Indicador de seleção (barra inferior) */}
      {isSelected && (
        <motion.div
          layoutId="selectedBar"
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-b-2xl"
          transition={{ type: "spring", duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}
