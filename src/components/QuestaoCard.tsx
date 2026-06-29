"use client";

import { Disciplina, QuestaoRespondida } from "@/data/questoes/index";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  AlertCircle,
  ArrowRightToLine,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Flag,
  HelpCircle,
  Keyboard,
  Lightbulb,
  Target,
  Type,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { NavegacaoDirecao } from "@/types/simulado";

// ============================================================================
// TYPES & CONFIGS
// ============================================================================

export interface QuestaoCardProps {
  questao: QuestaoRespondida;
  numero: number;
  total: number;
  onResposta: (resposta: "CERTO" | "ERRADO" | null) => void;
  onNavegar?: (direcao: NavegacaoDirecao) => void;
  onPularParaQuestao?: (numero: number) => void; // NOVO: para navegação direta pelos dots
  mostrarCorrecao?: boolean;
  respostaUsuario?: "CERTO" | "ERRADO";
  tempoRestante?: string;
  marcadasParaRevisao?: number[];
  onMarcarRevisao?: (numero: number) => void;
  isLoading?: boolean;
  showKeyboardHints?: boolean;
  historicoRespostas?: Array<{ numero: number; acertou: boolean | null }>;
  taxaAcerto?: Partial<Record<Disciplina, number>>; // CORRIGIDO: tipo correto
  dica?: string;
}

type RespostaTipo = "CERTO" | "ERRADO";

interface DisciplinaStyle {
  nome: string;
  cor: string;
  bg: string;
  icone: string;
  emoji: string;
}

export const DISCIPLINAS_CONFIG: Record<string, DisciplinaStyle> = {
  PORTUGUES: {
    nome: "Língua Portuguesa",
    cor: "from-pink-500 to-rose-500",
    bg: "bg-pink-500/10",
    icone: "📚",
    emoji: "📖",
  },
  ETICA: {
    nome: "Ética e Conduta",
    cor: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
    icone: "⚖️",
    emoji: "✨",
  },
  RACIOCINIO_LOGICO: {
    nome: "Raciocínio Lógico",
    cor: "from-violet-500 to-purple-500",
    bg: "bg-violet-500/10",
    icone: "🧩",
    emoji: "🧠",
  },
  DIREITO_CONSTITUCIONAL: {
    nome: "Direito Constitucional",
    cor: "from-blue-500 to-indigo-500",
    bg: "bg-blue-500/10",
    icone: "🏛️",
    emoji: "⚖️",
  },
  DIREITO_ADMINISTRATIVO: {
    nome: "Direito Administrativo",
    cor: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-500/10",
    icone: "📋",
    emoji: "🏛️",
  },
  ADMINISTRACAO: {
    nome: "Administração",
    cor: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    icone: "📊",
    emoji: "📈",
  },
  ARQUIVOLOGIA: {
    nome: "Arquivologia",
    cor: "from-lime-500 to-green-500",
    bg: "bg-lime-500/10",
    icone: "🗂️",
    emoji: "📂",
  },
  INFORMATICA: {
    nome: "Informática",
    cor: "from-sky-500 to-blue-500",
    bg: "bg-sky-500/10",
    icone: "💻",
    emoji: "🖥️",
  },
  LEGISLACAO_PRF: {
    nome: "Legislação PRF",
    cor: "from-red-500 to-rose-500",
    bg: "bg-red-500/10",
    icone: "🚔",
    emoji: "🚗",
  },
} as const;

export const DIFICULDADE_CONFIG = {
  1: {
    cor: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    label: "Fácil",
    icon: "🌟",
  },
  2: {
    cor: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    label: "Médio",
    icon: "⚡",
  },
  3: {
    cor: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    label: "Difícil",
    icon: "🔥",
  },
} as const;

// ============================================================================
// CONFETTI
// ============================================================================

interface ConfettiParticle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

const CONFETTI_COLORS = [
  "#34d399",
  "#10b981",
  "#6ee7b7",
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#fbbf24",
  "#f59e0b",
  "#fff",
];

function ConfettiOverlay({ active }: { active: boolean }) {
  const particles = useMemo<ConfettiParticle[]>(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.4,
      duration: 0.9 + Math.random() * 0.6,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
  }, []);

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            y: "110%",
            opacity: [1, 1, 0],
            rotate: p.rotation,
            scale: [1, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// DOTS DE QUESTÕES (COM NAVEGAÇÃO DIRETA)
// ============================================================================

function DotsNavegacao({
  total,
  atual,
  historico,
  onJumpToQuestao,
}: {
  total: number;
  atual: number;
  historico: Array<{ numero: number; acertou: boolean | null }>;
  onJumpToQuestao?: (numero: number) => void;
}) {
  const MAX_DOTS = 20;
  const mostrar = Math.min(total, MAX_DOTS);
  const inicio =
    total <= MAX_DOTS
      ? 1
      : Math.max(
          1,
          Math.min(atual - Math.floor(MAX_DOTS / 2), total - MAX_DOTS + 1),
        );

  const getDotStyle = (n: number) => {
    const h = historico.find((x) => x.numero === n);
    const isAtual = n === atual;
    if (isAtual) return "bg-white scale-125 shadow-md shadow-white/30";
    if (!h) return "bg-slate-700 hover:bg-slate-500";
    if (h.acertou === true) return "bg-emerald-500 hover:bg-emerald-400";
    if (h.acertou === false) return "bg-rose-500 hover:bg-rose-400";
    return "bg-amber-500/60";
  };

  return (
    <div className="flex items-center justify-center gap-1 py-1 flex-wrap">
      {Array.from({ length: mostrar }, (_, i) => {
        const n = inicio + i;
        return (
          <button
            key={n}
            title={`Ir para questão ${n}`}
            onClick={() => onJumpToQuestao?.(n)}
            className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${getDotStyle(n)}`}
          />
        );
      })}
      {total > MAX_DOTS && (
        <span className="text-[10px] text-slate-600 ml-1">
          +{total - MAX_DOTS}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// HISTÓRICO INLINE
// ============================================================================

function HistoricoInline({
  historico,
}: {
  historico: Array<{ numero: number; acertou: boolean | null }>;
}) {
  const ultimas = historico.slice(-8);
  if (ultimas.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-hidden">
      <span className="text-[10px] text-slate-600 font-medium uppercase tracking-widest shrink-0">
        Últimas
      </span>
      <div className="flex items-center gap-1">
        {ultimas.map((h, i) => (
          <motion.div
            key={h.numero}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            title={`Q${h.numero}: ${h.acertou === null ? "em branco" : h.acertou ? "certo" : "errado"}`}
            className={`w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-bold shrink-0 ${
              h.acertou === null
                ? "bg-slate-700 text-slate-500"
                : h.acertou
                  ? "bg-emerald-500/80 text-white"
                  : "bg-rose-500/80 text-white"
            }`}
          >
            {h.acertou === null ? "—" : h.acertou ? "✓" : "✗"}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SEQUÊNCIA DE ACERTOS
// ============================================================================

function ContadorSequencia({ sequencia }: { sequencia: number }) {
  if (sequencia < 2) return null;
  return (
    <AnimatePresence>
      <motion.div
        key={sequencia}
        initial={{ scale: 0.5, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold"
      >
        <span className="text-base leading-none">🔥</span>
        <span>{sequencia} acertos seguidos!</span>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// TAXA DE ACERTO
// ============================================================================

function TaxaAcerto({
  disciplina,
  taxa,
}: {
  disciplina: string;
  taxa: number;
}) {
  const cor =
    taxa >= 70
      ? "text-emerald-400"
      : taxa >= 50
        ? "text-amber-400"
        : "text-rose-400";
  const bg =
    taxa >= 70
      ? "bg-emerald-500/10 border-emerald-500/20"
      : taxa >= 50
        ? "bg-amber-500/10 border-amber-500/20"
        : "bg-rose-500/10 border-rose-500/20";

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${bg} ${cor}`}
      title={`Taxa de acerto em ${disciplina}`}
    >
      <Zap className="w-3 h-3" />
      <span>{taxa}% nesta disciplina</span>
    </div>
  );
}

// ============================================================================
// MODAL FINALIZAR (COM PONTUAÇÃO CEBRASPE)
// ============================================================================

function ModalFinalizar({
  onConfirmar,
  onCancelar,
  historico,
  total,
}: {
  onConfirmar: () => void;
  onCancelar: () => void;
  historico: Array<{ numero: number; acertou: boolean | null }>;
  total: number;
}) {
  const respondidas = historico.length;
  const acertos = historico.filter((h) => h.acertou === true).length;
  const erros = historico.filter((h) => h.acertou === false).length;
  const branco = total - respondidas;
  const pontuacaoLiquida = acertos - erros;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.7)" }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-black text-lg tracking-tight">
              Finalizar simulado?
            </h2>
            <button
              onClick={onCancelar}
              className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-1">
            Confira seu resumo antes de confirmar.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                Respondidas
              </span>
              <span className="text-white font-bold tabular-nums">
                {respondidas} / {total}
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(respondidas / total) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Acertos",
                value: acertos,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/20",
              },
              {
                label: "Erros",
                value: erros,
                color: "text-rose-400",
                bg: "bg-rose-500/10 border-rose-500/20",
              },
              {
                label: "Em branco",
                value: branco,
                color: "text-slate-400",
                bg: "bg-slate-800/60 border-slate-700/40",
              },
            ].map(({ label, value, color, bg }) => (
              <div
                key={label}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border ${bg}`}
              >
                <span className={`text-2xl font-black tabular-nums ${color}`}>
                  {value}
                </span>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {respondidas > 0 && (
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-slate-500 text-sm">Pontuação líquida:</span>
              <span
                className={`text-lg font-black tabular-nums ${pontuacaoLiquida >= 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {pontuacaoLiquida} / {total}
              </span>
            </div>
          )}

          {branco > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-300 text-xs leading-relaxed">
                Você ainda tem <strong>{branco}</strong> questão
                {branco > 1 ? "ões" : ""} em branco. Tem certeza que quer
                finalizar?
              </p>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Continuar
          </button>
          <button
            onClick={onConfirmar}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-opacity"
          >
            Finalizar agora
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// PAINEL DE DICA
// ============================================================================

const PainelDica = memo(function PainelDica({
  dica,
  dicasUsadas,
  limiteDicas,
  onUsarDica,
  dicaVisivel,
}: {
  dica?: string;
  dicasUsadas: number;
  limiteDicas: number;
  onUsarDica: () => void;
  dicaVisivel: boolean;
}) {
  const restantes = limiteDicas - dicasUsadas;
  const semDicas = restantes <= 0;

  if (!dica) return null;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!dicaVisivel ? (
          <motion.div
            key="btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={onUsarDica}
              disabled={semDicas}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                semDicas
                  ? "bg-slate-800/30 text-slate-600 border-slate-800 cursor-not-allowed opacity-50"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              {semDicas
                ? "Sem dicas restantes"
                : `Ver dica (${restantes} restante${restantes > 1 ? "s" : ""})`}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dica"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/25 flex items-start gap-3"
          >
            <div className="p-1.5 bg-amber-500/15 rounded-lg shrink-0">
              <Lightbulb className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-amber-600 font-bold mb-1">
                Dica
              </p>
              <p className="text-amber-200 text-sm leading-relaxed">{dica}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ============================================================================
// HELPERS
// ============================================================================

function getBotaoClasse(
  tipo: RespostaTipo,
  isSelecionado: boolean,
  isCorreta: boolean,
  isErrada: boolean,
  mostrarCorrecao: boolean,
): string {
  if (!mostrarCorrecao) {
    if (!isSelecionado) {
      return tipo === "CERTO"
        ? "bg-slate-800/60 text-slate-300 border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-300"
        : "bg-slate-800/60 text-slate-300 border-white/10 hover:border-rose-500/50 hover:bg-rose-500/5 hover:text-rose-300";
    }
    return tipo === "CERTO"
      ? "bg-gradient-to-br from-emerald-600/90 to-emerald-500/90 text-white border-emerald-400/60 shadow-lg shadow-emerald-500/25"
      : "bg-gradient-to-br from-rose-600/90 to-rose-500/90 text-white border-rose-400/60 shadow-lg shadow-rose-500/25";
  }

  if (isCorreta)
    return "bg-emerald-500/15 text-emerald-300 border-emerald-400/60 ring-2 ring-emerald-400/30";
  if (isErrada)
    return "bg-rose-500/15 text-rose-400 border-rose-500/50 line-through opacity-60";
  return "bg-slate-800/30 text-slate-600 border-slate-800/80 opacity-40";
}

// ============================================================================
// SUB-COMPONENTES
// ============================================================================

const BotaoResposta = memo(
  React.forwardRef<
    HTMLButtonElement,
    {
      tipo: RespostaTipo;
      isSelecionado: boolean;
      isCorreta: boolean;
      isErrada: boolean;
      mostrarCorrecao: boolean;
      isLoading: boolean;
      modoLeitura: boolean;
      onResposta: (tipo: RespostaTipo) => void;
    }
  >(function BotaoResposta(
    {
      tipo,
      isSelecionado,
      isCorreta,
      isErrada,
      mostrarCorrecao,
      isLoading,
      modoLeitura,
      onResposta,
    },
    ref,
  ) {
    const isCerto = tipo === "CERTO";
    const classe = getBotaoClasse(
      tipo,
      isSelecionado,
      isCorreta,
      isErrada,
      mostrarCorrecao,
    );

    const handleClick = useCallback(() => {
      if (!mostrarCorrecao && !isLoading) onResposta(tipo);
    }, [mostrarCorrecao, isLoading, onResposta, tipo]);

    const iconLeft = mostrarCorrecao ? (
      isCorreta ? (
        <CheckCircle2 className="w-5 h-5 shrink-0" />
      ) : isErrada ? (
        <XCircle className="w-5 h-5 shrink-0" />
      ) : null
    ) : isSelecionado ? (
      isCerto ? (
        <CheckCircle2 className="w-5 h-5 shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 shrink-0" />
      )
    ) : (
      <span className="w-7 h-7 rounded-full border-2 border-current/30 flex items-center justify-center text-xs font-bold opacity-50 shrink-0">
        {isCerto ? "C" : "E"}
      </span>
    );

    return (
      <motion.button
        ref={ref}
        whileHover={
          !mostrarCorrecao && !isLoading ? { scale: 1.015, y: -2 } : {}
        }
        whileTap={!mostrarCorrecao && !isLoading ? { scale: 0.985 } : {}}
        onClick={handleClick}
        disabled={mostrarCorrecao || isLoading}
        aria-label={tipo === "CERTO" ? "Responder Certo" : "Responder Errado"}
        aria-pressed={isSelecionado}
        className={`
          relative overflow-hidden w-full px-6 rounded-2xl border-2 font-bold
          ${modoLeitura ? "py-6 text-lg" : "py-5 text-base sm:text-lg"}
          transition-all duration-200
          flex items-center justify-center gap-3
          disabled:cursor-not-allowed focus:outline-none
          ${
            isCerto
              ? "focus-visible:ring-4 focus-visible:ring-emerald-500/30"
              : "focus-visible:ring-4 focus-visible:ring-rose-500/30"
          }
          ${classe}
        `}
      >
        <AnimatePresence>
          {!mostrarCorrecao && isSelecionado && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`absolute inset-0 rounded-2xl ${isCerto ? "bg-emerald-400/10" : "bg-rose-400/10"}`}
            />
          )}
        </AnimatePresence>
        {iconLeft}
        <span className="tracking-wide text-sm sm:text-base font-bold uppercase">
          {tipo}
        </span>
        {!mostrarCorrecao && (
          <kbd className="absolute top-2 right-3 text-[10px] opacity-30 font-normal hidden sm:flex items-center px-1.5 py-0.5 bg-black/30 rounded gap-0.5">
            {isCerto ? "1" : "2"}
          </kbd>
        )}
      </motion.button>
    );
  }),
);

const CorrecaoPanel = memo(
  function CorrecaoPanel({ questao }: { questao: QuestaoRespondida }) {
    const acertou = questao.respostaUsuario === questao.resposta;
    const respondeu = !!questao.respostaUsuario;

    const statusConfig = useMemo(() => {
      if (acertou)
        return {
          icone: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          titulo: "Resposta Correta!",
          corTitulo: "text-emerald-300",
          bgHeader: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          bgCard: "bg-emerald-500/5",
        };
      if (respondeu)
        return {
          icone: <XCircle className="w-5 h-5 text-rose-400" />,
          titulo: "Resposta Incorreta",
          corTitulo: "text-rose-300",
          bgHeader: "bg-rose-500/10",
          border: "border-rose-500/30",
          bgCard: "bg-rose-500/5",
        };
      return {
        icone: <AlertCircle className="w-5 h-5 text-amber-400" />,
        titulo: "Questão em Branco",
        corTitulo: "text-amber-300",
        bgHeader: "bg-amber-500/10",
        border: "border-amber-500/30",
        bgCard: "bg-amber-500/5",
      };
    }, [acertou, respondeu]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div
          className={`rounded-2xl border ${statusConfig.bgCard} ${statusConfig.border} overflow-hidden`}
        >
          <div
            className={`flex items-center gap-3 px-5 py-4 ${statusConfig.bgHeader} border-b ${statusConfig.border}`}
          >
            <div className="p-1.5 rounded-lg bg-black/20">
              {statusConfig.icone}
            </div>
            <span className={`font-bold text-base ${statusConfig.corTitulo}`}>
              {statusConfig.titulo}
            </span>
          </div>

          <div className="grid grid-cols-2 divide-x divide-white/5 border-b border-white/5">
            <div className="p-5 flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
                Sua resposta
              </span>
              <span className={`font-bold text-xl ${statusConfig.corTitulo}`}>
                {questao.respostaUsuario ?? (
                  <span className="text-slate-500 text-base font-medium">
                    —
                  </span>
                )}
              </span>
            </div>
            <div className="p-5 flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-widest text-emerald-600 font-semibold">
                Resposta correta
              </span>
              <span className="font-bold text-xl text-emerald-300">
                {questao.resposta}
              </span>
            </div>
          </div>

          <div className="p-5 flex items-start gap-4">
            <div className="mt-0.5 p-2 bg-blue-500/15 rounded-xl shrink-0">
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold mb-2">
                Comentário
              </p>
              <p className="text-slate-300 text-sm sm:text-[15px] leading-relaxed">
                {questao.explicacao ||
                  "Sem explicação disponível para esta questão."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
  (prev, next) => {
    return (
      prev.questao.respostaUsuario === next.questao.respostaUsuario &&
      prev.questao.resposta === next.questao.resposta &&
      prev.questao.explicacao === next.questao.explicacao
    );
  },
);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const LIMITE_DICAS = 3;

export default memo(function QuestaoCard({
  questao,
  numero,
  total,
  onResposta,
  onNavegar,
  onPularParaQuestao,
  mostrarCorrecao = false,
  tempoRestante,
  marcadasParaRevisao = [],
  onMarcarRevisao,
  isLoading = false,
  showKeyboardHints = true,
  historicoRespostas = [],
  taxaAcerto = {},
  dica,
}: QuestaoCardProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [modoFoco, setModoFoco] = useState(false);
  const [modoLeitura, setModoLeitura] = useState(false);
  const [modoRevisaoRapida, setModoRevisaoRapida] = useState(false);
  const [revelarGabarito, setRevelarGabarito] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dicasUsadas, setDicasUsadas] = useState(0);
  const [dicaVisivel, setDicaVisivel] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const botaoCertoRef = useRef<HTMLButtonElement>(null);
  const onRespostaRef = useRef(onResposta);
  const onNavegarRef = useRef(onNavegar);
  const onMarcarRevisaoRef = useRef(onMarcarRevisao);
  const lastKeyTimeRef = useRef<number>(0);
  const cardControls = useAnimation();

  // Histórico ordenado por número
  const historicoOrdenado = useMemo(() => {
    return [...historicoRespostas].sort((a, b) => a.numero - b.numero);
  }, [historicoRespostas]);

  // Sequência de acertos baseada no histórico ordenado
  const sequenciaAtual = useMemo(() => {
    let seq = 0;
    for (let i = historicoOrdenado.length - 1; i >= 0; i--) {
      if (historicoOrdenado[i].acertou === true) seq++;
      else break;
    }
    return seq;
  }, [historicoOrdenado]);

  useEffect(() => {
    onRespostaRef.current = onResposta;
    onNavegarRef.current = onNavegar;
    onMarcarRevisaoRef.current = onMarcarRevisao;
  });

  useEffect(() => {
    lastKeyTimeRef.current = 0;
    setDicaVisivel(false);
    setRevelarGabarito(false);
    // Reset dicas por simulado (global) – se for por questão, descomente a linha abaixo
    // setDicasUsadas(0);
  }, [numero]);

  useEffect(() => {
    if (mostrarCorrecao && questao.respostaUsuario === questao.resposta) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 1800);
      return () => clearTimeout(t);
    }
  }, [mostrarCorrecao, questao.respostaUsuario, questao.resposta]);

  useEffect(() => {
    if (
      mostrarCorrecao &&
      questao.respostaUsuario &&
      questao.respostaUsuario !== questao.resposta
    ) {
      cardControls.start({
        x: [0, -10, 10, -8, 8, -4, 4, 0],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    }
  }, [
    mostrarCorrecao,
    questao.respostaUsuario,
    questao.resposta,
    cardControls,
  ]);

  // Lógica de exibição da correção
  const mostrarCorrecaoEfetiva =
    mostrarCorrecao ||
    revelarGabarito ||
    (modoRevisaoRapida && questao.respostaUsuario != null);
  const desabilitarBotoes = mostrarCorrecao; // apenas correção normal bloqueia (revisão rápida não bloqueia)

  // Estilos da disciplina (sem useMemo)
  const disciplina = DISCIPLINAS_CONFIG[questao.disciplina] ?? {
    nome: questao.disciplina,
    cor: "from-gray-500 to-slate-500",
    bg: "bg-gray-500/10",
    icone: "❓",
    emoji: "❓",
  };

  const dificuldade = questao.dificuldade
    ? DIFICULDADE_CONFIG[questao.dificuldade as keyof typeof DIFICULDADE_CONFIG]
    : null;

  const estaMarcada = marcadasParaRevisao.includes(numero);

  const emBranco = !questao.respostaUsuario && !mostrarCorrecaoEfetiva;

  const isLastQuestion = numero === total;

  const taxaDisciplina = taxaAcerto[questao.disciplina];

  const estadosResposta = useMemo(
    () => ({
      certo: {
        isSelecionado: questao.respostaUsuario === "CERTO",
        isCorreta: mostrarCorrecaoEfetiva && questao.resposta === "CERTO",
        isErrada:
          mostrarCorrecaoEfetiva &&
          questao.respostaUsuario === "CERTO" &&
          questao.resposta !== "CERTO",
      },
      errado: {
        isSelecionado: questao.respostaUsuario === "ERRADO",
        isCorreta: mostrarCorrecaoEfetiva && questao.resposta === "ERRADO",
        isErrada:
          mostrarCorrecaoEfetiva &&
          questao.respostaUsuario === "ERRADO" &&
          questao.resposta !== "ERRADO",
      },
    }),
    [questao.respostaUsuario, questao.resposta, mostrarCorrecaoEfetiva],
  );

  const handleResposta = useCallback((tipo: RespostaTipo) => {
    onRespostaRef.current(tipo);
  }, []);

  const handleMarcarRevisao = useCallback(() => {
    onMarcarRevisaoRef.current?.(numero);
  }, [numero]);

  const navegarInterno = useCallback((direcao: NavegacaoDirecao) => {
    onNavegarRef.current?.(direcao);
  }, []);

  const handleFinalizar = useCallback(() => {
    setShowModal(true);
  }, []);

  const confirmarFinalizar = useCallback(() => {
    setShowModal(false);
    onNavegarRef.current?.("finalizar");
  }, []);

  const toggleShortcuts = useCallback(() => setShowShortcuts((p) => !p), []);
  const toggleModoFoco = useCallback(() => setModoFoco((p) => !p), []);
  const toggleModoLeitura = useCallback(() => setModoLeitura((p) => !p), []);
  const toggleModoRevisaoRapida = useCallback(
    () => setModoRevisaoRapida((p) => !p),
    [],
  );
  const handleRevelarGabarito = useCallback(() => {
    setRevelarGabarito(true);
  }, []);

  const handleUsarDica = useCallback(() => {
    if (dicasUsadas < LIMITE_DICAS) {
      setDicasUsadas((p) => p + 1);
      setDicaVisivel(true);
    }
  }, [dicasUsadas]);

  // Keyboard listener
  useEffect(() => {
    const KEY_DEBOUNCE_MS = 50; // reduzido de 150ms
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showModal) return; // impede atalhos com modal aberto
      if (isLoading) return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      const now = Date.now();
      if (now - lastKeyTimeRef.current < KEY_DEBOUNCE_MS) return;

      switch (e.key) {
        case "1":
        case "c":
        case "C":
          if (!desabilitarBotoes) {
            e.preventDefault();
            lastKeyTimeRef.current = now;
            handleResposta("CERTO");
          }
          break;
        case "2":
        case "e":
        case "E":
          if (!desabilitarBotoes) {
            e.preventDefault();
            lastKeyTimeRef.current = now;
            handleResposta("ERRADO");
          }
          break;
        case "ArrowLeft":
          if (numero > 1) {
            e.preventDefault();
            lastKeyTimeRef.current = now;
            onNavegarRef.current?.("anterior");
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          lastKeyTimeRef.current = now;
          if (numero < total) onNavegarRef.current?.("proxima");
          else handleFinalizar();
          break;
        case " ":
          e.preventDefault();
          lastKeyTimeRef.current = now;
          if (numero < total) onNavegarRef.current?.("proxima");
          else handleFinalizar();
          break;
        case "m":
        case "M":
          e.preventDefault();
          lastKeyTimeRef.current = now;
          onMarcarRevisaoRef.current?.(numero);
          break;
        case "f":
        case "F":
          e.preventDefault();
          setModoFoco((p) => !p);
          break;
        case "?":
          e.preventDefault();
          setShowShortcuts((p) => !p);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    desabilitarBotoes,
    isLoading,
    numero,
    total,
    handleResposta,
    handleFinalizar,
    showModal,
  ]);

  // Foco no primeiro botão após navegação (melhor acessibilidade)
  useEffect(() => {
    if (isLoading) return;
    const timeout = setTimeout(() => {
      if (!mostrarCorrecaoEfetiva && botaoCertoRef.current) {
        botaoCertoRef.current.focus();
      } else {
        containerRef.current?.focus({ preventScroll: true });
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [numero, isLoading, mostrarCorrecaoEfetiva]);

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-[3px] border-blue-500/20 border-t-blue-500 border-r-purple-500/50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const progressoPct = Math.round((numero / total) * 100);

  // Instruções ocultas para leitores de tela
  const screenReaderInstructions = (
    <div className="sr-only" aria-live="polite">
      Atalhos de teclado: tecla 1 ou C para Certo, tecla 2 ou E para Errado,
      seta esquerda para questão anterior, seta direita ou espaço para próxima.
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <ModalFinalizar
            onConfirmar={confirmarFinalizar}
            onCancelar={() => setShowModal(false)}
            historico={historicoOrdenado}
            total={total}
          />
        )}
      </AnimatePresence>

      {screenReaderInstructions}

      <div
        ref={containerRef}
        className={`w-full mx-auto px-4 sm:px-6 outline-none transition-all duration-300 ${
          modoFoco
            ? "max-w-2xl py-4"
            : "max-w-3xl py-10 min-h-screen flex flex-col justify-center"
        }`}
        tabIndex={-1}
        role="main"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 120,
            damping: 20,
          }}
          className="w-full"
        >
          {!modoFoco && historicoOrdenado.length > 0 && (
            <div className="flex items-center justify-between px-1 mb-3 flex-wrap gap-2">
              <HistoricoInline historico={historicoOrdenado} />
              <ContadorSequencia sequencia={sequenciaAtual} />
            </div>
          )}

          <motion.div
            animate={cardControls}
            className="relative bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/8 shadow-2xl shadow-black/40 overflow-hidden"
          >
            <ConfettiOverlay active={showConfetti} />

            <div
              className={`absolute -top-20 left-1/2 -translate-x-1/2 w-2/3 h-40 rounded-full blur-3xl opacity-10 bg-gradient-to-r ${disciplina.cor} pointer-events-none`}
            />

            <AnimatePresence>
              {!modoFoco && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative px-5 pt-6 pb-5 sm:px-8 sm:pt-7 border-b border-white/6 overflow-hidden"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r ${disciplina.cor} opacity-90 shadow-md`}
                    >
                      <span className="text-base leading-none">
                        {disciplina.emoji}
                      </span>
                      <span className="text-[12px] font-bold text-white tracking-wide">
                        {disciplina.nome}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {dificuldade && (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${dificuldade.bg} ${dificuldade.cor} border ${dificuldade.border}`}
                        >
                          {dificuldade.icon} {dificuldade.label}
                        </span>
                      )}
                      {tempoRestante && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-[11px] font-semibold border border-slate-700/60">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="tabular-nums">{tempoRestante}</span>
                        </div>
                      )}
                      <button
                        onClick={handleMarcarRevisao}
                        className={`p-2 rounded-lg transition-all duration-200 border ${
                          estaMarcada
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/40"
                            : "bg-slate-800/60 text-slate-500 border-slate-700/60 hover:text-amber-400 hover:border-amber-500/30"
                        }`}
                        title={
                          estaMarcada
                            ? "Desmarcar (M)"
                            : "Marcar para revisão (M)"
                        }
                      >
                        <Flag
                          className={`w-3.5 h-3.5 ${estaMarcada ? "fill-current" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-white tabular-nums leading-none">
                          {String(numero).padStart(2, "0")}
                        </span>
                        <span className="text-slate-600 text-sm font-medium">
                          / {String(total).padStart(2, "0")}
                        </span>
                      </div>
                      {estaMarcada && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-bold border border-amber-500/25"
                        >
                          <Flag className="w-2.5 h-2.5 fill-current" />
                          Para revisão
                        </motion.span>
                      )}
                    </div>
                    {taxaDisciplina !== undefined && (
                      <TaxaAcerto
                        disciplina={disciplina.nome}
                        taxa={taxaDisciplina}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={`px-5 sm:px-8 space-y-6 transition-all duration-300 ${
                modoFoco ? "py-6" : "py-7 sm:py-8"
              }`}
            >
              <div className="flex items-center justify-between">
                {modoFoco && (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-white tabular-nums leading-none">
                      {String(numero).padStart(2, "0")}
                    </span>
                    <span className="text-slate-600 text-sm">/ {total}</span>
                  </div>
                )}
                <div
                  className={`flex items-center gap-2 ${modoFoco ? "" : "ml-auto"}`}
                >
                  <button
                    onClick={toggleModoRevisaoRapida}
                    title="Modo revisão rápida — ver gabarito ao responder"
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                      modoRevisaoRapida
                        ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                        : "bg-slate-800/60 text-slate-500 border-slate-700/40 hover:text-slate-300"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Revisão rápida</span>
                  </button>

                  <button
                    onClick={handleRevelarGabarito}
                    disabled={mostrarCorrecaoEfetiva}
                    title="Revelar resposta correta"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border bg-slate-800/60 text-slate-500 border-slate-700/40 hover:text-slate-300"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Revelar</span>
                  </button>

                  <button
                    onClick={toggleModoLeitura}
                    title="Modo leitura — fonte maior"
                    className={`p-1.5 rounded-lg border transition-all text-[11px] ${
                      modoLeitura
                        ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                        : "bg-slate-800/60 text-slate-500 border-slate-700/40 hover:text-slate-300"
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={toggleModoFoco}
                    title={
                      modoFoco
                        ? "Sair do modo foco (F)"
                        : "Modo foco — oculta cabeçalho (F)"
                    }
                    className={`p-1.5 rounded-lg border transition-all ${
                      modoFoco
                        ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                        : "bg-slate-800/60 text-slate-500 border-slate-700/40 hover:text-slate-300"
                    }`}
                  >
                    {modoFoco ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {questao.tags && questao.tags.length > 0 && !modoFoco && (
                <div className="flex flex-wrap gap-1.5">
                  {questao.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-slate-800/70 text-slate-400 border border-slate-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="relative">
                <div
                  className={`absolute -left-3 top-0 bottom-0 w-0.5 rounded-full bg-gradient-to-b ${disciplina.cor} opacity-40`}
                />
                <p
                  className={`text-slate-100 whitespace-pre-wrap tracking-[0.01em] transition-all duration-300 ${
                    modoLeitura
                      ? "text-lg sm:text-xl leading-[2] font-normal"
                      : "text-[15px] sm:text-base lg:text-[17px] leading-[1.75] font-normal"
                  }`}
                >
                  {questao.enunciado}
                </p>
              </div>

              {!mostrarCorrecaoEfetiva && (
                <PainelDica
                  dica={dica}
                  dicasUsadas={dicasUsadas}
                  limiteDicas={LIMITE_DICAS}
                  onUsarDica={handleUsarDica}
                  dicaVisivel={dicaVisivel}
                />
              )}

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <BotaoResposta
                  ref={botaoCertoRef}
                  tipo="CERTO"
                  {...estadosResposta.certo}
                  mostrarCorrecao={desabilitarBotoes}
                  isLoading={isLoading}
                  modoLeitura={modoLeitura}
                  onResposta={handleResposta}
                />
                <BotaoResposta
                  tipo="ERRADO"
                  {...estadosResposta.errado}
                  mostrarCorrecao={desabilitarBotoes}
                  isLoading={isLoading}
                  modoLeitura={modoLeitura}
                  onResposta={handleResposta}
                />
              </div>

              {modoRevisaoRapida && !mostrarCorrecaoEfetiva && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-violet-400 text-xs bg-violet-500/10 border border-violet-500/20 py-2 px-4 rounded-full w-fit mx-auto"
                >
                  <Eye className="w-3 h-3" />
                  <span>
                    Revisão rápida ativa — gabarito exibido ao responder
                  </span>
                </motion.div>
              )}

              <AnimatePresence>
                {emBranco && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center gap-2 text-slate-500 text-xs bg-slate-800/40 border border-slate-700/40 py-2 px-4 rounded-full w-fit mx-auto"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Não respondida</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {!mostrarCorrecaoEfetiva && showKeyboardHints && (
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={toggleShortcuts}
                    className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    <Keyboard className="w-3 h-3" />
                    <span>Atalhos de teclado</span>
                  </button>
                  <AnimatePresence>
                    {showShortcuts && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden w-full"
                      >
                        <div className="flex flex-wrap justify-center gap-2.5 text-[11px] text-slate-500 bg-slate-800/30 border border-white/5 p-3.5 rounded-xl">
                          {[
                            { key: "1 / C", desc: "Certo" },
                            { key: "2 / E", desc: "Errado" },
                            { key: "←", desc: "Anterior" },
                            { key: "→ / Espaço", desc: "Próxima" },
                            { key: "M", desc: "Marcar" },
                            { key: "F", desc: "Modo foco" },
                            { key: "?", desc: "Ajuda" },
                          ].map(({ key, desc }) => (
                            <span key={key} className="flex items-center gap-1">
                              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">
                                {key}
                              </kbd>
                              <span>{desc}</span>
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <AnimatePresence>
                {mostrarCorrecaoEfetiva && <CorrecaoPanel questao={questao} />}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {!modoFoco && onNavegar && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-4 sm:px-8 border-t border-white/6 bg-slate-950/30 flex items-center justify-between gap-4">
                    <motion.button
                      whileHover={numero > 1 ? { x: -3 } : {}}
                      whileTap={numero > 1 ? { scale: 0.95 } : {}}
                      onClick={() => navegarInterno("anterior")}
                      disabled={numero === 1}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </motion.button>

                    {/* Dots de navegação clicáveis */}
                    <DotsNavegacao
                      total={total}
                      atual={numero}
                      historico={historicoOrdenado}
                      onJumpToQuestao={onPularParaQuestao}
                    />

                    <motion.button
                      whileHover={isLastQuestion ? { scale: 1.04 } : { x: 3 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={
                        isLastQuestion
                          ? handleFinalizar
                          : () => navegarInterno("proxima")
                      }
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${
                        isLastQuestion
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-purple-500/20"
                          : "bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white shadow-blue-500/10"
                      }`}
                    >
                      {isLastQuestion ? (
                        <>
                          Finalizar
                          <ArrowRightToLine className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Próxima
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {modoFoco && onNavegar && (
              <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-3">
                <motion.button
                  whileHover={numero > 1 ? { x: -2 } : {}}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navegarInterno("anterior")}
                  disabled={numero === 1}
                  className="p-2 rounded-xl bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-white transition-all disabled:opacity-25"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>

                <DotsNavegacao
                  total={total}
                  atual={numero}
                  historico={historicoOrdenado}
                  onJumpToQuestao={onPularParaQuestao}
                />

                <motion.button
                  whileHover={isLastQuestion ? { scale: 1.04 } : { x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={
                    isLastQuestion
                      ? handleFinalizar
                      : () => navegarInterno("proxima")
                  }
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg ${
                    isLastQuestion
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white"
                  }`}
                >
                  {isLastQuestion ? (
                    <>
                      Finalizar <ArrowRightToLine className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Próxima <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
});
