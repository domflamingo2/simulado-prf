"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { DISCIPLINAS_NOME } from "@/constants/disciplinas";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <GlassCard className="p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          Desempenho por Disciplina
        </h2>

        <div className="space-y-4">
          {disciplinasOrdenadas.map(([disciplina, dados], idx) => (
            <DisciplinaBar
              key={disciplina}
              nome={DISCIPLINAS_NOME[disciplina] || disciplina}
              acertos={dados.acertos}
              total={dados.total}
              percentual={(dados.acertos / dados.total) * 100}
              delay={0.9 + idx * 0.05}
            />
          ))}
        </div>

        {disciplinasOrdenadas.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <p>Nenhuma questão registrada por disciplina.</p>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
