"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Filter,
  Flag,
  Home,
  RotateCcw,
  Search,
  Share2,
  Trophy,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import QuestaoCard from "@/components/QuestaoCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { HistoricoSimulado, QuestaoRespondida } from "@/data/types";
import { classificarDesempenho } from "@/lib/simulado-logic";

// ═══════════════════════════════════════════════════════════
// TIPOS E CONSTANTES
// ═══════════════════════════════════════════════════════════

type FiltroRevisao = "todas" | "erros" | "acertos" | "brancos" | "marcadas";
type OrdenacaoRevisao = "numero" | "disciplina" | "dificuldade";

interface FiltrosState {
  tipo: FiltroRevisao;
  disciplina: string | "todas";
  ordenacao: OrdenacaoRevisao;
  busca: string;
}

const DISCIPLINAS_NOME: Record<string, string> = {
  PORTUGUES: "Português",
  ETICA: "Ética",
  RACIOCINIO_LOGICO: "Raciocínio Lógico",
  DIREITO_CONSTITUCIONAL: "Direito Constitucional",
  DIREITO_ADMINISTRATIVO: "Direito Administrativo",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Legislação PRF",
};

// ═══════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════

function StatBadge({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string | number;
  color: "emerald" | "rose" | "amber" | "blue";
}) {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colors[color]}`}
    >
      <Icon className="w-4 h-4" />
      <div>
        <p className="text-[10px] uppercase tracking-wider opacity-70">
          {label}
        </p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

function MiniQuestaoDot({
  questao,
  index,
  atual,
  onClick,
  marcada,
}: {
  questao: QuestaoRespondida;
  index: number;
  atual: boolean;
  onClick: () => void;
  marcada: boolean;
}) {
  const getStatus = () => {
    if (!questao.respostaUsuario) return "branco";
    return questao.respostaUsuario === questao.resposta ? "acerto" : "erro";
  };

  const status = getStatus();

  const colors = {
    acerto: "bg-emerald-500 hover:bg-emerald-400",
    erro: "bg-rose-500 hover:bg-rose-400",
    branco: "bg-slate-600 hover:bg-slate-500",
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all
        ${atual ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950 scale-110" : ""}
        ${colors[status]}
        ${atual ? "" : "opacity-70 hover:opacity-100"}
      `}
      title={`Questão ${index + 1}${marcada ? " (marcada)" : ""}`}
    >
      {index + 1}
      {marcada && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-slate-950" />
      )}
    </button>
  );
}

function EmptyState({ tipo }: { tipo: FiltroRevisao }) {
  const mensagens = {
    todas: "Nenhuma questão encontrada.",
    erros: "Parabéns! Você não errou nenhuma questão neste simulado.",
    acertos: "Você ainda não acertou nenhuma questão. Continue estudando!",
    brancos: "Você respondeu todas as questões!",
    marcadas: "Nenhuma questão marcada para revisão.",
  };

  return (
    <GlassCard className="p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
        <BookOpen className="w-8 h-8 text-slate-500" />
      </div>
      <p className="text-slate-400">{mensagens[tipo]}</p>
    </GlassCard>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function RevisaoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados
  const [simulados, setSimulados] = useState<HistoricoSimulado[]>([]);
  const [simuladoSelecionado, setSimuladoSelecionado] =
    useState<HistoricoSimulado | null>(null);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [filtros, setFiltros] = useState<FiltrosState>({
    tipo: (searchParams.get("filtro") as FiltroRevisao) || "todas",
    disciplina: "todas",
    ordenacao: "numero",
    busca: "",
  });
  const [marcadas, setMarcadas] = useState<number[]>([]);
  const [showFiltros, setShowFiltros] = useState(false);

  // Carrega dados
  useEffect(() => {
    const historico = JSON.parse(localStorage.getItem("prf_historico") || "[]");
    const ultimo = localStorage.getItem("prf_ultimo_simulado");

    if (historico.length === 0 && !ultimo) {
      router.push("/");
      return;
    }

    setSimulados(historico);

    // Seleciona simulado da URL ou último
    const idFromUrl = searchParams.get("id");
    const selecionado = idFromUrl
      ? historico.find((s: HistoricoSimulado) => s.id === idFromUrl)
      : ultimo
        ? JSON.parse(ultimo)
        : historico[0];

    if (selecionado) {
      setSimuladoSelecionado(selecionado);
      // Carrega marcações salvas
      const chaveMarcadas = `prf_marcadas_${selecionado.id}`;
      setMarcadas(JSON.parse(localStorage.getItem(chaveMarcadas) || "[]"));
    }
  }, [router, searchParams]);

  // Persiste marcações
  useEffect(() => {
    if (!simuladoSelecionado) return;
    const chave = `prf_marcadas_${simuladoSelecionado.id}`;
    localStorage.setItem(chave, JSON.stringify(marcadas));
  }, [marcadas, simuladoSelecionado]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          navegarAnterior();
          break;
        case "ArrowRight":
        case " ":
          e.preventDefault();
          navegarProxima();
          break;
        case "m":
        case "M":
          toggleMarcacao();
          break;
        case "f":
          setFiltros((f) => ({ ...f, tipo: "erros" }));
          break;
        case "t":
          setFiltros((f) => ({ ...f, tipo: "todas" }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [questaoAtual]);

  // Filtra e ordena questões
  const questoesFiltradas = useMemo(() => {
    if (!simuladoSelecionado) return [];

    let questoes = [...simuladoSelecionado.questoes];

    // Filtro por tipo
    switch (filtros.tipo) {
      case "erros":
        questoes = questoes.filter(
          (q) => q.respostaUsuario && q.respostaUsuario !== q.resposta,
        );
        break;
      case "acertos":
        questoes = questoes.filter((q) => q.respostaUsuario === q.resposta);
        break;
      case "brancos":
        questoes = questoes.filter((q) => !q.respostaUsuario);
        break;
      case "marcadas":
        questoes = questoes.filter((_, idx) => marcadas.includes(idx));
        break;
    }

    // Filtro por disciplina
    if (filtros.disciplina !== "todas") {
      questoes = questoes.filter((q) => q.disciplina === filtros.disciplina);
    }

    // Busca textual
    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase();
      questoes = questoes.filter(
        (q) =>
          q.enunciado.toLowerCase().includes(termo) ||
          q.explicacao?.toLowerCase().includes(termo),
      );
    }

    // Ordenação
    switch (filtros.ordenacao) {
      case "disciplina":
        questoes.sort((a, b) => a.disciplina.localeCompare(b.disciplina));
        break;
      case "dificuldade":
        const ordem: Record<string, number> = {
          DIFICIL: 0,
          MEDIO: 1,
          FACIL: 2,
        };

        questoes.sort((a, b) => {
          const da = String(a.dificuldade ?? "MEDIO");
          const db = String(b.dificuldade ?? "MEDIO");

          return (ordem[da] ?? 1) - (ordem[db] ?? 1);
        });
        1;
        break;
    }

    return questoes;
  }, [simuladoSelecionado, filtros, marcadas]);

  // Estatísticas
  const estatisticas = useMemo(() => {
    if (!simuladoSelecionado) return null;

    const stats = simuladoSelecionado.estatisticas;
    const classificacao = classificarDesempenho(
      stats.pontuacao,
      stats.totalQuestoes,
    );

    return {
      ...stats,
      classificacao,
      data: new Date(simuladoSelecionado.data).toLocaleDateString("pt-BR"),
    };
  }, [simuladoSelecionado]);

  // Handlers
  const navegarAnterior = useCallback(() => {
    setQuestaoAtual((prev) => Math.max(0, prev - 1));
  }, []);

  const navegarProxima = useCallback(() => {
    setQuestaoAtual((prev) => Math.min(questoesFiltradas.length - 1, prev + 1));
  }, [questoesFiltradas.length]);

  const toggleMarcacao = useCallback(() => {
    const questaoRealIndex = simuladoSelecionado?.questoes.indexOf(
      questoesFiltradas[questaoAtual],
    );
    if (questaoRealIndex === undefined || questaoRealIndex === -1) return;

    setMarcadas((prev) =>
      prev.includes(questaoRealIndex)
        ? prev.filter((m) => m !== questaoRealIndex)
        : [...prev, questaoRealIndex],
    );
  }, [questaoAtual, questoesFiltradas, simuladoSelecionado]);

  const compartilharQuestao = useCallback(async () => {
    const questao = questoesFiltradas[questaoAtual];
    const texto = `Questão ${questaoAtual + 1} - ${DISCIPLINAS_NOME[questao.disciplina]}\n\n${questao.enunciado.slice(0, 100)}...\n\nResposta: ${questao.resposta}`;

    try {
      await navigator.clipboard.writeText(texto);
      alert("Questão copiada para a área de transferência!");
    } catch {
      // Fallback
    }
  }, [questaoAtual, questoesFiltradas]);

  const refazerSimulado = useCallback(() => {
    if (!simuladoSelecionado) return;
    const modo = simuladoSelecionado.modo.toLowerCase();
    router.push(`/simulado?modo=${modo}`);
  }, [simuladoSelecionado, router]);

  // Loading
  if (!simuladoSelecionado || !estatisticas) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800" />
          <div className="w-48 h-4 rounded bg-slate-800" />
        </div>
      </div>
    );
  }

  const questao = questoesFiltradas[questaoAtual];
  const questaoRealIndex = simuladoSelecionado.questoes.indexOf(questao);
  const isMarcada = marcadas.includes(questaoRealIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <Home className="w-5 h-5 text-slate-400" />
              </Link>

              <div>
                <h1 className="text-lg font-bold text-white">Revisão</h1>
                <p className="text-xs text-slate-400">
                  {estatisticas.data} • {estatisticas.classificacao.mensagem}
                </p>
              </div>
            </div>

            {/* Stats rápidas */}
            <div className="flex gap-2">
              <StatBadge
                icon={CheckCircle2}
                label="Acertos"
                value={estatisticas.acertos}
                color="emerald"
              />
              <StatBadge
                icon={XCircle}
                label="Erros"
                value={estatisticas.erros}
                color="rose"
              />
              <StatBadge
                icon={Trophy}
                label="Nota"
                value={estatisticas.pontuacao}
                color="amber"
              />
            </div>
          </div>

          {/* Barra de progresso da revisão */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${((questaoAtual + 1) / questoesFiltradas.length) * 100}%`,
                }}
              />
            </div>
            <span className="text-sm text-slate-400 whitespace-nowrap">
              {questaoAtual + 1} / {questoesFiltradas.length}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar com filtros e navegação */}
          <div className="lg:col-span-1 space-y-4">
            {/* Seletor de simulado */}
            {simulados.length > 1 && (
              <GlassCard className="p-4">
                <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">
                  Simulado
                </label>
                <select
                  value={simuladoSelecionado.id}
                  onChange={(e) => {
                    const selected = simulados.find(
                      (s) => s.id === e.target.value,
                    );
                    if (selected) {
                      setSimuladoSelecionado(selected);
                      setQuestaoAtual(0);
                      router.push(`/revisao?id=${selected.id}`);
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500"
                >
                  {simulados.map((s) => (
                    <option key={s.id} value={s.id}>
                      {new Date(s.data).toLocaleDateString("pt-BR")} -{" "}
                      {s.estatisticas.pontuacao} pts
                    </option>
                  ))}
                </select>
              </GlassCard>
            )}

            {/* Filtros */}
            <GlassCard className="p-4">
              <button
                onClick={() => setShowFiltros(!showFiltros)}
                className="flex items-center justify-between w-full mb-3"
              >
                <span className="text-sm font-medium text-white flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filtros
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${showFiltros ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showFiltros && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    {/* Tipo */}
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        Mostrar
                      </label>
                      <select
                        value={filtros.tipo}
                        onChange={(e) => {
                          setFiltros((f) => ({
                            ...f,
                            tipo: e.target.value as FiltroRevisao,
                          }));
                          setQuestaoAtual(0);
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      >
                        <option value="todas">
                          Todas ({estatisticas.totalQuestoes})
                        </option>
                        <option value="erros">
                          Erros ({estatisticas.erros})
                        </option>
                        <option value="acertos">
                          Acertos ({estatisticas.acertos})
                        </option>
                        <option value="brancos">
                          Em branco ({estatisticas.brancos})
                        </option>
                        <option value="marcadas">
                          Marcadas ({marcadas.length})
                        </option>
                      </select>
                    </div>

                    {/* Disciplina */}
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        Disciplina
                      </label>
                      <select
                        value={filtros.disciplina}
                        onChange={(e) =>
                          setFiltros((f) => ({
                            ...f,
                            disciplina: e.target.value,
                          }))
                        }
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      >
                        <option value="todas">Todas</option>
                        {Object.entries(DISCIPLINAS_NOME).map(([key, nome]) => (
                          <option key={key} value={key}>
                            {nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Busca */}
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
                        <Search className="w-3 h-3" /> Buscar
                      </label>
                      <input
                        type="text"
                        value={filtros.busca}
                        onChange={(e) =>
                          setFiltros((f) => ({ ...f, busca: e.target.value }))
                        }
                        placeholder="Palavra-chave..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>

            {/* Grid de questões */}
            <GlassCard className="p-4">
              <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider">
                Navegação rápida
              </p>
              <div className="grid grid-cols-5 gap-2">
                {simuladoSelecionado.questoes.map((q, idx) => (
                  <MiniQuestaoDot
                    key={idx}
                    questao={q}
                    index={idx}
                    atual={idx === questaoRealIndex}
                    marcada={marcadas.includes(idx)}
                    onClick={() => {
                      const filtradaIndex = questoesFiltradas.findIndex(
                        (fq) => fq === q,
                      );
                      if (filtradaIndex !== -1) setQuestaoAtual(filtradaIndex);
                    }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Acerto
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-rose-500" /> Erro
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-600" /> Branco
                </span>
              </div>
            </GlassCard>

            {/* Ações */}
            <div className="flex gap-2">
              <button
                onClick={refazerSimulado}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Refazer
              </button>
              <button
                onClick={() => router.push("/estatisticas")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                Stats
              </button>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="lg:col-span-3 space-y-4">
            {questoesFiltradas.length === 0 ? (
              <EmptyState tipo={filtros.tipo} />
            ) : (
              <>
                {/* Questão */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={questaoAtual}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <QuestaoCard
                      questao={questao}
                      numero={questaoRealIndex + 1}
                      total={simuladoSelecionado.questoes.length}
                      onResposta={() => {}} // Desabilitado na revisão
                      mostrarCorrecao={true}
                      marcadasParaRevisao={marcadas}
                      onMarcarRevisao={() => toggleMarcacao()}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Controles */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={navegarAnterior}
                    disabled={questaoAtual === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Anterior
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMarcacao}
                      className={`p-2.5 rounded-xl transition-colors ${
                        isMarcada
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-slate-800 text-slate-400 hover:text-amber-400"
                      }`}
                      title="Marcar para revisar depois (M)"
                    >
                      <Flag
                        className={`w-5 h-5 ${isMarcada ? "fill-current" : ""}`}
                      />
                    </button>

                    <button
                      onClick={compartilharQuestao}
                      className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                      title="Copiar questão"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  {questaoAtual < questoesFiltradas.length - 1 ? (
                    <button
                      onClick={navegarProxima}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                    >
                      Próxima
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Concluir
                    </Link>
                  )}
                </div>

                {/* Dica de atalhos */}
                <p className="text-center text-xs text-slate-600">
                  Atalhos: ← → navegar • M marcar • F filtrar erros • T todas
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
