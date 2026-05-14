"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/ui/GlassCard";
import ProgressRing from "@/components/ui/ProgressRing";

interface NivelCardProps {
  nivel: number;
  nivelNome: string;
  nivelCor: string;
  progressoNivel: number;
  xpParaProximo: number;
}

export function NivelCard({
  nivel,
  nivelNome,
  nivelCor,
  progressoNivel,
  xpParaProximo,
}: NivelCardProps) {
  return (
    <GlassCard className="p-5 sm:p-6" glow="purple">
      <div className="flex items-center gap-5">
        <ProgressRing
          progress={progressoNivel}
          size={90}
          strokeWidth={8}
          color={nivelCor}
        >
          <div className="text-center">
            <span className="text-3xl font-bold text-white">{nivel}</span>
            <span className="text-[10px] text-slate-400 block">NÍVEL</span>
          </div>
        </ProgressRing>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-white mb-1">{nivelNome}</h2>
          <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: nivelCor }}
              initial={{ width: 0 }}
              animate={{ width: `${progressoNivel}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-slate-400">
            {xpParaProximo.toLocaleString("pt-BR")} XP para o próximo nível
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
