"use client";

import { motion } from "framer-motion";
import { Download, Play, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import { GlassCard } from "@/components/ui/GlassCard";

interface AcoesBancoProps {
  totalQuestoes: number;
  questoesSelecionadas: number;
  onExportar: () => void;
  onTreinar: () => void;
  onResetarFiltros: () => void;
}

export function AcoesBanco({
  totalQuestoes,
  questoesSelecionadas,
  onExportar,
  onTreinar,
  onResetarFiltros,
}: AcoesBancoProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <GlassCard className="p-6" glow="blue">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1">
            <p className="text-3xl font-bold text-white mb-1">
              {totalQuestoes}
            </p>
            <p className="text-sm text-slate-400">
              questões encontradas
              {totalQuestoes !== questoesSelecionadas && (
                <span className="text-slate-500">
                  {" "}
                  (filtradas de {questoesSelecionadas} no total)
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onExportar}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>

            <button
              onClick={onResetarFiltros}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Resetar Filtros
            </button>

            <button
              onClick={onTreinar}
              disabled={totalQuestoes === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
            >
              <Play className="w-4 h-4" />
              Treinar ({Math.min(totalQuestoes, 30)} questões)
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
