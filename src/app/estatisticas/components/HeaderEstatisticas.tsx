"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type PeriodoFiltro = "7" | "30" | "90" | "todos";

interface HeaderEstatisticasProps {
  periodo: PeriodoFiltro;
  setPeriodo: (periodo: PeriodoFiltro) => void;
  totalSimulados?: number;
}

export function HeaderEstatisticas({
  periodo,
  setPeriodo,
  totalSimulados,
}: HeaderEstatisticasProps) {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const opcoes = [
    { value: "7", label: "7 dias", icon: "📊" },
    { value: "30", label: "30 dias", icon: "📈" },
    { value: "90", label: "3 meses", icon: "📉" },
    { value: "todos", label: "Todo período", icon: "📚" },
  ] as const;

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Lado esquerdo - Título e navegação */}
          <div className="flex items-center gap-4">
            {/* Botão voltar */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="block p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-all duration-300 group"
                aria-label="Voltar ao início"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </Link>
            </motion.div>

            {/* Título */}
            <div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md animate-pulse" />
                  <div className="relative p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  Estatísticas Detalhadas
                </h1>
                {totalSimulados && totalSimulados > 0 && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
                    {totalSimulados} simulado{totalSimulados !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-slate-400">
                  Análise completa do seu desempenho
                </p>
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-500">
                  <Sparkles className="w-2.5 h-2.5 text-yellow-500" />
                  <span>Dados em tempo real</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado direito - Filtros */}
          <div className="flex items-center gap-3">
            {/* Ícone decorativo */}
            <div className="hidden md:flex items-center gap-1.5 text-[10px] text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>Filtrar por:</span>
            </div>

            {/* Botões de período */}
            <nav className="flex gap-1.5" aria-label="Filtro de período">
              {opcoes.map((p) => (
                <motion.button
                  key={p.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setIsHovered(p.value)}
                  onMouseLeave={() => setIsHovered(null)}
                  onClick={() => setPeriodo(p.value)}
                  aria-pressed={periodo === p.value}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 overflow-hidden ${
                    periodo === p.value
                      ? "text-white shadow-lg"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/70 hover:text-slate-200"
                  }`}
                >
                  {/* Gradiente do botão ativo */}
                  {periodo === p.value && (
                    <motion.div
                      layoutId="activePeriod"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}

                  {/* Conteúdo */}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span className="text-sm">{p.icon}</span>
                    {p.label}
                  </span>

                  {/* Efeito de brilho no hover */}
                  {isHovered === p.value && periodo !== p.value && (
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Badge de informação */}
            {periodo !== "todos" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30"
              >
                <TrendingUp className="w-2.5 h-2.5 text-blue-400" />
                <span className="text-[9px] text-blue-400 font-medium">
                  Últimos {periodo} dias
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Barra decorativa inferior */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
      />
    </motion.header>
  );
}
