"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { QuestaoRespondida } from "@/data/index";

import { MiniQuestaoDot } from "./MiniQuestaoDot";

interface NavegacaoQuestoesProps {
  questoes: QuestaoRespondida[];
  questaoRealIndex: number;
  marcadas: number[];
  onQuestaoClick: (questao: QuestaoRespondida, index: number) => void;
}

export function NavegacaoQuestoes({
  questoes,
  questaoRealIndex,
  marcadas,
  onQuestaoClick,
}: NavegacaoQuestoesProps) {
  return (
    <GlassCard className="p-4">
      <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider">
        Navegação rápida
      </p>
      <div className="grid grid-cols-5 gap-2">
        {questoes.map((q, idx) => (
          <MiniQuestaoDot
            key={idx}
            questao={q}
            index={idx}
            atual={idx === questaoRealIndex}
            marcada={marcadas.includes(idx)}
            onClick={() => onQuestaoClick(q, idx)}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" /> Acerto
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-rose-500" /> Erro
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-slate-600" /> Branco
        </span>
      </div>
    </GlassCard>
  );
}
