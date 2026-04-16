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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PRF Simulado
              </h1>
              <p className="text-xs text-slate-400">Banca CEBRASPE</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {streakDias > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30"
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                <span className="text-xs sm:text-sm font-bold text-orange-300">
                  {streakDias} dias
                </span>
              </motion.div>
            )}

            <div
              className="px-2 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all hover:scale-105"
              style={{
                backgroundColor: `${nivelCor}15`,
                borderColor: `${nivelCor}40`,
                color: nivelCor,
              }}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{nivelNome}</span>
              <span className="sm:hidden">Nv.{nivel}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
