import { useMemo } from "react";

import { DISCIPLINAS_NOME } from "@/constants/disciplinas";
import { HistoricoSimulado } from "@/data/index";

interface Insight {
  id: string;
  tipo: "positivo" | "alerta" | "dica";
  mensagem: string;
  acao?: string;
}

export function useInsights(
  simulado: HistoricoSimulado | null,
  historico: HistoricoSimulado[],
): Insight[] {
  return useMemo(() => {
    if (!simulado) return [];

    const { estatisticas } = simulado;
    const lista: Insight[] = [];

    // Insight 1: Performance geral
    if (estatisticas.percentual >= 70) {
      lista.push({
        id: "performance-excelente",
        tipo: "positivo",
        mensagem:
          "Excelente desempenho! Você estaria aprovado no concurso real.",
        acao: "Ver estatísticas",
      });
    } else if (estatisticas.percentual >= 60) {
      lista.push({
        id: "performance-bom",
        tipo: "positivo",
        mensagem:
          "Bom desempenho! Na média de aprovação, mas ainda dá para melhorar.",
        acao: "Ver pontos fracos",
      });
    } else if (estatisticas.percentual >= 40) {
      lista.push({
        id: "performance-regular",
        tipo: "dica",
        mensagem:
          "Desempenho regular. Foco nos estudos para alcançar a aprovação.",
        acao: "Ver análise completa",
      });
    } else {
      lista.push({
        id: "performance-baixo",
        tipo: "alerta",
        mensagem:
          "Desempenho abaixo da média. Foque nos pontos fracos identificados.",
        acao: "Ver análise completa",
      });
    }

    // Insight 2: Questões em branco
    if (estatisticas.brancos > 5) {
      lista.push({
        id: "brancos-excesso",
        tipo: "dica",
        mensagem: `Você deixou ${estatisticas.brancos} questões em branco. No CEBRASPE, chutar não penaliza mais que errar.`,
      });
    } else if (estatisticas.brancos === 0 && estatisticas.totalQuestoes > 20) {
      lista.push({
        id: "brancos-zero",
        tipo: "positivo",
        mensagem: "Você respondeu todas as questões! Isso mostra determinação.",
      });
    }

    // Insight 3: Disciplina mais fraca
    const desempenhoEntries = Object.entries(
      estatisticas.desempenhoPorDisciplina,
    )
      .filter(([, d]) => d.total > 0)
      .map(([disciplina, d]) => ({
        disciplina,
        percentual: d.acertos / d.total,
        acertos: d.acertos,
        total: d.total,
      }))
      .sort((a, b) => a.percentual - b.percentual);

    const disciplinaFraca = desempenhoEntries[0];

    if (
      disciplinaFraca &&
      disciplinaFraca.percentual < 0.5 &&
      disciplinaFraca.total >= 3
    ) {
      lista.push({
        id: "disciplina-fraca",
        tipo: "dica",
        mensagem: `${DISCIPLINAS_NOME[disciplinaFraca.disciplina] || disciplinaFraca.disciplina} foi sua disciplina mais desafiadora (${Math.round(disciplinaFraca.percentual * 100)}% acertos). Que tal um treino focado?`,
        acao: "Treinar disciplina",
      });
    }

    // Insight 4: Disciplina mais forte
    const disciplinaForte = desempenhoEntries[desempenhoEntries.length - 1];
    if (
      disciplinaForte &&
      disciplinaForte.percentual >= 0.8 &&
      disciplinaForte.total >= 3
    ) {
      lista.push({
        id: "disciplina-forte",
        tipo: "positivo",
        mensagem: `Parabéns! Seu desempenho em ${DISCIPLINAS_NOME[disciplinaForte.disciplina] || disciplinaForte.disciplina} foi excelente (${Math.round(disciplinaForte.percentual * 100)}% acertos).`,
      });
    }

    // Insight 5: Comparação com média geral
    if (historico.length >= 3) {
      const mediaGeral =
        historico.reduce((acc, h) => acc + h.estatisticas.percentual, 0) /
        historico.length;
      const diferencaMedia = estatisticas.percentual - mediaGeral;

      if (Math.abs(diferencaMedia) > 10) {
        lista.push({
          id: "comparacao-media",
          tipo: diferencaMedia > 0 ? "positivo" : "alerta",
          mensagem:
            diferencaMedia > 0
              ? `Você foi ${diferencaMedia.toFixed(1)}% acima da sua média geral (${mediaGeral.toFixed(1)}%). Continue assim!`
              : `Você ficou ${Math.abs(diferencaMedia).toFixed(1)}% abaixo da sua média geral (${mediaGeral.toFixed(1)}%). Hora de revisar a estratégia.`,
        });
      }
    }

    return lista.slice(0, 5);
  }, [simulado, historico]);
}
