"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface HeaderResultadoProps {
  data: string;
  modo: string;
}

export function HeaderResultado({ data, modo }: HeaderResultadoProps) {
  const modoLabel =
    {
      TURBO: "Turbo ⚡",
      ADAPTATIVO: "Adaptativo 🎯",
      COMPLETO: "Completo 📚",
    }[modo] || "Completo 📚";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-400 mb-4">
        <Calendar className="w-4 h-4" />
        {new Date(data).toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
        Resultado do Simulado
      </h1>
      <p className="text-slate-400">Modo {modoLabel}</p>
    </motion.div>
  );
}
