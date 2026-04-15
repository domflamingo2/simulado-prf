import { z } from "zod";

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
  respostaUsuario?: RespostaCebraspe | null;
  tempoGasto?: number;
  revisar?: boolean;
  anotacao?: string;
}

// ═══════════════════════════════════════════════════════════
// HISTÓRICO E ARMAZENAMENTO
// ═══════════════════════════════════════════════════════════

/** Registro de um simulado completo */
export interface HistoricoSimulado {
  id: string;
  data: string;
  modo: ModoSimulado;
  disciplina?: Disciplina;
  estatisticas: EstatisticasSimulado;
  questoes: QuestaoRespondida[];
  xpGanho?: number;
  conquistas?: BadgeType[];
}

/** Configurações do usuário */
export interface UserSettings {
  tema: "dark" | "light" | "system";
  somEnabled: boolean;
  animacoesEnabled: boolean;
  tempoPadraoProva: number;
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
  conquistas: ConquistasProgresso;
  recordes: RecordesProgresso;
}

export interface ConquistasProgresso {
  simuladosCompletos: number;
  simuladosTurbo: number;
  simuladosAdaptativos: number;
  treinosDisciplina: number;
  revisoesErros: number;
  totalQuestoesRespondidas: number;
  totalAcertos: number;
  totalErros: number;
  disciplinasDominadas: Disciplina[];
}

export interface RecordesProgresso {
  turboMaisRapido: number | null;
  melhorPontuacao: number;
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
// ADAPTATIVO
// ═══════════════════════════════════════════════════════════

export type TipoTendencia =
  | "melhorando"
  | "piorando"
  | "estavel"
  | "insuficiente";

export interface PesoDisciplina {
  disciplina: Disciplina;
  peso: number;
  pesoNormalizado: number;
  taxaErro: number;
  taxaAcerto: number;
  questoesRespondidas: number;
  tendencia: TipoTendencia;
  confianca: number;
  ultimaRevisao?: Date;
}

export interface SelecaoAdaptativaResult {
  questoes: Questao[];
  metadados: {
    distribuicaoPorDisciplina: Record<string, number>;
    percentualNovas: number;
    percentualRevisao: number;
    disciplinasPriorizadas: Disciplina[];
    nivelAdaptacao: number;
  };
}

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

// ═══════════════════════════════════════════════════════════
// VALIDAÇÃO COM ZOD
// ═══════════════════════════════════════════════════════════

// Constantes reutilizáveis para os enums
const DISCIPLINAS_ENUM = [
  "PORTUGUES",
  "ETICA",
  "RACIOCINIO_LOGICO",
  "DIREITO_CONSTITUCIONAL",
  "DIREITO_ADMINISTRATIVO",
  "ADMINISTRACAO",
  "ARQUIVOLOGIA",
  "INFORMATICA",
  "LEGISLACAO_PRF",
] as const;

const MODOS_ENUM = [
  "COMPLETO",
  "TURBO",
  "ADAPTATIVO",
  "DISCIPLINA",
  "ERROS",
  "TREINO",
] as const;

const BADGES_ENUM = [
  "primeiro",
  "streak-3",
  "streak-7",
  "streak-30",
  "cebraspe-master",
  "polivalente",
  "velocista",
  "perfeccionista",
  "persistent",
  "nivel-5",
  "nivel-10",
  "nivel-max",
] as const;

const RESPOSTAS_ENUM = ["CERTO", "ERRADO"] as const;

// Schema para a questão base
const QuestaoBaseSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  disciplina: z.enum(DISCIPLINAS_ENUM),
  enunciado: z.string().min(1, "Enunciado é obrigatório"),
  resposta: z.enum(RESPOSTAS_ENUM),
  explicacao: z.string().min(1, "Explicação é obrigatória"),
  dificuldade: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  tags: z.array(z.string()).optional().default([]),
  ano: z.number().int().positive().optional(),
  banca: z.string().optional(),
  fonte_legal: z.array(z.string()).optional().default([]),
  banca_referencia: z.string().optional(),
  assunto: z.string().optional(),
});

// Schema para questão respondida
export const QuestaoRespondidaSchema: z.ZodType<QuestaoRespondida> =
  QuestaoBaseSchema.extend({
    respostaUsuario: z.enum(RESPOSTAS_ENUM).nullable().optional(),
    tempoGasto: z.number().min(0).optional(),
    revisar: z.boolean().optional().default(false),
    anotacao: z.string().optional(),
  });

// Schema para estatísticas por disciplina
export const EstatisticasDisciplinaSchema: z.ZodType<EstatisticasDisciplina> = z
  .object({
    total: z.number().min(0),
    acertos: z.number().min(0),
    erros: z.number().min(0),
    brancos: z.number().min(0),
    percentual: z.number(),
    pontuacao: z.number(),
  })
  .refine((data) => data.total === data.acertos + data.erros + data.brancos, {
    message: "Soma de acertos, erros e brancos deve ser igual ao total",
  });

// Schema para estatísticas do simulado
export const EstatisticasSimuladoSchema: z.ZodType<EstatisticasSimulado> =
  z.object({
    totalQuestoes: z.number().min(0),
    acertos: z.number().min(0),
    erros: z.number().min(0),
    brancos: z.number().min(0),
    pontuacao: z.number(),
    percentual: z.number().min(-100).max(100),
    tempoTotal: z.number().min(0),
    tempoMedioPorQuestao: z.number().min(0),
    desempenhoPorDisciplina: z.record(
      z.enum(DISCIPLINAS_ENUM),
      EstatisticasDisciplinaSchema,
    ),
    taxaResposta: z.number().min(0).max(100),
  });

// Schema para conquistas de progresso
export const ConquistasProgressoSchema: z.ZodType<ConquistasProgresso> =
  z.object({
    simuladosCompletos: z.number().min(0),
    simuladosTurbo: z.number().min(0),
    simuladosAdaptativos: z.number().min(0),
    treinosDisciplina: z.number().min(0),
    revisoesErros: z.number().min(0),
    totalQuestoesRespondidas: z.number().min(0),
    totalAcertos: z.number().min(0),
    totalErros: z.number().min(0),
    disciplinasDominadas: z.array(z.enum(DISCIPLINAS_ENUM)),
  });

// Schema para recordes
export const RecordesProgressoSchema: z.ZodType<RecordesProgresso> = z.object({
  turboMaisRapido: z.number().min(0).nullable(),
  melhorPontuacao: z.number().min(0),
});

// Schema principal de progresso do usuário
export const UserProgressSchema: z.ZodType<UserProgress> = z
  .object({
    nivel: z.number().int().min(1),
    xpTotal: z.number().min(0),
    xpAtual: z.number().min(0),
    xpParaProximoNivel: z.number().min(0),
    streakDias: z.number().min(0),
    ultimoDiaEstudo: z.string().datetime().nullable(),
    maiorStreak: z.number().min(0),
    badges: z.array(
      z.object({
        id: z.enum(BADGES_ENUM),
        unlockedAt: z.string().datetime(),
      }),
    ),
    conquistas: ConquistasProgressoSchema,
    recordes: RecordesProgressoSchema,
  })
  .refine((data) => data.xpTotal === data.xpAtual + (data.nivel - 1) * 100, {
    message: "XP total inconsistente com nível e XP atual",
  });

// Schema para histórico do simulado
export const HistoricoSimuladoSchema: z.ZodType<HistoricoSimulado> = z.object({
  id: z.string().min(1, "ID do simulado é obrigatório"),
  data: z.string().datetime(),
  modo: z.enum(MODOS_ENUM),
  disciplina: z.enum(DISCIPLINAS_ENUM).optional(),
  estatisticas: EstatisticasSimuladoSchema,
  questoes: z.array(QuestaoRespondidaSchema),
  xpGanho: z.number().min(0).optional(),
  conquistas: z.array(z.enum(BADGES_ENUM)).optional().default([]),
});

// Schema para configurações do usuário
export const UserSettingsSchema: z.ZodType<UserSettings> = z.object({
  tema: z.enum(["dark", "light", "system"]).default("system"),
  somEnabled: z.boolean().default(true),
  animacoesEnabled: z.boolean().default(true),
  tempoPadraoProva: z.number().int().min(1).max(300).default(60),
  mostrarExplicacaoImediata: z.boolean().default(false),
});

// ═══════════════════════════════════════════════════════════
// FUNÇÕES UTILITÁRIAS DE VALIDAÇÃO
// ═══════════════════════════════════════════════════════════

/**
 * Valida e retorna um objeto tipado com segurança
 */
export function validateHistoricoSimulado(data: unknown): HistoricoSimulado {
  return HistoricoSimuladoSchema.parse(data);
}

/**
 * Valida e retorna progresso do usuário com segurança
 */
export function validateUserProgress(data: unknown): UserProgress {
  return UserProgressSchema.parse(data);
}

/**
 * Valida e retorna configurações do usuário com segurança
 */
export function validateUserSettings(data: unknown): UserSettings {
  return UserSettingsSchema.parse(data);
}

/**
 * Validação segura que retorna resultado ao invés de lançar erro
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

// ═══════════════════════════════════════════════════════════
// FUNÇÕES DE UTILIDADE
// ═══════════════════════════════════════════════════════════

/**
 * Verifica se uma disciplina é válida
 */
export function isDisciplina(value: string): value is Disciplina {
  return DISCIPLINAS_ENUM.includes(value as Disciplina);
}

/**
 * Verifica se um modo de simulado é válido
 */
export function isModoSimulado(value: string): value is ModoSimulado {
  return MODOS_ENUM.includes(value as ModoSimulado);
}

/**
 * Retorna o label da disciplina
 */
export function getDisciplinaLabel(disciplina: Disciplina): string {
  return DISCIPLINAS_LABELS[disciplina];
}

/**
 * Retorna a cor da disciplina
 */
export function getDisciplinaCor(disciplina: Disciplina): string {
  return DISCIPLINAS_CORES[disciplina];
}

/**
 * Calcula estatísticas a partir de questões respondidas
 */
export function calcularEstatisticas(
  questoes: QuestaoRespondida[],
): Omit<EstatisticasSimulado, "desempenhoPorDisciplina" | "taxaResposta"> {
  const respondidas = questoes.filter(
    (q) => q.respostaUsuario !== undefined && q.respostaUsuario !== null,
  );
  const acertos = respondidas.filter(
    (q) => q.respostaUsuario === q.resposta,
  ).length;
  const erros = respondidas.filter(
    (q) => q.respostaUsuario !== q.resposta,
  ).length;
  const brancos = questoes.length - respondidas.length;
  const pontuacao = acertos - erros;
  const percentual =
    questoes.length > 0 ? (pontuacao / questoes.length) * 100 : 0;
  const tempoTotal = questoes.reduce((sum, q) => sum + (q.tempoGasto || 0), 0);
  const tempoMedioPorQuestao =
    respondidas.length > 0 ? tempoTotal / respondidas.length : 0;

  return {
    totalQuestoes: questoes.length,
    acertos,
    erros,
    brancos,
    pontuacao,
    percentual,
    tempoTotal,
    tempoMedioPorQuestao,
  };
}

/**
 * Cria um objeto de progresso inicial
 */
export function criarProgressoInicial(): UserProgress {
  return {
    nivel: 1,
    xpTotal: 0,
    xpAtual: 0,
    xpParaProximoNivel: 100,
    streakDias: 0,
    ultimoDiaEstudo: null,
    maiorStreak: 0,
    badges: [],
    conquistas: {
      simuladosCompletos: 0,
      simuladosTurbo: 0,
      simuladosAdaptativos: 0,
      treinosDisciplina: 0,
      revisoesErros: 0,
      totalQuestoesRespondidas: 0,
      totalAcertos: 0,
      totalErros: 0,
      disciplinasDominadas: [],
    },
    recordes: {
      turboMaisRapido: null,
      melhorPontuacao: 0,
    },
  };
}
