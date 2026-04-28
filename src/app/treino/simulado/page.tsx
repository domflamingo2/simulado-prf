"use client";

import { useRouter } from "next/navigation";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";

import { QuestaoRespondida } from "@/data/index";

const QuestaoCard = lazy(() => import("@/components/QuestaoCard"));

interface TreinoState {
  disciplina: string;
  questoes: QuestaoRespondida[];
  mostrarExplicacao: boolean;
  modo: string;
}

export default function TreinoSimuladoPage() {
  const router = useRouter();
  const [treino, setTreino] = useState<TreinoState | null>(null);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<
    Record<number, "CERTO" | "ERRADO" | null>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("prf_treino_atual");
    if (!saved) {
      router.push("/treino");
      return;
    }

    try {
      const parsed: TreinoState = JSON.parse(saved);
      setTreino(parsed);
    } catch (err) {
      console.error("Erro ao carregar treino:", err);
      router.push("/treino");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleResposta = useCallback(
    (resposta: "CERTO" | "ERRADO" | null) => {
      setRespostas((prev) => ({ ...prev, [questaoAtual]: resposta }));

      if (treino?.mostrarExplicacao) {
        // Se mostrar explicação, fica na mesma questão
        return;
      }

      // Avança para próxima
      if (treino && questaoAtual < treino.questoes.length - 1) {
        setQuestaoAtual((prev) => prev + 1);
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
    // Salva resultados
    const acertos = Object.entries(respostas).filter(
      ([idx, resp]) =>
        resp && treino?.questoes[parseInt(idx)].resposta === resp,
    ).length;

    const total = treino?.questoes.length || 0;
    const percentual = total > 0 ? (acertos / total) * 100 : 0;

    alert(
      `Treino finalizado!\nAcertos: ${acertos}/${total} (${percentual.toFixed(1)}%)`,
    );

    localStorage.removeItem("prf_treino_atual");
    router.push("/treino");
  }, [respostas, treino, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800" />
          <div className="w-48 h-4 rounded bg-slate-800" />
        </div>
      </div>
    );
  }

  if (!treino) {
    return null;
  }

  const questao = treino.questoes[questaoAtual];
  const respostaAtual = respostas[questaoAtual];
  const isLast = questaoAtual === treino.questoes.length - 1;
  const todasRespondidas =
    Object.keys(respostas).length === treino.questoes.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-12">
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-white">
                Treino: {treino.disciplina.replace(/_/g, " ")}
              </h1>
              <p className="text-xs text-slate-400">
                Questão {questaoAtual + 1} de {treino.questoes.length}
              </p>
            </div>
            <button
              onClick={handleFinalizar}
              disabled={!todasRespondidas}
              className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finalizar
            </button>
          </div>

          <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{
                width: `${((questaoAtual + 1) / treino.questoes.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 pt-6">
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
          />
        </Suspense>

        <div className="flex items-center justify-between gap-4 mt-6">
          <button
            onClick={handleAnterior}
            disabled={questaoAtual === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {!isLast ? (
            <button
              onClick={handleProxima}
              disabled={!respostaAtual && !treino.mostrarExplicacao}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          ) : (
            <button
              onClick={handleFinalizar}
              disabled={!todasRespondidas}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
            >
              Finalizar Treino
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
