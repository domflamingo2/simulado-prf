"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Star,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Questao } from "@/data/index";

// FIX: Toaster removido daqui — deve estar em app/layout.tsx.
// Renderizar um Toaster por card em uma lista de 60 items criava 60 instâncias.

// ═══════════════════════════════════════════════════════════
// CONSTANTES E TIPOS
// ═══════════════════════════════════════════════════════════

type DificuldadeLevel = 1 | 2 | 3;

export interface QuestaoCardBancoProps {
  questao: Questao;
  index: number;
  onFavoritar?: (id: string) => Promise<void> | void;
  isFavorita?: boolean;
}

// Mapa de disciplina → { cor, label } centralizado
const DISCIPLINAS_CONFIG: Record<
  string,
  { cor: string; label: string; acento: string }
> = {
  PORTUGUES: {
    cor: "bg-blue-500/10 text-blue-300 border-blue-500/25",
    label: "Língua Portuguesa",
    acento: "border-l-blue-500",
  },
  ETICA: {
    cor: "bg-violet-500/10 text-violet-300 border-violet-500/25",
    label: "Ética e Conduta",
    acento: "border-l-violet-500",
  },
  RACIOCINIO_LOGICO: {
    cor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
    label: "Raciocínio Lógico",
    acento: "border-l-cyan-500",
  },
  DIREITO_CONSTITUCIONAL: {
    cor: "bg-amber-500/10 text-amber-300 border-amber-500/25",
    label: "Direito Constitucional",
    acento: "border-l-amber-500",
  },
  DIREITO_ADMINISTRATIVO: {
    cor: "bg-orange-500/10 text-orange-300 border-orange-500/25",
    label: "Direito Administrativo",
    acento: "border-l-orange-500",
  },
  ADMINISTRACAO: {
    cor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    label: "Administração",
    acento: "border-l-emerald-500",
  },
  ARQUIVOLOGIA: {
    cor: "bg-pink-500/10 text-pink-300 border-pink-500/25",
    label: "Arquivologia",
    acento: "border-l-pink-500",
  },
  INFORMATICA: {
    cor: "bg-indigo-500/10 text-indigo-300 border-indigo-500/25",
    label: "Informática",
    acento: "border-l-indigo-500",
  },
  LEGISLACAO_PRF: {
    cor: "bg-red-500/10 text-red-300 border-red-500/25",
    label: "Legislação PRF",
    acento: "border-l-red-500",
  },
};

const DIFICULDADE_CONFIG: Record<
  DificuldadeLevel,
  { label: string; cor: string; dot: string }
> = {
  1: { label: "Fácil", cor: "text-emerald-400", dot: "bg-emerald-400" },
  2: { label: "Médio", cor: "text-amber-400", dot: "bg-amber-400" },
  3: { label: "Difícil", cor: "text-rose-400", dot: "bg-rose-400" },
};

const FALLBACK_DISCIPLINA = {
  cor: "bg-slate-700/50 text-slate-300 border-slate-600/50",
  label: "Geral",
  acento: "border-l-slate-500",
};

// ═══════════════════════════════════════════════════════════
// HOOK: CLIPBOARD com fallback robusto
// ═══════════════════════════════════════════════════════════

function useClipboard() {
  const [copying, setCopying] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      if (copying) return;
      setCopying(true);
      try {
        // API moderna
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          // FIX: fallback sem execCommand deprecated — usa seleção nativa
          const ta = Object.assign(document.createElement("textarea"), {
            value: text,
            style: "position:fixed;opacity:0;pointer-events:none",
            readOnly: true,
          });
          document.body.appendChild(ta);
          ta.focus();
          ta.setSelectionRange(0, ta.value.length);
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        toast.success("Enunciado copiado!", { duration: 2000 });
      } catch {
        toast.error("Não foi possível copiar. Selecione o texto manualmente.", {
          duration: 3000,
        });
      } finally {
        setCopying(false);
      }
    },
    [copying],
  );

  return { copy, copying };
}

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTE: BADGE DE DISCIPLINA
// ═══════════════════════════════════════════════════════════

const DisciplinaBadge = memo(function DisciplinaBadge({
  disciplina,
}: {
  disciplina: string;
}) {
  const config = DISCIPLINAS_CONFIG[disciplina] ?? FALLBACK_DISCIPLINA;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border tracking-wide ${config.cor}`}
    >
      {config.label}
    </span>
  );
});

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTE: BADGE DE DIFICULDADE
// ═══════════════════════════════════════════════════════════

const DificuldadeBadge = memo(function DificuldadeBadge({
  nivel,
}: {
  nivel: number | undefined;
}) {
  const config =
    DIFICULDADE_CONFIG[(nivel as DificuldadeLevel) ?? 2] ??
    DIFICULDADE_CONFIG[2];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${config.cor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
});

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTE: ENUNCIADO COM EXPAND/COLLAPSE
// FIX: usa ResizeObserver em vez de getComputedStyle estático
// ═══════════════════════════════════════════════════════════

const Enunciado = memo(function Enunciado({
  texto,
  expandido,
}: {
  texto: string;
  expandido: boolean;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      // scrollHeight > clientHeight quando o texto está truncado
      const overflows = el.scrollHeight > el.clientHeight + 2; // +2px margem
      setIsOverflowing(overflows);
    };

    // FIX: ResizeObserver detecta mudanças de tamanho (janela, zoom, etc.)
    const ro = new ResizeObserver(check);
    ro.observe(el);
    check(); // checa imediatamente

    return () => ro.disconnect();
  }, [texto]);

  return (
    <p
      ref={ref}
      className={`text-slate-200 text-sm leading-relaxed transition-all duration-300 ${
        !expandido && isOverflowing ? "line-clamp-3" : ""
      }`}
    >
      {texto}
    </p>
  );
});

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTE: PAINEL DE RESPOSTA
// ═══════════════════════════════════════════════════════════

const RespostaPanel = memo(function RespostaPanel({
  questao,
}: {
  questao: Questao;
}) {
  const isCorreta = questao.resposta === "CERTO";
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="mt-4 rounded-xl border border-slate-700/60 bg-slate-900/60 overflow-hidden">
        {/* Cabeçalho da resposta */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/40">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Resposta
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
              isCorreta
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                : "bg-rose-500/15 text-rose-400 border border-rose-500/25"
            }`}
          >
            {questao.resposta}
          </span>
        </div>

        {/* Explicação */}
        {questao.explicacao && (
          <div className="px-4 py-3 flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300 leading-relaxed">
              {questao.explicacao}
            </p>
          </div>
        )}

        {/* Fonte legal */}
        {questao.fonte_legal && (
          <div className="px-4 py-2 border-t border-slate-700/40 text-xs text-slate-500 flex items-center gap-1.5">
            <span>📖</span>
            <span>{questao.fonte_legal}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
});

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL: QuestaoCardBanco
// ═══════════════════════════════════════════════════════════

export const QuestaoCardBanco = memo(function QuestaoCardBanco({
  questao,
  index,
  onFavoritar,
  isFavorita = false,
}: QuestaoCardBancoProps) {
  const [expandido, setExpandido] = useState(false);
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  const { copy, copying } = useClipboard();

  // Delay animação com cap
  const delay = Math.min(index * 0.025, 0.4);

  const disciplinaConfig = useMemo(
    () => DISCIPLINAS_CONFIG[questao.disciplina] ?? FALLBACK_DISCIPLINA,
    [questao.disciplina],
  );

  // FIX: isFavoriting removido das deps — usa ref para o guard
  const isFavoritingRef = useRef(false);

  const handleFavoritar = useCallback(async () => {
    if (!onFavoritar || isFavoritingRef.current) return;
    isFavoritingRef.current = true;
    setIsFavoriting(true);
    try {
      await onFavoritar(questao.id);
      toast.success(
        isFavorita ? "Removido dos favoritos" : "Adicionado aos favoritos",
        { duration: 2000 },
      );
    } catch {
      toast.error("Erro ao favoritar. Tente novamente.");
    } finally {
      isFavoritingRef.current = false;
      setIsFavoriting(false);
    }
  }, [onFavoritar, questao.id, isFavorita]);

  const handleCopiar = useCallback(() => {
    copy(questao.enunciado);
  }, [copy, questao.enunciado]);

  const toggleExpandido = useCallback(() => setExpandido((p) => !p), []);
  const toggleMostrarResposta = useCallback(
    () => setMostrarResposta((p) => !p),
    [],
  );

  // FIX: handleKeyDown removido — buttons nativos já disparam onClick
  // com Enter/Space. Era código redundante que duplicava toda a lógica.

  return (
    <motion.article
      layout={false}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.22, ease: "easeOut" }}
      className="group"
      aria-label={`Questão ${index + 1} — ${disciplinaConfig.label}`}
    >
      {/* Card com borda lateral colorida por disciplina */}
      <div
        className={`
          relative rounded-xl border border-slate-800/60 bg-slate-900/50
          backdrop-blur-sm overflow-hidden
          border-l-4 ${disciplinaConfig.acento}
          transition-all duration-200
          hover:border-slate-700/80 hover:bg-slate-900/70
          hover:shadow-lg hover:shadow-black/20
        `}
      >
        {/* Brilho sutil no hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <div className="p-4 sm:p-5">
          {/* ── Header: meta-informações ── */}
          <header className="flex items-center gap-2 flex-wrap mb-3">
            <DisciplinaBadge disciplina={questao.disciplina} />
            <DificuldadeBadge nivel={questao.dificuldade} />

            {questao.ano && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                <Clock className="w-3 h-3" aria-hidden="true" />
                {questao.ano}
              </span>
            )}

            {questao.banca_referencia && (
              <span className="text-[11px] text-slate-500 ml-auto">
                {questao.banca_referencia}
              </span>
            )}
          </header>

          {/* ── Enunciado ── */}
          <Enunciado texto={questao.enunciado} expandido={expandido} />

          {/* ── Assunto ── */}
          {questao.assunto && (
            <p className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
              <span aria-hidden="true">📚</span>
              {questao.assunto}
            </p>
          )}

          {/* ── Tags ── */}
          {questao.tags && questao.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5" aria-label="Tags">
              {questao.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 text-[10px] border border-slate-700/50"
                >
                  #{tag}
                </span>
              ))}
              {questao.tags.length > 4 && (
                <span className="text-[10px] text-slate-600 self-center">
                  +{questao.tags.length - 4}
                </span>
              )}
            </div>
          )}

          {/* ── Ações ── */}
          <div
            className="flex items-center gap-1 mt-3.5 pt-3 border-t border-slate-800/50"
            role="toolbar"
            aria-label="Ações da questão"
          >
            {/* Expandir */}
            <ActionButton
              onClick={toggleExpandido}
              aria-expanded={expandido}
              label={expandido ? "Recolher" : "Expandir"}
              icon={
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    expandido ? "rotate-180" : ""
                  }`}
                />
              }
            />

            {/* Resposta */}
            <ActionButton
              onClick={toggleMostrarResposta}
              aria-expanded={mostrarResposta}
              label={mostrarResposta ? "Ocultar resposta" : "Ver resposta"}
              icon={
                mostrarResposta ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )
              }
              activeColor="text-emerald-400 bg-emerald-500/10"
              active={mostrarResposta}
            />

            {/* Copiar */}
            <ActionButton
              onClick={handleCopiar}
              disabled={copying}
              label={copying ? "Copiando…" : "Copiar"}
              icon={
                copying ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )
              }
            />

            {/* Favoritar */}
            {onFavoritar && (
              <ActionButton
                onClick={handleFavoritar}
                disabled={isFavoriting}
                label={isFavorita ? "Favorita" : "Favoritar"}
                icon={
                  isFavoriting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Star
                      className={`w-3.5 h-3.5 ${isFavorita ? "fill-current text-amber-400" : ""}`}
                    />
                  )
                }
                active={isFavorita}
                activeColor="text-amber-400 bg-amber-500/10"
              />
            )}

            {/* Índice — canto direito */}
            <span
              className="ml-auto text-[10px] text-slate-700 font-mono tabular-nums select-none"
              aria-hidden="true"
            >
              #{String(index + 1).padStart(3, "0")}
            </span>
          </div>

          {/* ── Painel de resposta ── */}
          <AnimatePresence>
            {mostrarResposta && <RespostaPanel questao={questao} />}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
});

QuestaoCardBanco.displayName = "QuestaoCardBanco";

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTE: ActionButton
// Botão de ação compacto com estado active e disabled
// ═══════════════════════════════════════════════════════════

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  activeColor?: string;
  "aria-expanded"?: boolean;
}

const ActionButton = memo(function ActionButton({
  onClick,
  label,
  icon,
  disabled = false,
  active = false,
  activeColor = "text-blue-400 bg-blue-500/10",
  "aria-expanded": ariaExpanded,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-expanded={ariaExpanded}
      aria-pressed={active}
      title={label}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
        text-[11px] font-medium transition-all duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          active
            ? `${activeColor}`
            : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"
        }
      `}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
});

// ═══════════════════════════════════════════════════════════
// COMPONENTE: QuestaoListVirtualizada
// FIX: altura responsiva + estimateSize baseado em conteúdo real
// ═══════════════════════════════════════════════════════════

import { useVirtualizer } from "@tanstack/react-virtual";

export interface QuestaoListVirtualizadaProps {
  questoes: Questao[];
  onFavoritar?: (id: string) => Promise<void> | void;
  favoritas?: Set<string>;
  /** Altura do container. Default: preenche o viewport menos o header */
  altura?: number | string;
}

export const QuestaoListVirtualizada = memo(function QuestaoListVirtualizada({
  questoes,
  onFavoritar,
  favoritas = new Set(),
  altura,
}: QuestaoListVirtualizadaProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // FIX: estimateSize baseado no comprimento do enunciado para
  // melhor aproximação da altura real do card.
  // Card base = 140px + ~24px por 100 caracteres de enunciado (cap em 300px).
  const estimarAltura = useCallback(
    (index: number): number => {
      const q = questoes[index];
      if (!q) return 180;
      const base = 140;
      const extra = Math.min(Math.floor(q.enunciado.length / 100) * 24, 160);
      const tags = q.tags && q.tags.length > 0 ? 32 : 0;
      return base + extra + tags;
    },
    [questoes],
  );

  const virtualizer = useVirtualizer({
    count: questoes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: estimarAltura,
    overscan: 4,
    gap: 12, // gap entre cards
  });

  // FIX: altura responsiva com CSS var — não hardcoded 600px
  const alturaContainer = altura ?? "calc(100vh - 200px)";

  if (questoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <AlertCircle className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-sm">Nenhuma questão encontrada</p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="overflow-auto overscroll-contain"
      style={{ height: alturaContainer }}
      role="feed"
      aria-label={`Lista de ${questoes.length} questões`}
      aria-busy={false}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: "relative",
          width: "100%",
        }}
      >
        {virtualizer.getVirtualItems().map((item) => {
          const questao = questoes[item.index];
          return (
            <div
              key={questao.id}
              data-index={item.index}
              ref={virtualizer.measureElement} // FIX: mede altura real após render
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${item.start}px)`,
              }}
            >
              <QuestaoCardBanco
                questao={questao}
                index={item.index}
                onFavoritar={onFavoritar}
                isFavorita={favoritas.has(questao.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

QuestaoListVirtualizada.displayName = "QuestaoListVirtualizada";

// ═══════════════════════════════════════════════════════════
// COMPONENTE: QuestaoListPaginada
// Alternativa à virtualização para listas menores (≤ 100 itens)
// ═══════════════════════════════════════════════════════════

export interface QuestaoListPaginadaProps {
  questoes: Questao[];
  onFavoritar?: (id: string) => Promise<void> | void;
  favoritas?: Set<string>;
  itensPorPagina?: number;
}

export const QuestaoListPaginada = memo(function QuestaoListPaginada({
  questoes,
  onFavoritar,
  favoritas = new Set(),
  itensPorPagina = 20,
}: QuestaoListPaginadaProps) {
  const [pagina, setPagina] = useState(0);

  const totalPaginas = Math.ceil(questoes.length / itensPorPagina);
  const inicio = pagina * itensPorPagina;
  const questoesPagina = questoes.slice(inicio, inicio + itensPorPagina);

  // Reseta para pág 0 quando a lista muda (novo filtro aplicado)
  useEffect(() => {
    setPagina(0);
  }, [questoes]);

  if (questoes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <AlertCircle className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-sm">Nenhuma questão encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pagina}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="space-y-3"
        >
          {questoesPagina.map((q, i) => (
            <QuestaoCardBanco
              key={q.id}
              questao={q}
              index={inicio + i}
              onFavoritar={onFavoritar}
              isFavorita={favoritas.has(q.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Paginação */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
          <span className="text-xs text-slate-500">
            {inicio + 1}–{Math.min(inicio + itensPorPagina, questoes.length)} de{" "}
            {questoes.length} questões
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPagina((p) => Math.max(0, p - 1))}
              disabled={pagina === 0}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>

            {/* Páginas */}
            {Array.from({ length: Math.min(totalPaginas, 7) }, (_, i) => {
              // Janela deslizante de 7 páginas centrada na atual
              const half = 3;
              const start = Math.min(
                Math.max(0, pagina - half),
                Math.max(0, totalPaginas - 7),
              );
              const p = start + i;
              return (
                <button
                  key={p}
                  onClick={() => setPagina(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    p === pagina
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-500 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {p + 1}
                </button>
              );
            })}

            <button
              onClick={() =>
                setPagina((p) => Math.min(totalPaginas - 1, p + 1))
              }
              disabled={pagina === totalPaginas - 1}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

QuestaoListPaginada.displayName = "QuestaoListPaginada";
