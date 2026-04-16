"use client";

import { motion } from "framer-motion";
import { Brain, Loader2 } from "lucide-react";

import { GlassCard } from "@/components/ui/GlassCard";

type ModoSimulado = "completo" | "turbo" | "adaptativo";

interface LoadingScreenProps {
  modo: ModoSimulado;
  analise?: {
    disciplinasCriticas: Array<{ disciplina: string; taxaErro: number }>;
  };
}

export function LoadingScreen({ modo, analise }: LoadingScreenProps) {
  const isAdaptativo = modo === "adaptativo";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <GlassCard
        className="p-8 text-center max-w-md w-full"
        glow={isAdaptativo ? "purple" : "blue"}
      >
        {isAdaptativo ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 text-purple-400">
              IA Analisando...
            </h2>
            <p className="text-slate-400 mb-6">
              Estudando seu histórico para personalizar o simulado
            </p>
            {analise && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left space-y-2 mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800"
              >
                <p className="text-sm text-rose-400 font-medium">
                  ⚠️ Pontos fracos detectados:
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  {analise.disciplinasCriticas.slice(0, 3).map((d) => (
                    <li key={d.disciplina} className="flex justify-between">
                      <span>• {d.disciplina.replace(/_/g, " ")}</span>
                      <span className="text-rose-400">
                        {(d.taxaErro * 100).toFixed(0)}% erro
                      </span>
                    </li>
                  ))}
                </ul>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="mt-3 h-1 bg-purple-500/20 rounded-full overflow-hidden"
                >
                  <div className="h-full bg-purple-500 rounded-full" />
                </motion.div>
              </motion.div>
            )}
          </>
        ) : (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white">
              Preparando simulado...
            </h2>
            <p className="text-slate-400 mt-2">
              Selecionando questões da banca CEBRASPE
            </p>
          </>
        )}
      </GlassCard>
    </div>
  );
}
