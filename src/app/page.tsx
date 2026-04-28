"use client";

import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AlertasDesempenho } from "@/components/Dashboard/AlertasDesempenho";
import { BackupCard } from "@/components/Dashboard/BackupCard";
import { HeaderDashboard } from "@/components/Dashboard/HeaderDashboard";
import { LevelUpModal } from "@/components/Dashboard/LevelUpModal";
import { LoadingDashboard } from "@/components/Dashboard/LoadingDashboard";
import { ModosEstudoGrid } from "@/components/Dashboard/ModosEstudoGrid";
import { NivelCard } from "@/components/Dashboard/NivelCard";
import { PeriodoFilter } from "@/components/Dashboard/PeriodoFilter";
import { RegraCEBRASPE } from "@/components/Dashboard/RegraCEBRASPE";
import { SearchModos } from "@/components/Dashboard/SearchModos";
import { StatsGrid } from "@/components/Dashboard/StatsGrid";
import { WelcomeScreen } from "@/components/Dashboard/WelcomeScreen";
import Footer from "@/components/layout/Footer";
import { NewBadgeNotification } from "@/components/ui/Badge";
import { NIVEIS } from "@/data/index";
import { useGamificacao } from "@/hooks/useGamificacao";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { classificarDesempenho } from "@/lib/simulado-logic";

const Confetti = lazy(() =>
  import("@/components/ui/Confetti").catch(() => ({ default: () => null })),
);

type PeriodoFiltro = "7" | "30" | "90" | "todos";

export type BadgeType =
  | "primeiro"
  | "streak-3"
  | "streak-7"
  | "streak-30"
  | "cebraspe-master"
  | "cebraspe-god"
  | "polivalente"
  | "especialista"
  | "velocista"
  | "velocista-extreme"
  | "nivel-5"
  | "nivel-10"
  | "nivel-max"
  | "perfeccionista"
  | "persistente";

type ModoVariant = "blue" | "amber" | "emerald" | "rose" | "purple" | "cyan";

interface ModoEstudoItem {
  href: string;
  icon: any;
  variant: ModoVariant;
  title: string;
  description: string;
  xp: string;
  tag: string;
  shortcut?: string;
  badge?: string;
}

const MODOS_ESTUDO: ModoEstudoItem[] = [
  {
    href: "/simulado?modo=completo",
    icon: require("lucide-react").Play,
    variant: "blue",
    title: "Simulado Completo",
    description: "60 questões • 4 horas • Ambiente real CEBRASPE",
    xp: "+50 XP",
    tag: "Prova oficial",
    shortcut: "Ctrl+N",
  },
  {
    href: "/simulado?modo=turbo",
    icon: require("lucide-react").Zap,
    variant: "amber",
    title: "Modo Turbo",
    description: "50 questões • 40 min • Revisão rápida",
    xp: "+30 XP",
    tag: "Desafio velocidade",
    shortcut: "Ctrl+T",
  },
  {
    href: "/treino",
    icon: require("lucide-react").BookOpen,
    variant: "emerald",
    title: "Treino Específico",
    description: "Foque na sua disciplina mais fraca",
    xp: "+20 XP",
    tag: "Explicação imediata",
  },
  {
    href: "/erros",
    icon: require("lucide-react").XCircle,
    variant: "rose",
    title: "Revisar Erros",
    description: "Banco de questões que você errou",
    xp: "+15 XP",
    tag: "Aprenda com falhas",
    shortcut: "Ctrl+E",
  },
  {
    href: "/simulado?modo=adaptativo",
    icon: require("lucide-react").Target,
    variant: "purple",
    title: "Adaptativo IA",
    description: "IA seleciona suas maiores dificuldades",
    xp: "+50 XP",
    tag: "Personalizado",
    badge: "IA",
  },
  {
    href: "/estatisticas",
    icon: require("lucide-react").BarChart3,
    variant: "cyan",
    title: "Estatísticas",
    description: "Análise profunda por disciplina",
    xp: "Visual",
    tag: "Gráficos completos",
  },
];

const DISCIPLINAS_NOME: Record<string, string> = {
  PORTUGUES: "Português",
  ETICA: "Ética",
  RACIOCINIO_LOGICO: "Raciocínio Lógico",
  DIREITO_CONSTITUCIONAL: "Dir. Const.",
  DIREITO_ADMINISTRATIVO: "Dir. Administrativo",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Legislação PRF",
};

const LS_KEYS = {
  historico: "prf_historico",
  progresso: "prf_user_progress",
  erros: "prf_erros",
  config: "prf_config",
} as const;

interface HistoricoItem {
  id: string;
  modo: string;
  data: string;
  estatisticas: {
    pontuacao: number;
    [key: string]: unknown;
  };
  questoes: Array<{
    disciplina?: string;
    resposta?: string;
    respostaUsuario?: string;
    [key: string]: unknown;
  }>;
}

function isHistoricoValido(h: unknown): h is HistoricoItem {
  if (!h || typeof h !== "object") return false;
  const item = h as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.modo === "string" &&
    typeof item.data === "string" &&
    item.estatisticas !== null &&
    typeof item.estatisticas === "object" &&
    typeof (item.estatisticas as Record<string, unknown>).pontuacao ===
      "number" &&
    Array.isArray(item.questoes)
  );
}

interface Estatisticas {
  ultimo: HistoricoItem;
  media: number;
  media7Dias: number;
  tendencia: "up" | "down" | "stable";
  melhor: number;
  pior: number;
  total: number;
  classificacao: ReturnType<typeof classificarDesempenho>;
  disciplinaFraca: {
    nome: string;
    aproveitamento: number;
  } | null;
}

export default function Dashboard() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNewBadge, setShowNewBadge] = useState<string | null>(null);
  const [periodoFiltro, setPeriodoFiltro] = useState<PeriodoFiltro>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const { progress, showLevelUp, dismissLevelUp } = useGamificacao();
  const { value: historicoRaw, setValue: setHistoricoStorage } =
    useLocalStorage<unknown[]>({
      key: LS_KEYS.historico,
      defaultValue: [],
    });

  const historicoNormalizado = useMemo((): HistoricoItem[] => {
    if (!Array.isArray(historicoRaw)) return [];
    return historicoRaw.filter(isHistoricoValido);
  }, [historicoRaw]);

  const hasValidData = historicoNormalizado.length > 0;

  const historicoFiltrado = useMemo((): HistoricoItem[] => {
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

  const estatisticas = useMemo((): Estatisticas | null => {
    if (historicoFiltrado.length === 0) return null;

    const total = historicoFiltrado.length;
    const ultimos7 = historicoFiltrado.slice(0, Math.min(7, total));

    const mediaArray = (arr: typeof historicoFiltrado) =>
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
      .filter(([, s]) => s.total >= 3)
      .sort(([, a], [, b]) => a.acertos / a.total - b.acertos / b.total)[0];

    const ultimoSimulado = historicoFiltrado[0];
    const ultimaPontuacao = ultimoSimulado.estatisticas.pontuacao;
    const ultimoTotalQuestoes = ultimoSimulado.questoes.length || 60;
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
        ultimoTotalQuestoes,
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

  const nivelAtual =
    NIVEIS.find((n) => n.nivel === (progress?.nivel ?? 1)) ?? NIVEIS[0];

  const progressoNivel = useMemo(() => {
    const xpAtual = progress?.xpAtual ?? 0;
    const xpProximo = progress?.xpParaProximoNivel ?? 100;
    if (xpProximo <= 0) return 100;
    return Math.min(100, (xpAtual / (xpAtual + xpProximo)) * 100);
  }, [progress?.xpAtual, progress?.xpParaProximoNivel]);

  const modosFiltrados = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return MODOS_ESTUDO;
    return MODOS_ESTUDO.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term) ||
        m.tag.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleIniciarPrimeiroSimulado = useCallback(() => {
    router.push("/simulado?modo=completo");
  }, [router]);

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
        typeof (window as any).showSaveFilePicker === "function"
      ) {
        try {
          const handle = await (window as any).showSaveFilePicker({
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
    } catch (err) {
      console.error("Erro ao exportar:", err);
      setExportError("Não foi possível exportar. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  const importarDados = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        if (!file.name.endsWith(".json"))
          throw new Error("O arquivo deve ser um JSON (.json).");
        if (file.size > 10 * 1024 * 1024)
          throw new Error("Arquivo muito grande (máx. 10 MB).");

        const text = await file.text();
        let dados: Record<string, unknown>;
        try {
          dados = JSON.parse(text);
        } catch {
          throw new Error("Arquivo JSON inválido ou corrompido.");
        }

        if (typeof dados.versao !== "string")
          throw new Error("Arquivo inválido: campo 'versao' não encontrado.");
        if (dados.app !== "prf-simulado")
          throw new Error("Este arquivo não pertence ao PRF Simulado.");

        if (
          !window.confirm(
            "Isso substituirá todos os seus dados atuais. Deseja continuar?",
          )
        )
          return;

        for (const key of Object.values(LS_KEYS)) {
          const value = dados[key];
          if (typeof value === "string") {
            localStorage.setItem(key, value);
          }
        }

        window.location.reload();
      } catch (err) {
        alert(
          err instanceof Error ? err.message : "Erro desconhecido ao importar.",
        );
      } finally {
        e.target.value = "";
      }
    },
    [],
  );

  if (!mounted) return <LoadingDashboard />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white selection:bg-blue-500/30">
      <Suspense fallback={null}>
        <Confetti trigger={showConfetti && !prefersReducedMotion} />
      </Suspense>

      <HeaderDashboard
        streakDias={progress?.streakDias ?? 0}
        nivel={progress?.nivel ?? 1}
        nivelNome={nivelAtual?.nome ?? "Iniciante"}
        nivelCor={nivelAtual?.cor ?? "#3b82f6"}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {!hasValidData ? (
          <WelcomeScreen onIniciar={handleIniciarPrimeiroSimulado} />
        ) : (
          <>
            <PeriodoFilter
              periodo={periodoFiltro}
              onChange={setPeriodoFiltro}
              hasDataInPeriod={historicoFiltrado.length > 0}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              <NivelCard
                nivel={progress?.nivel ?? 1}
                nivelNome={nivelAtual?.nome ?? "Iniciante"}
                nivelCor={nivelAtual?.cor ?? "#3b82f6"}
                progressoNivel={progressoNivel}
                xpParaProximo={progress?.xpParaProximoNivel ?? 100}
              />

              {estatisticas && (
                <div className="xl:col-span-2">
                  <StatsGrid
                    mediaGeral={estatisticas.media}
                    tendencia={estatisticas.tendencia}
                    media7Dias={estatisticas.media7Dias}
                    melhorPontuacao={estatisticas.melhor}
                    piorPontuacao={estatisticas.pior}
                    totalSimulados={estatisticas.total}
                    periodoFiltro={periodoFiltro}
                    ultimoData={new Date(
                      estatisticas.ultimo.data,
                    ).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                    ultimaPontuacao={estatisticas.ultimo.estatisticas.pontuacao}
                  />
                </div>
              )}
            </div>

            <AlertasDesempenho
              classificacaoNivel={estatisticas?.classificacao?.nivel}
              disciplinaFraca={estatisticas?.disciplinaFraca || undefined}
              streakDias={progress?.streakDias ?? 0}
            />

            <SearchModos value={searchTerm} onChange={setSearchTerm} />

            <ModosEstudoGrid
              modos={modosFiltrados}
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm("")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RegraCEBRASPE />
              <BackupCard
                totalSimulados={historicoNormalizado.length}
                streakDias={progress?.streakDias ?? 0}
                onExport={exportarDados}
                onImport={importarDados}
                isExporting={isExporting}
                exportError={exportError}
              />
            </div>
          </>
        )}
      </main>

      <NewBadgeNotification
        badgeType={showNewBadge as BadgeType}
        onClose={() => setShowNewBadge(null)}
      />

      <LevelUpModal
        show={showLevelUp}
        nivel={progress?.nivel ?? 1}
        nivelNome={nivelAtual?.nome ?? "Iniciante"}
        nivelCor={nivelAtual?.cor ?? "#3b82f6"}
        onDismiss={dismissLevelUp}
        prefersReducedMotion={prefersReducedMotion || false}
      />

      <Footer />
    </div>
  );
}
