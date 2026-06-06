"use client";

import { motion } from "framer-motion";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

interface DisciplinaBarProps {
  nome: string;
  acertos: number;
  total: number;
  percentual: number;
  delay: number;
  tendencia?: "up" | "down" | "stable";
}

export function DisciplinaBar({
  nome,
  acertos,
  total,
  percentual,
  delay,
  tendencia = "stable",
}: DisciplinaBarProps) {
  const getConfig = (pct: number) => {
    if (pct >= 80)
      return {
        cor: "bg-gradient-to-r from-emerald-500 to-emerald-400",
        texto: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
      };
    if (pct >= 70)
      return {
        cor: "bg-gradient-to-r from-emerald-500 to-green-500",
        texto: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
      };
    if (pct >= 60)
      return {
        cor: "bg-gradient-to-r from-blue-500 to-cyan-500",
        texto: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
      };
    if (pct >= 50)
      return {
        cor: "bg-gradient-to-r from-amber-500 to-yellow-500",
        texto: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
      };
    if (pct >= 40)
      return {
        cor: "bg-gradient-to-r from-orange-500 to-amber-500",
        texto: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
      };
    return {
      cor: "bg-gradient-to-r from-rose-500 to-red-500",
      texto: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
    };
  };

  const config = getConfig(percentual);
  const erros = total - acertos;
  const isGood = percentual >= 70;
  const isWarning = percentual >= 40 && percentual < 70;

  const getTendenciaIcon = () => {
    switch (tendencia) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-rose-400" />;
      default:
        return <Minus className="w-3 h-3 text-slate-400" />;
    }
  };

  const getStatusText = () => {
    if (isGood) return "Bom";
    if (isWarning) return "Regular";
    return "Atenção";
  };

  const getStatusColor = () => {
    if (isGood) return "text-emerald-400";
    if (isWarning) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ x: 4 }}
      className="group"
    >
      <div className="relative p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-300 border border-white/5 hover:border-white/10">
        {/* Header com nome e status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${config.cor.split(" ")[1]}`}
            />
            <span className="text-sm font-medium text-slate-200 truncate max-w-[150px] sm:max-w-[200px]">
              {nome}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {getTendenciaIcon()}
              <span className={`text-[10px] font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentual}%` }}
                transition={{
                  delay: delay + 0.15,
                  duration: 0.8,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className={`h-full rounded-full ${config.cor} relative`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </motion.div>
            </div>
          </div>
          <div className="flex items-center gap-2 min-w-[80px] justify-end">
            <span className={`text-sm font-bold tabular-nums ${config.texto}`}>
              {percentual.toFixed(0)}%
            </span>
            <span className="text-xs text-slate-500 tabular-nums">
              {acertos}/{total}
            </span>
          </div>
        </div>

        {/* Stats de acertos/erros */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-slate-500">Acertos</span>
              <span className="font-semibold text-emerald-400">{acertos}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span className="text-slate-500">Erros</span>
              <span className="font-semibold text-rose-400">{erros}</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500">
            {percentual.toFixed(0)}% de aproveitamento
          </div>
        </div>

        {/* Barra de micro detalhes (acertos vs erros) */}
        <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentual}%` }}
            transition={{ delay: delay + 0.3, duration: 0.6 }}
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${100 - percentual}%` }}
            transition={{ delay: delay + 0.35, duration: 0.6 }}
            className="h-full bg-gradient-to-r from-rose-500 to-red-500"
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </motion.div>
  );
}
