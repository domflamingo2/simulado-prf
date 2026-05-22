"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Sparkles, Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessNotificationProps {
  message?: string;
  duration?: number;
  onClose?: () => void;
  type?: "success" | "congrats" | "achievement";
}

export function SuccessNotification({
  message = "Simulado finalizado com sucesso!",
  duration = 4000,
  onClose,
  type = "success",
}: SuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const configs = {
    success: {
      icon: CheckCircle,
      bg: "from-emerald-600 to-emerald-500",
      border: "border-emerald-400/30",
      glow: "shadow-emerald-500/30",
    },
    congrats: {
      icon: Trophy,
      bg: "from-amber-600 to-orange-500",
      border: "border-amber-400/30",
      glow: "shadow-amber-500/30",
    },
    achievement: {
      icon: Sparkles,
      bg: "from-purple-600 to-pink-500",
      border: "border-purple-400/30",
      glow: "shadow-purple-500/30",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={`${type}-${message}`}
          initial={{ opacity: 0, x: 50, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 50, y: -20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-24 right-4 z-50"
        >
          <div
            className={`
              relative overflow-hidden rounded-2xl bg-gradient-to-r ${config.bg}
              border ${config.border} shadow-2xl ${config.glow}
              backdrop-blur-sm px-5 py-3 min-w-[280px]
            `}
          >
            {/* Brilho */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

            {/* Fundo decorativo */}
            <div className="absolute -bottom-2 -right-2 opacity-10">
              <Icon className="w-12 h-12" />
            </div>

            {/* Conteúdo */}
            <div className="relative flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="p-1.5 rounded-xl bg-white/20 backdrop-blur-sm"
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{message}</p>

                {type === "congrats" && (
                  <p className="text-[10px] text-white/80 mt-0.5">
                    🎉 Continue assim!
                  </p>
                )}

                {type === "achievement" && (
                  <p className="text-[10px] text-white/80 mt-0.5">
                    ⭐ Conquista desbloqueada!
                  </p>
                )}
              </div>

              <button
                onClick={() => {
                  setIsVisible(false);
                  onClose?.();
                }}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-3.5 h-3.5 text-white/70" />
              </button>
            </div>

            {/* Barra progresso */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{
                duration: duration / 1000,
                ease: "linear",
              }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-full origin-left"
            />

            {/* Confete */}
            {type === "congrats" && (
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-3 h-3 text-yellow-300" />
              </motion.div>
            )}
          </div>

          <style jsx>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
