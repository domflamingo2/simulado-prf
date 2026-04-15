"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Award,
  BarChart3,
  Brain,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";
import { Bar, Line, Radar } from "react-chartjs-2";

import { GlassCard } from "@/components/ui/GlassCard";
import { DISCIPLINAS_NOME } from "@/constants/disciplinas";
import { useEstatisticasData } from "@/hooks/useEstatisticasData";
import { DisciplinaBar } from "./components/DisciplinaBar";
import { HeaderEstatisticas } from "./components/HeaderEstatisticas";
import { HeatmapEstudos } from "./components/HeatmapEstudos";
import { InsightCard } from "./components/InsightCard";
import { StatCard } from "./components/StatCard";
import { TendenciaBadge } from "./components/TendenciaBadge";

// ✅ REGISTRO DO CHART
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
);

export default function EstatisticasPage() {
  const {
    carregando,
    historico,
    historicoFiltrado,
    periodo,
    setPeriodo,
    comparacao,
    analise,
    stats,
    disciplinasDetalhadas,
    insights,
    dadosGraficos,
  } = useEstatisticasData();

  const scrollParaDisciplinas = useCallback(() => {
    document
      .getElementById("desempenho-disciplinas")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const textoPeriodo =
    periodo === "todos" ? "todo o período" : `últimos ${periodo} dias`;

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
            className="w-12 h-12 rounded-xl border-2 border-blue-500 border-t-transparent"
          />
          <p className="text-slate-400">Carregando estatísticas...</p>
        </motion.div>
      </div>
    );
  }

  if (historico.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-8 text-center max-w-md">
            <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-300 mb-2">
              Sem dados disponíveis
            </h2>
            <p className="text-slate-500 mb-6">
              Complete pelo menos um simulado para visualizar seu desempenho e
              evolução.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              Iniciar Simulado
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <HeaderEstatisticas periodo={periodo} setPeriodo={setPeriodo} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner de período */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400"
        >
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>
            Mostrando dados de {textoPeriodo}
            {historicoFiltrado.length === 0 &&
              " • Nenhum simulado neste período"}
            {comparacao && " • Com comparação ao simulado anterior"}
          </span>
        </motion.div>

        {/* Aviso de período sem dados */}
        {historicoFiltrado.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 text-slate-500"
          >
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>Nenhum simulado nos {textoPeriodo}.</p>
            <button
              onClick={() => setPeriodo("todos")}
              className="mt-2 text-blue-400 hover:underline text-sm"
            >
              Ver todo o histórico
            </button>
          </motion.div>
        )}

        {historicoFiltrado.length > 0 && (
          <>
            {/* Cards de Resumo */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard
                icon={Award}
                value={stats.mediaPontuacao.toFixed(1)}
                label="Média de Pontos"
                cor="blue"
                delay={0.1}
                subtitulo={`Melhor: ${stats.melhorPontuacao.toFixed(0)}`}
              />
              <StatCard
                icon={Target}
                value={`${stats.taxaAproveitamento.toFixed(1)}%`}
                label="Aproveitamento"
                cor="emerald"
                delay={0.2}
                subtitulo={`${stats.totalQuestoes} questões`}
              />
              <StatCard
                icon={Calendar}
                value={stats.totalSimulados}
                label="Simulados"
                cor="purple"
                delay={0.3}
                subtitulo={
                  periodo === "todos" ? "no total" : `em ${periodo} dias`
                }
              />
              <StatCard
                icon={Clock}
                value={
                  stats.tempoMedio > 0
                    ? `${Math.floor(stats.tempoMedio / 60)}min`
                    : "—"
                }
                label="Tempo Médio"
                cor="cyan"
                delay={0.4}
                subtitulo="por simulado"
              />
            </div>

            {/* Insights */}
            {insights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {insights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    {...insight}
                    onAcao={
                      insight.acao?.includes("disciplinas")
                        ? scrollParaDisciplinas
                        : undefined
                    }
                  />
                ))}
              </motion.div>
            )}

            {/* Radar + Análise Adaptativa */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <GlassCard className="p-6 h-full">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Desempenho por Disciplina
                  </h3>
                  <div className="h-80">
                    <Radar data={dadosGraficos.radar} options={OPCOES_RADAR} />
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <GlassCard className="p-6 h-full" glow="purple">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Análise Adaptativa
                  </h3>

                  {analise ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                        <p className="text-sm text-purple-400 font-medium mb-1">
                          Recomendação:
                        </p>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {analise.recomendacoes[0]}
                        </p>
                      </div>

                      {comparacao && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                          <span className="text-sm text-slate-400">
                            vs anterior:
                          </span>
                          <TendenciaBadge
                            tendencia={comparacao.tendencia}
                            valor={comparacao.diferencaPontos}
                            percentual={comparacao.diferencaPercentual}
                          />
                        </div>
                      )}

                      {analise.disciplinasCriticas?.length > 0 && (
                        <div>
                          <p className="text-sm text-rose-400 font-medium mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Precisam de atenção:
                          </p>

                          <div className="space-y-2">
                            {analise.disciplinasCriticas.map((d, i) => {
                              const total =
                                "total" in d && typeof d.total === "number"
                                  ? d.total
                                  : 10;

                              return (
                                <DisciplinaBar
                                  key={d.disciplina}
                                  nome={
                                    DISCIPLINAS_NOME[d.disciplina] ??
                                    d.disciplina
                                  }
                                  acertos={Math.round((1 - d.taxaErro) * total)}
                                  total={total}
                                  percentual={(1 - d.taxaErro) * 100}
                                  delay={0.8 + i * 0.05}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                      <Brain className="w-12 h-12 mb-2 opacity-50" />
                      <p className="text-sm text-center">
                        Complete mais simulados para gerar análises
                      </p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </div>

            {/* Gráficos de Evolução */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Evolução Temporal
                  </h3>
                  <div className="h-64">
                    {dadosGraficos.line.labels.length >= 2 ? (
                      <Line data={dadosGraficos.line} options={OPCOES_LINE} />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                        Necessário ao menos 2 simulados para exibir evolução
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-400" />
                    Distribuição de Erros
                  </h3>
                  <div className="h-64">
                    <Bar data={dadosGraficos.bar} options={OPCOES_BAR} />
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Consistência de Estudos (Últimos 30 dias)
                </h3>
                <HeatmapEstudos historico={historico} />
              </GlassCard>
            </motion.div>

            {/* Detalhamento por disciplina */}
            <motion.div
              id="desempenho-disciplinas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Detalhamento por Disciplina
                </h3>

                {disciplinasDetalhadas.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-8">
                    Nenhuma questão registrada no período selecionado.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {disciplinasDetalhadas.map(
                      (
                        { disciplina, nome, acertos, total, percentual },
                        idx,
                      ) => (
                        <DisciplinaBar
                          key={disciplina}
                          nome={nome}
                          acertos={acertos}
                          total={total}
                          percentual={percentual}
                          delay={Math.min(1.2 + idx * 0.05, 1.7)}
                        />
                      ),
                    )}
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* CTA Final */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link
                href="/simulado"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <Zap className="w-5 h-5" />
                Novo Simulado
              </Link>
              <Link
                href="/treino"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all hover:scale-105"
              >
                <Brain className="w-5 h-5" />
                Modo Treino
              </Link>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}

//
// 🔥 CONFIGURAÇÕES CORRIGIDAS
//

const BASE_PLUGIN_OPTIONS = {
  legend: {
    position: "top" as const,
    labels: {
      color: "rgba(255,255,255,0.8)",
      font: {
        size: 12,
      },
    },
  },
  tooltip: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    titleColor: "#fff",
    bodyColor: "rgba(255,255,255,0.8)",
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    padding: 12,
    cornerRadius: 8,
  },
} as const;

const ESCALAS_CARTESIANAS: ChartOptions<"line">["scales"] = {
  x: {
    ticks: {
      color: "rgba(255,255,255,0.5)",
      font: { size: 11 },
    },
    grid: { color: "rgba(255,255,255,0.05)" },
  },
  y: {
    ticks: {
      color: "rgba(255,255,255,0.5)",
      font: { size: 11 },
    },
    grid: { color: "rgba(255,255,255,0.05)" },
  },
};

const OPCOES_LINE: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: BASE_PLUGIN_OPTIONS as any,
  scales: ESCALAS_CARTESIANAS,
};

const OPCOES_BAR: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    ...(BASE_PLUGIN_OPTIONS as any),
    legend: { display: false },
  },
  scales: ESCALAS_CARTESIANAS,
};

const OPCOES_RADAR: ChartOptions<"radar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: BASE_PLUGIN_OPTIONS as any,
  scales: {
    r: {
      type: "radialLinear",
      beginAtZero: true,
      max: 100,
      ticks: {
        color: "rgba(255,255,255,0.5)",
        backdropColor: "transparent",
        stepSize: 20,
      },
      grid: {
        color: "rgba(255,255,255,0.1)",
      },
      pointLabels: {
        color: "rgba(255,255,255,0.8)",
        font: {
          size: 11,
          weight: "bold",
        },
      },
    },
  },
};
