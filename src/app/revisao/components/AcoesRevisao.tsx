"use client";

import { BarChart3, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface AcoesRevisaoProps {
  onRefazer: () => void;
}

export function AcoesRevisao({ onRefazer }: AcoesRevisaoProps) {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <button
        onClick={onRefazer}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
      >
        <RotateCcw className="w-4 h-4" />
        Refazer
      </button>
      <button
        onClick={() => router.push("/estatisticas")}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
      >
        <BarChart3 className="w-4 h-4" />
        Stats
      </button>
    </div>
  );
}
