"use client";

import { QuestaoRespondida } from "@/data/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRightToLine,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  HelpCircle,
  Keyboard,
  XCircle,
} from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ============================================================================
// TYPES & CONFIGS
// ============================================================================

export interface QuestaoCardProps {
  questao: QuestaoRespondida;
  numero: number;
  total: number;
  onResposta: (resposta: "CERTO" | "ERRADO" | null) => void;
  onNavegar?: (direcao: "anterior" | "proxima" | "finalizar") => void;
  mostrarCorrecao?: boolean;
  tempoRestante?: string;
  marcadasParaRevisao?: number[];
  onMarcarRevisao?: (numero: number) => void;
  isLoading?: boolean;
  showKeyboardHints?: boolean;
}

type RespostaTipo = "CERTO" | "ERRADO";

interface DisciplinaStyle {
  nome: string;
  cor: string;
  bg: string;
  icone: string;
}

export const DISCIPLINAS_CONFIG: Record<string, DisciplinaStyle> = {
  PORTUGUES: {
    nome: "Língua Portuguesa",
    cor: "from-pink-500 to-rose-500",
    bg: "bg-pink-500/10",
    icone: "📚",
  },
  ETICA: {
    nome: "Ética e Conduta",
    cor: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
    icone: "⚖️",
  },
  RACIOCINIO_LOGICO: {
    nome: "Raciocínio Lógico",
    cor: "from-violet-500 to-purple-500",
    bg: "bg-violet-500/10",
    icone: "🧩",
  },
  DIREITO_CONSTITUCIONAL: {
    nome: "Direito Constitucional",
    cor: "from-blue-500 to-indigo-500",
    bg: "bg-blue-500/10",
    icone: "🏛️",
  },
  DIREITO_ADMINISTRATIVO: {
    nome: "Direito Administrativo",
    cor: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-500/10",
    icone: "📋",
  },
  ADMINISTRACAO: {
    nome: "Administração",
    cor: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    icone: "📊",
  },
  ARQUIVOLOGIA: {
    nome: "Arquivologia",
    cor: "from-lime-500 to-green-500",
    bg: "bg-lime-500/10",
    icone: "🗂️",
  },
  INFORMATICA: {
    nome: "Informática",
    cor: "from-sky-500 to-blue-500",
    bg: "bg-sky-500/10",
    icone: "💻",
  },
  LEGISLACAO_PRF: {
    nome: "Legislação PRF",
    cor: "from-red-500 to-rose-500",
    bg: "bg-red-500/10",
    icone: "🚔",
  },
} as const;

export const DIFICULDADE_CONFIG = {
  1: {
    cor: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "Fácil",
  },
  2: {
    cor: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "Médio",
  },
  3: {
    cor: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "Difícil",
  },
} as const;

// ============================================================================
// HELPER: classe estável para BotaoResposta
// Extraído para fora do componente — sem closures, sem re-criação
// ============================================================================

function getBotaoClasse(
  tipo: RespostaTipo,
  isSelecionado: boolean,
  isCorreta: boolean,
  isErrada: boolean,
  mostrarCorrecao: boolean,
): string {
  // FIX: `isErrada` só faz sentido visualmente quando mostrarCorrecao está ativo.
  // Sem essa guarda, o botão piscava como "errado" durante a resposta do usuário.
  if (!mostrarCorrecao) {
    if (!isSelecionado) {
      return "bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:bg-slate-800";
    }
    return tipo === "CERTO"
      ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25"
      : "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/25";
  }

  if (isCorreta) {
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500 ring-2 ring-emerald-500/50";
  }
  // FIX: só usa isErrada aqui, onde mostrarCorrecao já é true
  if (isErrada) {
    return "bg-rose-500/20 text-rose-400 border-rose-500 line-through opacity-75";
  }
  return "bg-slate-800/30 text-slate-600 border-slate-800 opacity-50";
}

// ============================================================================
// SUB-COMPONENTE: BotaoResposta (memoizado)
// ============================================================================

interface BotaoRespostaProps {
  tipo: RespostaTipo;
  isSelecionado: boolean;
  isCorreta: boolean;
  isErrada: boolean;
  mostrarCorrecao: boolean;
  isLoading: boolean;
  onResposta: (tipo: RespostaTipo) => void;
}

const BotaoResposta = memo(function BotaoResposta({
  tipo,
  isSelecionado,
  isCorreta,
  isErrada,
  mostrarCorrecao,
  isLoading,
  onResposta,
}: BotaoRespostaProps) {
  const isCerto = tipo === "CERTO";

  // FIX: classe calculada com função pura fora do componente — sem useMemo,
  // sem dependências instáveis, sem recriação de closure a cada render
  const classe = getBotaoClasse(
    tipo,
    isSelecionado,
    isCorreta,
    isErrada,
    mostrarCorrecao,
  );

  const icone = useMemo(() => {
    if (!mostrarCorrecao && !isSelecionado) return null;
    if (mostrarCorrecao && isCorreta)
      return <CheckCircle2 className="w-5 h-5" />;
    if (mostrarCorrecao && isErrada) return <XCircle className="w-5 h-5" />;
    if (!mostrarCorrecao && isSelecionado) {
      return isCerto ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <XCircle className="w-5 h-5" />
      );
    }
    return null;
  }, [mostrarCorrecao, isSelecionado, isCorreta, isErrada, isCerto]);

  // FIX: handler estável — não recria closure a cada render do pai
  const handleClick = useCallback(() => {
    if (!mostrarCorrecao && !isLoading) {
      onResposta(tipo);
    }
  }, [mostrarCorrecao, isLoading, onResposta, tipo]);

  return (
    <motion.button
      whileHover={
        !mostrarCorrecao && !isLoading ? { scale: 1.02, y: -2 } : undefined
      }
      whileTap={!mostrarCorrecao && !isLoading ? { scale: 0.97 } : undefined}
      onClick={handleClick}
      disabled={mostrarCorrecao || isLoading}
      className={[
        "relative overflow-hidden p-5 sm:p-7 rounded-2xl border-2 font-bold",
        "text-lg sm:text-xl transition-all duration-200",
        "flex items-center justify-center gap-3",
        "disabled:cursor-not-allowed",
        "focus:outline-none",
        isCerto
          ? "focus-visible:ring-4 focus-visible:ring-emerald-500/30"
          : "focus-visible:ring-4 focus-visible:ring-rose-500/30",
        classe,
      ].join(" ")}
      aria-pressed={isSelecionado}
      aria-label={`Marcar como ${tipo} (Atalho: ${isCerto ? "1 ou C" : "2 ou E"})`}
    >
      {/* Ripple de seleção */}
      <AnimatePresence mode="wait">
        {!mostrarCorrecao && isSelecionado && (
          <motion.div
            key="bg"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute inset-0 ${isCerto ? "bg-emerald-500/10" : "bg-rose-500/10"}`}
          />
        )}
      </AnimatePresence>

      {icone}
      <span>{tipo}</span>

      {!mostrarCorrecao && (
        <kbd className="absolute top-2 right-2 text-[10px] opacity-40 font-normal hidden sm:block px-1.5 py-0.5 bg-black/20 rounded">
          {isCerto ? "1" : "2"}
        </kbd>
      )}
    </motion.button>
  );
});

// ============================================================================
// SUB-COMPONENTE: IndicadorProgresso (memoizado)
// ============================================================================

interface IndicadorProgressoProps {
  total: number;
  current: number;
}

const IndicadorProgresso = memo(function IndicadorProgresso({
  total,
  current,
}: IndicadorProgressoProps) {
  // FIX: Array gerado uma única vez com useMemo — sem Array.from a cada render
  const dots = useMemo(() => {
    const count = Math.min(total, 20);
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [total]);

  const showEllipsis = total > 20;

  return (
    <div
      className="flex items-center gap-1.5"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemax={total}
      aria-label={`Progresso: questão ${current} de ${total}`}
    >
      {dots.map((questNum) => {
        const isCurrent = questNum === current;
        const isPast = questNum < current;
        return (
          <motion.div
            key={questNum}
            initial={false}
            animate={{
              scale: isCurrent ? 1.2 : 1,
              backgroundColor: isCurrent
                ? "#ffffff"
                : isPast
                  ? "#475569"
                  : "#1e293b",
            }}
            transition={{ duration: 0.15 }}
            className={`w-2 h-2 rounded-full ${isCurrent ? "ring-2 ring-white/30" : ""}`}
            aria-current={isCurrent ? "step" : undefined}
          />
        );
      })}
      {showEllipsis && (
        <span className="text-slate-600 text-xs ml-1" aria-hidden="true">
          +{total - 20}
        </span>
      )}
    </div>
  );
});

// ============================================================================
// SUB-COMPONENTE: CorrecaoPanel (memoizado)
// ============================================================================

interface CorrecaoPanelProps {
  questao: QuestaoRespondida;
}

const CorrecaoPanel = memo(function CorrecaoPanel({
  questao,
}: CorrecaoPanelProps) {
  const acertou = questao.respostaUsuario === questao.resposta;
  const respondeu = !!questao.respostaUsuario;

  const statusConfig = useMemo(() => {
    if (acertou) {
      return {
        icone: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
        titulo: "Resposta Correta!",
        corTitulo: "text-emerald-400",
        bgHeader: "bg-emerald-500/20",
        border: "border-emerald-500/50",
        bgCard: "bg-emerald-500/10",
      };
    }
    if (respondeu) {
      return {
        icone: <XCircle className="w-6 h-6 text-rose-400" />,
        titulo: "Resposta Incorreta",
        corTitulo: "text-rose-400",
        bgHeader: "bg-rose-500/20",
        border: "border-rose-500/50",
        bgCard: "bg-rose-500/10",
      };
    }
    return {
      icone: <AlertCircle className="w-6 h-6 text-amber-400" />,
      titulo: "Questão em Branco",
      corTitulo: "text-amber-400",
      bgHeader: "bg-amber-500/20",
      border: "border-amber-500/50",
      bgCard: "bg-amber-500/10",
    };
  }, [acertou, respondeu]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: 20 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden"
      role="region"
      aria-label="Correção da questão"
    >
      <div
        className={`p-5 sm:p-6 rounded-2xl border-2 ${statusConfig.bgCard} ${statusConfig.border}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-full ${statusConfig.bgHeader}`}>
            {statusConfig.icone}
          </div>
          <span className={`font-bold text-lg ${statusConfig.corTitulo}`}>
            {statusConfig.titulo}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div
            className={`p-4 rounded-xl border ${statusConfig.bgCard} ${statusConfig.border}`}
          >
            <span className="text-slate-500 block text-xs mb-1 uppercase tracking-wider font-semibold">
              Sua resposta
            </span>
            <span className={`font-bold text-lg ${statusConfig.corTitulo}`}>
              {questao.respostaUsuario ?? "Em branco"}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
            <span className="text-emerald-600 block text-xs mb-1 uppercase tracking-wider font-semibold">
              Resposta correta
            </span>
            <span className="font-bold text-lg text-emerald-400">
              {questao.resposta}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-slate-950/30 p-4 rounded-xl">
          <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
            <BookOpen className="w-5 h-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-200 mb-2 text-sm uppercase tracking-wider">
              Explicação
            </h4>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed break-words">
              {questao.explicacao || "Sem explicação disponível."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// COMPONENTE PRINCIPAL: QuestaoCard
// ============================================================================

export default memo(function QuestaoCard({
  questao,
  numero,
  total,
  onResposta,
  onNavegar,
  mostrarCorrecao = false,
  tempoRestante,
  marcadasParaRevisao = [],
  onMarcarRevisao,
  isLoading = false,
  showKeyboardHints = true,
}: QuestaoCardProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Refs para callbacks — evita re-registro do listener a cada render ──────
  // FIX principal: `onNavegar` e `onResposta` mudam a cada render do pai.
  // Usar refs garante que o listener sempre acessa a versão mais nova
  // sem precisar re-registrar no DOM (o que era a causa do "lag" no teclado).
  const onRespostaRef = useRef(onResposta);
  useEffect(() => {
    onRespostaRef.current = onResposta;
  });

  const onNavegarRef = useRef(onNavegar);
  useEffect(() => {
    onNavegarRef.current = onNavegar;
  });

  const onMarcarRevisaoRef = useRef(onMarcarRevisao);
  useEffect(() => {
    onMarcarRevisaoRef.current = onMarcarRevisao;
  });

  // Ref para o debounce do teclado — limpo quando a questão muda
  const lastKeyTimeRef = useRef<number>(0);

  // FIX: reseta o debounce quando muda de questão para evitar que o debounce
  // da questão anterior bloqueie a primeira tecla na questão seguinte
  useEffect(() => {
    lastKeyTimeRef.current = 0;
  }, [numero]);

  // ── Memos de dados ─────────────────────────────────────────────────────────

  const disciplina = useMemo(
    () =>
      DISCIPLINAS_CONFIG[questao.disciplina] ?? {
        nome: questao.disciplina,
        cor: "from-gray-500 to-slate-500",
        bg: "bg-gray-500/10",
        icone: "❓",
      },
    [questao.disciplina],
  );

  const dificuldade = useMemo(
    () =>
      questao.dificuldade
        ? (DIFICULDADE_CONFIG[
            questao.dificuldade as keyof typeof DIFICULDADE_CONFIG
          ] ?? null)
        : null,
    [questao.dificuldade],
  );

  const estaMarcada = useMemo(
    () => marcadasParaRevisao.includes(numero),
    [marcadasParaRevisao, numero],
  );

  // FIX: emBranco memoizado — antes era calculado inline a cada render
  const emBranco = useMemo(
    () => !questao.respostaUsuario && !mostrarCorrecao,
    [questao.respostaUsuario, mostrarCorrecao],
  );

  const isLastQuestion = numero === total;

  // FIX: estadosResposta.*.isErrada agora só é true quando mostrarCorrecao
  // está ativo — evita piscar o estilo "errado" durante a seleção do usuário
  const estadosResposta = useMemo(
    () => ({
      certo: {
        isSelecionado: questao.respostaUsuario === "CERTO",
        isCorreta: mostrarCorrecao && questao.resposta === "CERTO",
        isErrada:
          mostrarCorrecao &&
          questao.respostaUsuario === "CERTO" &&
          questao.resposta !== "CERTO",
      },
      errado: {
        isSelecionado: questao.respostaUsuario === "ERRADO",
        isCorreta: mostrarCorrecao && questao.resposta === "ERRADO",
        isErrada:
          mostrarCorrecao &&
          questao.respostaUsuario === "ERRADO" &&
          questao.resposta !== "ERRADO",
      },
    }),
    [questao.respostaUsuario, questao.resposta, mostrarCorrecao],
  );

  // ── Handlers estáveis ──────────────────────────────────────────────────────

  // FIX: handleResposta não precisa de useCallback dependendo de onResposta,
  // pois usa a ref. Dep array vazio = função verdadeiramente estável.
  const handleResposta = useCallback((tipo: RespostaTipo) => {
    onRespostaRef.current(tipo);
  }, []);

  const handleMarcarRevisao = useCallback(() => {
    onMarcarRevisaoRef.current?.(numero);
  }, [numero]);

  // Navegação via ref — estável
  const navegarInterno = useCallback((direcao: "anterior" | "proxima") => {
    onNavegarRef.current?.(direcao);
  }, []);

  const handleFinalizar = useCallback(() => {
    onNavegarRef.current?.("finalizar");
  }, []);

  const toggleShortcuts = useCallback(() => {
    setShowShortcuts((p) => !p);
  }, []);

  // ── Listener de teclado ────────────────────────────────────────────────────
  // FIX principal: deps array contém apenas valores primitivos estáveis.
  // `onNavegar` foi REMOVIDO das deps — usamos a ref no lugar.
  // Isso impede o re-registro do listener a cada render do pai.
  useEffect(() => {
    const KEY_DEBOUNCE_MS = 150;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Não processa quando em modo de correção ou carregando
      if (mostrarCorrecao || isLoading) return;

      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const now = Date.now();
      if (now - lastKeyTimeRef.current < KEY_DEBOUNCE_MS) return;

      switch (e.key) {
        case "1":
        case "c":
        case "C":
          e.preventDefault();
          lastKeyTimeRef.current = now;
          onRespostaRef.current("CERTO");
          break;

        case "2":
        case "e":
        case "E":
          e.preventDefault();
          lastKeyTimeRef.current = now;
          onRespostaRef.current("ERRADO");
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
          if (numero < total) {
            onNavegarRef.current?.("proxima");
          } else {
            onNavegarRef.current?.("finalizar");
          }
          break;

        case " ":
          // FIX: espaço navegava mesmo quando não havia proxima questão.
          // Agora finaliza na última questão, consistente com ArrowRight.
          e.preventDefault();
          lastKeyTimeRef.current = now;
          if (numero < total) {
            onNavegarRef.current?.("proxima");
          } else {
            onNavegarRef.current?.("finalizar");
          }
          break;

        case "m":
        case "M":
          e.preventDefault();
          lastKeyTimeRef.current = now;
          onMarcarRevisaoRef.current?.(numero);
          break;

        case "?":
          e.preventDefault();
          setShowShortcuts((p) => !p);
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    // FIX: apenas primitivos nas deps — sem funções do pai
    mostrarCorrecao,
    isLoading,
    numero,
    total,
  ]);

  // ── Focus management ───────────────────────────────────────────────────────
  // FIX: verifica se não há outro elemento ativo antes de roubar o foco.
  // Isso evita conflito com modais ou dropdowns abertos.
  useLayoutEffect(() => {
    if (isLoading) return;
    const activeEl = document.activeElement;
    const isInteractive =
      activeEl &&
      activeEl !== document.body &&
      activeEl !== containerRef.current &&
      (activeEl.tagName === "BUTTON" ||
        activeEl.tagName === "INPUT" ||
        activeEl.tagName === "A" ||
        (activeEl as HTMLElement).isContentEditable);

    if (!isInteractive) {
      containerRef.current?.focus({ preventScroll: true });
    }
  }, [numero, isLoading]);

  // ── Loading state ──────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div
        className="w-full max-w-4xl mx-auto min-h-[60vh] flex items-center justify-center"
        role="status"
        aria-label="Carregando questão"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-slate-600 border-t-white rounded-full"
          aria-hidden="true"
        />
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }

  // ── Render principal ───────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-screen flex flex-col justify-center outline-none"
      tabIndex={-1}
      role="main"
      aria-label={`Questão ${numero} de ${total}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full"
      >
        {/* Card principal */}
        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Barra de progresso superior */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800"
            role="progressbar"
            aria-valuenow={numero}
            aria-valuemax={total}
            aria-label={`Progresso: ${numero} de ${total} questões`}
          >
            <motion.div
              className={`h-full bg-gradient-to-r ${disciplina.cor}`}
              initial={{ width: 0 }}
              animate={{ width: `${(numero / total) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Header */}
          <header className="p-5 sm:p-8 border-b border-white/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Badge da disciplina */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r ${disciplina.cor} bg-opacity-10 border border-white/10 shadow-lg`}
              >
                <span className="text-xl" aria-hidden="true">
                  {disciplina.icone}
                </span>
                <span className="text-sm font-bold text-white tracking-wide">
                  {disciplina.nome}
                </span>
              </motion.div>

              {/* Controles */}
              <div className="flex items-center gap-3">
                {dificuldade && (
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${dificuldade.bg} ${dificuldade.cor} border ${dificuldade.border}`}
                    title={`Dificuldade: ${dificuldade.label}`}
                  >
                    {dificuldade.label}
                  </span>
                )}

                {tempoRestante && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700"
                    role="timer"
                    aria-label={`Tempo restante: ${tempoRestante}`}
                  >
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{tempoRestante}</span>
                  </div>
                )}

                {/* Marcar para revisão */}
                <button
                  onClick={handleMarcarRevisao}
                  className={`p-2 rounded-lg transition-all duration-200 border ${
                    estaMarcada
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-lg shadow-amber-500/20"
                      : "bg-slate-800 text-slate-500 border-slate-700 hover:text-amber-400 hover:border-amber-500/30"
                  }`}
                  title={
                    estaMarcada
                      ? "Desmarcar revisão (M)"
                      : "Marcar para revisar (M)"
                  }
                  aria-pressed={estaMarcada}
                  aria-label={
                    estaMarcada
                      ? "Desmarcar para revisão"
                      : "Marcar para revisão"
                  }
                >
                  <Flag
                    className={`w-4 h-4 ${estaMarcada ? "fill-current" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            {/* Progresso numérico + dots */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-slate-400 text-sm sm:text-base">
                Questão{" "}
                <span className="text-white font-bold text-lg">{numero}</span>{" "}
                de <span className="text-slate-500">{total}</span>
              </span>
              <IndicadorProgresso total={total} current={numero} />
            </div>
          </header>

          {/* Conteúdo */}
          <article className="p-5 sm:p-8 space-y-6">
            {/* Tags */}
            {questao.tags && questao.tags.length > 0 && (
              <div
                className="flex flex-wrap gap-2"
                role="list"
                aria-label="Tags da questão"
              >
                {questao.tags.map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="px-2.5 py-1 rounded-md text-[10px] sm:text-xs bg-slate-800/80 text-slate-400 border border-slate-700 hover:border-slate-600 transition-colors cursor-default"
                    role="listitem"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Enunciado */}
            <div className="prose prose-invert max-w-none">
              <p className="text-lg sm:text-xl text-slate-100 leading-relaxed whitespace-pre-wrap font-medium">
                {questao.enunciado}
              </p>
            </div>

            {/* Botões de resposta */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8"
              role="group"
              aria-label="Opções de resposta"
            >
              <BotaoResposta
                tipo="CERTO"
                {...estadosResposta.certo}
                mostrarCorrecao={mostrarCorrecao}
                isLoading={isLoading}
                onResposta={handleResposta}
              />
              <BotaoResposta
                tipo="ERRADO"
                {...estadosResposta.errado}
                mostrarCorrecao={mostrarCorrecao}
                isLoading={isLoading}
                onResposta={handleResposta}
              />
            </div>

            {/* Questão em branco */}
            <AnimatePresence>
              {emBranco && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 text-slate-500 text-sm bg-slate-800/30 py-2 px-4 rounded-full w-fit mx-auto"
                  role="status"
                  aria-live="polite"
                >
                  <HelpCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Questão não respondida</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Atalhos de teclado */}
            {!mostrarCorrecao && showKeyboardHints && (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={toggleShortcuts}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  aria-expanded={showShortcuts}
                  aria-controls="shortcuts-panel"
                >
                  <Keyboard className="w-3 h-3" aria-hidden="true" />
                  <span>Atalhos de teclado</span>
                </button>

                <AnimatePresence mode="wait">
                  {showShortcuts && (
                    <motion.div
                      id="shortcuts-panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden w-full"
                    >
                      <div
                        className="flex flex-wrap justify-center gap-2 text-xs text-slate-500 bg-slate-800/30 p-3 rounded-lg"
                        role="list"
                        aria-label="Lista de atalhos de teclado"
                      >
                        {[
                          { key: "1 / C", desc: "Certo" },
                          { key: "2 / E", desc: "Errado" },
                          { key: "←", desc: "Anterior" },
                          { key: "→ / Espaço", desc: "Próxima" },
                          { key: "M", desc: "Marcar" },
                          { key: "?", desc: "Ajuda" },
                        ].map(({ key, desc }) => (
                          <span key={key} role="listitem">
                            <kbd className="px-2 py-1 bg-slate-800 rounded">
                              {key}
                            </kbd>{" "}
                            {desc}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Painel de correção */}
            <AnimatePresence mode="wait">
              {mostrarCorrecao && <CorrecaoPanel questao={questao} />}
            </AnimatePresence>
          </article>

          {/* Navegação */}
          {onNavegar && (
            <nav
              className="p-5 sm:p-6 border-t border-white/5 flex items-center justify-between bg-slate-950/30"
              aria-label="Navegação entre questões"
            >
              <motion.button
                whileHover={numero > 1 ? { x: -4 } : undefined}
                whileTap={numero > 1 ? { scale: 0.95 } : undefined}
                onClick={() => navegarInterno("anterior")}
                disabled={numero === 1}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  disabled:opacity-30 disabled:cursor-not-allowed
                  hover:bg-slate-800 text-slate-300 hover:text-white
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                <span className="hidden sm:inline">Anterior</span>
              </motion.button>

              {/* Mini-barra central */}
              <div className="flex flex-col items-center">
                <span
                  className="text-xs text-slate-500 font-medium"
                  aria-live="polite"
                >
                  {numero} / {total}
                </span>
                <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-slate-600 rounded-full transition-all duration-300"
                    style={{ width: `${(numero / total) * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Próxima / Finalizar */}
              <motion.button
                whileHover={isLastQuestion ? { scale: 1.05 } : { x: 4 }}
                whileTap={{ scale: 0.95 }}
                onClick={
                  isLastQuestion
                    ? handleFinalizar
                    : () => navegarInterno("proxima")
                }
                className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                aria-label={
                  isLastQuestion ? "Finalizar simulado" : "Próxima questão"
                }
              >
                {isLastQuestion ? (
                  <>
                    <span className="hidden sm:inline">Finalizar</span>
                    <ArrowRightToLine className="w-5 h-5" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Próxima</span>
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </>
                )}
              </motion.button>
            </nav>
          )}
        </div>
      </motion.div>
    </div>
  );
});
