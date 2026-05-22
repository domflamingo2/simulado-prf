"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Sparkles,
  Target,
  Timer,
  Zap,
} from "lucide-react";

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
  disciplinaNome?: string;
  totalDisponivel?: number;
}

export function ConfigPanel({
  disciplinaSelecionada,
  quantidade,
  maxQuantidade,
  mostrarExplicacao,
  onQuantidadeChange,
  onExplicacaoChange,
  onIniciarTreino,
  disciplinaNome,
  totalDisponivel,
}: ConfigPanelProps) {
  const tempoEstimado = Math.ceil(quantidade * 1.5);
  const isMaxSelected = quantidade === maxQuantidade;
  const percentual = (quantidade / maxQuantidade) * 100;

  return (
    <div className="relative group">
      {/* Efeito de glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Gradiente decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-500/5 to-transparent rounded-full blur-xl" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Configuração do Treino
            </h3>
            <p className="text-[10px] text-slate-500">
              Personalize sua sessão de estudos
            </p>
          </div>
          {disciplinaNome && (
            <div className="ml-auto px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <span className="text-[10px] font-medium text-emerald-400">
                {disciplinaNome}
              </span>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!disciplinaSelecionada ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center border border-white/10">
                <Target className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm">
                Selecione uma disciplina ao lado para configurar o treino.
              </p>
              <p className="text-[11px] text-slate-600 mt-2">
                💡 Dica: Escolha a matéria que deseja praticar
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="space-y-6"
            >
              {/* Barra de progresso do limite */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <BarChart3 className="w-3 h-3" />
                    Questões disponíveis
                  </span>
                  <span className="text-slate-300 font-medium">
                    {quantidade} / {maxQuantidade}
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentual}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  />
                </div>
                {isMaxSelected &&
                  totalDisponivel !== undefined &&
                  totalDisponivel > maxQuantidade && (
                    <p className="text-[10px] text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      Limite de {maxQuantidade} questões por treino
                    </p>
                  )}
              </div>

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

              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

              {/* Botão iniciar treino */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onIniciarTreino}
                className="relative w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all overflow-hidden group/btn"
              >
                {/* Gradiente de fundo */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 group-hover/btn:from-emerald-500 group-hover/btn:to-teal-400 transition-all duration-300" />

                {/* Efeito de brilho */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Brain className="w-5 h-5" />
                  Iniciar Treino
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              {/* Informações adicionais */}
              <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Timer className="w-3 h-3 text-emerald-400" />
                  <span>Estimativa: ~{tempoEstimado} min</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>
                    {quantidade} questão{quantidade !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Dica de estudo */}
              <div className="p-3 rounded-xl bg-slate-800/30 border border-white/5 text-center">
                <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  Pratique com constância para melhores resultados!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
