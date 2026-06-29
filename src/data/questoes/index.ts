1; // ============================================================
// index.ts — arquivo único consolidado (VERSÃO MELHORADA + CORREÇÕES)
// Contém: tipos, validação Zod, gamificação, banco de questões,
//         revisão espaçada (SM-2), análise preditiva de nota final
// ============================================================

import { z } from "zod";

// ============================================================
// SEÇÃO 1 — TIPOS BASE
// ============================================================

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

export type TipoTendencia =
  | "melhorando"
  | "piorando"
  | "estavel"
  | "insuficiente";

// ============================================================
// SEÇÃO 1.1 — TIPOS MELHORADOS (inclusive revisão espaçada)
// ============================================================

/** Tipos para XP_REWARDS */
export type XPRewardKey = keyof typeof XP_REWARDS;

export interface XPRewardInfo {
  value: number;
  descricao: string;
  categoria: "questao" | "simulado" | "streak" | "recorde" | "conquista";
}

/** Tipos para badges niveladas */
export interface BadgeNivel {
  nivel: 1 | 2 | 3;
  meta: number;
  badgeId: BadgeType;
  descricao: string;
}

export interface BadgeNiveladaConfig {
  nome: string;
  descricaoBase: string;
  niveis: BadgeNivel[];
}

/** Métricas de performance */
export interface PerformanceMetrics {
  tempoMedioPorDisciplina: Record<Disciplina, number>;
  taxaAcertoPorDificuldade: Record<NivelDificuldade, number>;
  questoesMaisErradas: {
    id: string;
    taxaErro: number;
    disciplina: Disciplina;
  }[];
  eficienciaPorTempo: number;
  consistencia: "alta" | "media" | "baixa";
  disciplinaMaisForte: Disciplina | null;
  disciplinaMaisFraca: Disciplina | null;
}

/** Configuração para seleção adaptativa */
export interface SelecaoAdaptativaOptions {
  priorizarFraquezas: boolean;
  evitarRepetidos: boolean;
  limiteQuestoesVistas: number;
  pesoRecencia: number;
  pesoDificuldade: number;
  pesoErro: number;
}

/** Resultado da validação de integridade */
export interface IntegridadeBanco {
  valido: boolean;
  erros: string[];
  duplicados: string[];
  estatisticas: {
    totalQuestoes: number;
    questoesComErro: number;
    questoesDuplicadas: number;
  };
}

/** Resultado da validação de estado consistente */
export interface EstadoConsistenteResult {
  ok: boolean;
  inconsistencias: string[];
  sugestoes: string[];
}

// ============================================================
// SEÇÃO 1.2 — TIPOS PARA REVISÃO ESPAÇADA (SM-2)
// ============================================================

/** Dados de revisão espaçada para uma questão (SM-2) */
export interface RevisaoEspacada {
  /** Número de repetições bem-sucedidas consecutivas (0 = nunca revisada) */
  repeticao: number;
  /** Fator de facilidade (2.5 padrão, mínimo 1.3) */
  easinessFactor: number;
  /** Data da última revisão (ISO string) */
  ultimaRevisao: string;
  /** Intervalo atual em dias até a próxima revisão */
  intervaloDias: number;
  /** Próxima data de revisão (ISO string) */
  proximaRevisao: string;
}

/** Questão com metadados de revisão espaçada (estendida) */
export interface QuestaoComRevisao extends QuestaoRespondida {
  revisao?: RevisaoEspacada;
}

// ============================================================
// SEÇÃO 2 — INTERFACES
// ============================================================

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

export interface QuestaoRespondida extends Questao {
  respostaUsuario?: RespostaCebraspe | null;
  tempoGasto?: number;
  revisar?: boolean;
  anotacao?: string;
}

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

export interface UserSettings {
  tema: "dark" | "light" | "system";
  somEnabled: boolean;
  animacoesEnabled: boolean;
  tempoPadraoProva: number;
  mostrarExplicacaoImediata: boolean;
}

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

export interface EstatisticasDisciplina {
  total: number;
  acertos: number;
  erros: number;
  /** Questões ainda não respondidas (não confundir com deixadas em branco) */
  naoRespondidas: number;
  /** Questões explicitamente deixadas em branco pelo usuário */
  brancos: number;
  percentual: number;
  pontuacao: number;
}

export interface EstatisticasSimulado {
  totalQuestoes: number;
  acertos: number;
  erros: number;
  /** Questões explicitamente deixadas em branco (respostaUsuario === null) */
  brancos: number;
  /** Questões ainda não respondidas (respostaUsuario === undefined) */
  naoRespondidas: number;
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

export interface DadoGrafico {
  data: string;
  dataFormatada: string;
  pontuacao: number;
  percentual: number;
  label: string;
}

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

/**
 * Extras opcionais para verificação de badges.
 * Exportada para que módulos consumidores possam tipar corretamente.
 */
export interface BadgeExtras {
  simuladoPontuacao?: number;
  simuladoAcertos?: number;
  /** Total de questões do simulado — necessário para verificar prova perfeita */
  simuladoTotal?: number;
  turboTempo?: number;
  disciplinaStats?: Partial<
    Record<Disciplina, { acertos: number; total: number }>
  >;
}

// ============================================================
// SEÇÃO 3 — CONSTANTES DE DISCIPLINAS (fonte única da verdade)
// ============================================================

/**
 * Array canônico de disciplinas — todos os outros arrays e enums
 * são derivados desta constante para evitar dessincronização.
 */
export const DISCIPLINAS_ENUM = [
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

/** Alias para compatibilidade — usar DISCIPLINAS_ENUM como fonte primária */
export const DISCIPLINAS_ORDEM: Disciplina[] = [...DISCIPLINAS_ENUM];

/** Nomes curtos para exibição em UI */
export const DISCIPLINAS_NOME: Record<Disciplina, string> = {
  PORTUGUES: "Português",
  ETICA: "Ética",
  RACIOCINIO_LOGICO: "Raciocínio Lógico",
  DIREITO_CONSTITUCIONAL: "Direito Constitucional",
  DIREITO_ADMINISTRATIVO: "Direito Administrativo",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Legislação PRF",
};

// ============================================================
// SEÇÃO 4 — VALIDAÇÃO ZOD
// ============================================================

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

export const QuestaoRespondidaSchema = QuestaoBaseSchema.extend({
  respostaUsuario: z.enum(RESPOSTAS_ENUM).nullable().optional(),
  tempoGasto: z.number().min(0).optional(),
  revisar: z.boolean().optional().default(false),
  anotacao: z.string().optional(),
});

export const EstatisticasDisciplinaSchema = z
  .object({
    total: z.number().min(0),
    acertos: z.number().min(0),
    erros: z.number().min(0),
    brancos: z.number().min(0),
    naoRespondidas: z.number().min(0),
    percentual: z.number(),
    pontuacao: z.number(),
  })
  .refine(
    (d) => d.total === d.acertos + d.erros + d.brancos + d.naoRespondidas,
    {
      message:
        "Soma de acertos, erros, brancos e não respondidas deve ser igual ao total",
    },
  );

export const EstatisticasSimuladoSchema = z.object({
  totalQuestoes: z.number().min(0),
  acertos: z.number().min(0),
  erros: z.number().min(0),
  brancos: z.number().min(0),
  naoRespondidas: z.number().min(0),
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

export const ConquistasProgressoSchema = z.object({
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

export const RecordesProgressoSchema = z.object({
  turboMaisRapido: z.number().min(0).nullable(),
  melhorPontuacao: z.number().min(0),
});

/**
 * Schema de progresso do usuário.
 *
 * FIX: o .refine anterior usava `xpTotal === xpAtual + (nivel - 1) * 100`,
 * assumindo 100 XP por nível — incorreto para a tabela de níveis variáveis.
 * A consistência entre xpTotal e nivel é verificada usando calcularNivel(),
 * que é a fonte canônica de verdade.
 *
 * FIX: ultimoDiaEstudo aceita tanto ISO datetime completo quanto date-only
 * ("2024-06-01") para evitar falhas com dados persistidos sem horário.
 */
export const UserProgressSchema = z
  .object({
    nivel: z.number().int().min(1).max(10),
    xpTotal: z.number().min(0),
    xpAtual: z.number().min(0),
    xpParaProximoNivel: z.number().min(0),
    streakDias: z.number().min(0),
    ultimoDiaEstudo: z
      .string()
      .datetime({ offset: true })
      .or(z.string().date())
      .nullable(),
    maiorStreak: z.number().min(0),
    badges: z.array(
      z.object({
        id: z.enum(BADGES_ENUM),
        unlockedAt: z.string().datetime({ offset: true }).or(z.string().date()),
      }),
    ),
    conquistas: ConquistasProgressoSchema,
    recordes: RecordesProgressoSchema,
  })
  .superRefine((d, ctx) => {
    const nivelEsperado = calcularNivel(d.xpTotal).nivel;
    if (nivelEsperado !== d.nivel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nivel"],
        message: `Nível ${d.nivel} inconsistente com xpTotal ${d.xpTotal} (esperado: nível ${nivelEsperado})`,
      });
    }
  });

export const HistoricoSimuladoSchema = z.object({
  id: z.string().min(1, "ID do simulado é obrigatório"),
  data: z.string().datetime({ offset: true }).or(z.string().date()),
  modo: z.enum(MODOS_ENUM),
  disciplina: z.enum(DISCIPLINAS_ENUM).optional(),
  estatisticas: EstatisticasSimuladoSchema,
  questoes: z.array(QuestaoRespondidaSchema),
  xpGanho: z.number().min(0).optional(),
  conquistas: z.array(z.enum(BADGES_ENUM)).optional().default([]),
});

export const UserSettingsSchema = z.object({
  tema: z.enum(["dark", "light", "system"]).default("system"),
  somEnabled: z.boolean().default(true),
  animacoesEnabled: z.boolean().default(true),
  tempoPadraoProva: z.number().int().min(1).max(300).default(60),
  mostrarExplicacaoImediata: z.boolean().default(false),
});

// ── Funções de validação ──────────────────────────────────────

export function validateHistoricoSimulado(data: unknown): HistoricoSimulado {
  return HistoricoSimuladoSchema.parse(data);
}

export function validateUserProgress(data: unknown): UserProgress {
  return UserProgressSchema.parse(data);
}

export function validateUserSettings(data: unknown): UserSettings {
  return UserSettingsSchema.parse(data);
}

export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error };
}

// ── Type guards ───────────────────────────────────────────────

export function isDisciplina(value: string): value is Disciplina {
  return (DISCIPLINAS_ENUM as readonly string[]).includes(value);
}

export function isModoSimulado(value: string): value is ModoSimulado {
  return (MODOS_ENUM as readonly string[]).includes(value);
}

export function getDisciplinaLabel(disciplina: Disciplina): string {
  return DISCIPLINAS_LABELS[disciplina];
}

export function getDisciplinaCor(disciplina: Disciplina): string {
  return DISCIPLINAS_CORES[disciplina];
}

// ============================================================
// SEÇÃO 5 — GAMIFICAÇÃO
// ============================================================

// ── Configuração de níveis ────────────────────────────────────

/**
 * Valor sentinela para xpMax do nível máximo.
 * Nomeado para evitar o magic number 999999 espalhado pelo código.
 */
export const XP_MAX_NIVEL = 999_999;

/**
 * Tabela de níveis ordenada do menor para o maior.
 * xpMin é inclusivo; xpMax é o limite superior (exclusivo para os demais,
 * tratado como "infinito" no nível máximo via XP_MAX_NIVEL).
 */
export const NIVEIS: NivelInfo[] = [
  {
    nivel: 1,
    nome: "Estagiário",
    xpMin: 0,
    xpMax: 100,
    cor: "#64748b",
    icone: "🌱",
  },
  {
    nivel: 2,
    nome: "Assistente",
    xpMin: 100,
    xpMax: 250,
    cor: "#3b82f6",
    icone: "📋",
  },
  {
    nivel: 3,
    nome: "Técnico",
    xpMin: 250,
    xpMax: 500,
    cor: "#06b6d4",
    icone: "🔧",
  },
  {
    nivel: 4,
    nome: "Analista",
    xpMin: 500,
    xpMax: 1000,
    cor: "#8b5cf6",
    icone: "📊",
  },
  {
    nivel: 5,
    nome: "Agente Federal",
    xpMin: 1000,
    xpMax: 2000,
    cor: "#ec4899",
    icone: "⭐",
  },
  {
    nivel: 6,
    nome: "Agente Especial",
    xpMin: 2000,
    xpMax: 3500,
    cor: "#f59e0b",
    icone: "🌟",
  },
  {
    nivel: 7,
    nome: "Inspetor",
    xpMin: 3500,
    xpMax: 5500,
    cor: "#ef4444",
    icone: "🎯",
  },
  {
    nivel: 8,
    nome: "Supervisor",
    xpMin: 5500,
    xpMax: 8000,
    cor: "#10b981",
    icone: "👑",
  },
  {
    nivel: 9,
    nome: "Coordenador",
    xpMin: 8000,
    xpMax: 12000,
    cor: "#6366f1",
    icone: "💎",
  },
  {
    nivel: 10,
    nome: "Superintendente",
    xpMin: 12000,
    xpMax: XP_MAX_NIVEL,
    cor: "#ffd700",
    icone: "🏆",
  },
] as const;

const NIVEL_MAXIMO = NIVEIS[NIVEIS.length - 1];

// ── Recompensas de XP (MELHORADO) ─────────────────────────────────────────

export const XP_REWARDS = {
  QUESTAO_RESPONDIDA: 1,
  ACERTO: 10,
  SIMULADO_COMPLETO: 50,
  SIMULADO_TURBO: 30,
  SIMULADO_ADAPTATIVO: 60,
  TREINO_DISCIPLINA: 20,
  REVISAO_ERROS: 15,
  STREAK_DIA: 25,
  STREAK_3: 50,
  STREAK_7: 100,
  STREAK_30: 500,
  NOVO_RECORDE_PONTUACAO: 75,
  NOVO_RECORDE_VELOCIDADE: 50,
  DISCIPLINA_DOMINADA: 100,
  PROVA_PERFEITA: 200,
} as const;

/**
 * Informações detalhadas sobre recompensas de XP
 * @example
 * const rewardInfo = XP_REWARDS_INFO.ACERTO;
 * console.log(`${rewardInfo.descricao}: ${rewardInfo.value} XP`);
 */
export const XP_REWARDS_INFO: Record<XPRewardKey, XPRewardInfo> = {
  QUESTAO_RESPONDIDA: {
    value: 1,
    descricao: "Responder qualquer questão",
    categoria: "questao",
  },
  ACERTO: {
    value: 10,
    descricao: "Acertar uma questão",
    categoria: "questao",
  },
  SIMULADO_COMPLETO: {
    value: 50,
    descricao: "Completar simulado completo",
    categoria: "simulado",
  },
  SIMULADO_TURBO: {
    value: 30,
    descricao: "Completar modo turbo",
    categoria: "simulado",
  },
  SIMULADO_ADAPTATIVO: {
    value: 60,
    descricao: "Completar modo adaptativo",
    categoria: "simulado",
  },
  TREINO_DISCIPLINA: {
    value: 20,
    descricao: "Completar treino por disciplina",
    categoria: "simulado",
  },
  REVISAO_ERROS: {
    value: 15,
    descricao: "Completar revisão de erros",
    categoria: "simulado",
  },
  STREAK_DIA: {
    value: 25,
    descricao: "Manter streak diário",
    categoria: "streak",
  },
  STREAK_3: {
    value: 50,
    descricao: "3 dias consecutivos",
    categoria: "streak",
  },
  STREAK_7: {
    value: 100,
    descricao: "7 dias consecutivos",
    categoria: "streak",
  },
  STREAK_30: {
    value: 500,
    descricao: "30 dias consecutivos",
    categoria: "streak",
  },
  NOVO_RECORDE_PONTUACAO: {
    value: 75,
    descricao: "Bater recorde de pontuação",
    categoria: "recorde",
  },
  NOVO_RECORDE_VELOCIDADE: {
    value: 50,
    descricao: "Bater recorde de velocidade",
    categoria: "recorde",
  },
  DISCIPLINA_DOMINADA: {
    value: 100,
    descricao: "Dominar uma disciplina",
    categoria: "conquista",
  },
  PROVA_PERFEITA: {
    value: 200,
    descricao: "Acerrar todas as questões",
    categoria: "conquista",
  },
};

// ── Configuração de badges (MELHORADO COM NÍVEIS) ─────────────────────────

/**
 * Badges niveladas (streaks)
 */
export const BADGES_NIVELADAS: Record<string, BadgeNiveladaConfig> = {
  streak: {
    nome: "Consistência",
    descricaoBase: "Dias consecutivos de estudo",
    niveis: [
      { nivel: 1, meta: 3, badgeId: "streak-3", descricao: "3 dias" },
      { nivel: 2, meta: 7, badgeId: "streak-7", descricao: "7 dias" },
      { nivel: 3, meta: 30, badgeId: "streak-30", descricao: "30 dias" },
    ],
  },
};

/**
 * @example
 * const streakBadges = getBadgesPorNivel("streak", progress.streakDias);
 * console.log(`Desbloqueou: ${streakBadges.length} badges de streak`);
 *
 * @remarks Atualmente suporta apenas a categoria "streak". Para extensão,
 * adicione novas categorias em BADGES_NIVELADAS.
 */
export function getBadgesPorNivel(
  categoria: string,
  valor: number,
): BadgeType[] {
  const config = BADGES_NIVELADAS[categoria];
  if (!config) return [];

  return config.niveis
    .filter((nivel) => valor >= nivel.meta)
    .map((nivel) => nivel.badgeId);
}

export const BADGES_CONFIG: Record<
  BadgeType,
  {
    titulo: string;
    descricao: string;
    condicao: (progress: UserProgress, extras?: BadgeExtras) => boolean;
  }
> = {
  primeiro: {
    titulo: "Primeiro de Muitos",
    descricao: "Complete seu primeiro simulado",
    condicao: (p) => p.conquistas.simuladosCompletos >= 1,
  },

  "streak-3": {
    titulo: "Consistência",
    descricao: "3 dias de estudo consecutivos",
    condicao: (p) => p.streakDias >= 3,
  },

  "streak-7": {
    titulo: "Fogo no Papel",
    descricao: "7 dias de estudo consecutivos",
    condicao: (p) => p.streakDias >= 7,
  },

  "streak-30": {
    titulo: "Máquina de Estudos",
    descricao: "30 dias de estudo consecutivos",
    condicao: (p) => p.streakDias >= 30,
  },

  "cebraspe-master": {
    titulo: "Cebraspe Master",
    descricao: "60+ pontos em um simulado, tendo completado 3 ou mais",
    condicao: (p, extras) =>
      p.conquistas.simuladosCompletos >= 3 &&
      (extras?.simuladoPontuacao ?? 0) >= 60,
  },

  polivalente: {
    titulo: "Polivalente",
    descricao:
      "70%+ de aproveitamento em todas as disciplinas respondidas (mín. 5)",
    condicao: (_p, extras) => {
      if (!extras?.disciplinaStats) return false;

      // FIX: iteração segura sem cast inseguro
      const entries = Object.entries(extras.disciplinaStats) as Array<
        [string, { acertos: number; total: number }]
      >;
      const disciplinasComDados = entries.filter(
        ([, stats]) => stats.total > 0,
      ) as Array<[Disciplina, { acertos: number; total: number }]>;

      if (disciplinasComDados.length < 5) return false;

      return disciplinasComDados.every(
        ([, stats]) => stats.acertos / stats.total >= 0.7,
      );
    },
  },

  velocista: {
    titulo: "Velocista",
    descricao: "Complete o modo Turbo em menos de 30 minutos",
    condicao: (_p, extras) =>
      extras?.turboTempo != null && extras.turboTempo < 30 * 60,
  },

  perfeccionista: {
    titulo: "Perfeccionista",
    descricao: "Acerte todas as questões de um simulado",
    condicao: (_p, extras) => {
      if (extras?.simuladoAcertos == null || extras?.simuladoTotal == null)
        return false;
      return (
        extras.simuladoAcertos === extras.simuladoTotal &&
        extras.simuladoTotal > 0
      );
    },
  },

  persistent: {
    titulo: "Persistente",
    descricao: "Complete 10 simulados",
    condicao: (p) => p.conquistas.simuladosCompletos >= 10,
  },

  "nivel-5": {
    titulo: "Agente Federal",
    descricao: "Alcance o nível 5",
    condicao: (p) => p.nivel >= 5,
  },

  "nivel-10": {
    titulo: "Superintendente",
    descricao: "Alcance o nível máximo",
    condicao: (p) => p.nivel >= 10,
  },

  "nivel-max": {
    titulo: "Lenda da PRF",
    descricao: "Nível 10 com ao menos 9 conquistas desbloqueadas",
    condicao: (p) =>
      p.nivel >= 10 && p.badges.filter((b) => b.id !== "nivel-max").length >= 9,
  },
};

// ── Funções de gamificação ────────────────────────────────────

/**
 * Calcula o nível correspondente ao XP total.
 * Guard para xpTotal negativo (dados corrompidos) – loga warning.
 *
 * @example
 * const nivel = calcularNivel(1250);
 * console.log(`Nível ${nivel.nivel}: ${nivel.nome} ${nivel.icone}`);
 */
export function calcularNivel(xpTotal: number): NivelInfo {
  const xp = Math.max(0, xpTotal);
  if (xpTotal < 0) {
    console.warn(
      `calcularNivel: xpTotal negativo (${xpTotal}) – ajustado para 0`,
    );
  }
  for (let i = NIVEIS.length - 1; i >= 0; i--) {
    if (xp >= NIVEIS[i].xpMin) return NIVEIS[i];
  }
  return NIVEIS[0];
}

/**
 * Retorna o XP restante para o próximo nível.
 * No nível máximo retorna 0 — o usuário já chegou ao topo.
 * Protege contra XP > xpMax retornando negativo.
 *
 * @example
 * const restante = xpParaProximoNivel(250);
 * console.log(`Faltam ${restante} XP para o próximo nível`);
 */
export function xpParaProximoNivel(xpTotal: number): number {
  const nivel = calcularNivel(xpTotal);
  if (nivel.nivel === NIVEL_MAXIMO.nivel) return 0;
  return Math.max(0, nivel.xpMax - Math.max(0, xpTotal));
}

/**
 * Calcula o progresso percentual dentro do nível atual (0–100).
 * No nível máximo retorna 100 imediatamente — a barra está cheia.
 * Limita o numerador para evitar >100.
 *
 * @example
 * const progresso = calcularProgressoNivel(250);
 * console.log(`Progresso: ${progresso}%`);
 */
export function calcularProgressoNivel(xpTotal: number): number {
  const xp = Math.max(0, xpTotal);
  const nivel = calcularNivel(xp);

  if (nivel.nivel === NIVEL_MAXIMO.nivel) return 100;

  const xpNoNivel = Math.min(xp - nivel.xpMin, nivel.xpMax - nivel.xpMin);
  const xpTotalNivel = nivel.xpMax - nivel.xpMin;

  if (xpTotalNivel <= 0) return 100;

  return Math.min(100, Math.max(0, (xpNoNivel / xpTotalNivel) * 100));
}

/**
 * Verifica quais conquistas foram desbloqueadas que o usuário ainda não tem.
 * Retorna apenas badges novos.
 */
export function verificarNovasConquistas(
  progress: UserProgress,
  extras?: BadgeExtras,
): BadgeType[] {
  const existentes = new Set(progress.badges.map((b) => b.id));
  const novas: BadgeType[] = [];

  for (const badgeId of Object.keys(BADGES_CONFIG) as BadgeType[]) {
    if (existentes.has(badgeId)) continue;
    if (BADGES_CONFIG[badgeId].condicao(progress, extras)) {
      novas.push(badgeId);
    }
  }

  return novas;
}

/**
 * Cria um objeto de progresso inicial para um novo usuário.
 * Fonte única — não duplicar em outros módulos.
 * Nota: xpAtual é mantido por compatibilidade, mas deve sempre ser igual a xpTotal.
 *
 * @example
 * const novoUsuario = criarProgressoInicial();
 * console.log(`Bem vindo! Você está no nível ${novoUsuario.nivel}`);
 */
export function criarProgressoInicial(): UserProgress {
  return {
    nivel: 1,
    xpTotal: 0,
    xpAtual: 0, // mantido para compatibilidade, sempre igual a xpTotal
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

// ============================================================
// SEÇÃO 6 — BANCO DE QUESTÕES E CONFIGURAÇÕES DA PROVA
// ============================================================

export const TEMPO_PROVA_MINUTOS = 240;
export const TEMPO_TURBO_MINUTOS = 40;

export const ESTRUTURA_PROVA: EstruturaProva = {
  conhecimentosBasicos: {
    total: 24,
    disciplinas: {
      PORTUGUES: 12,
      ETICA: 6,
      RACIOCINIO_LOGICO: 6,
    } as Partial<Record<Disciplina, number>>,
  },
  conhecimentosEspecificos: {
    total: 36,
    disciplinas: {
      DIREITO_CONSTITUCIONAL: 6,
      DIREITO_ADMINISTRATIVO: 6,
      ADMINISTRACAO: 6,
      ARQUIVOLOGIA: 6,
      INFORMATICA: 6,
      LEGISLACAO_PRF: 6,
    } as Partial<Record<Disciplina, number>>,
  },
};

export const MODOS_CONFIG: Record<string, ModoConfig> = {
  completo: {
    nome: "Simulado Completo",
    descricao: "Prova oficial: 24 questões básicas + 36 específicas",
    totalQuestoes: 60,
    tempoMinutos: 240,
    xpBase: 50,
    cor: "#3b82f6",
    icone: "Play",
  },
  turbo: {
    nome: "Modo Turbo",
    descricao: "50 questões rápidas para revisão diária",
    totalQuestoes: 50,
    tempoMinutos: 40,
    xpBase: 30,
    cor: "#f59e0b",
    icone: "Zap",
  },
  adaptativo: {
    nome: "Modo Adaptativo",
    descricao: "IA personaliza baseada no seu histórico",
    totalQuestoes: 60,
    tempoMinutos: 240,
    xpBase: 60,
    cor: "#8b5cf6",
    icone: "Brain",
  },
  disciplina: {
    nome: "Treino por Disciplina",
    descricao: "Foque na sua disciplina mais fraca",
    totalQuestoes: 20,
    tempoMinutos: 30,
    xpBase: 20,
    cor: "#10b981",
    icone: "BookOpen",
  },
  erros: {
    nome: "Revisar Erros",
    descricao: "Treine apenas questões que você errou",
    totalQuestoes: 30,
    tempoMinutos: 30,
    xpBase: 15,
    cor: "#ef4444",
    icone: "XCircle",
  },
};

// ── Banco de questões ─────────────────────────────────────────
// Nota: Para produção, considere lazy loading dinâmico (import()) para reduzir bundle inicial.
import { questoesAdministracao } from "./bancodequestao/administracao";
import { questoesArquivologia } from "./bancodequestao/arquivologia";
import { questoesDireitoAdministrativo } from "./bancodequestao/direito-administrativo";
import { questoesDireitoConstitucional } from "./bancodequestao/direito-constitucional";
import { questoesEtica } from "./bancodequestao/etica";
import { questoesInformatica } from "./bancodequestao/informatica";
import { questoesLegislacaoPRF } from "./bancodequestao/legislacao-prf";
import { questoesPortugues } from "./bancodequestao/portugues";
import { questoesRaciocinioLogico } from "./bancodequestao/raciocinio-logico";

export const questoes: Questao[] = [
  ...questoesPortugues,
  ...questoesEtica,
  ...questoesRaciocinioLogico,
  ...questoesDireitoConstitucional,
  ...questoesDireitoAdministrativo,
  ...questoesAdministracao,
  ...questoesArquivologia,
  ...questoesInformatica,
  ...questoesLegislacaoPRF,
];

// ============================================================
// SEÇÃO 6.1 — CACHE PARA QUERIES FREQUENTES
// ============================================================

/**
 * Cache singleton para queries frequentes
 * Melhora performance evitando recálculos desnecessários
 *
 * @example
 * const cache = QuestaoCache.getInstance();
 * const questoesPortugues = cache.getQuestoesPorDisciplina("PORTUGUES");
 */
export class QuestaoCache {
  private static instance: QuestaoCache;
  private cache = new Map<string, unknown>();
  private timestamps = new Map<string, number>();
  private readonly TTL = 5 * 60 * 1000;

  private constructor() {}

  static getInstance(): QuestaoCache {
    if (!QuestaoCache.instance) {
      QuestaoCache.instance = new QuestaoCache();
    }
    return QuestaoCache.instance;
  }

  private isExpired(key: string): boolean {
    const timestamp = this.timestamps.get(key);
    if (!timestamp) return true;
    // NOTA: TTL baseado em Date.now() assume sistema sem hibernação prolongada.
    // Para maior precisão, poderia ser usado performance.now() ou verificação híbrida.
    return Date.now() - timestamp > this.TTL;
  }

  private setCache(key: string, value: unknown): void {
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  getQuestoesPorDisciplina(disciplina: Disciplina): Questao[] {
    const key = `disciplina:${disciplina}`;
    if (!this.isExpired(key) && this.cache.has(key)) {
      return this.cache.get(key) as Questao[];
    }
    const result = questoes.filter((q) => q.disciplina === disciplina);
    this.setCache(key, result);
    return result;
  }

  getQuestoesPorDificuldade(dificuldade: NivelDificuldade): Questao[] {
    const key = `dificuldade:${dificuldade}`;
    if (!this.isExpired(key) && this.cache.has(key)) {
      return this.cache.get(key) as Questao[];
    }
    const result = questoes.filter((q) => q.dificuldade === dificuldade);
    this.setCache(key, result);
    return result;
  }

  getQuestoesPorBanca(banca: string): Questao[] {
    const key = `banca:${banca}`;
    if (!this.isExpired(key) && this.cache.has(key)) {
      return this.cache.get(key) as Questao[];
    }
    const result = questoes.filter((q) => q.banca_referencia === banca);
    this.setCache(key, result);
    return result;
  }

  getEstatisticasBanco(): StatsData {
    const key = "estatisticas:banco";
    if (!this.isExpired(key) && this.cache.has(key)) {
      return this.cache.get(key) as StatsData;
    }
    const result = getEstatisticasBanco();
    this.setCache(key, result);
    return result;
  }

  invalidate(): void {
    this.cache.clear();
    this.timestamps.clear();
  }

  invalidateKey(key: string): void {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }
}

// ── Índices para buscas frequentes (otimização) ───────────────────────────

/**
 * Índices para buscas rápidas usando Map
 * Performance O(1) em vez de O(n)
 */
export class QuestaoIndices {
  private static instance: QuestaoIndices;
  private indices: {
    porId: Map<string, Questao>;
    porDisciplina: Map<Disciplina, Questao[]>;
    porDificuldade: Map<NivelDificuldade, Questao[]>;
    porAno: Map<number, Questao[]>;
    porAssunto: Map<string, Questao[]>;
    porDisciplinaDificuldade: Map<string, Questao[]>; // NOVO: índice composto
  };

  private constructor() {
    this.indices = {
      porId: new Map(),
      porDisciplina: new Map(),
      porDificuldade: new Map(),
      porAno: new Map(),
      porAssunto: new Map(),
      porDisciplinaDificuldade: new Map(),
    };
    this.construirIndices();
  }

  static getInstance(): QuestaoIndices {
    if (!QuestaoIndices.instance) {
      QuestaoIndices.instance = new QuestaoIndices();
    }
    return QuestaoIndices.instance;
  }

  private construirIndices(): void {
    // Inicializar maps
    DISCIPLINAS_ENUM.forEach((d) => this.indices.porDisciplina.set(d, []));

    // Construir índices
    for (const q of questoes) {
      // Índice por ID
      this.indices.porId.set(q.id, q);

      // Índice por disciplina
      this.indices.porDisciplina.get(q.disciplina)?.push(q);

      // Índice por dificuldade
      if (!this.indices.porDificuldade.has(q.dificuldade)) {
        this.indices.porDificuldade.set(q.dificuldade, []);
      }
      this.indices.porDificuldade.get(q.dificuldade)!.push(q);

      // Índice composto disciplina+dificuldade
      const compostoKey = `${q.disciplina}:${q.dificuldade}`;
      if (!this.indices.porDisciplinaDificuldade.has(compostoKey)) {
        this.indices.porDisciplinaDificuldade.set(compostoKey, []);
      }
      this.indices.porDisciplinaDificuldade.get(compostoKey)!.push(q);

      // Índice por ano
      if (q.ano) {
        if (!this.indices.porAno.has(q.ano)) {
          this.indices.porAno.set(q.ano, []);
        }
        this.indices.porAno.get(q.ano)!.push(q);
      }

      // Índice por assunto
      if (q.assunto) {
        const assuntoKey = q.assunto.toLowerCase();
        if (!this.indices.porAssunto.has(assuntoKey)) {
          this.indices.porAssunto.set(assuntoKey, []);
        }
        this.indices.porAssunto.get(assuntoKey)!.push(q);
      }
    }
  }

  getQuestaoById(id: string): Questao | undefined {
    return this.indices.porId.get(id);
  }

  getQuestoesPorDisciplina(disciplina: Disciplina): Questao[] {
    return this.indices.porDisciplina.get(disciplina) || [];
  }

  getQuestoesPorDificuldade(dificuldade: NivelDificuldade): Questao[] {
    return this.indices.porDificuldade.get(dificuldade) || [];
  }

  getQuestoesPorDisciplinaEDificuldade(
    disciplina: Disciplina,
    dificuldade: NivelDificuldade,
  ): Questao[] {
    const key = `${disciplina}:${dificuldade}`;
    return this.indices.porDisciplinaDificuldade.get(key) || [];
  }

  getQuestoesPorAno(ano: number): Questao[] {
    return this.indices.porAno.get(ano) || [];
  }

  getQuestoesPorAssunto(assunto: string): Questao[] {
    return this.indices.porAssunto.get(assunto.toLowerCase()) || [];
  }

  rebuild(): void {
    this.indices = {
      porId: new Map(),
      porDisciplina: new Map(),
      porDificuldade: new Map(),
      porAno: new Map(),
      porAssunto: new Map(),
      porDisciplinaDificuldade: new Map(),
    };
    this.construirIndices();
    // FIX: Invalidar cache global para evitar dados dessincronizados
    QuestaoCache.getInstance().invalidate();
  }
}

// ============================================================
// SEÇÃO 7 — ESTATÍSTICAS E ANÁLISE DO BANCO
// ============================================================

export interface StatsData {
  total: number;
  porDificuldade: { 1: number; 2: number; 3: number };
  mediaDificuldade: string;
  totalComTags: number;
  totalComFonteLegal: number;
  totalComBanca: number;
  totalComAssunto: number;
  totalComAno: number;
  /** Questões dos últimos 2 anos (ano corrente e anterior) – nome corrigido */
  questoesUltimosDoisAnos: number;
  /** Taxa de acerto média dos usuários (0-100). null quando não disponível. */
  taxaAcertoMedia: number | null;
  /** Quantidade de questões por ano — chave: "YYYY" */
  questoesPorAno: Record<string, number>;
  /** Top 10 bancas — chave: nome da banca, valor: total de questões */
  bancasPrincipais: Record<string, number>;
}

export function getStatsPorDisciplina() {
  const counts = new Map<Disciplina, number>();
  for (const q of questoes) {
    counts.set(q.disciplina, (counts.get(q.disciplina) ?? 0) + 1);
  }
  return DISCIPLINAS_ENUM.filter((d) => counts.has(d))
    .map((d) => ({
      disciplina: d,
      nome: DISCIPLINAS_NOME[d],
      count: counts.get(d) ?? 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function contarQuestoesPorDisciplina(): Record<Disciplina, number> {
  const contagem = Object.fromEntries(
    DISCIPLINAS_ENUM.map((d) => [d, 0]),
  ) as Record<Disciplina, number>;

  for (const q of questoes) {
    if (isDisciplina(q.disciplina)) {
      contagem[q.disciplina]++;
    }
  }

  return contagem;
}

/**
 * Estatísticas por dificuldade (NOVO)
 *
 * @example
 * const stats = getEstatisticasPorDificuldade();
 * console.log(`Questões fáceis: ${stats[1].total} (${stats[1].percentual}%)`);
 */
export function getEstatisticasPorDificuldade(disciplina?: Disciplina) {
  const filtro = disciplina
    ? questoes.filter((q) => q.disciplina === disciplina)
    : questoes;

  const total = filtro.length;

  const stats = {
    1: {
      total: filtro.filter((q) => q.dificuldade === 1).length,
      percentual: 0,
    },
    2: {
      total: filtro.filter((q) => q.dificuldade === 2).length,
      percentual: 0,
    },
    3: {
      total: filtro.filter((q) => q.dificuldade === 3).length,
      percentual: 0,
    },
  };

  // Calcular percentuais
  if (total > 0) {
    stats[1].percentual = (stats[1].total / total) * 100;
    stats[2].percentual = (stats[2].total / total) * 100;
    stats[3].percentual = (stats[3].total / total) * 100;
  }

  return stats;
}

export function getEstatisticasBanco(): StatsData {
  const total = questoes.length;

  const porDificuldade = { 1: 0, 2: 0, 3: 0 };
  let somaDificuldade = 0;
  let totalComTags = 0;
  let totalComFonteLegal = 0;
  let totalComBanca = 0;
  let totalComAssunto = 0;
  let totalComAno = 0;

  const bancasMap: Record<string, number> = {};
  const anosMap: Record<string, number> = {};

  const anoAtual = new Date().getFullYear();
  let questoesUltimosDoisAnos = 0;

  for (const q of questoes) {
    if (q.dificuldade === 1 || q.dificuldade === 2 || q.dificuldade === 3) {
      porDificuldade[q.dificuldade]++;
      somaDificuldade += q.dificuldade;
    }

    if (q.tags && q.tags.length > 0) totalComTags++;
    if (q.fonte_legal && q.fonte_legal.length > 0) totalComFonteLegal++;
    if (q.banca_referencia) totalComBanca++;
    if (q.assunto) totalComAssunto++;
    if (q.ano) totalComAno++;

    if (q.banca_referencia) {
      bancasMap[q.banca_referencia] = (bancasMap[q.banca_referencia] ?? 0) + 1;
    }

    if (q.ano) {
      const chave = String(q.ano);
      anosMap[chave] = (anosMap[chave] ?? 0) + 1;
      // FIX: agora conta exatamente os últimos dois anos (ano atual e anterior)
      if (q.ano >= anoAtual - 1) questoesUltimosDoisAnos++;
    }
  }

  const bancasPrincipais = Object.fromEntries(
    Object.entries(bancasMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
  );

  const mediaDificuldade =
    total > 0 ? (somaDificuldade / total).toFixed(2) : "0.00";

  return {
    total,
    porDificuldade,
    mediaDificuldade,
    totalComTags,
    totalComFonteLegal,
    totalComBanca,
    totalComAssunto,
    totalComAno,
    questoesUltimosDoisAnos, // nome corrigido
    taxaAcertoMedia: null,
    questoesPorAno: anosMap,
    bancasPrincipais,
  };
}

// ============================================================
// SEÇÃO 7.1 — MÉTRICAS DE PERFORMANCE (CORRIGIDO)
// ============================================================

/**
 * Calcula métricas de performance baseadas no histórico do usuário
 * AGORA COM PROTEÇÃO CONTRA HISTÓRICO VAZIO E DIVISÃO POR ZERO.
 *
 * @example
 * const metrics = calcularMetricasPerformance(historicoSimulados);
 * console.log(`Disciplina mais forte: ${metrics.disciplinaMaisForte}`);
 * console.log(`Consistência: ${metrics.consistencia}`);
 */
export function calcularMetricasPerformance(
  historico: HistoricoSimulado[],
): PerformanceMetrics {
  // Se não houver histórico, retornar métricas vazias/neutras
  if (historico.length === 0) {
    const emptyTempo: Record<Disciplina, number> = {} as Record<
      Disciplina,
      number
    >;
    for (const d of DISCIPLINAS_ENUM) emptyTempo[d] = 0;
    const emptyTaxa: Record<NivelDificuldade, number> = { 1: 0, 2: 0, 3: 0 };
    return {
      tempoMedioPorDisciplina: emptyTempo,
      taxaAcertoPorDificuldade: emptyTaxa,
      questoesMaisErradas: [],
      eficienciaPorTempo: 0,
      consistencia: "baixa",
      disciplinaMaisForte: null,
      disciplinaMaisFraca: null,
    };
  }

  const tempoPorDisciplina: Record<
    Disciplina,
    { total: number; count: number }
  > = {
    PORTUGUES: { total: 0, count: 0 },
    ETICA: { total: 0, count: 0 },
    RACIOCINIO_LOGICO: { total: 0, count: 0 },
    DIREITO_CONSTITUCIONAL: { total: 0, count: 0 },
    DIREITO_ADMINISTRATIVO: { total: 0, count: 0 },
    ADMINISTRACAO: { total: 0, count: 0 },
    ARQUIVOLOGIA: { total: 0, count: 0 },
    INFORMATICA: { total: 0, count: 0 },
    LEGISLACAO_PRF: { total: 0, count: 0 },
  };

  const acertosPorDificuldade: Record<
    NivelDificuldade,
    { acertos: number; total: number }
  > = {
    1: { acertos: 0, total: 0 },
    2: { acertos: 0, total: 0 },
    3: { acertos: 0, total: 0 },
  };
  const errosPorQuestao: Map<
    string,
    { erros: number; total: number; disciplina: Disciplina }
  > = new Map();

  // Processar histórico
  for (const simulado of historico) {
    for (const questao of simulado.questoes) {
      // Tempo por disciplina
      if (questao.tempoGasto) {
        tempoPorDisciplina[questao.disciplina].total += questao.tempoGasto;
        tempoPorDisciplina[questao.disciplina].count++;
      }

      // Acertos por dificuldade
      if (questao.respostaUsuario === questao.resposta) {
        acertosPorDificuldade[questao.dificuldade].acertos++;
      }
      acertosPorDificuldade[questao.dificuldade].total++;

      // Erros por questão
      if (
        questao.respostaUsuario &&
        questao.respostaUsuario !== questao.resposta
      ) {
        const stats = errosPorQuestao.get(questao.id) || {
          erros: 0,
          total: 0,
          disciplina: questao.disciplina,
        };
        stats.erros++;
        stats.total++;
        errosPorQuestao.set(questao.id, stats);
      } else if (questao.respostaUsuario === questao.resposta) {
        const stats = errosPorQuestao.get(questao.id) || {
          erros: 0,
          total: 0,
          disciplina: questao.disciplina,
        };
        stats.total++;
        errosPorQuestao.set(questao.id, stats);
      }
    }
  }

  // Calcular tempo médio por disciplina (protegido contra count === 0)
  const tempoMedioPorDisciplina = {} as Record<Disciplina, number>;
  for (const [disc, data] of Object.entries(tempoPorDisciplina)) {
    tempoMedioPorDisciplina[disc as Disciplina] =
      data.count > 0 ? data.total / data.count : 0;
  }

  // Calcular taxa de acerto por dificuldade
  const taxaAcertoPorDificuldade = {} as Record<NivelDificuldade, number>;
  for (const [dificuldade, data] of Object.entries(acertosPorDificuldade)) {
    taxaAcertoPorDificuldade[Number(dificuldade) as NivelDificuldade] =
      data.total > 0 ? (data.acertos / data.total) * 100 : 0;
  }

  // Identificar questões mais erradas
  const questoesMaisErradas = Array.from(errosPorQuestao.entries())
    .map(([id, data]) => ({
      id,
      taxaErro: data.total > 0 ? (data.erros / data.total) * 100 : 0,
      disciplina: data.disciplina,
    }))
    .sort((a, b) => b.taxaErro - a.taxaErro)
    .slice(0, 10);

  // Calcular eficiência por tempo (acertos por minuto)
  const totalAcertos = historico.reduce(
    (sum, h) => sum + h.estatisticas.acertos,
    0,
  );
  const totalTempo = historico.reduce(
    (sum, h) => sum + h.estatisticas.tempoTotal,
    0,
  );
  const eficienciaPorTempo =
    totalTempo > 0 ? totalAcertos / (totalTempo / 60) : 0;

  // Calcular consistência (desvio padrão das pontuações) – protegido
  const pontuacoes = historico.map((h) => h.estatisticas.percentual);
  const media = pontuacoes.reduce((a, b) => a + b, 0) / pontuacoes.length;
  const desvioPadrao = Math.sqrt(
    pontuacoes.reduce((sq, n) => sq + Math.pow(n - media, 2), 0) /
      pontuacoes.length,
  );
  const consistencia =
    desvioPadrao < 10 ? "alta" : desvioPadrao < 20 ? "media" : "baixa";

  // Identificar disciplina mais forte e mais fraca
  const desempenhoPorDisciplina = new Map<
    Disciplina,
    { acertos: number; total: number }
  >();
  for (const simulado of historico) {
    for (const [disc, stats] of Object.entries(
      simulado.estatisticas.desempenhoPorDisciplina,
    )) {
      const current = desempenhoPorDisciplina.get(disc as Disciplina) || {
        acertos: 0,
        total: 0,
      };
      current.acertos += stats.acertos;
      current.total += stats.total;
      desempenhoPorDisciplina.set(disc as Disciplina, current);
    }
  }

  let disciplinaMaisForte: Disciplina | null = null;
  let disciplinaMaisFraca: Disciplina | null = null;
  let melhorTaxa = -1;
  let piorTaxa = 101;

  for (const [disc, data] of desempenhoPorDisciplina) {
    const taxa = data.total > 0 ? (data.acertos / data.total) * 100 : 0;
    if (taxa > melhorTaxa && data.total >= 5) {
      melhorTaxa = taxa;
      disciplinaMaisForte = disc;
    }
    if (taxa < piorTaxa && data.total >= 5) {
      piorTaxa = taxa;
      disciplinaMaisFraca = disc;
    }
  }

  return {
    tempoMedioPorDisciplina,
    taxaAcertoPorDificuldade,
    questoesMaisErradas,
    eficienciaPorTempo,
    consistencia,
    disciplinaMaisForte,
    disciplinaMaisFraca,
  };
}

// ============================================================
// SEÇÃO 8 — FUNÇÕES DE SELEÇÃO E BUSCA
// ============================================================

export function getQuestoesPorDisciplina(disciplina: Disciplina): Questao[] {
  return QuestaoIndices.getInstance().getQuestoesPorDisciplina(disciplina);
}

export function getQuestoesPorDificuldade(dificuldade: 1 | 2 | 3): Questao[] {
  return QuestaoIndices.getInstance().getQuestoesPorDificuldade(dificuldade);
}

export function getQuestoesPorBanca(banca: string): Questao[] {
  return questoes.filter((q) => q.banca_referencia === banca);
}

export function buscarQuestoes(termo: string): Questao[] {
  const t = termo.toLowerCase();
  return questoes.filter(
    (q) =>
      q.enunciado.toLowerCase().includes(t) ||
      q.explicacao.toLowerCase().includes(t) ||
      q.tags?.some((tag) => tag.toLowerCase().includes(t)),
  );
}

export function getQuestoesPorAssunto(assunto: string): Questao[] {
  return QuestaoIndices.getInstance().getQuestoesPorAssunto(assunto);
}

/** Fisher-Yates shuffle — retorna novo array sem modificar o original */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function selecionarQuestoesAleatorias(quantidade: number): Questao[] {
  return shuffle(questoes).slice(0, quantidade);
}

export function selecionarQuestoesPorDisciplina(
  disciplina: Disciplina,
  quantidade: number,
): Questao[] {
  return shuffle(getQuestoesPorDisciplina(disciplina)).slice(0, quantidade);
}

/**
 * Seleciona questões seguindo a distribuição oficial da prova.
 * AGORA: se alguma disciplina não tiver questões suficientes, repete questões
 * das disciplinas com maior disponibilidade para completar o simulado.
 */
export function selecionarQuestoesBalanceadas(): {
  questoes: Questao[];
  avisos: string[];
} {
  const selecionadas: Questao[] = [];
  const avisos: string[] = [];

  const todasEstrutura = {
    ...ESTRUTURA_PROVA.conhecimentosBasicos.disciplinas,
    ...ESTRUTURA_PROVA.conhecimentosEspecificos.disciplinas,
  };

  // Primeira tentativa: selecionar o máximo possível de cada disciplina
  const faltantesPorDisciplina: Map<Disciplina, number> = new Map();

  for (const [disciplina, quantidade] of Object.entries(todasEstrutura)) {
    if (!quantidade) continue;

    const disponivel = getQuestoesPorDisciplina(disciplina as Disciplina);
    const selecionadasDisciplina = shuffle(disponivel).slice(0, quantidade);

    if (selecionadasDisciplina.length < quantidade) {
      avisos.push(
        `${DISCIPLINAS_NOME[disciplina as Disciplina]}: solicitadas ${quantidade}, disponíveis ${selecionadasDisciplina.length}`,
      );
      faltantesPorDisciplina.set(
        disciplina as Disciplina,
        quantidade - selecionadasDisciplina.length,
      );
    }

    selecionadas.push(...selecionadasDisciplina);
  }

  // Se houver faltantes, preencher com questões de disciplinas que têm excesso
  if (faltantesPorDisciplina.size > 0) {
    const disciplinasComExcesso = DISCIPLINAS_ENUM.filter((d) => {
      const totalDisponivel = getQuestoesPorDisciplina(d).length;
      const necessidade = todasEstrutura[d] ?? 0;
      return totalDisponivel > necessidade;
    });

    for (const [disciplina, faltam] of faltantesPorDisciplina) {
      let repostas = 0;
      for (const excessoDisc of disciplinasComExcesso) {
        if (repostas >= faltam) break;
        const questoesExcesso = shuffle(getQuestoesPorDisciplina(excessoDisc));
        const pegar = Math.min(faltam - repostas, questoesExcesso.length);
        selecionadas.push(...questoesExcesso.slice(0, pegar));
        repostas += pegar;
        avisos.push(
          `Preenchendo falta de ${DISCIPLINAS_NOME[disciplina]} com ${pegar} questão(ões) de ${DISCIPLINAS_NOME[excessoDisc]}`,
        );
      }
    }
  }

  return { questoes: selecionadas, avisos };
}

// ============================================================
// SEÇÃO 8.1 — SELEÇÃO ADAPTATIVA MELHORADA (COM FALLBACK)
// ============================================================

/**
 * Seleção adaptativa de questões baseada no histórico do usuário
 * AGORA GARANTE que a quantidade solicitada seja atingida, mesmo que
 * seja necessário repetir questões (quando evitarRepetidos ativo).
 *
 * @example
 * const result = selecionarQuestoesAdaptativas(historico, 20, {
 *   priorizarFraquezas: true,
 *   evitarRepetidos: true
 * });
 * console.log(`Priorizadas: ${result.metadados.disciplinasPriorizadas.join(", ")}`);
 */
export function selecionarQuestoesAdaptativas(
  historico: HistoricoSimulado[],
  quantidade: number,
  options?: Partial<SelecaoAdaptativaOptions>,
): SelecaoAdaptativaResult {
  const opts: SelecaoAdaptativaOptions = {
    priorizarFraquezas: true,
    evitarRepetidos: true,
    limiteQuestoesVistas: 3,
    pesoRecencia: 0.3,
    pesoDificuldade: 0.3,
    pesoErro: 0.4,
    ...options,
  };

  // Calcular pesos por disciplina baseado no histórico
  const pesosDisciplina = new Map<Disciplina, number>();
  const questoesVistas = new Map<string, number>(); // Questão -> vezes vista
  const questoesErradas = new Map<string, number>(); // Questão -> vezes errada

  // Contar questões vistas e erradas
  for (const simulado of historico) {
    for (const questao of simulado.questoes) {
      const vezes = questoesVistas.get(questao.id) || 0;
      questoesVistas.set(questao.id, vezes + 1);

      if (
        questao.respostaUsuario &&
        questao.respostaUsuario !== questao.resposta
      ) {
        const erros = questoesErradas.get(questao.id) || 0;
        questoesErradas.set(questao.id, erros + 1);
      }
    }
  }

  // Calcular taxa de erro por disciplina
  const taxaErroPorDisciplina = new Map<Disciplina, number>();
  const questoesPorDisciplina = new Map<
    Disciplina,
    { erros: number; total: number }
  >();

  for (const simulado of historico) {
    for (const [disc, stats] of Object.entries(
      simulado.estatisticas.desempenhoPorDisciplina,
    )) {
      const current = questoesPorDisciplina.get(disc as Disciplina) || {
        erros: 0,
        total: 0,
      };
      current.erros += stats.erros;
      current.total += stats.total;
      questoesPorDisciplina.set(disc as Disciplina, current);
    }
  }

  for (const [disc, data] of questoesPorDisciplina) {
    const taxa = data.total > 0 ? data.erros / data.total : 0;
    taxaErroPorDisciplina.set(disc, taxa);
  }

  // Calcular peso para cada disciplina
  for (const disc of DISCIPLINAS_ENUM) {
    let peso = 1.0;

    if (opts.priorizarFraquezas) {
      const taxaErro = taxaErroPorDisciplina.get(disc) || 0;
      peso += taxaErro * 2; // Dar mais peso para disciplinas com alta taxa de erro
    }

    pesosDisciplina.set(disc, peso);
  }

  // Normalizar pesos
  const somaPesos = Array.from(pesosDisciplina.values()).reduce(
    (a, b) => a + b,
    0,
  );
  const pesosNormalizados = new Map<Disciplina, number>();
  for (const [disc, peso] of pesosDisciplina) {
    pesosNormalizados.set(disc, peso / somaPesos);
  }

  // Determinar quantas questões por disciplina baseado nos pesos
  const questoesPorDisciplinaSelecao = new Map<Disciplina, number>();
  let restante = quantidade;

  for (const disc of DISCIPLINAS_ENUM) {
    const peso = pesosNormalizados.get(disc) ?? 1; // fallback seguro
    const qtd = Math.floor(peso * quantidade);
    if (qtd > 0) {
      questoesPorDisciplinaSelecao.set(disc, qtd);
      restante -= qtd;
    }
  }

  // Distribuir questões restantes
  let index = 0;
  while (restante > 0 && index < DISCIPLINAS_ENUM.length) {
    const disc = DISCIPLINAS_ENUM[index];
    const current = questoesPorDisciplinaSelecao.get(disc) || 0;
    questoesPorDisciplinaSelecao.set(disc, current + 1);
    restante--;
    index++;
  }

  // Selecionar questões específicas – com fallback para garantir quantidade
  const selecionadas: Questao[] = [];
  const questoesDisponiveis = getQuestoesDisponiveis(historico, opts);

  // Se houver poucas questões disponíveis, permitir repetição
  let questoesPool = questoesDisponiveis;
  if (opts.evitarRepetidos && questoesDisponiveis.length < quantidade) {
    console.warn(
      `Questões adaptativas: apenas ${questoesDisponiveis.length} novas disponíveis. Repetindo algumas para atingir ${quantidade}.`,
    );
    questoesPool = [...questoes]; // fallback: todas as questões
  }

  for (const [disc, qtd] of questoesPorDisciplinaSelecao) {
    const disponiveis = questoesPool.filter((q) => q.disciplina === disc);
    const selecionadasDisc = shuffle(disponiveis).slice(0, qtd);
    selecionadas.push(...selecionadasDisc);
  }

  // Se ainda não atingiu a quantidade (raro), completar com questões aleatórias
  if (selecionadas.length < quantidade) {
    const faltam = quantidade - selecionadas.length;
    const extras = shuffle(questoes).slice(0, faltam);
    selecionadas.push(...extras);
  }

  // Calcular estatísticas
  const distribuicaoPorDisciplina: Record<string, number> = {};
  for (const q of selecionadas) {
    distribuicaoPorDisciplina[q.disciplina] =
      (distribuicaoPorDisciplina[q.disciplina] || 0) + 1;
  }

  const novas = selecionadas.filter((q) => !questoesVistas.has(q.id)).length;
  const revisao = selecionadas.filter((q) => questoesVistas.has(q.id)).length;

  return {
    questoes: selecionadas,
    metadados: {
      distribuicaoPorDisciplina,
      percentualNovas: (novas / quantidade) * 100,
      percentualRevisao: (revisao / quantidade) * 100,
      disciplinasPriorizadas: Array.from(pesosNormalizados.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([d]) => d),
      nivelAdaptacao: Math.min(1, historico.length / 10),
    },
  };
}

function getQuestoesDisponiveis(
  historico: HistoricoSimulado[],
  opts: SelecaoAdaptativaOptions,
): Questao[] {
  const questoesVistas = new Set<string>();

  if (opts.evitarRepetidos) {
    for (const simulado of historico.slice(-opts.limiteQuestoesVistas)) {
      for (const questao of simulado.questoes) {
        questoesVistas.add(questao.id);
      }
    }
  }

  // Filtrar questões não vistas recentemente
  let disponiveis = questoes.filter((q) => !questoesVistas.has(q.id));

  if (disponiveis.length === 0) {
    // Fallback: todas as questões
    disponiveis = [...questoes];
  }

  return disponiveis;
}

// ============================================================
// SEÇÃO 9 — VALIDAÇÕES E INTEGRIDADE
// ============================================================

/**
 * Valida integridade do banco de questões
 * AGORA com mensagens mais detalhadas sobre duplicados.
 *
 * @example
 * const integridade = validarIntegridadeBanco();
 * if (!integridade.valido) {
 *   console.error("Erros encontrados:", integridade.erros);
 * }
 */
export function validarIntegridadeBanco(): IntegridadeBanco {
  const ids = new Map<string, Questao[]>();
  const duplicados: string[] = [];
  const erros: string[] = [];

  // Verificar duplicados
  for (const q of questoes) {
    const existing = ids.get(q.id);
    if (existing) {
      if (!duplicados.includes(q.id)) {
        duplicados.push(q.id);
      }
      existing.push(q);
    } else {
      ids.set(q.id, [q]);
    }
  }

  // Verificar integridade das questões
  for (const q of questoes) {
    if (!q.id?.trim()) erros.push(`Questão sem ID: ${JSON.stringify(q)}`);
    if (!q.enunciado?.trim()) erros.push(`Q${q.id}: enunciado vazio`);
    if (!q.resposta) erros.push(`Q${q.id}: resposta inválida`);
    if (!q.explicacao?.trim()) erros.push(`Q${q.id}: explicação vazia`);
    if (!q.disciplina || !isDisciplina(q.disciplina)) {
      erros.push(`Q${q.id}: disciplina inválida (${q.disciplina})`);
    }
    if (![1, 2, 3].includes(q.dificuldade)) {
      erros.push(`Q${q.id}: dificuldade inválida (${q.dificuldade})`);
    }
  }

  // Verificar distribuição por disciplina
  const contagem = contarQuestoesPorDisciplina();
  const disciplinasVazias = DISCIPLINAS_ENUM.filter((d) => contagem[d] === 0);
  if (disciplinasVazias.length > 0) {
    erros.push(`Disciplinas sem questões: ${disciplinasVazias.join(", ")}`);
  }

  // Verificar cobertura da prova
  const { ok, faltantes } = verificarCobertura();
  if (!ok) {
    erros.push(
      `Disciplinas com cobertura insuficiente: ${faltantes.join(", ")}`,
    );
  }

  // Mensagem detalhada para duplicados
  if (duplicados.length > 0) {
    for (const id of duplicados) {
      const ocorrencias = ids.get(id)?.length ?? 0;
      erros.push(`ID duplicado: ${id} (${ocorrencias} ocorrências)`);
    }
  }

  return {
    valido: erros.length === 0 && duplicados.length === 0,
    erros,
    duplicados,
    estatisticas: {
      totalQuestoes: questoes.length,
      questoesComErro: erros.length,
      questoesDuplicadas: duplicados.length,
    },
  };
}

/**
 * Middleware de validação para produção
 * Verifica consistência do estado do usuário
 * AGORA com cálculo seguro de turboMaisRapidoHistorico.
 *
 * @example
 * const validacao = validarEstadoConsistente(progress, historico);
 * if (!validacao.ok) {
 *   console.warn("Inconsistências:", validacao.inconsistencias);
 *   // Aplicar correções sugeridas
 * }
 */
export function validarEstadoConsistente(
  progress: UserProgress,
  historico: HistoricoSimulado[],
): EstadoConsistenteResult {
  const inconsistencias: string[] = [];
  const sugestoes: string[] = [];

  // Verificar se XP total bate com o histórico
  const xpDeHistorico = historico.reduce((sum, h) => sum + (h.xpGanho || 0), 0);
  if (progress.xpTotal !== xpDeHistorico) {
    inconsistencias.push(
      `XP mismatch: ${progress.xpTotal} no progresso vs ${xpDeHistorico} no histórico`,
    );
    sugestoes.push(
      `Recalcular XP total baseado no histórico: usar ${xpDeHistorico}`,
    );
  }

  // Verificar nível baseado no XP
  const nivelEsperado = calcularNivel(progress.xpTotal).nivel;
  if (progress.nivel !== nivelEsperado) {
    inconsistencias.push(
      `Nível incorreto: ${progress.nivel} vs esperado ${nivelEsperado}`,
    );
    sugestoes.push(`Atualizar nível para ${nivelEsperado}`);
  }

  // Verificar conquistas
  const conquistasEsperadas = new Set(
    historico.flatMap((h) => h.conquistas || []),
  );
  const conquistasAtuais = new Set(progress.badges.map((b) => b.id));

  const faltando = Array.from(conquistasEsperadas).filter(
    (c) => !conquistasAtuais.has(c),
  );
  if (faltando.length > 0) {
    inconsistencias.push(
      `Conquistas não sincronizadas: ${faltando.join(", ")}`,
    );
    sugestoes.push(`Adicionar conquistas faltantes: ${faltando.join(", ")}`);
  }

  // Verificar streak
  if (progress.ultimoDiaEstudo) {
    const ultimoDia = new Date(progress.ultimoDiaEstudo);
    const hoje = new Date();
    const diffDias = Math.floor(
      (hoje.getTime() - ultimoDia.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDias > 1 && progress.streakDias > 0) {
      inconsistencias.push(
        `Streak ${progress.streakDias} mas último estudo há ${diffDias} dias`,
      );
      sugestoes.push(`Resetar streak para 0 ou atualizar últimoDiaEstudo`);
    }
  }

  // Verificar recordes
  const melhorPontuacaoHistorico = Math.max(
    ...historico.map((h) => h.estatisticas.pontuacao),
    0,
  );
  if (progress.recordes.melhorPontuacao !== melhorPontuacaoHistorico) {
    inconsistencias.push(
      `Recorde de pontuação mismatch: ${progress.recordes.melhorPontuacao} vs ${melhorPontuacaoHistorico}`,
    );
    sugestoes.push(`Atualizar recorde para ${melhorPontuacaoHistorico}`);
  }

  // FIX: cálculo seguro de turboMaisRapidoHistorico
  const temposTurbo = historico
    .filter((h) => h.modo === "TURBO")
    .map((h) => h.estatisticas.tempoTotal);
  const turboMaisRapidoHistorico =
    temposTurbo.length > 0 ? Math.min(...temposTurbo) : null;

  if (progress.recordes.turboMaisRapido !== turboMaisRapidoHistorico) {
    inconsistencias.push(
      `Recorde turbo mismatch: ${progress.recordes.turboMaisRapido} vs ${turboMaisRapidoHistorico}`,
    );
    sugestoes.push(`Atualizar recorde turbo para ${turboMaisRapidoHistorico}`);
  }

  return {
    ok: inconsistencias.length === 0,
    inconsistencias,
    sugestoes,
  };
}

// ============================================================
// SEÇÃO 9.1 — CONSTANTES CALCULADAS (NOVO - atualizável)
// ============================================================

// Em vez de um objeto estático, fornecemos uma função para obter metadados atualizados.
// Isso permite que alterações no banco reflitam nos metadados.
export function obterMetadadosBanco() {
  return {
    totalQuestoes: getTotalQuestoes(),
    disciplinasCount: getStatsPorDisciplina(),
    distribuicaoDificuldade: getEstatisticasPorDificuldade(),
    ultimaAtualizacao: new Date().toISOString(),
    versao: "2.1.0",
    integridade: validarIntegridadeBanco(),
  };
}

// Para compatibilidade com código existente, ainda exportamos METADADOS_BANCO
// como um getter (recalculado a cada acesso). Atenção: não é mais constante.
export const METADADOS_BANCO = {
  get totalQuestoes() {
    return getTotalQuestoes();
  },
  get disciplinasCount() {
    return getStatsPorDisciplina();
  },
  get distribuicaoDificuldade() {
    return getEstatisticasPorDificuldade();
  },
  get ultimaAtualizacao() {
    return new Date().toISOString();
  },
  versao: "2.1.0",
  get integridade() {
    return validarIntegridadeBanco();
  },
};

export const RECURSOS_SISTEMA = {
  totalBadges: Object.keys(BADGES_CONFIG).length,
  niveisTotal: NIVEIS.length,
  xpMaximo: NIVEIS[NIVEIS.length - 1].xpMax,
  modosDisponiveis: Object.keys(MODOS_CONFIG).length,
  disciplinasTotal: DISCIPLINAS_ENUM.length,
} as const;

// ============================================================
// SEÇÃO 10 — CÁLCULO DE ESTATÍSTICAS (COM DOCUMENTAÇÃO CLARA)
// ============================================================

/**
 * Calcula estatísticas a partir de questões respondidas.
 *
 * **Semântica dos campos:**
 * - `brancos`: questões onde `respostaUsuario === null` (usuário deixou em branco intencionalmente). No CEBRASPE, não desconta ponto.
 * - `naoRespondidas`: questões onde `respostaUsuario === undefined` (usuário ainda não interagiu – usado em simulados interrompidos).
 *
 * FIX: distinção mantida e documentada.
 */
export function calcularEstatisticas(
  questoes: QuestaoRespondida[],
): Omit<EstatisticasSimulado, "desempenhoPorDisciplina" | "taxaResposta"> {
  const respondidas = questoes.filter(
    (q) => q.respostaUsuario !== undefined && q.respostaUsuario !== null,
  );
  const brancos = questoes.filter((q) => q.respostaUsuario === null).length;
  const naoRespondidas = questoes.filter(
    (q) => q.respostaUsuario === undefined,
  ).length;

  const acertos = respondidas.filter(
    (q) => q.respostaUsuario === q.resposta,
  ).length;
  const erros = respondidas.filter(
    (q) => q.respostaUsuario !== q.resposta,
  ).length;

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
    naoRespondidas,
    pontuacao,
    percentual,
    tempoTotal,
    tempoMedioPorQuestao,
  };
}

export function verificarCobertura(): { ok: boolean; faltantes: Disciplina[] } {
  const necessario = {
    ...ESTRUTURA_PROVA.conhecimentosBasicos.disciplinas,
    ...ESTRUTURA_PROVA.conhecimentosEspecificos.disciplinas,
  };
  const disponivel = contarQuestoesPorDisciplina();
  const faltantes: Disciplina[] = [];

  for (const [disc, qtd] of Object.entries(necessario)) {
    if (disponivel[disc as Disciplina] < (qtd ?? 0) * 3) {
      faltantes.push(disc as Disciplina);
    }
  }

  return { ok: faltantes.length === 0, faltantes };
}

export function getQuestaoById(id: string): Questao | undefined {
  return QuestaoIndices.getInstance().getQuestaoById(id);
}

export function getQuestoesByIds(ids: string[]): Questao[] {
  const set = new Set(ids);
  return questoes.filter((q) => set.has(q.id));
}

export function validarQuestoesExistentes(ids: string[]): {
  validos: string[];
  invalidos: string[];
} {
  const existing = new Set(questoes.map((q) => q.id));
  const validos: string[] = [];
  const invalidos: string[] = [];
  for (const id of ids) {
    (existing.has(id) ? validos : invalidos).push(id);
  }
  return { validos, invalidos };
}

export function agruparQuestoesPorDisciplina(): Map<Disciplina, Questao[]> {
  const mapa = new Map<Disciplina, Questao[]>(
    DISCIPLINAS_ENUM.map((d) => [d, []]),
  );
  for (const q of questoes) {
    mapa.get(q.disciplina)?.push(q);
  }
  return mapa;
}

export function getTotalQuestoes(): number {
  return questoes.length;
}

export function getDisciplinasDisponiveis(): Disciplina[] {
  const contagem = contarQuestoesPorDisciplina();
  return DISCIPLINAS_ENUM.filter((d) => contagem[d] > 0);
}

// ============================================================
// SEÇÃO 11 — NOVAS FUNCIONALIDADES
// ============================================================
// 11.1 — SISTEMA DE REVISÃO ESPAÇADA (SM-2)
// 11.2 — ANÁLISE PREDITIVA DE NOTA FINAL
// ============================================================

// ------------------------------------------------------------
// 11.1 — Revisão Espaçada (SM-2)
// ------------------------------------------------------------

/**
 * Parâmetros padrão do algoritmo SM-2.
 */
const SM2_DEFAULT_EASE = 2.5;
const SM2_MIN_EASE = 1.3;
const SM2_MAX_EASE = 5.0;

/**
 * Inicializa os dados de revisão para uma questão nunca vista.
 * @returns Objeto RevisaoEspacada com valores iniciais.
 */
export function inicializarRevisao(): RevisaoEspacada {
  const agora = new Date().toISOString();
  return {
    repeticao: 0,
    easinessFactor: SM2_DEFAULT_EASE,
    ultimaRevisao: agora,
    intervaloDias: 0,
    proximaRevisao: agora, // revisar imediatamente
  };
}

/**
 * Atualiza os dados de revisão espaçada com base no resultado (acerto/erro).
 * Implementação do algoritmo SM-2 adaptado para questões binárias (Certo/Errado).
 *
 * @param revisao Estado atual da revisão
 * @param acertou true se o usuário acertou a questão, false caso contrário.
 * @returns Novo estado da revisão após a resposta.
 */
export function atualizarRevisao(
  revisao: RevisaoEspacada,
  acertou: boolean,
): RevisaoEspacada {
  const nova = { ...revisao };
  const agora = new Date();

  if (acertou) {
    // Acertou: aumenta repetição e recalcula intervalo
    nova.repeticao += 1;
    let intervalo: number;
    if (nova.repeticao === 1) {
      intervalo = 1;
    } else if (nova.repeticao === 2) {
      intervalo = 6;
    } else {
      intervalo = Math.round(nova.intervaloDias * nova.easinessFactor);
    }
    // Limitar intervalo máximo a 365 dias (um ano)
    nova.intervaloDias = Math.min(intervalo, 365);
    // Ajustar fator de facilidade (nunca abaixo do mínimo)
    nova.easinessFactor = Math.max(
      SM2_MIN_EASE,
      nova.easinessFactor + 0.1 - (5 - 3) * 0.08, // fórmula simplificada: q=5 (máximo)
    );
    nova.easinessFactor = Math.min(SM2_MAX_EASE, nova.easinessFactor);
  } else {
    // Errou: reinicia repetição e reduz fator de facilidade
    nova.repeticao = 0;
    nova.intervaloDias = 1; // revisar no dia seguinte
    nova.easinessFactor = Math.max(SM2_MIN_EASE, nova.easinessFactor - 0.2);
  }

  nova.ultimaRevisao = agora.toISOString();
  const proxima = new Date(agora);
  proxima.setDate(agora.getDate() + nova.intervaloDias);
  nova.proximaRevisao = proxima.toISOString();

  return nova;
}

/**
 * Obtém as questões que estão prontas para revisão (data de próxima revisão <= hoje).
 * @param historico Lista de simulados com questões respondidas.
 * @returns Array de questões com seus respectivos dados de revisão.
 */
export function obterQuestoesParaRevisar(
  historico: HistoricoSimulado[],
): QuestaoComRevisao[] {
  const agora = new Date();
  const questoesMap = new Map<string, QuestaoComRevisao>();

  // Percorrer todas as questões respondidas no histórico
  for (const simulado of historico) {
    for (const questao of simulado.questoes) {
      const existente = questoesMap.get(questao.id);
      // Se já temos dados de revisão para esta questão, usamos a última ocorrência
      // (consideramos a resposta mais recente)
      if (
        !existente ||
        new Date(simulado.data) >
          new Date(existente.revisao?.ultimaRevisao ?? 0)
      ) {
        const revisao =
          (questao as QuestaoComRevisao).revisao ?? inicializarRevisao();
        questoesMap.set(questao.id, { ...questao, revisao });
      }
    }
  }

  // Filtrar questões cuja próxima revisão já passou
  const paraRevisar: QuestaoComRevisao[] = [];
  for (const questao of questoesMap.values()) {
    if (questao.revisao && new Date(questao.revisao.proximaRevisao) <= agora) {
      paraRevisar.push(questao);
    }
  }

  return paraRevisar;
}

/**
 * Processa a resposta de uma questão e atualiza seu estado de revisão no histórico.
 * Útil para integrar o SM-2 ao fluxo de resposta do usuário.
 *
 * @param historico Histórico atual (será modificado)
 * @param questaoId ID da questão respondida
 * @param acertou Indica se o usuário acertou
 */
export function registrarRespostaComRevisao(
  historico: HistoricoSimulado[],
  questaoId: string,
  acertou: boolean,
): void {
  // Encontra a questão no histórico (última ocorrência)
  for (let i = historico.length - 1; i >= 0; i--) {
    const questao = historico[i].questoes.find((q) => q.id === questaoId);
    if (questao) {
      const qRevisao = questao as QuestaoComRevisao;
      const revisaoAtual = qRevisao.revisao ?? inicializarRevisao();
      qRevisao.revisao = atualizarRevisao(revisaoAtual, acertou);
      break;
    }
  }
}

// ------------------------------------------------------------
// 11.2 — Análise Preditiva de Nota Final
// ------------------------------------------------------------

/**
 * Resultado da previsão de nota final.
 */
export interface PrevisaoNotaFinal {
  /** Pontuação prevista (acertos - erros) */
  pontuacaoPrevista: number;
  /** Percentual de acertos líquido previsto (0-100) */
  percentualPrevisto: number;
  /** Nível de confiança da previsão (0-1) */
  confianca: number;
  /** Detalhamento por disciplina */
  detalhePorDisciplina: Record<
    Disciplina,
    {
      questoesNaProva: number;
      acertosPrevistos: number;
      percentualAcerto: number;
    }
  >;
  /** Recomendações para melhorar a nota */
  recomendacoes: string[];
}

/**
 * Previne a nota final do usuário em um simulado completo, com base no desempenho histórico.
 * Utiliza média ponderada por disciplina e ajusta pela dificuldade das questões previstas.
 *
 * @param historico Lista de simulados anteriores do usuário.
 * @param estruturaProva (opcional) Estrutura da prova (padrão: ESTRUTURA_PROVA).
 * @returns Objeto com a previsão e recomendações.
 */
export function preverNotaFinal(
  historico: HistoricoSimulado[],
  estruturaProva: EstruturaProva = ESTRUTURA_PROVA,
): PrevisaoNotaFinal {
  // Se não há histórico, retorna previsão neutra
  if (historico.length === 0) {
    const totalQuestoes =
      estruturaProva.conhecimentosBasicos.total +
      estruturaProva.conhecimentosEspecificos.total;
    const detalheVazio = {} as Record<Disciplina, any>;
    for (const d of DISCIPLINAS_ENUM)
      detalheVazio[d] = {
        questoesNaProva: 0,
        acertosPrevistos: 0,
        percentualAcerto: 0,
      };
    return {
      pontuacaoPrevista: 0,
      percentualPrevisto: 0,
      confianca: 0,
      detalhePorDisciplina: detalheVazio,
      recomendacoes: [
        "Complete mais simulados para gerar uma previsão confiável.",
      ],
    };
  }

  // Calcular a taxa de acerto por disciplina (média dos últimos 5 simulados, se possível)
  const desempenhoDisciplina = new Map<
    Disciplina,
    { somaAcertos: number; totalQuestoes: number; peso: number }
  >();
  for (const d of DISCIPLINAS_ENUM) {
    desempenhoDisciplina.set(d, { somaAcertos: 0, totalQuestoes: 0, peso: 0 });
  }

  // Usar apenas os últimos 10 simulados para dar mais peso ao desempenho recente
  const historicoRecente = historico.slice(-10);
  for (const simulado of historicoRecente) {
    const peso = 1; // peso uniforme, poderia ser exponencial
    for (const [disc, stats] of Object.entries(
      simulado.estatisticas.desempenhoPorDisciplina,
    )) {
      const d = disc as Disciplina;
      const atual = desempenhoDisciplina.get(d)!;
      atual.somaAcertos += stats.acertos * peso;
      atual.totalQuestoes += stats.total * peso;
      atual.peso += peso;
    }
  }

  // Calcular percentual de acerto por disciplina (média ponderada)
  const taxaAcertoPorDisciplina: Record<Disciplina, number> = {} as any;
  for (const d of DISCIPLINAS_ENUM) {
    const data = desempenhoDisciplina.get(d)!;
    if (data.totalQuestoes > 0) {
      taxaAcertoPorDisciplina[d] =
        (data.somaAcertos / data.totalQuestoes) * 100;
    } else {
      // Sem dados: usar média global ou 50%
      taxaAcertoPorDisciplina[d] = 50;
    }
  }

  // Ajuste pela dificuldade das questões (simulado completo tem distribuição oficial)
  // Como não sabemos a dificuldade exata de cada questão na prova, usamos um fator de correção
  // baseado no desempenho do usuário em questões de dificuldade 1,2,3.
  const desempenhoDificuldade = { 1: 0, 2: 0, 3: 0 };
  let totalQuestoesDificuldade = 0;
  for (const simulado of historicoRecente) {
    for (const questao of simulado.questoes) {
      const acertou = questao.respostaUsuario === questao.resposta;
      if (acertou) desempenhoDificuldade[questao.dificuldade]++;
      totalQuestoesDificuldade++;
    }
  }
  const taxaAcertoPorDificuldade = {
    1: desempenhoDificuldade[1] / (totalQuestoesDificuldade || 1),
    2: desempenhoDificuldade[2] / (totalQuestoesDificuldade || 1),
    3: desempenhoDificuldade[3] / (totalQuestoesDificuldade || 1),
  };

  // Combinar disciplinas da prova
  const disciplinasProva: Partial<Record<Disciplina, number>> = {
    ...estruturaProva.conhecimentosBasicos.disciplinas,
    ...estruturaProva.conhecimentosEspecificos.disciplinas,
  };

  let pontuacaoTotalPrevista = 0;
  let totalQuestoesProva = 0;
  const detalhe: Record<Disciplina, any> = {} as any;

  for (const [disc, qtd] of Object.entries(disciplinasProva)) {
    const disciplina = disc as Disciplina;
    const qtdQuestoes = qtd ?? 0;
    if (qtdQuestoes === 0) continue;
    totalQuestoesProva += qtdQuestoes;

    // Taxa de acerto base da disciplina
    let taxaBase = taxaAcertoPorDisciplina[disciplina] / 100;

    // Ajuste pela dificuldade média das questões da disciplina (estimado)
    // Como não temos dados, usamos um fator conservador: disciplinas com muitas questões de dificuldade 3 têm ajuste negativo
    // Vamos buscar a distribuição de dificuldade no banco para essa disciplina
    const questoesDisc = getQuestoesPorDisciplina(disciplina);
    const totalDisc = questoesDisc.length;
    const percDificil =
      questoesDisc.filter((q) => q.dificuldade === 3).length / totalDisc;
    const percFacil =
      questoesDisc.filter((q) => q.dificuldade === 1).length / totalDisc;
    const fatorDificuldade = 1 + percDificil * 0.2 - percFacil * 0.1;
    const taxaAjustada = Math.min(
      0.95,
      Math.max(0.05, taxaBase * fatorDificuldade),
    );

    // Prever acertos
    const acertosPrevistos = Math.round(qtdQuestoes * taxaAjustada);
    const errosPrevistos = qtdQuestoes - acertosPrevistos;
    const pontuacaoDisciplina = acertosPrevistos - errosPrevistos;

    pontuacaoTotalPrevista += pontuacaoDisciplina;

    detalhe[disciplina] = {
      questoesNaProva: qtdQuestoes,
      acertosPrevistos,
      percentualAcerto: taxaAjustada * 100,
    };
  }

  const percentualPrevisto =
    (pontuacaoTotalPrevista / totalQuestoesProva) * 100;
  const confianca = Math.min(1, historico.length / 20); // mais histórico, mais confiança

  // Recomendações baseadas nas disciplinas com pior desempenho
  const recomendacoes: string[] = [];
  const pioresDisciplinas = Object.entries(taxaAcertoPorDisciplina)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3);
  for (const [disc, taxa] of pioresDisciplinas) {
    if (taxa < 60) {
      recomendacoes.push(
        `Foque em ${DISCIPLINAS_NOME[disc as Disciplina]} (taxa de acerto atual: ${taxa.toFixed(1)}%).`,
      );
    }
  }
  if (percentualPrevisto < 50) {
    recomendacoes.push(
      "Seu desempenho previsto está abaixo da média. Revise a teoria e pratique mais simulados.",
    );
  } else if (percentualPrevisto >= 70) {
    recomendacoes.push(
      "Excelente previsão! Continue revisando para manter o ritmo.",
    );
  } else {
    recomendacoes.push(
      "Foco nas disciplinas com menor desempenho e resolva questões de dificuldade alta.",
    );
  }

  return {
    pontuacaoPrevista: Math.round(pontuacaoTotalPrevista),
    percentualPrevisto: Math.round(percentualPrevisto * 100) / 100,
    confianca,
    detalhePorDisciplina: detalhe,
    recomendacoes,
  };
}

// ============================================================
// EXPORT DEFAULT (compatibilidade)
// ============================================================

export default {
  questoes,
  ESTRUTURA_PROVA,
  MODOS_CONFIG,
  TEMPO_PROVA_MINUTOS,
  TEMPO_TURBO_MINUTOS,
  DISCIPLINAS_NOME,
  DISCIPLINAS_LABELS,
  DISCIPLINAS_CORES,
  DISCIPLINAS_ORDEM,
  DISCIPLINAS_ENUM,
  NIVEIS,
  XP_REWARDS,
  XP_REWARDS_INFO,
  XP_MAX_NIVEL,
  BADGES_CONFIG,
  BADGES_NIVELADAS,
  // funções gamificação
  calcularNivel,
  xpParaProximoNivel,
  calcularProgressoNivel,
  verificarNovasConquistas,
  getBadgesPorNivel,
  criarProgressoInicial,
  // estatísticas banco
  getStatsPorDisciplina,
  contarQuestoesPorDisciplina,
  getEstatisticasBanco,
  getEstatisticasPorDificuldade,
  // seleção questões
  getQuestoesPorDisciplina,
  getQuestoesPorDificuldade,
  getQuestoesPorBanca,
  buscarQuestoes,
  getQuestoesPorAssunto,
  selecionarQuestoesAleatorias,
  selecionarQuestoesPorDisciplina,
  selecionarQuestoesBalanceadas,
  selecionarQuestoesAdaptativas,
  verificarCobertura,
  getQuestaoById,
  getQuestoesByIds,
  validarQuestoesExistentes,
  agruparQuestoesPorDisciplina,
  getTotalQuestoes,
  getDisciplinasDisponiveis,
  // cálculos
  calcularEstatisticas,
  calcularMetricasPerformance,
  // validação
  validarIntegridadeBanco,
  validarEstadoConsistente,
  validateHistoricoSimulado,
  validateUserProgress,
  validateUserSettings,
  safeValidate,
  isDisciplina,
  isModoSimulado,
  getDisciplinaLabel,
  getDisciplinaCor,
  // cache e índices
  QuestaoCache,
  QuestaoIndices,
  // constantes calculadas
  METADADOS_BANCO,
  RECURSOS_SISTEMA,
  // NOVAS FUNCIONALIDADES
  inicializarRevisao,
  atualizarRevisao,
  obterQuestoesParaRevisar,
  registrarRespostaComRevisao,
  preverNotaFinal,
};
