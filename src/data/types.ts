// ═══════════════════════════════════════════════════════════
// TIPOS BASE DO SISTEMA
// ═══════════════════════════════════════════════════════════

/** Disciplinas do concurso PRF Administrativo */
export type Disciplina =
  | "PORTUGUES"
  | "ETICA"
  | "RACIOCINIO_LOGICO"
  | "DIREITO_CONSTITUCIONAL"
  | "DIREITO_ADMINISTRATIVO"
  | "ADMINISTRACAO"
  | "ARQUIVOLOGIA"
  | "INFORMATICA"
  | "LEGISLACAO_PRF";

/** Modos de simulado disponíveis */
export type ModoSimulado =
  | "COMPLETO"
  | "TURBO"
  | "ADAPTATIVO"
  | "DISCIPLINA"
  | "ERROS"
  | "TREINO";

export type FaseTempo = "normal" | "atencao" | "critico" | "esgotado";

export type NivelDesempenho =
  | "excelente"
  | "bom"
  | "regular"
  | "insuficiente"
  | "critico";

/** Níveis de dificuldade das questões */
export type NivelDificuldade = 1 | 2 | 3;

/** Resposta possível em questão CEBRASPE */
export type RespostaCebraspe = "CERTO" | "ERRADO";

// ═══════════════════════════════════════════════════════════
// ESTRUTURAS DE DADOS PRINCIPAIS
// ═══════════════════════════════════════════════════════════

/** Estrutura base de uma questão */
export interface Questao {
  id: string;
  disciplina: Disciplina;
  enunciado: string;
  resposta: RespostaCebraspe;
  explicacao: string;
  dificuldade: NivelDificuldade;
  tags?: string[];
  ano?: number;
  banca?: string;
  fonte_legal?: string[];
  banca_referencia?: string;
  assunto?: string;
}

/** Questão com resposta do usuário */
export interface QuestaoRespondida extends Questao {
  // Permite null (em branco), undefined (não respondida ainda) ou a resposta
  respostaUsuario?: RespostaCebraspe | null;
  tempoGasto?: number; // em segundos
  revisar?: boolean;
  anotacao?: string;
}

// ═══════════════════════════════════════════════════════════
// HISTÓRICO E ARMAZENAMENTO
// ═══════════════════════════════════════════════════════════

/** Registro de um simulado completo */
export interface HistoricoSimulado {
  id: string;
  data: string; // ISO string
  modo: ModoSimulado;
  disciplina?: Disciplina; // Preenchido se for modo DISCIPLINA
  estatisticas: EstatisticasSimulado;
  questoes: QuestaoRespondida[];
  xpGanho?: number;
  conquistas?: string[]; // IDs dos badges desbloqueados neste simulado
}

/** Configurações do usuário */
export interface UserSettings {
  tema: "dark" | "light" | "system";
  somEnabled: boolean;
  animacoesEnabled: boolean;
  tempoPadraoProva: number; // minutos
  mostrarExplicacaoImediata: boolean;
}

// ═══════════════════════════════════════════════════════════
// GAMIFICAÇÃO
// ═══════════════════════════════════════════════════════════

export type BadgeType =
  | "primeiro"
  | "streak-3"
  | "streak-7"
  | "streak-30"
  | "cebraspe-master"
  | "polivalente"
  | "velocista"
  | "perfeccionista"
  | "persistent"
  | "nivel-5"
  | "nivel-10"
  | "nivel-max";

export interface UserProgress {
  nivel: number;
  xpTotal: number;
  xpAtual: number;
  xpParaProximoNivel: number;
  streakDias: number;
  ultimoDiaEstudo: string | null;
  maiorStreak: number;
  badges: Array<{
    id: BadgeType;
    unlockedAt: string;
  }>;
  conquistas: {
    simuladosCompletos: number;
    simuladosTurbo: number;
    simuladosAdaptativos: number;
    treinosDisciplina: number;
    revisoesErros: number;
    totalQuestoesRespondidas: number;
    totalAcertos: number;
    totalErros: number;
    recordes: {
      turboMaisRapido: number | null;
      melhorPontuacao: number;
    };
    // ✅ CORREÇÃO: Garantir que é array de Disciplina
    disciplinasDominadas: Disciplina[];
  };
}

export interface NivelInfo {
  nivel: number;
  nome: string;
  xpMin: number;
  xpMax: number;
  cor: string;
  icone: string;
}

// ═══════════════════════════════════════════════════════════
// ADAPTATIVO (Unificado de lib/adaptativo.ts)
// ═══════════════════════════════════════════════════════════

// Tendência de desempenho em string legível
export type TipoTendencia =
  | "melhorando"
  | "piorando"
  | "estavel"
  | "insuficiente";

/** Informações de peso para seleção de questões */
export interface PesoDisciplina {
  disciplina: Disciplina;
  peso: number; // Peso bruto calculado
  pesoNormalizado: number; // Peso ajustado para soma 1 (ou média)
  taxaErro: number; // 0 a 1
  taxaAcerto: number; // 0 a 1
  questoesRespondidas: number;
  tendencia: TipoTendencia;
  confianca: number; // 0 a 1
  ultimaRevisao?: Date;
}

/** Resultado da seleção de questões */
export interface SelecaoAdaptativaResult {
  questoes: Questao[];
  metadados: {
    distribuicaoPorDisciplina: Record<string, number>;
    percentualNovas: number;
    percentualRevisao: number;
    disciplinasPriorizadas: Disciplina[];
    nivelAdaptacao: number; // 0 a 1
  };
}

/** Análise completa para o dashboard */
export interface AnaliseAdaptativa {
  resumo: string;
  disciplinasCriticas: PesoDisciplina[];
  disciplinasDominadas: PesoDisciplina[];
  disciplinasEmAlta: PesoDisciplina[];
  disciplinasEmBaixa: PesoDisciplina[];
  recomendacoes: string[];
  distribuicaoSugerida: PesoDisciplina[];
  nivelConfiancaGlobal: number;
  proximoMilestone: {
    disciplina: Disciplina;
    meta: number;
    atual: number;
  } | null;
}

// ═══════════════════════════════════════════════════════════
// GRÁFICOS E DASHBOARD
// ═══════════════════════════════════════════════════════════

/** Formato simplificado para gráficos */
export interface DadoGrafico {
  data: string;
  dataFormatada: string;
  pontuacao: number;
  percentual: number;
  label: string;
}

// ═══════════════════════════════════════════════════════════
// ESTRUTURA DA PROVA
// ═══════════════════════════════════════════════════════════

export interface EstruturaProva {
  conhecimentosBasicos: {
    total: number;
    disciplinas: Partial<Record<Disciplina, number>>;
  };
  conhecimentosEspecificos: {
    total: number;
    disciplinas: Partial<Record<Disciplina, number>>;
  };
}

export interface ModoConfig {
  nome: string;
  descricao: string;
  totalQuestoes: number;
  tempoMinutos: number;
  xpBase: number;
  cor: string;
  icone: string;
}

// ═══════════════════════════════════════════════════════════
// ESTATÍSTICAS
// ═══════════════════════════════════════════════════════════

export interface EstatisticasDisciplina {
  total: number;
  acertos: number;
  erros: number;
  brancos: number;
  percentual: number;
  pontuacao: number;
}

export interface EstatisticasSimulado {
  totalQuestoes: number;
  acertos: number;
  erros: number;
  brancos: number;
  pontuacao: number;
  percentual: number;
  tempoTotal: number;
  tempoMedioPorQuestao: number;
  desempenhoPorDisciplina: Record<Disciplina, EstatisticasDisciplina>;
  taxaResposta: number;
}

export interface ClassificacaoDesempenho {
  nivel: NivelDesempenho;
  mensagem: string;
  cor: string;
  icone: string;
  score: number;
}

// ═══════════════════════════════════════════════════════════
// CONSTANTES E UTILITÁRIOS
// ═══════════════════════════════════════════════════════════

export const DISCIPLINAS_LABELS: Record<Disciplina, string> = {
  PORTUGUES: "Língua Portuguesa",
  ETICA: "Ética e Conduta Pública",
  RACIOCINIO_LOGICO: "Raciocínio Lógico",
  DIREITO_CONSTITUCIONAL: "Direito Constitucional",
  DIREITO_ADMINISTRATIVO: "Direito Administrativo",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Legislação PRF",
};

export const DISCIPLINAS_CORES: Record<Disciplina, string> = {
  PORTUGUES: "#3b82f6",
  ETICA: "#10b981",
  RACIOCINIO_LOGICO: "#8b5cf6",
  DIREITO_CONSTITUCIONAL: "#f59e0b",
  DIREITO_ADMINISTRATIVO: "#ef4444",
  ADMINISTRACAO: "#06b6d4",
  ARQUIVOLOGIA: "#ec4899",
  INFORMATICA: "#6366f1",
  LEGISLACAO_PRF: "#14b8a6",
};

export const DISCIPLINAS_ORDEM: Disciplina[] = [
  "PORTUGUES",
  "ETICA",
  "RACIOCINIO_LOGICO",
  "DIREITO_CONSTITUCIONAL",
  "DIREITO_ADMINISTRATIVO",
  "ADMINISTRACAO",
  "ARQUIVOLOGIA",
  "INFORMATICA",
  "LEGISLACAO_PRF",
];
