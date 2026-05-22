"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Crown, Sparkles, Star, Trophy } from "lucide-react";

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
  const isMaxLevel = nivel >= 10;
  const LevelIcon = isMaxLevel ? Crown : Trophy;

  const triggerConfetti = () => {
    if (prefersReducedMotion) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [nivelCor, "#3b82f6", "#8b5cf6", "#ec4899"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6, x: 0.3 },
        colors: [nivelCor, "#f59e0b"],
      });
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6, x: 0.7 },
        colors: [nivelCor, "#10b981"],
      });
    }, 200);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={onDismiss}
          onAnimationComplete={() => {
            if (show && !prefersReducedMotion) {
              triggerConfetti();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.7, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
              duration: 0.5,
            }}
            className="relative text-center max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Efeito de glow de fundo */}
            <div
              className="absolute -inset-4 rounded-3xl blur-3xl opacity-30"
              style={{ backgroundColor: nivelCor }}
            />

            {/* Card principal */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-white/10 p-8 shadow-2xl overflow-hidden">
              {/* Partículas decorativas */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-xl" />

              {/* Ícone de decoração */}
              <div className="absolute top-4 left-4 opacity-20">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="absolute bottom-4 right-4 opacity-20">
                <Sparkles className="w-8 h-8" />
              </div>

              {/* Emoji/Ícone animado */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.3, 1],
                        rotate: [0, -10, 10, -10, 0],
                      }
                }
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-8xl mb-4 select-none"
              >
                {isMaxLevel ? "👑" : "🎉"}
              </motion.div>

              {/* Badge de conquista */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 mb-4"
              >
                <Star className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-medium text-yellow-400 uppercase tracking-wider">
                  Conquista Desbloqueada
                </span>
              </motion.div>

              {/* Título */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
              >
                LEVEL UP!
              </motion.h2>

              {/* Subtítulo */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-400 mb-5"
              >
                Você alcançou o nível
              </motion.p>

              {/* Card do nível */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="inline-block w-full mb-6"
              >
                <div
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 border-2"
                  style={{
                    background: `linear-gradient(135deg, ${nivelCor}15, ${nivelCor}05)`,
                    borderColor: `${nivelCor}50`,
                  }}
                >
                  {/* Efeito de brilho */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${nivelCor}, transparent 70%)`,
                    }}
                  />

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: `${nivelCor}20` }}
                      >
                        <LevelIcon
                          className="w-6 h-6"
                          style={{ color: nivelCor }}
                        />
                      </div>
                      <div className="text-left">
                        <span className="text-2xl font-bold text-white block">
                          {nivelNome}
                        </span>
                        <span className="text-xs text-slate-500">
                          Nível {nivel}
                        </span>
                      </div>
                    </div>

                    {/* Badge de recompensa */}
                    <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                      <p className="text-xs font-bold text-yellow-400">
                        +100 XP
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mensagem motivacional */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-slate-400 mb-6"
              >
                {isMaxLevel
                  ? "🏆 Você atingiu o nível máximo! Parabéns, lendário!"
                  : "⚡ Continue estudando para alcançar o próximo nível!"}
              </motion.p>

              {/* Botão de ação */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDismiss}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group"
              >
                <span>Continuar Jornada</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
