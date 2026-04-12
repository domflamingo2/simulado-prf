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

import Footer from "@/components/layout/Footer";
import AlertaDesempenho from "@/components/ui/AlertaDesempenho";
import Badge, { NewBadgeNotification } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import ModoCard from "@/components/ui/ModoCard";
import ProgressRing from "@/components/ui/ProgressRing";
import StatCard from "@/components/ui/StatCard";
import { NIVEIS } from "@/data/gamificacao";
import { HistoricoSimulado } from "@/data/types";
import { useGamificacao } from "@/hooks/useGamificacao";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { classificarDesempenho } from "@/lib/simulado-logic";

// ============================================================================
// LAZY LOAD
// ============================================================================
const Confetti = lazy(() =>
  import("@/components/ui/Confetti").catch(() => ({ default: () => null }))
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
// VALIDAÇÃO DE ITEM DO HISTÓRICO
// ============================================================================
function isHistoricoValido(h: unknown): h is HistoricoSimulado {
  if (!h || typeof h !== "object") return false;
  const item = h as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.modo === "string" &&
    typeof item.data === "string" &&
    item.estatisticas !== null &&
    typeof item.estatisticas === "object" &&
    typeof (item.estatisticas as Record<string, unknown>).pontuacao === "number" &&
    Array.isArray(item.questoes)
  );
}

// ============================================================================
// CONSTANTES
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

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
  },
  slate: {
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    text: "text-slate-400",
  },
};

// Chaves exatas do localStorage
const LS_KEYS = {
  historico: "prf_historico",
  progresso: "prf_user_progress",
  erros: "prf_erros",
  config: "prf_config",
} as const;

// ============================================================================
// HELPERS
// ============================================================================
const getBadgeLabel = (badgeId: string): string =>
  BADGE_LABELS[badgeId as BadgeType] || badgeId;

function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay = 300
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function Dashboard() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  // ── Estados de UI ──────────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNewBadge, setShowNewBadge] = useState<string | null>(null);
  const [periodoFiltro, setPeriodoFiltro] = useState<PeriodoFiltro>("todos");
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // ── Hooks ──────────────────────────────────────────────────────────────────
  const { progress, novasConquistas, showLevelUp, dismissLevelUp } =
    useGamificacao();

  const { value: historicoRaw, setValue: setHistoricoStorage } = useLocalStorage<
    HistoricoSimulado[]
  >({
    key: LS_KEYS.historico,
    defaultValue: [],
  });

  // ── Normalização do histórico: sempre array, sempre válido ─────────────────
  // FIX: historicoRaw pode ser null, undefined, ou conter itens inválidos vindos
  // de versões antigas do app. Normalizamos uma vez aqui e usamos em todo o componente.
  const historicoNormalizado = useMemo<HistoricoSimulado[]>(() => {
    if (!Array.isArray(historicoRaw)) return [];
    return historicoRaw.filter(isHistoricoValido);
  }, [historicoRaw]);

  // Ref para evitar loops de sincronização entre abas
  const syncLockRef = useRef(false);

  // ── EFFECTS ────────────────────────────────────────────────────────────────

  // Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // URL params → conquista desbloqueada
  useEffect(() => {
    if (!mounted) return;
    const params = new URLSearchParams(window.location.search);
    const conquista = params.get("conquista");
    if (!conquista) return;

    setShowNewBadge(conquista);
    setShowConfetti(true);
    window.history.replaceState({}, "", window.location.pathname);

    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, [mounted]);

  // Sincronização entre abas
  useEffect(() => {
    if (!mounted) return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== LS_KEYS.historico || !e.newValue || syncLockRef.current)
        return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (!Array.isArray(parsed)) return;
        // Evita re-render desnecessário se os dados são os mesmos
        const isSame =
          JSON.stringify(parsed) === JSON.stringify(historicoRaw);
        if (isSame) return;
        syncLockRef.current = true;
        setHistoricoStorage(parsed);
        // Libera o lock após o ciclo de render
        requestAnimationFrame(() => {
          syncLockRef.current = false;
        });
      } catch {
        // parse error: ignora silenciosamente
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [mounted, historicoRaw, setHistoricoStorage]);

  // Novas conquistas vindas do hook de gamificação
  useEffect(() => {
    if (novasConquistas.length === 0 || showNewBadge || !mounted) return;
    setShowConfetti(true);
    setShowNewBadge(novasConquistas[0]);
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, [novasConquistas, showNewBadge, mounted]);

  // Atalhos de teclado
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      switch (e.key.toLowerCase()) {
        case "n":
          e.preventDefault();
          router.push("/simulado?modo=completo");
          break;
        case "t":
          e.preventDefault();
          router.push("/simulado?modo=turbo");
          break;
        case "e":
          e.preventDefault();
          router.push("/erros");
          break;
        case "s":
          e.preventDefault();
          document.getElementById("search-modos")?.focus();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, router]);

  // ── MEMOS ──────────────────────────────────────────────────────────────────

  // FIX: hasValidData agora usa o histórico já normalizado
  const hasValidData = historicoNormalizado.length > 0;

  // Histórico filtrado por período (já normalizado)
  const historicoFiltrado = useMemo<HistoricoSimulado[]>(() => {
    if (!hasValidData) return [];
    if (periodoFiltro === "todos") return historicoNormalizado;

    const dias = parseInt(periodoFiltro, 10);
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    return historicoNormalizado.filter((h) => {
      try {
        return new Date(h.data) >= dataLimite;
      } catch {
        return false;
      }
    });
  }, [historicoNormalizado, periodoFiltro, hasValidData]);

  // Estatísticas calculadas
  // FIX: Cálculo de percentual corrigido. A pontuação CEBRASPE vai de -N a +N,
  // onde N = total de questões. Percentual = (pontuacao + total) / (2 * total) * 100
  const estatisticas = useMemo(() => {
    if (historicoFiltrado.length === 0) return null;

    const total = historicoFiltrado.length;
    const ultimos7 = historicoFiltrado.slice(0, Math.min(7, total));

    const mediaArray = (arr: HistoricoSimulado[]) =>
      arr.length === 0
        ? 0
        : arr.reduce((acc, h) => acc + h.estatisticas.pontuacao, 0) /
          arr.length;

    const mediaGeral = mediaArray(historicoFiltrado);
    const media7Dias = mediaArray(ultimos7);

    const tendencia: "up" | "down" | "stable" =
      media7Dias > mediaGeral + 0.5
        ? "up"
        : media7Dias < mediaGeral - 0.5
        ? "down"
        : "stable";

    const pontuacoes = historicoFiltrado.map((h) => h.estatisticas.pontuacao);
    const melhor = Math.max(...pontuacoes);
    const pior = Math.min(...pontuacoes);

    // Disciplina mais fraca
    const disciplinaStats = new Map<
      string,
      { acertos: number; total: number }
    >();
    for (const h of historicoFiltrado) {
      for (const q of h.questoes) {
        if (!q?.disciplina) continue;
        if (!disciplinaStats.has(q.disciplina)) {
          disciplinaStats.set(q.disciplina, { acertos: 0, total: 0 });
        }
        const s = disciplinaStats.get(q.disciplina)!;
        s.total++;
        if (q.respostaUsuario === q.resposta) s.acertos++;
      }
    }

    const disciplinaFracaEntry = Array.from(disciplinaStats.entries())
      .filter(([, s]) => s.total >= 3) // ignora disciplinas com poucos dados
      .sort(([, a], [, b]) => a.acertos / a.total - b.acertos / b.total)[0];

    const ultimoSimulado = historicoFiltrado[0];
    const ultimaPontuacao = ultimoSimulado.estatisticas.pontuacao;
    const ultimoTotalQuestoes = ultimoSimulado.questoes.length || 60;
    // FIX: fórmula correta para escala CEBRASPE
    const ultimoPercentual =
      ((ultimaPontuacao + ultimoTotalQuestoes) / (2 * ultimoTotalQuestoes)) *
      100;

    return {
      ultimo: ultimoSimulado,
      media: mediaGeral,
      media7Dias,
      tendencia,
      melhor,
      pior,
      total,
      classificacao: classificarDesempenho(
        Math.max(0, Math.min(100, ultimoPercentual)),
        ultimoTotalQuestoes
      ),
      disciplinaFraca: disciplinaFracaEntry
        ? {
            nome:
              DISCIPLINAS_NOME[disciplinaFracaEntry[0]] ||
              disciplinaFracaEntry[0],
            aproveitamento:
              (disciplinaFracaEntry[1].acertos /
                disciplinaFracaEntry[1].total) *
              100,
          }
        : null,
    };
  }, [historicoFiltrado]);

  // Nível atual
  const nivelAtual = useMemo(
    () =>
      NIVEIS.find((n) => n.nivel === (progress?.nivel ?? 1)) ?? NIVEIS[0],
    [progress?.nivel]
  );

  // Progresso do nível em % (0–100)
  // FIX: evita divisão por zero e NaN quando xpParaProximoNivel = 0
  const progressoNivel = useMemo(() => {
    const xpAtual = progress?.xpAtual ?? 0;
    const xpProximo = progress?.xpParaProximoNivel ?? 100;
    if (xpProximo <= 0) return 100;
    return Math.min(100, (xpAtual / (xpAtual + xpProximo)) * 100);
  }, [progress?.xpAtual, progress?.xpParaProximoNivel]);

  // Modos filtrados por busca
  const modosFiltrados = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return MODOS_ESTUDO;
    return MODOS_ESTUDO.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term) ||
        m.tag.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  // ── HANDLERS ───────────────────────────────────────────────────────────────

  const handleIniciarPrimeiroSimulado = useDebouncedCallback(() => {
    router.push("/simulado?modo=completo");
  }, 300);

  // FIX: exportar usando as chaves corretas do LS_KEYS
  const exportarDados = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportError(null);

    try {
      const dados = {
        [LS_KEYS.historico]: localStorage.getItem(LS_KEYS.historico),
        [LS_KEYS.progresso]: localStorage.getItem(LS_KEYS.progresso),
        [LS_KEYS.erros]: localStorage.getItem(LS_KEYS.erros),
        [LS_KEYS.config]: localStorage.getItem(LS_KEYS.config),
        timestamp: new Date().toISOString(),
        versao: "2.0",
        app: "prf-simulado",
      };

      const blob = new Blob([JSON.stringify(dados, null, 2)], {
        type: "application/json",
      });

      const dateStr = new Date().toISOString().split("T")[0];

      if (
        "showSaveFilePicker" in window &&
        typeof (window as Window & { showSaveFilePicker?: unknown })
          .showSaveFilePicker === "function"
      ) {
        try {
          const handle = await (
            window as Window & {
              showSaveFilePicker: (o: object) => Promise<FileSystemFileHandle>;
            }
          ).showSaveFilePicker({
            suggestedName: `prf-backup-${dateStr}.json`,
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
        } catch (err) {
          if ((err as { name?: string }).name !== "AbortError") throw err;
          // AbortError = usuário cancelou → não é erro
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement("a"), {
          href: url,
          download: `prf-backup-${dateStr}.json`,
        });
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
      setExportError("Não foi possível exportar. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  // FIX: importar com validação robusta e chaves corretas
  const importarDados = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        if (!file.name.endsWith(".json")) {
          throw new Error("O arquivo deve ser um JSON (.json).");
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("Arquivo muito grande (máx. 10 MB).");
        }

        const text = await file.text();
        let dados: Record<string, unknown>;
        try {
          dados = JSON.parse(text);
        } catch {
          throw new Error("Arquivo JSON inválido ou corrompido.");
        }

        if (typeof dados.versao !== "string") {
          throw new Error("Arquivo inválido: campo 'versao' não encontrado.");
        }
        if (dados.app !== "prf-simulado") {
          throw new Error("Este arquivo não pertence ao PRF Simulado.");
        }

        if (
          !window.confirm(
            "Isso substituirá todos os seus dados atuais. Deseja continuar?"
          )
        ) {
          return;
        }

        // FIX: usa as chaves exatas definidas em LS_KEYS
        for (const key of Object.values(LS_KEYS)) {
          const value = dados[key];
          if (typeof value === "string") {
            localStorage.setItem(key, value);
          }
        }

        window.location.reload();
      } catch (err) {
        alert(
          err instanceof Error ? err.message : "Erro desconhecido ao importar."
        );
      } finally {
        e.target.value = "";
      }
    },
    []
  );

  // ── RENDER GUARDS ──────────────────────────────────────────────────────────

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-slate-800" />
          <div className="w-48 h-4 rounded bg-slate-800" />
          <div className="w-32 h-3 rounded bg-slate-800" />
        </div>
      </div>
    );
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white selection:bg-blue-500/30">
      {/* Confetti */}
      <Suspense fallback={null}>
        <Confetti trigger={showConfetti && !prefersReducedMotion} />
      </Suspense>

      {/* ── Header ── */}
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
              {(progress?.streakDias ?? 0) > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30"
                >
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                  <span className="text-xs sm:text-sm font-bold text-orange-300">
                    {progress!.streakDias} dias
                  </span>
                </motion.div>
              )}

              <div
                className="px-2 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all hover:scale-105"
                style={{
                  backgroundColor: `${nivelAtual?.cor ?? "#3b82f6"}15`,
                  borderColor: `${nivelAtual?.cor ?? "#3b82f6"}40`,
                  color: nivelAtual?.cor ?? "#3b82f6",
                }}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {nivelAtual?.nome ?? "Iniciante"}
                </span>
                <span className="sm:hidden">Nv.{progress?.nivel ?? 1}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {!hasValidData ? (
          /* ── Tela de boas-vindas ── */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg"
            >
              <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                  <Target className="w-10 h-10 text-blue-400" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                Bem-vindo ao PRF Simulado
              </h1>
              <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                Você ainda não possui histórico de simulados. Comece sua jornada
                agora para acompanhar seu desempenho e ganhar conquistas.
              </p>

              {/* Modos de estudo também na tela de boas-vindas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
                {MODOS_ESTUDO.slice(0, 4).map((modo, i) => (
                  <ModoCard key={modo.href} {...modo} index={i} />
                ))}
              </div>

              <button
                onClick={handleIniciarPrimeiroSimulado}
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white transition-all duration-200 shadow-lg shadow-blue-600/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:from-blue-500 group-hover:to-purple-500" />
                <div className="relative flex items-center gap-2.5 z-10">
                  <Play className="w-5 h-5 fill-white" />
                  <span>Começar Agora</span>
                </div>
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            {/* ── Filtros de Período ── */}
            <nav
              aria-label="Filtro de período"
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-slate-500 font-medium">
                Período:
              </span>
              {(
                [
                  { value: "7" as const, label: "7 dias" },
                  { value: "30" as const, label: "30 dias" },
                  { value: "90" as const, label: "3 meses" },
                  { value: "todos" as const, label: "Todo histórico" },
                ] as const
              ).map((p) => (
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

              {/* FIX: aviso quando não há dados no período selecionado */}
              {periodoFiltro !== "todos" && historicoFiltrado.length === 0 && (
                <span className="text-xs text-amber-400/80 ml-2">
                  Nenhum simulado neste período
                </span>
              )}
            </nav>

            {/* ── Cards Principais ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Card de Nível */}
              <GlassCard className="p-5 sm:p-6" glow="purple">
                <div className="flex items-center gap-5">
                  <ProgressRing
                    progress={progressoNivel}
                    size={90}
                    strokeWidth={8}
                    color={nivelAtual?.cor ?? "#3b82f6"}
                  >
                    <div className="text-center">
                      <span className="text-3xl font-bold text-white">
                        {progress?.nivel ?? 1}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        NÍVEL
                      </span>
                    </div>
                  </ProgressRing>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white mb-1">
                      {nivelAtual?.nome ?? "Iniciante"}
                    </h2>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: nivelAtual?.cor ?? "#3b82f6" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressoNivel}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">
                      {(progress?.xpParaProximoNivel ?? 0).toLocaleString("pt-BR")} XP
                      para o próximo nível
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Stats */}
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
                              estatisticas.media > 0
                                ? ((estatisticas.media7Dias -
                                    estatisticas.media) /
                                    estatisticas.media) *
                                    100
                                : 0
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
                    subvalue={`pior: ${estatisticas.pior}`}
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
                    label="Último"
                    value={new Date(
                      estatisticas.ultimo.data
                    ).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                    subvalue={`${estatisticas.ultimo.estatisticas.pontuacao} pts`}
                    variant="cyan"
                  />
                </div>
              ) : (
                // FIX: skeleton só aparece quando o período não tem dados,
                // não quando o histórico inteiro está carregando
                <div className="xl:col-span-2 flex items-center justify-center">
                  <p className="text-sm text-slate-500">
                    Nenhum dado para o período selecionado.
                  </p>
                </div>
              )}
            </div>

            {/* ── Alertas ── */}
            <div className="space-y-3" role="region" aria-label="Alertas de desempenho">
              {estatisticas?.classificacao?.nivel === "critico" && (
                <AlertaDesempenho
                  tipo="critico"
                  mensagem="Seu último simulado ficou significativamente abaixo da média."
                  acao={{ label: "Revisar Erros", href: "/erros" }}
                />
              )}
              {estatisticas?.disciplinaFraca &&
                estatisticas.disciplinaFraca.aproveitamento < 50 && (
                  <AlertaDesempenho
                    tipo="alerta"
                    mensagem={`${estatisticas.disciplinaFraca.nome} está com aproveitamento baixo (${estatisticas.disciplinaFraca.aproveitamento.toFixed(0)}%).`}
                    acao={{ label: "Treinar agora", href: "/treino" }}
                  />
                )}
              {(progress?.streakDias ?? 0) >= 3 && (
                <AlertaDesempenho
                  tipo="info"
                  mensagem={`Sequência de ${progress!.streakDias} dias! Continue assim.`}
                />
              )}
            </div>

            {/* ── Conquistas ── */}
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
                      {progress?.badges?.length ?? 0} de {BADGES_DISPLAY.length}{" "}
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

              <div className="flex gap-3 overflow-x-auto pb-3 pt-1 px-1 -mx-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent sm:grid sm:grid-cols-6 sm:overflow-visible sm:pb-0 sm:pt-0 sm:px-0 sm:mx-0">
                {BADGES_DISPLAY.map((badge, index) => {
                  const isUnlocked =
                    progress?.badges?.some((b) => b.id === badge) ?? false;
                  return (
                    <motion.div
                      key={badge}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07, duration: 0.3 }}
                      whileHover={
                        isUnlocked
                          ? { scale: 1.08, y: -3 }
                          : { scale: 1.02 }
                      }
                      className={`flex-shrink-0 relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                        isUnlocked
                          ? "bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-amber-500/30 shadow-lg shadow-black/20"
                          : "bg-slate-900/30 border border-slate-800/50 opacity-60 grayscale"
                      }`}
                    >
                      <div className="relative">
                        <Badge
                          type={badge}
                          unlocked={isUnlocked}
                          size="md"
                        />
                        {isUnlocked && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                            <CheckCircle2 className="w-2 h-2 text-slate-900" />
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-medium text-center leading-tight max-w-[70px] ${
                          isUnlocked ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {getBadgeLabel(badge)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-5 pt-5 border-t border-slate-800/50">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Progresso geral</span>
                  <span className="font-bold text-amber-400">
                    {Math.round(
                      ((progress?.badges?.length ?? 0) /
                        BADGES_DISPLAY.length) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-400 rounded-full shadow-lg shadow-amber-500/20"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((progress?.badges?.length ?? 0) /
                          BADGES_DISPLAY.length) *
                        100
                      }%`,
                    }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>
            </GlassCard>

            {/* ── Busca de Modos ── */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="search-modos"
                type="text"
                placeholder="Buscar modos de estudo… (Ctrl+S)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  aria-label="Limpar busca"
                >
                  ×
                </button>
              )}
            </div>

            {/* ── Modos de Estudo ── */}
            <section aria-label="Modos de estudo">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-200">
                <Star className="w-5 h-5 text-amber-400" /> Escolha seu Modo
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-500 ml-auto font-mono">
                  <Keyboard className="w-3 h-3" /> Ctrl+N, Ctrl+T, Ctrl+E,
                  Ctrl+S
                </span>
              </h2>

              {modosFiltrados.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">Nenhum modo encontrado para "{searchTerm}"</p>
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

            {/* ── Cards Inferiores ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Regra CEBRASPE */}
              <GlassCard className="p-5" variant="info">
                <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-slate-200">
                  <Clock className="w-5 h-5 text-blue-400" /> Pontuação CEBRASPE
                </h3>
                <div className="space-y-2">
                  {(
                    [
                      {
                        label: "Acerto",
                        value: "+1",
                        colorKey: "emerald",
                        desc: "Ganha 1 ponto",
                      },
                      {
                        label: "Erro",
                        value: "−1",
                        colorKey: "rose",
                        desc: "Perde 1 ponto",
                      },
                      {
                        label: "Em branco",
                        value: "0",
                        colorKey: "slate",
                        desc: "Não altera",
                      },
                    ] as const
                  ).map((item) => {
                    const colors = COLOR_MAP[item.colorKey];
                    return (
                      <div
                        key={item.label}
                        className={`flex items-center justify-between p-3 rounded-lg ${colors.bg} border ${colors.border}`}
                      >
                        <div>
                          <span
                            className={`text-sm font-medium block ${colors.text}`}
                          >
                            {item.label}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {item.desc}
                          </span>
                        </div>
                        <span className={`font-bold text-lg ${colors.text}`}>
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Backup */}
              <GlassCard className="p-5">
                <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-slate-200">
                  <Settings className="w-5 h-5 text-purple-400" /> Backup e
                  Sincronização
                </h3>

                {exportError && (
                  <p className="text-xs text-rose-400 mb-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    {exportError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setExportError(null);
                      setShowExportModal(true);
                    }}
                    disabled={isExporting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExporting ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isExporting ? "Exportando…" : "Exportar Dados"}
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
                <p className="text-[10px] text-slate-600 mt-3">
                  {historicoNormalizado.length} simulados salvos localmente
                </p>
              </GlassCard>
            </div>
          </>
        )}
      </main>

      {/* ── Modal de Exportação ── */}
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
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-2">
                Exportar Dados
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Seus dados serão salvos em um arquivo JSON que pode ser
                reimportado neste app.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-3 mb-4 text-xs text-slate-500 font-mono space-y-1">
                <p>{historicoNormalizado.length} simulados</p>
                <p>{progress?.badges?.length ?? 0} conquistas desbloqueadas</p>
                <p>Streak: {progress?.streakDias ?? 0} dias</p>
              </div>

              {exportError && (
                <p className="text-xs text-rose-400 mb-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  {exportError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={exportarDados}
                  disabled={isExporting}
                  className="flex-1 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isExporting && (
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  )}
                  {isExporting ? "Exportando…" : "Confirmar"}
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

      {/* ── Nova Conquista ── */}
      <AnimatePresence>
        {showNewBadge && (
          <NewBadgeNotification
            badgeType={showNewBadge as BadgeType}
            onClose={() => setShowNewBadge(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Level Up Modal ── */}
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
              initial={{ scale: 0.5, y: 80 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 80 }}
              transition={{ type: "spring", damping: 18, stiffness: 200 }}
              className="text-center max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : { rotate: [0, 12, -12, 0], scale: [1, 1.2, 1] }
                }
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-7xl mb-6 select-none"
              >
                🎉
              </motion.div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                LEVEL UP!
              </h2>
              <p className="text-lg text-slate-300 mb-4">Você alcançou</p>
              <div
                className="inline-block px-8 py-4 rounded-2xl bg-slate-800/80 border-2 mb-6"
                style={{ borderColor: nivelAtual?.cor ?? "#3b82f6" }}
              >
                <span className="text-3xl font-bold text-white block">
                  {nivelAtual?.nome ?? "Novo Nível"}
                </span>
                <span className="text-sm text-slate-400">
                  Nível {progress?.nivel ?? 1}
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

      <Footer />
    </div>
  );
}