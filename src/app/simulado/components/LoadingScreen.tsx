"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Brain,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";

type ModoSimulado = "completo" | "turbo" | "adaptativo";

interface LoadingScreenProps {
  modo: ModoSimulado;
  analise?: {
    disciplinasCriticas: Array<{ disciplina: string; taxaErro: number }>;
    recomendacoes?: string[];
  };
  progresso?: number;
}

const MODOS_CONFIG = {
  completo: {
    titulo: "Preparando Simulado Completo",
    subtitulo: "Selecionando questões da banca CEBRASPE",
    cor: "from-blue-500 to-cyan-500",
    textCor: "text-blue-400",
    icon: Target,
  },
  turbo: {
    titulo: "Preparando Modo Turbo",
    subtitulo: "Selecionando questões para revisão rápida",
    cor: "from-amber-500 to-orange-500",
    textCor: "text-amber-400",
    icon: Zap,
  },
  adaptativo: {
    titulo: "IA Analisando seu Perfil",
    subtitulo: "Personalizando questões com base no seu histórico",
    cor: "from-purple-500 to-pink-500",
    textCor: "text-purple-400",
    icon: Brain,
  },
};

export function LoadingScreen({
  modo,
  analise,
  progresso = 0,
}: LoadingScreenProps) {
  const config = MODOS_CONFIG[modo];
  const isAdaptativo = modo === "adaptativo";
  const Icon = config.icon;
  const progressoPercentual = Math.min(100, Math.max(0, progresso));

  const mensagensCarregamento = [
    "Analisando seu desempenho...",
    "Selecionando questões ideais...",
    "Balanceando distribuição...",
    "Preparando simulado...",
    "Quase lá!",
  ];

  const mensagemIndex = Math.floor(
    (progressoPercentual / 100) * mensagensCarregamento.length,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="relative">
        {/* Efeito de glow */}
        <div
          className={`absolute -inset-4 bg-gradient-to-r ${config.cor} rounded-3xl blur-3xl opacity-20 animate-pulse`}
        />

        <GlassCard
          className="p-8 text-center max-w-md w-full relative overflow-hidden"
          glow={isAdaptativo ? "purple" : "blue"}
        >
          {/* Gradiente decorativo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-xl" />

          {/* Ícone decorativo de fundo */}
          <div className="absolute bottom-4 right-4 opacity-5">
            <Icon className="w-20 h-20" />
          </div>

          {/* Ícone principal animado */}
          <div className="relative mb-6 flex justify-center">
            <motion.div
              animate={
                isAdaptativo
                  ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }
                  : { rotate: 360 }
              }
              transition={
                isAdaptativo
                  ? { duration: 2, repeat: Infinity }
                  : { duration: 1.5, repeat: Infinity, ease: "linear" }
              }
              className={`p-4 rounded-2xl bg-gradient-to-br ${config.cor} shadow-2xl`}
            >
              {isAdaptativo ? (
                <Brain className="w-10 h-10 text-white" />
              ) : (
                <Loader2 className="w-10 h-10 text-white" />
              )}
            </motion.div>

            {/* Sparkles animados */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
          </div>

          {/* Título */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xl font-bold ${config.textCor} mb-2`}
          >
            {config.titulo}
          </motion.h2>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-sm mb-6"
          >
            {config.subtitulo}
          </motion.p>

          {/* Barra de progresso */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Carregando</span>
              <span className={`font-mono ${config.textCor}`}>
                {progressoPercentual}%
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressoPercentual}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full bg-gradient-to-r ${config.cor}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </motion.div>
            </div>
          </div>

          {/* Mensagem de carregamento */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-slate-500"
          >
            {mensagensCarregamento[mensagemIndex] || mensagensCarregamento[0]}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block w-4 text-left"
            >
              ...
            </motion.span>
          </motion.p>

          {/* Análise adaptativa (apenas para modo adaptativo) */}
          {isAdaptativo &&
            analise &&
            analise.disciplinasCriticas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-left space-y-3 p-4 rounded-xl bg-slate-800/30 border border-white/10"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-400" />
                  <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                    Pontos de atenção detectados
                  </p>
                </div>
                <ul className="space-y-2">
                  {analise.disciplinasCriticas.slice(0, 3).map((d, idx) => (
                    <motion.li
                      key={d.disciplina}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3 text-rose-400" />
                        {d.disciplina.replace(/_/g, " ")}
                      </span>
                      <span className="text-rose-400 font-mono">
                        {(d.taxaErro * 100).toFixed(0)}% erro
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {analise.recomendacoes && analise.recomendacoes[0] && (
                  <div className="mt-3 pt-2 border-t border-white/10">
                    <p className="text-[10px] text-blue-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {analise.recomendacoes[0]}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

          {/* Dica motivacional */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.8 }}
            className="text-[10px] text-slate-600 mt-6"
          >
            {isAdaptativo
              ? "🧠 A IA está selecionando as melhores questões para você"
              : "💡 Dica: Gerencie bem seu tempo durante o simulado"}
          </motion.p>
        </GlassCard>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
