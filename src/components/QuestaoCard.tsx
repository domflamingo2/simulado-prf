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
  XCircle,
} from "lucide-react";
import { useState } from "react";

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
}

const disciplinasFormatadas: Record<
  string,
  { nome: string; cor: string; icone: string }
> = {
  PORTUGUES: {
    nome: "Língua Portuguesa",
    cor: "from-pink-500 to-rose-500",
    icone: "📚",
  },
  ETICA: {
    nome: "Ética e Conduta",
    cor: "from-emerald-500 to-teal-500",
    icone: "⚖️",
  },
  RACIOCINIO_LOGICO: {
    nome: "Raciocínio Lógico",
    cor: "from-violet-500 to-purple-500",
    icone: "🧩",
  },
  DIREITO_CONSTITUCIONAL: {
    nome: "Direito Constitucional",
    cor: "from-blue-500 to-indigo-500",
    icone: "🏛️",
  },
  DIREITO_ADMINISTRATIVO: {
    nome: "Direito Administrativo",
    cor: "from-cyan-500 to-blue-500",
    icone: "📋",
  },
  ADMINISTRACAO: {
    nome: "Administração",
    cor: "from-amber-500 to-orange-500",
    icone: "📊",
  },
  ARQUIVOLOGIA: {
    nome: "Arquivologia",
    cor: "from-lime-500 to-green-500",
    icone: "🗂️",
  },
  INFORMATICA: {
    nome: "Informática",
    cor: "from-sky-500 to-blue-500",
    icone: "💻",
  },
  LEGISLACAO_PRF: {
    nome: "Legislação PRF",
    cor: "from-red-500 to-rose-500",
    icone: "🚔",
  },
};

const dificuldadeConfig = {
  1: { cor: "text-emerald-400", bg: "bg-emerald-500/10", label: "Fácil" },
  2: { cor: "text-amber-400", bg: "bg-amber-500/10", label: "Médio" },
  3: { cor: "text-red-400", bg: "bg-red-500/10", label: "Difícil" },
};

export default function QuestaoCard({
  questao,
  numero,
  total,
  onResposta,
  onNavegar,
  mostrarCorrecao = false,
  tempoRestante,
  marcadasParaRevisao = [],
  onMarcarRevisao,
}: QuestaoCardProps) {
  const [isHovered, setIsHovered] = useState<"CERTO" | "ERRADO" | null>(null);

  const disciplina = disciplinasFormatadas[questao.disciplina] || {
    nome: questao.disciplina,
    cor: "from-gray-500 to-slate-500",
    icone: "❓",
  };

  const dificuldade = questao.dificuldade
    ? dificuldadeConfig[questao.dificuldade]
    : null;
  const estaMarcada = marcadasParaRevisao.includes(numero);
  const emBranco = !questao.respostaUsuario && !mostrarCorrecao;

  // Determina o estado visual dos botões
  const getBotaoEstado = (tipo: "CERTO" | "ERRADO") => {
    const isSelecionado = questao.respostaUsuario === tipo;
    const isCorreta = questao.resposta === tipo;
    const isErrada =
      questao.respostaUsuario === tipo && questao.resposta !== tipo;

    if (!mostrarCorrecao) {
      // Modo prova - apenas seleção do usuário
      return {
        classe: isSelecionado
          ? tipo === "CERTO"
            ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25"
            : "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/25"
          : "bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500 hover:bg-slate-800",
        icone: null,
      };
    }

    // Modo revisão - mostra correção
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
  };

  const estadoCerto = getBotaoEstado("CERTO");
  const estadoErrado = getBotaoEstado("ERRADO");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Card Principal */}
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Barra de progresso superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
          <motion.div
            className={`h-full bg-gradient-to-r ${disciplina.cor}`}
            initial={{ width: 0 }}
            animate={{ width: `${(numero / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Disciplina */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${disciplina.cor} bg-opacity-10 border border-white/10`}
            >
              <span className="text-lg">{disciplina.icone}</span>
              <span className="text-xs sm:text-sm font-semibold text-white">
                {disciplina.nome}
              </span>
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-2 sm:gap-3">
              {dificuldade && (
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${dificuldade.bg} ${dificuldade.cor}`}
                >
                  {dificuldade.label}
                </span>
              )}

              {tempoRestante && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs">
                  <Clock className="w-3 h-3" />
                  {tempoRestante}
                </div>
              )}

              <button
                onClick={() => onMarcarRevisao?.(numero)}
                className={`p-1.5 rounded-md transition-colors ${
                  estaMarcada
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-slate-800 text-slate-500 hover:text-amber-400"
                }`}
                title={
                  estaMarcada ? "Desmarcar revisão" : "Marcar para revisar"
                }
              >
                <Flag
                  className={`w-4 h-4 ${estaMarcada ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Progresso numérico */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Questão <span className="text-white font-bold">{numero}</span> de{" "}
              {total}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(total, 20) }, (_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i + 1 === numero
                      ? "bg-white"
                      : i + 1 < numero
                        ? "bg-slate-600"
                        : "bg-slate-800"
                  }`}
                />
              ))}
              {total > 20 && (
                <span className="text-slate-600 text-xs">...</span>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Tags */}
          {questao.tags && questao.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {questao.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] sm:text-xs bg-slate-800 text-slate-400 border border-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Enunciado */}
          <div className="prose prose-invert max-w-none">
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed whitespace-pre-wrap">
              {questao.enunciado}
            </p>
          </div>

          {/* Botões de resposta */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Botão CERTO */}
            <motion.button
              whileHover={!mostrarCorrecao ? { scale: 1.02 } : {}}
              whileTap={!mostrarCorrecao ? { scale: 0.98 } : {}}
              onClick={() => !mostrarCorrecao && onResposta("CERTO")}
              onMouseEnter={() => setIsHovered("CERTO")}
              onMouseLeave={() => setIsHovered(null)}
              disabled={mostrarCorrecao}
              className={`
                relative overflow-hidden p-4 sm:p-6 rounded-xl border-2 font-bold text-base sm:text-lg
                transition-all duration-200 flex items-center justify-center gap-2
                ${estadoCerto.classe}
                ${emBranco && isHovered === "CERTO" ? "shadow-lg shadow-emerald-500/20" : ""}
              `}
            >
              <AnimatePresence>
                {!mostrarCorrecao && questao.respostaUsuario === "CERTO" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-emerald-500/10"
                  />
                )}
              </AnimatePresence>

              {estadoCerto.icone}
              <span>CERTO</span>

              {!mostrarCorrecao && questao.respostaUsuario === "CERTO" && (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </motion.button>

            {/* Botão ERRADO */}
            <motion.button
              whileHover={!mostrarCorrecao ? { scale: 1.02 } : {}}
              whileTap={!mostrarCorrecao ? { scale: 0.98 } : {}}
              onClick={() => !mostrarCorrecao && onResposta("ERRADO")}
              onMouseEnter={() => setIsHovered("ERRADO")}
              onMouseLeave={() => setIsHovered(null)}
              disabled={mostrarCorrecao}
              className={`
                relative overflow-hidden p-4 sm:p-6 rounded-xl border-2 font-bold text-base sm:text-lg
                transition-all duration-200 flex items-center justify-center gap-2
                ${estadoErrado.classe}
                ${emBranco && isHovered === "ERRADO" ? "shadow-lg shadow-rose-500/20" : ""}
              `}
            >
              <AnimatePresence>
                {!mostrarCorrecao && questao.respostaUsuario === "ERRADO" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-rose-500/10"
                  />
                )}
              </AnimatePresence>

              {estadoErrado.icone}
              <span>ERRADO</span>

              {!mostrarCorrecao && questao.respostaUsuario === "ERRADO" && (
                <XCircle className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          {/* Indicador de em branco */}
          {emBranco && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 text-slate-500 text-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Questão não respondida</span>
            </motion.div>
          )}

          {/* Correção/Explicação */}
          <AnimatePresence>
            {mostrarCorrecao && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div
                  className={`
                  p-4 sm:p-5 rounded-xl border
                  ${
                    questao.respostaUsuario === questao.resposta
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : questao.respostaUsuario
                        ? "bg-rose-500/10 border-rose-500/30"
                        : "bg-amber-500/10 border-amber-500/30"
                  }
                `}
                >
                  {/* Status da resposta */}
                  <div className="flex items-center gap-2 mb-3">
                    {questao.respostaUsuario === questao.resposta ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="font-bold text-emerald-400">
                          Resposta Correta!
                        </span>
                      </>
                    ) : questao.respostaUsuario ? (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400" />
                        <span className="font-bold text-rose-400">
                          Resposta Incorreta
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                        <span className="font-bold text-amber-400">
                          Questão em Branco
                        </span>
                      </>
                    )}
                  </div>

                  {/* Comparação de respostas */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="p-3 rounded-lg bg-slate-950/50">
                      <span className="text-slate-500 block text-xs mb-1">
                        Sua resposta
                      </span>
                      <span
                        className={`font-bold ${
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
                    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                      <span className="text-emerald-600 block text-xs mb-1">
                        Resposta correta
                      </span>
                      <span className="font-bold text-emerald-400">
                        {questao.resposta}
                      </span>
                    </div>
                  </div>

                  {/* Explicação */}
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-200 mb-1 text-sm">
                        Explicação
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
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
          <div className="p-4 border-t border-white/5 flex items-center justify-between bg-slate-950/30">
            <button
              onClick={() => onNavegar("anterior")}
              disabled={numero === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <span className="text-xs text-slate-600">
              {numero} / {total}
            </span>

            <button
              onClick={() => onNavegar("proxima")}
              disabled={numero === total}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Próxima
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
