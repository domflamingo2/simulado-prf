"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, AlertCircle, XCircle, Flag, Sparkles, Target } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";

type FiltroRevisao = "todas" | "erros" | "acertos" | "brancos" | "marcadas";

interface EmptyStateProps {
  tipo: FiltroRevisao;
  onResetFiltro?: () => void;
}

export function EmptyState({ tipo, onResetFiltro }: EmptyStateProps) {
  const configs = {
    todas: {
      icon: BookOpen,
      iconBg: "from-slate-500/20 to-slate-600/10",
      iconColor: "text-slate-400",
      title: "Nenhuma questão encontrada",
      mensagem: "Nenhuma questão corresponde aos filtros selecionados.",
      emoji: "📚",
      action: "Limpar filtros",
    },
    erros: {
      icon: XCircle,
      iconBg: "from-emerald-500/20 to-emerald-600/10",
      iconColor: "text-emerald-400",
      title: "Parabéns! 🎉",
      mensagem: "Você não errou nenhuma questão neste simulado!",
      emoji: "🏆",
      action: "Ver acertos",
    },
    acertos: {
      icon: CheckCircle2,
      iconBg: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-400",
      title: "Nenhum acerto ainda",
      mensagem: "Você ainda não acertou nenhuma questão. Continue estudando!",
      emoji: "💪",
      action: "Começar simulado",
    },
    brancos: {
      icon: AlertCircle,
      iconBg: "from-amber-500/20 to-amber-600/10",
      iconColor: "text-amber-400",
      title: "Questões respondidas!",
      mensagem: "Você respondeu todas as questões do simulado!",
      emoji: "✅",
      action: "Ver respostas",
    },
    marcadas: {
      icon: Flag,
      iconBg: "from-purple-500/20 to-purple-600/10",
      iconColor: "text-purple-400",
      title: "Nenhuma questão marcada",
      mensagem: "Nenhuma questão foi marcada para revisão ainda.",
      emoji: "🏷️",
      action: "Voltar para questões",
    },
  };

  const config = configs[tipo];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="flex flex-col items-center justify-center min-h-[40vh] p-4"
    >
      <GlassCard className="p-8 text-center max-w-md overflow-hidden relative group">
        {/* Gradiente decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-xl" />

        {/* Ícone decorativo de fundo */}
        <div className="absolute bottom-4 right-4 opacity-5">
          <Icon className="w-16 h-16" />
        </div>

        {/* Ícone principal animado */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
          className="relative mb-6 flex justify-center"
        >
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.iconBg} blur-2xl opacity-50`} />
          <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${config.iconBg} flex items-center justify-center shadow-2xl`}>
            <Icon className={`w-10 h-10 ${config.iconColor}`} />
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
          className="text-xl font-bold text-white mb-2"
        >
          {config.title}
        </motion.h2>

        {/* Mensagem */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-sm leading-relaxed mb-6"
        >
          {config.mensagem}
        </motion.p>

        {/* Dica adicional */}
        {tipo === "todas" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mb-4 p-2 rounded-lg bg-slate-800/30 text-[10px] text-slate-500"
          >
            💡 Tente ajustar os filtros de busca ou disciplina
          </motion.div>
        )}

        {tipo === "erros" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mb-4 flex items-center justify-center gap-2 text-[10px] text-emerald-400"
          >
            <Sparkles className="w-3 h-3" />
            <span>Parabéns pelo desempenho!</span>
          </motion.div>
        )}

        {/* Botão de ação */}
        {onResetFiltro && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onResetFiltro}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium transition-all shadow-lg shadow-blue-500/25"
          >
            <Target className="w-4 h-4" />
            {config.action}
          </motion.button>
        )}
      </GlassCard>
    </motion.div>
  );
}