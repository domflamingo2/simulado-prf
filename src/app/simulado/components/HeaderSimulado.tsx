"use client";

import { motion } from "framer-motion";
import { Brain, CheckCircle2, Clock, Flag, Target, X, Zap } from "lucide-react";

type ModoSimulado = "completo" | "turbo" | "adaptativo";

const MODOS_CONFIG = {
  completo: {
    nome: "COMPLETO",
    bgCor: "bg-blue-500/20",
    textCor: "text-blue-400",
    barCor: "bg-blue-500",
    icon: Target,
    descricao: "60 questões • 4 horas",
  },
  turbo: {
    nome: "TURBO",
    bgCor: "bg-amber-500/20",
    textCor: "text-amber-400",
    barCor: "bg-amber-500",
    icon: Zap,
    descricao: "50 questões • 40 minutos",
  },
  adaptativo: {
    nome: "ADAPTATIVO",
    bgCor: "bg-purple-500/20",
    textCor: "text-purple-400",
    barCor: "bg-purple-500",
    icon: Brain,
    descricao: "IA personaliza questões",
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
  tempoRestante?: number;
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
  tempoRestante,
  respondidas,
  percentualProgresso,
}: HeaderSimuladoProps) {
  const config = MODOS_CONFIG[modo];
  const ModoIcon = config.icon;

  const formatTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const tempoAtual = tempoRestante !== undefined ? tempoRestante : tempoMaximo;
  const tempoPercentual = (tempoAtual / tempoMaximo) * 100;
  const isTempoCritico = tempoPercentual < 20;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
        {/* Linha superior */}
        <div className="flex items-center justify-between gap-4">
          {/* Lado esquerdo */}
          <div className="flex items-center gap-3">
            {/* Botão sair */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSair}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all duration-200 group"
              aria-label="Sair do simulado"
            >
              <X className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
            </motion.button>

            {/* Badge do modo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.bgCor} ${config.textCor} border border-current/30 shadow-sm`}
            >
              <ModoIcon className="w-3 h-3" />
              {config.nome}
            </motion.div>

            {/* Indicador de questão */}
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/50 border border-white/10">
              <Target className="w-3 h-3 text-blue-400" />
              <span className="text-sm text-slate-300">
                Questão{" "}
                <span className="font-bold text-white">{questaoAtual + 1}</span>
                <span className="text-slate-500"> / {totalQuestoes}</span>
              </span>
            </div>

            {/* Badge de revisão */}
            {questoesRevisao > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30"
              >
                <Flag className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-medium text-amber-400">
                  {questoesRevisao} p/ revisão
                </span>
              </motion.div>
            )}
          </div>

          {/* Lado direito */}
          <div className="flex items-center gap-3">
            {/* Botão marcar revisão */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMarcarRevisao}
              className={`relative p-2 rounded-xl transition-all duration-200 ${
                isMarcada
                  ? "bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700"
              }`}
              title="Marcar para revisão (M)"
              aria-pressed={isMarcada}
            >
              <Flag className={`w-4 h-4 ${isMarcada ? "fill-current" : ""}`} />
            </motion.button>
          </div>
        </div>

        {/* Barra de progresso dupla */}
        <div className="mt-3 space-y-2">
          {/* Barra de progresso de respostas */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Questões respondidas</span>
              </div>
              <span className="text-emerald-400 font-mono">
                {respondidas}/{totalQuestoes}
              </span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentualProgresso}%` }}
                transition={{ duration: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              />
            </div>
          </div>

          {/* Barra de tempo (se tiver tempo restante) */}
          {tempoRestante !== undefined && (
            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span>Tempo restante</span>
                </div>
                <span
                  className={`font-mono ${isTempoCritico ? "text-rose-400" : "text-blue-400"}`}
                >
                  {formatTempo(tempoAtual)} / {formatTempo(tempoMaximo)}
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${tempoPercentual}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-full rounded-full transition-all ${
                    isTempoCritico
                      ? "bg-gradient-to-r from-rose-500 to-red-500"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Indicador mobile da questão atual */}
        <div className="md:hidden mt-2 text-center">
          <p className="text-xs text-slate-400">
            Questão{" "}
            <span className="text-white font-bold">{questaoAtual + 1}</span> de{" "}
            {totalQuestoes}
          </p>
        </div>
      </div>

      {/* Barra decorativa */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
      />
    </header>
  );
}
