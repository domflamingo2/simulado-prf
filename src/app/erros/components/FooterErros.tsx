"use client";

import { motion } from "framer-motion";

interface FooterErrosProps {
  exibindo: number;
  total: number;
  naoRevisados: number;
  onMostrarNaoRevisados: () => void;
  onResetarRevisados: () => void;
}

export function FooterErros({
  exibindo,
  total,
  naoRevisados,
  onMostrarNaoRevisados,
  onResetarRevisados,
}: FooterErrosProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-slate-600"
    >
      <p>
        Mostrando {exibindo} de {total} erros
        {exibindo > 30 && " • Treino limitado a 30 questões por sessão"}
      </p>
      <div className="flex gap-4">
        <button
          onClick={onMostrarNaoRevisados}
          className="text-slate-500 hover:text-blue-400 transition-colors"
        >
          Não revisados ({naoRevisados})
        </button>
        <button
          onClick={onResetarRevisados}
          className="text-slate-500 hover:text-amber-400 transition-colors"
        >
          Resetar revisados
        </button>
      </div>
    </motion.div>
  );
}
