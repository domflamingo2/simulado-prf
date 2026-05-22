"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Flag,
  Home,
  Keyboard,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
  const [isHoveredPrev, setIsHoveredPrev] = useState(false);
  const [isHoveredNext, setIsHoveredNext] = useState(false);
  const [isHoveredFlag, setIsHoveredFlag] = useState(false);

  const isLast = questaoAtual === totalQuestoes - 1;
  const isFirst = questaoAtual === 0;

  return (
    <div className="space-y-4">
      {/* Controles principais */}
      <div className="flex items-center justify-between gap-3">
        {/* Botão Anterior */}
        <motion.button
          whileHover={!isFirst ? { scale: 1.02 } : {}}
          whileTap={!isFirst ? { scale: 0.98 } : {}}
          onMouseEnter={() => setIsHoveredPrev(true)}
          onMouseLeave={() => setIsHoveredPrev(false)}
          onClick={onAnterior}
          disabled={isFirst}
          className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
            isFirst
              ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white shadow-md"
          }`}
        >
          <ArrowLeft
            className={`w-4 h-4 transition-transform duration-300 ${isHoveredPrev && !isFirst ? "-translate-x-0.5" : ""}`}
          />
          <span>Anterior</span>
        </motion.button>

        {/* Indicador de progresso central */}
        <div className="flex flex-col items-center">
          <div className="px-4 py-2 rounded-full bg-slate-800/50 border border-white/10">
            <span className="text-sm font-medium text-slate-300">
              Questão{" "}
              <span className="font-bold text-white">{questaoAtual + 1}</span>
              <span className="text-slate-500"> / </span>
              <span className="text-slate-400">{totalQuestoes}</span>
            </span>
          </div>
          <div className="w-32 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((questaoAtual + 1) / totalQuestoes) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex items-center gap-2">
          {/* Botão Marcar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHoveredFlag(true)}
            onMouseLeave={() => setIsHoveredFlag(false)}
            onClick={onToggleMarcacao}
            className={`relative p-2.5 rounded-xl transition-all duration-300 ${
              isMarcada
                ? "bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/20"
                : "bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700"
            }`}
            title="Marcar para revisar depois (M)"
          >
            <Flag className={`w-5 h-5 ${isMarcada ? "fill-current" : ""}`} />
            {isHoveredFlag && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-900 border border-white/10 text-[10px] text-slate-400 whitespace-nowrap"
              >
                Marcar revisão
              </motion.span>
            )}
          </motion.button>

          {/* Botão Compartilhar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCompartilhar}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all duration-300"
            title="Copiar questão"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Botão Próxima / Concluir */}
        {!isLast ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setIsHoveredNext(true)}
            onMouseLeave={() => setIsHoveredNext(false)}
            onClick={onProxima}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25"
          >
            <span>Próxima</span>
            <ArrowRight
              className={`w-4 h-4 transition-transform duration-300 ${isHoveredNext ? "translate-x-0.5" : ""}`}
            />
          </motion.button>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold transition-all duration-300 shadow-lg shadow-emerald-500/25 group"
          >
            <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Concluir</span>
          </Link>
        )}
      </div>

      {/* Barra de progresso adicional */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((questaoAtual + 1) / totalQuestoes) * 100}%`,
            }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
        <span className="text-[10px] text-slate-500 font-mono">
          {Math.round(((questaoAtual + 1) / totalQuestoes) * 100)}%
        </span>
      </div>

      {/* Atalhos de teclado */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Keyboard className="w-3 h-3" />
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[9px]">
            ←
          </kbd>
          <span>anterior</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[9px]">
            →
          </kbd>
          <span>próxima</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[9px]">
            M
          </kbd>
          <span>marcar</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1 text-[10px] text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          <Home className="w-3 h-3" />
          <span>sair</span>
        </Link>
      </div>
    </div>
  );
}
