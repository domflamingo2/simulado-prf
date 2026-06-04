"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast, Toaster } from "sonner";

import { GlassCard } from "@/components/ui/GlassCard";
import { questoes } from "@/data/questoes";
import { useFinalizarSimulado } from "@/hooks/useFinalizarSimulado";
import { useSimuladoState } from "@/hooks/useSimuladoState";

import { AutoSaveIndicator } from "./components/AutoSaveIndicator";
import { ConfirmExitModal } from "./components/ConfirmExitModal";
import { FooterSimulado } from "./components/FooterSimulado";
import { HeaderSimulado } from "./components/HeaderSimulado";
import { LoadingScreen } from "./components/LoadingScreen";
import { SuccessNotification } from "./components/SuccessNotification";

import { NavegacaoDirecao } from "@/types/simulado";

// ─────────────────────────────────────────────────────────────────────────────
// Lazy
// ─────────────────────────────────────────────────────────────────────────────

const QuestaoCard = lazy(() => import("@/components/QuestaoCard"));

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ModoSimulado = "completo" | "turbo" | "adaptativo";

// ─────────────────────────────────────────────────────────────────────────────
// Consts
// ─────────────────────────────────────────────────────────────────────────────

const TEMPO_PROVA_MINUTOS = 240;
const TEMPO_TURBO_MINUTOS = 40;

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function SimuladoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const modo = (searchParams.get("modo") as ModoSimulado) || "completo";

  // ───────────────────────────────────────────────────────────────────────────
  // States
  // ───────────────────────────────────────────────────────────────────────────

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const [shakeQuestao, setShakeQuestao] = useState<number | null>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const [tempoRestante, setTempoRestante] = useState<number>(0);

  // FIX: hydration mismatch
  const [loadingProgress, setLoadingProgress] = useState(0);

  // FIX: hydration mismatch
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // ───────────────────────────────────────────────────────────────────────────
  // Tempo
  // ───────────────────────────────────────────────────────────────────────────

  const tempoMaximo =
    modo === "turbo" ? TEMPO_TURBO_MINUTOS * 60 : TEMPO_PROVA_MINUTOS * 60;

  // ───────────────────────────────────────────────────────────────────────────
  // Hooks
  // ───────────────────────────────────────────────────────────────────────────

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

  // ───────────────────────────────────────────────────────────────────────────
  // Fake loading progress
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!loading) {
      setLoadingProgress(100);
      return;
    }

    setLoadingProgress(0);

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 95) return prev;

        const increment = Math.random() * 10 + 3;

        return Math.min(prev + increment, 95);
      });
    }, 250);

    return () => clearInterval(interval);
  }, [loading]);

  // ───────────────────────────────────────────────────────────────────────────
  // Timer
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!state) return;

    setTempoRestante(tempoMaximo);

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.tempoInicio) / 1000);

      const remaining = Math.max(0, tempoMaximo - elapsed);

      setTempoRestante(remaining);

      if (remaining <= 0) {
        clearInterval(timer);

        handleFinalizar();

        toast.warning("Tempo esgotado! Finalizando simulado...");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [state, tempoMaximo]);

  // ───────────────────────────────────────────────────────────────────────────
  // Auto save
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!state) return;

    const interval = setInterval(() => {
      salvarProgresso(stateRef.current);

      setLastSaved(new Date());

      toast.info("💾 Progresso salvo automaticamente", {
        duration: 2000,
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [state, salvarProgresso, stateRef]);

  // ───────────────────────────────────────────────────────────────────────────
  // Keyboard shortcuts
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          handleNavegar("anterior");
          break;

        case "ArrowRight":
          e.preventDefault();
          handleNavegar("proxima");
          break;

        case "m":
        case "M":
          e.preventDefault();

          handleMarcarRevisao();

          toast.info(
            isMarcada ? "Questão desmarcada" : "Questão marcada para revisão",
          );

          break;

        case "Escape":
          if (!showExitConfirm) {
            setShowExitConfirm(true);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, showExitConfirm]);

  // ───────────────────────────────────────────────────────────────────────────
  // Derived values
  // ───────────────────────────────────────────────────────────────────────────

  const respondidas = useMemo(() => {
    if (!state) return 0;

    return state.questoes.filter((q) => q.respostaUsuario !== undefined).length;
  }, [state]);

  const percentualProgresso = useMemo(() => {
    if (!state || state.questoes.length === 0) return 0;

    return (respondidas / state.questoes.length) * 100;
  }, [state, respondidas]);

  const questoesRevisao = state?.marcadasParaRevisao.length ?? 0;

  const isMarcada = state
    ? state.marcadasParaRevisao.includes(state.questaoAtual + 1)
    : false;

  // ───────────────────────────────────────────────────────────────────────────
  // Actions
  // ───────────────────────────────────────────────────────────────────────────

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

      () => {
        setShowSuccess(true);

        toast.success("Simulado finalizado com sucesso! 🎉");
      },
    );
  }, [state, finalizarSimulado, modo, limparProgresso]);

  const handleNavegar = useCallback(
    (destino: "anterior" | "proxima" | number) => {
      if (!state) return;

      if (typeof destino === "number") {
        setQuestaoAtual(destino);
        return;
      }

      if (destino === "anterior") {
        setQuestaoAtual(Math.max(0, state.questaoAtual - 1));
        return;
      }

      if (destino === "proxima") {
        setQuestaoAtual(
          Math.min(state.questoes.length - 1, state.questaoAtual + 1),
        );
      }
    },
    [state, setQuestaoAtual],
  );

  const handleNavegarAdapter = useCallback(
    (direcao: NavegacaoDirecao) => {
      if (direcao === "anterior") {
        handleNavegar("anterior");
      }

      if (direcao === "proxima") {
        handleNavegar("proxima");
      }

      if (direcao === "finalizar") {
        handleFinalizar();
      }
    },
    [handleNavegar, handleFinalizar],
  );

  const handleResposta = useCallback(
    (resposta: "CERTO" | "ERRADO" | null) => {
      if (!state) return;

      const idx = state.questaoAtual;

      const questaoAtualObj = state.questoes[idx];

      atualizarResposta(idx, resposta);

      if (resposta && resposta !== questaoAtualObj.resposta) {
        setShakeQuestao(idx);

        setTimeout(() => setShakeQuestao(null), 500);

        toast.error("❌ Resposta incorreta! Verifique a explicação.");
      } else if (resposta) {
        toast.success("✅ Resposta correta! Continue assim!");
      }

      if (idx < state.questoes.length - 1) {
        setTimeout(() => {
          setQuestaoAtual(idx + 1);
        }, 300);
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
      if (respondidas > 0) {
        salvarProgresso(state);

        setLastSaved(new Date());

        toast.info("Progresso salvo! Você pode continuar depois.");
      } else {
        limparProgresso();
      }
    }

    router.push("/");
  }, [state, respondidas, salvarProgresso, limparProgresso, router]);

  // ───────────────────────────────────────────────────────────────────────────
  // Loading
  // ───────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <LoadingScreen
        modo={modo}
        analise={analiseIA ?? undefined}
        progresso={loadingProgress}
      />
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Error
  // ───────────────────────────────────────────────────────────────────────────

  if (!state || state.questoes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <GlassCard className="p-8 text-center max-w-md">
          <p className="text-slate-400 mb-4">Erro ao carregar questões.</p>

          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:from-blue-500 hover:to-blue-400 transition-all"
          >
            Voltar ao início
          </button>
        </GlassCard>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Current question
  // ───────────────────────────────────────────────────────────────────────────

  const questao = state.questoes[state.questaoAtual];

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

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

          {showSuccess && <SuccessNotification type="congrats" />}
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
          tempoRestante={tempoRestante}
          respondidas={respondidas}
          percentualProgresso={percentualProgresso}
        />

        <main className="max-w-3xl mx-auto p-4 sm:p-6 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.questaoAtual}
              initial={{
                opacity: 0,
                x: 20,
              }}
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
              exit={{
                opacity: 0,
                x: -20,
              }}
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

        <AutoSaveIndicator isSaving={false} lastSaved={lastSaved} />
      </div>
    </>
  );
}
