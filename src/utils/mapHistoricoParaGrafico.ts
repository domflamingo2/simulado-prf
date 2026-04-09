// src/utils/mapHistoricoParaGrafico.ts

import type { HistoricoSimulado } from "@/data/types";

export interface DadoGrafico {
  data: string;
  dataFormatada: string;
  pontuacao: number;
  percentual: number;
  label: string;
}

// Definimos uma interface para o retorno da função auxiliar,
// garantindo que sabemos exatamente quais campos derivados temos.
interface ValoresDerivados {
  nota: number;
  acertos: number;
  totalQuestoes: number;
  percentualExistente: number | undefined | null;
}

/**
 * Função auxiliar para extrair valores com suporte a chaves alternativas (fallbacks).
 * Isso evita o uso de 'as unknown as Record' e mantém a lógica organizada.
 */
const extrairValoresDerivados = (item: HistoricoSimulado): ValoresDerivados => {
  // ✅ CORREÇÃO: Converta para 'unknown' primeiro para ignorar as restrições de tipo,
  // e então para 'Record<string, unknown>' para permitir o acesso via colchetes.
  const itemComoObjeto = item as unknown as Record<string, unknown>;

  const nota = Number(
    itemComoObjeto["nota"] ??
      itemComoObjeto["pontuacao"] ??
      itemComoObjeto["score"] ??
      0,
  );
  const acertos = Number(
    itemComoObjeto["acertos"] ?? itemComoObjeto["correct"] ?? 0,
  );
  const totalQuestoes = Number(
    itemComoObjeto["totalQuestoes"] ??
      itemComoObjeto["total"] ??
      itemComoObjeto["questions"] ??
      1,
  );
  const percentualExistente =
    itemComoObjeto["percentual"] ?? itemComoObjeto["aproveitamento"];

  return {
    nota,
    acertos,
    totalQuestoes,
    percentualExistente: percentualExistente as number | undefined | null,
  };
};

export const mapHistoricoParaGrafico = (
  historico: HistoricoSimulado[],
): DadoGrafico[] => {
  return historico.map((item) => {
    const dataObj = new Date(item.data);

    // Extração segura dos valores
    const { nota, acertos, totalQuestoes, percentualExistente } =
      extrairValoresDerivados(item);

    // Cálculo do percentual
    const percentual =
      percentualExistente != null
        ? Number(percentualExistente)
        : Math.round((acertos / totalQuestoes) * 100);

    // Formatação da data uma única vez
    const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });

    return {
      data: item.data,
      dataFormatada,
      pontuacao: nota,
      percentual,
      label: `${dataFormatada} • ${nota} pts`, // Reutiliza a data formatada
    };
  });
};
