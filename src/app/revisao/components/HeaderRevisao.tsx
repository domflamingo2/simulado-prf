"use client";

import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  Home,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { StatBadge } from "./StatBadge";

interface HeaderRevisaoProps {
  data: string;
  classificacaoMensagem: string;
  estatisticas: {
    acertos: number;
    erros: number;
    pontuacao: number;
  };
  progresso: {
    atual: number;
    total: number;
  };
}

export function HeaderRevisao({
  data,
  classificacaoMensagem,
  estatisticas,
  progresso,
}: HeaderRevisaoProps) {
  const [isHoveredHome, setIsHoveredHome] = useState(false);
  const percentual = (progresso.atual / progresso.total) * 100;

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Linha superior */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Lado esquerdo */}
          <div className="flex items-center gap-3">
            {/* Botão voltar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHoveredHome(true)}
              onMouseLeave={() => setIsHoveredHome(false)}
            >
              <Link
                href="/"
                className="block p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-all duration-300 group"
                aria-label="Voltar ao início"
              >
                <Home
                  className={`w-4 h-4 text-slate-400 transition-colors duration-300 ${isHoveredHome ? "text-white" : ""}`}
                />
              </Link>
            </motion.div>

            {/* Título e data */}
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <Award className="w-3.5 h-3.5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-white">
                  Revisão de Simulado
                </h1>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[11px] text-slate-400">{data}</p>
                <div className="w-1 h-1 rounded-full bg-slate-600" />
                <div className="flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-yellow-500" />
                  <p className="text-[11px] text-slate-400">
                    {classificacaoMensagem}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Badges de estatísticas */}
          <div className="flex items-center gap-2">
            <StatBadge
              icon={CheckCircle2}
              label="Acertos"
              value={estatisticas.acertos}
              color="emerald"
            />
            <StatBadge
              icon={XCircle}
              label="Erros"
              value={estatisticas.erros}
              color="rose"
            />
            <StatBadge
              icon={Trophy}
              label="Pontuação"
              value={estatisticas.pontuacao}
              color="amber"
            />
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Progresso da revisão</span>
              <span className="text-blue-400 font-semibold">
                {progresso.atual}
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-slate-400">{progresso.total}</span>
            </div>
            <span className="text-slate-500 font-mono">
              {Math.round(percentual)}%
            </span>
          </div>

          <div className="relative">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentual}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra decorativa */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
      />

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </motion.header>
  );
}
