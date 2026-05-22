"use client";

import { motion } from "framer-motion";
import { Flame, Target, Trophy } from "lucide-react";
import Link from "next/link";

interface HeaderDashboardProps {
  streakDias: number;
  nivel: number;
  nivelNome: string;
  nivelCor: string;
}

export function HeaderDashboard({
  streakDias,
  nivel,
  nivelNome,
  nivelCor,
}: HeaderDashboardProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PRF Simulado
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500">
                Banca CEBRASPE • 2026
              </p>
            </div>
          </Link>

          {/* Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {streakDias > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 backdrop-blur-sm"
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                <span className="text-xs sm:text-sm font-bold text-orange-300">
                  {streakDias}
                </span>
                <span className="text-[10px] text-orange-500/70 hidden sm:inline">
                  dias
                </span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="px-2 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all backdrop-blur-sm"
              style={{
                backgroundColor: `${nivelCor}15`,
                borderColor: `${nivelCor}40`,
                color: nivelCor,
              }}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{nivelNome}</span>
              <span className="sm:hidden">Nv.{nivel}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Barra de progresso */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6 }}
        className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
      />
    </header>
  );
}
