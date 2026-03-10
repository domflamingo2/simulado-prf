"use client";

import { QuestaoRespondida } from "@/data/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
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
import { memo, useCallback, useEffect, useMemo, useState } from "react";

interface QuestaoCardProps {
  questao: QuestaoRespondida;
  numero: number;
  total: number;
  onResposta: (resposta: "CERTO" | "ERRADO" | null) => void;
  onNavegar?: (direcao: "anterior" | "proxima") => void;
  mostrarCorrecao?: boolean;
  tempoRestante?: string;
  marcadasParaRevisao?: number[];
  onMarcarRevisao?: (numero: number) => void;
  isLoading?: boolean;
}

const disciplinasFormatadas: Record<
  string,
  { nome: string; cor: string; icone: string; bg: string }
> = {
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
};

const dificuldadeConfig = {
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
};

// Componente memoizado para evitar re-renders desnecessários
const QuestaoCard = memo(function QuestaoCard({
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
}: QuestaoCardProps) {
  const [isHovered, setIsHovered] = useState<"CERTO" | "ERRADO" | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Memoizar dados da disciplina para evitar recálculos
  const disciplina = useMemo(() => {
    return (
      disciplinasFormatadas[questao.disciplina] || {
        nome: questao.disciplina,
        cor: "from-gray-500 to-slate-500",
        bg: "bg-gray-500/10",
        icone: "❓",
      }
    );
  }, [questao.disciplina]);

  const dificuldade = useMemo(() => {
    return questao.dificuldade ? dificuldadeConfig[questao.dificuldade] : null;
  }, [questao.dificuldade]);

  const estaMarcada = useMemo(
    () => marcadasParaRevisao.includes(numero),
    [marcadasParaRevisao, numero],
  );

  const emBranco = useMemo(
    () => !questao.respostaUsuario && !mostrarCorrecao,
    [questao.respostaUsuario, mostrarCorrecao],
  );

  // Atalhos de teclado otimizados
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mostrarCorrecao || isLoading) return;

      switch (e.key) {
        case "1":
        case "c":
        case "C":
          e.preventDefault();
          onResposta("CERTO");
          break;
        case "2":
        case "e":
        case "E":
          e.preventDefault();
          onResposta("ERRADO");
          break;
        case "ArrowLeft":
          if (onNavegar && numero > 1) {
            e.preventDefault();
            onNavegar("anterior");
          }
          break;
        case "ArrowRight":
        case " ":
          if (onNavegar && numero < total) {
            e.preventDefault();
            onNavegar("proxima");
          }
          break;
        case "m":
        case "M":
          e.preventDefault();
          onMarcarRevisao?.(numero);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    mostrarCorrecao,
    isLoading,
    onResposta,
    onNavegar,
    numero,
    total,
    onMarcarRevisao,
  ]);

  // Callbacks memoizados
  const handleMarcarRevisao = useCallback(() => {
    onMarcarRevisao?.(numero);
  }, [onMarcarRevisao, numero]);

  const handleResposta = useCallback(
    (tipo: "CERTO" | "ERRADO") => {
      if (!mostrarCorrecao && !isLoading) {
        onResposta(tipo);
      }
    },
    [mostrarCorrecao, isLoading, onResposta],
  );

  const handleNavegar = useCallback(
    (direcao: "anterior" | "proxima") => {
      onNavegar?.(direcao);
    },
    [onNavegar],
  );

  // Determina o estado visual dos botões - memoizado
  const getBotaoEstado = useCallback(
    (tipo: "CERTO" | "ERRADO") => {
      const isSelecionado = questao.respostaUsuario === tipo;
      const isCorreta = questao.resposta === tipo;
      const isErrada =
        questao.respostaUsuario === tipo && questao.resposta !== tipo;

      if (!mostrarCorrecao) {
        return {
          classe: isSelecionado
            ? tipo === "CERTO"
              ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25 scale-[1.02]"
              : "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/25 scale-[1.02]"
            : "bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:bg-slate-800 hover:scale-[1.02]",
          icone: isSelecionado ? (
            tipo === "CERTO" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )
          ) : null,
        };
      }

      if (isCorreta) {
        return {
          classe:
            "bg-emerald-500/20 text-emerald-400 border-emerald-500 ring-2 ring-emerald-500/50",
          icone: <CheckCircle2 className="w-5 h-5" />,
        };
      }

      if (isErrada) {
        return {
          classe:
            "bg-rose-500/20 text-rose-400 border-rose-500 line-through opacity-75",
          icone: <XCircle className="w-5 h-5" />,
        };
      }

      return {
        classe: "bg-slate-800/30 text-slate-600 border-slate-800 opacity-50",
        icone: null,
      };
    },
    [questao.respostaUsuario, questao.resposta, mostrarCorrecao],
  );

  const estadoCerto = getBotaoEstado("CERTO");
  const estadoErrado = getBotaoEstado("ERRADO");

  // Estado de loading
  if (isLoading || !questao) {
    return (
      <div className="w-full max-w-4xl mx-auto min-h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-slate-600 border-t-white rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-screen flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full"
      >
        {/* Card Principal */}
        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Barra de progresso superior animada */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
            <motion.div
              className={`h-full bg-gradient-to-r ${disciplina.cor}`}
              initial={{ width: 0 }}
              animate={{ width: `${(numero / total) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>

          {/* Header */}
          <div className="p-5 sm:p-8 border-b border-white/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Disciplina */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r ${disciplina.cor} bg-opacity-10 border border-white/10 shadow-lg`}
              >
                <span className="text-xl">{disciplina.icone}</span>
                <span className="text-sm font-bold text-white tracking-wide">
                  {disciplina.nome}
                </span>
              </motion.div>

              {/* Meta info */}
              <div className="flex items-center gap-3">
                {dificuldade && (
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${dificuldade.bg} ${dificuldade.cor} border ${dificuldade.border}`}
                  >
                    {dificuldade.label}
                  </span>
                )}

                {tempoRestante && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                    <Clock className="w-3.5 h-3.5" />
                    {tempoRestante}
                  </div>
                )}

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
                  aria-label={
                    estaMarcada ? "Desmarcar revisão" : "Marcar para revisar"
                  }
                >
                  <Flag
                    className={`w-4 h-4 ${estaMarcada ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Progresso numérico e indicadores */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-slate-400 text-sm sm:text-base">
                Questão{" "}
                <span className="text-white font-bold text-lg">{numero}</span>{" "}
                de <span className="text-slate-500">{total}</span>
              </span>

              {/* Indicadores de progresso */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(total, 15) }, (_, i) => {
                  const questNum = i + 1;
                  const isCurrent = questNum === numero;
                  const isPast = questNum < numero;
                  const isAnswered = questNum <= total; // Simplificado, idealmente verificar se foi respondida

                  return (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={{
                        scale: isCurrent ? 1.2 : 1,
                        backgroundColor: isCurrent
                          ? "#ffffff"
                          : isPast
                            ? "#475569"
                            : "#1e293b",
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isCurrent ? "ring-2 ring-white/30" : ""
                      }`}
                    />
                  );
                })}
                {total > 15 && (
                  <span className="text-slate-600 text-xs ml-1">
                    +{total - 15}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-5 sm:p-8 space-y-6">
            {/* Tags */}
            {questao.tags && questao.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {questao.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-[10px] sm:text-xs bg-slate-800/80 text-slate-400 border border-slate-700 hover:border-slate-600 transition-colors cursor-default"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8">
              {/* Botão CERTO */}
              <motion.button
                whileHover={!mostrarCorrecao ? { scale: 1.03, y: -2 } : {}}
                whileTap={!mostrarCorrecao ? { scale: 0.97 } : {}}
                onClick={() => handleResposta("CERTO")}
                onMouseEnter={() => setIsHovered("CERTO")}
                onMouseLeave={() => setIsHovered(null)}
                disabled={mostrarCorrecao || isLoading}
                className={`
                  relative overflow-hidden p-5 sm:p-7 rounded-2xl border-2 font-bold text-lg sm:text-xl
                  transition-all duration-200 flex items-center justify-center gap-3
                  ${estadoCerto.classe}
                  disabled:cursor-not-allowed
                  focus:outline-none focus:ring-4 focus:ring-emerald-500/30
                `}
                aria-label="Marcar como Certo (Atalho: 1 ou C)"
              >
                <AnimatePresence>
                  {!mostrarCorrecao && questao.respostaUsuario === "CERTO" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-emerald-500/10"
                    />
                  )}
                </AnimatePresence>

                {estadoCerto.icone}
                <span>CERTO</span>
                {!mostrarCorrecao && (
                  <span className="absolute top-2 right-2 text-[10px] opacity-50 font-normal hidden sm:block">
                    1
                  </span>
                )}
              </motion.button>

              {/* Botão ERRADO */}
              <motion.button
                whileHover={!mostrarCorrecao ? { scale: 1.03, y: -2 } : {}}
                whileTap={!mostrarCorrecao ? { scale: 0.97 } : {}}
                onClick={() => handleResposta("ERRADO")}
                onMouseEnter={() => setIsHovered("ERRADO")}
                onMouseLeave={() => setIsHovered(null)}
                disabled={mostrarCorrecao || isLoading}
                className={`
                  relative overflow-hidden p-5 sm:p-7 rounded-2xl border-2 font-bold text-lg sm:text-xl
                  transition-all duration-200 flex items-center justify-center gap-3
                  ${estadoErrado.classe}
                  disabled:cursor-not-allowed
                  focus:outline-none focus:ring-4 focus:ring-rose-500/30
                `}
                aria-label="Marcar como Errado (Atalho: 2 ou E)"
              >
                <AnimatePresence>
                  {!mostrarCorrecao && questao.respostaUsuario === "ERRADO" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-rose-500/10"
                    />
                  )}
                </AnimatePresence>

                {estadoErrado.icone}
                <span>ERRADO</span>
                {!mostrarCorrecao && (
                  <span className="absolute top-2 right-2 text-[10px] opacity-50 font-normal hidden sm:block">
                    2
                  </span>
                )}
              </motion.button>
            </div>

            {/* Indicador de em branco */}
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

            {/* Atalhos de teclado hint */}
            {!mostrarCorrecao && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="flex items-center gap-2 mx-auto text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                <Keyboard className="w-3 h-3" />
                <span>Atalhos de teclado</span>
              </motion.button>
            )}

            <AnimatePresence>
              {showShortcuts && !mostrarCorrecao && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500 bg-slate-800/30 p-3 rounded-lg">
                    <span className="px-2 py-1 bg-slate-800 rounded">1/C</span>{" "}
                    Certo
                    <span className="px-2 py-1 bg-slate-800 rounded">
                      2/E
                    </span>{" "}
                    Errado
                    <span className="px-2 py-1 bg-slate-800 rounded">
                      ←
                    </span>{" "}
                    Anterior
                    <span className="px-2 py-1 bg-slate-800 rounded">
                      →/Espaço
                    </span>{" "}
                    Próxima
                    <span className="px-2 py-1 bg-slate-800 rounded">
                      M
                    </span>{" "}
                    Marcar revisão
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Correção/Explicação */}
            <AnimatePresence mode="wait">
              {mostrarCorrecao && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div
                    className={`
                    p-5 sm:p-6 rounded-2xl border-2
                    ${
                      questao.respostaUsuario === questao.resposta
                        ? "bg-emerald-500/10 border-emerald-500/50"
                        : questao.respostaUsuario
                          ? "bg-rose-500/10 border-rose-500/50"
                          : "bg-amber-500/10 border-amber-500/50"
                    }
                  `}
                  >
                    {/* Status da resposta */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-2 rounded-full ${
                          questao.respostaUsuario === questao.resposta
                            ? "bg-emerald-500/20"
                            : questao.respostaUsuario
                              ? "bg-rose-500/20"
                              : "bg-amber-500/20"
                        }`}
                      >
                        {questao.respostaUsuario === questao.resposta ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : questao.respostaUsuario ? (
                          <XCircle className="w-6 h-6 text-rose-400" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-amber-400" />
                        )}
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          questao.respostaUsuario === questao.resposta
                            ? "text-emerald-400"
                            : questao.respostaUsuario
                              ? "text-rose-400"
                              : "text-amber-400"
                        }`}
                      >
                        {questao.respostaUsuario === questao.resposta
                          ? "Resposta Correta!"
                          : questao.respostaUsuario
                            ? "Resposta Incorreta"
                            : "Questão em Branco"}
                      </span>
                    </div>

                    {/* Comparação de respostas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div
                        className={`p-4 rounded-xl border ${
                          questao.respostaUsuario === questao.resposta
                            ? "bg-emerald-950/30 border-emerald-500/30"
                            : questao.respostaUsuario
                              ? "bg-rose-950/30 border-rose-500/30"
                              : "bg-amber-950/30 border-amber-500/30"
                        }`}
                      >
                        <span className="text-slate-500 block text-xs mb-1 uppercase tracking-wider font-semibold">
                          Sua resposta
                        </span>
                        <span
                          className={`font-bold text-lg ${
                            questao.respostaUsuario === questao.resposta
                              ? "text-emerald-400"
                              : questao.respostaUsuario
                                ? "text-rose-400"
                                : "text-amber-400"
                          }`}
                        >
                          {questao.respostaUsuario || "Em branco"}
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

                    {/* Explicação */}
                    <div className="flex items-start gap-4 bg-slate-950/30 p-4 rounded-xl">
                      <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-200 mb-2 text-sm uppercase tracking-wider">
                          Explicação
                        </h4>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                          {questao.explicacao}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navegação */}
          {onNavegar && (
            <div className="p-5 sm:p-6 border-t border-white/5 flex items-center justify-between bg-slate-950/30">
              <motion.button
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavegar("anterior")}
                disabled={numero === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all border border-transparent hover:border-slate-700"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Anterior</span>
              </motion.button>

              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-500 font-medium">
                  {numero} / {total}
                </span>
                <div className="w-16 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-slate-600 rounded-full transition-all duration-300"
                    style={{ width: `${(numero / total) * 100}%` }}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavegar("proxima")}
                disabled={numero === total}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all border border-transparent hover:border-slate-700"
              >
                <span className="hidden sm:inline">Próxima</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
});

export default QuestaoCard;
