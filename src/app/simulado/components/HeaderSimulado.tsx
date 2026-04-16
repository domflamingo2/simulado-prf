"use client";

import { motion } from "framer-motion";
import { Flag, X } from "lucide-react";

type ModoSimulado = "completo" | "turbo" | "adaptativo";

const MODOS_CONFIG = {
  completo: {
    nome: "COMPLETO",
    bgCor: "bg-blue-500/20",
    textCor: "text-blue-400",
    barCor: "bg-blue-500",
  },
  turbo: {
    nome: "TURBO",
    bgCor: "bg-amber-500/20",
    textCor: "text-amber-400",
    barCor: "bg-amber-500",
  },
  adaptativo: {
    nome: "ADAPTATIVO",
    bgCor: "bg-purple-500/20",
    textCor: "text-purple-400",
    barCor: "bg-purple-500",
  },
};

interface HeaderSimuladoProps {
  modo: ModoSimulado;
  questaoAtual: number;
  totalQuestoes: number;
  questoesRevisao: number;
  isMarcada: boolean;
  onSair: () => void;
  onMarcarRevisao: () => void;
  tempoMaximo: number;
  respondidas: number;
  percentualProgresso: number;
}

export function HeaderSimulado({
  modo,
  questaoAtual,
  totalQuestoes,
  questoesRevisao,
  isMarcada,
  onSair,
  onMarcarRevisao,
  tempoMaximo,
  respondidas,
  percentualProgresso,
}: HeaderSimuladoProps) {
  const config = MODOS_CONFIG[modo];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onSair}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              aria-label="Sair do simulado"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            <div
              className={`px-3 py-1 rounded-full text-xs font-bold ${config.bgCor} ${config.textCor}`}
            >
              {config.nome}
              {modo === "adaptativo" && " 🧠"}
              {modo === "turbo" && " ⚡"}
            </div>

            <span className="text-sm text-slate-400 hidden sm:inline">
              Questão {questaoAtual + 1} / {totalQuestoes}
            </span>

            {questoesRevisao > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs">
                {questoesRevisao} para revisão
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarcarRevisao}
              className={`p-2 rounded-lg transition-colors ${
                isMarcada
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-slate-800 text-slate-400 hover:text-amber-400"
              }`}
              title="Marcar para revisão (M)"
              aria-pressed={isMarcada}
            >
              <Flag className={`w-5 h-5 ${isMarcada ? "fill-current" : ""}`} />
            </button>

            <div className="text-xs text-slate-500 hidden lg:block">
              {Math.floor(tempoMaximo / 60)}min máx.
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${config.barCor}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentualProgresso}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{respondidas} respondidas</span>
            <span>{percentualProgresso.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </header>
  );
}
