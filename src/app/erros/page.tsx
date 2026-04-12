"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Flame,
  Play,
  RotateCcw,
  Search,
  Trash2,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";

import { GlassCard } from "@/components/ui/GlassCard";
import { HistoricoSimulado, Questao } from "@/data/types";

// ═══════════════════════════════════════════════════════════
// TIPOS E CONSTANTES
// ═══════════════════════════════════════════════════════════

interface ErroComMetadados extends Questao {
  vezesErrada: number;
  ultimaData: string;
  disciplinaFormatada: string;
}

interface EstatisticasAvancadas {
  totalErrosContabilizados: number;
  taxaAcertoMedia: number;
  mediaErrosPorQuestao: number;
  disciplinaMaisDificil: string;
  disciplinaMaisDificilCount: number;
  diaComMaisErros: string;
  progressoRevisao: number;
}

type OrdenacaoType = "vezes" | "data" | "disciplina" | "recentes";

const DISCIPLINAS_NOME: Record<string, string> = {
  PORTUGUES: "Língua Portuguesa",
  ETICA: "Ética e Conduta",
  RACIOCINIO_LOGICO: "Raciocínio Lógico",
  DIREITO_CONSTITUCIONAL: "Direito Constitucional",
  DIREITO_ADMINISTRATIVO: "Direito Administrativo",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Legislação PRF",
};

const DISCIPLINAS_COR: Record<string, string> = {
  PORTUGUES: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ETICA: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  RACIOCINIO_LOGICO: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  DIREITO_CONSTITUCIONAL: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  DIREITO_ADMINISTRATIVO:
    "bg-orange-500/20 text-orange-400 border-orange-500/30",
  ADMINISTRACAO: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  ARQUIVOLOGIA: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  INFORMATICA: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  LEGISLACAO_PRF: "bg-red-500/20 text-red-400 border-red-500/30",
};

// ═══════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════

function EmptyState({ tipo }: { tipo: "sem-simulados" | "sem-erros" }) {
  const configs = {
    "sem-simulados": {
      icon: AlertCircle,
      titulo: "Nenhum simulado encontrado",
      descricao:
        "Faça pelo menos um simulado completo para gerar um histórico de erros.",
      acao: { href: "/simulado", label: "Iniciar Simulado", icon: Play },
    },
    "sem-erros": {
      icon: CheckCircle2,
      titulo: "Parabéns! 🎉",
      descricao:
        "Você não tem erros registrados. Seu desempenho está excelente! Continue assim.",
      acao: {
        href: "/estatisticas",
        label: "Ver Estatísticas",
        icon: TrendingUp,
      },
    },
  };

  const config = configs[tipo];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] p-6"
    >
      <GlassCard className="p-12 text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <config.icon className="w-20 h-20 text-slate-500 mx-auto mb-6" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-3">{config.titulo}</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          {config.descricao}
        </p>
        <Link
          href={config.acao.href}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
        >
          <config.acao.icon className="w-5 h-5" />
          {config.acao.label}
        </Link>
      </GlassCard>
    </motion.div>
  );
}

function CardErro({
  erro,
  index,
  onRemover,
  revisados,
  onToggleRevisado,
}: {
  erro: ErroComMetadados;
  index: number;
  onRemover: (id: string) => void;
  revisados: string[];
  onToggleRevisado: (id: string) => void;
}) {
  const [expandido, setExpandido] = useState(false);
  const isRevisado = revisados.includes(erro.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <GlassCard
        className={`p-5 border-l-4 transition-all duration-300 ${
          isRevisado
            ? "border-l-emerald-500 bg-emerald-500/5"
            : "border-l-rose-500 hover:border-l-rose-400"
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${DISCIPLINAS_COR[erro.disciplina] || "bg-slate-700 text-slate-300"}`}
              >
                {erro.disciplinaFormatada}
              </span>
              {erro.vezesErrada > 1 && (
                <span className="flex items-center gap-1 text-xs text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full">
                  <RotateCcw className="w-3 h-3" />
                  Errou {erro.vezesErrada}x
                </span>
              )}
              <span className="text-xs text-slate-500 ml-auto">
                {new Date(erro.ultimaData).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Enunciado */}
            <p
              className={`text-slate-200 text-sm leading-relaxed ${expandido ? "" : "line-clamp-2"}`}
            >
              {erro.enunciado}
            </p>

            {/* Ações */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <button
                onClick={() => setExpandido(!expandido)}
                className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
              >
                {expandido ? "Ver menos" : "Ver completo"}
              </button>
              <button
                onClick={() => onRemover(erro.id)}
                className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Remover da lista
              </button>
              <button
                onClick={() => onToggleRevisado(erro.id)}
                className={`text-xs transition-colors flex items-center gap-1 ${
                  isRevisado
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-slate-500 hover:text-blue-400"
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {isRevisado ? "Revisado" : "Marcar como revisado"}
              </button>
            </div>
          </div>

          {/* Indicador de resposta */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-slate-500">Resposta</span>
            <span
              className={`px-3 py-1 rounded-lg text-sm font-bold ${
                erro.resposta === "CERTO"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {erro.resposta === "CERTO" ? "CERTO" : "ERRADO"}
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function EstatisticasAvancadas({
  erros,
  totalSimulados,
  revisados,
}: {
  erros: ErroComMetadados[];
  totalSimulados: number;
  revisados: string[];
}) {
  const stats = useMemo(() => {
    const totalErrosContabilizados = erros.reduce(
      (acc, e) => acc + e.vezesErrada,
      0,
    );
    const totalQuestoes = totalSimulados * 60;
    const taxaAcertoMedia =
      totalQuestoes > 0
        ? ((totalQuestoes - totalErrosContabilizados) / totalQuestoes) * 100
        : 0;

    const mediaErrosPorQuestao =
      erros.length > 0 ? totalErrosContabilizados / erros.length : 0;

    // Disciplina mais difícil
    const disciplinaCount = new Map<string, number>();
    erros.forEach((e) => {
      disciplinaCount.set(
        e.disciplina,
        (disciplinaCount.get(e.disciplina) || 0) + 1,
      );
    });
    let disciplinaMaisDificil = "";
    let disciplinaMaisDificilCount = 0;
    disciplinaCount.forEach((count, disc) => {
      if (count > disciplinaMaisDificilCount) {
        disciplinaMaisDificilCount = count;
        disciplinaMaisDificil = disc;
      }
    });

    // Dia com mais erros
    const diaCount = new Map<string, number>();
    erros.forEach((e) => {
      const dia = new Date(e.ultimaData).toLocaleDateString("pt-BR");
      diaCount.set(dia, (diaCount.get(dia) || 0) + 1);
    });
    let diaComMaisErros = "";
    let maxErrosDia = 0;
    diaCount.forEach((count, dia) => {
      if (count > maxErrosDia) {
        maxErrosDia = count;
        diaComMaisErros = dia;
      }
    });

    const progressoRevisao =
      erros.length > 0 ? (revisados.length / erros.length) * 100 : 0;

    return {
      totalErrosContabilizados,
      taxaAcertoMedia,
      mediaErrosPorQuestao,
      disciplinaMaisDificil,
      disciplinaMaisDificilCount,
      diaComMaisErros,
      progressoRevisao,
    };
  }, [erros, totalSimulados, revisados]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
    >
      <div className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/20">
        <div className="text-2xl font-bold text-rose-400">
          {stats.totalErrosContabilizados}
        </div>
        <div className="text-xs text-slate-400 mt-1">Total de erros</div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
        <div className="text-2xl font-bold text-emerald-400">
          {stats.taxaAcertoMedia.toFixed(1)}%
        </div>
        <div className="text-xs text-slate-400 mt-1">Taxa de acerto</div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
        <div className="text-2xl font-bold text-amber-400">
          {stats.mediaErrosPorQuestao.toFixed(1)}x
        </div>
        <div className="text-xs text-slate-400 mt-1">Média por questão</div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
        <div className="text-2xl font-bold text-blue-400">
          {stats.progressoRevisao.toFixed(0)}%
        </div>
        <div className="text-xs text-slate-400 mt-1">Progresso de revisão</div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function ErrosPage() {
  const router = useRouter();
  const [erros, setErros] = useState<ErroComMetadados[]>([]);
  const [totalSimulados, setTotalSimulados] = useState(0);
  const [busca, setBusca] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>("todas");
  const [carregando, setCarregando] = useState(true);
  const [ordenacao, setOrdenacao] = useState<OrdenacaoType>("vezes");
  const [revisados, setRevisados] = useState<string[]>([]);

  // Carregar dados
  useEffect(() => {
    const carregarErros = () => {
      try {
        const dados = localStorage.getItem("prf_historico");
        if (!dados) {
          setCarregando(false);
          return;
        }

        const historico: HistoricoSimulado[] = JSON.parse(dados);
        setTotalSimulados(historico.length);

        const errosMap = new Map<string, ErroComMetadados>();

        historico.forEach((simulado) => {
          const dataSimulado = simulado.data;

          simulado.questoes.forEach((q) => {
            const errou = q.respostaUsuario && q.respostaUsuario !== q.resposta;

            if (errou) {
              const existente = errosMap.get(q.id);

              if (existente) {
                errosMap.set(q.id, {
                  ...existente,
                  vezesErrada: existente.vezesErrada + 1,
                  ultimaData:
                    dataSimulado > existente.ultimaData
                      ? dataSimulado
                      : existente.ultimaData,
                });
              } else {
                errosMap.set(q.id, {
                  ...q,
                  vezesErrada: 1,
                  ultimaData: dataSimulado,
                  disciplinaFormatada:
                    DISCIPLINAS_NOME[q.disciplina] ||
                    q.disciplina.replace(/_/g, " "),
                });
              }
            }
          });
        });

        const errosOrdenados = Array.from(errosMap.values()).sort((a, b) => {
          if (b.vezesErrada !== a.vezesErrada)
            return b.vezesErrada - a.vezesErrada;
          return (
            new Date(b.ultimaData).getTime() - new Date(a.ultimaData).getTime()
          );
        });

        setErros(errosOrdenados);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        toast.error("Erro ao carregar histórico. Tente recarregar a página.");
      } finally {
        setCarregando(false);
      }
    };

    const carregarRevisados = () => {
      const salvos = localStorage.getItem("prf_erros_revisados");
      if (salvos) {
        try {
          setRevisados(JSON.parse(salvos));
        } catch (error) {
          console.error("Erro ao carregar revisados:", error);
        }
      }
    };

    carregarErros();
    carregarRevisados();
  }, []);

  // Filtragem e ordenação
  const errosFiltrados = useMemo(() => {
    let filtrados = erros.filter((erro) => {
      const matchBusca =
        erro.enunciado.toLowerCase().includes(busca.toLowerCase()) ||
        erro.disciplinaFormatada.toLowerCase().includes(busca.toLowerCase());
      const matchDisciplina =
        filtroDisciplina === "todas" || erro.disciplina === filtroDisciplina;
      return matchBusca && matchDisciplina;
    });

    switch (ordenacao) {
      case "vezes":
        filtrados.sort((a, b) => b.vezesErrada - a.vezesErrada);
        break;
      case "data":
        filtrados.sort(
          (a, b) =>
            new Date(b.ultimaData).getTime() - new Date(a.ultimaData).getTime(),
        );
        break;
      case "disciplina":
        filtrados.sort((a, b) => a.disciplina.localeCompare(b.disciplina));
        break;
      case "recentes":
        filtrados.sort(
          (a, b) =>
            new Date(a.ultimaData).getTime() - new Date(b.ultimaData).getTime(),
        );
        break;
    }

    return filtrados;
  }, [erros, busca, filtroDisciplina, ordenacao]);

  // Estatísticas por disciplina
  const statsPorDisciplina = useMemo(() => {
    const stats = new Map<string, number>();
    erros.forEach((e) => {
      stats.set(e.disciplina, (stats.get(e.disciplina) || 0) + 1);
    });
    return Array.from(stats.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([disc, count]) => ({
        disciplina: disc,
        count,
        nome: DISCIPLINAS_NOME[disc],
      }));
  }, [erros]);

  // Handlers
  const limparErros = () => {
    if (
      confirm(
        "⚠️ ATENÇÃO: Isso apagará TODOS os seus simulados e estatísticas.\n\n" +
          "Recomendamos exportar seus dados antes (botão Exportar).\n\n" +
          "Deseja continuar?",
      )
    ) {
      const backup = localStorage.getItem("prf_historico");
      if (backup) {
        localStorage.setItem("prf_backup_automatico", backup);
      }

      localStorage.removeItem("prf_historico");
      localStorage.removeItem("prf_erros_revisados");
      setErros([]);
      setTotalSimulados(0);
      setRevisados([]);
      toast.success("Histórico limpo com sucesso! Backup automático salvo.");
    }
  };

  const removerErroIndividual = (id: string) => {
    try {
      const dados = localStorage.getItem("prf_historico");
      if (!dados) return;

      const historico: HistoricoSimulado[] = JSON.parse(dados);

      const novoHistorico = historico
        .map((simulado) => ({
          ...simulado,
          questoes: simulado.questoes.filter((q) => q.id !== id),
        }))
        .filter((simulado) => simulado.questoes.length > 0);

      localStorage.setItem("prf_historico", JSON.stringify(novoHistorico));

      setErros((prev) => prev.filter((e) => e.id !== id));

      toast.success("Questão removida do banco de erros");
    } catch (error) {
      console.error("Erro ao remover questão:", error);
      toast.error("Erro ao remover. Tente novamente.");
    }
  };

  const marcarComoRevisado = (id: string) => {
    let novosRevisados;
    if (revisados.includes(id)) {
      novosRevisados = revisados.filter((r) => r !== id);
      toast.info("Questão removida da lista de revisados");
    } else {
      novosRevisados = [...revisados, id];
      toast.success("Questão marcada como revisada! 🎯");
    }
    setRevisados(novosRevisados);
    localStorage.setItem("prf_erros_revisados", JSON.stringify(novosRevisados));
  };

  const iniciarTreinoErros = () => {
    if (errosFiltrados.length === 0) {
      toast.error("Nenhum erro para treinar com os filtros atuais");
      return;
    }

    const selecionadas = [...errosFiltrados]
      .sort((a, b) => {
        if (b.vezesErrada !== a.vezesErrada)
          return b.vezesErrada - a.vezesErrada;
        return (
          new Date(b.ultimaData).getTime() - new Date(a.ultimaData).getTime()
        );
      })
      .slice(0, 30)
      .map(({ id, disciplina, enunciado, resposta, explicacao }) => ({
        id,
        disciplina,
        enunciado,
        resposta,
        explicacao,
        respostaUsuario: undefined,
      }));

    localStorage.setItem(
      "prf_treino_atual",
      JSON.stringify({
        disciplina: "REVISÃO DE ERROS",
        questoes: selecionadas,
        mostrarExplicacao: true,
        modo: "ERROS",
        totalErrosDisponiveis: erros.length,
        meta: {
          tipo: "revisao_erros",
          prioridade: "mais_errados",
        },
      }),
    );

    toast.success(
      `Preparando treino com ${selecionadas.length} questões prioritárias!`,
    );
    router.push("/treino/simulado");
  };

  const exportarErros = () => {
    const data = {
      exportadoEm: new Date().toISOString(),
      versao: "1.0",
      totalSimulados,
      totalErrosUnicos: erros.length,
      totalErrosContabilizados: erros.reduce(
        (acc, e) => acc + e.vezesErrada,
        0,
      ),
      erros: erros.map(
        ({
          id,
          disciplina,
          disciplinaFormatada,
          enunciado,
          resposta,
          vezesErrada,
          ultimaData,
        }) => ({
          id,
          disciplina,
          disciplinaFormatada,
          enunciado,
          resposta,
          vezesErrada,
          ultimaData,
        }),
      ),
      revisados,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prf_banco_erros_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Banco de erros exportado com sucesso!");
  };

  // Loading state
  if (carregando) {
    return (
      <>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#f1f5f9",
            },
          }}
        />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-xl border-2 border-rose-500 border-t-transparent"
            />
            <p className="text-slate-400">Analisando seus erros...</p>
          </motion.div>
        </div>
      </>
    );
  }

  // Empty states
  if (totalSimulados === 0)
    return (
      <>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#f1f5f9",
            },
          }}
        />
        <EmptyState tipo="sem-simulados" />
      </>
    );
  if (erros.length === 0)
    return (
      <>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "#1e293b",
              border: "1px solid #334155",
              color: "#f1f5f9",
            },
          }}
        />
        <EmptyState tipo="sem-erros" />
      </>
    );

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "#1e293b",
            border: "1px solid #334155",
            color: "#f1f5f9",
          },
          duration: 3000,
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pb-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <XCircle className="w-6 h-6 text-rose-500" />
                    Banco de Erros
                  </h1>
                  <p className="text-sm text-slate-400">
                    {erros.length} questões únicas para revisar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportarErros}
                  className="flex items-center gap-2 px-4 py-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Exportar</span>
                </button>
                <button
                  onClick={limparErros}
                  className="flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Limpar Histórico</span>
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Estatísticas Avançadas */}
          <EstatisticasAvancadas
            erros={erros}
            totalSimulados={totalSimulados}
            revisados={revisados}
          />

          {/* Card de Ação Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6" glow="pink">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Baseado em {totalSimulados} simulados realizados
                  </p>
                  <p className="text-3xl font-bold text-white mb-2">
                    {erros.length}{" "}
                    <span className="text-lg text-slate-400 font-normal">
                      questões para revisar
                    </span>
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Último erro:{" "}
                      {erros[0]
                        ? new Date(erros[0].ultimaData).toLocaleDateString(
                            "pt-BR",
                          )
                        : "-"}
                    </span>
                    {revisados.length > 0 && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        {revisados.length} revisadas
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={iniciarTreinoErros}
                  disabled={errosFiltrados.length === 0}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-rose-500/25 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5" />
                  Treinar{" "}
                  {errosFiltrados.length > 30
                    ? "30"
                    : errosFiltrados.length}{" "}
                  Erros
                </button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Filtros e Ordenação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar em enunciados ou disciplinas..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select
              value={filtroDisciplina}
              onChange={(e) => setFiltroDisciplina(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="todas">Todas as disciplinas</option>
              {statsPorDisciplina.map(({ disciplina, nome }) => (
                <option key={disciplina} value={disciplina}>
                  {nome} (
                  {erros.filter((e) => e.disciplina === disciplina).length})
                </option>
              ))}
            </select>

            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as OrdenacaoType)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="vezes">Ordenar por: Mais erradas</option>
              <option value="data">Ordenar por: Mais recentes</option>
              <option value="recentes">Ordenar por: Mais antigas</option>
              <option value="disciplina">Ordenar por: Disciplina</option>
            </select>
          </motion.div>

          {/* Resumo por Disciplina */}
          {statsPorDisciplina.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {statsPorDisciplina.map(({ disciplina, count, nome }) => (
                <button
                  key={disciplina}
                  onClick={() =>
                    setFiltroDisciplina(
                      filtroDisciplina === disciplina ? "todas" : disciplina,
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                  ${
                    filtroDisciplina === disciplina
                      ? DISCIPLINAS_COR[disciplina]
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  {nome}: {count}
                </button>
              ))}
              {errosFiltrados.length !== erros.length && (
                <button
                  onClick={() => {
                    setBusca("");
                    setFiltroDisciplina("todas");
                    setOrdenacao("vezes");
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border bg-slate-800 text-blue-400 border-blue-500/30 hover:bg-blue-500/10 transition-all"
                >
                  <Filter className="w-3 h-3 inline mr-1" />
                  Limpar filtros
                </button>
              )}
            </motion.div>
          )}

          {/* Lista de Erros */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {errosFiltrados.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 text-slate-500"
                >
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum erro encontrado com os filtros atuais.</p>
                  <button
                    onClick={() => {
                      setBusca("");
                      setFiltroDisciplina("todas");
                      setOrdenacao("vezes");
                    }}
                    className="mt-2 text-blue-400 hover:underline text-sm"
                  >
                    Limpar filtros
                  </button>
                </motion.div>
              ) : (
                errosFiltrados.map((erro, idx) => (
                  <CardErro
                    key={erro.id}
                    erro={erro}
                    index={idx}
                    onRemover={removerErroIndividual}
                    revisados={revisados}
                    onToggleRevisado={marcarComoRevisado}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer info */}
          {errosFiltrados.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-slate-600"
            >
              <p>
                Mostrando {errosFiltrados.length} de {erros.length} erros únicos
                {errosFiltrados.length > 30 &&
                  " • Treino limitado a 30 questões por sessão"}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const naoRevisados = erros.filter(
                      (e) => !revisados.includes(e.id),
                    );
                    if (naoRevisados.length === 0) {
                      toast.info("Todos os erros já foram revisados! 🎉");
                    } else {
                      setErros(naoRevisados);
                      toast.info(`Filtrando apenas não revisados`);
                    }
                  }}
                  className="text-slate-500 hover:text-blue-400 transition-colors"
                >
                  Mostrar não revisados (
                  {erros.filter((e) => !revisados.includes(e.id)).length})
                </button>
                <button
                  onClick={() => {
                    setRevisados([]);
                    localStorage.removeItem("prf_erros_revisados");
                    toast.info("Lista de revisados resetada");
                  }}
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                >
                  Resetar revisados
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
}
