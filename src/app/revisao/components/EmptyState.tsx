"use client";

import { BookOpen } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";

type FiltroRevisao = "todas" | "erros" | "acertos" | "brancos" | "marcadas";

interface EmptyStateProps {
  tipo: FiltroRevisao;
}

export function EmptyState({ tipo }: EmptyStateProps) {
  const mensagens = {
    todas: "Nenhuma questão encontrada.",
    erros: "Parabéns! Você não errou nenhuma questão neste simulado.",
    acertos: "Você ainda não acertou nenhuma questão. Continue estudando!",
    brancos: "Você respondeu todas as questões!",
    marcadas: "Nenhuma questão marcada para revisão.",
  };

  return (
    <GlassCard className="p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
        <BookOpen className="w-8 h-8 text-slate-500" />
      </div>
      <p className="text-slate-400">{mensagens[tipo]}</p>
    </GlassCard>
  );
}
