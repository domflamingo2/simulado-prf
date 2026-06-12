"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

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
}: DisciplinaBarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const erros = total - acertos;

  const getColor = (pct: number) => {
    if (pct >= 80) return "from-emerald-500 to-emerald-400";
    if (pct >= 70) return "from-emerald-500 to-green-500";
    if (pct >= 60) return "from-amber-500 to-yellow-500";
    if (pct >= 50) return "from-orange-500 to-amber-500";
    if (pct >= 40) return "from-orange-500 to-red-500";
    return "from-rose-500 to-red-500";
  };

  const getBgColor = (pct: number) => {
    if (pct >= 70) return "bg-emerald-500/20";
    if (pct >= 60) return "bg-amber-500/20";
    if (pct >= 40) return "bg-orange-500/20";
    return "bg-rose-500/20";
  };

  const getStatusIcon = () => {
    if (percentual >= 70)
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    if (percentual >= 50)
      return <TrendingUp className="w-3.5 h-3.5 text-amber-400" />;
    return <TrendingDown className="w-3.5 h-3.5 text-rose-400" />;
  };

  const getStatusText = () => {
    if (percentual >= 70) return "Bom";
    if (percentual >= 50) return "Regular";
    return "Atenção";
  };

  const gradientColor = getColor(percentual);
  const bgColor = getBgColor(percentual);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Card com efeito glass */}
      <div
        className={`relative rounded-xl transition-all duration-300 ${isHovered ? "bg-slate-800/60" : "bg-slate-800/40"} backdrop-blur-sm border border-white/10 hover:border-white/20`}
      >
        <div className="p-3">
          {/* Header com nome e status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={`w-1.5 h-1.5 rounded-full ${gradientColor.split(" ")[0].replace("from-", "bg-")}`}
              />
              <span className="text-sm font-medium text-slate-200 truncate">
                {nome}
              </span>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-1.5">
              <div
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${bgColor} backdrop-blur-sm`}
              >
                <span className="flex items-center gap-1">
                  {getStatusIcon()}
                  {getStatusText()}
                </span>
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentual}%` }}
                    transition={{
                      delay: delay + 0.2,
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={`h-full rounded-full bg-gradient-to-r ${gradientColor} relative`}
                  >
                    {/* Efeito de brilho animado */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: "-100%" }}
                        animate={{ opacity: 1, x: "100%" }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Percentual */}
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.3, duration: 0.3 }}
                className={`text-sm font-bold min-w-[45px] text-right ${
                  percentual >= 70
                    ? "text-emerald-400"
                    : percentual >= 50
                      ? "text-amber-400"
                      : "text-rose-400"
                }`}
              >
                {percentual.toFixed(0)}%
              </motion.span>
            </div>
          </div>

          {/* Stats com acertos/erros */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-500">Acertos</span>
                <span className="font-semibold text-emerald-400">
                  {acertos}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-slate-500">Erros</span>
                <span className="font-semibold text-rose-400">{erros}</span>
              </div>
            </div>

            {/* Total */}
            <div className="text-xs text-slate-500">
              Total:{" "}
              <span className="font-semibold text-slate-300">{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip personalizado no hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-12 right-4 z-10 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 shadow-xl text-xs whitespace-nowrap"
        >
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Taxa de acerto:</span>
            <span
              className={`font-bold ${
                percentual >= 70
                  ? "text-emerald-400"
                  : percentual >= 50
                    ? "text-amber-400"
                    : "text-rose-400"
              }`}
            >
              {percentual.toFixed(1)}%
            </span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-slate-900 border-r border-b border-white/10" />
        </motion.div>
      )}
    </motion.div>
  );
}
