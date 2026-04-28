"use client";

import { Layers } from "lucide-react";

import { questoes } from "@/data";
import { Disciplina } from "@/data/index";

import { DisciplinaCard } from "./DisciplinaCard";

export const DISCIPLINAS_CONFIG: {
  value: Disciplina;
  label: string;
  icon: any;
  color: string;
  bgGradient: string;
  iconBg: string;
}[] = [
  {
    value: "PORTUGUES",
    label: "Língua Portuguesa",
    icon: require("lucide-react").FileText,
    color: "text-blue-400",
    bgGradient: "group-hover:bg-blue-500/5 border-blue-500/20",
    iconBg: "bg-blue-500/10 text-blue-400",
  },
  {
    value: "ETICA",
    label: "Ética e Conduta",
    icon: require("lucide-react").ShieldCheck,
    color: "text-purple-400",
    bgGradient: "group-hover:bg-purple-500/5 border-purple-500/20",
    iconBg: "bg-purple-500/10 text-purple-400",
  },
  {
    value: "RACIOCINIO_LOGICO",
    label: "Raciocínio Lógico",
    icon: require("lucide-react").BrainCircuit,
    color: "text-pink-400",
    bgGradient: "group-hover:bg-pink-500/5 border-pink-500/20",
    iconBg: "bg-pink-500/10 text-pink-400",
  },
  {
    value: "DIREITO_CONSTITUCIONAL",
    label: "Dir. Constitucional",
    icon: require("lucide-react").Scale,
    color: "text-emerald-400",
    bgGradient: "group-hover:bg-emerald-500/5 border-emerald-500/20",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    value: "DIREITO_ADMINISTRATIVO",
    label: "Dir. Administrativo",
    icon: require("lucide-react").Building2,
    color: "text-cyan-400",
    bgGradient: "group-hover:bg-cyan-500/5 border-cyan-500/20",
    iconBg: "bg-cyan-500/10 text-cyan-400",
  },
  {
    value: "ADMINISTRACAO",
    label: "Administração",
    icon: require("lucide-react").Briefcase,
    color: "text-amber-400",
    bgGradient: "group-hover:bg-amber-500/5 border-amber-500/20",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
  {
    value: "ARQUIVOLOGIA",
    label: "Arquivologia",
    icon: require("lucide-react").Archive,
    color: "text-orange-400",
    bgGradient: "group-hover:bg-orange-500/5 border-orange-500/20",
    iconBg: "bg-orange-500/10 text-orange-400",
  },
  {
    value: "INFORMATICA",
    label: "Informática",
    icon: require("lucide-react").Cpu,
    color: "text-indigo-400",
    bgGradient: "group-hover:bg-indigo-500/5 border-indigo-500/20",
    iconBg: "bg-indigo-500/10 text-indigo-400",
  },
  {
    value: "LEGISLACAO_PRF",
    label: "Legislação PRF",
    icon: require("lucide-react").Gavel,
    color: "text-rose-400",
    bgGradient: "group-hover:bg-rose-500/5 border-rose-500/20",
    iconBg: "bg-rose-500/10 text-rose-400",
  },
];

interface DisciplinasGridProps {
  disciplinaSelecionada: Disciplina | "";
  onSelect: (disciplina: Disciplina) => void;
}

export function DisciplinasGrid({
  disciplinaSelecionada,
  onSelect,
}: DisciplinasGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4 text-slate-300">
        <Layers className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-bold">Escolha a Disciplina</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DISCIPLINAS_CONFIG.map((config) => {
          const count = questoes.filter(
            (q) => q.disciplina === config.value,
          ).length;
          const isSelected = disciplinaSelecionada === config.value;

          return (
            <DisciplinaCard
              key={config.value}
              disciplina={config}
              count={count}
              isSelected={isSelected}
              onSelect={() => onSelect(config.value)}
            />
          );
        })}
      </div>
    </div>
  );
}
