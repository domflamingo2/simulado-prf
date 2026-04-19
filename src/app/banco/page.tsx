"use client";

import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

import { DISCIPLINAS_NOME } from "@/constants/disciplinas";
import { getEstatisticasBanco, getStatsPorDisciplina, questoes } from "@/data";
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
const DEBOUNCE_BUSCA_MS = 350;

// ─── Loading Overlay ──────────────────────────────────────────────────────────

const LoadingOverlay = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.92, opacity: 0 }}
      className="bg-slate-900/95 border border-white/[0.08] rounded-2xl px-8 py-6 flex flex-col items-center gap-4 shadow-2xl"
    >
      <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      <p className="text-sm text-slate-300">{message}</p>
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
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="flex flex-col items-center gap-2 pt-6 pb-2 text-center"
  >
    <p className="text-xs text-slate-500">
      Mostrando{" "}
      <span className="text-slate-400 font-medium tabular-nums">
        {total.toLocaleString("pt-BR")}
      </span>{" "}
      de{" "}
      <span className="text-slate-400 font-medium tabular-nums">
        {totalBanco.toLocaleString("pt-BR")}
      </span>{" "}
      questões
      {favoritas > 0 && (
        <span className="ml-2 text-amber-400/80">
          · {favoritas.toLocaleString("pt-BR")} favorita
          {favoritas !== 1 ? "s" : ""}
        </span>
      )}
    </p>

    {virtualizado && (
      <p className="text-[10px] text-slate-600">
        ⚡ Modo performance ativo · {total.toLocaleString("pt-BR")} questões
        renderizadas com virtualização
      </p>
    )}

    <p className="text-[10px] text-slate-700">
      <kbd className="px-1.5 py-px rounded bg-white/[0.04] border border-white/[0.06] font-mono text-slate-600">
        Ctrl K
      </kbd>{" "}
      busca rápida &nbsp;·&nbsp;{" "}
      <kbd className="px-1.5 py-px rounded bg-white/[0.04] border border-white/[0.06] font-mono text-slate-600">
        Esc
      </kbd>{" "}
      limpar filtros
    </p>
  </motion.footer>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BancoQuestoesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── UI state ───────────────────────────────────────────────────────────────
  const [carregando, setCarregando] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  // ── Filter state ───────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<Filters>({
    busca: "",
    disciplina: "todas",
    dificuldade: "todas",
  });

  // ── Favorites ──────────────────────────────────────────────────────────────
  const [favoritas, setFavoritas] = useState<Set<string>>(new Set());

  // ── Scroll restoration ref ─────────────────────────────────────────────────
  const didRestoreScroll = useRef(false);

  // ── Sync URL → state + localStorage → favorites on mount ──────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("prf_questoes_favoritas");
      if (saved) setFavoritas(new Set(JSON.parse(saved) as string[]));

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
    } catch (err) {
      console.error("[BancoQuestoesPage] init error:", err);
      toast.error("Erro ao carregar preferências");
    } finally {
      setCarregando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentional: run once on mount

  // ── Scroll restoration ─────────────────────────────────────────────────────
  useEffect(() => {
    if (carregando || didRestoreScroll.current) return;
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
  }, [carregando]);

  // ── URL sync helper ────────────────────────────────────────────────────────
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

  // ── Debounced busca ────────────────────────────────────────────────────────
  const debouncedSyncURL = useDebouncedCallback(
    (f: Filters) => pushFiltersToURL(f),
    DEBOUNCE_BUSCA_MS,
  ) as (f: Filters) => void;

  const setFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value };
        // Sync imediato para filtros não-busca; debounced para busca
        if (key === "busca") debouncedSyncURL(next);
        else pushFiltersToURL(next);
        return next;
      });
    },
    [debouncedSyncURL, pushFiltersToURL],
  );

  const limparFiltros = useCallback(() => {
    const reset: Filters = {
      busca: "",
      disciplina: "todas",
      dificuldade: "todas",
    };
    setFilters(reset);
    pushFiltersToURL(reset);
    toast.info("Filtros limpos");
  }, [pushFiltersToURL]);

  // ── Static data (memoized once) ────────────────────────────────────────────
  const estatisticasBanco = useMemo(() => getEstatisticasBanco(), []);
  const statsPorDisciplina = useMemo(() => getStatsPorDisciplina(), []);

  // ── Filtered questions ─────────────────────────────────────────────────────
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

  // ── Favorites ──────────────────────────────────────────────────────────────
  const toggleFavorita = useCallback((id: string) => {
    setFavoritas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info("Removida dos favoritos");
      } else {
        next.add(id);
        toast.success("Adicionada aos favoritos ⭐");
      }
      try {
        localStorage.setItem(
          "prf_questoes_favoritas",
          JSON.stringify([...next]),
        );
      } catch {
        // storage full or blocked — silently ignore
      }
      return next;
    });
  }, []);

  // ── Export ─────────────────────────────────────────────────────────────────
  const exportarQuestoes = useCallback(async () => {
    if (questoesFiltradas.length === 0) {
      toast.error("Nenhuma questão para exportar");
      return;
    }

    setIsExporting(true);

    try {
      if (questoesFiltradas.length > 5_000) {
        toast.warning("Grande volume — pode demorar alguns segundos…", {
          duration: 5000,
        });
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

  // ── Start training ─────────────────────────────────────────────────────────
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

      toast.success(`Iniciando treino com ${selecionadas.length} questões!`);

      await new Promise((r) => setTimeout(r, 400)); // let toast render
      router.push("/treino/simulado");
    } catch (err) {
      console.error("[iniciarTreino]", err);
      toast.error("Erro ao preparar treino. Tente novamente.");
      setIsTraining(false);
    }
    // Note: setIsTraining(false) NOT called on success — page navigates away
  }, [questoesFiltradas, router]);

  // ── Active filter labels ────────────────────────────────────────────────────
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

  // ── Early return ───────────────────────────────────────────────────────────
  if (carregando) return <LoadingBanco variant="initial" />;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(15,17,23,0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#f1f5f9",
            fontSize: "13px",
            backdropFilter: "blur(12px)",
          },
          duration: 3000,
        }}
      />

      {/* ── Action overlays ── */}
      <AnimatePresence>
        {isExporting && (
          <LoadingOverlay key="exp" message="Exportando questões…" />
        )}
        {isTraining && (
          <LoadingOverlay key="trn" message="Preparando treino…" />
        )}
      </AnimatePresence>

      {/* ── Page shell ── */}
      <div className="min-h-screen bg-slate-950 text-white">
        <HeaderBanco total={estatisticasBanco.total} isLoading={false} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
          {/* Stats */}
          <EstatisticasBanco stats={estatisticasBanco} isLoading={false} />

          {/* Filters */}
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

          {/* Actions */}
          <AcoesBancoWithErrorBoundary
            totalQuestoes={questoesFiltradas.length}
            questoesSelecionadas={estatisticasBanco.total}
            onExportar={exportarQuestoes}
            onTreinar={iniciarTreino}
            onResetarFiltros={limparFiltros}
          />

          {/* Question list */}
          <section aria-label="Lista de questões">
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
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
