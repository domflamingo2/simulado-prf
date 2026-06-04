"use client";

import { motion } from "framer-motion";
import { Layers, Sparkles, Target } from "lucide-react";

import { questoes } from "@/data/questoes";
import { Disciplina } from "@/data/questoes/index";

import { DisciplinaCard } from "./DisciplinaCard";

export const DISCIPLINAS_CONFIG: {
  value: Disciplina;
  label: string;
  icon: any;
  color: string;
  bgGradient: string;
  iconBg: string;
  emoji?: string;
}[] = [
  {
    value: "PORTUGUES",
    label: "Língua Portuguesa",
    icon: require("lucide-react").FileText,
    color: "text-blue-400",
    bgGradient: "group-hover:bg-blue-500/5 border-blue-500/20",
    iconBg: "bg-blue-500/10 text-blue-400",
    emoji: "📖",
  },
  {
    value: "ETICA",
    label: "Ética e Conduta",
    icon: require("lucide-react").ShieldCheck,
    color: "text-purple-400",
    bgGradient: "group-hover:bg-purple-500/5 border-purple-500/20",
    iconBg: "bg-purple-500/10 text-purple-400",
    emoji: "✨",
  },
  {
    value: "RACIOCINIO_LOGICO",
    label: "Raciocínio Lógico",
    icon: require("lucide-react").BrainCircuit,
    color: "text-pink-400",
    bgGradient: "group-hover:bg-pink-500/5 border-pink-500/20",
    iconBg: "bg-pink-500/10 text-pink-400",
    emoji: "🧠",
  },
  {
    value: "DIREITO_CONSTITUCIONAL",
    label: "Dir. Constitucional",
    icon: require("lucide-react").Scale,
    color: "text-emerald-400",
    bgGradient: "group-hover:bg-emerald-500/5 border-emerald-500/20",
    iconBg: "bg-emerald-500/10 text-emerald-400",
    emoji: "⚖️",
  },
  {
    value: "DIREITO_ADMINISTRATIVO",
    label: "Dir. Administrativo",
    icon: require("lucide-react").Building2,
    color: "text-cyan-400",
    bgGradient: "group-hover:bg-cyan-500/5 border-cyan-500/20",
    iconBg: "bg-cyan-500/10 text-cyan-400",
    emoji: "🏛️",
  },
  {
    value: "ADMINISTRACAO",
    label: "Administração",
    icon: require("lucide-react").Briefcase,
    color: "text-amber-400",
    bgGradient: "group-hover:bg-amber-500/5 border-amber-500/20",
    iconBg: "bg-amber-500/10 text-amber-400",
    emoji: "📊",
  },
  {
    value: "ARQUIVOLOGIA",
    label: "Arquivologia",
    icon: require("lucide-react").Archive,
    color: "text-orange-400",
    bgGradient: "group-hover:bg-orange-500/5 border-orange-500/20",
    iconBg: "bg-orange-500/10 text-orange-400",
    emoji: "📂",
  },
  {
    value: "INFORMATICA",
    label: "Informática",
    icon: require("lucide-react").Cpu,
    color: "text-indigo-400",
    bgGradient: "group-hover:bg-indigo-500/5 border-indigo-500/20",
    iconBg: "bg-indigo-500/10 text-indigo-400",
    emoji: "💻",
  },
  {
    value: "LEGISLACAO_PRF",
    label: "Legislação PRF",
    icon: require("lucide-react").Gavel,
    color: "text-rose-400",
    bgGradient: "group-hover:bg-rose-500/5 border-rose-500/20",
    iconBg: "bg-rose-500/10 text-rose-400",
    emoji: "🚗",
  },
];

interface DisciplinasGridProps {
  disciplinaSelecionada: Disciplina | "";
  onSelect: (disciplina: Disciplina) => void;
  performanceData?: Record<string, "bom" | "medio" | "baixo">;
}

export function DisciplinasGrid({
  disciplinaSelecionada,
  onSelect,
  performanceData,
}: DisciplinasGridProps) {
  const totalQuestoes = questoes.length;
  const disciplinasComQuestoes = DISCIPLINAS_CONFIG.filter(
    (config) =>
      questoes.filter((q) => q.disciplina === config.value).length > 0,
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      {/* Header com gradiente */}
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-xl" />

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Escolha a Disciplina
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Selecione a matéria para iniciar o treino
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <Target className="w-3 h-3" />
            <span>{totalQuestoes} questões disponíveis no banco</span>
          </div>
        </div>
      </div>

      {/* Grid de disciplinas */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {disciplinasComQuestoes.map((config) => {
          const count = questoes.filter(
            (q) => q.disciplina === config.value,
          ).length;
          const isSelected = disciplinaSelecionada === config.value;
          const performance = performanceData?.[config.value];

          return (
            <motion.div key={config.value} variants={itemVariants}>
              <DisciplinaCard
                disciplina={config}
                count={count}
                isSelected={isSelected}
                onSelect={() => onSelect(config.value)}
                performance={performance}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dica de estudo */}
      {disciplinaSelecionada === "" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center"
        >
          <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            Selecione uma disciplina para começar seu treino personalizado!
          </p>
        </motion.div>
      )}

      {/* Estatísticas rápidas */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-2 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Bom desempenho</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Desempenho médio</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Precisa atenção</span>
        </div>
      </div>
    </div>
  );
}
