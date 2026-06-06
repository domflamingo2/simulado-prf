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
  Sparkles,
  Star,
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

// Registrar Chart.js
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

  const getQualificacaoGeral = () => {
    if (stats.taxaAproveitamento >= 80)
      return {
        texto: "Excelente!",
        cor: "text-emerald-400",
        bg: "bg-emerald-500/20",
        border: "border-emerald-500/30",
      };
    if (stats.taxaAproveitamento >= 70)
      return {
        texto: "Muito Bom!",
        cor: "text-blue-400",
        bg: "bg-blue-500/20",
        border: "border-blue-500/30",
      };
    if (stats.taxaAproveitamento >= 60)
      return {
        texto: "Bom!",
        cor: "text-cyan-400",
        bg: "bg-cyan-500/20",
        border: "border-cyan-500/30",
      };
    if (stats.taxaAproveitamento >= 50)
      return {
        texto: "Regular",
        cor: "text-amber-400",
        bg: "bg-amber-500/20",
        border: "border-amber-500/30",
      };
    return {
      texto: "Precisa Melhorar",
      cor: "text-rose-400",
      bg: "bg-rose-500/20",
      border: "border-rose-500/30",
    };
  };

  const qualificacao = getQualificacaoGeral();

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-3 border-blue-500/20 border-t-blue-500 border-r-purple-500/50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
          </div>
          <p className="text-slate-400 font-medium">
            Carregando estatísticas...
          </p>
          <p className="text-[10px] text-slate-500">
            Analisando seu desempenho
          </p>
        </div>
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
            <div className="relative mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-slate-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Sem dados disponíveis
            </h2>
            <p className="text-slate-400 mb-6">
              Complete pelo menos um simulado para visualizar seu desempenho e
              evolução.
            </p>
            <Link
              href="/simulado?modo=completo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
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
      <HeaderEstatisticas
        periodo={periodo}
        setPeriodo={setPeriodo}
        totalSimulados={stats.totalSimulados}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner de período */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">
              Mostrando dados de{" "}
              <span className="font-semibold text-blue-400">
                {textoPeriodo}
              </span>
              {historicoFiltrado.length === 0 &&
                " • Nenhum simulado neste período"}
            </span>
          </div>
          {comparacao && (
            <TendenciaBadge
              tendencia={comparacao.tendencia}
              valor={comparacao.diferencaPontos}
              percentual={comparacao.diferencaPercentual}
              size="sm"
            />
          )}
        </motion.div>

        {/* Aviso de período sem dados */}
        {historicoFiltrado.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400">
              Nenhum simulado nos {textoPeriodo}.
            </p>
            <button
              onClick={() => setPeriodo("todos")}
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Ver todo o histórico
            </button>
          </motion.div>
        )}

        {historicoFiltrado.length > 0 && (
          <>
            {/* Cards de Resumo */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Classificação geral */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className={`p-4 rounded-xl ${qualificacao.bg} border ${qualificacao.border} text-center`}
            >
              <div className="flex items-center justify-center gap-2">
                <Star className={`w-5 h-5 ${qualificacao.cor}`} />
                <span className={`text-lg font-bold ${qualificacao.cor}`}>
                  {qualificacao.texto}
                </span>
                <Sparkles className={`w-5 h-5 ${qualificacao.cor}`} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Baseado na sua taxa de aproveitamento de{" "}
                {stats.taxaAproveitamento.toFixed(1)}%
              </p>
            </motion.div>

            {/* Insights */}
            {insights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {insights.map((insight, idx) => (
                  <InsightCard
                    key={insight.id}
                    {...insight}
                    onAcao={
                      insight.acao?.includes("disciplinas")
                        ? scrollParaDisciplinas
                        : undefined
                    }
                    destaque={idx === 0}
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
                <GlassCard className="p-5 h-full" glow="purple">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                    <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                      <Target className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Desempenho por Disciplina
                    </h3>
                    <span className="ml-auto text-[10px] text-slate-500">
                      Radar
                    </span>
                  </div>
                  <div className="h-80">
                    <Radar data={dadosGraficos.radar} options={OPCOES_RADAR} />
                  </div>
                  <p className="text-[10px] text-slate-500 text-center mt-2">
                    📊 Quanto mais próximo da borda, melhor o desempenho
                  </p>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <GlassCard className="p-5 h-full" glow="purple">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                    <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                      <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Análise Adaptativa
                    </h3>
                    <span className="ml-auto text-[10px] text-slate-500">
                      IA
                    </span>
                  </div>

                  {analise ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                            Recomendação
                          </p>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {analise.recomendacoes[0]}
                        </p>
                      </div>

                      {comparacao && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/10">
                          <span className="text-sm text-slate-400">
                            vs simulado anterior:
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
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            <p className="text-sm font-semibold text-rose-400">
                              Precisam de atenção:
                            </p>
                          </div>
                          <div className="space-y-3">
                            {analise.disciplinasCriticas
                              .slice(0, 3)
                              .map((d, i) => {
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
                                    acertos={Math.round(
                                      (1 - d.taxaErro) * total,
                                    )}
                                    total={total}
                                    percentual={(1 - d.taxaErro) * 100}
                                    delay={0.8 + i * 0.05}
                                    tendencia="down"
                                  />
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                      <Brain className="w-12 h-12 mb-3 opacity-40" />
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
                <GlassCard className="p-5">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                    <div className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                      <TrendingUp className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Evolução Temporal
                    </h3>
                    <span className="ml-auto text-[10px] text-slate-500">
                      Linha
                    </span>
                  </div>
                  <div className="h-64">
                    {dadosGraficos.line.labels.length >= 2 ? (
                      <Line data={dadosGraficos.line} options={OPCOES_LINE} />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500">
                        <TrendingUp className="w-8 h-8 mb-2 opacity-30" />
                        <p className="text-sm">
                          Necessário ao menos 2 simulados
                        </p>
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
                <GlassCard className="p-5">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                    <div className="p-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-red-500">
                      <XCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Distribuição de Erros
                    </h3>
                    <span className="ml-auto text-[10px] text-slate-500">
                      Barras
                    </span>
                  </div>
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
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Consistência de Estudos
                  </h3>
                  <span className="ml-auto text-[10px] text-slate-500">
                    Últimos 30 dias
                  </span>
                </div>
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
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                    <BarChart3 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Detalhamento por Disciplina
                  </h3>
                </div>

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
                          tendencia={
                            percentual >= 70
                              ? "up"
                              : percentual >= 40
                                ? "stable"
                                : "down"
                          }
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
                href="/simulado?modo=completo"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <Zap className="w-5 h-5" />
                Novo Simulado
              </Link>
              <Link
                href="/treino"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all hover:scale-105 border border-white/10"
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

// Configurações dos gráficos
const BASE_PLUGIN_OPTIONS = {
  legend: {
    position: "top" as const,
    labels: {
      color: "rgba(255,255,255,0.8)",
      font: { size: 11 },
      usePointStyle: true,
      pointStyle: "circle",
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
      font: { size: 10 },
    },

    grid: {
      color: "rgba(255,255,255,0.05)",
    },

    border: {
      display: false,
    },
  },

  y: {
    ticks: {
      color: "rgba(255,255,255,0.5)",
      font: { size: 10 },
    },

    grid: {
      color: "rgba(255,255,255,0.05)",
    },

    border: {
      display: false,
    },

    beginAtZero: true,
  },
};

const OPCOES_LINE: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: BASE_PLUGIN_OPTIONS,
  scales: ESCALAS_CARTESIANAS,
  elements: {
    line: { tension: 0.3, borderWidth: 2 },
    point: { radius: 3, hoverRadius: 5 },
  },
};

const OPCOES_BAR: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { ...BASE_PLUGIN_OPTIONS, legend: { display: false } },
  scales: ESCALAS_CARTESIANAS,
  elements: { bar: { borderRadius: 6, borderSkipped: false as const } },
};

const OPCOES_RADAR: ChartOptions<"radar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: BASE_PLUGIN_OPTIONS,
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: {
        color: "rgba(255,255,255,0.5)",
        backdropColor: "transparent",
        stepSize: 20,
        font: { size: 9 },
      },
      grid: { color: "rgba(255,255,255,0.1)", circular: true },
      pointLabels: { color: "rgba(255,255,255,0.7)", font: { size: 10 } },
      angleLines: { color: "rgba(255,255,255,0.05)" },
    },
  },
  elements: { line: { borderWidth: 2 }, point: { radius: 3, hoverRadius: 5 } },
};
