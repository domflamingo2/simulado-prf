"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type Tendencia = "melhorou" | "piorou" | "estavel";

interface TendenciaBadgeProps {
  tendencia: Tendencia;
  valor: number;
  percentual?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "detailed";
}

export function TendenciaBadge({
  tendencia,
  valor,
  percentual,
  showLabel = false,
  size = "md",
  variant = "default",
}: TendenciaBadgeProps) {
  const sizes = {
    sm: { padding: "px-1.5 py-0.5", text: "text-[10px]", icon: "w-2.5 h-2.5" },
    md: { padding: "px-2.5 py-1.5", text: "text-xs", icon: "w-3 h-3" },
    lg: { padding: "px-3 py-2", text: "text-sm", icon: "w-3.5 h-3.5" },
  };

  const configs: Record<
    Tendencia,
    {
      icon: typeof TrendingUp | typeof Minus | typeof ArrowUpRight;
      iconAlt?: typeof TrendingUp | typeof TrendingDown;
      cor: string;
      bg: string;
      border: string;
      glow: string;
      label: string;
      prefixo: string;
      descricao: string;
      rotacao?: string;
    }
  > = {
    melhorou: {
      icon: ArrowUpRight,
      iconAlt: TrendingUp,
      cor: "text-emerald-400",
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/30",
      glow: "shadow-emerald-500/20",
      label: "Melhorou",
      prefixo: "+",
      descricao: "desempenho superior",
    },
    piorou: {
      icon: ArrowDownRight,
      iconAlt: TrendingDown,
      cor: "text-rose-400",
      bg: "bg-rose-500/20",
      border: "border-rose-500/30",
      glow: "shadow-rose-500/20",
      label: "Piorou",
      prefixo: "",
      descricao: "desempenho inferior",
      rotacao: "",
    },
    estavel: {
      icon: Minus,
      iconAlt: Minus,
      cor: "text-slate-400",
      bg: "bg-slate-500/20",
      border: "border-slate-500/30",
      glow: "shadow-slate-500/20",
      label: "Estável",
      prefixo: "",
      descricao: "mesmo desempenho",
    },
  };

  const config = configs[tendencia];
  const Icon =
    variant === "compact" ? config.iconAlt || config.icon : config.icon;
  const sizeConfig = sizes[size];
  const valorAbsoluto = Math.abs(valor).toFixed(1);
  const percentualAbsoluto =
    percentual !== undefined ? Math.abs(percentual).toFixed(1) : null;

  if (variant === "detailed") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg} border ${config.border}`}
      >
        <div className={`p-1 rounded-md ${config.bg}`}>
          <Icon className={`w-4 h-4 ${config.cor}`} />
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-bold ${config.cor}`}>
              {config.prefixo}
              {valorAbsoluto}
            </span>
            <span className="text-[10px] text-slate-500">pontos</span>
            {percentualAbsoluto && (
              <span className="text-[10px] text-slate-500">
                ({config.prefixo}
                {percentualAbsoluto}%)
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400">{config.descricao}</p>
        </div>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2, type: "spring" }}
        className={`inline-flex items-center gap-1 ${sizeConfig.padding} rounded-full ${config.bg} ${config.cor}`}
      >
        <Icon className={sizeConfig.icon} />
        <span className={sizeConfig.text}>
          {config.prefixo}
          {valorAbsoluto}
        </span>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, type: "spring" }}
      className={`inline-flex items-center gap-1.5 ${sizeConfig.padding} rounded-full ${config.bg} ${config.cor} border ${config.border} shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <motion.div
        animate={tendencia === "melhorou" ? { rotate: [0, -10, 0] } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Icon className={sizeConfig.icon} />
      </motion.div>
      <span className={`${sizeConfig.text} font-medium`}>
        {showLabel && (
          <span className="mr-1 opacity-70">
            {config.label}
            {tendencia !== "estavel" && " "}
          </span>
        )}
        {config.prefixo}
        {valorAbsoluto}
        {percentualAbsoluto && (
          <span className="text-[9px] ml-0.5 opacity-70">
            ({config.prefixo}
            {percentualAbsoluto}%)
          </span>
        )}
      </span>
    </motion.div>
  );
}
