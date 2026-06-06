"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Save, Shield, X } from "lucide-react";
import { useState } from "react";

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
  const [isHoveredCancel, setIsHoveredCancel] = useState(false);

  const percentual = (respondidas / total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl overflow-hidden"
      >
        {/* Gradiente decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-500/5 to-transparent rounded-full blur-xl" />

        {/* Ícone decorativo de fundo */}
        <Shield className="absolute bottom-4 right-4 w-16 h-16 text-slate-700/20" />

        <div className="relative">
          {/* Header com ícone animado */}
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="p-2 rounded-xl bg-amber-500/20"
            >
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-white">Sair do simulado?</h3>
          </div>

          {/* Mensagem principal */}
          <p className="text-slate-400 mb-4 leading-relaxed">
            Você respondeu{" "}
            <span className="text-emerald-400 font-bold">{respondidas}</span> de{" "}
            <span className="text-white font-bold">{total}</span> questões.
          </p>

          {/* Barra de progresso */}
          <div className="mb-5">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
              <span>Progresso</span>
              <span>{Math.round(percentual)}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentual}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              />
            </div>
          </div>

          {/* Informação de salvamento */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-5">
            <Save className="w-3.5 h-3.5 text-blue-400" />
            <p className="text-xs text-slate-300">
              Seu progresso foi{" "}
              <span className="text-blue-400 font-medium">
                salvo automaticamente
              </span>{" "}
              e você pode continuar depois.
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsHoveredCancel(true)}
              onMouseLeave={() => setIsHoveredCancel(false)}
              onClick={onCancel}
              className="flex-1 relative overflow-hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all duration-200 group"
            >
              <X
                className={`w-4 h-4 transition-transform duration-300 ${isHoveredCancel ? "rotate-90" : ""}`}
              />
              <span>Continuar</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="flex-1 relative overflow-hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-red-500/20 hover:from-rose-500/30 hover:to-red-500/30 text-rose-400 border border-rose-500/30 transition-all duration-200 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span>Sair e salvar</span>
            </motion.button>
          </div>

          {/* Dica adicional */}
          <p className="text-[10px] text-slate-600 text-center mt-4">
            💡 Seu progresso será mantido mesmo saindo
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
