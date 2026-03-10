"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
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
      titulo: "Parabéns!",
      descricao:
        "Você não tem erros registrados. Seu desempenho está excelente!",
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
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all hover:scale-105"
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
}: {
  erro: ErroComMetadados;
  index: number;
  onRemover: (id: string) => void;
}) {
  const [expandido, setExpandido] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <GlassCard className="p-5 border-l-4 border-l-rose-500 hover:border-l-rose-400 transition-colors">
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
                {new Date(erro.ultimaData).toLocaleDateString("pt-BR")}
              </span>
            </div>

            {/* Enunciado */}
            <p
              className={`text-slate-200 text-sm leading-relaxed ${expandido ? "" : "line-clamp-2"}`}
            >
              {erro.enunciado}
            </p>

            {/* Ações */}
            <div className="flex items-center gap-4 mt-3">
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
            </div>
          </div>

          {/* Indicador de resposta */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-slate-500">Resposta</span>
            <span
              className={`px-3 py-1 rounded-lg text-sm font-bold ${erro.resposta === "CERTO" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}
            >
              {erro.resposta === "CERTO" ? "CERTO" : "ERRADO"}
            </span>
          </div>
        </div>
      </GlassCard>
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

  // CORREÇÃO: Carregamento com tratamento de erro e parsing seguro
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

        // CORREÇÃO: Map agora acumula metadados (contagem de erros, última data)
        const errosMap = new Map<string, ErroComMetadados>();

        historico.forEach((simulado) => {
          const dataSimulado = simulado.data;

          simulado.questoes.forEach((q) => {
            // CORREÇÃO: Verifica se errou (inclui questões não respondidas como erro se configurado)
            const errou = q.respostaUsuario && q.respostaUsuario !== q.resposta;

            if (errou) {
              const existente = errosMap.get(q.id);

              if (existente) {
                // Atualiza metadados se já existe
                errosMap.set(q.id, {
                  ...existente,
                  vezesErrada: existente.vezesErrada + 1,
                  ultimaData:
                    dataSimulado > existente.ultimaData
                      ? dataSimulado
                      : existente.ultimaData,
                });
              } else {
                // Cria novo registro
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

        // Ordena por: mais vezes errada primeiro, depois por data mais recente
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
        // CORREÇÃO: Estado de erro poderia ser adicionado aqui
      } finally {
        setCarregando(false);
      }
    };

    carregarErros();
  }, []);

  // Filtragem memoizada
  const errosFiltrados = useMemo(() => {
    return erros.filter((erro) => {
      const matchBusca =
        erro.enunciado.toLowerCase().includes(busca.toLowerCase()) ||
        erro.disciplinaFormatada.toLowerCase().includes(busca.toLowerCase());
      const matchDisciplina =
        filtroDisciplina === "todas" || erro.disciplina === filtroDisciplina;
      return matchBusca && matchDisciplina;
    });
  }, [erros, busca, filtroDisciplina]);

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
        "Tem certeza que deseja limpar TODO o histórico de simulados?\n\nIsso apagará todos os dados de desempenho e estatísticas.",
      )
    ) {
      localStorage.removeItem("prf_historico");
      setErros([]);
      setTotalSimulados(0);
    }
  };

  const removerErroIndividual = (id: string) => {
    // CORREÇÃO: Remove apenas da visualização, não do histórico original
    // Para persistência real, seria necessário reescrever o histórico filtrando a questão específica
    setErros((prev) => prev.filter((e) => e.id !== id));
  };

  const iniciarTreinoErros = () => {
    if (errosFiltrados.length === 0) return;

    // Seleciona até 30 erros, priorizando os mais recentes e mais vezes errados
    const selecionadas = errosFiltrados
      .slice(0, 30)
      .map((q) => ({ ...q, respostaUsuario: undefined }));

    localStorage.setItem(
      "prf_treino_atual",
      JSON.stringify({
        disciplina: "REVISÃO DE ERROS",
        questoes: selecionadas,
        mostrarExplicacao: true,
        modo: "ERROS",
        totalErrosDisponiveis: erros.length,
      }),
    );

    router.push("/treino/simulado");
  };

  // Loading state
  if (carregando) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
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
          <p className="text-slate-400">Analisando erros...</p>
        </motion.div>
      </div>
    );
  }

  // Empty states
  if (totalSimulados === 0) return <EmptyState tipo="sem-simulados" />;
  if (erros.length === 0) return <EmptyState tipo="sem-erros" />;

  return (
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
        {/* Card de Ação Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6" glow="pink">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-slate-400 text-sm mb-1">
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
                </div>
              </div>

              <button
                onClick={iniciarTreinoErros}
                disabled={errosFiltrados.length === 0}
                className="flex items-center gap-2 px-8 py-4 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-rose-500/25 disabled:shadow-none disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                Treinar{" "}
                {errosFiltrados.length > 30 ? "30" : errosFiltrados.length}{" "}
                Erros
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
            className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="todas">Todas as disciplinas</option>
            {statsPorDisciplina.map(({ disciplina, nome }) => (
              <option key={disciplina} value={disciplina}>
                {nome} (
                {erros.filter((e) => e.disciplina === disciplina).length})
              </option>
            ))}
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
            {statsPorDisciplina
              .slice(0, 5)
              .map(({ disciplina, count, nome }) => (
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
          </motion.div>
        )}

        {/* Lista de Erros */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
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
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer info */}
        {errosFiltrados.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-slate-600 pt-8"
          >
            Mostrando {errosFiltrados.length} de {erros.length} erros únicos
            {errosFiltrados.length > 30 &&
              " • Treino limitado a 30 questões por sessão"}
          </motion.p>
        )}
      </main>
    </div>
  );
}
