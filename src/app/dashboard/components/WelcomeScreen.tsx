"use client";

import { motion } from "framer-motion";
import { Play, Target } from "lucide-react";

import ModoCard from "@/components/ui/ModoCard";

const MODOS_ESTUDO = [
  {
    href: "/simulado?modo=completo",
    icon: Play,
    variant: "blue",
    title: "Simulado Completo",
    description: "60 questões • 4 horas • Ambiente real CEBRASPE",
    xp: "+50 XP",
    tag: "Prova oficial",
    shortcut: "Ctrl+N",
  },
  {
    href: "/simulado?modo=turbo",
    icon: Zap,
    variant: "amber",
    title: "Modo Turbo",
    description: "50 questões • 40 min • Revisão rápida",
    xp: "+30 XP",
    tag: "Desafio velocidade",
    shortcut: "Ctrl+T",
  },
  {
    href: "/treino",
    icon: BookOpen,
    variant: "emerald",
    title: "Treino Específico",
    description: "Foque na sua disciplina mais fraca",
    xp: "+20 XP",
    tag: "Explicação imediata",
  },
  {
    href: "/erros",
    icon: XCircle,
    variant: "rose",
    title: "Revisar Erros",
    description: "Banco de questões que você errou",
    xp: "+15 XP",
    tag: "Aprenda com falhas",
    shortcut: "Ctrl+E",
  },
] as const;

import { BookOpen, XCircle, Zap } from "lucide-react";

interface WelcomeScreenProps {
  onIniciar: () => void;
}

export function WelcomeScreen({ onIniciar }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center shadow-2xl shadow-blue-500/20">
            <Target className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
          Bem-vindo ao PRF Simulado
        </h1>
        <p className="text-slate-400 mb-8 text-lg leading-relaxed">
          Você ainda não possui histórico de simulados. Comece sua jornada.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          {MODOS_ESTUDO.map((modo, i) => (
            <ModoCard key={modo.href} {...modo} index={i} />
          ))}
        </div>

        <button
          onClick={onIniciar}
          className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white transition-all duration-200 shadow-lg shadow-blue-600/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:from-blue-500 group-hover:to-purple-500" />
          <div className="relative flex items-center gap-2.5 z-10">
            <Play className="w-5 h-5 fill-white" />
            <span>Começar Agora</span>
          </div>
        </button>
      </motion.div>
    </div>
  );
}
