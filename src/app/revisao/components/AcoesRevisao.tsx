"use client";

import { motion } from "framer-motion";
import { BarChart3, Home, RotateCcw, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AcoesRevisaoProps {
  onRefazer: () => void;
  onVoltar?: () => void;
  totalQuestoes?: number;
}

export function AcoesRevisao({
  onRefazer,
  onVoltar,
  totalQuestoes,
}: AcoesRevisaoProps) {
  const router = useRouter();
  const [isHoveredRefazer, setIsHoveredRefazer] = useState(false);
  const [isHoveredStats, setIsHoveredStats] = useState(false);

  const handleVoltar = () => {
    if (onVoltar) {
      onVoltar();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="flex flex-col sm:flex-row gap-3"
    >
      {/* Botão Refazer */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setIsHoveredRefazer(true)}
        onMouseLeave={() => setIsHoveredRefazer(false)}
        onClick={onRefazer}
        className="relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 overflow-hidden group"
      >
        {/* Efeito de brilho */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

        <RotateCcw
          className={`w-4 h-4 transition-transform duration-500 ${isHoveredRefazer ? "rotate-[-180deg]" : ""}`}
        />
        <span>Refazer Revisão</span>
        {totalQuestoes && (
          <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full ml-1">
            {totalQuestoes}
          </span>
        )}
      </motion.button>

      {/* Botão Estatísticas */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setIsHoveredStats(true)}
        onMouseLeave={() => setIsHoveredStats(false)}
        onClick={() => router.push("/estatisticas")}
        className="relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium transition-all duration-300 border border-white/10 hover:border-white/20 group"
      >
        <BarChart3
          className={`w-4 h-4 transition-transform duration-300 ${isHoveredStats ? "scale-110" : ""}`}
        />
        <span>Ver Estatísticas</span>
        <TrendingUp className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
      </motion.button>

      {/* Botão Voltar (opcional) */}
      {onVoltar && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVoltar}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white font-medium transition-all duration-300 border border-white/10"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Voltar</span>
        </motion.button>
      )}
    </motion.div>
  );
}
