"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { DISCIPLINAS_NOME, DISCIPLINAS_RADAR } from "@/constants/disciplinas";
import { HistoricoSimulado } from "@/data/types";
import { gerarAnaliseAdaptativa } from "@/lib/adaptativo";

const LS_HISTORICO = "prf_historico";

type PeriodoFiltro = "7" | "30" | "90" | "todos";
type Tendencia = "melhorou" | "piorou" | "estavel";

interface ComparacaoPeriodo {
  tendencia: Tendencia;
  diferencaPontos: number;
  diferencaPercentual: number;
}

function lerHistorico(): HistoricoSimulado[] {
  try {
    const raw = localStorage.getItem(LS_HISTORICO);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      "data" in parsed &&
      Array.isArray(parsed.data)
    ) {
      return parsed.data as HistoricoSimulado[];
    }
    if (Array.isArray(parsed)) return parsed as HistoricoSimulado[];
    return [];
  } catch {
    return [];
  }
}

export function useEstatisticasData() {
  const [historico, setHistorico] = useState<HistoricoSimulado[]>([]);
  const [periodo, setPeriodo] = useState<PeriodoFiltro>("todos");
  const [carregando, setCarregando] = useState(true);
  const inicializadoRef = useRef(false);

  useEffect(() => {
    if (inicializadoRef.current) return;
    inicializadoRef.current = true;

    try {
      const dados = lerHistorico();
      setHistorico(dados);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  const historicoFiltrado = useMemo(() => {
    if (periodo === "todos") return historico;

    const dias = parseInt(periodo, 10);
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);
    dataLimite.setHours(0, 0, 0, 0);

    return historico.filter((h) => new Date(h.data) >= dataLimite);
  }, [historico, periodo]);

  const comparacao = useMemo<ComparacaoPeriodo | null>(() => {
    if (historicoFiltrado.length < 2) return null;

    const ordenado = [...historicoFiltrado].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
    );
    const atual = ordenado[0];
    const anterior = ordenado[1];

    const diferencaPontos =
      atual.estatisticas.pontuacao - anterior.estatisticas.pontuacao;
    const diferencaPercentual =
      atual.estatisticas.percentual - anterior.estatisticas.percentual;

    const tendencia: Tendencia =
      diferencaPontos > 3
        ? "melhorou"
        : diferencaPontos < -3
          ? "piorou"
          : "estavel";

    return { tendencia, diferencaPontos, diferencaPercentual };
  }, [historicoFiltrado]);

  const analise = useMemo(() => {
    if (historico.length === 0) return null;
    try {
      return gerarAnaliseAdaptativa(historico, []);
    } catch {
      return null;
    }
  }, [historico]);

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
    const tempos = historicoFiltrado
      .map((h) => h.estatisticas.tempoTotal ?? 0)
      .filter((t) => typeof t === "number" && isFinite(t));

    const n = historicoFiltrado.length;

    return {
      totalSimulados: n,
      mediaPontuacao: pontuacoes.reduce((a, b) => a + b, 0) / n,
      melhorPontuacao: Math.max(...pontuacoes),
      piorPontuacao: Math.min(...pontuacoes),
      totalQuestoes: historicoFiltrado.reduce(
        (acc, h) => acc + (h.questoes?.length ?? 0),
        0,
      ),
      taxaAproveitamento: percentuais.reduce((a, b) => a + b, 0) / n,
      tempoMedio:
        tempos.length > 0
          ? tempos.reduce((a, b) => a + b, 0) / tempos.length
          : 0,
    };
  }, [historicoFiltrado]);

  const disciplinasDetalhadas = useMemo(() => {
    const acc: Record<string, { acertos: number; total: number }> = {};

    for (const h of historicoFiltrado) {
      for (const q of h.questoes ?? []) {
        if (!q.disciplina) continue;
        if (!acc[q.disciplina]) acc[q.disciplina] = { acertos: 0, total: 0 };
        acc[q.disciplina].total++;
        if (q.respostaUsuario === q.resposta) acc[q.disciplina].acertos++;
      }
    }

    return Object.entries(acc)
      .sort(([, a], [, b]) => b.acertos / b.total - a.acertos / a.total)
      .map(([disciplina, dados]) => ({
        disciplina,
        nome: DISCIPLINAS_NOME[disciplina] ?? disciplina,
        ...dados,
        percentual: dados.total > 0 ? (dados.acertos / dados.total) * 100 : 0,
      }));
  }, [historicoFiltrado]);

  const insights = useMemo(() => {
    if (historicoFiltrado.length === 0) return [];

    const ordenado = [...historicoFiltrado].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
    );
    const { estatisticas } = ordenado[0];

    const lista: Array<{
      id: string;
      tipo: "positivo" | "alerta" | "dica" | "info";
      mensagem: string;
      acao?: string;
    }> = [];

    if (estatisticas.percentual >= 70) {
      lista.push({
        id: "performance-excelente",
        tipo: "positivo",
        mensagem:
          "Excelente desempenho no último simulado! Você estaria aprovado.",
      });
    } else if (estatisticas.percentual >= 60) {
      lista.push({
        id: "performance-bom",
        tipo: "info",
        mensagem:
          "Bom desempenho! Na média de aprovação, mas há margem para evolução.",
      });
    } else {
      lista.push({
        id: "performance-baixo",
        tipo: "alerta",
        mensagem:
          "Desempenho abaixo da meta. Foque nos pontos fracos identificados abaixo.",
        acao: "Ver disciplinas",
      });
    }

    if (historicoFiltrado.length >= 5) {
      const variacao = stats.melhorPontuacao - stats.piorPontuacao;
      lista.push(
        variacao > 15
          ? {
              id: "consistencia-baixa",
              tipo: "dica",
              mensagem: `Sua pontuação varia ${variacao.toFixed(0)} pts entre simulados. Busque mais consistência.`,
            }
          : {
              id: "consistencia-alta",
              tipo: "positivo",
              mensagem:
                "Você mantém consistência nos resultados. Continue assim!",
            },
      );
    }

    const mediaBrancos =
      historicoFiltrado.reduce(
        (acc, h) => acc + (h.estatisticas.brancos ?? 0),
        0,
      ) / historicoFiltrado.length;

    if (mediaBrancos > 3) {
      lista.push({
        id: "brancos",
        tipo: "dica",
        mensagem: `Média de ${mediaBrancos.toFixed(1)} questões em branco. No CEBRASPE, chutar não piora sua nota.`,
      });
    }

    return lista;
  }, [historicoFiltrado, stats.melhorPontuacao, stats.piorPontuacao]);

  const dadosGraficos = useMemo(() => {
    const disciplinas = Object.keys(DISCIPLINAS_NOME);

    const dadosRadar = disciplinas.map((disc) => {
      const questoes = historicoFiltrado.flatMap((h) =>
        (h.questoes ?? []).filter((q) => q.disciplina === disc),
      );
      if (questoes.length === 0) return 0;
      const acertos = questoes.filter(
        (q) => q.respostaUsuario === q.resposta,
      ).length;
      return (acertos / questoes.length) * 100;
    });

    const cronologico = [...historicoFiltrado].sort(
      (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
    );

    const errosPorDisciplina = disciplinas.map((disc) => {
      const questoes = historicoFiltrado.flatMap((h) =>
        (h.questoes ?? []).filter((q) => q.disciplina === disc),
      );
      return questoes.filter(
        (q) => q.respostaUsuario && q.respostaUsuario !== q.resposta,
      ).length;
    });

    return {
      radar: {
        labels: disciplinas.map((d) => DISCIPLINAS_RADAR[d] ?? d),
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
        labels: cronologico.map((h) =>
          new Date(h.data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          }),
        ),
        datasets: [
          {
            label: "Pontuação",
            data: cronologico.map((h) => h.estatisticas.pontuacao),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Acertos",
            data: cronologico.map((h) => h.estatisticas.acertos),
            borderColor: "#3b82f6",
            backgroundColor: "transparent",
            tension: 0.4,
          },
        ],
      },
      bar: {
        labels: disciplinas.map((d) => DISCIPLINAS_RADAR[d] ?? d),
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

  return {
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
  };
}
