"use client";

import { QuestaoRespondida } from "@/data/index";

interface NavigationDotsProps {
  total: number;
  atual: number;
  questoes: QuestaoRespondida[];
  onNavigate: (idx: number) => void;
}

export function NavigationDots({
  total,
  atual,
  questoes,
  onNavigate,
}: NavigationDotsProps) {
  const maxDots = 25;
  const showDots = Math.min(total, maxDots);
  const start = Math.max(
    0,
    Math.min(atual - Math.floor(maxDots / 2), total - maxDots),
  );
  const visibleDots = questoes.slice(start, start + showDots);

  return (
    <div className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-800">
      {start > 0 && <span className="text-xs text-slate-600">...</span>}
      {visibleDots.map((q, idx) => {
        const realIdx = start + idx;
        const isActive = realIdx === atual;
        const isRespondida = q.respostaUsuario !== undefined;
        const isCorreta = isRespondida && q.respostaUsuario === q.resposta;
        const isErrada = isRespondida && q.respostaUsuario !== q.resposta;
        return (
          <button
            key={realIdx}
            onClick={() => onNavigate(realIdx)}
            className={[
              "w-2.5 h-2.5 rounded-full transition-all duration-200",
              isActive ? "w-6 bg-blue-400" : "",
              isCorreta && !isActive ? "bg-emerald-500" : "",
              isErrada && !isActive ? "bg-rose-500" : "",
              !isRespondida && !isActive
                ? "bg-slate-600 hover:bg-slate-500"
                : "",
            ].join(" ")}
            aria-label={`Ir para questão ${realIdx + 1}`}
          />
        );
      })}
      {start + showDots < total && (
        <span className="text-xs text-slate-600">...</span>
      )}
      <span className="ml-2 text-xs text-slate-500">
        {atual + 1}/{total}
      </span>
    </div>
  );
}
