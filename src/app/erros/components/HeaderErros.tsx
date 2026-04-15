"use client";

import { motion } from "framer-motion";
import { BookOpen, Download, Trash2, XCircle } from "lucide-react";
import Link from "next/link";

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
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              aria-label="Voltar ao início"
            >
              <BookOpen className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <XCircle className="w-6 h-6 text-rose-500" />
                Banco de Erros
              </h1>
              <p className="text-sm text-slate-400">
                {totalErros} questão
                {totalErros !== 1 ? "ões" : ""} para revisar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportar}
              className="flex items-center gap-2 px-4 py-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <button
              onClick={onLimparHistorico}
              className="flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-sm"
              title="Apaga todo o histórico de simulados"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Limpar Histórico</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
