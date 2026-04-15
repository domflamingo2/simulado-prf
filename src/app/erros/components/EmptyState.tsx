"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Play, TrendingUp } from "lucide-react";
import Link from "next/link";

import { GlassCard } from "@/components/ui/GlassCard";

interface EmptyStateProps {
  tipo: "sem-simulados" | "sem-erros";
}

export function EmptyState({ tipo }: EmptyStateProps) {
  const configs = {
    "sem-simulados": {
      icon: AlertCircle,
      titulo: "Nenhum simulado encontrado",
      descricao:
        "Faça pelo menos um simulado completo para gerar um histórico de erros.",
      acao: { href: "/simulado", label: "Iniciar Simulado", icon: Play },
    },
    "sem-erros": {
      icon: CheckCircle2,
      titulo: "Parabéns! 🎉",
      descricao:
        "Você não tem erros registrados. Seu desempenho está excelente! Continue assim.",
      acao: {
        href: "/estatisticas",
        label: "Ver Estatísticas",
        icon: TrendingUp,
      },
    },
  };

  const config = configs[tipo];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] p-6"
    >
      <GlassCard className="p-12 text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <config.icon className="w-20 h-20 text-slate-500 mx-auto mb-6" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-3">{config.titulo}</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          {config.descricao}
        </p>
        <Link
          href={config.acao.href}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
        >
          <config.acao.icon className="w-5 h-5" />
          {config.acao.label}
        </Link>
      </GlassCard>
    </motion.div>
  );
}
