"use client";

import { motion } from "framer-motion";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-xl border-2 border-blue-500 border-t-transparent"
        />
        <p className="text-slate-400">Carregando resultado...</p>
      </motion.div>
    </div>
  );
}
