"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, Sparkles } from "lucide-react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
  icon?: "eye" | "check" | "sparkles";
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  icon = "eye",
}: ToggleSwitchProps) {
  const getIcon = () => {
    if (icon === "eye")
      return checked ? (
        <Eye className="w-3.5 h-3.5" />
      ) : (
        <EyeOff className="w-3.5 h-3.5" />
      );
    if (icon === "check") return <CheckCircle2 className="w-3.5 h-3.5" />;
    return <Sparkles className="w-3.5 h-3.5" />;
  };

  const Icon = getIcon();

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className={`
        w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group
        flex items-start gap-4 cursor-pointer
        ${
          checked
            ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
            : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600"
        }
      `}
    >
      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Ícone decorativo de fundo */}
      <div
        className={`absolute bottom-2 right-2 opacity-5 transition-opacity ${checked ? "opacity-10" : "opacity-5"}`}
      >
        {Icon}
      </div>

      {/* Toggle switch */}
      <div className="relative shrink-0 mt-0.5">
        <div
          className={`w-12 h-6 rounded-full p-0.5 transition-all duration-300 flex items-center shadow-inner ${
            checked
              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
              : "bg-slate-700"
          }`}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`w-5 h-5 rounded-full bg-white shadow-md ${
              checked ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {checked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Indicador de loading sutil */}
        {checked && (
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-500/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Conteúdo textual */}
      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`block font-semibold text-sm transition-colors ${
              checked ? "text-emerald-300" : "text-slate-200"
            }`}
          >
            {label}
          </span>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-0.5"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400">Ativo</span>
            </motion.div>
          )}
        </div>
        <p
          className={`text-xs mt-1 leading-relaxed transition-colors ${checked ? "text-slate-400" : "text-slate-500"}`}
        >
          {description}
        </p>
      </div>

      {/* Badge de recomendação */}
      {!checked && (
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      )}
    </motion.button>
  );
}
