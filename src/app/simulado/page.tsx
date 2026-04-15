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

// Lazy load componentes pesados (apenas os usados no render principal)
const QuestaoCard = lazy(() => import("@/components/QuestaoCard"));

// GlassCard importado sincronamente — é usado no LoadingScreen que aparece
// antes de qualquer Suspense envolver a página.
// FIX: era lazy-loaded mas o LoadingScreen não estava dentro de um Suspense.
import { GlassCard } from "@/components/ui/GlassCard";

import { questoes, TEMPO_PROVA_MINUTOS } from "@/data";
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
  EXPIRACAO_PROGRESSO: 24 * 60 * 60 * 1000,
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

// ─── Helper: lê localStorage suportando formato legado e novo ─────────────────
function lerHistoricoStorage(): HistoricoSimulado[] {
  try {
    const raw = localStorage.getItem("prf_historico");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      "data" in parsed
    ) {
      return Array.isArray(parsed.data) ? parsed.data : [];
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ─── Helper: salva histórico no formato legado (array direto) ────────────────
// Mantém compatibilidade com o useLocalStorage que suporta ambos os formatos.
function salvarHistoricoStorage(historico: HistoricoSimulado[]): void {
  localStorage.setItem("prf_historico", JSON.stringify(historico));
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
  questoes: qs,
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
  const visibleDots = qs.slice(start, start + showDots);

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
            className={[
              "w-2.5 h-2.5 rounded-full transition-all duration-200",
              isActive ? "w-6 bg-blue-400" : "",
              isCorreta && !isActive ? "bg-emerald-500" : "",
              isErrada && !isActive ? "bg-rose-500" : "",
              !isRespondida && !isActive
                ? "bg-slate-600 hover:bg-slate-500"
                : "",
            ].join(" ")}
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

// FIX: SuccessNotification sem onClose — o router navega antes dos 3s,
// causando memory leak. O componente agora é puramente visual; a navegação
// é controlada pelo pai após um delay menor que o timeout interno.
function SuccessNotification() {
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

  const [state, setState] = useState<SimuladoState | null>(null);
  const [loading, setLoading] = useState(true);
  const [analiseIA, setAnaliseIA] = useState<ReturnType<
    typeof gerarAnaliseAdaptativa
  > | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [shakeQuestao, setShakeQuestao] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // FIX: registrarAtividade inclui adicionarXP internamente — não usar adicionarXP separado
  const { registrarAtividade } = useGamificacao();

  // Ref para o intervalo de auto-save — não precisa ser refeito quando state muda
  const autoSaveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  // Ref para o state atual — usado no auto-save e nos event handlers sem re-criar closures
  const stateRef = useRef<SimuladoState | null>(null);
  const isSavingRef = useRef(false);
  const isMountedRef = useRef(true);

  const config = MODOS_CONFIG[modo];
  const tempoMaximo = modo === "turbo" ? 40 * 60 : TEMPO_PROVA_MINUTOS * 60;

  // Mantém stateRef sincronizado com state
  useEffect(() => {
    stateRef.current = state;
  });

  // Cleanup no unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ── Utilitários de progresso ──────────────────────────────────────────────

  const chaveProgresso = `${CONFIG.CHAVE_PROGRESSO}_${modo}`;

  const salvarProgresso = useCallback(
    (estado: SimuladoState | null) => {
      if (!estado || isSavingRef.current) return;
      isSavingRef.current = true;
      try {
        localStorage.setItem(
          chaveProgresso,
          JSON.stringify({ ...estado, ultimoAutoSave: Date.now() }),
        );
      } catch (err) {
        console.error("Erro ao salvar progresso:", err);
      } finally {
        isSavingRef.current = false;
      }
    },
    [chaveProgresso],
  );

  const limparProgresso = useCallback(() => {
    localStorage.removeItem(chaveProgresso);
  }, [chaveProgresso]);

  // ── Auto-save ─────────────────────────────────────────────────────────────
  // FIX: intervalo criado uma única vez após o state ser inicializado.
  // Antes era recriado a cada mudança de state — o intervalo nunca chegava a
  // 30s porque era resetado a cada clique de resposta.

  useEffect(() => {
    if (!state) return;

    // Limpa intervalo anterior se existir
    if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current);

    autoSaveIntervalRef.current = setInterval(() => {
      salvarProgresso(stateRef.current);
    }, CONFIG.AUTO_SALVAR_INTERVALO);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!state, salvarProgresso]); // Recria apenas quando state passa de null → não-null

  // Salvar ao sair/esconder aba
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      const s = stateRef.current;
      if (s?.questoes.some((q) => q.respostaUsuario !== undefined)) {
        salvarProgresso(s);
        e.preventDefault();
        e.returnValue = "";
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) salvarProgresso(stateRef.current);
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [salvarProgresso]);

  // ── Inicialização ─────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const inicializar = async () => {
      // Tenta retomar progresso salvo
      const salvo = localStorage.getItem(chaveProgresso);
      if (salvo) {
        try {
          const parsed: SimuladoState = JSON.parse(salvo);
          const expirado =
            Date.now() - parsed.tempoInicio > CONFIG.EXPIRACAO_PROGRESSO;

          if (!expirado && parsed.modo === modo) {
            const continuar = window.confirm(
              "Você tem um simulado em andamento. Deseja continuar de onde parou?",
            );
            if (continuar && !cancelled) {
              setState(parsed);
              setLoading(false);
              return;
            }
          }
        } catch {
          // dado corrompido
        }
        limparProgresso();
      }

      // Inicia novo simulado
      try {
        let selecionadas: Questao[] = [];
        let metadados: SelecaoAdaptativaResult["metadados"] | null = null;

        if (modo === "adaptativo") {
          // FIX: usa lerHistoricoStorage que suporta ambos os formatos
          const historico = lerHistoricoStorage();
          const analise = gerarAnaliseAdaptativa(historico, questoes);

          if (!cancelled) setAnaliseIA(analise);

          await new Promise<void>((r) =>
            setTimeout(r, CONFIG.TEMPO_ANALISE_IA),
          );
          if (cancelled) return;

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

        if (cancelled) return;

        const questoesIniciais: QuestaoRespondida[] = selecionadas.map((q) => ({
          ...q,
          disciplina: q.disciplina || "GERAL",
          respostaUsuario: undefined,
        }));

        const novoState: SimuladoState = {
          questoes: questoesIniciais,
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
      } catch (err) {
        if (cancelled) return;
        console.error("Erro ao inicializar simulado:", err);
        alert("Erro ao carregar questões. Tente novamente.");
        router.push("/");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    inicializar();
    return () => {
      cancelled = true;
    };
  }, [modo, router, limparProgresso, chaveProgresso]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  // FIX: handleResposta usa updater de setState para evitar closure stale.
  // FIX: cria novo objeto para a questão (imutável) em vez de mutar in-place.
  const handleResposta = useCallback((resposta: "CERTO" | "ERRADO" | null) => {
    setState((prev) => {
      if (!prev) return null;

      const idx = prev.questaoAtual;
      const questaoAtualObj = prev.questoes[idx];

      // Imutabilidade: cria novo array e novo objeto de questão
      const novasQuestoes = prev.questoes.map((q, i) =>
        i === idx ? { ...q, respostaUsuario: resposta } : q,
      );

      // Vibração visual em erro
      if (resposta && resposta !== questaoAtualObj.resposta) {
        setShakeQuestao(idx);
        setTimeout(() => setShakeQuestao(null), 500);
      }

      // Avança automaticamente para a próxima questão
      const proximoIdx = idx < prev.questoes.length - 1 ? idx + 1 : idx;

      return {
        ...prev,
        questoes: novasQuestoes,
        questaoAtual: proximoIdx,
      };
    });
  }, []);

  // FIX: handleNavegar agora recebe a assinatura correta do QuestaoCard
  // ("anterior" | "proxima" | "finalizar") além de number para NavigationDots.
  const handleNavegar = useCallback(
    (destino: "anterior" | "proxima" | "finalizar" | number) => {
      if (destino === "finalizar") {
        // Chama finalizarSimulado de forma lazy para evitar dependência circular
        // na closure — finalizarSimulado é definido abaixo e usa state via stateRef
        finalizarSimuladoRef.current?.();
        return;
      }

      setState((prev) => {
        if (!prev) return null;
        let novoIndex: number;
        if (typeof destino === "number") {
          novoIndex = Math.min(Math.max(0, destino), prev.questoes.length - 1);
        } else {
          novoIndex =
            destino === "anterior"
              ? Math.max(0, prev.questaoAtual - 1)
              : Math.min(prev.questoes.length - 1, prev.questaoAtual + 1);
        }
        return novoIndex !== prev.questaoAtual
          ? { ...prev, questaoAtual: novoIndex }
          : prev;
      });
    },
    [],
  );

  const handleMarcarRevisao = useCallback((numero?: number) => {
    setState((prev) => {
      if (!prev) return null;
      const n = numero ?? prev.questaoAtual + 1;
      const jaMarcada = prev.marcadasParaRevisao.includes(n);
      return {
        ...prev,
        marcadasParaRevisao: jaMarcada
          ? prev.marcadasParaRevisao.filter((x) => x !== n)
          : [...prev.marcadasParaRevisao, n],
      };
    });
  }, []);

  // Ref para que handleNavegar possa chamar finalizarSimulado sem dependência circular
  const finalizarSimuladoRef = useRef<(() => void) | null>(null);

  const finalizarSimulado = useCallback(async () => {
    const currentState = stateRef.current;
    if (!currentState || isFinalizing) return;

    setIsFinalizing(true);

    try {
      const tempoTotal = Math.floor(
        (Date.now() - currentState.tempoInicio) / 1000,
      );
      const estatisticas = calcularEstatisticas(
        currentState.questoes,
        tempoTotal,
      );

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
        questoes: currentState.questoes.map((q) => ({
          ...q,
          disciplina: q.disciplina || "GERAL",
        })),
        // FIX: xpGanho calculado por registrarAtividade — não duplicar aqui
        xpGanho: 0,
      };

      // FIX: usa lerHistoricoStorage que suporta ambos os formatos
      const historicoExistente = lerHistoricoStorage();
      const novoHistorico = [historico, ...historicoExistente];

      salvarHistoricoStorage(novoHistorico);

      // Dispara evento para sincronizar outras abas
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "prf_historico",
          newValue: JSON.stringify(novoHistorico),
        }),
      );

      // FIX: registrarAtividade já chama adicionarXP internamente.
      // Não chamar adicionarXP separado para evitar XP duplo.
      const { xpGanho } = registrarAtividade("simulado", {
        pontuacao: estatisticas.pontuacao,
        acertos: estatisticas.acertos,
        erros: estatisticas.erros,
        modo: modoEnum,
        tempo: tempoTotal,
      });

      // Atualiza xpGanho no histórico salvo
      historico.xpGanho = xpGanho;
      salvarHistoricoStorage([historico, ...historicoExistente]);

      limparProgresso();

      if (isMountedRef.current) setShowSuccess(true);

      // FIX: navega após 1s — componente ainda está montado neste ponto.
      // SuccessNotification não precisa de onClose pois será desmontada pelo router.
      setTimeout(() => {
        if (isMountedRef.current) router.push("/resultado");
      }, 1000);
    } catch (err) {
      console.error("Erro ao finalizar simulado:", err);
      alert("Erro ao salvar resultados. Tente novamente.");
      if (isMountedRef.current) setIsFinalizing(false);
    }
  }, [modo, registrarAtividade, limparProgresso, router, isFinalizing]);

  // Mantém a ref atualizada
  useEffect(() => {
    finalizarSimuladoRef.current = finalizarSimulado;
  });

  // FIX: handleSair não limpa o progresso — apenas salva e sai.
  // Limpar o progresso aqui anulava o salvamento imediatamente anterior.
  const handleSair = useCallback(() => {
    const s = stateRef.current;
    if (s) {
      const respondidas = s.questoes.filter(
        (q) => q.respostaUsuario !== undefined,
      ).length;
      if (respondidas > 0) {
        salvarProgresso(s);
      } else {
        limparProgresso(); // Sem respostas → não vale a pena salvar
      }
    }
    router.push("/");
  }, [router, salvarProgresso, limparProgresso]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return <LoadingScreen modo={modo} analise={analiseIA ?? undefined} />;
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
        {showSuccess && <SuccessNotification />}
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
                onClick={() => handleMarcarRevisao()}
                className={`p-2 rounded-lg transition-colors ${
                  state.marcadasParaRevisao.includes(state.questaoAtual + 1)
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-slate-800 text-slate-400 hover:text-amber-400"
                }`}
                title="Marcar para revisão (M)"
                aria-pressed={state.marcadasParaRevisao.includes(
                  state.questaoAtual + 1,
                )}
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
                {Math.floor(tempoMaximo / 60)}min máx.
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
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
                // FIX: onNavegar agora recebe assinatura compatível com QuestaoCard
                onNavegar={handleNavegar}
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
                {isFinalizing ? "Finalizando…" : "Finalizar"}
              </button>
            )}
          </div>

          <div className="md:hidden mt-3 text-center text-xs text-slate-500">
            {respondidas} de {state.questoes.length} respondidas
            {respondidas > 0 && ` • ${percentualProgresso.toFixed(0)}%`}
          </div>
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="fixed bottom-24 right-4 z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-400">
          <Save className="w-3 h-3" />
          <span>Auto-salvando a cada 30s</span>
        </div>
      </div>
    </div>
  );
}
