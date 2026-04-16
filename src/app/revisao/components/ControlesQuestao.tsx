"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flag,
  Share2,
} from "lucide-react";
import Link from "next/link";

interface ControlesQuestaoProps {
  questaoAtual: number;
  totalQuestoes: number;
  isMarcada: boolean;
  onAnterior: () => void;
  onProxima: () => void;
  onToggleMarcacao: () => void;
  onCompartilhar: () => void;
}

export function ControlesQuestao({
  questaoAtual,
  totalQuestoes,
  isMarcada,
  onAnterior,
  onProxima,
  onToggleMarcacao,
  onCompartilhar,
}: ControlesQuestaoProps) {
  const isLast = questaoAtual === totalQuestoes - 1;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onAnterior}
          disabled={questaoAtual === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMarcacao}
            className={`p-2.5 rounded-xl transition-colors ${
              isMarcada
                ? "bg-amber-500/20 text-amber-400"
                : "bg-slate-800 text-slate-400 hover:text-amber-400"
            }`}
            title="Marcar para revisar depois (M)"
          >
            <Flag className={`w-5 h-5 ${isMarcada ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={onCompartilhar}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
            title="Copiar questão"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {!isLast ? (
          <button
            onClick={onProxima}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
          >
            Próxima
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors"
          >
            <CheckCircle2 className="w-5 h-5" />
            Concluir
          </Link>
        )}
      </div>

      <p className="text-center text-xs text-slate-600">
        Atalhos: ← → navegar • M marcar • F filtrar erros • T todas
      </p>
    </>
  );
}
