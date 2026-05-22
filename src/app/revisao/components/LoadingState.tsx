"use client";

import { motion } from "framer-motion";
import { BookOpen, Loader2, Sparkles } from "lucide-react";

interface LoadingStateProps {
  mensagem?: string;
  subtitulo?: string;
}

export function LoadingState({
  mensagem = "Carregando revisão...",
  subtitulo = "Preparando suas questões",
}: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="flex flex-col items-center gap-6 text-center"
      >
        {/* Ícone animado */}
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
          />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>
        </div>

        {/* Spinner */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-blue-400 animate-pulse" />
          </div>
        </div>

        {/* Mensagem */}
        <div className="space-y-1.5">
          <p className="text-slate-200 font-medium">
            {mensagem}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block w-4 text-left"
            >
              ...
            </motion.span>
          </p>
          <p className="text-slate-500 text-sm">{subtitulo}</p>
        </div>

        {/* Barras de progresso animadas */}
        <div className="flex gap-1 mt-2">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                height: [8, 16, 8],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
            />
          ))}
        </div>

        {/* Dica */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] text-slate-600 max-w-xs"
        >
          💡 Revisar questões erradas ajuda a fixar o conteúdo
        </motion.p>
      </motion.div>
    </div>
  );
}
