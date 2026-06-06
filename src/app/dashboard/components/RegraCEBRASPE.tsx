"use client";

import { motion } from "framer-motion";
import {
  Clock,
  HelpCircle,
  LucideIcon,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";

const COLOR_MAP: Record<
  string,
  { bg: string; border: string; text: string; glow: string; icon: LucideIcon }
> = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    icon: TrendingUp,
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    glow: "shadow-rose-500/20",
    icon: TrendingDown,
  },
  slate: {
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    text: "text-slate-400",
    glow: "shadow-slate-500/20",
    icon: Minus,
  },
};

export function RegraCEBRASPE() {
  const items = [
    {
      label: "Acerto",
      value: "+1",
      colorKey: "emerald",
      desc: "Ganha 1 ponto",
      exemplo: "CERTA → pontuação aumenta",
    },
    {
      label: "Erro",
      value: "−1",
      colorKey: "rose",
      desc: "Perde 1 ponto",
      exemplo: "ERRADA → pontuação diminui",
    },
    {
      label: "Em branco",
      value: "0",
      colorKey: "slate",
      desc: "Não altera",
      exemplo: "Não respondeu → neutro",
    },
  ] as const;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="p-5 overflow-hidden group" variant="info">
        {/* Gradiente decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-200">
                Pontuação CEBRASPE
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Sistema de pontuação oficial da banca
              </p>
            </div>
          </div>

          {/* Ícone de ajuda */}
          <div className="relative group/help">
            <HelpCircle className="w-4 h-4 text-slate-500 cursor-help hover:text-slate-400 transition-colors" />
            <div className="absolute top-full right-0 mt-2 w-48 p-2 rounded-lg bg-slate-800 border border-white/10 text-[10px] text-slate-400 opacity-0 invisible group-hover/help:opacity-100 group-hover/help:visible transition-all duration-200 z-10">
              A pontuação final é a soma de acertos menos erros
            </div>
          </div>
        </div>

        {/* Itens com animação */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2.5"
        >
          {items.map((item) => {
            const colors = COLOR_MAP[item.colorKey];
            const Icon = colors.icon;

            return (
              <motion.div
                key={item.label}
                variants={itemVariants}
                whileHover={{ scale: 1.01, x: 4 }}
                className={`relative overflow-hidden rounded-xl ${colors.bg} border ${colors.border} p-3 transition-all duration-300 hover:shadow-lg ${colors.glow}`}
              >
                {/* Efeito de brilho no hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg ${colors.bg} border ${colors.border}`}
                    >
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${colors.text}`}
                        >
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-500 hidden sm:inline">
                          {item.exemplo}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 sm:hidden">
                        {item.exemplo}
                      </p>
                    </div>
                  </div>
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className={`font-black text-2xl ${colors.text} tabular-nums`}
                  >
                    {item.value}
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Fórmula da pontuação */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 rounded-lg bg-slate-800/30 border border-white/5 text-center"
        >
          <p className="text-[11px] text-slate-400">
            <span className="font-semibold text-blue-400">Fórmula:</span>{" "}
            Pontuação = <span className="text-emerald-400">Acertos</span> -{" "}
            <span className="text-rose-400">Erros</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-1.5">
            ⚠️ Questões em branco não impactam a pontuação final
          </p>
        </motion.div>

        {/* Barra decorativa */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        />
      </GlassCard>
    </motion.div>
  );
}
