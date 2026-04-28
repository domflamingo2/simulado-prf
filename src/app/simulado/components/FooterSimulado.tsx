"use client";

import { CheckCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { QuestaoRespondida } from "@/data/index";
import { NavigationDots } from "./NavigationDots";

interface FooterSimuladoProps {
  questaoAtual: number;
  totalQuestoes: number;
  questoes: QuestaoRespondida[];
  respondidas: number;
  percentualProgresso: number;
  isFinalizing: boolean;
  onAnterior: () => void;
  onProxima: () => void;
  onNavigate: (idx: number) => void;
  onFinalizar: () => void;
}

export function FooterSimulado({
  questaoAtual,
  totalQuestoes,
  questoes,
  respondidas,
  percentualProgresso,
  isFinalizing,
  onAnterior,
  onProxima,
  onNavigate,
  onFinalizar,
}: FooterSimuladoProps) {
  const isLast = questaoAtual === totalQuestoes - 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 p-4 z-30">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onAnterior}
            disabled={questaoAtual === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <NavigationDots
            total={totalQuestoes}
            atual={questaoAtual}
            questoes={questoes}
            onNavigate={onNavigate}
          />

          {!isLast ? (
            <button
              onClick={onProxima}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
            >
              <span className="hidden sm:inline">Próxima</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onFinalizar}
              disabled={isFinalizing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFinalizing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {isFinalizing ? "Finalizando…" : "Finalizar"}
            </button>
          )}
        </div>

        <div className="md:hidden mt-3 text-center text-xs text-slate-500">
          {respondidas} de {totalQuestoes} respondidas
          {respondidas > 0 && ` • ${percentualProgresso.toFixed(0)}%`}
        </div>
      </div>
    </div>
  );
}
