"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  mensagem: string;
}

export function ErrorState({ mensagem }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar</h2>
        <p className="text-slate-400 mb-6">{mensagem}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
          >
            Voltar ao início
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
