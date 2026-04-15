"use client";

import { motion } from "framer-motion";
import { Brain, Download, RotateCcw, Share2 } from "lucide-react";
import Link from "next/link";

interface AcoesResultadoProps {
  gerandoImagem: boolean;
  onRefazer: () => void;
  onCompartilhar: () => void;
  onSalvarImagem: () => void;
}

export function AcoesResultado({
  gerandoImagem,
  onRefazer,
  onCompartilhar,
  onSalvarImagem,
}: AcoesResultadoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="flex flex-col sm:flex-row gap-3 justify-center"
    >
      <Link
        href="/revisao"
        className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
      >
        <Brain className="w-5 h-5" />
        Revisar Questões
      </Link>

      <button
        onClick={onRefazer}
        className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all hover:scale-105"
      >
        <RotateCcw className="w-5 h-5" />
        Refazer Simulado
      </button>

      <button
        onClick={onCompartilhar}
        disabled={gerandoImagem}
        className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {gerandoImagem ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full"
          />
        ) : (
          <Share2 className="w-5 h-5" />
        )}
        {gerandoImagem ? "Gerando..." : "Compartilhar"}
      </button>

      <button
        onClick={onSalvarImagem}
        disabled={gerandoImagem}
        className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50"
      >
        <Download className="w-5 h-5" />
        Salvar Imagem
      </button>
    </motion.div>
  );
}
