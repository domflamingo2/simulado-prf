"use client";

import { motion } from "framer-motion";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group
        flex items-start gap-4
        ${
          checked
            ? "bg-emerald-500/10 border-emerald-500/50"
            : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600"
        }
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative shrink-0 mt-1">
        <div
          className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 flex items-center ${
            checked ? "bg-emerald-500" : "bg-slate-700"
          }`}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`w-5 h-5 rounded-full bg-white shadow-md ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </div>

      <div className="relative z-10">
        <span
          className={`block font-semibold text-sm transition-colors ${
            checked ? "text-emerald-300" : "text-slate-200"
          }`}
        >
          {label}
        </span>
        <span className="text-xs text-slate-400 block mt-1 leading-relaxed">
          {description}
        </span>
      </div>
    </button>
  );
}
