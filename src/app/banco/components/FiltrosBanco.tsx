"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Clock,
  Filter,
  Keyboard,
  Loader2,
  LucideIcon,
  Search,
  Sparkles,
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
import { toast } from "sonner";

// FIX: hook interno do projeto em vez de `use-debounce`
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

// FIX: Toaster removido — deve estar em app/layout.tsx

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

// Máximo de chips de disciplina exibidos diretamente
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
          className="h-7 rounded-full bg-slate-800/50 animate-pulse"
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
// QUICK FILTER — tipagem correta
// ═══════════════════════════════════════════════════════════

interface QuickFilterProps {
  label: string;
  icon: LucideIcon; // FIX: LucideIcon em vez de `any`
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
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`
        px-3 py-1.5 rounded-lg text-xs font-medium transition-all
        flex items-center gap-1.5 border
        ${
          active
            ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
            : "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:border-slate-600 hover:text-slate-300"
        }
      `}
    >
      <Icon className="w-3 h-3" aria-hidden="true" />
      {label}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
// AUTOCOMPLETE — sem tags hardcoded de ensino médio
// FIX: sugere apenas disciplinas reais do banco PRF
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
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      role="listbox"
      aria-label="Sugestões de disciplina"
      className="absolute z-20 top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl"
    >
      {sugestoes.map((d) => (
        <li key={d.disciplina} role="option" aria-selected={false}>
          <button
            onMouseDown={(e) => {
              // mousedown antes de blur do input — mantém o foco no input
              e.preventDefault();
              onSelect(d.nome);
            }}
            className="w-full px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors flex items-center justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3 h-3 text-slate-500" aria-hidden="true" />
              {d.nome}
            </span>
            <span className="text-[10px] text-slate-500 tabular-nums">
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
  // FIX: ref para o timeout de confirmação — permite cleanup no unmount
  const clearConfirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  // FIX: refs para callbacks do pai — evita stale closure nos atalhos de teclado
  const onLimparFiltrosRef = useRef(onLimparFiltros);
  useEffect(() => {
    onLimparFiltrosRef.current = onLimparFiltros;
  });

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (clearConfirmTimeoutRef.current)
        clearTimeout(clearConfirmTimeoutRef.current);
    };
  }, []);

  // ── Filtros ativos (valor derivado, não estado) ─────────────────────────────
  // FIX: useMemo em vez de useEffect + setState — evita re-render extra
  const filtrosAtivosCount = useMemo(() => {
    let c = 0;
    if (busca !== "") c++;
    if (disciplinaFiltro !== "todas") c++;
    if (dificuldadeFiltro !== "todas") c++;
    return c;
  }, [busca, disciplinaFiltro, dificuldadeFiltro]);

  const temFiltrosAtivos = filtrosAtivosCount > 0;

  // ── Persistência da abertura dos filtros no localStorage ────────────────────

  useEffect(() => {
    const saved = localStorage.getItem("filtros_abertos");
    if (saved !== null) {
      try {
        setFiltrosAbertos(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // FIX: debounce na escrita do localStorage — sem escrita em cada toggle rápido
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

  // ── URL Sync ────────────────────────────────────────────────────────────────
  // FIX: debounce no router.replace para não criar entradas a cada keystroke.
  // Sem debounce: cada letra no input → router.replace → URL flickers.
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

  // ── Restaurar filtros da URL ────────────────────────────────────────────────
  // FIX: executa apenas no mount — sem deps de funções do pai (stale closure)
  // Usa refs para acessar as funções atuais no momento do mount

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount only — intencional

  // ── Input controlado com debounce ─────────────────────────────────────────
  // FIX: input controlado por `busca` (não `defaultValue`) para que reset
  // externo (limpar filtros) reflita imediatamente no campo visível.
  // O debounce está no `setValue` que propaga para cima, não no valor local.
  const [inputLocal, setInputLocal] = useState(busca);

  // Sincroniza input quando busca é resetada externamente (ex: limpar filtros)
  useEffect(() => {
    setInputLocal(busca);
  }, [busca]);

  const debouncedSetBusca = useDebouncedCallback(
    useCallback(
      (value: string) => {
        setBusca(value);
      },
      [setBusca],
    ),
    300,
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setInputLocal(v); // atualiza o campo imediatamente
      debouncedSetBusca(v); // propaga para o pai após debounce
      setAutocompleteAberto(v.length >= 2);
    },
    [debouncedSetBusca],
  );

  const handleInputBlur = useCallback(() => {
    // Pequeno delay para permitir que onMouseDown do autocomplete processe primeiro
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

  // ── Limpar filtros ─────────────────────────────────────────────────────────

  const handleLimparFiltros = useCallback(() => {
    try {
      onLimparFiltrosRef.current();
      setShowClearConfirm(false);
    } catch {
      toast.error("Erro ao limpar filtros. Tente novamente.");
    }
  }, []);

  const handleLimparComConfirmacao = useCallback(() => {
    if (filtrosAtivosCount >= 2) {
      setShowClearConfirm(true);
      // FIX: cleanup do timeout anterior antes de criar novo
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

  // ── Seleção de disciplina — sem toast a cada clique ────────────────────────
  // FIX: removido o toast em cada mudança de disciplina/dificuldade.
  // Com chips clicáveis, o usuário pode clicar rápido em vários — os toasts
  // se empilhavam e poluíam a UI. O feedback visual (chip ativo) é suficiente.
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

  // ── Atalhos de teclado ─────────────────────────────────────────────────────
  // FIX: deps vazias + refs — sem stale closure, sem re-registro desnecessário
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInput =
        active?.tagName === "INPUT" ||
        active?.tagName === "TEXTAREA" ||
        (active as HTMLElement)?.isContentEditable;

      // "/" — foca no campo de busca
      if (e.key === "/" && !isInput) {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }

      // Ctrl+F — toggle filtros
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setFiltrosAbertos((p) => {
          const novo = !p;
          salvarFiltrosAbertos(novo);
          return novo;
        });
        return;
      }

      // ESC — limpa filtros (apenas se não há input focado e há filtros ativos)
      if (e.key === "Escape" && !isInput) {
        // Usa o setter funcional para ler o estado atual sem dep
        setFiltrosAbertos((opened) => {
          if (opened) {
            salvarFiltrosAbertos(false);
            return false;
          }
          return opened;
        });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [salvarFiltrosAbertos]); // salvarFiltrosAbertos é estável (useDebouncedCallback)

  // ── Chips de disciplinas ───────────────────────────────────────────────────
  // FIX: disciplinasRestantes nunca negativo
  const disciplinasVisiveis = useMemo(
    () => statsPorDisciplina.slice(0, MAX_CHIPS),
    [statsPorDisciplina],
  );
  const disciplinasRestantes = useMemo(
    () => Math.max(0, statsPorDisciplina.length - MAX_CHIPS),
    [statsPorDisciplina],
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {/* ── Campo de busca ── */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar por enunciado, assunto ou tags… (Pressione / para focar)"
          value={inputLocal}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => inputLocal.length >= 2 && setAutocompleteAberto(true)}
          className="w-full pl-10 pr-9 py-2.5 bg-slate-800/50 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
          aria-label="Buscar questões"
          aria-autocomplete="list"
          aria-expanded={autocompleteAberto}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Botão limpar */}
        {inputLocal && (
          <button
            onClick={limparInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Limpar busca"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Autocomplete */}
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

      {/* ── Contador de resultados + controles ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Contador */}
        <AnimatePresence mode="wait">
          {temFiltrosAtivos && (
            <motion.p
              key="contador"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-xs text-slate-400 flex items-center gap-1.5"
            >
              <TrendingUp className="w-3 h-3" aria-hidden="true" />
              <span className="tabular-nums font-medium text-slate-300">
                {totalQuestoesEncontradas}
              </span>
              questão{totalQuestoesEncontradas !== 1 ? "ões" : ""} encontrada
              {totalQuestoesEncontradas !== 1 ? "s" : ""}
              <span className="text-slate-600">
                ({filtrosAtivosCount} filtro
                {filtrosAtivosCount !== 1 ? "s" : ""} ativo
                {filtrosAtivosCount !== 1 ? "s" : ""})
              </span>
            </motion.p>
          )}
        </AnimatePresence>

        {/* Toggle filtros + atalhos */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Atalhos — apenas desktop */}
          <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-600">
            <Keyboard className="w-3 h-3" aria-hidden="true" />
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">/</kbd>
              <span>buscar</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">⌘F</kbd>
              <span>filtros</span>
            </span>
          </div>

          <button
            onClick={() => toggleFiltros(!filtrosAbertos)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            aria-label={filtrosAbertos ? "Ocultar filtros" : "Mostrar filtros"}
            aria-expanded={filtrosAbertos}
            aria-controls="painel-filtros"
          >
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            {filtrosAbertos ? "Ocultar" : "Filtros"}
            {/* Indicador de filtros ativos */}
            {temFiltrosAtivos && (
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inset-0 rounded-full bg-blue-400 opacity-60" />
                <span className="relative w-2 h-2 rounded-full bg-blue-500" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Painel de filtros expandíveis ── */}
      <AnimatePresence>
        {filtrosAbertos && (
          <motion.div
            id="painel-filtros"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-1 space-y-4">
              {/* Selects de disciplina e dificuldade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="select-disciplina"
                    className="block text-[11px] text-slate-500 mb-1.5 font-medium uppercase tracking-wider"
                  >
                    Disciplina
                  </label>
                  <select
                    id="select-disciplina"
                    value={disciplinaFiltro}
                    onChange={(e) => handleDisciplinaClick(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/60 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/60 transition-colors"
                  >
                    <option value="todas">Todas as disciplinas</option>
                    {statsPorDisciplina.map(({ disciplina, nome, count }) => (
                      <option key={disciplina} value={disciplina}>
                        {nome} ({count})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="select-dificuldade"
                    className="block text-[11px] text-slate-500 mb-1.5 font-medium uppercase tracking-wider"
                  >
                    Dificuldade
                  </label>
                  <select
                    id="select-dificuldade"
                    value={dificuldadeFiltro}
                    onChange={handleDificuldadeChange}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/60 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500/60 transition-colors"
                  >
                    <option value="todas">Todas</option>
                    <option value="1">Fácil</option>
                    <option value="2">Médio</option>
                    <option value="3">Difícil</option>
                  </select>
                </div>
              </div>

              {/* Filtros rápidos */}
              {onFiltroRapido && (
                <div>
                  <p className="text-[11px] text-slate-500 mb-2 font-medium uppercase tracking-wider">
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
                      icon={Sparkles}
                      onClick={() => onFiltroRapido("sem_tags")}
                    />
                  </div>
                </div>
              )}

              {/* Limpar filtros com confirmação */}
              {temFiltrosAtivos && (
                <div className="pt-1">
                  <AnimatePresence mode="wait">
                    {showClearConfirm ? (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-xs text-slate-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          Limpar {filtrosAtivosCount} filtros?
                        </span>
                        <button
                          onClick={handleLimparFiltros}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/25 text-xs hover:bg-rose-500/25 transition-colors"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setShowClearConfirm(false)}
                          className="px-3 py-1.5 rounded-lg bg-slate-700/60 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
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
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/40 text-xs hover:text-rose-400 hover:border-rose-500/30 transition-all"
                        aria-label={`Limpar ${filtrosAtivosCount} filtro${filtrosAtivosCount > 1 ? "s" : ""} ativos`}
                      >
                        <X className="w-3 h-3" />
                        Limpar filtros
                        <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-400 text-[10px] tabular-nums">
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

      {/* ── Chips de disciplina ── */}
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
                <button
                  key={disciplina}
                  onClick={() => handleDisciplinaClick(disciplina)}
                  aria-pressed={ativo}
                  className={`
                    px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
                    ${
                      ativo
                        ? "bg-blue-500/15 text-blue-300 border-blue-500/30 shadow-sm"
                        : "bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-slate-600 hover:text-slate-300"
                    }
                  `}
                >
                  {nome}
                  <span
                    className={`ml-1.5 tabular-nums ${ativo ? "text-blue-400" : "text-slate-600"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {/* FIX: só exibe se realmente há mais — nunca negativo */}
            {disciplinasRestantes > 0 && (
              <button
                onClick={() => toggleFiltros(true)}
                className="px-3 py-1.5 rounded-full text-[11px] text-slate-500 border border-slate-700/40 bg-slate-800/30 hover:border-slate-600 hover:text-slate-400 transition-all"
                aria-label={`Ver mais ${disciplinasRestantes} disciplinas`}
              >
                +{disciplinasRestantes} mais
              </button>
            )}
          </div>
        )
      )}

      {/* ── Spinner de loading ── */}
      {isLoading && (
        <div
          className="flex items-center gap-2 py-2"
          role="status"
          aria-label="Carregando questões"
        >
          <Loader2
            className="w-4 h-4 text-blue-500 animate-spin"
            aria-hidden="true"
          />
          <span className="text-xs text-slate-400">Filtrando questões…</span>
        </div>
      )}
    </div>
  );
}
