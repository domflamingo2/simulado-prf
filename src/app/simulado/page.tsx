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
  X,
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
const QuestaoCard = lazy(() => import("@/components/QuestaoCard"));
const GlassCard = lazy(() =>
  import("@/components/ui/GlassCard").then((module) => ({
    default: module.GlassCard,
  })),
);

// Imports síncronos
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
// CONSTANTES
// ═══════════════════════════════════════════════════════════

type ModoSimulado = "completo" | "turbo" | "adaptativo";

const CONFIG = {
  XP_POR_QUESTAO: 1,
  XP_POR_ACERTO: 10,
  TEMPO_ANALISE_IA: 2000,
  AUTO_SALVAR_INTERVALO: 30000,
  CHAVE_PROGRESSO: "prf_simulado_progresso",
  EXPIRACAO_PROGRESSO: 24 * 60 * 60 * 1000, // 24 horas
} as const;

const MODOS_CONFIG = {
  completo: {
    nome: "COMPLETO",
    cor: "blue",
    bgCor: "bg-blue-500/20",
    textCor: "text-blue-400",
    barCor: "bg-blue-500",
  },
  turbo: {
    nome: "TURBO",
    cor: "amber",
    bgCor: "bg-amber-500/20",
    textCor: "text-amber-400",
    barCor: "bg-amber-500",
  },
  adaptativo: {
    nome: "ADAPTATIVO",
    cor: "purple",
    bgCor: "bg-purple-500/20",
    textCor: "text-purple-400",
    barCor: "bg-purple-500",
  },
} as const;

interface SimuladoState {
  questoes: QuestaoRespondida[];
  questaoAtual: number;
  tempoInicio: number;
  modo: ModoSimulado;
  marcadasParaRevisao: number[];
  ultimoAutoSave: number;
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
  const config = MODOS_CONFIG[modo];

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
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
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

function SuccessNotification({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-24 right-4 z-50 bg-emerald-500/90 backdrop-blur-md rounded-lg px-4 py-2 shadow-lg"
    >
      <div className="flex items-center gap-2 text-white">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Simulado finalizado com sucesso!</span>
      </div>
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const { adicionarXP, registrarAtividade } = useGamificacao();
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const config = MODOS_CONFIG[modo];
  const tempoMaximo = modo === "turbo" ? 40 * 60 : TEMPO_PROVA_MINUTOS * 60;

  // ============================================================================
  // FUNÇÕES DE UTILITÁRIO
  // ============================================================================

  const salvarProgresso = useCallback(
    (estado: SimuladoState | null) => {
      if (!estado || isSavingRef.current) return;

      isSavingRef.current = true;
      try {
        const chave = `${CONFIG.CHAVE_PROGRESSO}_${modo}`;
        const progressoParaSalvar = {
          ...estado,
          ultimoAutoSave: Date.now(),
        };
        localStorage.setItem(chave, JSON.stringify(progressoParaSalvar));
      } catch (error) {
        console.error("Erro ao salvar progresso:", error);
      } finally {
        isSavingRef.current = false;
      }
    },
    [modo],
  );

  const limparProgresso = useCallback(() => {
    const chave = `${CONFIG.CHAVE_PROGRESSO}_${modo}`;
    localStorage.removeItem(chave);
  }, [modo]);

  // ============================================================================
  // INICIALIZAÇÃO
  // ============================================================================

  useEffect(() => {
    const inicializar = async () => {
      const chave = `${CONFIG.CHAVE_PROGRESSO}_${modo}`;
      const salvo = localStorage.getItem(chave);

      if (salvo) {
        try {
          const parsed: SimuladoState = JSON.parse(salvo);
          const expirado =
            Date.now() - parsed.tempoInicio > CONFIG.EXPIRACAO_PROGRESSO;

          if (!expirado && parsed.modo === modo) {
            const continuar = window.confirm(
              "Você tem um simulado em andamento. Deseja continuar de onde parou?",
            );
            if (continuar) {
              setState(parsed);
              setLoading(false);
              return;
            }
          }
          limparProgresso();
        } catch {
          limparProgresso();
        }
      }

      // Iniciar novo simulado
      try {
        let selecionadas: Questao[] = [];
        let metadados: SelecaoAdaptativaResult["metadados"] | null = null;

        if (modo === "adaptativo") {
          const historicoRaw = localStorage.getItem("prf_historico");
          const historico = historicoRaw ? JSON.parse(historicoRaw) : [];
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
          ultimoAutoSave: Date.now(),
        };

        setState(novoState);

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
  }, [modo, router, limparProgresso]);

  // ============================================================================
  // AUTO-SALVAMENTO
  // ============================================================================

  useEffect(() => {
    if (!state) return;

    autoSaveRef.current = setInterval(() => {
      salvarProgresso(state);
    }, CONFIG.AUTO_SALVAR_INTERVALO);

    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [state, salvarProgresso]);

  // Salvar ao sair da página
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        state &&
        state.questoes.some((q) => q.respostaUsuario !== undefined)
      ) {
        salvarProgresso(state);
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state, salvarProgresso]);

  // Salvar ao esconder a aba
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && state) {
        salvarProgresso(state);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [state, salvarProgresso]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleResposta = useCallback(
    (resposta: "CERTO" | "ERRADO" | null) => {
      if (!state) return;

      const novasQuestoes = [...state.questoes];
      const questaoAtual = novasQuestoes[state.questaoAtual];

      questaoAtual.respostaUsuario = resposta;

      setState((prev) => (prev ? { ...prev, questoes: novasQuestoes } : null));

      adicionarXP(CONFIG.XP_POR_QUESTAO);

      if (resposta !== questaoAtual.resposta) {
        setShakeQuestao(state.questaoAtual);
        setTimeout(() => setShakeQuestao(null), 500);
      }

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
    (destino: "anterior" | "proxima" | number) => {
      if (!state) return;

      let novoIndex: number;
      if (typeof destino === "number") {
        novoIndex = Math.min(Math.max(0, destino), state.questoes.length - 1);
      } else {
        novoIndex =
          destino === "anterior"
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
    setState((prev) => {
      if (!prev) return null;
      const jaMarcada = prev.marcadasParaRevisao.includes(numero);
      return {
        ...prev,
        marcadasParaRevisao: jaMarcada
          ? prev.marcadasParaRevisao.filter((n) => n !== numero)
          : [...prev.marcadasParaRevisao, numero],
      };
    });
  }, [state]);

  const finalizarSimulado = useCallback(async () => {
    if (!state || isFinalizing) return;

    setIsFinalizing(true);

    try {
      const tempoTotal = Math.floor((Date.now() - state.tempoInicio) / 1000);
      const estatisticas = calcularEstatisticas(state.questoes, tempoTotal);

      adicionarXP(estatisticas.acertos * CONFIG.XP_POR_ACERTO);

      const modoEnum =
        modo === "turbo"
          ? "TURBO"
          : modo === "adaptativo"
            ? "ADAPTATIVO"
            : "COMPLETO";

      const historico: HistoricoSimulado = {
        id: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        data: new Date().toISOString(),
        modo: modoEnum,
        estatisticas: {
          pontuacao: estatisticas.pontuacao,
          acertos: estatisticas.acertos,
          erros: estatisticas.erros,
          brancos: estatisticas.brancos,
          percentual: estatisticas.percentual,
          tempoTotal: estatisticas.tempoTotal,
          totalQuestoes: estatisticas.totalQuestoes,
          tempoMedioPorQuestao: estatisticas.tempoMedioPorQuestao,
          desempenhoPorDisciplina: estatisticas.desempenhoPorDisciplina,
          taxaResposta: estatisticas.taxaResposta,
        },
        questoes: state.questoes.map((q) => ({
          ...q,
          disciplina: q.disciplina || "Geral",
        })),
        xpGanho: estatisticas.acertos * CONFIG.XP_POR_ACERTO,
      };

      const historicoExistenteRaw = localStorage.getItem("prf_historico");
      const historicoExistente = historicoExistenteRaw
        ? JSON.parse(historicoExistenteRaw)
        : [];

      const novoHistorico = [historico, ...historicoExistente];
      localStorage.setItem("prf_historico", JSON.stringify(novoHistorico));

      // Disparar evento de storage
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "prf_historico",
          newValue: JSON.stringify(novoHistorico),
        }),
      );

      // Registrar atividade
      registrarAtividade("simulado", {
        pontuacao: estatisticas.pontuacao,
        modo: modoEnum,
        tempo: tempoTotal,
      });

      // Limpar progresso
      limparProgresso();

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/resultado");
      }, 1500);
    } catch (error) {
      console.error("Erro ao finalizar simulado:", error);
      alert("Erro ao salvar resultados. Seu progresso foi salvo localmente.");
      router.push("/");
    } finally {
      setIsFinalizing(false);
    }
  }, [
    state,
    modo,
    adicionarXP,
    registrarAtividade,
    router,
    limparProgresso,
    isFinalizing,
  ]);

  const handleSair = useCallback(() => {
    if (state) {
      const respondidas = state.questoes.filter(
        (q) => q.respostaUsuario !== undefined,
      ).length;
      if (respondidas > 0) {
        salvarProgresso(state);
      }
      limparProgresso();
    }
    router.push("/");
  }, [state, router, salvarProgresso, limparProgresso]);

  // ============================================================================
  // RENDER
  // ============================================================================

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
  const percentualProgresso = (respondidas / state.questoes.length) * 100;
  const questoesRevisao = state.marcadasParaRevisao.length;

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
        {showSuccess && (
          <SuccessNotification onClose={() => setShowSuccess(false)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitConfirm(true)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                aria-label="Sair do simulado"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <div
                className={`px-3 py-1 rounded-full text-xs font-bold ${config.bgCor} ${config.textCor}`}
              >
                {config.nome}
                {modo === "adaptativo" && " 🧠"}
                {modo === "turbo" && " ⚡"}
              </div>

              <span className="text-sm text-slate-400 hidden sm:inline">
                Questão {state.questaoAtual + 1} / {state.questoes.length}
              </span>

              {questoesRevisao > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs">
                  {questoesRevisao} para revisão
                </span>
              )}
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

              <div className="text-xs text-slate-500 hidden lg:block">
                {Math.floor(tempoMaximo / 60)}min restantes
              </div>
            </div>
          </div>

          {/* Progress bars */}
          <div className="mt-3 space-y-1">
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${config.barCor}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentualProgresso}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{respondidas} respondidas</span>
              <span>{percentualProgresso.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-4">
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
                onClick={finalizarSimulado}
                disabled={isFinalizing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFinalizing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                {isFinalizing ? "Finalizando..." : "Finalizar"}
              </button>
            )}
          </div>

          {/* Indicador mobile */}
          <div className="md:hidden mt-3 text-center text-xs text-slate-500">
            {respondidas} de {state.questoes.length} respondidas
            {respondidas > 0 && ` • ${percentualProgresso.toFixed(0)}%`}
          </div>
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
          <span>Auto-salvando...</span>
        </div>
      </motion.div>
    </div>
  );
}
