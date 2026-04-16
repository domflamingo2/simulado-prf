import { Disciplina, Questao } from "@/data/types";

// ═══════════════════════════════════════════════════════════
// TIPOS DE DOMÍNIO — Banco de Erros
// ═══════════════════════════════════════════════════════════

/**
 * Uma questão que o usuário errou em pelo menos um simulado,
 * enriquecida com metadados de frequência e data.
 */
export interface ErroComMetadados extends Questao {
  /** Quantas vezes o usuário errou esta questão no total */
  vezesErrada: number;
  /** ISO string da última vez que errou */
  ultimaData: string;
  /** Nome legível da disciplina (ex: "Língua Portuguesa") */
  disciplinaFormatada: string;
}

/**
 * Estatísticas agregadas calculadas a partir do banco de erros.
 *
 * Campos nullable refletem estados reais quando a lista de erros está vazia
 * ou não há dados suficientes para calcular a métrica.
 */
export interface StatsData {
  totalErrosContabilizados: number;
  /** Taxa de acerto média (0–100). Requer `totalQuestoesRespondidas > 0`. */
  taxaAcertoMedia: number;
  mediaErrosPorQuestao: number;
  /** null quando não há erros cadastrados */
  disciplinaMaisDificil: string | null;
  disciplinaMaisDificilCount: number;
  /** null quando não há erros com data registrada */
  diaComMaisErros: string | null;
  /** Percentual de erros revisados (0–100) */
  progressoRevisao: number;
}

/**
 * Critério de ordenação da lista de erros.
 * - `vezes`      : mais errada primeiro
 * - `data`       : mais recente primeiro
 * - `recentes`   : mais antiga primeiro
 * - `disciplina` : ordem alfabética por disciplina
 */
export type OrdenacaoType = "vezes" | "data" | "disciplina" | "recentes";

/**
 * Estatísticas de desempenho por disciplina dentro do banco de erros.
 */
export interface DisciplinaStatsErros {
  disciplina: Disciplina;
  nome: string;
  count: number;
}

// ═══════════════════════════════════════════════════════════
// CONSTANTES COMPARTILHADAS — chaves do localStorage
//
// Centralizadas aqui para evitar strings duplicadas em múltiplos arquivos.
// Importar estas constantes em vez de reescrever as strings.
// ═══════════════════════════════════════════════════════════

export const LS_KEYS = {
  /** Histórico de simulados (array de HistoricoSimulado) */
  historico: "prf_historico",
  /** Progresso de gamificação (UserProgress) */
  progresso: "prf_user_progress",
  /** IDs de questões marcadas como revisadas no banco de erros */
  revisados: "prf_erros_revisados",
  /** IDs de questões removidas manualmente do banco de erros (não afeta o histórico) */
  removidos: "prf_erros_removidos",
  /** Backup automático criado antes de apagar o histórico */
  backup: "prf_backup_automatico",
  /** Configurações gerais do app */
  config: "prf_config",
  /** Questões do treino atual */
  treinoAtual: "prf_treino_atual",
} as const;

/** União de todos os valores de chave — útil para typed wrappers do localStorage */
export type LSKey = (typeof LS_KEYS)[keyof typeof LS_KEYS];
