"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Grid3x3, Minus, XCircle } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";
import { QuestaoRespondida } from "@/data/questoes/index";

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
  const stats = {
    acertos: questoes.filter(
      (q) => q.respostaUsuario && q.respostaUsuario === q.resposta,
    ).length,
    erros: questoes.filter(
      (q) => q.respostaUsuario && q.respostaUsuario !== q.resposta,
    ).length,
    brancos: questoes.filter((q) => !q.respostaUsuario).length,
    marcadas: marcadas.length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard className="p-5 transition-all duration-300 hover:shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Grid3x3 className="w-3.5 h-3.5 text-white" />
            </div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Navegação Rápida
            </p>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2 text-[10px]">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">{stats.acertos}</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-400" />
              <span className="text-rose-400">{stats.erros}</span>
            </div>
            <div className="flex items-center gap-1">
              <Minus className="w-3 h-3 text-slate-500" />
              <span className="text-slate-500">{stats.brancos}</span>
            </div>
          </div>
        </div>

        {/* Grid de dots */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
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

        {/* Legenda */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
              <span>Acertou</span>
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
              <span>Errou</span>
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600 shadow-sm" />
              <span>Não respondeu</span>
            </span>
          </div>

          {stats.marcadas > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-amber-400">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
              <span>
                {stats.marcadas} questão{stats.marcadas !== 1 ? "es" : ""}{" "}
                marcada{stats.marcadas !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
