"use client";

import { motion } from "framer-motion";
import { LucideIcon, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

interface StatBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: "emerald" | "rose" | "amber" | "blue" | "purple" | "cyan";
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  size?: "sm" | "md" | "lg";
}

export function StatBadge({
  icon: Icon,
  label,
  value,
  color,
  trend,
  trendValue,
  size = "md",
}: StatBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colors = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/20",
      hover: "hover:bg-emerald-500/20",
    },
    rose: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      text: "text-rose-400",
      glow: "shadow-rose-500/20",
      hover: "hover:bg-rose-500/20",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      glow: "shadow-amber-500/20",
      hover: "hover:bg-amber-500/20",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
      glow: "shadow-blue-500/20",
      hover: "hover:bg-blue-500/20",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-400",
      glow: "shadow-purple-500/20",
      hover: "hover:bg-purple-500/20",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      glow: "shadow-cyan-500/20",
      hover: "hover:bg-cyan-500/20",
    },
  };

  const sizes = {
    sm: {
      padding: "px-2 py-1.5",
      text: "text-[10px]",
      valueText: "text-xs",
      gap: "gap-1.5",
    },
    md: {
      padding: "px-3 py-2",
      text: "text-[10px]",
      valueText: "text-sm",
      gap: "gap-2",
    },
    lg: {
      padding: "px-4 py-2.5",
      text: "text-xs",
      valueText: "text-base",
      gap: "gap-2.5",
    },
  };

  const config = colors[color];
  const sizeConfig = sizes[size];

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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative flex items-center ${sizeConfig.gap} ${sizeConfig.padding} rounded-xl
        ${config.bg} ${config.border} ${config.hover}
        transition-all duration-300
        ${isHovered ? `shadow-lg ${config.glow}` : ""}
      `}
    >
      {/* Ícone com animação */}
      <motion.div
        animate={
          isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.2 }}
        className={`p-1 rounded-lg ${config.bg}`}
      >
        <Icon className={`w-4 h-4 ${config.text}`} />
      </motion.div>

      <div>
        <p
          className={`${sizeConfig.text} uppercase tracking-wider text-slate-500`}
        >
          {label}
        </p>
        <div className="flex items-center gap-1.5">
          <p className={`${sizeConfig.valueText} font-bold ${config.text}`}>
            {value}
          </p>
          {trend && trendValue !== undefined && (
            <div
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${getTrendColor()} text-[9px] font-medium`}
            >
              {getTrendIcon()}
              <span>
                {trend === "up" ? "+" : trend === "down" ? "-" : ""}
                {Math.abs(trendValue)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Efeito de brilho no hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
        />
      )}
    </motion.div>
  );
}
