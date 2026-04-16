"use client";

import { motion } from "framer-motion";

interface QuantitySelectorProps {
  value: number;
  max: number;
  onChange: (v: number) => void;
}

export function QuantitySelector({
  value,
  max,
  onChange,
}: QuantitySelectorProps) {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-300">Quantidade</span>
        <span className="text-xs text-slate-500">Disponíveis: {max}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => onChange(Math.max(5, value - 5))}
          disabled={value <= 5}
          className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          -
        </button>

        <div className="flex-1 text-center">
          <div className="text-4xl font-bold text-white tracking-tight">
            {value}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">
            Questões
          </div>
        </div>

        <button
          onClick={() => onChange(Math.min(max, value + 5))}
          disabled={value >= max}
          className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          +
        </button>
      </div>

      <div className="mt-4 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
        />
      </div>
    </div>
  );
}
