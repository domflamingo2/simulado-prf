"use client";

import { motion } from "framer-motion";
import { LucideIcon, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  cor: "emerald" | "rose" | "amber" | "blue" | "purple" | "cyan" | "indigo";
  delay?: number;
  subtitulo?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  description?: string;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  cor,
  delay = 0,
  subtitulo,
  trend,
  trendValue,
  description,
}: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cores: Record<
    string,
    { bg: string; border: string; text: string; glow: string; iconBg: string }
  > = {
    emerald: {
      bg: "from-emerald-500/20 via-emerald-500/10 to-emerald-600/5",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/20",
      iconBg: "bg-emerald-500/20",
    },
    rose: {
      bg: "from-rose-500/20 via-rose-500/10 to-rose-600/5",
      border: "border-rose-500/30",
      text: "text-rose-400",
      glow: "shadow-rose-500/20",
      iconBg: "bg-rose-500/20",
    },
    amber: {
      bg: "from-amber-500/20 via-amber-500/10 to-amber-600/5",
      border: "border-amber-500/30",
      text: "text-amber-400",
      glow: "shadow-amber-500/20",
      iconBg: "bg-amber-500/20",
    },
    blue: {
      bg: "from-blue-500/20 via-blue-500/10 to-blue-600/5",
      border: "border-blue-500/30",
      text: "text-blue-400",
      glow: "shadow-blue-500/20",
      iconBg: "bg-blue-500/20",
    },
    purple: {
      bg: "from-purple-500/20 via-purple-500/10 to-purple-600/5",
      border: "border-purple-500/30",
      text: "text-purple-400",
      glow: "shadow-purple-500/20",
      iconBg: "bg-purple-500/20",
    },
    cyan: {
      bg: "from-cyan-500/20 via-cyan-500/10 to-cyan-600/5",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      glow: "shadow-cyan-500/20",
      iconBg: "bg-cyan-500/20",
    },
    indigo: {
      bg: "from-indigo-500/20 via-indigo-500/10 to-indigo-600/5",
      border: "border-indigo-500/30",
      text: "text-indigo-400",
      glow: "shadow-indigo-500/20",
      iconBg: "bg-indigo-500/20",
    },
  };

  const config = cores[cor];

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-rose-400" />;
      default:
        return <Minus className="w-3 h-3 text-slate-400" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return "";
    switch (trend) {
      case "up":
        return "text-emerald-400 bg-emerald-500/10";
      case "down":
        return "text-rose-400 bg-rose-500/10";
      default:
        return "text-slate-400 bg-slate-500/10";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ delay, duration: 0.4, type: "spring" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.bg} backdrop-blur-sm border ${config.border} transition-all duration-300 ${isHovered ? `shadow-lg ${config.glow}` : ""}`}
    >
      {/* Efeito de brilho no hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        />
      )}

      {/* Ícone decorativo de fundo */}
      <div className="absolute -top-4 -right-4 opacity-10">
        <Icon className="w-16 h-16" />
      </div>

      {/* Conteúdo principal */}
      <div className="relative p-4 sm:p-5">
        {/* Header com ícone */}
        <div className="flex items-start justify-between mb-3">
          <div
            className={`p-2 rounded-xl ${config.iconBg} backdrop-blur-sm transition-all duration-300 ${isHovered ? "scale-110" : ""}`}
          >
            <Icon className={`w-4 h-4 ${config.text}`} />
          </div>

          {/* Badge de tendência */}
          {trend && trendValue !== undefined && (
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${getTrendColor()} text-xs font-medium`}
            >
              {getTrendIcon()}
              <span>
                {trend === "up" ? "+" : trend === "down" ? "-" : ""}
                {trendValue}%
              </span>
            </div>
          )}
        </div>

        {/* Valor */}
        <div className="mb-1">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.1, type: "spring" }}
            className={`text-2xl sm:text-3xl font-bold ${config.text} tracking-tight`}
          >
            {value}
          </motion.div>
        </div>

        {/* Label */}
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
          {label}
        </div>

        {/* Subtítulo */}
        {subtitulo && (
          <p className="text-[10px] text-slate-500 mt-1">{subtitulo}</p>
        )}

        {/* Descrição opcional */}
        {description && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-[9px] text-slate-500"
          >
            {description}
          </motion.div>
        )}
      </div>

      {/* Barra de progresso animada na parte inferior */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
      />
    </motion.div>
  );
}
