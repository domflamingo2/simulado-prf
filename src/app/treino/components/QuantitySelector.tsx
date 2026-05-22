"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Target, TrendingUp } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  max: number;
  onChange: (v: number) => void;
  showEstimate?: boolean;
}

export function QuantitySelector({
  value,
  max,
  onChange,
  showEstimate = true,
}: QuantitySelectorProps) {
  const percentual = (value / max) * 100;
  const tempoEstimado = Math.ceil(value * 1.5);
  const isMax = value === max;
  const isMin = value <= 5;

  const handleDecrement = () => {
    const novoValor = Math.max(5, value - 5);
    if (novoValor !== value) onChange(novoValor);
  };

  const handleIncrement = () => {
    const novoValor = Math.min(max, value + 5);
    if (novoValor !== value) onChange(novoValor);
  };

  const handleSetMax = () => {
    if (value !== max) onChange(max);
  };

  return (
    <div className="relative group">
      {/* Efeito de glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20">
              <Target className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-sm font-medium text-slate-300">
              Quantidade de Questões
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Disponível:{" "}
              <span className="text-emerald-400 font-medium">{max}</span>
            </span>
            {isMax && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                Máximo
              </span>
            )}
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between gap-5">
          {/* Botão Diminuir */}
          <motion.button
            whileHover={!isMin ? { scale: 1.05 } : {}}
            whileTap={!isMin ? { scale: 0.95 } : {}}
            onClick={handleDecrement}
            disabled={isMin}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center text-slate-400 transition-all duration-200 ${
              isMin
                ? "bg-slate-800/50 border-slate-700/50 opacity-40 cursor-not-allowed"
                : "bg-slate-800 border-slate-600 hover:border-blue-500 hover:text-blue-400 hover:shadow-lg active:scale-95"
            }`}
          >
            <Minus className="w-5 h-5" />
          </motion.button>

          {/* Valor central */}
          <div className="flex-1 text-center">
            <motion.div
              key={value}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="text-5xl font-black text-white tracking-tight"
            >
              {value}
            </motion.div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-1">
              Questões
            </div>
            {showEstimate && (
              <div className="flex items-center justify-center gap-1 mt-1.5 text-[10px] text-slate-500">
                <TrendingUp className="w-2.5 h-2.5" />
                <span>~{tempoEstimado} min de treino</span>
              </div>
            )}
          </div>

          {/* Botão Aumentar */}
          <motion.button
            whileHover={!isMax ? { scale: 1.05 } : {}}
            whileTap={!isMax ? { scale: 0.95 } : {}}
            onClick={handleIncrement}
            disabled={isMax}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center text-slate-400 transition-all duration-200 ${
              isMax
                ? "bg-slate-800/50 border-slate-700/50 opacity-40 cursor-not-allowed"
                : "bg-slate-800 border-slate-600 hover:border-cyan-500 hover:text-cyan-400 hover:shadow-lg active:scale-95"
            }`}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Barra de progresso */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Seleção</span>
            <span className="font-mono text-blue-400">
              {Math.round(percentual)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentual}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
            />
          </div>
        </div>

        {/* Botão selecionar máximo */}
        {!isMax && max > 20 && (
          <button
            onClick={handleSetMax}
            className="mt-4 w-full py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all border border-white/10"
          >
            Selecionar todas ({max} questões)
          </button>
        )}
      </div>
    </div>
  );
}
