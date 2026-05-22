"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Play,
  Sparkles,
  Target,
  XCircle,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

interface WelcomeScreenProps {
  onIniciar?: () => void;
}

export function WelcomeScreen({ onIniciar }: WelcomeScreenProps) {
  const router = useRouter();

  const handleIniciar = () => {
    if (onIniciar) {
      onIniciar();
    }
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
      {/* Container principal com animação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto"
      >
        {/* Header com ícone animado */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-6">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 blur-2xl opacity-30 animate-pulse" />

            {/* Ícone central */}
            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-2xl">
              <Target className="w-12 h-12 text-blue-400" />

              {/* Ícone decorativo */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            </div>
          </div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-300 to-purple-400 bg-clip-text text-transparent mb-3"
          >
            PRF Simulado
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-slate-400 text-lg max-w-md mx-auto"
          >
            Prepare-se para o concurso da Polícia Rodoviária Federal
          </motion.p>
        </motion.div>

        {/* Cards dos modos de estudo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-10"
        >
          <div className="text-center mb-5">
            <p className="text-sm text-slate-500 uppercase tracking-wider">
              Modos de Estudo
            </p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODOS_ESTUDO.map((modo, i) => (
              <motion.div
                key={modo.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              >
                <ModoCard {...modo} index={i} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Botão principal com efeito de onda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center"
        >
          <motion.button
            onClick={handleIniciar}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden shadow-lg shadow-blue-600/30"
          >
            {/* Background gradiente animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] animate-gradient transition-all duration-300 group-hover:from-blue-500 group-hover:to-purple-500" />

            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            {/* Conteúdo do botão */}
            <div className="relative flex items-center gap-3 z-10">
              <Play className="w-5 h-5 fill-white" />
              <span className="text-lg">Começar Agora</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Estilos customizados */}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
