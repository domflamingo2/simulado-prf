"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  mensagem: string;
  onTentarNovamente?: () => void;
}

export function ErrorState({ mensagem, onTentarNovamente }: ErrorStateProps) {
  const handleRetry = () => {
    if (onTentarNovamente) {
      onTentarNovamente();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        {/* Ícone com animação de pulso */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-rose-500/20 to-red-600/20 border border-rose-500/30 flex items-center justify-center"
        >
          <AlertTriangle className="w-10 h-10 text-rose-400" />
        </motion.div>

        <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar</h2>
        <p className="text-slate-400 mb-6">{mensagem}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            Tentar novamente
          </button>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Voltar ao início
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
