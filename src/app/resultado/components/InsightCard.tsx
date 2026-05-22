"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Brain,
  ChevronRight,
  Lightbulb,
  Sparkles,
  Trophy,
} from "lucide-react";

interface InsightCardProps {
  id: string;
  tipo: "positivo" | "alerta" | "dica";
  mensagem: string;
  acao?: string;
  onAcao?: () => void;
}

export function InsightCard({
  id,
  tipo,
  mensagem,
  acao,
  onAcao,
}: InsightCardProps) {
  const configs = {
    positivo: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      iconBg: "bg-emerald-500/20",
      icon: Trophy,
      iconDecor: Sparkles,
      text: "text-emerald-400",
      hover: "hover:border-emerald-500/50",
    },
    alerta: {
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      iconBg: "bg-rose-500/20",
      icon: AlertTriangle,
      iconDecor: AlertTriangle,
      text: "text-rose-400",
      hover: "hover:border-rose-500/50",
    },
    dica: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      iconBg: "bg-blue-500/20",
      icon: Brain,
      iconDecor: Lightbulb,
      text: "text-blue-400",
      hover: "hover:border-blue-500/50",
    },
  };

  const config = configs[tipo];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-xl bg-gradient-to-r ${config.bg} border ${config.border} ${config.hover} transition-all duration-300 flex items-start gap-3 shadow-lg`}
    >
      <div className={`p-2 rounded-lg ${config.iconBg} flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${config.text}`} />
      </div>
      <div className="flex-1">
        <p className={`text-sm ${config.text} leading-relaxed`}>{mensagem}</p>
        {acao && onAcao && (
          <button
            onClick={onAcao}
            className="mt-2 text-xs font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1 group"
          >
            {acao}
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
