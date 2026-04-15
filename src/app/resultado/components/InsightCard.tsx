"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Brain, ChevronRight, Trophy } from "lucide-react";

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
      bg: "bg-emerald-500/10 border-emerald-500/30",
      icon: Trophy,
      text: "text-emerald-400",
    },
    alerta: {
      bg: "bg-rose-500/10 border-rose-500/30",
      icon: AlertTriangle,
      text: "text-rose-400",
    },
    dica: {
      bg: "bg-blue-500/10 border-blue-500/30",
      icon: Brain,
      text: "text-blue-400",
    },
  };

  const config = configs[tipo];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${config.bg} flex items-start gap-3`}
    >
      <config.icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`text-sm ${config.text}`}>{mensagem}</p>
        {acao && onAcao && (
          <button
            onClick={onAcao}
            className="mt-2 text-xs font-medium text-white hover:underline flex items-center gap-1 transition-colors"
          >
            {acao} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
