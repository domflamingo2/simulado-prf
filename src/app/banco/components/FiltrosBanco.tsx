"use client";

import { motion } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import { useState } from "react";

import { Dispatch, SetStateAction } from "react";

interface FiltrosBancoProps {
  busca: string;
  setBusca: Dispatch<SetStateAction<string>>;
  disciplinaFiltro: string;
  setDisciplinaFiltro: Dispatch<SetStateAction<string>>;
  dificuldadeFiltro: string;
  setDificuldadeFiltro: Dispatch<SetStateAction<string>>;
  statsPorDisciplina: Array<{
    disciplina: string;
    nome: string;
    count: number;
  }>;
  onLimparFiltros: () => void;
}

export function FiltrosBanco({
  busca,
  setBusca,
  disciplinaFiltro,
  setDisciplinaFiltro,
  dificuldadeFiltro,
  setDificuldadeFiltro,
  statsPorDisciplina,
  onLimparFiltros,
}: FiltrosBancoProps) {
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const temFiltrosAtivos =
    busca !== "" ||
    disciplinaFiltro !== "todas" ||
    dificuldadeFiltro !== "todas";

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar por enunciado, assunto ou tags..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {busca && (
          <button
            onClick={() => setBusca("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Botão para mostrar/ocultar filtros */}
      <button
        onClick={() => setFiltrosAbertos(!filtrosAbertos)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <Filter className="w-4 h-4" />
        {filtrosAbertos ? "Ocultar filtros" : "Mostrar filtros"}
        {temFiltrosAtivos && (
          <span className="w-2 h-2 rounded-full bg-blue-400" />
        )}
      </button>

      {/* Filtros expandíveis */}
      {filtrosAbertos && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 pt-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Filtro por disciplina */}
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Disciplina
              </label>
              <select
                value={disciplinaFiltro}
                onChange={(e) => setDisciplinaFiltro(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="todas">Todas as disciplinas</option>
                {statsPorDisciplina.map(({ disciplina, nome, count }) => (
                  <option key={disciplina} value={disciplina}>
                    {nome} ({count})
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por dificuldade */}
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Dificuldade
              </label>
              <select
                value={dificuldadeFiltro}
                onChange={(e) => setDificuldadeFiltro(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="todas">Todas</option>
                <option value="1">Fácil</option>
                <option value="2">Médio</option>
                <option value="3">Difícil</option>
              </select>
            </div>
          </div>

          {/* Botão limpar filtros */}
          {temFiltrosAtivos && (
            <button
              onClick={onLimparFiltros}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Limpar todos os filtros
            </button>
          )}
        </motion.div>
      )}

      {/* Chips de disciplinas */}
      {statsPorDisciplina.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {statsPorDisciplina.slice(0, 6).map(({ disciplina, count, nome }) => (
            <button
              key={disciplina}
              onClick={() =>
                setDisciplinaFiltro((prev) =>
                  prev === disciplina ? "todas" : disciplina,
                )
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                disciplinaFiltro === disciplina
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
              }`}
            >
              {nome}: {count}
            </button>
          ))}
          {statsPorDisciplina.length > 6 && (
            <span className="text-xs text-slate-500 self-center">
              +{statsPorDisciplina.length - 6} disciplinas
            </span>
          )}
        </div>
      )}
    </div>
  );
}
