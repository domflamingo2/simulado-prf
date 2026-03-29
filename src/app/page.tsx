// src/app/dashboard/page.tsx
"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight as ChevronRightIcon,
  Clock,
  Download,
  Flame,
  Keyboard,
  LucideIcon,
  Play,
  Search,
  Settings,
  Star,
  Target,
  Trophy,
  Upload,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ============================================================================
// IMPORTS DE COMPONENTES UI
// ============================================================================
import AlertaDesempenho from "@/components/ui/AlertaDesempenho";
import Badge, { NewBadgeNotification } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import ModoCard from "@/components/ui/ModoCard";
import ProgressRing from "@/components/ui/ProgressRing";
import StatCard from "@/components/ui/StatCard";

// ============================================================================
// IMPORTS DE COMPONENTES DO DASHBOARD
// ============================================================================
import EmptyStateDashboard from "@/components/dashboard/EmptyStateDashboard";
import SecaoGraficoEvolucao from "@/components/dashboard/SecaoGraficoEvolucao";

// ============================================================================
// IMPORTS DE DADOS E HOOKS
// ============================================================================
import { NIVEIS } from "@/data/gamificacao";
import { HistoricoSimulado } from "@/data/types";
import { useGamificacao } from "@/hooks/useGamificacao";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { classificarDesempenho } from "@/lib/simulado-logic";
import { mapHistoricoParaGrafico } from "@/utils/mapHistoricoParaGrafico";

// ============================================================================
// LAZY LOAD DE COMPONENTES PESADOS
// ============================================================================
const Confetti = lazy(() =>
  import("@/components/ui/Confetti").catch(() => ({ default: () => null })),
);

// ============================================================================
// TYPES
// ============================================================================

type ModoEstudoItem = {
  href: string;
  icon: LucideIcon;
  variant: "blue" | "amber" | "emerald" | "rose" | "purple" | "slate" | "cyan";
  title: string;
  description: string;
  xp: string;
  tag: string;
  shortcut?: string;
  badge?: string;
};

type PeriodoFiltro = "7" | "30" | "90" | "todos";

type BadgeType =
  | "primeiro"
  | "streak-7"
  | "velocista"
  | "cebraspe-master"
  | "polivalente"
  | "nivel-5";

// ============================================================================
// CONSTANTES E CONFIGURAÇÕES
// ============================================================================

const MODOS_ESTUDO: ModoEstudoItem[] = [
  {
    href: "/simulado?modo=completo",
    icon: Play,
    variant: "blue",
    title: "Simulado Completo",
    description: "60 questões • 4 horas • Ambiente real CEBRASPE",
    xp: "+50 XP",
    tag: "Prova oficial",
    shortcut: "Ctrl+N",
  },
  {
    href: "/simulado?modo=turbo",
    icon: Zap,
    variant: "amber",
    title: "Modo Turbo",
    description: "50 questões • 40 min • Revisão rápida",
    xp: "+30 XP",
    tag: "Desafio velocidade",
    shortcut: "Ctrl+T",
  },
  {
    href: "/treino",
    icon: BookOpen,
    variant: "emerald",
    title: "Treino Específico",
    description: "Foque na sua disciplina mais fraca",
    xp: "+20 XP",
    tag: "Explicação imediata",
  },
  {
    href: "/erros",
    icon: XCircle,
    variant: "rose",
    title: "Revisar Erros",
    description: "Banco de questões que você errou",
    xp: "+15 XP",
    tag: "Aprenda com falhas",
    shortcut: "Ctrl+E",
  },
  {
    href: "/simulado?modo=adaptativo",
    icon: Target,
    variant: "purple",
    title: "Adaptativo IA",
    description: "IA seleciona suas maiores dificuldades",
    xp: "+50 XP",
    tag: "Personalizado",
    badge: "IA",
  },
  {
    href: "/estatisticas",
    icon: BarChart3,
    variant: "cyan",
    title: "Estatísticas",
    description: "Análise profunda por disciplina",
    xp: "Visual",
    tag: "Gráficos completos",
  },
];

const BADGES_DISPLAY: readonly BadgeType[] = [
  "primeiro",
  "streak-7",
  "velocista",
  "cebraspe-master",
  "polivalente",
  "nivel-5",
] as const;

const DISCIPLINAS_NOME: Record<string, string> = {
  PORTUGUES: "Português",
  ETICA: "Ética",
  RACIOCINIO_LOGICO: "Raciocínio Lógico",
  DIREITO_CONSTITUCIONAL: "Direito Const.",
  DIREITO_ADMINISTRATIVO: "Dir. Administrativo",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Legislação PRF",
};

const BADGE_LABELS: Record<BadgeType, string> = {
  primeiro: "Primeiro Passo",
  "streak-7": "7 Dias Seguidos",
  velocista: "Velocista",
  "cebraspe-master": "Mestre CEBRASPE",
  polivalente: "Polivalente",
  "nivel-5": "Nível 5",
};

// ============================================================================
// HELPERS
// ============================================================================

const getBadgeLabel = (badgeId: string): string => {
  return BADGE_LABELS[badgeId as BadgeType] || badgeId;
};

const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 300,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay],
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function Dashboard() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  // Estados de UI
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNewBadge, setShowNewBadge] = useState<string | null>(null);
  const [periodoFiltro, setPeriodoFiltro] = useState<PeriodoFiltro>("todos");
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Hooks personalizados
  const { progress, novasConquistas, showLevelUp, dismissLevelUp } =
    useGamificacao();

  const { value: historicoStorage, setValue: setHistoricoStorage } =
    useLocalStorage<HistoricoSimulado[]>({
      key: "prf_historico",
      defaultValue: [],
    });

  // Refs para controle de sincronização
  const lastSyncRef = useRef<number>(0);
  const isUpdatingRef = useRef(false);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Confetti e Badges via URL params
  useEffect(() => {
    if (!mounted) return;

    const params = new URLSearchParams(window.location.search);
    const conquista = params.get("conquista");

    if (conquista) {
      setShowNewBadge(conquista);
      setShowConfetti(true);
      window.history.replaceState({}, "", window.location.pathname);

      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // Sincronização entre abas (LocalStorage)
  useEffect(() => {
    if (!mounted) return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== "prf_historico" || !e.newValue || isUpdatingRef.current)
        return;

      const now = Date.now();
      if (now - lastSyncRef.current < 1000) return; // Debounce de 1s

      lastSyncRef.current = now;

      try {
        const parsed = JSON.parse(e.newValue);
        if (
          Array.isArray(parsed) &&
          JSON.stringify(parsed) !== JSON.stringify(historicoStorage)
        ) {
          isUpdatingRef.current = true;
          setHistoricoStorage(parsed);
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 100);
        }
      } catch (err) {
        console.error("Erro ao sincronizar storage:", err);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [mounted, historicoStorage, setHistoricoStorage]);

  // Novas conquistas do hook de gamificação
  useEffect(() => {
    if (novasConquistas.length > 0 && !showNewBadge && mounted) {
      setShowConfetti(true);
      setShowNewBadge(novasConquistas[0]);

      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [novasConquistas, showNewBadge, mounted]);

  // ============================================================================
  // MEMOS - LÓGICA DE NEGÓCIOS
  // ============================================================================

  // Histórico filtrado por período
  const historicoFiltrado = useMemo(() => {
    if (!historicoStorage?.length) return [];
    if (periodoFiltro === "todos") return historicoStorage;

    const dias = parseInt(periodoFiltro);
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    return historicoStorage.filter((h) => {
      try {
        return new Date(h.data) >= dataLimite;
      } catch {
        return false;
      }
    });
  }, [historicoStorage, periodoFiltro]);

  // Estatísticas calculadas
  const estatisticas = useMemo(() => {
    if (!historicoFiltrado?.length) return null;

    const ultimos7 = historicoFiltrado.slice(0, 7);
    const total = historicoFiltrado.length;

    const calcularMedia = (arr: HistoricoSimulado[]) =>
      !arr.length
        ? 0
        : arr.reduce((acc, h) => acc + (h.estatisticas?.pontuacao ?? 0), 0) /
          arr.length;

    const mediaGeral = calcularMedia(historicoFiltrado);
    const media7Dias = calcularMedia(ultimos7);

    const tendencia =
      media7Dias > mediaGeral
        ? "up"
        : media7Dias < mediaGeral
          ? "down"
          : "stable";

    const pontuacoes = historicoFiltrado
      .map((h) => h.estatisticas?.pontuacao)
      .filter((p): p is number => typeof p === "number" && !isNaN(p));

    const melhor = pontuacoes.length ? Math.max(...pontuacoes) : 0;
    const pior = pontuacoes.length ? Math.min(...pontuacoes) : 0;

    // Cálculo da disciplina mais fraca
    const disciplinaStats = new Map<
      string,
      { acertos: number; total: number }
    >();

    historicoFiltrado.forEach((h) => {
      if (!Array.isArray(h.questoes)) return;
      h.questoes.forEach((q) => {
        if (!q?.disciplina) return;
        if (!disciplinaStats.has(q.disciplina)) {
          disciplinaStats.set(q.disciplina, { acertos: 0, total: 0 });
        }
        const stats = disciplinaStats.get(q.disciplina)!;
        stats.total++;
        if (q.respostaUsuario === q.resposta) stats.acertos++;
      });
    });

    const disciplinaMaisFraca = Array.from(disciplinaStats.entries()).sort(
      ([, a], [, b]) => a.acertos / a.total - b.acertos / b.total,
    )[0];

    const ultimoSimulado = historicoFiltrado[0];
    const ultimaPontuacao = ultimoSimulado?.estatisticas?.pontuacao ?? 0;
    const ultimoTotalQuestoes = ultimoSimulado?.questoes?.length ?? 60;
    const ultimoPercentual =
      ultimoTotalQuestoes > 0
        ? ((ultimaPontuacao + ultimoTotalQuestoes) /
            (2 * ultimoTotalQuestoes)) *
          100
        : 0;

    return {
      ultimo: ultimoSimulado,
      media: mediaGeral,
      media7Dias,
      tendencia,
      melhor,
      pior,
      total,
      classificacao: classificarDesempenho(ultimoPercentual, 60),
      disciplinaFraca: disciplinaMaisFraca
        ? {
            nome:
              DISCIPLINAS_NOME[disciplinaMaisFraca[0]] ||
              disciplinaMaisFraca[0],
            aproveitamento:
              (disciplinaMaisFraca[1].acertos / disciplinaMaisFraca[1].total) *
              100,
          }
        : null,
    };
  }, [historicoFiltrado]);

  // Nível e progresso de gamificação
  const nivelAtual = useMemo(
    () => NIVEIS.find((n) => n.nivel === progress?.nivel) || NIVEIS[0],
    [progress?.nivel],
  );

  const progressoNivel = useMemo(() => {
    const total =
      (progress?.xpAtual ?? 0) + (progress?.xpParaProximoNivel ?? 100);
    return total > 0 ? ((progress?.xpAtual ?? 0) / total) * 100 : 0;
  }, [progress?.xpAtual, progress?.xpParaProximoNivel]);

  // Filtro de busca dos modos de estudo
  const modosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return MODOS_ESTUDO;
    const term = searchTerm.toLowerCase().trim();
    return MODOS_ESTUDO.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term) ||
        m.tag.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleIniciarPrimeiroSimulado = useDebouncedCallback(() => {
    router.push("/simulado?modo=completo");
  }, 500);

  const exportarDados = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const dados = {
        historico: localStorage.getItem("prf_historico"),
        progresso: localStorage.getItem("prf_user_progress"),
        erros: localStorage.getItem("prf_erros"),
        config: localStorage.getItem("prf_config"),
        timestamp: new Date().toISOString(),
        versao: "2.0",
        app: "prf-simulado",
      };

      const blob = new Blob([JSON.stringify(dados, null, 2)], {
        type: "application/json",
      });

      // File System Access API (moderno) ou fallback
      if (
        "showSaveFilePicker" in window &&
        typeof window.showSaveFilePicker === "function"
      ) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: `prf-backup-${new Date().toISOString().split("T")[0]}.json`,
            types: [
              {
                description: "JSON",
                accept: { "application/json": [".json"] },
              },
            ],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
        } catch (err: any) {
          if (err.name !== "AbortError") throw err;
        }
      } else {
        // Fallback para navegadores antigos
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `prf-backup-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        requestAnimationFrame(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      }

      setShowExportModal(false);
    } catch (err) {
      console.error("Erro ao exportar:", err);
      alert("Erro ao exportar dados.");
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  const importarDados = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        if (!file.type.includes("json") && !file.name.endsWith(".json")) {
          throw new Error("O arquivo deve ser um JSON válido");
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("Arquivo muito grande (máx. 10MB)");
        }

        const text = await file.text();
        let dados: Record<string, unknown> = JSON.parse(text);

        if (!dados.versao || typeof dados.versao !== "string") {
          throw new Error("Arquivo inválido: versão não encontrada");
        }
        if (dados.app !== "prf-simulado") {
          throw new Error("Arquivo não pertence a este aplicativo");
        }

        if (confirm("Isso substituirá seus dados atuais. Deseja continuar?")) {
          const keysToImport = [
            "prf_historico",
            "prf_user_progress",
            "prf_erros",
            "prf_config",
          ];

          keysToImport.forEach((key) => {
            const value = dados[key.replace("prf_", "")] || dados[key];
            if (value && typeof value === "string") {
              localStorage.setItem(key, value);
            }
          });

          window.location.reload();
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : "Erro ao importar");
      }

      e.target.value = "";
    },
    [],
  );

  // ============================================================================
  // RENDERIZAÇÃO
  // ============================================================================

  // Skeleton loading
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-slate-800" />
          <div className="w-48 h-4 rounded bg-slate-800" />
        </div>
      </div>
    );
  }

  const hasData = historicoFiltrado.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white selection:bg-blue-500/30">
      {/* Confetti */}
      <Suspense fallback={null}>
        <Confetti trigger={showConfetti && !prefersReducedMotion} />
      </Suspense>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  PRF Simulado
                </h1>
                <p className="text-xs text-slate-400">Banca CEBRASPE</p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              {progress?.streakDias > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30"
                >
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                  <span className="text-xs sm:text-sm font-bold text-orange-300">
                    {progress.streakDias} dias
                  </span>
                </motion.div>
              )}

              <div
                className="px-2 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all hover:scale-105"
                style={{
                  backgroundColor: `${nivelAtual?.cor || "#3b82f6"}15`,
                  borderColor: `${nivelAtual?.cor || "#3b82f6"}40`,
                  color: nivelAtual?.cor || "#3b82f6",
                }}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {nivelAtual?.nome || "Iniciante"}
                </span>
                <span className="sm:hidden">Nv.{progress?.nivel || 1}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {!hasData ? (
          <EmptyStateDashboard onIniciar={handleIniciarPrimeiroSimulado} />
        ) : (
          <>
            {/* Filtros de Período */}
            <nav
              aria-label="Filtro de período"
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-slate-500 font-medium">
                Período:
              </span>
              {[
                { value: "7" as const, label: "7 dias" },
                { value: "30" as const, label: "30 dias" },
                { value: "90" as const, label: "3 meses" },
                { value: "todos" as const, label: "Todo histórico" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriodoFiltro(p.value)}
                  aria-pressed={periodoFiltro === p.value}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    periodoFiltro === p.value
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </nav>

            {/* Cards Principais */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Card de Nível */}
              <GlassCard className="p-5 sm:p-6" glow="purple">
                <div className="flex items-center gap-5">
                  <ProgressRing
                    progress={progressoNivel}
                    size={90}
                    strokeWidth={8}
                    color={nivelAtual?.cor || "#3b82f6"}
                  >
                    <div className="text-center">
                      <span className="text-3xl font-bold text-white">
                        {progress?.nivel || 1}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        NÍVEL
                      </span>
                    </div>
                  </ProgressRing>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white mb-1">
                      {nivelAtual?.nome || "Iniciante"}
                    </h2>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: nivelAtual?.cor || "#3b82f6",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressoNivel}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">
                      {(progress?.xpParaProximoNivel || 0).toLocaleString()} XP
                      para próximo nível
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Stats Cards */}
              {estatisticas ? (
                <div className="xl:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatCard
                    icon={CheckCircle2}
                    label="Média Geral"
                    value={estatisticas.media.toFixed(1)}
                    subvalue="pontos"
                    variant="emerald"
                    trend={
                      estatisticas.tendencia !== "stable"
                        ? {
                            value: Math.abs(
                              ((estatisticas.media7Dias - estatisticas.media) /
                                (estatisticas.media || 1)) *
                                100,
                            ),
                            positive: estatisticas.tendencia === "up",
                          }
                        : undefined
                    }
                  />
                  <StatCard
                    icon={Trophy}
                    label="Melhor Pontuação"
                    value={estatisticas.melhor}
                    subvalue={`de ${estatisticas.pior} (pior)`}
                    variant="purple"
                    glow
                  />
                  <StatCard
                    icon={Clock}
                    label="Simulados"
                    value={estatisticas.total}
                    subvalue={
                      periodoFiltro === "todos"
                        ? "no total"
                        : `em ${periodoFiltro} dias`
                    }
                    variant="amber"
                  />
                  <StatCard
                    icon={Clock}
                    label="Último Simulado"
                    value={new Date(
                      estatisticas.ultimo?.data || Date.now(),
                    ).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                    subvalue={`${estatisticas.ultimo?.estatisticas?.pontuacao || 0} pts`}
                    variant="cyan"
                  />
                </div>
              ) : (
                <div className="xl:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-slate-800/50 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Alertas de Desempenho */}
            <div
              className="space-y-3"
              role="region"
              aria-label="Alertas de desempenho"
            >
              {estatisticas?.classificacao?.nivel === "critico" && (
                <AlertaDesempenho
                  tipo="critico"
                  mensagem="Seu último simulado foi significativamente abaixo da média."
                  acao={{ label: "Revisar Erros", href: "/erros" }}
                />
              )}
              {estatisticas?.disciplinaFraca &&
                estatisticas.disciplinaFraca.aproveitamento < 50 && (
                  <AlertaDesempenho
                    tipo="alerta"
                    mensagem={`${estatisticas.disciplinaFraca.nome} está com aproveitamento baixo.`}
                    acao={{ label: "Treinar", href: "/treino" }}
                  />
                )}
              {(progress?.streakDias || 0) >= 3 && (
                <AlertaDesempenho
                  tipo="info"
                  mensagem={`Sequência de ${progress.streakDias} dias! Mantenha o ritmo.`}
                />
              )}
            </div>

            {/* Conquistas */}
            <GlassCard className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      Conquistas
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {progress?.badges?.length || 0} de {BADGES_DISPLAY.length}{" "}
                      desbloqueadas
                    </p>
                  </div>
                </div>
                <Link
                  href="/conquistas"
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 transition-all"
                >
                  Ver todas
                  <ChevronRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="relative">
                <div className="flex gap-3 overflow-x-auto pb-3 pt-1 px-1 -mx-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent sm:grid sm:grid-cols-6 sm:overflow-visible sm:pb-0 sm:pt-0 sm:px-0 sm:mx-0">
                  {BADGES_DISPLAY.map((badge, index) => {
                    const isUnlocked =
                      progress?.badges?.some((b) => b.id === badge) || false;
                    return (
                      <motion.div
                        key={badge}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.3 }}
                        whileHover={
                          isUnlocked ? { scale: 1.08, y: -3 } : { scale: 1.02 }
                        }
                        className={`flex-shrink-0 relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                          isUnlocked
                            ? "bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/30 shadow-lg shadow-black/20"
                            : "bg-slate-900/30 border border-slate-800/50 opacity-60 grayscale"
                        }`}
                      >
                        <div className="relative">
                          <Badge type={badge} unlocked={isUnlocked} size="md" />
                          {isUnlocked && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                              <CheckCircle2 className="w-2 h-2 text-slate-900" />
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-medium text-center leading-tight max-w-[70px] ${isUnlocked ? "text-slate-300" : "text-slate-600"}`}
                        >
                          {getBadgeLabel(badge)}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-800/50">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Progresso geral</span>
                  <span className="font-bold text-amber-400">
                    {Math.round(
                      ((progress?.badges?.length || 0) /
                        BADGES_DISPLAY.length) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 rounded-full shadow-lg shadow-amber-500/20"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((progress?.badges?.length || 0) / BADGES_DISPLAY.length) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>
            </GlassCard>

            {/* Gráfico de Evolução */}
            {historicoFiltrado.length > 1 && (
              <SecaoGraficoEvolucao
                historico={mapHistoricoParaGrafico(historicoFiltrado)}
              />
            )}

            {/* Busca de Modos */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="search-modos"
                type="text"
                placeholder="Buscar modos de estudo... (Ctrl+S)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Modos de Estudo */}
            <section aria-label="Modos de estudo">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-200">
                <Star className="w-5 h-5 text-amber-400" /> Escolha seu Modo
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-500 ml-auto font-mono">
                  <Keyboard className="w-3 h-3" /> Atalhos: Ctrl+N, Ctrl+T,
                  Ctrl+E
                </span>
              </h2>

              {modosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">Nenhum modo encontrado</p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-blue-400 text-xs mt-2 hover:underline"
                  >
                    Limpar busca
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modosFiltrados.map((modo, index) => (
                    <ModoCard key={modo.href} {...modo} index={index} />
                  ))}
                </div>
              )}
            </section>

            {/* Cards Inferiores: Regras e Backup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Regra CEBRASPE */}
              <GlassCard className="p-5" variant="info">
                <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-slate-200">
                  <Clock className="w-5 h-5 text-blue-400" /> Regra de Pontuação
                  CEBRASPE
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      label: "Acerto",
                      value: "+1",
                      color: "emerald",
                      desc: "Ganha 1 ponto",
                    },
                    {
                      label: "Erro",
                      value: "-1",
                      color: "rose",
                      desc: "Perde 1 ponto",
                    },
                    {
                      label: "Em branco",
                      value: "0",
                      color: "slate",
                      desc: "Não altera",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between p-3 rounded-lg bg-${item.color}-500/10 border border-${item.color}-500/20`}
                    >
                      <div>
                        <span
                          className={`text-${item.color}-400 text-sm font-medium block`}
                        >
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.desc}
                        </span>
                      </div>
                      <span
                        className={`font-bold text-lg text-${item.color}-400`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Backup */}
              <GlassCard className="p-5">
                <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-slate-200">
                  <Settings className="w-5 h-5 text-purple-400" /> Backup e
                  Sincronização
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowExportModal(true)}
                    disabled={isExporting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all text-sm font-medium disabled:opacity-50"
                  >
                    {isExporting ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isExporting ? "Exportando..." : "Exportar Dados"}
                  </button>
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all text-sm font-medium">
                    <Upload className="w-4 h-4" /> Importar
                    <input
                      type="file"
                      accept=".json"
                      onChange={importarDados}
                      className="hidden"
                    />
                  </label>
                </div>
              </GlassCard>
            </div>
          </>
        )}
      </main>

      {/* Modal de Exportação */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => !isExporting && setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-2">
                Exportar Dados
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Seus dados serão salvos em um arquivo JSON.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-3 mb-4 text-xs text-slate-500 font-mono">
                {historicoFiltrado?.length || 0} simulados •{" "}
                {progress?.badges?.length || 0} conquistas
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportarDados}
                  disabled={isExporting}
                  className="flex-1 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-medium transition-colors"
                >
                  {isExporting ? "Exportando..." : "Confirmar"}
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  disabled={isExporting}
                  className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notificação de Nova Conquista */}
      <AnimatePresence>
        {showNewBadge && (
          <NewBadgeNotification
            badgeType={showNewBadge as any}
            onClose={() => setShowNewBadge(null)}
          />
        )}
      </AnimatePresence>

      {/* Modal de Level Up */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={dismissLevelUp}
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-center max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }
                }
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-7xl mb-6"
              >
                🎉
              </motion.div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                LEVEL UP!
              </h2>
              <p className="text-lg text-slate-300 mb-4">Você alcançou</p>
              <div
                className="inline-block px-8 py-4 rounded-2xl bg-slate-800/80 border-2 mb-6"
                style={{ borderColor: nivelAtual?.cor || "#3b82f6" }}
              >
                <span className="text-3xl font-bold text-white block">
                  {nivelAtual?.nome || "Novo Nível"}
                </span>
                <span className="text-sm text-slate-400">
                  Nível {progress?.nivel || 1}
                </span>
              </div>
              <button
                onClick={dismissLevelUp}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold transition-all shadow-lg shadow-blue-500/25"
              >
                Continuar Jornada
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
