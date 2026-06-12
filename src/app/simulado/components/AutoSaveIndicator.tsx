"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, Save } from "lucide-react";
import { useEffect, useState } from "react";

interface AutoSaveIndicatorProps {
  isSaving?: boolean;
  lastSaved?: Date | null;
  error?: string | null;
}

export function AutoSaveIndicator({
  isSaving = false,
  lastSaved = null,
  error = null,
}: AutoSaveIndicatorProps) {
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [showErrorIndicator, setShowErrorIndicator] = useState(false);

  // Quando termina de salvar (isSaving muda de true → false), mostra "Salvo" por 3s
  useEffect(() => {
    if (!isSaving && lastSaved) {
      setShowSavedIndicator(true);
      const timer = setTimeout(() => setShowSavedIndicator(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSaved]);

  // Quando surge um erro, mostra por 5s
  useEffect(() => {
    if (error) {
      setShowErrorIndicator(true);
      const timer = setTimeout(() => setShowErrorIndicator(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // O indicador fica visível se:
  // - estiver salvando agora, ou
  // - acabou de salvar (showSavedIndicator), ou
  // - há erro ativo, ou
  // - acabou de aparecer um erro (showErrorIndicator)
  const isVisible =
    isSaving || showSavedIndicator || !!error || showErrorIndicator;

  const getStatusConfig = () => {
    if (error || showErrorIndicator) {
      return {
        icon: AlertCircle,
        text: error || "Erro ao salvar",
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
        glow: "shadow-rose-500/20",
      };
    }
    if (isSaving) {
      return {
        icon: Save,
        text: "Salvando...",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        glow: "shadow-blue-500/20",
      };
    }
    if (showSavedIndicator || lastSaved) {
      return {
        icon: CheckCircle2,
        text: "Salvo",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        glow: "shadow-emerald-500/20",
      };
    }
    return {
      icon: Clock,
      text: "Auto-salvando a cada 30s",
      color: "text-slate-400",
      bg: "bg-slate-800/80",
      border: "border-slate-700",
      glow: "shadow-slate-500/20",
    };
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  const formatLastSaved = () => {
    if (!lastSaved) return "";
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    if (diff < 60) return ` há ${diff}s`;
    if (diff < 3600) return ` há ${Math.floor(diff / 60)}min`;
    return ` às ${lastSaved.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 50, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-24 right-4 z-20"
        >
          <div
            className={`
              relative flex items-center gap-2 px-3 py-2 rounded-full
              ${config.bg} ${config.border} ${config.glow}
              backdrop-blur-sm shadow-lg cursor-pointer
              transition-all duration-300 hover:scale-105
            `}
            onMouseEnter={() => setShowErrorIndicator(false)} // opcional: esconder tooltip ao passar mouse
          >
            {/* Ícone animado */}
            <motion.div
              animate={isSaving ? { rotate: 360 } : {}}
              transition={{
                duration: 1,
                repeat: isSaving ? Infinity : 0,
                ease: "linear",
              }}
            >
              <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
            </motion.div>

            <span className="text-xs font-medium text-slate-300">
              {config.text}
              {!isSaving && lastSaved && !error && showSavedIndicator && (
                <span className="text-[10px] text-slate-500 ml-1">
                  {formatLastSaved()}
                </span>
              )}
            </span>

            {/* Indicador de loading */}
            {isSaving && (
              <motion.div
                className="absolute -inset-0.5 rounded-full bg-blue-500/20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            {/* Tooltip de detalhes - mantido igual */}
            <div className="group relative">
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                <div className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 shadow-xl whitespace-nowrap">
                  <p className="text-xs text-slate-300">
                    {error ? (
                      <span className="text-rose-400">❌ {error}</span>
                    ) : isSaving ? (
                      <span>💾 Salvando suas respostas...</span>
                    ) : lastSaved ? (
                      <span>✅ Último salvamento{formatLastSaved()}</span>
                    ) : (
                      <span>⏱️ Salvamento automático a cada 30 segundos</span>
                    )}
                  </p>
                  <div className="absolute -bottom-1 right-3 w-2 h-2 rotate-45 bg-slate-900 border-r border-b border-white/10" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
