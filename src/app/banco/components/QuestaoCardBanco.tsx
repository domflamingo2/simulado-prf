"use client";

import { motion } from "framer-motion";
import { Clock, Share2, Star } from "lucide-react";
import { useState } from "react";

import { GlassCard } from "@/components/ui/GlassCard";
import { Questao } from "@/data/types";

interface QuestaoCardBancoProps {
  questao: Questao;
  index: number;
  onFavoritar?: (id: string) => void;
  isFavorita?: boolean;
}

const DISCIPLINAS_COR: Record<string, string> = {
  PORTUGUES: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ETICA: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  RACIOCINIO_LOGICO: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  DIREITO_CONSTITUCIONAL: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  DIREITO_ADMINISTRATIVO:
    "bg-orange-500/20 text-orange-400 border-orange-500/30",
  ADMINISTRACAO: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  ARQUIVOLOGIA: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  INFORMATICA: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  LEGISLACAO_PRF: "bg-red-500/20 text-red-400 border-red-500/30",
};

const DIFICULDADE_CONFIG = {
  1: { label: "Fácil", cor: "bg-emerald-500/20 text-emerald-400" },
  2: { label: "Médio", cor: "bg-amber-500/20 text-amber-400" },
  3: { label: "Difícil", cor: "bg-rose-500/20 text-rose-400" },
};

export function QuestaoCardBanco({
  questao,
  index,
  onFavoritar,
  isFavorita = false,
}: QuestaoCardBancoProps) {
  const [expandido, setExpandido] = useState(false);
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const delay = Math.min(index * 0.03, 0.5);

  const dificuldadeConfig =
    DIFICULDADE_CONFIG[questao.dificuldade as 1 | 2 | 3] ||
    DIFICULDADE_CONFIG[2];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      className="group"
    >
      <GlassCard className="p-5 border-l-4 border-l-blue-500 hover:border-l-blue-400">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Header da questão */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                  DISCIPLINAS_COR[questao.disciplina] ??
                  "bg-slate-700 text-slate-300 border-slate-600"
                }`}
              >
                {questao.disciplina.replace(/_/g, " ")}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${dificuldadeConfig.cor}`}
              >
                {dificuldadeConfig.label}
              </span>
              {questao.ano && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {questao.ano}
                </span>
              )}
              {questao.banca_referencia && (
                <span className="text-xs text-slate-500">
                  {questao.banca_referencia}
                </span>
              )}
            </div>

            {/* Enunciado */}
            <p
              className={`text-slate-200 text-sm leading-relaxed ${expandido ? "" : "line-clamp-3"}`}
            >
              {questao.enunciado}
            </p>

            {/* Assunto e tags */}
            {questao.assunto && (
              <div className="mt-2 text-xs text-slate-500">
                📚 {questao.assunto}
              </div>
            )}

            {questao.tags && questao.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {questao.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]"
                  >
                    #{tag}
                  </span>
                ))}
                {questao.tags.length > 3 && (
                  <span className="text-[10px] text-slate-500">
                    +{questao.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <button
                onClick={() => setExpandido((p) => !p)}
                className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
              >
                {expandido ? "Ver menos" : "Ver completo"}
              </button>
              <button
                onClick={() => setMostrarResposta((p) => !p)}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                {mostrarResposta ? "Ocultar resposta" : "Mostrar resposta"}
              </button>
              {onFavoritar && (
                <button
                  onClick={() => onFavoritar(questao.id)}
                  className={`text-xs transition-colors flex items-center gap-1 ${
                    isFavorita
                      ? "text-amber-400"
                      : "text-slate-500 hover:text-amber-400"
                  }`}
                >
                  <Star
                    className={`w-3 h-3 ${isFavorita ? "fill-current" : ""}`}
                  />
                  {isFavorita ? "Favorita" : "Favoritar"}
                </button>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(questao.enunciado);
                  alert("Questão copiada!");
                }}
                className="text-xs text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" />
                Copiar
              </button>
            </div>

            {/* Resposta (expandível) */}
            {mostrarResposta && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-slate-400">
                    Resposta correta:
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                      questao.resposta === "CERTO"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/20 text-rose-400"
                    }`}
                  >
                    {questao.resposta}
                  </span>
                </div>
                <div className="text-sm text-slate-300 leading-relaxed">
                  {questao.explicacao}
                </div>
                {questao.fonte_legal && (
                  <div className="mt-2 text-xs text-slate-500 border-t border-slate-700 pt-2">
                    📖 Fonte: {questao.fonte_legal}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
