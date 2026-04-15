"use client";

import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

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
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {/* 🔎 Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar em enunciados ou disciplinas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* 📚 Filtro por disciplina */}
        <select
          value={filtroDisciplina}
          onChange={(e) => setFiltroDisciplina(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value="todas">Todas as disciplinas</option>
          {statsPorDisciplina.map(({ disciplina, nome, count }) => (
            <option key={disciplina} value={disciplina}>
              {nome} ({count})
            </option>
          ))}
        </select>

        {/* 🔄 Ordenação */}
        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as OrdenacaoType)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
        >
          <option value="vezes">Mais erradas</option>
          <option value="data">Mais recentes</option>
          <option value="recentes">Mais antigas</option>
          <option value="disciplina">Por disciplina</option>
        </select>
      </motion.div>

      {/* 🏷 Chips de disciplinas */}
      {statsPorDisciplina.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2"
        >
          {statsPorDisciplina.map(({ disciplina, count, nome }) => {
            const isActive = filtroDisciplina === disciplina;

            return (
              <button
                key={disciplina}
                onClick={() =>
                  setFiltroDisciplina((prev) =>
                    prev === disciplina ? "todas" : disciplina,
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isActive
                    ? (DISCIPLINAS_COR[disciplina] ??
                      "bg-slate-800 text-slate-300 border-slate-600")
                    : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
                }`}
              >
                {nome}: {count}
              </button>
            );
          })}

          {/* 🧹 Limpar filtros */}
          {(busca || filtroDisciplina !== "todas") && (
            <button
              onClick={limparFiltros}
              className="px-3 py-1.5 rounded-full text-xs font-medium border bg-slate-800 text-blue-400 border-blue-500/30 hover:bg-blue-500/10 transition-all"
            >
              <Filter className="w-3 h-3 inline mr-1" />
              Limpar filtros
            </button>
          )}
        </motion.div>
      )}
    </>
  );
}
