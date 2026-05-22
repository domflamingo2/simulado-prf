"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

interface FooterErrosProps {
  exibindo: number;
  total: number;
  naoRevisados: number;
  onMostrarNaoRevisados: () => void;
  onResetarRevisados: () => void;
}

export function FooterErros({
  exibindo,
  total,
  naoRevisados,
  onMostrarNaoRevisados,
  onResetarRevisados,
}: FooterErrosProps) {
  const [isHoveredReset, setIsHoveredReset] = useState(false);
  const [isHoveredFilter, setIsHoveredFilter] = useState(false);

  const revisadosCount = total - naoRevisados;
  const percentualRevisados = total > 0 ? (revisadosCount / total) * 100 : 0;
  const isTreinoLimitado = exibindo > 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="relative"
    >
      {/* Linha separadora */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="pt-6 flex flex-col lg:flex-row justify-between items-center gap-4">
        {/* Lado esquerdo - Informações */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
          {/* Contador principal */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Mostrando</span>
              <span className="font-bold text-white">{exibindo}</span>
              <span className="text-slate-500">de</span>
              <span className="font-bold text-white">{total}</span>
              <span className="text-slate-400">erros</span>
            </div>
          </div>

          {/* Badge de progresso de revisão */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-medium text-[11px]">
              {revisadosCount} revisados
            </span>
            <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentualRevisados}%` }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              />
            </div>
          </div>

          {/* Alerta de limite */}
          <AnimatePresence>
            {isTreinoLimitado && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30"
              >
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-amber-400">
                  Treino limitado a 30 questões por sessão
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Lado direito - Ações */}
        <div className="flex items-center gap-3">
          {/* Botão "Não revisados" */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setIsHoveredFilter(true)}
            onMouseLeave={() => setIsHoveredFilter(false)}
            onClick={onMostrarNaoRevisados}
            className="relative group flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="relative">
              <Eye className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              {naoRevisados > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-2 w-3.5 h-3.5 text-[9px] font-bold rounded-full bg-blue-500 text-white flex items-center justify-center"
                >
                  {naoRevisados > 9 ? "9+" : naoRevisados}
                </motion.span>
              )}
            </div>
            <span className="text-sm text-slate-300 group-hover:text-blue-400 transition-colors">
              Não revisados
            </span>
            {isHoveredFilter && (
              <motion.div
                layoutId="filterTooltip"
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-900 border border-white/10 text-[10px] text-slate-400 whitespace-nowrap"
              >
                Mostrar apenas não revisados
              </motion.div>
            )}
          </motion.button>

          {/* Botão "Resetar revisados" */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setIsHoveredReset(true)}
            onMouseLeave={() => setIsHoveredReset(false)}
            onClick={onResetarRevisados}
            className="relative group flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 hover:border-amber-500/30 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-transform group-hover:rotate-180 duration-500" />
            <span className="text-sm text-slate-300 group-hover:text-amber-400 transition-colors">
              Resetar revisados
            </span>
            {isHoveredReset && (
              <motion.div
                layoutId="resetTooltip"
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-900 border border-white/10 text-[10px] text-slate-400 whitespace-nowrap"
              >
                Limpar todas as marcações de revisão
              </motion.div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Barra de progresso de exibição */}
      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
          <span>Progresso de exibição</span>
          <span>
            {Math.min(exibindo, total)}/{total}
          </span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(Math.min(exibindo, total) / total) * 100}%` }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
      </div>

      {/* Dica motivacional */}
      {naoRevisados > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.7 }}
          className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-500"
        >
          <Sparkles className="w-3 h-3 text-yellow-500" />
          <span>
            {naoRevisados} erro{naoRevisados !== 1 ? "s" : ""} ainda não
            revisados. Revise para consolidar o aprendizado!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
