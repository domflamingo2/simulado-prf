// src/utils/mapHistoricoParaGrafico.ts

import type { HistoricoSimulado } from "@/data/types";

export interface DadoGrafico {
  data: string;
  dataFormatada: string;
  pontuacao: number;
  percentual: number;
  label: string;
}

export const mapHistoricoParaGrafico = (
  historico: HistoricoSimulado[],
): DadoGrafico[] => {
  return historico.map((item) => {
    const dataObj = new Date(item.data);

    // ✅ Type assertion segura: HistoricoSimulado → unknown → Record
    const itemAny = item as unknown as Record<string, unknown>;

    // Acessar campos dinamicamente com fallbacks
    const nota = Number(
      itemAny.nota ?? itemAny.pontuacao ?? itemAny.score ?? 0,
    );
    const acertos = Number(itemAny.acertos ?? itemAny.correct ?? 0);
    const totalQuestoes = Number(
      itemAny.totalQuestoes ?? itemAny.total ?? itemAny.questions ?? 1,
    );
    const percentualExistente = itemAny.percentual ?? itemAny.aproveitamento;

    const percentual =
      percentualExistente != null
        ? Number(percentualExistente)
        : Math.round((acertos / totalQuestoes) * 100);

    return {
      data: item.data,
      dataFormatada: dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
      pontuacao: nota,
      percentual,
      label: `${dataObj.toLocaleDateString("pt-BR")} • ${nota} pts`,
    };
  });
};
