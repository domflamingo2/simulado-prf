"use client";

import { GlassCard } from "@/components/ui/GlassCard"; // CORREÇÃO: Named Import
import { motion } from "framer-motion";
import { BookOpen, Play, Target } from "lucide-react";
import { useState } from "react"; // CORREÇÃO: Importar useState

interface EmptyStateProps {
  onIniciar: () => void;
}

export default function EmptyStateDashboard({ onIniciar }: EmptyStateProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isNavigating) return;
    setIsNavigating(true);
    onIniciar();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[50vh] p-6"
    >
      <GlassCard
        className="p-8 sm:p-12 text-center max-w-lg w-full"
        glow="blue"
        intensity="strong"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center ring-4 ring-blue-500/20"
        >
          <Target className="w-12 h-12 text-blue-400" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Bem-vindo ao PRF Simulado!
        </h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
          Você ainda não realizou nenhum simulado. Comece agora e acompanhe sua
          evolução rumo à aprovação.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: isNavigating ? 1 : 1.05 }}
            whileTap={{ scale: isNavigating ? 1 : 0.95 }}
            onClick={handleClick}
            disabled={isNavigating}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isNavigating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Carregando...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" /> Iniciar Primeiro Simulado
              </>
            )}
          </motion.button>
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium transition-colors">
            <BookOpen className="w-5 h-5" /> Como Funciona
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
