"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Download,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface HeaderErrosProps {
  totalErros: number;
  onExportar: () => void;
  onLimparHistorico: () => void;
}

export function HeaderErros({
  totalErros,
  onExportar,
  onLimparHistorico,
}: HeaderErrosProps) {
  const [isExportHovered, setIsExportHovered] = useState(false);
  const [isClearHovered, setIsClearHovered] = useState(false);

  const hasErrors = totalErros > 0;

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Lado esquerdo - Logo e título */}
          <div className="flex items-center gap-4">
            {/* Botão voltar */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="block p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all duration-300 group"
                aria-label="Voltar ao início"
              >
                <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </Link>
            </motion.div>

            {/* Título e contador */}
            <div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-md animate-pulse" />
                  <XCircle className="relative w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Banco de Erros
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs sm:text-sm text-slate-400">
                  {totalErros} questão{totalErros !== 1 ? "s" : ""} para revisar
                </p>
                {hasErrors && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30"
                  >
                    <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                    <span className="text-[9px] text-amber-400 font-medium">
                      Atenção
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Lado direito - Ações */}
          <div className="flex items-center gap-2">
            {/* Botão Exportar */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsExportHovered(true)}
              onMouseLeave={() => setIsExportHovered(false)}
              onClick={onExportar}
              disabled={!hasErrors}
              className={`relative group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                hasErrors
                  ? "text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                  : "text-slate-500 cursor-not-allowed opacity-50"
              }`}
            >
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span className="hidden sm:inline text-sm font-medium">
                Exportar
              </span>

              {/* Tooltip */}
              {isExportHovered && hasErrors && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-900 border border-white/10 text-[10px] text-slate-400 whitespace-nowrap z-10"
                >
                  Exportar lista de erros para JSON
                </motion.div>
              )}
            </motion.button>

            {/* Botão Limpar Histórico */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsClearHovered(true)}
              onMouseLeave={() => setIsClearHovered(false)}
              onClick={onLimparHistorico}
              disabled={!hasErrors}
              className={`relative group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                hasErrors
                  ? "text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                  : "text-slate-500 cursor-not-allowed opacity-50"
              }`}
            >
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-sm font-medium">
                Limpar Histórico
              </span>

              {/* Tooltip */}
              {isClearHovered && hasErrors && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-900 border border-white/10 text-[10px] text-slate-400 whitespace-nowrap z-10"
                >
                  Apaga todo o histórico de simulados
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Barra decorativa inferior */}
      {hasErrors && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-0.5 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 origin-left"
        />
      )}
    </motion.header>
  );
}
