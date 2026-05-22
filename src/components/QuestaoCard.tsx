"use client";

import { QuestaoRespondida } from "@/data/index";
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
  Target,
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
  mostrarCorrecao?: boolean;
  respostaUsuario?: "CERTO" | "ERRADO";
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
// SUB-COMPONENTES
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
      return "bg-slate-800/50 text-slate-400 border-white/10 hover:border-blue-500/30 hover:bg-slate-800";
    }
    return tipo === "CERTO"
      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30"
      : "bg-gradient-to-r from-rose-600 to-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30";
  }

  if (isCorreta) {
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500 ring-2 ring-emerald-500/50 backdrop-blur-sm";
  }
  if (isErrada) {
    return "bg-rose-500/20 text-rose-400 border-rose-500 line-through opacity-75";
  }
  return "bg-slate-800/30 text-slate-600 border-slate-800 opacity-50";
}

const BotaoResposta = memo(function BotaoResposta({
  tipo,
  isSelecionado,
  isCorreta,
  isErrada,
  mostrarCorrecao,
  isLoading,
  onResposta,
}: {
  tipo: RespostaTipo;
  isSelecionado: boolean;
  isCorreta: boolean;
  isErrada: boolean;
  mostrarCorrecao: boolean;
  isLoading: boolean;
  onResposta: (tipo: RespostaTipo) => void;
}) {
  const isCerto = tipo === "CERTO";
  const classe = getBotaoClasse(
    tipo,
    isSelecionado,
    isCorreta,
    isErrada,
    mostrarCorrecao,
  );

  const handleClick = useCallback(() => {
    if (!mostrarCorrecao && !isLoading) {
      onResposta(tipo);
    }
  }, [mostrarCorrecao, isLoading, onResposta, tipo]);

  return (
    <motion.button
      whileHover={!mostrarCorrecao && !isLoading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!mostrarCorrecao && !isLoading ? { scale: 0.98 } : {}}
      onClick={handleClick}
      disabled={mostrarCorrecao || isLoading}
      className={`
        relative overflow-hidden p-5 sm:p-7 rounded-2xl border-2 font-bold
        text-lg sm:text-xl transition-all duration-200
        flex items-center justify-center gap-3
        disabled:cursor-not-allowed focus:outline-none
        ${isCerto ? "focus-visible:ring-4 focus-visible:ring-emerald-500/30" : "focus-visible:ring-4 focus-visible:ring-rose-500/30"}
        ${classe}
      `}
      aria-pressed={isSelecionado}
    >
      <AnimatePresence>
        {!mostrarCorrecao && isSelecionado && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute inset-0 ${isCerto ? "bg-emerald-500/10" : "bg-rose-500/10"}`}
          />
        )}
      </AnimatePresence>

      {mostrarCorrecao && isCorreta && <CheckCircle2 className="w-5 h-5" />}
      {mostrarCorrecao && isErrada && <XCircle className="w-5 h-5" />}
      {!mostrarCorrecao &&
        isSelecionado &&
        (isCerto ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <XCircle className="w-5 h-5" />
        ))}
      <span>{tipo}</span>

      {!mostrarCorrecao && (
        <kbd className="absolute top-2 right-2 text-[10px] opacity-40 font-normal hidden sm:block px-1.5 py-0.5 bg-black/20 rounded">
          {isCerto ? "1" : "2"}
        </kbd>
      )}
    </motion.button>
  );
});

const CorrecaoPanel = memo(function CorrecaoPanel({
  questao,
}: {
  questao: QuestaoRespondida;
}) {
  const acertou = questao.respostaUsuario === questao.resposta;
  const respondeu = !!questao.respostaUsuario;

  const statusConfig = useMemo(() => {
    if (acertou) {
      return {
        icone: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
        titulo: "Resposta Correta!",
        corTitulo: "text-emerald-400",
        bgHeader: "bg-emerald-500/20",
        border: "border-emerald-500/40",
        bgCard: "bg-emerald-500/10",
      };
    }
    if (respondeu) {
      return {
        icone: <XCircle className="w-6 h-6 text-rose-400" />,
        titulo: "Resposta Incorreta",
        corTitulo: "text-rose-400",
        bgHeader: "bg-rose-500/20",
        border: "border-rose-500/40",
        bgCard: "bg-rose-500/10",
      };
    }
    return {
      icone: <AlertCircle className="w-6 h-6 text-amber-400" />,
      titulo: "Questão em Branco",
      corTitulo: "text-amber-400",
      bgHeader: "bg-amber-500/20",
      border: "border-amber-500/40",
      bgCard: "bg-amber-500/10",
    };
  }, [acertou, respondeu]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div
        className={`p-5 sm:p-6 rounded-2xl border-2 ${statusConfig.bgCard} ${statusConfig.border} backdrop-blur-sm`}
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
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-emerald-600 block text-xs mb-1 uppercase tracking-wider font-semibold">
              Resposta correta
            </span>
            <span className="font-bold text-lg text-emerald-400">
              {questao.resposta}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/10">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-200 mb-2 text-sm uppercase tracking-wider">
              Explicação
            </h4>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {questao.explicacao || "Sem explicação disponível."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ============================================================================
// COMPONENTE PRINCIPAL
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
  const onRespostaRef = useRef(onResposta);
  const onNavegarRef = useRef(onNavegar);
  const onMarcarRevisaoRef = useRef(onMarcarRevisao);
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    onRespostaRef.current = onResposta;
    onNavegarRef.current = onNavegar;
    onMarcarRevisaoRef.current = onMarcarRevisao;
  });

  useEffect(() => {
    lastKeyTimeRef.current = 0;
  }, [numero]);

  const disciplina = useMemo(
    () =>
      DISCIPLINAS_CONFIG[questao.disciplina] ?? {
        nome: questao.disciplina,
        cor: "from-gray-500 to-slate-500",
        bg: "bg-gray-500/10",
        icone: "❓",
        emoji: "❓",
      },
    [questao.disciplina],
  );

  const dificuldade = useMemo(
    () =>
      questao.dificuldade
        ? DIFICULDADE_CONFIG[
            questao.dificuldade as keyof typeof DIFICULDADE_CONFIG
          ]
        : null,
    [questao.dificuldade],
  );

  const estaMarcada = useMemo(
    () => marcadasParaRevisao.includes(numero),
    [marcadasParaRevisao, numero],
  );

  const emBranco = useMemo(
    () => !questao.respostaUsuario && !mostrarCorrecao,
    [questao.respostaUsuario, mostrarCorrecao],
  );

  const isLastQuestion = numero === total;

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

  const handleResposta = useCallback((tipo: RespostaTipo) => {
    onRespostaRef.current(tipo);
  }, []);

  const handleMarcarRevisao = useCallback(() => {
    onMarcarRevisaoRef.current?.(numero);
  }, [numero]);

  const navegarInterno = useCallback((direcao: "anterior" | "proxima") => {
    onNavegarRef.current?.(direcao);
  }, []);

  const handleFinalizar = useCallback(() => {
    onNavegarRef.current?.("finalizar");
  }, []);

  const toggleShortcuts = useCallback(() => {
    setShowShortcuts((p) => !p);
  }, []);

  // Keyboard listener
  useEffect(() => {
    const KEY_DEBOUNCE_MS = 150;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mostrarCorrecao || isLoading) return;
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
          if (numero < total) onNavegarRef.current?.("proxima");
          else onNavegarRef.current?.("finalizar");
          break;
        case " ":
          e.preventDefault();
          lastKeyTimeRef.current = now;
          if (numero < total) onNavegarRef.current?.("proxima");
          else onNavegarRef.current?.("finalizar");
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mostrarCorrecao, isLoading, numero, total]);

  useLayoutEffect(() => {
    if (isLoading) return;
    const activeEl = document.activeElement;
    const isInteractive =
      activeEl &&
      activeEl !== document.body &&
      activeEl !== containerRef.current &&
      (activeEl.tagName === "BUTTON" ||
        activeEl.tagName === "INPUT" ||
        activeEl.tagName === "A");
    if (!isInteractive) containerRef.current?.focus({ preventScroll: true });
  }, [numero, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-3 border-blue-500/20 border-t-blue-500 border-r-purple-500/50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-screen flex flex-col justify-center outline-none"
      tabIndex={-1}
      role="main"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="w-full"
      >
        <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
            <motion.div
              className={`h-full bg-gradient-to-r ${disciplina.cor}`}
              initial={{ width: 0 }}
              animate={{ width: `${(numero / total) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Header */}
          <div className="p-5 sm:p-8 border-b border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r ${disciplina.cor} bg-opacity-20 border border-white/10 shadow-lg`}
              >
                <span className="text-xl">{disciplina.emoji}</span>
                <span className="text-sm font-bold text-white">
                  {disciplina.nome}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {dificuldade && (
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${dificuldade.bg} ${dificuldade.cor} border ${dificuldade.border}`}
                  >
                    {dificuldade.icon} {dificuldade.label}
                  </span>
                )}
                {tempoRestante && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{tempoRestante}</span>
                  </div>
                )}
                <button
                  onClick={handleMarcarRevisao}
                  className={`p-2 rounded-lg transition-all duration-200 border ${
                    estaMarcada
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-lg shadow-amber-500/20"
                      : "bg-slate-800 text-slate-500 border-slate-700 hover:text-amber-400 hover:border-amber-500/30"
                  }`}
                  title={
                    estaMarcada
                      ? "Desmarcar revisão (M)"
                      : "Marcar para revisar (M)"
                  }
                >
                  <Flag
                    className={`w-4 h-4 ${estaMarcada ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-slate-400 text-sm sm:text-base">
                Questão{" "}
                <span className="text-white font-bold text-lg">{numero}</span>{" "}
                de <span className="text-slate-500">{total}</span>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8 space-y-6">
            {questao.tags && questao.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {questao.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-[10px] bg-slate-800/80 text-slate-400 border border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <p className="text-lg sm:text-xl text-slate-100 leading-relaxed whitespace-pre-wrap font-medium">
                {questao.enunciado}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8">
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

            <AnimatePresence>
              {emBranco && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 text-slate-500 text-sm bg-slate-800/30 py-2 px-4 rounded-full w-fit mx-auto"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Questão não respondida</span>
                </motion.div>
              )}
            </AnimatePresence>

            {!mostrarCorrecao && showKeyboardHints && (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={toggleShortcuts}
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
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
                      className="overflow-hidden w-full"
                    >
                      <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500 bg-slate-800/30 p-3 rounded-lg">
                        {[
                          { key: "1 / C", desc: "Certo" },
                          { key: "2 / E", desc: "Errado" },
                          { key: "←", desc: "Anterior" },
                          { key: "→ / Espaço", desc: "Próxima" },
                          { key: "M", desc: "Marcar" },
                          { key: "?", desc: "Ajuda" },
                        ].map(({ key, desc }) => (
                          <span key={key}>
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

            <AnimatePresence>
              {mostrarCorrecao && <CorrecaoPanel questao={questao} />}
            </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          {onNavegar && (
            <div className="p-5 sm:p-6 border-t border-white/10 flex items-center justify-between bg-slate-950/30">
              <motion.button
                whileHover={numero > 1 ? { x: -4 } : {}}
                whileTap={numero > 1 ? { scale: 0.95 } : {}}
                onClick={() => navegarInterno("anterior")}
                disabled={numero === 1}
                className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 hover:bg-slate-800 text-slate-300"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Anterior</span>
              </motion.button>

              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-500 font-medium">
                  {numero} / {total}
                </span>
                <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-slate-600 rounded-full"
                    style={{ width: `${(numero / total) * 100}%` }}
                  />
                </div>
              </div>

              <motion.button
                whileHover={isLastQuestion ? { scale: 1.05 } : { x: 4 }}
                whileTap={{ scale: 0.95 }}
                onClick={
                  isLastQuestion
                    ? handleFinalizar
                    : () => navegarInterno("proxima")
                }
                className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              >
                {isLastQuestion ? (
                  <>
                    Finalizar <ArrowRightToLine className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Próxima <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
});
