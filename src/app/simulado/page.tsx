"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";

import { GlassCard } from "@/components/ui/GlassCard";
import { questoes } from "@/data";
import { useFinalizarSimulado } from "@/hooks/useFinalizarSimulado";
import { useSimuladoState } from "@/hooks/useSimuladoState";
import { AutoSaveIndicator } from "./components/AutoSaveIndicator";
import { ConfirmExitModal } from "./components/ConfirmExitModal";
import { FooterSimulado } from "./components/FooterSimulado";
import { HeaderSimulado } from "./components/HeaderSimulado";
import { LoadingScreen } from "./components/LoadingScreen";
import { SuccessNotification } from "./components/SuccessNotification";

import { NavegacaoDirecao } from "@/types/simulado";

const QuestaoCard = lazy(() => import("@/components/QuestaoCard"));

type ModoSimulado = "completo" | "turbo" | "adaptativo";

const TEMPO_PROVA_MINUTOS = 240;
const TEMPO_TURBO_MINUTOS = 40;

export default function SimuladoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modo = (searchParams.get("modo") as ModoSimulado) || "completo";

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [shakeQuestao, setShakeQuestao] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const tempoMaximo =
    modo === "turbo" ? TEMPO_TURBO_MINUTOS * 60 : TEMPO_PROVA_MINUTOS * 60;

  const {
    state,
    loading,
    analiseIA,
    salvarProgresso,
    limparProgresso,
    setQuestaoAtual,
    atualizarResposta,
    toggleMarcacao,
    stateRef,
  } = useSimuladoState(modo, questoes, () => {});

  const { finalizarSimulado, isFinalizing } = useFinalizarSimulado();

  // =============================
  // AUTO SAVE
  // =============================
  useEffect(() => {
    if (!state) return;

    const interval = setInterval(() => {
      salvarProgresso(stateRef.current);
    }, 30000);

    return () => clearInterval(interval);
  }, [state, salvarProgresso, stateRef]);

  // =============================
  // FINALIZAR (DECLARADO ANTES)
  // =============================
  const handleFinalizar = useCallback(() => {
    if (!state) return;

    finalizarSimulado(
      state.questoes,
      state.tempoInicio,
      modo === "turbo"
        ? "TURBO"
        : modo === "adaptativo"
          ? "ADAPTATIVO"
          : "COMPLETO",
      limparProgresso,
      () => setShowSuccess(true),
    );
  }, [state, finalizarSimulado, modo, limparProgresso]);

  // =============================
  // NAVEGAÇÃO BASE (AGORA EXISTE)
  // =============================
  const handleNavegar = useCallback(
    (destino: "anterior" | "proxima" | number) => {
      if (!state) return;

      if (typeof destino === "number") {
        setQuestaoAtual(destino);
      } else if (destino === "anterior") {
        setQuestaoAtual(Math.max(0, state.questaoAtual - 1));
      } else if (destino === "proxima") {
        setQuestaoAtual(
          Math.min(state.questoes.length - 1, state.questaoAtual + 1),
        );
      }
    },
    [state, setQuestaoAtual],
  );

  // =============================
  // ADAPTER (RESOLVE O BUG)
  // =============================
  const handleNavegarAdapter = useCallback(
    (direcao: NavegacaoDirecao) => {
      if (!state) return;

      if (direcao === "anterior") {
        handleNavegar("anterior");
      } else if (direcao === "proxima") {
        handleNavegar("proxima");
      } else if (direcao === "finalizar") {
        handleFinalizar();
      }
    },
    [state, handleNavegar, handleFinalizar],
  );

  // =============================
  // RESPOSTA
  // =============================
  const handleResposta = useCallback(
    (resposta: "CERTO" | "ERRADO" | null) => {
      if (!state) return;

      const idx = state.questaoAtual;
      const questaoAtualObj = state.questoes[idx];

      atualizarResposta(idx, resposta);

      if (resposta && resposta !== questaoAtualObj.resposta) {
        setShakeQuestao(idx);
        setTimeout(() => setShakeQuestao(null), 500);
      }

      if (idx < state.questoes.length - 1) {
        setQuestaoAtual(idx + 1);
      }
    },
    [state, atualizarResposta, setQuestaoAtual],
  );

  const handleMarcarRevisao = useCallback(() => {
    if (!state) return;
    toggleMarcacao(state.questaoAtual + 1);
  }, [state, toggleMarcacao]);

  const handleSair = useCallback(() => {
    if (state) {
      const respondidas = state.questoes.filter(
        (q) => q.respostaUsuario !== undefined,
      ).length;

      if (respondidas > 0) {
        salvarProgresso(state);
      } else {
        limparProgresso();
      }
    }
    router.push("/");
  }, [state, salvarProgresso, limparProgresso, router]);

  // =============================
  // LOADING
  // =============================
  if (loading) {
    return <LoadingScreen modo={modo} analise={analiseIA ?? undefined} />;
  }

  if (!state || state.questoes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <p className="text-slate-400">Erro ao carregar questões.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Voltar
          </button>
        </GlassCard>
      </div>
    );
  }

  const questao = state.questoes[state.questaoAtual];
  const respondidas = state.questoes.filter(
    (q) => q.respostaUsuario !== undefined,
  ).length;

  const percentualProgresso = (respondidas / state.questoes.length) * 100;

  const questoesRevisao = state.marcadasParaRevisao.length;
  const isMarcada = state.marcadasParaRevisao.includes(state.questaoAtual + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-32">
      <AnimatePresence>
        {showExitConfirm && (
          <ConfirmExitModal
            respondidas={respondidas}
            total={state.questoes.length}
            onConfirm={handleSair}
            onCancel={() => setShowExitConfirm(false)}
          />
        )}
        {showSuccess && <SuccessNotification />}
      </AnimatePresence>

      <HeaderSimulado
        modo={modo}
        questaoAtual={state.questaoAtual}
        totalQuestoes={state.questoes.length}
        questoesRevisao={questoesRevisao}
        isMarcada={isMarcada}
        onSair={() => setShowExitConfirm(true)}
        onMarcarRevisao={handleMarcarRevisao}
        tempoMaximo={tempoMaximo}
        respondidas={respondidas}
        percentualProgresso={percentualProgresso}
      />

      <main className="max-w-3xl mx-auto p-4 sm:p-6 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.questaoAtual}
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x:
                shakeQuestao === state.questaoAtual
                  ? [0, -10, 10, -10, 10, 0]
                  : 0,
              transition:
                shakeQuestao === state.questaoAtual
                  ? { duration: 0.4 }
                  : { duration: 0.2 },
            }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Suspense
              fallback={
                <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />
              }
            >
              <QuestaoCard
                questao={questao}
                numero={state.questaoAtual + 1}
                total={state.questoes.length}
                onResposta={handleResposta}
                onNavegar={handleNavegarAdapter}
                mostrarCorrecao={false}
                marcadasParaRevisao={state.marcadasParaRevisao}
                onMarcarRevisao={handleMarcarRevisao}
              />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <FooterSimulado
        questaoAtual={state.questaoAtual}
        totalQuestoes={state.questoes.length}
        questoes={state.questoes}
        respondidas={respondidas}
        percentualProgresso={percentualProgresso}
        isFinalizing={isFinalizing}
        onAnterior={() => handleNavegar("anterior")}
        onProxima={() => handleNavegar("proxima")}
        onNavigate={handleNavegar}
        onFinalizar={handleFinalizar}
      />

      <AutoSaveIndicator />
    </div>
  );
}
