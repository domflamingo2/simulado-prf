"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";

type PeriodoFiltro = "7" | "30" | "90" | "todos";

interface HeaderEstatisticasProps {
  periodo: PeriodoFiltro;
  setPeriodo: (periodo: PeriodoFiltro) => void;
}

export function HeaderEstatisticas({
  periodo,
  setPeriodo,
}: HeaderEstatisticasProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Estatísticas Detalhadas
              </h1>
              <p className="text-sm text-slate-400">
                Análise completa do seu desempenho
              </p>
            </div>
          </div>

          <nav
            className="flex gap-2 overflow-x-auto pb-1 sm:pb-0"
            aria-label="Filtro de período"
          >
            {(
              [
                { value: "7", label: "7 dias" },
                { value: "30", label: "30 dias" },
                { value: "90", label: "3 meses" },
                { value: "todos", label: "Todo período" },
              ] as const
            ).map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriodo(p.value)}
                aria-pressed={periodo === p.value}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${
                    periodo === p.value
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}
              >
                {p.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}