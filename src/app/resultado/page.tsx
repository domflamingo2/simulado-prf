"use client";

import { motion, useAnimation } from "framer-motion";
import html2canvas from "html2canvas";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  HelpCircle,
  Minus,
  RotateCcw,
  Share2,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import GlassCard from "@/components/ui/GlassCard";
import { HistoricoSimulado } from "@/data/types";
import {
  classificarDesempenho,
  formatarTempoLegivel,
} from "@/lib/simulado-logic";

// ═══════════════════════════════════════════════════════════
// TIPOS E CONSTANTES
// ═══════════════════════════════════════════════════════════

type Tendencia = "melhorou" | "piorou" | "estavel";

interface ComparacaoAnterior {
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

// ═══════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════

function StatCard({
  icon: Icon,
  value,
  label,
  color,
  delay = 0,
}: {
  icon: typeof CheckCircle2;
  value: string | number;
  label: string;
  color: "emerald" | "rose" | "amber" | "blue" | "purple";
  delay?: number;
}) {
  const colors = {
    emerald: "from-emerald-500/20 to-emerald-600/10 text-emerald-400",
    rose: "from-rose-500/20 to-rose-600/10 text-rose-400",
    amber: "from-amber-500/20 to-amber-600/10 text-amber-400",
    blue: "from-blue-500/20 to-blue-600/10 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/10 text-purple-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colors[color]} border border-white/10 p-4 sm:p-6`}
    >
      <div className="absolute top-0 right-0 p-3 opacity-20">
        <Icon className="w-12 h-12" />
      </div>
      <div className="relative">
        <div className="text-3xl sm:text-4xl font-bold mb-1">{value}</div>
        <div className="text-sm opacity-80">{label}</div>
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
  const getColor = (pct: number) => {
    if (pct >= 70) return "bg-emerald-500";
    if (pct >= 60) return "bg-amber-500";
    if (pct >= 40) return "bg-orange-500";
    return "bg-rose-500";
  };

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
            className={`h-full rounded-full ${getColor(percentual)} relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
          </motion.div>
        </div>
        <span className="text-sm font-bold w-16 text-right text-slate-400">
          {acertos}/{total}
        </span>
      </div>
      <div className="flex justify-between text-xs text-slate-500 pl-[11.5rem]">
        <span>{percentual.toFixed(0)}% acertos</span>
        <span>{total - acertos} erros</span>
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
  tipo: "positivo" | "alerta" | "dica";
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
  };

  const config = configs[tipo];

  return (
    <div
      className={`p-4 rounded-xl border ${config.bg} flex items-start gap-3`}
    >
      <config.icon className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`text-sm ${config.text}`}>{mensagem}</p>
        {acao && onAcao && (
          <button
            onClick={onAcao}
            className="mt-2 text-xs font-medium text-white hover:underline flex items-center gap-1"
          >
            {acao} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function TendenciaBadge({
  tendencia,
  valor,
}: {
  tendencia: Tendencia;
  valor: number;
}) {
  const configs = {
    melhorou: {
      icon: ArrowUpRight,
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
    },
    piorou: {
      icon: ArrowDownRight,
      color: "text-rose-400",
      bg: "bg-rose-500/20",
    },
    estavel: { icon: Minus, color: "text-slate-400", bg: "bg-slate-500/20" },
  };

  const config = configs[tendencia];

  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full ${config.bg} ${config.color} text-xs font-medium`}
    >
      <config.icon className="w-3 h-3" />
      {tendencia === "melhorou" && "+"}
      {tendencia === "piorou" && "-"}
      {Math.abs(valor).toFixed(1)} pts
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function ResultadoPage() {
  const router = useRouter();
  const resultadoRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const [simulado, setSimulado] = useState<HistoricoSimulado | null>(null);
  const [historico, setHistorico] = useState<HistoricoSimulado[]>([]);
  const [comparacao, setComparacao] = useState<ComparacaoAnterior | null>(null);
  const [gerandoImagem, setGerandoImagem] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Carrega dados
  useEffect(() => {
    const dados = localStorage.getItem("prf_ultimo_simulado");
    const historicoDados = localStorage.getItem("prf_historico");

    if (!dados) {
      router.push("/");
      return;
    }

    const simuladoAtual: HistoricoSimulado = JSON.parse(dados);
    const historicoLista: HistoricoSimulado[] = historicoDados
      ? JSON.parse(historicoDados)
      : [];

    setSimulado(simuladoAtual);
    setHistorico(historicoLista);

    // Compara com anterior (se existir)
    if (historicoLista.length > 1) {
      const anterior = historicoLista[1]; // Índice 0 é o atual, 1 é o anterior
      const diferenca =
        simuladoAtual.estatisticas.pontuacao - anterior.estatisticas.pontuacao;
      const diferencaPct =
        simuladoAtual.estatisticas.percentual -
        anterior.estatisticas.percentual;

      let tendencia: Tendencia = "estavel";
      if (diferenca > 3) tendencia = "melhorou";
      else if (diferenca < -3) tendencia = "piorou";

      setComparacao({
        tendencia,
        diferencaPontos: diferenca,
        diferencaPercentual: diferencaPct,
      });
    }

    // Confetti para bom desempenho
    if (simuladoAtual.estatisticas.percentual >= 60) {
      setTimeout(() => setShowConfetti(true), 500);
      setTimeout(() => setShowConfetti(false), 4000);
    }

    // Animação de entrada
    controls.start("visible");
  }, [router, controls]);

  // Gera insights baseado no desempenho
  const insights = useMemo(() => {
    if (!simulado) return [];

    const { estatisticas } = simulado;
    const lista: Array<{
      tipo: "positivo" | "alerta" | "dica";
      mensagem: string;
      acao?: string;
    }> = [];

    // Insight 1: Performance geral
    if (estatisticas.percentual >= 70) {
      lista.push({
        tipo: "positivo",
        mensagem:
          "Excelente desempenho! Você estaria aprovado no concurso real.",
        acao: "Ver ranking",
      });
    } else if (estatisticas.percentual >= 60) {
      lista.push({
        tipo: "positivo",
        mensagem:
          "Bom desempenho! Na média de aprovação, mas ainda dá para melhorar.",
        acao: "Ver pontos fracos",
      });
    } else {
      lista.push({
        tipo: "alerta",
        mensagem:
          "Desempenho abaixo da média. Foque nos pontos fracos identificados.",
        acao: "Ver análise completa",
      });
    }

    // Insight 2: Questões em branco
    if (estatisticas.brancos > 5) {
      lista.push({
        tipo: "dica",
        mensagem: `Você deixou ${estatisticas.brancos} questões em branco. No CEBRASPE, chutar não penaliza mais que errar.`,
      });
    }

    // Insight 3: Disciplina mais fraca
    const disciplinaFraca = Object.entries(estatisticas.desempenhoPorDisciplina)
      .filter(([, d]) => d.total > 0)
      .sort(([, a], [, b]) => a.acertos / a.total - b.acertos / b.total)[0];

    if (
      disciplinaFraca &&
      disciplinaFraca[1].acertos / disciplinaFraca[1].total < 0.5
    ) {
      lista.push({
        tipo: "dica",
        mensagem: `${DISCIPLINAS_NOME[disciplinaFraca[0]]} foi sua disciplina mais desafiadora. Que tal um treino focado?`,
        acao: "Treinar disciplina",
      });
    }

    return lista;
  }, [simulado]);

  // Handlers
  const compartilharResultado = async () => {
    if (!resultadoRef.current || !simulado) return;

    setGerandoImagem(true);
    try {
      const canvas = await html2canvas(resultadoRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;

        // Copia para clipboard se suportado
        if (navigator.clipboard && navigator.clipboard.write) {
          const item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item]);
          alert("Imagem copiada! Cole onde quiser compartilhar.");
        } else {
          // Download como fallback
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `prf-resultado-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      alert("Erro ao gerar imagem. Tente novamente.");
    } finally {
      setGerandoImagem(false);
    }
  };

  const refazerSimulado = () => {
    const modo = simulado?.modo.toLowerCase() || "completo";
    router.push(`/simulado?modo=${modo}`);
  };

  // Loading
  if (!simulado) {
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
          <p className="text-slate-400">Carregando resultado...</p>
        </motion.div>
      </div>
    );
  }

  const { estatisticas } = simulado;
  const classificacao = classificarDesempenho(
    estatisticas.pontuacao,
    estatisticas.totalQuestoes,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-12">
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * 100 + "vw", opacity: 1 }}
              animate={{ y: "100vh", opacity: 0, rotate: 720 }}
              transition={{
                duration: 2 + Math.random(),
                delay: Math.random() * 0.5,
              }}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: [
                  "#3b82f6",
                  "#10b981",
                  "#f59e0b",
                  "#ef4444",
                  "#8b5cf6",
                ][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}

      <div
        ref={resultadoRef}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-400 mb-4">
            <Calendar className="w-4 h-4" />
            {new Date(simulado.data).toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Resultado do Simulado
          </h1>
          <p className="text-slate-400">
            Modo{" "}
            {simulado.modo === "TURBO"
              ? "Turbo"
              : simulado.modo === "ADAPTATIVO"
                ? "Adaptativo"
                : "Completo"}
          </p>
        </motion.div>

        {/* Score Principal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8"
        >
          <GlassCard
            className="p-8 text-center"
            glow={
              classificacao.nivel === "excelente"
                ? "green"
                : classificacao.nivel === "bom"
                  ? "blue"
                  : "yellow"
            }
            intensity="strong"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className={`text-7xl sm:text-8xl font-bold mb-2 bg-gradient-to-r ${classificacao.nivel === "excelente" ? "from-emerald-400 to-teal-400" : classificacao.nivel === "bom" ? "from-blue-400 to-cyan-400" : "from-amber-400 to-orange-400"} bg-clip-text text-transparent`}
            >
              {estatisticas.pontuacao}
            </motion.div>
            <p className="text-slate-400 mb-4">pontos (regra CEBRASPE)</p>

            {comparacao && (
              <div className="flex justify-center mb-4">
                <TendenciaBadge
                  tendencia={comparacao.tendencia}
                  valor={comparacao.diferencaPontos}
                />
              </div>
            )}

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${classificacao.nivel === "excelente" ? "bg-emerald-500/20 text-emerald-400" : classificacao.nivel === "bom" ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/20 text-amber-400"}`}
            >
              <Award className="w-4 h-4" />
              {classificacao.mensagem}
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <StatCard
            icon={CheckCircle2}
            value={estatisticas.acertos}
            label="Acertos"
            color="emerald"
            delay={0.3}
          />
          <StatCard
            icon={XCircle}
            value={estatisticas.erros}
            label="Erros"
            color="rose"
            delay={0.4}
          />
          <StatCard
            icon={HelpCircle}
            value={estatisticas.brancos}
            label="Em branco"
            color="amber"
            delay={0.5}
          />
          <StatCard
            icon={Clock}
            value={formatarTempoLegivel(estatisticas.tempoTotal)}
            label="Tempo"
            color="blue"
            delay={0.6}
          />
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3 mb-8"
        >
          {insights.map((insight, idx) => (
            <InsightCard
              key={idx}
              {...insight}
              onAcao={() => {
                if (insight.acao?.includes("Treinar")) {
                  router.push("/treino");
                } else if (insight.acao?.includes("análise")) {
                  router.push("/estatisticas");
                }
              }}
            />
          ))}
        </motion.div>

        {/* Desempenho por Disciplina */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard className="p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              Desempenho por Disciplina
            </h2>

            <div className="space-y-4">
              {Object.entries(estatisticas.desempenhoPorDisciplina)
                .filter(([, dados]) => dados.total > 0)
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
                    delay={0.9 + idx * 0.1}
                  />
                ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Ações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/revisao"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all hover:scale-105"
          >
            <Brain className="w-5 h-5" />
            Revisar Questões
          </Link>

          <button
            onClick={refazerSimulado}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            Refazer Simulado
          </button>

          <button
            onClick={compartilharResultado}
            disabled={gerandoImagem}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50"
          >
            {gerandoImagem ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full"
              />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
            {gerandoImagem ? "Gerando..." : "Compartilhar"}
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
