"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Play,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const podeTreinar = errosFiltradosCount > 0;
  const percentualRevisado =
    totalErros > 0 ? (revisadosCount / totalErros) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
      className="relative group"
    >
      {/* Efeito de glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <GlassCard className="p-6 relative overflow-hidden" glow="pink">
        {/* Gradiente decorativo */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-500/5 to-rose-500/5 rounded-full blur-xl" />

        <div className="relative flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Lado esquerdo - Informações */}
          <div className="flex-1 space-y-3">
            {/* Badge de simulados */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-amber-400">
                Baseado em {totalSimulados} simulado
                {totalSimulados !== 1 ? "s" : ""} realizados
              </span>
            </div>

            {/* Número de erros */}
            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-black text-white">
                {totalErros}
                <span className="text-base sm:text-lg text-slate-400 font-normal ml-2">
                  questões para revisar
                </span>
              </p>

              {/* Barra de progresso de revisão */}
              {totalErros > 0 && (
                <div className="w-full max-w-md">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progresso de revisão</span>
                    <span>
                      {revisadosCount}/{totalErros} (
                      {percentualRevisado.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentualRevisado}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Metadados */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/50">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Último erro:</span>
                <span className="text-slate-300 font-medium">
                  {ultimoErroData}
                </span>
              </div>

              {revisadosCount > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">
                    {revisadosCount} revisadas
                  </span>
                </div>
              )}

              {!podeTreinar && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 text-xs">
                    Nenhum erro para revisar
                  </span>
                </div>
              )}
            </div>

            {/* Dica motivacional */}
            {podeTreinar && (
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                <span>Foque nos erros para melhorar seu desempenho!</span>
              </div>
            )}
          </div>

          {/* Lado direito - Botão de ação */}
          <div className="flex-shrink-0">
            <motion.button
              onClick={onIniciarTreino}
              disabled={!podeTreinar}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ scale: podeTreinar ? 1.03 : 1 }}
              whileTap={{ scale: podeTreinar ? 0.98 : 1 }}
              className={`relative group/btn flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden ${
                podeTreinar
                  ? "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/25 cursor-pointer"
                  : "bg-gradient-to-r from-slate-700 to-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {/* Efeito de brilho no hover */}
              {podeTreinar && (
                <motion.div
                  animate={{ x: isHovered ? "100%" : "-100%" }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              )}

              <div className="relative flex items-center gap-2.5">
                <div className="relative">
                  <Play className="w-5 h-5" />
                  {podeTreinar && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -inset-1 rounded-full bg-rose-400/20 blur-sm"
                    />
                  )}
                </div>
                <span className="font-bold">
                  Treinar {Math.min(errosFiltradosCount, 30)} Erro
                  {Math.min(errosFiltradosCount, 30) !== 1 ? "s" : ""}
                </span>
                <BookOpen className="w-4 h-4 opacity-70" />
              </div>
            </motion.button>

            {/* Texto de ajuda */}
            {podeTreinar && (
              <p className="text-[10px] text-slate-500 text-center mt-2">
                Serão selecionadas as questões mais recentes
              </p>
            )}
          </div>
        </div>

        {/* Barra decorativa inferior */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"
        />
      </GlassCard>
    </motion.div>
  );
}
