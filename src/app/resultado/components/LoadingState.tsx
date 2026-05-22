"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingStateProps {
  mensagem?: string;
  tipo?: "simulado" | "resultado" | "dashboard" | "videoaulas";
}

const mensagensConfig = {
  simulado: [
    "Preparando questões...",
    "Selecionando provas...",
    "Organizando simulado...",
    "Quase lá...",
    "Boa sorte! 🍀",
  ],
  resultado: [
    "Processando resultados...",
    "Calculando estatísticas...",
    "Gerando gráficos...",
    "Analisando desempenho...",
    "Quase pronto!",
  ],
  dashboard: [
    "Carregando seu progresso...",
    "Buscando dados...",
    "Organizando informações...",
    "Preparando dashboard...",
    "Bem-vindo de volta! 👋",
  ],
  videoaulas: [
    "Carregando vídeos...",
    "Organizando playlists...",
    "Buscando thumbnails...",
    "Preparando conteúdo...",
    "Aperte o play! 🎬",
  ],
};

const icones = {
  simulado: Target,
  resultado: Brain,
  dashboard: Sparkles,
  videoaulas: Zap,
};

export function LoadingState({
  mensagem = "Carregando...",
  tipo = "resultado",
}: LoadingStateProps) {
  const [mensagemIndex, setMensagemIndex] = useState(0);
  const [pontos, setPontos] = useState(0);
  const Icon = icones[tipo];
  const mensagens = mensagensConfig[tipo];

  // Rotação de mensagens
  useEffect(() => {
    if (mensagens) {
      const interval = setInterval(() => {
        setMensagemIndex((prev) => (prev + 1) % mensagens.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [mensagens]);

  // Animação de pontos
  useEffect(() => {
    const interval = setInterval(() => {
      setPontos((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const pontosTexto = ".".repeat(pontos);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="flex flex-col items-center gap-6 text-center"
      >
        {/* Ícone animado */}
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
          />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Spinner principal */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 rounded-full border-3 border-blue-500/20 border-t-blue-500 border-r-purple-500/50"
          />

          {/* Spinner secundário (efeito de contraste) */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-14 h-14 rounded-full border-2 border-purple-500/10 border-l-purple-500 border-b-transparent"
          />
        </div>

        {/* Mensagem principal */}
        <div className="space-y-2">
          {mensagens ? (
            <motion.p
              key={mensagemIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-medium text-white"
            >
              {mensagens[mensagemIndex]}
              <span className="inline-block w-6 text-left">{pontosTexto}</span>
            </motion.p>
          ) : (
            <p className="text-lg font-medium text-white">
              {mensagem}
              <span className="inline-block w-6 text-left">{pontosTexto}</span>
            </p>
          )}

          {/* Subtítulo */}
          <p className="text-sm text-slate-400">
            Isso pode levar alguns segundos
          </p>
        </div>

        {/* Barras de progresso animadas */}
        <div className="flex gap-1 mt-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{
                height: [8, 16, 8],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              className="w-1.5 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
            />
          ))}
        </div>

        {/* Dica de carregamento */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="text-[10px] text-slate-600 mt-4 max-w-xs"
        >
          💡 Dica: Aproveite o tempo de carregamento para relaxar e se preparar
        </motion.p>
      </motion.div>
    </div>
  );
}
