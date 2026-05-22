"use client";

import { motion } from "framer-motion";
import { Calendar, Trophy, Zap, Brain, CheckCircle2, Sparkles } from "lucide-react";

interface HeaderResultadoProps {
  data: string;
  modo: string;
  pontuacao?: number;
  classificacao?: string;
}

export function HeaderResultado({ data, modo, pontuacao, classificacao }: HeaderResultadoProps) {
  const modoConfig = {
    TURBO: {
      label: "Turbo",
      icon: Zap,
      cor: "from-amber-500 to-orange-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      texto: "text-amber-400",
      descricao: "50 questões em 40 minutos",
    },
    ADAPTATIVO: {
      label: "Adaptativo",
      icon: Brain,
      cor: "from-purple-500 to-pink-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      texto: "text-purple-400",
      descricao: "IA personaliza questões",
    },
    COMPLETO: {
      label: "Completo",
      icon: Trophy,
      cor: "from-blue-500 to-cyan-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      texto: "text-blue-400",
      descricao: "60 questões em 4 horas",
    },
  };

  const config = modoConfig[modo as keyof typeof modoConfig] || modoConfig.COMPLETO;
  const Icon = config.icon;
  const dataFormatada = new Date(data);
  const diaSemana = dataFormatada.toLocaleDateString("pt-BR", { weekday: "long" });
  const dia = dataFormatada.getDate();
  const mes = dataFormatada.toLocaleDateString("pt-BR", { month: "long" });
  const ano = dataFormatada.getFullYear();
  const hora = dataFormatada.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="text-center mb-10"
    >
      {/* Badge de data estilizada */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-white/10 text-sm text-slate-400 mb-6 shadow-lg"
      >
        <Calendar className="w-4 h-4 text-blue-400" />
        <span className="capitalize">{diaSemana}</span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span>{dia} de {mes}</span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span>{ano}</span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span>{hora}</span>
      </motion.div>

      {/* Ícone principal com efeito de brilho */}
      <div className="relative mb-5 flex justify-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
        />
        <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${config.cor} flex items-center justify-center shadow-2xl`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Título principal */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight"
      >
        Resultado do Simulado
      </motion.h1>

      {/* Modo com efeito de gradiente */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10 shadow-lg"
      >
        <span className={`text-xs font-medium ${config.texto} uppercase tracking-wider`}>
          Modo
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <div className={`flex items-center gap-1.5 ${config.texto}`}>
          <Icon className="w-3.5 h-3.5" />
          <span className="text-sm font-semibold">{config.label}</span>
        </div>
        <span className="w-1 h-1 rounded-full bg-slate-600" />
        <span className="text-xs text-slate-500">{config.descricao}</span>
      </motion.div>

      {/* Pontuação e classificação (se fornecidas) */}
      {pontuacao !== undefined && classificacao && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-5 flex items-center justify-center gap-4"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/10">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-slate-300">
              Pontuação: <span className="font-bold text-yellow-400">{pontuacao}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">
              {classificacao}
            </span>
          </div>
        </motion.div>
      )}

      {/* Linha decorativa */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 80 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mt-6"
      />
    </motion.div>
  );
}