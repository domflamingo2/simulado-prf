"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

import { DISCIPLINAS_NOME } from "@/constants/disciplinas";
import {
  getEstatisticasBanco,
  getStatsPorDisciplina,
  questoes,
} from "@/data/questoes";
import { AcoesBancoWithErrorBoundary } from "./components/AcoesBanco";
import { EmptyStateBanco } from "./components/EmptyStateBanco";
import { EstatisticasBanco } from "./components/EstatisticasBanco";
import { FiltrosBanco } from "./components/FiltrosBanco";
import { HeaderBanco } from "./components/HeaderBanco";
import { LoadingBanco } from "./components/LoadingBanco";
import {
  QuestaoCardBanco,
  QuestaoListVirtualizada,
} from "./components/QuestaoCardBanco";

// ─── Types ────────────────────────────────────────────────────────────────────

type DificuldadeLevel = "todas" | "1" | "2" | "3";

interface Filters {
  busca: string;
  disciplina: string;
  dificuldade: DificuldadeLevel;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_DIFICULDADES: DificuldadeLevel[] = ["todas", "1", "2", "3"];
const VIRTUALIZE_THRESHOLD = 100;
const TREINO_MAX_QUESTOES = 30;

// ─── Loading Overlay ──────────────────────────────────────────────────────────

const LoadingOverlay = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-2xl px-8 py-6 flex flex-col items-center gap-4 shadow-2xl"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-3 border-blue-500/20 border-t-blue-500 border-r-purple-500/50 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
        </div>
      </div>
      <p className="text-sm text-slate-300 font-medium">{message}</p>
    </motion.div>
  </motion.div>
);

// ─── Footer ───────────────────────────────────────────────────────────────────

const PageFooter = ({
  total,
  totalBanco,
  favoritas,
  virtualizado,
}: {
  total: number;
  totalBanco: number;
  favoritas: number;
  virtualizado: boolean;
}) => (
  <motion.footer
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="flex flex-col items-center gap-3 pt-8 pb-4 text-center border-t border-white/10 mt-6"
  >
    <div className="flex items-center gap-3 flex-wrap justify-center">
      <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30">
        <span className="text-xs text-slate-300">
          Mostrando{" "}
          <span className="font-bold text-blue-400 tabular-nums">
            {total.toLocaleString("pt-BR")}
          </span>{" "}
          de{" "}
          <span className="font-bold text-slate-300 tabular-nums">
            {totalBanco.toLocaleString("pt-BR")}
          </span>{" "}
          questões
        </span>
      </div>

      {favoritas > 0 && (
        <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
          <span className="text-xs text-amber-400">
            ⭐ {favoritas.toLocaleString("pt-BR")} favorita
            {favoritas !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {virtualizado && (
        <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30">
          <span className="text-xs text-purple-400">
            ⚡ Modo performance • {total.toLocaleString("pt-BR")} questões
          </span>
        </div>
      )}
    </div>

    <div className="flex items-center gap-4 text-[10px] text-slate-600">
      <div className="flex items-center gap-1.5">
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[9px]">
          Ctrl
        </kbd>
        <span>+</span>
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[9px]">
          K
        </kbd>
        <span>busca rápida</span>
      </div>
      <div className="w-1 h-1 rounded-full bg-slate-700" />
      <div className="flex items-center gap-1.5">
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[9px]">
          Esc
        </kbd>
        <span>limpar filtros</span>
      </div>
      <div className="w-1 h-1 rounded-full bg-slate-700" />
      <div className="flex items-center gap-1.5">
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[9px]">
          Ctrl
        </kbd>
        <span>+</span>
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 font-mono text-[9px]">
          T
        </kbd>
        <span>treinar</span>
      </div>
    </div>
  </motion.footer>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BancoQuestoesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // UI state
  const [carregando, setCarregando] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<Filters>({
    busca: "",
    disciplina: "todas",
    dificuldade: "todas",
  });

  // Favorites – inicialização lazy (sem efeito)
  const [favoritas, setFavoritas] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("prf_questoes_favoritas");
      if (saved) return new Set(JSON.parse(saved) as string[]);
    } catch {
      // falha silenciosa
    }
    return new Set();
  });

  // Scroll restoration ref
  const didRestoreScroll = useRef(false);

  // Sincroniza filtros com a URL (navegação back/forward)
  useEffect(() => {
    const urlBusca = searchParams.get("busca") ?? "";
    const urlDisciplina = searchParams.get("disciplina") ?? "todas";
    const urlDificuldade = searchParams.get("dificuldade") ?? "todas";

    setFilters({
      busca: urlBusca,
      disciplina: urlDisciplina,
      dificuldade: VALID_DIFICULDADES.includes(
        urlDificuldade as DificuldadeLevel,
      )
        ? (urlDificuldade as DificuldadeLevel)
        : "todas",
    });
  }, [searchParams]);

  // Restaura scroll ao carregar
  useEffect(() => {
    if (didRestoreScroll.current) return;
    didRestoreScroll.current = true;
    const saved = sessionStorage.getItem("banco_scroll_position");
    if (saved) {
      requestAnimationFrame(() =>
        window.scrollTo({ top: parseInt(saved, 10) }),
      );
    }
    return () => {
      sessionStorage.setItem("banco_scroll_position", String(window.scrollY));
    };
  }, []);

  // URL sync helper
  const pushFiltersToURL = useCallback(
    (f: Filters) => {
      const params = new URLSearchParams();
      if (f.busca) params.set("busca", f.busca);
      if (f.disciplina !== "todas") params.set("disciplina", f.disciplina);
      if (f.dificuldade !== "todas") params.set("dificuldade", f.dificuldade);
      const qs = params.toString();
      const url = qs ? `?${qs}` : window.location.pathname;
      router.replace(url, { scroll: false });
    },
    [router],
  );

  const setFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const limparFiltros = useCallback(() => {
    const reset: Filters = {
      busca: "",
      disciplina: "todas",
      dificuldade: "todas",
    };
    setFilters(reset);
    pushFiltersToURL(reset);
    toast.success("Filtros limpos com sucesso!");
  }, [pushFiltersToURL]);

  // Dados estáticos
  const estatisticasBanco = useMemo(() => getEstatisticasBanco(), []);
  const statsPorDisciplina = useMemo(() => getStatsPorDisciplina(), []);

  // Questões filtradas
  const questoesFiltradas = useMemo(() => {
    let result = questoes as typeof questoes;
    if (filters.disciplina !== "todas") {
      result = result.filter((q) => q.disciplina === filters.disciplina);
    }
    if (filters.dificuldade !== "todas") {
      const nivel = parseInt(filters.dificuldade, 10);
      result = result.filter((q) => q.dificuldade === nivel);
    }
    const termo = filters.busca.trim().toLowerCase();
    if (termo) {
      result = result.filter(
        (q) =>
          q.enunciado.toLowerCase().includes(termo) ||
          q.assunto?.toLowerCase().includes(termo) ||
          q.disciplina.toLowerCase().includes(termo) ||
          q.tags?.some((t) => t.toLowerCase().includes(termo)),
      );
    }
    return result;
  }, [filters]);

  const shouldVirtualize = questoesFiltradas.length > VIRTUALIZE_THRESHOLD;

  // Toggle favorito
  const toggleFavorita = useCallback((id: string) => {
    setFavoritas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info("⭐ Removida dos favoritos");
      } else {
        next.add(id);
        toast.success("⭐ Adicionada aos favoritos!");
      }
      try {
        localStorage.setItem(
          "prf_questoes_favoritas",
          JSON.stringify([...next]),
        );
      } catch {
        console.warn("Não foi possível salvar favoritos no localStorage");
      }
      return next;
    });
  }, []);

  // 1. Carrega favoritos do localStorage apenas uma vez
  useEffect(() => {
    try {
      const saved = localStorage.getItem("prf_questoes_favoritas");
      if (saved) setFavoritas(new Set(JSON.parse(saved) as string[]));
    } catch (err) {
      console.error("Erro ao ler favoritos", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Exportar questão com payload otimizado
  const exportarQuestoes = useCallback(async () => {
    if (questoesFiltradas.length === 0) {
      toast.error("Nenhuma questão para exportar");
      return;
    }

    setIsExporting(true);

    try {
      if (questoesFiltradas.length > 5000) {
        toast.warning(
          "Grande volume de questões — pode demorar alguns segundos...",
        );
      }

      const payload = {
        exportadoEm: new Date().toISOString(),
        totalQuestoes: questoesFiltradas.length,
        filtrosAplicados: {
          busca: filters.busca || null,
          disciplina:
            filters.disciplina !== "todas" ? filters.disciplina : null,
          dificuldade:
            filters.dificuldade !== "todas" ? filters.dificuldade : null,
        },
        questoes: questoesFiltradas.map((q) => ({
          id: q.id,
          disciplina: q.disciplina,
          enunciado: q.enunciado,
          resposta: q.resposta,
          explicacao: q.explicacao,
          dificuldade: q.dificuldade,
          ano: q.ano,
          banca: q.banca_referencia,
          assunto: q.assunto,
          tags: q.tags,
          fonte_legal: q.fonte_legal,
        })),
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: `prf_banco_questoes_${new Date().toISOString().split("T")[0]}.json`,
      });
      document.body.appendChild(a);
      a.click();

      requestAnimationFrame(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      toast.success(
        `${questoesFiltradas.length.toLocaleString("pt-BR")} questões exportadas!`,
      );
    } catch (err) {
      console.error("[exportarQuestoes]", err);
      toast.error("Erro ao exportar. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  }, [questoesFiltradas, filters]);

  // Treinar com questões filtradas
  const iniciarTreino = useCallback(async () => {
    if (questoesFiltradas.length === 0) {
      toast.error("Nenhuma questão selecionada para treino");
      return;
    }

    setIsTraining(true);

    try {
      const selecionadas = questoesFiltradas
        .slice(0, TREINO_MAX_QUESTOES)
        .map((q) => ({ ...q, respostaUsuario: undefined }));

      localStorage.setItem(
        "prf_treino_atual",
        JSON.stringify({
          disciplina: "BANCO_DE_QUESTOES",
          questoes: selecionadas,
          mostrarExplicacao: true,
          modo: "TREINO",
          totalDisponiveis: questoesFiltradas.length,
          dataInicio: new Date().toISOString(),
        }),
      );

      toast.success(`🎯 Iniciando treino com ${selecionadas.length} questões!`);

      await new Promise((r) => setTimeout(r, 400));
      router.push("/treino/simulado");
    } catch (err) {
      console.error("[iniciarTreino]", err);
      toast.error("Erro ao preparar treino. Tente novamente.");
      setIsTraining(false);
    }
  }, [questoesFiltradas, router]);

  // Filtros ativos (para exibição)
  const filtrosAtivos = useMemo(() => {
    const labels: string[] = [];
    if (filters.busca) labels.push(`"${filters.busca}"`);
    if (filters.disciplina !== "todas") {
      labels.push(
        DISCIPLINAS_NOME[filters.disciplina as keyof typeof DISCIPLINAS_NOME] ??
          filters.disciplina,
      );
    }
    if (filters.dificuldade !== "todas") {
      labels.push(
        filters.dificuldade === "1"
          ? "Fácil"
          : filters.dificuldade === "2"
            ? "Médio"
            : "Difícil",
      );
    }
    return labels;
  }, [filters]);

  // Early return
  if (carregando) return <LoadingBanco variant="initial" />;

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "#1e293b",
            border: "1px solid #334155",
            color: "#f1f5f9",
          },
        }}
      />

      <AnimatePresence>
        {isExporting && (
          <LoadingOverlay key="exp" message="Exportando questões..." />
        )}
        {isTraining && (
          <LoadingOverlay key="trn" message="Preparando treino..." />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <HeaderBanco total={estatisticasBanco.total} isLoading={false} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Estatísticas */}
          <EstatisticasBanco stats={estatisticasBanco} isLoading={false} />

          {/* Filtros */}
          <FiltrosBanco
            busca={filters.busca}
            setBusca={(v) => {
              const val = typeof v === "function" ? v(filters.busca) : v;
              setFilter("busca", val);
            }}
            disciplinaFiltro={filters.disciplina}
            setDisciplinaFiltro={(v) => setFilter("disciplina", v as string)}
            dificuldadeFiltro={filters.dificuldade}
            setDificuldadeFiltro={(v) => {
              const val = typeof v === "function" ? v(filters.dificuldade) : v;
              setFilter("dificuldade", val as DificuldadeLevel);
            }}
            statsPorDisciplina={statsPorDisciplina}
            onLimparFiltros={limparFiltros}
            isLoading={false}
            totalQuestoesEncontradas={questoesFiltradas.length}
          />

          {/* Ações */}
          <AcoesBancoWithErrorBoundary
            totalQuestoes={questoesFiltradas.length}
            questoesSelecionadas={estatisticasBanco.total}
            onExportar={exportarQuestoes}
            onTreinar={iniciarTreino}
            onResetarFiltros={limparFiltros}
          />

          {/* Lista de questões */}
          <section aria-label="Lista de questões" className="space-y-4">
            <AnimatePresence mode="wait">
              {questoesFiltradas.length === 0 ? (
                <EmptyStateBanco
                  key="empty"
                  onLimparFiltros={limparFiltros}
                  variant="no-results"
                  filtrosAtivos={filtrosAtivos}
                />
              ) : shouldVirtualize ? (
                <motion.div
                  key="virtual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <QuestaoListVirtualizada
                    questoes={questoesFiltradas}
                    onFavoritar={toggleFavorita}
                    favoritas={favoritas}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {questoesFiltradas.map((questao, idx) => (
                    <QuestaoCardBanco
                      key={questao.id}
                      questao={questao}
                      index={idx}
                      onFavoritar={toggleFavorita}
                      isFavorita={favoritas.has(questao.id)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Footer */}
          {questoesFiltradas.length > 0 && (
            <PageFooter
              total={questoesFiltradas.length}
              totalBanco={estatisticasBanco.total}
              favoritas={favoritas.size}
              virtualizado={shouldVirtualize}
            />
          )}
        </main>
      </div>
    </>
  );
}
