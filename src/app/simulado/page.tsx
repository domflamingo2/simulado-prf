"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  Loader2,
  Save,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// Lazy load componentes pesados
const Cronometro = lazy(() => import("@/components/Cronometro"));
const QuestaoCard = lazy(() => import("@/components/QuestaoCard"));
const GlassCard = lazy(() => import("@/components/ui/GlassCard"));

// Imports síncronos de hooks/utilitários
import { questoes, TEMPO_PROVA_MINUTOS } from "@/data/questoes";
import { HistoricoSimulado, Questao, QuestaoRespondida } from "@/data/types";
import { useGamificacao } from "@/hooks/useGamificacao";
import {
  gerarAnaliseAdaptativa,
  SelecaoAdaptativaResult,
  selecionarQuestoesAdaptativas,
} from "@/lib/adaptativo";
import { calcularEstatisticas, selecionarQuestoes } from "@/lib/simulado-logic";

// ═══════════════════════════════════════════════════════════
// CONSTANTES E TIPOS
// ═══════════════════════════════════════════════════════════

type ModoSimulado = "completo" | "turbo" | "adaptativo";

const CONFIG = {
  XP_POR_QUESTAO: 1,
  XP_POR_ACERTO: 10,
  TEMPO_ANALISE_IA: 2000,
  AUTO_SALVAR_INTERVALO: 30000, // 30s
  CHAVE_PROGRESSO: "prf_simulado_progresso",
} as const;

interface SimuladoState {
  questoes: QuestaoRespondida[];
  questaoAtual: number;
  tempoInicio: number;
  modo: ModoSimulado;
  marcadasParaRevisao: number[];
}

// ═══════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════

function LoadingScreen({
  modo,
  analise,
}: {
  modo: ModoSimulado;
  analise?: ReturnType<typeof gerarAnaliseAdaptativa>;
}) {
  const isAdaptativo = modo === "adaptativo";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <GlassCard
        className="p-8 text-center max-w-md w-full"
        glow={isAdaptativo ? "purple" : "blue"}
      >
        {isAdaptativo ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 text-purple-400">
              IA Analisando...
            </h2>
            <p className="text-slate-400 mb-6">
              Estudando seu histórico para personalizar o simulado
            </p>

            {analise && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left space-y-2 mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800"
              >
                <p className="text-sm text-rose-400 font-medium">
                  ⚠️ Pontos fracos detectados:
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  {analise.disciplinasCriticas.slice(0, 3).map((d) => (
                    <li key={d.disciplina} className="flex justify-between">
                      <span>• {d.disciplina.replace(/_/g, " ")}</span>
                      <span className="text-rose-400">
                        {(d.taxaErro * 100).toFixed(0)}% erro
                      </span>
                    </li>
                  ))}
                </ul>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="mt-3 h-1 bg-purple-500/20 rounded-full overflow-hidden"
                >
                  <div className="h-full bg-purple-500 rounded-full" />
                </motion.div>
              </motion.div>
            )}
          </>
        ) : (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white">
              Preparando simulado...
            </h2>
            <p className="text-slate-400 mt-2">
              Selecionando questões da banca CEBRASPE
            </p>
          </>
        )}
      </GlassCard>
    </div>
  );
}

function NavigationDots({
  total,
  atual,
  questoes,
  onNavigate,
}: {
  total: number;
  atual: number;
  questoes: QuestaoRespondida[];
  onNavigate: (idx: number) => void;
}) {
  const maxDots = 25;
  const showDots = Math.min(total, maxDots);
  const start = Math.max(
    0,
    Math.min(atual - Math.floor(maxDots / 2), total - maxDots),
  );
  const visibleDots = questoes.slice(start, start + showDots);

  return (
    <div className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-800">
      {start > 0 && <span className="text-xs text-slate-600">...</span>}

      {visibleDots.map((q, idx) => {
        const realIdx = start + idx;
        const isActive = realIdx === atual;
        const isRespondida = q.respostaUsuario !== undefined;
        const isCorreta = isRespondida && q.respostaUsuario === q.resposta;
        const isErrada = isRespondida && q.respostaUsuario !== q.resposta;

        return (
          <button
            key={realIdx}
            onClick={() => onNavigate(realIdx)}
            className={`
              w-2.5 h-2.5 rounded-full transition-all duration-200
              ${isActive ? "w-6 bg-blue-400" : ""}
              ${isCorreta && !isActive ? "bg-emerald-500" : ""}
              ${isErrada && !isActive ? "bg-rose-500" : ""}
              ${!isRespondida && !isActive ? "bg-slate-600 hover:bg-slate-500" : ""}
            `}
            aria-label={`Ir para questão ${realIdx + 1}`}
          />
        );
      })}

      {start + showDots < total && (
        <span className="text-xs text-slate-600">...</span>
      )}

      <span className="ml-2 text-xs text-slate-500">
        {atual + 1}/{total}
      </span>
    </div>
  );
}

function ConfirmExitModal({
  onConfirm,
  onCancel,
  respondidas,
  total,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  respondidas: number;
  total: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Sair do simulado?</h3>
        </div>

        <p className="text-slate-400 mb-4">
          Você respondeu {respondidas} de {total} questões. Seu progresso foi
          salvo e você pode continuar depois.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            Continuar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
          >
            Sair e salvar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function SimuladoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modo = (searchParams.get("modo") as ModoSimulado) || "completo";

  // Estados
  const [state, setState] = useState<SimuladoState | null>(null);
  const [loading, setLoading] = useState(true);
  const [analiseIA, setAnaliseIA] = useState<ReturnType<
    typeof gerarAnaliseAdaptativa
  > | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [shakeQuestao, setShakeQuestao] = useState<number | null>(null);

  const { adicionarXP, registrarAtividade } = useGamificacao();
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Recupera progresso salvo ou inicia novo
  useEffect(() => {
    const chave = `${CONFIG.CHAVE_PROGRESSO}_${modo}`;
    const salvo = localStorage.getItem(chave);

    if (salvo) {
      try {
        const parsed: SimuladoState = JSON.parse(salvo);
        // Verifica se é do mesmo modo e não expirou (24h)
        const expirado = Date.now() - parsed.tempoInicio > 24 * 60 * 60 * 1000;

        if (
          !expirado &&
          parsed.modo === modo &&
          confirm("Continuar simulado anterior?")
        ) {
          setState(parsed);
          setLoading(false);
          return;
        } else {
          localStorage.removeItem(chave);
        }
      } catch {
        localStorage.removeItem(chave);
      }
    }

    // Inicia novo simulado
    const inicializar = async () => {
      try {
        let selecionadas: Questao[] = [];
        let metadados: SelecaoAdaptativaResult["metadados"] | null = null;

        if (modo === "adaptativo") {
          const historico = JSON.parse(
            localStorage.getItem("prf_historico") || "[]",
          );
          const analise = gerarAnaliseAdaptativa(historico, questoes);
          setAnaliseIA(analise);

          await new Promise((r) => setTimeout(r, CONFIG.TEMPO_ANALISE_IA));

          const resultado = selecionarQuestoesAdaptativas(
            questoes,
            historico,
            60,
          );
          selecionadas = resultado.questoes;
          metadados = resultado.metadados;
        } else {
          selecionadas = selecionarQuestoes(questoes, {
            modo: modo === "turbo" ? "TURBO" : "COMPLETO",
          });
        }

        const novoState: SimuladoState = {
          questoes: selecionadas.map((q) => ({
            ...q,
            respostaUsuario: undefined,
          })),
          questaoAtual: 0,
          tempoInicio: Date.now(),
          modo,
          marcadasParaRevisao: [],
        };

        setState(novoState);

        // Salva metadados do modo adaptativo para resultado
        if (metadados) {
          sessionStorage.setItem(
            "prf_simulado_metadados",
            JSON.stringify(metadados),
          );
        }
      } catch (error) {
        console.error("Erro ao inicializar simulado:", error);
        alert("Erro ao carregar questões. Tente novamente.");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    inicializar();
  }, [modo, router]);

  // Auto-salvar a cada 30s
  useEffect(() => {
    if (!state) return;

    autoSaveRef.current = setInterval(() => {
      localStorage.setItem(
        `${CONFIG.CHAVE_PROGRESSO}_${modo}`,
        JSON.stringify(state),
      );
    }, CONFIG.AUTO_SALVAR_INTERVALO);

    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [state, modo]);

  // Confirmação de saída
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        state &&
        state.questoes.some((q) => q.respostaUsuario !== undefined)
      ) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state]);

  // Pausa visibilidade
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && autoSaveRef.current) {
        // Salva imediatamente ao sair
        localStorage.setItem(
          `${CONFIG.CHAVE_PROGRESSO}_${modo}`,
          JSON.stringify(state),
        );
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [state, modo]);

  // Handlers
  const handleResposta = useCallback(
    (resposta: "CERTO" | "ERRADO" | null) => {
      if (!state) return;

      const novasQuestoes = [...state.questoes];
      const questaoAtual = novasQuestoes[state.questaoAtual];

      questaoAtual.respostaUsuario = resposta;

      setState((prev) => (prev ? { ...prev, questoes: novasQuestoes } : null));

      // XP por questão
      adicionarXP(CONFIG.XP_POR_QUESTAO);

      // Shake se errou
      if (resposta !== questaoAtual.resposta) {
        setShakeQuestao(state.questaoAtual);
        setTimeout(() => setShakeQuestao(null), 500);
      }

      // Avança automaticamente após 300ms (feedback visual)
      setTimeout(() => {
        if (state.questaoAtual < state.questoes.length - 1) {
          setState((prev) =>
            prev ? { ...prev, questaoAtual: prev.questaoAtual + 1 } : null,
          );
        }
      }, 300);
    },
    [state, adicionarXP],
  );

  const handleNavegar = useCallback(
    (direcao: "anterior" | "proxima" | number) => {
      if (!state) return;

      let novoIndex: number;
      if (typeof direcao === "number") {
        novoIndex = direcao;
      } else {
        novoIndex =
          direcao === "anterior"
            ? Math.max(0, state.questaoAtual - 1)
            : Math.min(state.questoes.length - 1, state.questaoAtual + 1);
      }

      setState((prev) => (prev ? { ...prev, questaoAtual: novoIndex } : null));
    },
    [state],
  );

  const handleMarcarRevisao = useCallback(() => {
    if (!state) return;

    const numero = state.questaoAtual + 1;
    const jaMarcada = state.marcadasParaRevisao.includes(numero);

    setState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        marcadasParaRevisao: jaMarcada
          ? prev.marcadasParaRevisao.filter((n) => n !== numero)
          : [...prev.marcadasParaRevisao, numero],
      };
    });
  }, [state]);

  const finalizarSimulado = useCallback(() => {
    if (!state) return;

    const tempoTotal = Math.floor((Date.now() - state.tempoInicio) / 1000);
    const estatisticas = calcularEstatisticas(state.questoes, tempoTotal);

    // XP bônus
    adicionarXP(estatisticas.acertos * CONFIG.XP_POR_ACERTO);

    const historico: HistoricoSimulado = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      modo:
        modo === "turbo"
          ? "TURBO"
          : modo === "adaptativo"
            ? "ADAPTATIVO"
            : "COMPLETO",
      estatisticas,
      questoes: state.questoes,
    };

    // Salva histórico
    const historicoExistente = JSON.parse(
      localStorage.getItem("prf_historico") || "[]",
    );
    localStorage.setItem(
      "prf_historico",
      JSON.stringify([historico, ...historicoExistente]),
    );
    localStorage.setItem("prf_ultimo_simulado", JSON.stringify(historico));

    // Limpa progresso parcial
    localStorage.removeItem(`${CONFIG.CHAVE_PROGRESSO}_${modo}`);

    // Registra atividade
    registrarAtividade("simulado", {
      pontuacao: estatisticas.pontuacao,
      modo: historico.modo,
      tempo: tempoTotal,
    });

    router.push("/resultado");
  }, [state, modo, adicionarXP, registrarAtividade, router]);

  const handleSair = useCallback(() => {
    if (!state) return;

    const respondidas = state.questoes.filter(
      (q) => q.respostaUsuario !== undefined,
    ).length;

    if (respondidas > 0) {
      // Salva antes de sair
      localStorage.setItem(
        `${CONFIG.CHAVE_PROGRESSO}_${modo}`,
        JSON.stringify(state),
      );
    }

    router.push("/");
  }, [state, modo, router]);

  // Render
  if (loading) {
    return <LoadingScreen modo={modo} analise={analiseIA || undefined} />;
  }

  if (!state || state.questoes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  const questao = state.questoes[state.questaoAtual];
  const respondidas = state.questoes.filter(
    (q) => q.respostaUsuario !== undefined,
  ).length;
  const tempoMaximo = modo === "turbo" ? 40 * 60 : TEMPO_PROVA_MINUTOS * 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-32">
      {/* Confirmação de saída */}
      {showExitConfirm && (
        <ConfirmExitModal
          respondidas={respondidas}
          total={state.questoes.length}
          onConfirm={handleSair}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitConfirm(true)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                aria-label="Sair do simulado"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </button>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold
                  ${modo === "adaptativo" ? "bg-purple-500/20 text-purple-400" : ""}
                  ${modo === "turbo" ? "bg-amber-500/20 text-amber-400" : ""}
                  ${modo === "completo" ? "bg-blue-500/20 text-blue-400" : ""}
                `}
              >
                {modo === "adaptativo" && "🧠 ADAPTATIVO"}
                {modo === "turbo" && "⚡ TURBO"}
                {modo === "completo" && "📋 COMPLETO"}
              </span>

              <span className="text-sm text-slate-400 hidden sm:inline">
                Questão {state.questaoAtual + 1} / {state.questoes.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMarcarRevisao}
                className={`p-2 rounded-lg transition-colors ${
                  state.marcadasParaRevisao.includes(state.questaoAtual + 1)
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-slate-800 text-slate-400 hover:text-amber-400"
                }`}
                title="Marcar para revisão depois"
              >
                <Flag
                  className={`w-5 h-5 ${
                    state.marcadasParaRevisao.includes(state.questaoAtual + 1)
                      ? "fill-current"
                      : ""
                  }`}
                />
              </button>

              {modo === "adaptativo" && (
                <span className="text-xs text-purple-400 hidden sm:inline">
                  Personalizado
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                modo === "adaptativo" ? "bg-purple-500" : "bg-blue-500"
              }`}
              initial={{ width: 0 }}
              animate={{
                width: `${(respondidas / state.questoes.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </header>

      {/* Cronômetro */}
      <Suspense fallback={null}>
        <Cronometro
          tempoInicial={tempoMaximo}
          onTempoEsgotado={finalizarSimulado}
          posicao="fixed"
          tamanho="md"
        />
      </Suspense>

      {/* Conteúdo */}
      <main className="max-w-3xl mx-auto p-4 sm:p-6 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.questaoAtual}
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x: 0,
              ...(shakeQuestao === state.questaoAtual && {
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.4 },
              }),
            }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="will-change-transform"
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
                mostrarCorrecao={false}
                marcadasParaRevisao={state.marcadasParaRevisao}
                onMarcarRevisao={handleMarcarRevisao}
              />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navegação inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 p-4 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => handleNavegar("anterior")}
            disabled={state.questaoAtual === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <NavigationDots
            total={state.questoes.length}
            atual={state.questaoAtual}
            questoes={state.questoes}
            onNavigate={handleNavegar}
          />

          {state.questaoAtual < state.questoes.length - 1 ? (
            <button
              onClick={() => handleNavegar("proxima")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
            >
              <span className="hidden sm:inline">Próxima</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (confirm("Deseja finalizar o simulado?")) {
                  finalizarSimulado();
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors shadow-lg shadow-emerald-500/25"
            >
              <CheckCircle className="w-5 h-5" />
              Finalizar
            </button>
          )}
        </div>

        {/* Indicador mobile de questões */}
        <div className="md:hidden mt-3 text-center text-xs text-slate-500">
          {respondidas} de {state.questoes.length} respondidas
          {respondidas > 0 &&
            ` • ${Math.round((respondidas / state.questoes.length) * 100)}%`}
        </div>
      </div>

      {/* Auto-save indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-24 right-4 z-20"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-400">
          <Save className="w-3 h-3" />
          Auto-salvando...
        </div>
      </motion.div>
    </div>
  );
}
