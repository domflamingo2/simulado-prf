"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";

import { Bar, Line, Radar } from "react-chartjs-2";

import { motion, useAnimation } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Minus,
  Target,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import GlassCard from "@/components/ui/GlassCard";
import { HistoricoSimulado } from "@/data/types";
import { gerarAnaliseAdaptativa } from "@/lib/adaptativo";

// ═══════════════════════════════════════════════════════════
// REGISTRO CHART.JS
// ═══════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════
// CONSTANTES E TIPOS
// ═══════════════════════════════════════════════════════════

type Tendencia = "melhorou" | "piorou" | "estavel";
type PeriodoFiltro = "7" | "30" | "90" | "todos";

interface ComparacaoPeriodo {
  tendencia: Tendencia;
  diferencaPontos: number;
  diferencaPercentual: number;
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

const CORES_DESEMPENHO = {
  excelente: { cor: "emerald", valor: 70, hex: "#10b981" },
  bom: { cor: "blue", valor: 60, hex: "#3b82f6" },
  medio: { cor: "amber", valor: 40, hex: "#f59e0b" },
  fraco: { cor: "rose", valor: 0, hex: "#ef4444" },
} as const;

// ═══════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════

function StatCard({
  icon: Icon,
  value,
  label,
  cor,
  delay = 0,
  subtitulo,
  glow = false,
}: {
  icon: typeof CheckCircle2;
  value: string | number;
  label: string;
  cor: "emerald" | "rose" | "amber" | "blue" | "purple" | "cyan";
  delay?: number;
  subtitulo?: string;
  glow?: boolean;
}) {
  const cores = {
    emerald:
      "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20",
    rose: "from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/20",
    amber:
      "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20",
    blue: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/20",
    purple:
      "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/20",
    cyan: "from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${cores[cor]} border p-4 sm:p-6 ${glow ? "shadow-lg shadow-${cor}-500/20" : ""}`}
    >
      <div className="absolute top-0 right-0 p-3 opacity-20">
        <Icon className="w-12 h-12" />
      </div>
      <div className="relative">
        <div className="text-3xl sm:text-4xl font-bold mb-1">{value}</div>
        <div className="text-sm opacity-80">{label}</div>
        {subtitulo && (
          <div className="text-xs opacity-60 mt-1">{subtitulo}</div>
        )}
      </div>
    </motion.div>
  );
}

function DisciplinaBar({
  nome,
  acertos,
  total,
  percentual,
  delay,
}: {
  nome: string;
  acertos: number;
  total: number;
  percentual: number;
  delay: number;
}) {
  const getConfig = (pct: number) => {
    if (pct >= 70) return { cor: "bg-emerald-500", texto: "text-emerald-400" };
    if (pct >= 60) return { cor: "bg-blue-500", texto: "text-blue-400" };
    if (pct >= 40) return { cor: "bg-amber-500", texto: "text-amber-400" };
    return { cor: "bg-rose-500", texto: "text-rose-400" };
  };

  const config = getConfig(percentual);
  const erros = total - acertos;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="group"
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="text-sm text-slate-300 w-40 truncate">{nome}</span>
        <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentual}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${config.cor} relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
          </motion.div>
        </div>
        <span className={`text-sm font-bold w-16 text-right ${config.texto}`}>
          {acertos}/{total}
        </span>
      </div>
      <div className="flex justify-between text-xs text-slate-500 pl-[11.5rem]">
        <span>{percentual.toFixed(0)}% acertos</span>
        <span>{erros} erros</span>
      </div>
    </motion.div>
  );
}

function InsightCard({
  tipo,
  mensagem,
  acao,
  onAcao,
}: {
  tipo: "positivo" | "alerta" | "dica" | "info";
  mensagem: string;
  acao?: string;
  onAcao?: () => void;
}) {
  const configs = {
    positivo: {
      bg: "bg-emerald-500/10 border-emerald-500/30",
      icon: Trophy,
      text: "text-emerald-400",
    },
    alerta: {
      bg: "bg-rose-500/10 border-rose-500/30",
      icon: AlertTriangle,
      text: "text-rose-400",
    },
    dica: {
      bg: "bg-blue-500/10 border-blue-500/30",
      icon: Brain,
      text: "text-blue-400",
    },
    info: {
      bg: "bg-purple-500/10 border-purple-500/30",
      icon: Zap,
      text: "text-purple-400",
    },
  };

  const config = configs[tipo];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${config.bg} flex items-start gap-3`}
    >
      <config.icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`text-sm ${config.text}`}>{mensagem}</p>
        {acao && onAcao && (
          <button
            onClick={onAcao}
            className="mt-2 text-xs font-medium text-white hover:underline flex items-center gap-1 transition-colors"
          >
            {acao} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function TendenciaBadge({
  tendencia,
  valor,
  percentual,
}: {
  tendencia: Tendencia;
  valor: number;
  percentual?: number;
}) {
  const configs = {
    melhorou: {
      icon: TrendingUp,
      cor: "text-emerald-400",
      bg: "bg-emerald-500/20",
      prefixo: "+",
    },
    piorou: {
      icon: TrendingUp,
      cor: "text-rose-400",
      bg: "bg-rose-500/20",
      prefixo: "",
      rotacao: "rotate-180",
    },
    estavel: {
      icon: Minus,
      cor: "text-slate-400",
      bg: "bg-slate-500/20",
      prefixo: "",
    },
  };

  const config = configs[tendencia] as typeof configs.melhorou & {
    rotacao?: string;
  };

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} ${config.cor} text-xs font-medium`}
    >
      <config.icon className={`w-3.5 h-3.5 ${config.rotacao || ""}`} />
      <span>
        {config.prefixo}
        {Math.abs(valor).toFixed(1)} pts
        {percentual &&
          ` (${config.prefixo}${Math.abs(percentual).toFixed(1)}%)`}
      </span>
    </div>
  );
}

function HeatmapEstudos({ historico }: { historico: HistoricoSimulado[] }) {
  // CORREÇÃO: Normalização de timezone para evitar deslocamento de 1 dia
  const getDiaLocal = (dataISO: string) => {
    const data = new Date(dataISO);
    // Ajusta para meio-dia do dia local para evitar problemas de timezone
    return new Date(data.getFullYear(), data.getMonth(), data.getDate())
      .toISOString()
      .split("T")[0];
  };

  const hoje = new Date();
  const dias = Array.from({ length: 30 }, (_, i) => {
    const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    data.setDate(data.getDate() - (29 - i));
    return data.toISOString().split("T")[0];
  });

  const atividadesPorDia = useMemo(() => {
    const map = new Map<string, number>();
    historico.forEach((h) => {
      const dia = getDiaLocal(h.data);
      map.set(dia, (map.get(dia) || 0) + 1);
    });
    return map;
  }, [historico]);

  const getCor = (count: number) => {
    if (count === 0) return "bg-slate-800 hover:bg-slate-700";
    if (count === 1) return "bg-emerald-500/30 hover:bg-emerald-500/40";
    if (count === 2) return "bg-emerald-500/50 hover:bg-emerald-500/60";
    return "bg-emerald-500 hover:bg-emerald-400";
  };

  const getLabel = (dia: string) => {
    const data = new Date(dia + "T12:00:00"); // Força meio-dia para parse consistente
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {dias.map((dia) => {
          const count = atividadesPorDia.get(dia) || 0;
          return (
            <motion.div
              key={dia}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.random() * 0.3 }}
              title={`${getLabel(dia)}: ${count} simulado(s)`}
              className={`w-8 h-8 rounded ${getCor(count)} transition-all cursor-pointer ring-2 ring-transparent hover:ring-emerald-500/50`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>Menos</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-slate-800" />
          <div className="w-4 h-4 rounded bg-emerald-500/30" />
          <div className="w-4 h-4 rounded bg-emerald-500/50" />
          <div className="w-4 h-4 rounded bg-emerald-500" />
        </div>
        <span>Mais</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function EstatisticasPage() {
  const router = useRouter();
  const controls = useAnimation();

  const [historico, setHistorico] = useState<HistoricoSimulado[]>([]);
  const [periodo, setPeriodo] = useState<PeriodoFiltro>("todos");
  const [carregando, setCarregando] = useState(true);

  // Carrega dados com tratamento de erro
  useEffect(() => {
    const carregarDados = () => {
      try {
        const dados = localStorage.getItem("prf_historico");
        if (dados) {
          const parsed = JSON.parse(dados);
          // Validação básica de estrutura
          if (Array.isArray(parsed)) {
            setHistorico(parsed);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setCarregando(false);
        controls.start("visible");
      }
    };

    carregarDados();
  }, [controls]);

  // Filtra por período com memoização
  const historicoFiltrado = useMemo(() => {
    if (periodo === "todos") return historico;

    const dias = parseInt(periodo);
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);
    dataLimite.setHours(0, 0, 0, 0);

    return historico.filter((h) => {
      const dataSimulado = new Date(h.data);
      return dataSimulado >= dataLimite;
    });
  }, [historico, periodo]);

  // Comparação com período anterior
  const comparacao = useMemo<ComparacaoPeriodo | null>(() => {
    if (historicoFiltrado.length < 2) return null;

    const atual = historicoFiltrado[0];
    const anterior = historicoFiltrado[1];

    const diferencaPontos =
      atual.estatisticas.pontuacao - anterior.estatisticas.pontuacao;
    const diferencaPercentual =
      atual.estatisticas.percentual - anterior.estatisticas.percentual;

    let tendencia: Tendencia = "estavel";
    if (diferencaPontos > 3) tendencia = "melhorou";
    else if (diferencaPontos < -3) tendencia = "piorou";

    return {
      tendencia,
      diferencaPontos,
      diferencaPercentual,
    };
  }, [historicoFiltrado]);

  // Análise adaptativa
  const analise = useMemo(() => {
    if (historico.length === 0) return null;
    return gerarAnaliseAdaptativa(historico, []);
  }, [historico]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    if (historicoFiltrado.length === 0) {
      return {
        totalSimulados: 0,
        mediaPontuacao: 0,
        melhorPontuacao: 0,
        piorPontuacao: 0,
        totalQuestoes: 0,
        taxaAproveitamento: 0,
        tempoMedio: 0,
      };
    }

    const pontuacoes = historicoFiltrado.map((h) => h.estatisticas.pontuacao);
    const percentuais = historicoFiltrado.map((h) => h.estatisticas.percentual);
    const tempos = historicoFiltrado.map((h) => h.estatisticas.tempoTotal || 0);

    return {
      totalSimulados: historicoFiltrado.length,
      mediaPontuacao: pontuacoes.reduce((a, b) => a + b, 0) / pontuacoes.length,
      melhorPontuacao: Math.max(...pontuacoes),
      piorPontuacao: Math.min(...pontuacoes),
      totalQuestoes: historicoFiltrado.reduce(
        (acc, h) => acc + h.questoes.length,
        0,
      ),
      taxaAproveitamento:
        percentuais.reduce((a, b) => a + b, 0) / percentuais.length,
      tempoMedio: tempos.reduce((a, b) => a + b, 0) / tempos.length,
    };
  }, [historicoFiltrado]);

  // Gera insights dinâmicos
  const insights = useMemo(() => {
    if (historicoFiltrado.length === 0) return [];

    const lista: Array<{
      tipo: "positivo" | "alerta" | "dica" | "info";
      mensagem: string;
      acao?: string;
    }> = [];

    const ultimo = historicoFiltrado[0];
    const { estatisticas } = ultimo;

    // Insight de performance
    if (estatisticas.percentual >= 70) {
      lista.push({
        tipo: "positivo",
        mensagem:
          "Excelente desempenho no último simulado! Você estaria aprovado.",
      });
    } else if (estatisticas.percentual >= 60) {
      lista.push({
        tipo: "info",
        mensagem:
          "Bom desempenho! Na média de aprovação, mas há margem para evolução.",
      });
    } else {
      lista.push({
        tipo: "alerta",
        mensagem:
          "Desempenho abaixo da meta. Foque nos pontos fracos identificados abaixo.",
        acao: "Ver disciplinas",
      });
    }

    // Insight de consistência
    if (historicoFiltrado.length >= 5) {
      const variacao = stats.melhorPontuacao - stats.piorPontuacao;
      if (variacao > 15) {
        lista.push({
          tipo: "dica",
          mensagem: `Sua pontuação varia ${variacao.toFixed(0)} pontos entre simulados. Busque mais consistência.`,
        });
      } else {
        lista.push({
          tipo: "positivo",
          mensagem: "Você mantém consistência nos resultados. Continue assim!",
        });
      }
    }

    // Insight de questões em branco
    const mediaBrancos =
      historicoFiltrado.reduce((acc, h) => acc + h.estatisticas.brancos, 0) /
      historicoFiltrado.length;
    if (mediaBrancos > 3) {
      lista.push({
        tipo: "dica",
        mensagem: `Média de ${mediaBrancos.toFixed(1)} questões em branco. No CEBRASPE, chutar não piora sua nota.`,
      });
    }

    return lista;
  }, [historicoFiltrado, stats]);

  // Dados para gráficos
  const dadosGraficos = useMemo(() => {
    const disciplinas = Object.keys(DISCIPLINAS_NOME);

    // Radar: desempenho por disciplina
    const dadosRadar = disciplinas.map((disc) => {
      const questoes = historicoFiltrado.flatMap((h) =>
        h.questoes.filter((q) => q.disciplina === disc),
      );
      if (questoes.length === 0) return 0;
      const acertos = questoes.filter(
        (q) => q.respostaUsuario === q.resposta,
      ).length;
      return (acertos / questoes.length) * 100;
    });

    // Line: evolução temporal
    const ordenado = [...historicoFiltrado].reverse();

    // Bar: distribuição de erros
    const errosPorDisciplina = disciplinas.map((disc) => {
      const questoes = historicoFiltrado.flatMap((h) =>
        h.questoes.filter((q) => q.disciplina === disc),
      );
      return questoes.filter(
        (q) => q.respostaUsuario && q.respostaUsuario !== q.resposta,
      ).length;
    });

    return {
      radar: {
        labels: Object.values(DISCIPLINAS_NOME),
        datasets: [
          {
            label: "Aproveitamento (%)",
            data: dadosRadar,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(59, 130, 246, 1)",
            pointBackgroundColor: "rgba(59, 130, 246, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(59, 130, 246, 1)",
          },
        ],
      },
      line: {
        labels: ordenado.map((h) =>
          new Date(h.data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
        ),
        datasets: [
          {
            label: "Pontuação",
            data: ordenado.map((h) => h.estatisticas.pontuacao),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Acertos",
            data: ordenado.map((h) => h.estatisticas.acertos),
            borderColor: "#3b82f6",
            backgroundColor: "transparent",
            tension: 0.4,
          },
        ],
      },
      bar: {
        labels: Object.values(DISCIPLINAS_NOME),
        datasets: [
          {
            label: "Total de Erros",
            data: errosPorDisciplina,
            backgroundColor: "rgba(239, 68, 68, 0.6)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 1,
          },
        ],
      },
    };
  }, [historicoFiltrado]);

  // Opções de gráficos com tema escuro
  const opcoesComuns = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "rgba(255,255,255,0.8)", font: { size: 12 } },
        position: "top" as const,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "rgba(255,255,255,0.8)",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: { color: "rgba(255,255,255,0.5)", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: { color: "rgba(255,255,255,0.5)", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  // CORREÇÃO: Tipagem corrigida para o gráfico Radar
  const opcoesRadar = {
    ...opcoesComuns,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: "rgba(255,255,255,0.5)",
          backdropColor: "transparent",
          stepSize: 20,
        },
        grid: { color: "rgba(255,255,255,0.1)" },
        pointLabels: {
          color: "rgba(255,255,255,0.8)",
          font: { size: 11, weight: "bold" as const },
        },
      },
    },
  };

  // CORREÇÃO: Definir texto do período aqui, fora do JSX condicional
  const textoPeriodoAlerta = useMemo(() => {
    if (periodo === "todos") return "todo o período";
    return `últimos ${periodo} dias`;
  }, [periodo]);

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
            className="w-12 h-12 rounded-xl border-2 border-blue-500 border-t-transparent"
          />
          <p className="text-slate-400">Carregando estatísticas...</p>
        </motion.div>
      </div>
    );
  }

  // Empty state
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
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  Estatísticas Detalhadas
                </h1>
                <p className="text-sm text-slate-400">
                  Análise completa do seu desempenho
                </p>
              </div>
            </div>

            {/* Filtro de período */}

            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {[
                { value: "7", label: "7 dias" },
                { value: "30", label: "30 dias" },
                { value: "90", label: "3 meses" },
                { value: "todos", label: "Todo período" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriodo(p.value as PeriodoFiltro)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    ${
                      periodo === p.value
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                    }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Alerta de filtro ativo - CORREÇÃO: Usando textoPeriodoAlerta */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400"
        >
          <Calendar className="w-4 h-4" />
          <span>
            Mostrando dados dos {textoPeriodoAlerta}
            {comparacao && " • Comparado com período anterior"}
          </span>
        </motion.div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={Award}
            value={stats.mediaPontuacao.toFixed(1)}
            label="Média de Pontos"
            cor="blue"
            delay={0.1}
            subtitulo={`Melhor: ${stats.melhorPontuacao.toFixed(0)}`}
            glow
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
            subtitulo={periodo === "todos" ? "no total" : `em ${periodo} dias`}
          />
          <StatCard
            icon={Clock}
            value={`${Math.floor(stats.tempoMedio / 60)}min`}
            label="Tempo Médio"
            cor="cyan"
            delay={0.4}
            subtitulo="por simulado"
          />
        </div>

        {/* Insights Dinâmicos */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {insights.map((insight, idx) => (
              <InsightCard
                key={idx}
                {...insight}
                onAcao={
                  insight.acao
                    ? () => {
                        if (insight.acao?.includes("disciplinas")) {
                          document
                            .getElementById("desempenho-disciplinas")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    : undefined
                }
              />
            ))}
          </motion.div>
        )}

        {/* Gráfico Radar + Análise Adaptativa */}
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
                <Radar data={dadosGraficos.radar} options={opcoesRadar} />
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
                  {/* Recomendação principal */}
                  <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                    <p className="text-sm text-purple-400 font-medium mb-1">
                      Recomendação da IA:
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {analise.recomendacoes[0]}
                    </p>
                  </div>

                  {/* Comparação com anterior */}
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

                  {/* Disciplinas fracas */}
                  {analise.disciplinasCriticas.length > 0 && (
                    <div>
                      <p className="text-sm text-rose-400 font-medium mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Precisam de atenção:
                      </p>
                      <div className="space-y-2">
                        {analise.disciplinasCriticas.map((d: any) => (
                          <DisciplinaBar
                            key={d.disciplina}
                            nome={
                              DISCIPLINAS_NOME[d.disciplina] || d.disciplina
                            }
                            acertos={Math.round((1 - d.taxaErro) * d.total)}
                            total={d.total}
                            percentual={(1 - d.taxaErro) * 100}
                            delay={0.8}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                  <Brain className="w-12 h-12 mb-2 opacity-50" />
                  <p className="text-sm">
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
                <Line data={dadosGraficos.line} options={opcoesComuns} />
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
                <Bar
                  data={dadosGraficos.bar}
                  options={{
                    ...opcoesComuns,
                    plugins: {
                      ...opcoesComuns.plugins,
                      legend: { display: false },
                    },
                  }}
                />
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Heatmap de Consistência */}
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

        {/* Lista detalhada de disciplinas */}
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

            <div className="space-y-4">
              {Object.entries(
                historicoFiltrado
                  .flatMap((h) => h.questoes)
                  .reduce(
                    (acc, q) => {
                      if (!acc[q.disciplina]) {
                        acc[q.disciplina] = { acertos: 0, total: 0 };
                      }
                      acc[q.disciplina].total++;
                      if (q.respostaUsuario === q.resposta) {
                        acc[q.disciplina].acertos++;
                      }
                      return acc;
                    },
                    {} as Record<string, { acertos: number; total: number }>,
                  ),
              )
                .sort(
                  ([, a], [, b]) => b.acertos / b.total - a.acertos / a.total,
                )
                .map(([disciplina, dados], idx) => (
                  <DisciplinaBar
                    key={disciplina}
                    nome={DISCIPLINAS_NOME[disciplina] || disciplina}
                    acertos={dados.acertos}
                    total={dados.total}
                    percentual={(dados.acertos / dados.total) * 100}
                    delay={1.2 + idx * 0.05}
                  />
                ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
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
      </main>
    </div>
  );
}
