"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Filter,
  Flag,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

import { GlassCard } from "@/components/ui/GlassCard";
import { DISCIPLINAS_NOME } from "@/constants/disciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const tipoConfig = {
  todas: {
    icon: BookOpen,
    color: "text-slate-400",
    bg: "bg-slate-500/20",
    label: "Todas",
  },

  erros: {
    icon: XCircle,
    color: "text-rose-400",
    bg: "bg-rose-500/20",
    label: "Erros",
  },

  acertos: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
    label: "Acertos",
  },

  brancos: {
    icon: AlertCircle,
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    label: "Brancos",
  },

  marcadas: {
    icon: Flag,
    color: "text-purple-400",
    bg: "bg-purple-500/20",
    label: "Marcadas",
  },
} satisfies Record<
  FiltroRevisao,
  {
    icon: React.ElementType;
    color: string;
    bg: string;
    label: string;
  }
>;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function FiltrosSidebar({
  filtros,
  setFiltros,
  showFiltros,
  setShowFiltros,
  estatisticas,
  marcadasCount,
}: FiltrosSidebarProps) {
  const [buscaLocal, setBuscaLocal] = useState(filtros.busca);

  // ───────────────────────────────────────────────────────────────────────────
  // Helpers
  // ───────────────────────────────────────────────────────────────────────────

  const hasActiveFilters =
    filtros.tipo !== "todas" ||
    filtros.disciplina !== "todas" ||
    filtros.busca.trim() !== "";

  const filtrosTipo = useMemo(
    () => [
      {
        key: "erros" as const,
        value: estatisticas.erros,
      },
      {
        key: "acertos" as const,
        value: estatisticas.acertos,
      },
      {
        key: "brancos" as const,
        value: estatisticas.brancos,
      },
      {
        key: "marcadas" as const,
        value: marcadasCount,
      },
    ],
    [estatisticas, marcadasCount],
  );

  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setBuscaLocal(value);

    setFiltros((f) => ({
      ...f,
      busca: value,
    }));
  };

  const limparBusca = () => {
    setBuscaLocal("");

    setFiltros((f) => ({
      ...f,
      busca: "",
    }));
  };

  const limparTodosFiltros = () => {
    setBuscaLocal("");

    setFiltros((f) => ({
      ...f,
      tipo: "todas",
      disciplina: "todas",
      busca: "",
    }));
  };

  const CurrentIcon = tipoConfig[filtros.tipo].icon;

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <GlassCard className="p-4 transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <button
        onClick={() => setShowFiltros(!showFiltros)}
        className="flex items-center justify-between w-full group"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
          </div>

          <span className="text-sm font-medium text-white">Filtros</span>

          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                limparTodosFiltros();
              }}
              className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-700 transition-all"
              title="Limpar todos os filtros"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
              showFiltros ? "rotate-180" : ""
            } group-hover:text-slate-300`}
          />
        </div>
      </button>

      {/* Badges */}
      {hasActiveFilters && !showFiltros && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {filtros.tipo !== "todas" && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${
                tipoConfig[filtros.tipo].bg
              } ${tipoConfig[filtros.tipo].color}`}
            >
              {tipoConfig[filtros.tipo].label}
            </span>
          )}

          {filtros.disciplina !== "todas" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30">
              📚{" "}
              {
                DISCIPLINAS_NOME[
                  filtros.disciplina as keyof typeof DISCIPLINAS_NOME
                ]
              }
            </span>
          )}

          {filtros.busca && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              🔍 "{filtros.busca}"
            </span>
          )}
        </div>
      )}

      {/* Conteúdo */}
      <AnimatePresence initial={false}>
        {showFiltros && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-4 mt-2 border-t border-white/10">
              {/* Tipo */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <CurrentIcon
                    className={`w-3 h-3 ${tipoConfig[filtros.tipo].color}`}
                  />
                  Mostrar questões
                </label>

                <div className="grid grid-cols-2 gap-1.5">
                  {filtrosTipo.map(({ key, value }) => {
                    const config = tipoConfig[key];
                    const Icon = config.icon;

                    return (
                      <button
                        key={key}
                        onClick={() =>
                          setFiltros((f) => ({
                            ...f,
                            tipo: key,
                          }))
                        }
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all border ${
                          filtros.tipo === key
                            ? `${config.bg} ${config.color} border-current/30`
                            : "bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </span>

                        <span className="font-mono text-[10px]">{value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Disciplina */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1.5 block">
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
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="todas">📚 Todas as disciplinas</option>

                  {Object.entries(DISCIPLINAS_NOME).map(([key, nome]) => (
                    <option key={key} value={key}>
                      {nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Busca */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  Buscar no enunciado
                </label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />

                  <input
                    type="text"
                    value={buscaLocal}
                    onChange={handleBuscaChange}
                    placeholder="Palavra-chave..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-8 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />

                  {buscaLocal && (
                    <button
                      onClick={limparBusca}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-700 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Limpar */}
              {hasActiveFilters && (
                <button
                  onClick={limparTodosFiltros}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs transition-all border border-white/10"
                >
                  <X className="w-3 h-3" />
                  Limpar todos os filtros
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
