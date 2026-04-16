"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Grid3x3 } from "lucide-react";

import { Disciplina } from "@/data/types";

interface DisciplinaCardProps {
  disciplina: {
    value: Disciplina;
    label: string;
    icon: any;
    color: string;
    bgGradient: string;
    iconBg: string;
  };
  count: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function DisciplinaCard({
  disciplina,
  count,
  isSelected,
  onSelect,
}: DisciplinaCardProps) {
  const Icon = disciplina.icon;

  return (
    <button
      onClick={onSelect}
      className={`
        relative text-left p-5 rounded-2xl border transition-all duration-300 group
        flex flex-col justify-between h-32
        ${
          isSelected
            ? "bg-slate-800/80 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20"
            : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div
          className={`p-2.5 rounded-xl ${disciplina.iconBg} transition-transform group-hover:scale-110 duration-300`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-emerald-500/20 p-1 rounded-full"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </motion.div>
        )}
      </div>

      <div>
        <h3
          className={`font-bold text-sm mb-1 ${
            isSelected ? "text-white" : "text-slate-300"
          }`}
        >
          {disciplina.label}
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <Grid3x3 className="w-3 h-3 text-slate-500" />
          <span className="text-slate-500">
            {count} {count === 1 ? "questão" : "questões"}
          </span>
        </div>
      </div>
    </button>
  );
}
