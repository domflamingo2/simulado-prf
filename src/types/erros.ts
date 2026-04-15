import { Questao } from "@/data/types";

export interface ErroComMetadados extends Questao {
  vezesErrada: number;
  ultimaData: string;
  disciplinaFormatada: string;
}

export interface StatsData {
  totalErrosContabilizados: number;
  taxaAcertoMedia: number;
  mediaErrosPorQuestao: number;
  disciplinaMaisDificil: string;
  disciplinaMaisDificilCount: number;
  diaComMaisErros: string;
  progressoRevisao: number;
}

export type OrdenacaoType = "vezes" | "data" | "disciplina" | "recentes";
