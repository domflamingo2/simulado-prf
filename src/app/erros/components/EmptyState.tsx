"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Play,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { GlassCard } from "@/components/ui/GlassCard";

interface EmptyStateProps {
  tipo: "sem-simulados" | "sem-erros";
}

export function EmptyState({ tipo }: EmptyStateProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isSemSimulados = tipo === "sem-simulados";

  const configs = {
    "sem-simulados": {
      icon: AlertCircle,
      iconDecor: Target,
      titulo: "Nenhum simulado encontrado",
      descricao:
        "Faça pelo menos um simulado completo para gerar um histórico de erros e acompanhar seu desempenho.",
      acao: { href: "/simulado", label: "Iniciar Simulado", icon: Play },
      cor: "from-blue-500 to-purple-600",
      bgCor: "bg-blue-500/10",
      borderCor: "border-blue-500/30",
      emoji: "🎯",
    },
    "sem-erros": {
      icon: CheckCircle2,
      iconDecor: Sparkles,
      titulo: "Parabéns! 🎉",
      descricao:
        "Você não tem erros registrados. Seu desempenho está excelente! Continue assim e mantenha o foco.",
      acao: {
        href: "/estatisticas",
        label: "Ver Estatísticas",
        icon: TrendingUp,
      },
      cor: "from-emerald-500 to-teal-600",
      bgCor: "bg-emerald-500/10",
      borderCor: "border-emerald-500/30",
      emoji: "🏆",
    },
  };

  const config = configs[tipo];
  const Icon = config.icon;
  const DecorIcon = config.iconDecor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex flex-col items-center justify-center min-h-[60vh] p-6"
    >
      <div className="relative">
        {/* Efeito de glow */}
        <div
          className={`absolute -inset-4 ${config.bgCor} rounded-full blur-3xl opacity-50`}
        />

        <GlassCard className="relative p-8 sm:p-12 text-center max-w-md overflow-hidden">
          {/* Gradiente decorativo */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-xl" />

          {/* Ícone decorativo de fundo */}
          <DecorIcon className="absolute bottom-4 right-4 w-16 h-16 text-slate-700/20" />

          {/* Ícone principal animado */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
            className="relative mb-6 flex justify-center"
          >
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.cor} blur-2xl opacity-30`}
            />
            <div
              className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${config.cor} flex items-center justify-center shadow-2xl`}
            >
              <Icon className="w-12 h-12 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 text-2xl"
            >
              {config.emoji}
            </motion.div>
          </motion.div>

          {/* Título */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-3"
          >
            {config.titulo}
          </motion.h2>

          {/* Descrição */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 mb-8 leading-relaxed"
          >
            {config.descricao}
          </motion.p>

          {/* Dicas adicionais (apenas para sem-simulados) */}
          {isSemSimulados && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mb-6 p-3 rounded-lg bg-slate-800/30 border border-white/5 text-left"
            >
              <p className="text-[11px] text-slate-500 flex items-center gap-2">
                <BookOpen className="w-3 h-3" />
                💡 Dica: Simule o ambiente real da prova CEBRASPE com 60
                questões e 4 horas de duração
              </p>
            </motion.div>
          )}

          {/* Botão de ação */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link
              href={config.acao.href}
              className={`group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden shadow-lg ${
                isSemSimulados
                  ? "shadow-blue-500/25 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                  : "shadow-emerald-500/25 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400"
              }`}
            >
              {/* Efeito de brilho */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <config.acao.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{config.acao.label}</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          </motion.div>

          {/* Texto de apoio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="text-[10px] text-slate-600 mt-4"
          >
            {isSemSimulados
              ? "⏱️ Simule agora e comece a acompanhar seus resultados"
              : "📊 Continue estudando para manter seu desempenho"}
          </motion.p>
        </GlassCard>
      </div>
    </motion.div>
  );
}
