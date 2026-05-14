"use client";

import { AnimatePresence, motion } from "framer-motion";

interface LevelUpModalProps {
  show: boolean;
  nivel: number;
  nivelNome: string;
  nivelCor: string;
  onDismiss: () => void;
  prefersReducedMotion?: boolean;
}

export function LevelUpModal({
  show,
  nivel,
  nivelNome,
  nivelCor,
  onDismiss,
  prefersReducedMotion = false,
}: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.5, y: 80 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 80 }}
            transition={{ type: "spring", damping: 18, stiffness: 200 }}
            className="text-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={
                prefersReducedMotion
                  ? {}
                  : { rotate: [0, 12, -12, 0], scale: [1, 1.2, 1] }
              }
              transition={{ duration: 0.6, repeat: 2 }}
              className="text-7xl mb-6 select-none"
            >
              🎉
            </motion.div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              LEVEL UP!
            </h2>
            <p className="text-lg text-slate-300 mb-4">Você alcançou</p>
            <div
              className="inline-block px-8 py-4 rounded-2xl bg-slate-800/80 border-2 mb-6"
              style={{ borderColor: nivelCor }}
            >
              <span className="text-3xl font-bold text-white block">
                {nivelNome}
              </span>
              <span className="text-sm text-slate-400">Nível {nivel}</span>
            </div>
            <button
              onClick={onDismiss}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold transition-all shadow-lg shadow-blue-500/25"
            >
              Continuar Jornada
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
