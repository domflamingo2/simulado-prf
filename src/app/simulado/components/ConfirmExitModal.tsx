"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmExitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  respondidas: number;
  total: number;
}

export function ConfirmExitModal({
  onConfirm,
  onCancel,
  respondidas,
  total,
}: ConfirmExitModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Sair do simulado?</h3>
        </div>
        <p className="text-slate-400 mb-4">
          Você respondeu {respondidas} de {total} questões. Seu progresso foi
          salvo e você pode continuar depois.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            Continuar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
          >
            Sair e salvar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
