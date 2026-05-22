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
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function TendenciaBadge({
  tendencia,
  valor,
  showLabel = false,
  size = "md",
}: TendenciaBadgeProps) {
  const sizes = {
    sm: { padding: "px-1.5 py-0.5", text: "text-[10px]", icon: "w-2.5 h-2.5" },
    md: { padding: "px-2 py-1", text: "text-xs", icon: "w-3 h-3" },
    lg: { padding: "px-2.5 py-1.5", text: "text-sm", icon: "w-3.5 h-3.5" },
  };

  const configs = {
    melhorou: {
      icon: ArrowUpRight,
      iconAlt: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/30",
      glow: "shadow-emerald-500/20",
      label: "Melhorou",
      prefixo: "+",
      descricao: "melhor que o anterior",
    },
    piorou: {
      icon: ArrowDownRight,
      iconAlt: TrendingDown,
      color: "text-rose-400",
      bg: "bg-rose-500/20",
      border: "border-rose-500/30",
      glow: "shadow-rose-500/20",
      label: "Piorou",
      prefixo: "",
      descricao: "pior que o anterior",
    },
    estavel: {
      icon: Minus,
      iconAlt: Minus,
      color: "text-slate-400",
      bg: "bg-slate-500/20",
      border: "border-slate-500/30",
      glow: "shadow-slate-500/20",
      label: "Estável",
      prefixo: "",
      descricao: "mesmo desempenho",
    },
  };

  const config = configs[tendencia];
  const Icon = config.icon;
  const sizeConfig = sizes[size];
  const valorAbsoluto = Math.abs(valor).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2, type: "spring" }}
      className={`relative inline-flex items-center gap-1.5 rounded-full ${sizeConfig.padding} ${config.bg} ${config.color} border ${config.border} transition-all duration-300 hover:shadow-lg ${config.glow}`}
    >
      {/* Efeito de brilho no hover */}
      <motion.div
        whileHover={{
          rotate:
            tendencia === "melhorou" ? -45 : tendencia === "piorou" ? 45 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <Icon className={`${sizeConfig.icon} transition-transform`} />
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
        {tendencia !== "estavel" && (
          <span className="text-[9px] ml-0.5">pts</span>
        )}
      </span>

      {/* Tooltip no hover (opcional) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-900 border border-white/10 text-[10px] text-slate-400 whitespace-nowrap pointer-events-none z-10"
      >
        {config.descricao}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-slate-900 border-r border-b border-white/10" />
      </motion.div>
    </motion.div>
  );
}
