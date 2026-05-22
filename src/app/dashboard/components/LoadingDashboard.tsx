"use client";

import { motion } from "framer-motion";
import { Loader2, Target } from "lucide-react";

export function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 blur-xl"
          />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
            <Target className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Spinner principal */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-blue-400 animate-pulse" />
          </div>
        </div>

        {/* Barras de loading */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 150 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-1.5 rounded-full bg-blue-400"
              />
            ))}
          </div>
        </div>

        {/* Texto de loading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-slate-400 text-sm font-medium">
            Carregando Dashboard
          </p>
          <p className="text-slate-500 text-xs mt-1 animate-pulse">
            Preparando seus dados...
          </p>
        </motion.div>

        {/* Dica de carregamento */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="text-[10px] text-slate-600 absolute bottom-8 left-0 right-0 text-center"
        >
          ⚡ Aproveite para dar uma alongada nos ombros!
        </motion.p>
      </div>
    </div>
  );
}
