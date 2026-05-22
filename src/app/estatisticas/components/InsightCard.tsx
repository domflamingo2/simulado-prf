"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Brain,
  ChevronRight,
  Lightbulb,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface InsightCardProps {
  id: string;
  tipo: "positivo" | "alerta" | "dica" | "info";
  mensagem: string;
  acao?: string;
  onAcao?: () => void;
  destaque?: boolean;
}

export function InsightCard({
  id,
  tipo,
  mensagem,
  acao,
  onAcao,
  destaque = false,
}: InsightCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const configs = {
    positivo: {
      bg: "from-emerald-500/15 to-emerald-600/10",
      border: "border-emerald-500/30",
      iconBg: "bg-emerald-500/20",
      icon: Trophy,
      iconDecor: Sparkles,
      text: "text-emerald-400",
      textStrong: "text-emerald-300",
      glow: "shadow-emerald-500/20",
      titulo: "Ponto Forte",
      mensagemIcon: "🏆",
    },
    alerta: {
      bg: "from-rose-500/15 to-red-600/10",
      border: "border-rose-500/30",
      iconBg: "bg-rose-500/20",
      icon: AlertTriangle,
      iconDecor: TrendingUp,
      text: "text-rose-400",
      textStrong: "text-rose-300",
      glow: "shadow-rose-500/20",
      titulo: "Atenção",
      mensagemIcon: "⚠️",
    },
    dica: {
      bg: "from-blue-500/15 to-purple-600/10",
      border: "border-blue-500/30",
      iconBg: "bg-blue-500/20",
      icon: Brain,
      iconDecor: Lightbulb,
      text: "text-blue-400",
      textStrong: "text-blue-300",
      glow: "shadow-blue-500/20",
      titulo: "Dica",
      mensagemIcon: "💡",
    },
    info: {
      bg: "from-purple-500/15 to-pink-600/10",
      border: "border-purple-500/30",
      iconBg: "bg-purple-500/20",
      icon: Zap,
      iconDecor: Star,
      text: "text-purple-400",
      textStrong: "text-purple-300",
      glow: "shadow-purple-500/20",
      titulo: "Info",
      mensagemIcon: "ℹ️",
    },
  };

  const config = configs[tipo];
  const Icon = config.icon;
  const DecorIcon = config.iconDecor;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: destaque ? 1.01 : 1, y: -2 }}
      transition={{ duration: 0.3, type: "spring" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group ${destaque ? "col-span-full" : ""}`}
    >
      {/* Efeito de glow no hover */}
      {isHovered && (
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r ${config.bg} rounded-xl blur-xl opacity-50 transition-opacity duration-300 ${config.glow}`}
        />
      )}

      {/* Card principal */}
      <div
        className={`relative p-4 rounded-xl bg-gradient-to-br ${config.bg} backdrop-blur-sm border ${config.border} transition-all duration-300 ${isHovered ? "shadow-lg" : ""}`}
      >
        <div className="flex items-start gap-3">
          {/* Ícone com círculo decorativo */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center transition-all duration-300 ${isHovered ? "scale-110" : ""}`}
            >
              <Icon className={`w-5 h-5 ${config.text}`} />
            </div>
            {tipo === "positivo" && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3"
              >
                <DecorIcon className="w-3 h-3 text-yellow-400" />
              </motion.div>
            )}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            {/* Título do insight */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {config.titulo}
              </span>
              {destaque && (
                <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-[9px] font-bold text-amber-400">
                  Destaque
                </span>
              )}
              <span className="text-sm ml-auto opacity-50">
                {config.mensagemIcon}
              </span>
            </div>

            {/* Mensagem */}
            <p className={`text-sm ${config.textStrong} leading-relaxed`}>
              {mensagem}
            </p>

            {/* Botão de ação */}
            {acao && onAcao && (
              <motion.button
                initial={false}
                animate={{ x: isHovered ? 4 : 0 }}
                onClick={onAcao}
                className={`mt-3 text-xs font-medium ${config.text} hover:underline flex items-center gap-1 transition-all group/btn`}
              >
                <span>{acao}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            )}
          </div>

          {/* Ícone decorativo de fundo */}
          <DecorIcon
            className={`absolute bottom-2 right-2 w-12 h-12 opacity-5 ${config.text}`}
          />
        </div>

        {/* Barra decorativa inferior */}
        {isHovered && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.bg} rounded-full`}
          />
        )}
      </div>
    </motion.div>
  );
}
