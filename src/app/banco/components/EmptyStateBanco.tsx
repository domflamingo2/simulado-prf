"use client";

import { motion } from "framer-motion";
import { Search, XCircle } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";

interface EmptyStateBancoProps {
  onLimparFiltros: () => void;
}

export function EmptyStateBanco({ onLimparFiltros }: EmptyStateBancoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[40vh] p-6"
    >
      <GlassCard className="p-12 text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Search className="w-20 h-20 text-slate-500 mx-auto mb-6" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Nenhuma questão encontrada
        </h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Tente ajustar seus filtros de busca ou disciplina para encontrar mais
          questões.
        </p>
        <button
          onClick={onLimparFiltros}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all hover:scale-105"
        >
          <XCircle className="w-5 h-5" />
          Limpar filtros
        </button>
      </GlassCard>
    </motion.div>
  );
}
