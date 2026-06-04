"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Questao } from "@/data/questoes/index";

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

const DISCIPLINAS_CONFIG: Record<
  string,
  { cor: string; label: string; acento: string; icon: string }
> = {
  PORTUGUES: {
    cor: "bg-blue-500/10 text-blue-300 border-blue-500/25",
    label: "Língua Portuguesa",
    acento: "border-l-blue-500",
    icon: "📖",
  },
  ETICA: {
    cor: "bg-violet-500/10 text-violet-300 border-violet-500/25",
    label: "Ética e Conduta",
    acento: "border-l-violet-500",
    icon: "✨",
  },
  RACIOCINIO_LOGICO: {
    cor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
    label: "Raciocínio Lógico",
    acento: "border-l-cyan-500",
    icon: "🧠",
  },
  DIREITO_CONSTITUCIONAL: {
    cor: "bg-amber-500/10 text-amber-300 border-amber-500/25",
    label: "Direito Constitucional",
    acento: "border-l-amber-500",
    icon: "⚖️",
  },
  DIREITO_ADMINISTRATIVO: {
    cor: "bg-orange-500/10 text-orange-300 border-orange-500/25",
    label: "Direito Administrativo",
    acento: "border-l-orange-500",
    icon: "🏛️",
  },
  ADMINISTRACAO: {
    cor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    label: "Administração",
    acento: "border-l-emerald-500",
    icon: "📊",
  },
  ARQUIVOLOGIA: {
    cor: "bg-pink-500/10 text-pink-300 border-pink-500/25",
    label: "Arquivologia",
    acento: "border-l-pink-500",
    icon: "📂",
  },
  INFORMATICA: {
    cor: "bg-indigo-500/10 text-indigo-300 border-indigo-500/25",
    label: "Informática",
    acento: "border-l-indigo-500",
    icon: "💻",
  },
  LEGISLACAO_PRF: {
    cor: "bg-red-500/10 text-red-300 border-red-500/25",
    label: "Legislação PRF",
    acento: "border-l-red-500",
    icon: "🚗",
  },
};

const DIFICULDADE_CONFIG: Record<
  DificuldadeLevel,
  { label: string; cor: string; dot: string; bg: string }
> = {
  1: {
    label: "Fácil",
    cor: "text-emerald-400",
    dot: "bg-emerald-400",
    bg: "bg-emerald-500/10",
  },
  2: {
    label: "Médio",
    cor: "text-amber-400",
    dot: "bg-amber-400",
    bg: "bg-amber-500/10",
  },
  3: {
    label: "Difícil",
    cor: "text-rose-400",
    dot: "bg-rose-400",
    bg: "bg-rose-500/10",
  },
};

const FALLBACK_DISCIPLINA = {
  cor: "bg-slate-700/50 text-slate-300 border-slate-600/50",
  label: "Geral",
  acento: "border-l-slate-500",
  icon: "📚",
};

// ═══════════════════════════════════════════════════════════
// HOOK: CLIPBOARD
// ═══════════════════════════════════════════════════════════

function useClipboard() {
  const [copying, setCopying] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      if (copying) return;
      setCopying(true);
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = Object.assign(document.createElement("textarea"), {
            value: text,
            style: "position:fixed;opacity:0;pointer-events:none",
            readOnly: true,
          });
          document.body.appendChild(ta);
          ta.focus();
          ta.setSelectionRange(0, ta.value.length);
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        toast.success("Enunciado copiado!", { duration: 2000 });
      } catch {
        toast.error("Não foi possível copiar. Selecione o texto manualmente.");
      } finally {
        setCopying(false);
      }
    },
    [copying],
  );

  return { copy, copying };
}

// ═══════════════════════════════════════════════════════════
// BADGE DE DISCIPLINA
// ═══════════════════════════════════════════════════════════

const DisciplinaBadge = memo(function DisciplinaBadge({
  disciplina,
}: {
  disciplina: string;
}) {
  const config = DISCIPLINAS_CONFIG[disciplina] ?? FALLBACK_DISCIPLINA;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border tracking-wide ${config.cor}`}
    >
      <span className="text-[13px]">{config.icon}</span>
      {config.label}
    </span>
  );
});

// ═══════════════════════════════════════════════════════════
// BADGE DE DIFICULDADE
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
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium ${config.bg} ${config.cor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
});

// ═══════════════════════════════════════════════════════════
// ENUNCIADO COM EXPAND/COLLAPSE
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
      const overflows = el.scrollHeight > el.clientHeight + 2;
      setIsOverflowing(overflows);
    };

    const ro = new ResizeObserver(check);
    ro.observe(el);
    check();

    return () => ro.disconnect();
  }, [texto]);

  return (
    <p
      ref={ref}
      className={`text-slate-200 text-sm leading-relaxed transition-all duration-300 ${!expandido && isOverflowing ? "line-clamp-3" : ""}`}
    >
      {texto}
    </p>
  );
});

// ═══════════════════════════════════════════════════════════
// PAINEL DE RESPOSTA
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
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="mt-4 rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-900/80 to-slate-800/50 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/40 bg-slate-800/30">
          <div
            className={`p-1 rounded-lg ${isCorreta ? "bg-emerald-500/20" : "bg-rose-500/20"}`}
          >
            {isCorreta ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            )}
          </div>
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

        {questao.explicacao && (
          <div className="px-4 py-3 flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-300 leading-relaxed">
              {questao.explicacao}
            </p>
          </div>
        )}

        {questao.fonte_legal && (
          <div className="px-4 py-2 border-t border-slate-700/40 text-xs text-slate-500 flex items-center gap-1.5 bg-slate-800/20">
            <span>📖</span>
            <span>{questao.fonte_legal}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
});

// ═══════════════════════════════════════════════════════════
// ACTION BUTTON
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
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      aria-expanded={ariaExpanded}
      aria-pressed={active}
      title={label}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
        text-[11px] font-medium transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
        disabled:opacity-40 disabled:cursor-not-allowed
        ${active ? activeColor : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"}
      `}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
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
  const [isHovered, setIsHovered] = useState(false);

  const { copy, copying } = useClipboard();

  const delay = Math.min(index * 0.02, 0.3);

  const disciplinaConfig = useMemo(
    () => DISCIPLINAS_CONFIG[questao.disciplina] ?? FALLBACK_DISCIPLINA,
    [questao.disciplina],
  );

  const dificuldadeConfig =
    DIFICULDADE_CONFIG[(questao.dificuldade as DificuldadeLevel) ?? 2];

  const isFavoritingRef = useRef(false);

  const handleFavoritar = useCallback(async () => {
    if (!onFavoritar || isFavoritingRef.current) return;
    isFavoritingRef.current = true;
    setIsFavoriting(true);
    try {
      await onFavoritar(questao.id);
      toast.success(
        isFavorita ? "Removido dos favoritos" : "Adicionado aos favoritos",
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

  return (
    <motion.article
      layout={false}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <div
        className={`
          relative rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-900/50 to-slate-800/30
          backdrop-blur-sm overflow-hidden border-l-4 ${disciplinaConfig.acento}
          transition-all duration-300
          hover:border-slate-700/80 hover:bg-slate-900/70
          hover:shadow-xl hover:shadow-black/30
        `}
      >
        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Badge de destaque (opcional) */}
        {index === 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span className="text-[9px] font-medium text-amber-400">
                Destaque
              </span>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-5">
          {/* Header: meta-informações */}
          <header className="flex items-center gap-2 flex-wrap mb-3">
            <DisciplinaBadge disciplina={questao.disciplina} />
            <DificuldadeBadge nivel={questao.dificuldade} />

            {questao.ano && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-800/30 px-2 py-0.5 rounded-full">
                <Calendar className="w-3 h-3" />
                {questao.ano}
              </span>
            )}

            {questao.banca_referencia && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-800/30 px-2 py-0.5 rounded-full ml-auto">
                <Building2 className="w-3 h-3" />
                {questao.banca_referencia}
              </span>
            )}
          </header>

          {/* Enunciado */}
          <Enunciado texto={questao.enunciado} expandido={expandido} />

          {/* Assunto */}
          {questao.assunto && (
            <p className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {questao.assunto}
            </p>
          )}

          {/* Tags */}
          {questao.tags && questao.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {questao.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 text-[10px] border border-slate-700/50"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
              {questao.tags.length > 4 && (
                <span className="text-[10px] text-slate-600 self-center">
                  +{questao.tags.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center gap-1 mt-4 pt-3 border-t border-slate-800/50">
            <ActionButton
              onClick={toggleExpandido}
              label={expandido ? "Recolher" : "Expandir"}
              aria-expanded={expandido}
              icon={
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${expandido ? "rotate-180" : ""}`}
                />
              }
            />

            <ActionButton
              onClick={toggleMostrarResposta}
              label={mostrarResposta ? "Ocultar resposta" : "Ver resposta"}
              icon={
                mostrarResposta ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )
              }
              active={mostrarResposta}
              activeColor="text-emerald-400 bg-emerald-500/10"
            />

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

            <span className="ml-auto text-[10px] text-slate-600 font-mono tabular-nums select-none">
              #{String(index + 1).padStart(3, "0")}
            </span>
          </div>

          {/* Painel de resposta */}
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
// QuestaoListVirtualizada
// ═══════════════════════════════════════════════════════════

import { useVirtualizer } from "@tanstack/react-virtual";

export interface QuestaoListVirtualizadaProps {
  questoes: Questao[];
  onFavoritar?: (id: string) => Promise<void> | void;
  favoritas?: Set<string>;
  altura?: number | string;
}

export const QuestaoListVirtualizada = memo(function QuestaoListVirtualizada({
  questoes,
  onFavoritar,
  favoritas = new Set(),
  altura,
}: QuestaoListVirtualizadaProps) {
  const parentRef = useRef<HTMLDivElement>(null);

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
    gap: 12,
  });

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
              ref={virtualizer.measureElement}
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
// QuestaoListPaginada
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
      <AnimatePresence mode="wait">
        <motion.div
          key={pagina}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
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
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-all"
            >
              Anterior
            </button>
            {Array.from({ length: Math.min(totalPaginas, 5) }, (_, i) => {
              const p = i;
              return (
                <button
                  key={p}
                  onClick={() => setPagina(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === pagina ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-slate-500 hover:text-white hover:bg-slate-800"}`}
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
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-all"
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
