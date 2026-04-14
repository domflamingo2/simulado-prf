"use client";

import { useContadorConcurso } from "@/hooks/useContadorConcurso";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Target } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
  prefersReducedMotion?: boolean;
}

export function HeroSection({
  prefersReducedMotion: propPrefersReducedMotion,
}: HeroSectionProps) {
  const hookPrefersReducedMotion = useReducedMotion();
  const prefersReducedMotion =
    propPrefersReducedMotion ?? hookPrefersReducedMotion;

  const { dias, horas, minutos, segundos, expirado } = useContadorConcurso({
    dataConcurso: "2026-11-30T09:00:00",
    onExpirado: () => console.log("🔥 Expirou"),
  });

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
        <Sparkles className="w-4 h-4" />
        Plataforma completa para aprovação na PRF
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Como Funciona
      </h1>

      {/* Description */}
      <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Simulados realistas da banca CEBRASPE, estatísticas detalhadas, IA
        adaptativa e gamificação para maximizar sua aprovação na
        <span className="text-white font-semibold">
          {" "}
          Polícia Rodoviária Federal
        </span>
        .
      </p>

      {/* CONTADOR */}
      {!expirado ? (
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4 sm:px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/10">
          <span className="text-sm font-medium text-slate-300">
            🎯 Próximo Concurso PRF:
          </span>

          <div className="flex gap-3 sm:gap-5">
            {[
              { label: "Dias", value: dias },
              { label: "Horas", value: horas },
              { label: "Min", value: minutos },
              { label: "Seg", value: segundos },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center min-w-[55px] sm:min-w-[65px]"
              >
                <div className="text-xl sm:text-2xl font-bold text-blue-400">
                  {item.value}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500/20 border border-amber-500/30">
          <span className="text-amber-400">🎉</span>
          <span className="text-sm font-medium text-slate-200">
            Concurso em andamento! Boa sorte!
          </span>
        </div>
      )}

      {/* CTA */}
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          <Target className="w-5 h-5" />
          Começar Agora
        </Link>
      </div>
    </motion.div>
  );
}
