"use client";

import { motion } from "framer-motion";
import {
  Award,
  BarChart3,
  ChevronRight,
  Target,
  TrendingUp,
} from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { DISCIPLINAS_NOME } from "@/constants/disciplinas";
1;

import { DisciplinaBar } from "./DisciplinaBar";

interface DisciplinasDesempenhoProps {
  desempenhoPorDisciplina: Record<string, { acertos: number; total: number }>;
}

export function DisciplinasDesempenho({
  desempenhoPorDisciplina,
}: DisciplinasDesempenhoProps) {
  const disciplinasOrdenadas = Object.entries(desempenhoPorDisciplina)
    .filter(([, dados]) => dados.total > 0)
    .sort(([, a], [, b]) => b.acertos / b.total - a.acertos / a.total);

  const totalAcertos = disciplinasOrdenadas.reduce(
    (sum, [, dados]) => sum + dados.acertos,
    0,
  );
  const totalQuestoes = disciplinasOrdenadas.reduce(
    (sum, [, dados]) => sum + dados.total,
    0,
  );
  const mediaGeral =
    totalQuestoes > 0 ? (totalAcertos / totalQuestoes) * 100 : 0;

  // Contar disciplinas com bom desempenho (>70%)
  const disciplinasBoas = disciplinasOrdenadas.filter(
    ([, dados]) => (dados.acertos / dados.total) * 100 >= 70,
  ).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.8,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mb-8"
    >
      <GlassCard className="p-6 overflow-hidden">
        {/* Header com gradiente */}
        <motion.div variants={headerVariants} className="relative mb-6">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Desempenho por Disciplina
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Análise detalhada de acertos por matéria
                </p>
              </div>
            </div>

            {/* Resumo rápido */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-white/10">
                <span className="text-xs text-slate-400">Média Geral</span>
                <span
                  className={`ml-2 text-sm font-bold ${
                    mediaGeral >= 70
                      ? "text-emerald-400"
                      : mediaGeral >= 50
                        ? "text-amber-400"
                        : "text-rose-400"
                  }`}
                >
                  {mediaGeral.toFixed(1)}%
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-white/10">
                <span className="text-xs text-slate-400">Total</span>
                <span className="ml-2 text-sm font-bold text-white">
                  {totalQuestoes} questões
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cards de estatísticas rápidas */}
        <motion.div
          variants={headerVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Disciplinas Boas</span>
            </div>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {disciplinasBoas}
              <span className="text-xs text-slate-500 ml-1">
                / {disciplinasOrdenadas.length}
              </span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">Total Acertos</span>
            </div>
            <p className="text-xl font-bold text-blue-400 mt-1">
              {totalAcertos}
              <span className="text-xs text-slate-500 ml-1">
                / {totalQuestoes}
              </span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400">Taxa de Acerto</span>
            </div>
            <p
              className={`text-xl font-bold mt-1 ${
                mediaGeral >= 70
                  ? "text-emerald-400"
                  : mediaGeral >= 50
                    ? "text-amber-400"
                    : "text-rose-400"
              }`}
            >
              {mediaGeral.toFixed(1)}%
            </p>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400">Melhor Disciplina</span>
            </div>
            <p className="text-sm font-bold text-amber-400 mt-1 truncate">
              {disciplinasOrdenadas[0]?.[0]
                ? (
                    DISCIPLINAS_NOME[disciplinasOrdenadas[0][0]] ||
                    disciplinasOrdenadas[0][0]
                  ).split(" ")[0]
                : "-"}
            </p>
          </div>
        </motion.div>

        {/* Título da lista */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <span className="text-sm font-medium text-slate-300">
            Ranking por Desempenho
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            Melhor → Pior
          </span>
        </div>

        {/* Lista de disciplinas */}
        <div className="space-y-3">
          {disciplinasOrdenadas.length > 0 ? (
            disciplinasOrdenadas.map(([disciplina, dados], idx) => {
              const percentual = (dados.acertos / dados.total) * 100;
              const tendencia =
                percentual >= 70 ? "up" : percentual >= 50 ? "stable" : "down";

              return (
                <DisciplinaBar
                  key={disciplina}
                  nome={DISCIPLINAS_NOME[disciplina] || disciplina}
                  acertos={dados.acertos}
                  total={dados.total}
                  percentual={percentual}
                  delay={0.9 + idx * 0.05}
                  tendencia={tendencia as "up" | "down" | "stable"}
                />
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400">
                Nenhuma questão registrada por disciplina.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Complete um simulado para ver seu desempenho detalhado.
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer com dica */}
        {disciplinasOrdenadas.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 pt-4 border-t border-white/10"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-500">Excelente (≥70%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-slate-500">Regular (50-69%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-slate-500">Atenção (&lt;50%)</span>
                </div>
              </div>
              <p className="text-slate-500">
                💡 Foque nas disciplinas com menor desempenho
              </p>
            </div>
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
}
