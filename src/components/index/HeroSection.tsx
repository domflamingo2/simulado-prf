// src/components/como-funciona/HeroSection.tsx
"use client";

import { useContadorConcurso } from "@/hooks/useContadorConcurso";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, Sparkles, Target } from "lucide-react";
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
    dataConcurso: "2026-10-25T09:00:00",
    onExpirado: () => console.log("🔥 Expirou"),
  });

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="relative text-center overflow-hidden py-8"
    >
      {/* Efeito de glow de fundo */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 text-sm mb-6 shadow-lg"
      >
        <Sparkles className="w-4 h-4" />
        <span className="font-medium">
          Plataforma completa para aprovação na PRF
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
      >
        Como Funciona
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
      >
        Simulados realistas da banca CEBRASPE, estatísticas detalhadas, IA
        adaptativa e gamificação para maximizar sua aprovação na
        <span className="text-white font-semibold">
          {" "}
          Polícia Rodoviária Federal
        </span>
        .
      </motion.p>

      {/* CONTADOR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        {!expirado ? (
          <div className="inline-flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/30 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">
                ⏰ Próximo Concurso PRF:
              </span>
            </div>

            <div className="flex gap-4 sm:gap-6">
              {[
                { label: "DIAS", value: dias, color: "text-blue-400" },
                { label: "HORAS", value: horas, color: "text-cyan-400" },
                { label: "MINUTOS", value: minutos, color: "text-purple-400" },
                { label: "SEGUNDOS", value: segundos, color: "text-pink-400" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center min-w-[60px] sm:min-w-[70px]"
                >
                  <motion.div
                    key={item.value}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`text-2xl sm:text-3xl font-bold ${item.color} tabular-nums`}
                  >
                    {String(item.value).padStart(2, "0")}
                  </motion.div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 tracking-wider font-medium">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span>Prepare-se com antecedência!</span>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm">
            <span className="text-amber-400">🎉</span>
            <span className="text-sm font-medium text-slate-200">
              Concurso em andamento! Boa sorte!
            </span>
          </div>
        )}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="mt-8"
      >
        <Link
          href="/dashboard"
          className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-base transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Começar Agora</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <p className="text-[10px] text-slate-500 mt-3">
          ✅ Gratuito • Sem compromisso • Acesso imediato
        </p>
      </motion.div>
    </motion.div>
  );
}
