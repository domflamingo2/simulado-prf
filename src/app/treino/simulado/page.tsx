"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

import { QuestaoRespondida } from "@/data/questoes/index";
import { BackgroundGlow } from "../components/BackgroundGlow";

const QuestaoCard = lazy(() => import("@/components/QuestaoCard"));

interface TreinoState {
  disciplina: string;
  questoes: QuestaoRespondida[];
  mostrarExplicacao: boolean;
  modo: string;
  totalDisponiveis?: number;
}

export default function TreinoSimuladoPage() {
  const router = useRouter();
  const [treino, setTreino] = useState<TreinoState | null>(null);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<
    Record<number, "CERTO" | "ERRADO" | null>
  >({});
  const [loading, setLoading] = useState(true);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [tempoInicio] = useState(Date.now());

  useEffect(() => {
    const saved = localStorage.getItem("prf_treino_atual");
    if (!saved) {
      router.push("/treino");
      return;
    }

    try {
      const parsed: TreinoState = JSON.parse(saved);
      setTreino(parsed);
      toast.success(
        `Treino de ${parsed.disciplina.replace(/_/g, " ")} carregado!`,
      );
    } catch (err) {
      console.error("Erro ao carregar treino:", err);
      toast.error("Erro ao carregar treino");
      router.push("/treino");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleResposta = useCallback(
    (resposta: "CERTO" | "ERRADO" | null) => {
      if (!resposta) return;

      setRespostas((prev) => ({ ...prev, [questaoAtual]: resposta }));

      const questao = treino?.questoes[questaoAtual];
      const isCorrect = resposta === questao?.resposta;

      if (isCorrect) {
        toast.success("✅ Resposta correta!");
      } else {
        toast.error(`❌ Resposta incorreta! A correta é ${questao?.resposta}`);
      }

      if (treino?.mostrarExplicacao) {
        return;
      }

      if (treino && questaoAtual < treino.questoes.length - 1) {
        setTimeout(() => setQuestaoAtual((prev) => prev + 1), 500);
      }
    },
    [questaoAtual, treino],
  );

  const handleProxima = useCallback(() => {
    if (treino && questaoAtual < treino.questoes.length - 1) {
      setQuestaoAtual((prev) => prev + 1);
    }
  }, [questaoAtual, treino]);

  const handleAnterior = useCallback(() => {
    if (questaoAtual > 0) {
      setQuestaoAtual((prev) => prev - 1);
    }
  }, [questaoAtual]);

  const handleFinalizar = useCallback(() => {
    if (isFinalizing) return;

    const respondidas = Object.keys(respostas).length;
    const total = treino?.questoes.length || 0;

    if (respondidas < total) {
      toast.warning(
        `Você respondeu apenas ${respondidas} de ${total} questões. Deseja finalizar mesmo assim?`,
      );
      setShowExitConfirm(true);
      return;
    }

    confirmarFinalizacao();
  }, [respostas, treino, isFinalizing]);

  const confirmarFinalizacao = useCallback(() => {
    setIsFinalizing(true);

    const acertos = Object.entries(respostas).filter(
      ([idx, resp]) =>
        resp && treino?.questoes[parseInt(idx)].resposta === resp,
    ).length;

    const total = treino?.questoes.length || 0;
    const percentual = total > 0 ? (acertos / total) * 100 : 0;
    const tempoTotal = Math.floor((Date.now() - tempoInicio) / 1000);
    const minutos = Math.floor(tempoTotal / 60);
    const segundos = tempoTotal % 60;

    // Salvar resultado no localStorage
    const resultado = {
      data: new Date().toISOString(),
      disciplina: treino?.disciplina,
      acertos,
      total,
      percentual,
      tempo: tempoTotal,
      questoes: treino?.questoes.map((q, idx) => ({
        id: q.id,
        respostaUsuario: respostas[idx] || null,
        respostaCorreta: q.resposta,
      })),
    };

    const historicoTreinos = localStorage.getItem("prf_historico_treinos");
    const historico = historicoTreinos ? JSON.parse(historicoTreinos) : [];
    historico.unshift(resultado);
    localStorage.setItem("prf_historico_treinos", JSON.stringify(historico));

    toast.success(
      `Treino finalizado! ${acertos}/${total} acertos (${percentual.toFixed(1)}%)`,
    );

    localStorage.removeItem("prf_treino_atual");

    setTimeout(() => {
      router.push("/treino");
    }, 1500);
  }, [respostas, treino, tempoInicio, router]);

  const handleSair = useCallback(() => {
    localStorage.removeItem("prf_treino_atual");
    router.push("/treino");
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 border-r-teal-500/50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <p className="text-slate-400 font-medium">Carregando treino...</p>
        </div>
      </div>
    );
  }

  if (!treino) return null;

  const questao = treino.questoes[questaoAtual];
  const respostaAtual = respostas[questaoAtual];
  const isLast = questaoAtual === treino.questoes.length - 1;
  const respondidasCount = Object.keys(respostas).length;
  const todasRespondidas = respondidasCount === treino.questoes.length;
  const progresso = ((questaoAtual + 1) / treino.questoes.length) * 100;

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <BackgroundGlow variant="treino" intensity="medium" animated />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSair}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors group"
                >
                  <X className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                      <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h1 className="text-base font-bold text-white">
                      Treino: {treino.disciplina.replace(/_/g, " ")}
                    </h1>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Questão {questaoAtual + 1} de {treino.questoes.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/50 border border-white/10">
                  <Target className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-slate-300">
                    {respondidasCount}/{treino.questoes.length}
                  </span>
                </div>
                <button
                  onClick={handleFinalizar}
                  disabled={isFinalizing}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    todasRespondidas
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isFinalizing ? "Finalizando..." : "Finalizar"}
                </button>
              </div>
            </div>

            {/* Barra de progresso dupla */}
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Progresso
                </span>
                <span>{Math.round(progresso)}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progresso}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-3xl mx-auto p-4 sm:p-6 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={questaoAtual}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense
                fallback={
                  <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />
                }
              >
                <QuestaoCard
                  questao={questao}
                  numero={questaoAtual + 1}
                  total={treino.questoes.length}
                  onResposta={handleResposta}
                  mostrarCorrecao={!!respostaAtual && treino.mostrarExplicacao}
                  respostaUsuario={respostaAtual || undefined}
                />
              </Suspense>
            </motion.div>
          </AnimatePresence>

          {/* Navegação */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnterior}
              disabled={questaoAtual === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                questaoAtual === 0
                  ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </motion.button>

            {!isLast ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProxima}
                disabled={!respostaAtual && !treino.mostrarExplicacao}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  !respostaAtual && !treino.mostrarExplicacao
                    ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25"
                }`}
              >
                <span>Próxima</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinalizar}
                disabled={isFinalizing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/25 disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                {isFinalizing ? "Finalizando..." : "Finalizar Treino"}
              </motion.button>
            )}
          </div>

          {/* Dica */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-slate-500 flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" />
              {treino.mostrarExplicacao
                ? "Após responder, veja a explicação e clique em 'Próxima'"
                : "Responda e avance automaticamente para a próxima questão"}
            </p>
          </div>
        </main>
      </div>

      {/* Modal de confirmação de saída */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowExitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-amber-500/20">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Finalizar treino?
                </h3>
              </div>
              <p className="text-slate-400 mb-6">
                Você respondeu apenas {respondidasCount} de{" "}
                {treino.questoes.length} questões. Deseja finalizar o treino
                mesmo assim?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                >
                  Continuar
                </button>
                <button
                  onClick={confirmarFinalizacao}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                >
                  Finalizar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
