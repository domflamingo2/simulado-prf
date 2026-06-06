"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  RotateCcw,
  Trash2,
  XCircle,
} from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);
  const delay = Math.min(index * 0.04, 0.5);

  const disciplinaCor = DISCIPLINAS_COR[erro.disciplina] || {
    bg: "bg-slate-700",
    text: "text-slate-300",
    border: "border-slate-600",
    light: "bg-slate-700/20",
  };

  const respostaConfig = {
    CERTO: {
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      icon: CheckCircle2,
    },
    ERRADO: {
      bg: "bg-rose-500/20",
      border: "border-rose-500/30",
      text: "text-rose-400",
      icon: XCircle,
    },
  };

  const RespostaIcon =
    respostaConfig[erro.resposta as "CERTO" | "ERRADO"]?.icon || XCircle;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ delay, duration: 0.3, type: "spring" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group/card"
    >
      {/* Efeito de glow no hover */}
      {isHovered && (
        <div
          className={`absolute -inset-0.5 rounded-2xl blur-md opacity-30 transition-opacity duration-300 ${
            isRevisado ? "bg-emerald-500" : "bg-rose-500"
          }`}
        />
      )}

      <GlassCard
        className={`relative p-5 border-l-4 transition-all duration-300 ${
          isRevisado
            ? "border-l-emerald-500 bg-gradient-to-r from-emerald-500/5 to-transparent"
            : "border-l-rose-500 bg-gradient-to-r from-rose-500/5 to-transparent hover:border-l-rose-400"
        } ${isHovered ? "shadow-lg" : ""}`}
      >
        {/* Header com badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Badge de disciplina */}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${disciplinaCor.bg} ${disciplinaCor.text} ${disciplinaCor.border}`}
            >
              {erro.disciplinaFormatada}
            </span>

            {/* Badge de vezes errada */}
            {erro.vezesErrada > 1 && (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/15 px-2.5 py-1 rounded-full border border-rose-500/30"
              >
                <RotateCcw className="w-3 h-3" />
                Errou {erro.vezesErrada}x
              </motion.span>
            )}

            {/* Badge de revisado */}
            {isRevisado && (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30"
              >
                <CheckCircle2 className="w-3 h-3" />
                Revisado
              </motion.span>
            )}

            {/* Badge de dificuldade (opcional) */}
            {erro.dificuldade && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  erro.dificuldade === 3
                    ? "bg-purple-500/20 text-purple-400"
                    : erro.dificuldade === 2
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {erro.dificuldade === 3
                  ? "Difícil"
                  : erro.dificuldade === 2
                    ? "Médio"
                    : "Fácil"}
              </span>
            )}
          </div>

          {/* Data */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>📅</span>
            {new Date(erro.ultimaData).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Enunciado */}
        <motion.p
          className={`text-slate-200 text-sm leading-relaxed ${expandido ? "" : "line-clamp-2"}`}
          animate={{ height: expandido ? "auto" : "auto" }}
        >
          {erro.enunciado}
        </motion.p>

        {/* Resposta correta destacada */}
        <div className="mt-3 p-3 rounded-lg bg-slate-800/30 border border-white/5">
          <div className="flex items-center gap-2">
            <div
              className={`p-1 rounded-lg ${respostaConfig[erro.resposta as "CERTO" | "ERRADO"]?.bg}`}
            >
              <RespostaIcon
                className={`w-3.5 h-3.5 ${respostaConfig[erro.resposta as "CERTO" | "ERRADO"]?.text}`}
              />
            </div>
            <span className="text-xs text-slate-400">Resposta correta:</span>
            <span
              className={`text-sm font-bold ${respostaConfig[erro.resposta as "CERTO" | "ERRADO"]?.text}`}
            >
              {erro.resposta}
            </span>
          </div>
        </div>

        {/* Explicação (expandida) */}
        <AnimatePresence>
          {expandido && erro.explicacao && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  {erro.explicacao}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ações */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-white/10">
          <button
            onClick={() => setExpandido(!expandido)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-all duration-200"
          >
            {expandido ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Ver explicação
              </>
            )}
          </button>

          <button
            onClick={() => onToggleRevisado(erro.id)}
            className={`flex items-center gap-1.5 text-xs transition-all duration-200 ${
              isRevisado
                ? "text-emerald-400 hover:text-emerald-300"
                : "text-slate-500 hover:text-blue-400"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isRevisado ? "Revisado ✓" : "Marcar revisado"}
          </button>

          <button
            onClick={() => onRemover(erro.id)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-all duration-200 ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remover
          </button>
        </div>

        {/* Indicador de hover sutil */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            boxShadow: `inset 0 0 20px ${isRevisado ? "rgba(16, 185, 129, 0.05)" : "rgba(244, 63, 94, 0.05)"}`,
          }}
        />
      </GlassCard>
    </motion.div>
  );
}
