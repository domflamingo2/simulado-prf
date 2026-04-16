"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Filter, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { GlassCard } from "@/components/ui/GlassCard";
import { DISCIPLINAS_NOME } from "@/constants/disciplinas";

type FiltroRevisao = "todas" | "erros" | "acertos" | "brancos" | "marcadas";
type OrdenacaoRevisao = "numero" | "disciplina" | "dificuldade";

interface FiltrosState {
  tipo: FiltroRevisao;
  disciplina: string | "todas";
  ordenacao: OrdenacaoRevisao;
  busca: string;
}

interface FiltrosSidebarProps {
  filtros: FiltrosState;
  setFiltros: Dispatch<SetStateAction<FiltrosState>>;
  showFiltros: boolean;
  setShowFiltros: (value: boolean) => void;
  estatisticas: {
    totalQuestoes: number;
    erros: number;
    acertos: number;
    brancos: number;
  };
  marcadasCount: number;
}

export function FiltrosSidebar({
  filtros,
  setFiltros,
  showFiltros,
  setShowFiltros,
  estatisticas,
  marcadasCount,
}: FiltrosSidebarProps) {
  return (
    <GlassCard className="p-4">
      <button
        onClick={() => setShowFiltros(!showFiltros)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="text-sm font-medium text-white flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filtros
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${showFiltros ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {showFiltros && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {/* Tipo */}
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Mostrar
              </label>
              <select
                value={filtros.tipo}
                onChange={(e) => {
                  setFiltros((f) => ({
                    ...f,
                    tipo: e.target.value as FiltroRevisao,
                  }));
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="todas">
                  Todas ({estatisticas.totalQuestoes})
                </option>
                <option value="erros">Erros ({estatisticas.erros})</option>
                <option value="acertos">
                  Acertos ({estatisticas.acertos})
                </option>
                <option value="brancos">
                  Em branco ({estatisticas.brancos})
                </option>
                <option value="marcadas">Marcadas ({marcadasCount})</option>
              </select>
            </div>

            {/* Disciplina */}
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Disciplina
              </label>
              <select
                value={filtros.disciplina}
                onChange={(e) =>
                  setFiltros((f) => ({
                    ...f,
                    disciplina: e.target.value,
                  }))
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="todas">Todas</option>
                {Object.entries(DISCIPLINAS_NOME).map(([key, nome]) => (
                  <option key={key} value={key}>
                    {nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Busca */}
            <div>
              <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
                <Search className="w-3 h-3" /> Buscar
              </label>
              <input
                type="text"
                value={filtros.busca}
                onChange={(e) =>
                  setFiltros((f) => ({ ...f, busca: e.target.value }))
                }
                placeholder="Palavra-chave..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
