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
  /** Tags para categorização (opcional) */
  tags?: string[];
  /** Ano da questão, se for de prova anterior (opcional) */
  ano?: number;
  /** Banca original, se diferente de CEBRASPE (opcional) */
  banca?: string;
}

/** Questão com resposta do usuário (usado durante simulado) */
export interface QuestaoRespondida extends Questao {
  respostaUsuario?: RespostaCebraspe | null;
  tempoGasto?: number; // em segundos
  /** Flag para revisar depois */
  revisar?: boolean;
  /** Anotação pessoal do usuário */
  anotacao?: string;
}

// ═══════════════════════════════════════════════════════════
// HISTÓRICO E ARMAZENAMENTO
// ═══════════════════════════════════════════════════════════

/** Registro de um simulado completo no histórico */
export interface HistoricoSimulado {
  id: string;
  data: string; // ISO string
  modo: ModoSimulado;
  /** Se modo DISCIPLINA, qual disciplina foi treinada */
  disciplina?: Disciplina;
  estatisticas: EstatisticasSimulado;
  questoes: QuestaoRespondida[];
  /** XP ganho neste simulado */
  xpGanho?: number;
  /** Conquistas desbloqueadas */
  conquistas?: string[];
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

/** Tipos de badges/conquistas */
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

/** Progresso do usuário no sistema de gamificação */
export interface UserProgress {
  nivel: number;
  xpTotal: number;
  xpAtual: number;
  xpParaProximoNivel: number;
  /** Dias consecutivos de estudo */
  streakDias: number;
  /** Data do último estudo (ISO string) */
  ultimoDiaEstudo: string | null;
  /** Maior streak já alcançado */
  maiorStreak: number;
  /** Badges desbloqueados */
  badges: Array<{
    id: BadgeType;
    unlockedAt: string;
  }>;
  /** Estatísticas de conquistas */
  conquistas: {
    simuladosCompletos: number;
    simuladosTurbo: number;
    simuladosAdaptativos: number;
    treinosDisciplina: number;
    revisoesErros: number;
    totalQuestoesRespondidas: number;
    totalAcertos: number;
    totalErros: number;
    /** Tempos recordes em segundos */
    recordes: {
      turboMaisRapido: number | null;
      melhorPontuacao: number;
    };
    /** Disciplinas com 70%+ de aproveitamento */
    disciplinasDominadas: Disciplina[];
  };
}

/** Nível do sistema de gamificação */
export interface NivelInfo {
  nivel: number;
  nome: string;
  xpMin: number;
  xpMax: number;
  cor: string;
  icone: string;
}

// ═══════════════════════════════════════════════════════════
// ESTRUTURA DA PROVA
// ═══════════════════════════════════════════════════════════

/** Estrutura de distribuição de questões */
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

/** Configuração de modos de simulado */
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
// ANÁLISE E ESTATÍSTICAS
// ═══════════════════════════════════════════════════════════

/** Análise de desempenho por disciplina */
export interface AnaliseDisciplina {
  disciplina: Disciplina;
  totalQuestoes: number;
  acertos: number;
  erros: number;
  taxaAcerto: number;
  taxaErro: number;
  /** Tendência: melhorando, estável, piorando */
  tendencia: "up" | "stable" | "down";
  /** Recomendação de estudo */
  recomendacao: string;
}

/** Resultado de análise adaptativa */
export interface AnaliseAdaptativa {
  recomendacaoGeral: string;
  disciplinasFracas: AnaliseDisciplina[];
  disciplinasFortes: AnaliseDisciplina[];
  disciplinasNeutras: AnaliseDisciplina[];
  distribuicaoSugerida: Record<Disciplina, number>;
}

// ═══════════════════════════════════════════════════════════
// UTILITÁRIOS DE TIPO
// ═══════════════════════════════════════════════════════════

/** Mapeamento de nomes amigáveis para disciplinas */
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

/** Cores por disciplina para gráficos */
export const DISCIPLINAS_CORES: Record<Disciplina, string> = {
  PORTUGUES: "#3b82f6", // blue
  ETICA: "#10b981", // emerald
  RACIOCINIO_LOGICO: "#8b5cf6", // violet
  DIREITO_CONSTITUCIONAL: "#f59e0b", // amber
  DIREITO_ADMINISTRATIVO: "#ef4444", // red
  ADMINISTRACAO: "#06b6d4", // cyan
  ARQUIVOLOGIA: "#ec4899", // pink
  INFORMATICA: "#6366f1", // indigo
  LEGISLACAO_PRF: "#14b8a6", // teal
};

/** Ordem padrão das disciplinas */
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

export interface ClassificacaoDesempenho {
  nivel: NivelDesempenho;
  mensagem: string;
  cor: string;
  icone: string;
  score: number; // 0-100 normalizado
}

export interface EstatisticasDisciplina {
  total: number;
  acertos: number;
  erros: number;
  brancos: number;
  percentual: number;
  pontuacao: number;
}

// Atualizar EstatisticasSimulado
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
