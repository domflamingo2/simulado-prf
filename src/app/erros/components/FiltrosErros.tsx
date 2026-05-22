"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  Filter,
  Layers,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

import { DISCIPLINAS_COR } from "@/constants/disciplinas";

type OrdenacaoType = "vezes" | "data" | "recentes" | "disciplina";

interface FiltrosErrosProps {
  busca: string;
  setBusca: Dispatch<SetStateAction<string>>;
  filtroDisciplina: string;
  setFiltroDisciplina: Dispatch<SetStateAction<string>>;
  ordenacao: OrdenacaoType;
  setOrdenacao: Dispatch<SetStateAction<OrdenacaoType>>;
  statsPorDisciplina: Array<{
    disciplina: string;
    nome: string;
    count: number;
  }>;
  limparFiltros: () => void;
}

const ordenacaoOptions = [
  { value: "vezes", label: "Mais erradas", icon: TrendingUp },
  { value: "data", label: "Mais recentes", icon: Calendar },
  { value: "recentes", label: "Mais antigas", icon: Calendar },
  { value: "disciplina", label: "Por disciplina", icon: Layers },
];

export function FiltrosErros({
  busca,
  setBusca,
  filtroDisciplina,
  setFiltroDisciplina,
  ordenacao,
  setOrdenacao,
  statsPorDisciplina,
  limparFiltros,
}: FiltrosErrosProps) {
  const [isOrdenacaoOpen, setIsOrdenacaoOpen] = useState(false);
  const hasFiltrosAtivos = busca !== "" || filtroDisciplina !== "todas";
  const selectedOrdenacao = ordenacaoOptions.find((o) => o.value === ordenacao);

  const totalErros = statsPorDisciplina.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  return (
    <div className="space-y-4">
      {/* Barra de busca e filtros principais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="flex flex-col lg:flex-row gap-3"
      >
        {/* 🔎 Busca */}
        <div className="relative flex-1 group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar em enunciados ou disciplinas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <AnimatePresence>
            {busca && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setBusca("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* 📚 Filtro por disciplina - Desktop */}
        <div className="hidden lg:block relative">
          <select
            value={filtroDisciplina}
            onChange={(e) => setFiltroDisciplina(e.target.value)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none pr-10 min-w-[180px]"
          >
            <option value="todas">📚 Todas as disciplinas</option>
            {statsPorDisciplina.map(({ disciplina, nome, count }) => (
              <option key={disciplina} value={disciplina}>
                {nome} ({count})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        {/* 🔄 Ordenação - Desktop */}
        <div className="hidden lg:block relative">
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value as OrdenacaoType)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none pr-10 min-w-[160px]"
          >
            {ordenacaoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                📊 {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        {/* 🔄 Ordenação - Mobile (dropdown customizado) */}
        <div className="lg:hidden relative">
          <button
            onClick={() => setIsOrdenacaoOpen(!isOrdenacaoOpen)}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white transition-all"
          >
            <span className="flex items-center gap-2">
              {selectedOrdenacao?.icon && (
                <selectedOrdenacao.icon className="w-4 h-4" />
              )}
              {selectedOrdenacao?.label}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isOrdenacaoOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isOrdenacaoOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-1 z-10 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl"
              >
                {ordenacaoOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setOrdenacao(option.value as OrdenacaoType);
                      setIsOrdenacaoOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                      ordenacao === option.value
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 📋 Stats resumo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between flex-wrap gap-2"
      >
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <span className="text-xs text-rose-400 font-medium">
              Total: {totalErros} erros
            </span>
          </div>
          {filtroDisciplina !== "todas" && (
            <div className="px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <span className="text-xs text-blue-400 font-medium">
                Filtrado por disciplina
              </span>
            </div>
          )}
        </div>

        {hasFiltrosAtivos && (
          <button
            onClick={limparFiltros}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-blue-400 hover:text-white hover:bg-blue-500/20 transition-all"
          >
            <Filter className="w-3 h-3" />
            Limpar filtros
          </button>
        )}
      </motion.div>

      {/* 🏷 Chips de disciplinas */}
      {statsPorDisciplina.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap gap-2"
        >
          {statsPorDisciplina.map(({ disciplina, count, nome }) => {
            const isActive = filtroDisciplina === disciplina;
            const cor =
              DISCIPLINAS_COR[disciplina] || "bg-slate-700 text-slate-300";

            return (
              <motion.button
                key={disciplina}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setFiltroDisciplina((prev) =>
                    prev === disciplina ? "todas" : disciplina,
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  isActive
                    ? `${cor} border-opacity-50 shadow-sm`
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                }`}
              >
                {nome}
                <span
                  className={`ml-1.5 text-[10px] ${isActive ? "opacity-100" : "opacity-60"}`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
