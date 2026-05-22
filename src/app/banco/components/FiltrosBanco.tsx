"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  ChevronDown,
  Clock,
  Filter,
  Keyboard,
  Loader2,
  LucideIcon,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

export type DificuldadeLevel = "todas" | "1" | "2" | "3";

export interface DisciplinaItem {
  disciplina: string;
  nome: string;
  count: number;
}

export interface FiltrosBancoProps {
  busca: string;
  setBusca: Dispatch<SetStateAction<string>>;
  disciplinaFiltro: string;
  setDisciplinaFiltro: Dispatch<SetStateAction<string>>;
  dificuldadeFiltro: DificuldadeLevel;
  setDificuldadeFiltro: Dispatch<SetStateAction<DificuldadeLevel>>;
  statsPorDisciplina: DisciplinaItem[];
  onLimparFiltros: () => void;
  isLoading?: boolean;
  totalQuestoesEncontradas?: number;
  onFiltroRapido?: (tipo: "recentes" | "dificeis" | "sem_tags") => void;
}

const DIFICULDADE_LABELS: Record<string, string> = {
  "1": "Fácil",
  "2": "Médio",
  "3": "Difícil",
};

const DIFICULDADE_CORES: Record<string, string> = {
  "1": "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  "2": "text-amber-400 bg-amber-500/10 border-amber-500/30",
  "3": "text-rose-400 bg-rose-500/10 border-rose-500/30",
};

const MAX_CHIPS = 6;

// ═══════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════

function SkeletonChips() {
  return (
    <div className="flex flex-wrap gap-2" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="h-7 rounded-full bg-gradient-to-r from-slate-800/50 to-slate-700/30 animate-pulse"
          style={{
            width: `${60 + (i % 3) * 20}px`,
            animationDelay: `${i * 60}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// QUICK FILTER
// ═══════════════════════════════════════════════════════════

interface QuickFilterProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
}

function QuickFilter({
  label,
  icon: Icon,
  onClick,
  active = false,
}: QuickFilterProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      aria-pressed={active}
      className={`
        px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
        flex items-center gap-1.5 border
        ${
          active
            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/30 shadow-sm"
            : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600 hover:text-slate-300"
        }
      `}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {label}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════
// AUTOCOMPLETE SUGGESTIONS
// ═══════════════════════════════════════════════════════════

interface AutocompleteSuggestionsProps {
  busca: string;
  onSelect: (value: string) => void;
  statsPorDisciplina: DisciplinaItem[];
}

function AutocompleteSuggestions({
  busca,
  onSelect,
  statsPorDisciplina,
}: AutocompleteSuggestionsProps) {
  const sugestoes = useMemo(() => {
    const term = busca.trim().toLowerCase();
    if (term.length < 2) return [];
    return statsPorDisciplina
      .filter((d) => d.nome.toLowerCase().includes(term))
      .slice(0, 5);
  }, [busca, statsPorDisciplina]);

  if (sugestoes.length === 0) return null;

  return (
    <motion.ul
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      role="listbox"
      aria-label="Sugestões de disciplina"
      className="absolute z-20 top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl"
    >
      {sugestoes.map((d) => (
        <li key={d.disciplina} role="option">
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(d.nome);
            }}
            className="w-full px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors flex items-center justify-between gap-2 group"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
              {d.nome}
            </span>
            <span className="text-[10px] text-slate-500 tabular-nums bg-slate-700/50 px-1.5 py-0.5 rounded-full">
              {d.count}
            </span>
          </button>
        </li>
      ))}
    </motion.ul>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function FiltrosBanco({
  busca,
  setBusca,
  disciplinaFiltro,
  setDisciplinaFiltro,
  dificuldadeFiltro,
  setDificuldadeFiltro,
  statsPorDisciplina,
  onLimparFiltros,
  isLoading = false,
  totalQuestoesEncontradas = 0,
  onFiltroRapido,
}: FiltrosBancoProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [autocompleteAberto, setAutocompleteAberto] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const clearConfirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const onLimparFiltrosRef = useRef(onLimparFiltros);

  useEffect(() => {
    onLimparFiltrosRef.current = onLimparFiltros;
  });

  useEffect(() => {
    return () => {
      if (clearConfirmTimeoutRef.current)
        clearTimeout(clearConfirmTimeoutRef.current);
    };
  }, []);

  // Filtros ativos
  const filtrosAtivosCount = useMemo(() => {
    let c = 0;
    if (busca !== "") c++;
    if (disciplinaFiltro !== "todas") c++;
    if (dificuldadeFiltro !== "todas") c++;
    return c;
  }, [busca, disciplinaFiltro, dificuldadeFiltro]);

  const temFiltrosAtivos = filtrosAtivosCount > 0;

  // Persistência da abertura dos filtros
  useEffect(() => {
    const saved = localStorage.getItem("filtros_abertos");
    if (saved !== null) {
      try {
        setFiltrosAbertos(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const salvarFiltrosAbertos = useDebouncedCallback(
    useCallback((aberto: boolean) => {
      localStorage.setItem("filtros_abertos", JSON.stringify(aberto));
    }, []),
    500,
  );

  const toggleFiltros = useCallback(
    (aberto: boolean) => {
      setFiltrosAbertos(aberto);
      salvarFiltrosAbertos(aberto);
    },
    [salvarFiltrosAbertos],
  );

  // URL Sync
  const sincronizarURL = useDebouncedCallback(
    useCallback(
      (b: string, disc: string, dif: DificuldadeLevel) => {
        const params = new URLSearchParams();
        if (b) params.set("busca", b);
        if (disc !== "todas") params.set("disciplina", disc);
        if (dif !== "todas") params.set("dificuldade", dif);
        const qs = params.toString();
        router.replace(qs ? `?${qs}` : window.location.pathname, {
          scroll: false,
        });
      },
      [router],
    ),
    400,
  );

  useEffect(() => {
    sincronizarURL(busca, disciplinaFiltro, dificuldadeFiltro);
  }, [busca, disciplinaFiltro, dificuldadeFiltro, sincronizarURL]);

  // Restaurar filtros da URL
  const setBuscaRef = useRef(setBusca);
  const setDisciplinaRef = useRef(setDisciplinaFiltro);
  const setDificuldadeRef = useRef(setDificuldadeFiltro);

  useEffect(() => {
    setBuscaRef.current = setBusca;
    setDisciplinaRef.current = setDisciplinaFiltro;
    setDificuldadeRef.current = setDificuldadeFiltro;
  });

  useEffect(() => {
    const urlBusca = searchParams.get("busca");
    const urlDisciplina = searchParams.get("disciplina");
    const urlDificuldade = searchParams.get("dificuldade");

    if (urlBusca) setBuscaRef.current(urlBusca);
    if (urlDisciplina) setDisciplinaRef.current(urlDisciplina);
    if (urlDificuldade && ["1", "2", "3"].includes(urlDificuldade)) {
      setDificuldadeRef.current(urlDificuldade as DificuldadeLevel);
    }
  }, []);

  // Input controlado
  const [inputLocal, setInputLocal] = useState(busca);

  useEffect(() => {
    setInputLocal(busca);
  }, [busca]);

  const debouncedSetBusca = useDebouncedCallback(
    useCallback((value: string) => setBusca(value), [setBusca]),
    300,
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setInputLocal(v);
      debouncedSetBusca(v);
      setAutocompleteAberto(v.length >= 2);
    },
    [debouncedSetBusca],
  );

  const handleInputBlur = useCallback(() => {
    setTimeout(() => setAutocompleteAberto(false), 150);
  }, []);

  const handleAutocompleteSelecionado = useCallback(
    (valor: string) => {
      setInputLocal(valor);
      setBusca(valor);
      setAutocompleteAberto(false);
      inputRef.current?.focus();
    },
    [setBusca],
  );

  const limparInput = useCallback(() => {
    setInputLocal("");
    setBusca("");
    setAutocompleteAberto(false);
    inputRef.current?.focus();
  }, [setBusca]);

  const handleLimparFiltros = useCallback(() => {
    onLimparFiltrosRef.current();
    setShowClearConfirm(false);
  }, []);

  const handleLimparComConfirmacao = useCallback(() => {
    if (filtrosAtivosCount >= 2) {
      setShowClearConfirm(true);
      if (clearConfirmTimeoutRef.current)
        clearTimeout(clearConfirmTimeoutRef.current);
      clearConfirmTimeoutRef.current = setTimeout(() => {
        setShowClearConfirm(false);
        clearConfirmTimeoutRef.current = null;
      }, 5000);
    } else {
      handleLimparFiltros();
    }
  }, [filtrosAtivosCount, handleLimparFiltros]);

  const handleDisciplinaClick = useCallback(
    (disciplina: string) => {
      setDisciplinaFiltro((prev) =>
        prev === disciplina ? "todas" : disciplina,
      );
    },
    [setDisciplinaFiltro],
  );

  const handleDificuldadeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDificuldadeFiltro(e.target.value as DificuldadeLevel);
    },
    [setDificuldadeFiltro],
  );

  // Atalhos de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput =
        active?.tagName === "INPUT" ||
        active?.tagName === "TEXTAREA" ||
        (active as HTMLElement)?.isContentEditable;

      if (e.key === "/" && !isInput) {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        toggleFiltros(!filtrosAbertos);
        return;
      }

      if (e.key === "Escape" && !isInput && filtrosAbertos) {
        toggleFiltros(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtrosAbertos, toggleFiltros]);

  const disciplinasVisiveis = useMemo(
    () => statsPorDisciplina.slice(0, MAX_CHIPS),
    [statsPorDisciplina],
  );
  const disciplinasRestantes = useMemo(
    () => Math.max(0, statsPorDisciplina.length - MAX_CHIPS),
    [statsPorDisciplina],
  );

  return (
    <div className="space-y-4">
      {/* Campo de busca com gradiente */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por enunciado, assunto ou tags… (Pressione / para focar)"
            value={inputLocal}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={() =>
              inputLocal.length >= 2 && setAutocompleteAberto(true)
            }
            className="w-full pl-10 pr-9 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
            aria-label="Buscar questões"
            aria-autocomplete="list"
            aria-expanded={autocompleteAberto}
            autoComplete="off"
            spellCheck={false}
          />

          {inputLocal && (
            <button
              onClick={limparInput}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-700 transition-all"
              aria-label="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <AnimatePresence>
            {autocompleteAberto && (
              <AutocompleteSuggestions
                busca={inputLocal}
                onSelect={handleAutocompleteSelecionado}
                statsPorDisciplina={statsPorDisciplina}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Barra de status */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {temFiltrosAtivos && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30"
            >
              <BarChart3 className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">
                {totalQuestoesEncontradas} questão
                {totalQuestoesEncontradas !== 1 ? "ões" : ""}
              </span>
              <span className="text-[10px] text-blue-400/70">
                ({filtrosAtivosCount} filtro
                {filtrosAtivosCount !== 1 ? "s" : ""})
              </span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-600 bg-slate-800/30 px-2 py-1 rounded-lg">
            <Keyboard className="w-3 h-3" />
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px]">
              /
            </kbd>
            <span>buscar</span>
            <span className="mx-1">•</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px]">
              ⌘F
            </kbd>
            <span>filtros</span>
          </div>

          <button
            onClick={() => toggleFiltros(!filtrosAbertos)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
            aria-expanded={filtrosAbertos}
          >
            <Filter className="w-3.5 h-3.5" />
            {filtrosAbertos ? "Ocultar filtros" : "Filtros"}
            {temFiltrosAtivos && (
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-blue-400 opacity-60" />
                <span className="relative w-2 h-2 rounded-full bg-blue-500" />
              </span>
            )}
            <ChevronDown
              className={`w-3 h-3 transition-transform ${filtrosAbertos ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Painel de filtros expandível */}
      <AnimatePresence>
        {filtrosAbertos && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-5">
              {/* Grid de selects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1.5 font-medium uppercase tracking-wider">
                    Disciplina
                  </label>
                  <select
                    value={disciplinaFiltro}
                    onChange={(e) => handleDisciplinaClick(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="todas">📚 Todas as disciplinas</option>
                    {statsPorDisciplina.map(({ disciplina, nome, count }) => (
                      <option key={disciplina} value={disciplina}>
                        {nome} ({count})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1.5 font-medium uppercase tracking-wider">
                    Dificuldade
                  </label>
                  <select
                    value={dificuldadeFiltro}
                    onChange={handleDificuldadeChange}
                    className="w-full px-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    <option value="todas">🎯 Todas</option>
                    <option value="1">✅ Fácil</option>
                    <option value="2">⚡ Médio</option>
                    <option value="3">🔥 Difícil</option>
                  </select>
                </div>
              </div>

              {/* Filtros rápidos */}
              {onFiltroRapido && (
                <div>
                  <p className="text-[11px] text-slate-500 mb-2 font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Filtros rápidos
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <QuickFilter
                      label="Mais recentes"
                      icon={Clock}
                      onClick={() => onFiltroRapido("recentes")}
                    />
                    <QuickFilter
                      label="Mais difíceis"
                      icon={TrendingUp}
                      onClick={() => onFiltroRapido("dificeis")}
                    />
                    <QuickFilter
                      label="Sem tags"
                      icon={Tag}
                      onClick={() => onFiltroRapido("sem_tags")}
                    />
                  </div>
                </div>
              )}

              {/* Limpar filtros */}
              {temFiltrosAtivos && (
                <div className="pt-2">
                  <AnimatePresence mode="wait">
                    {showClearConfirm ? (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-3"
                      >
                        <span className="text-xs text-slate-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          Limpar {filtrosAtivosCount} filtros?
                        </span>
                        <button
                          onClick={handleLimparFiltros}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium hover:from-rose-500/30 transition-all"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setShowClearConfirm(false)}
                          className="px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-xs hover:bg-slate-700 transition-all"
                        >
                          Cancelar
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="clear"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleLimparComConfirmacao}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 text-slate-400 border border-slate-700 text-xs hover:text-rose-400 hover:border-rose-500/30 transition-all"
                      >
                        <X className="w-3 h-3" />
                        Limpar filtros
                        <span className="px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-400 text-[10px]">
                          {filtrosAtivosCount}
                        </span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chips de disciplina */}
      {isLoading ? (
        <SkeletonChips />
      ) : (
        statsPorDisciplina.length > 0 && (
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filtros rápidos por disciplina"
          >
            {disciplinasVisiveis.map(({ disciplina, count, nome }) => {
              const ativo = disciplinaFiltro === disciplina;
              return (
                <motion.button
                  key={disciplina}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDisciplinaClick(disciplina)}
                  aria-pressed={ativo}
                  className={`
                    px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
                    ${
                      ativo
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 shadow-sm"
                        : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600 hover:text-slate-300"
                    }
                  `}
                >
                  {nome}
                  <span
                    className={`ml-1.5 tabular-nums text-[10px] ${ativo ? "text-blue-400" : "text-slate-600"}`}
                  >
                    {count}
                  </span>
                </motion.button>
              );
            })}

            {disciplinasRestantes > 0 && (
              <button
                onClick={() => toggleFiltros(true)}
                className="px-3 py-1.5 rounded-full text-[11px] text-slate-500 border border-slate-700/40 bg-slate-800/30 hover:border-slate-600 hover:text-slate-400 transition-all"
              >
                +{disciplinasRestantes} mais
              </button>
            )}
          </div>
        )
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 py-2" role="status">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          <span className="text-xs text-slate-400">Filtrando questões…</span>
        </div>
      )}
    </div>
  );
}
