"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export function SuccessNotification() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-24 right-4 z-50 bg-emerald-500/90 backdrop-blur-md rounded-lg px-4 py-2 shadow-lg"
    >
      <div className="flex items-center gap-2 text-white">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Simulado finalizado com sucesso!</span>
      </div>
    </motion.div>
  );
}
