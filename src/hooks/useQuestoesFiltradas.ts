import { useMemo } from "react";

import { QuestaoRespondida } from "@/data/index";

type FiltroRevisao = "todas" | "erros" | "acertos" | "brancos" | "marcadas";
type OrdenacaoRevisao = "numero" | "disciplina" | "dificuldade";

interface FiltrosState {
  tipo: FiltroRevisao;
  disciplina: string | "todas";
  ordenacao: OrdenacaoRevisao;
  busca: string;
}

export function useQuestoesFiltradas(
  questoes: QuestaoRespondida[],
  filtros: FiltrosState,
  marcadas: number[],
) {
  return useMemo(() => {
    if (!questoes.length) return [];

    let result = [...questoes];

    // Filtro por tipo
    switch (filtros.tipo) {
      case "erros":
        result = result.filter(
          (q) => q.respostaUsuario && q.respostaUsuario !== q.resposta,
        );
        break;
      case "acertos":
        result = result.filter((q) => q.respostaUsuario === q.resposta);
        break;
      case "brancos":
        result = result.filter((q) => !q.respostaUsuario);
        break;
      case "marcadas":
        result = result.filter((_, idx) => marcadas.includes(idx));
        break;
    }

    // Filtro por disciplina
    if (filtros.disciplina !== "todas") {
      result = result.filter((q) => q.disciplina === filtros.disciplina);
    }

    // Busca textual
    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase();
      result = result.filter(
        (q) =>
          q.enunciado.toLowerCase().includes(termo) ||
          q.explicacao?.toLowerCase().includes(termo),
      );
    }

    // Ordenação
    switch (filtros.ordenacao) {
      case "disciplina":
        result.sort((a, b) => a.disciplina.localeCompare(b.disciplina));
        break;
      case "dificuldade":
        const ordem: Record<string, number> = {
          DIFICIL: 0,
          MEDIO: 1,
          FACIL: 2,
        };
        result.sort((a, b) => {
          const da = String(a.dificuldade ?? "MEDIO");
          const db = String(b.dificuldade ?? "MEDIO");
          return (ordem[da] ?? 1) - (ordem[db] ?? 1);
        });
        break;
    }

    return result;
  }, [questoes, filtros, marcadas]);
}
