"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Flame, Play } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";

interface AcaoPrincipalProps {
  totalSimulados: number;
  totalErros: number;
  ultimoErroData: string;
  revisadosCount: number;
  errosFiltradosCount: number;
  onIniciarTreino: () => void;
}

export function AcaoPrincipal({
  totalSimulados,
  totalErros,
  ultimoErroData,
  revisadosCount,
  errosFiltradosCount,
  onIniciarTreino,
}: AcaoPrincipalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <GlassCard className="p-6" glow="pink">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1">
            <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Baseado em {totalSimulados} simulado
              {totalSimulados !== 1 ? "s" : ""} realizados
            </p>
            <p className="text-3xl font-bold text-white mb-2">
              {totalErros}{" "}
              <span className="text-lg text-slate-400 font-normal">
                questões para revisar
              </span>
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Último erro: {ultimoErroData}
              </span>
              {revisadosCount > 0 && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  {revisadosCount} revisadas
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onIniciarTreino}
            disabled={errosFiltradosCount === 0}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-rose-500/25 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            Treinar {Math.min(errosFiltradosCount, 30)} Erros
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
