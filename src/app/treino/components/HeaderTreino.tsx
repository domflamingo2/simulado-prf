"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function HeaderTreino() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 text-center sm:text-left"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
        <Sparkles className="w-3 h-3" /> Modo Estudo
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
        Treino Específico
      </h1>
      <p className="text-slate-400 text-lg max-w-2xl">
        Personalize sua sessão focando nas matérias que precisam de mais
        atenção.
      </p>
    </motion.div>
  );
}
