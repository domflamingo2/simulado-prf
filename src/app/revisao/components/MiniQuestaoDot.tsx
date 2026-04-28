"use client";

import { QuestaoRespondida } from "@/data/index";

interface MiniQuestaoDotProps {
  questao: QuestaoRespondida;
  index: number;
  atual: boolean;
  onClick: () => void;
  marcada: boolean;
}

export function MiniQuestaoDot({
  questao,
  index,
  atual,
  onClick,
  marcada,
}: MiniQuestaoDotProps) {
  const getStatus = () => {
    if (!questao.respostaUsuario) return "branco";
    return questao.respostaUsuario === questao.resposta ? "acerto" : "erro";
  };

  const status = getStatus();

  const colors = {
    acerto: "bg-emerald-500 hover:bg-emerald-400",
    erro: "bg-rose-500 hover:bg-rose-400",
    branco: "bg-slate-600 hover:bg-slate-500",
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all
        ${atual ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950 scale-110" : ""}
        ${colors[status]}
        ${atual ? "" : "opacity-70 hover:opacity-100"}
      `}
      title={`Questão ${index + 1}${marcada ? " (marcada)" : ""}`}
    >
      {index + 1}
      {marcada && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-slate-950" />
      )}
    </button>
  );
}
