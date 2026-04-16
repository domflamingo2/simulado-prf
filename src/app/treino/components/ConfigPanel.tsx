"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Target, Timer } from "lucide-react";

import { QuantitySelector } from "./QuantitySelector";
import { ToggleSwitch } from "./ToggleSwitch";

interface ConfigPanelProps {
  disciplinaSelecionada: boolean;
  quantidade: number;
  maxQuantidade: number;
  mostrarExplicacao: boolean;
  onQuantidadeChange: (value: number) => void;
  onExplicacaoChange: (value: boolean) => void;
  onIniciarTreino: () => void;
}

export function ConfigPanel({
  disciplinaSelecionada,
  quantidade,
  maxQuantidade,
  mostrarExplicacao,
  onQuantidadeChange,
  onExplicacaoChange,
  onIniciarTreino,
}: ConfigPanelProps) {
  const tempoEstimado = Math.ceil(quantidade * 1.5);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <AnimatePresence mode="wait">
        {!disciplinaSelecionada ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <Target className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              Selecione uma disciplina ao lado para configurar o treino.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <QuantitySelector
              value={quantidade}
              max={maxQuantidade}
              onChange={onQuantidadeChange}
            />

            <ToggleSwitch
              checked={mostrarExplicacao}
              onChange={onExplicacaoChange}
              label="Explicação Imediata"
              description="Veja a correção logo após responder cada questão."
            />

            <div className="h-px bg-slate-800 my-4" />

            <button
              onClick={onIniciarTreino}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Iniciar Treino{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-2">
              <Timer className="w-3 h-3" />
              <span>Estimativa: ~{tempoEstimado} minutos</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Import necessário
import { ArrowRight } from "lucide-react";
