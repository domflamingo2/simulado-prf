"use client";

import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";

import { GlassCard } from "@/components/ui/GlassCard";
import { DISCIPLINAS_COR } from "@/constants/disciplinas";
import { ErroComMetadados } from "@/types/erros";

interface CardErroProps {
  erro: ErroComMetadados;
  index: number;
  onRemover: (id: string) => void;
  isRevisado: boolean;
  onToggleRevisado: (id: string) => void;
}

export function CardErro({
  erro,
  index,
  onRemover,
  isRevisado,
  onToggleRevisado,
}: CardErroProps) {
  const [expandido, setExpandido] = useState(false);
  const delay = Math.min(index * 0.04, 0.5);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ delay, duration: 0.25 }}
      className="group"
    >
      <GlassCard
        className={`p-5 border-l-4 transition-all duration-300 ${
          isRevisado
            ? "border-l-emerald-500 bg-emerald-500/5"
            : "border-l-rose-500 hover:border-l-rose-400"
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                  DISCIPLINAS_COR[erro.disciplina] ??
                  "bg-slate-700 text-slate-300 border-slate-600"
                }`}
              >
                {erro.disciplinaFormatada}
              </span>
              {erro.vezesErrada > 1 && (
                <span className="flex items-center gap-1 text-xs text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full">
                  <RotateCcw className="w-3 h-3" />
                  Errou {erro.vezesErrada}x
                </span>
              )}
              <span className="text-xs text-slate-500 ml-auto">
                {new Date(erro.ultimaData).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <p
              className={`text-slate-200 text-sm leading-relaxed ${expandido ? "" : "line-clamp-2"}`}
            >
              {erro.enunciado}
            </p>

            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <button
                onClick={() => setExpandido((p) => !p)}
                className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
              >
                {expandido ? "Ver menos" : "Ver completo"}
              </button>
              <button
                onClick={() => onRemover(erro.id)}
                className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Remover da lista
              </button>
              <button
                onClick={() => onToggleRevisado(erro.id)}
                className={`text-xs transition-colors flex items-center gap-1 ${
                  isRevisado
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-slate-500 hover:text-blue-400"
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {isRevisado ? "Revisado ✓" : "Marcar como revisado"}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-xs text-slate-500">Correta</span>
            <span
              className={`px-3 py-1 rounded-lg text-sm font-bold ${
                erro.resposta === "CERTO"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {erro.resposta}
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}