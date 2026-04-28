// ============================================================
// index.ts — arquivo único consolidado
// Contém: tipos, validação Zod, gamificação e banco de questões
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

// ── Recompensas de XP ─────────────────────────────────────────

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

// ── Configuração de badges ────────────────────────────────────

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

      const disciplinasComDados = (
        Object.entries(extras.disciplinaStats) as [
          Disciplina,
          { acertos: number; total: number },
        ][]
      ).filter(([, stats]) => stats.total > 0);

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
 * Guard para xpTotal negativo (dados corrompidos).
 */
export function calcularNivel(xpTotal: number): NivelInfo {
  const xp = Math.max(0, xpTotal);
  for (let i = NIVEIS.length - 1; i >= 0; i--) {
    if (xp >= NIVEIS[i].xpMin) return NIVEIS[i];
  }
  return NIVEIS[0];
}

/**
 * Retorna o XP restante para o próximo nível.
 * No nível máximo retorna 0 — o usuário já chegou ao topo.
 */
export function xpParaProximoNivel(xpTotal: number): number {
  const nivel = calcularNivel(xpTotal);
  if (nivel.nivel === NIVEL_MAXIMO.nivel) return 0;
  return nivel.xpMax - Math.max(0, xpTotal);
}

/**
 * Calcula o progresso percentual dentro do nível atual (0–100).
 * No nível máximo retorna 100 imediatamente — a barra está cheia.
 */
export function calcularProgressoNivel(xpTotal: number): number {
  const xp = Math.max(0, xpTotal);
  const nivel = calcularNivel(xp);

  if (nivel.nivel === NIVEL_MAXIMO.nivel) return 100;

  const xpNoNivel = xp - nivel.xpMin;
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
// Importações mantidas do projeto original — cada módulo de questões
// continua separado por disciplina para facilitar manutenção do conteúdo.

import { questoesAdministracao } from "./questoes/administracao";
import { questoesArquivologia } from "./questoes/arquivologia";
import { questoesDireitoAdministrativo } from "./questoes/direito-administrativo";
import { questoesDireitoConstitucional } from "./questoes/direito-constitucional";
import { questoesEtica } from "./questoes/etica";
import { questoesInformatica } from "./questoes/informatica";
import { questoesLegislacaoPRF } from "./questoes/legislacao-prf";
import { questoesPortugues } from "./questoes/portugues";
import { questoesRaciocinioLogico } from "./questoes/raciocinio-logico";

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
  /**
   * Questões dos últimos 2 anos (ano corrente e anterior).
   * Nome mantido para compatibilidade com consumidores existentes;
   * semântica esclarecida no JSDoc.
   */
  ultimasAdicoes: number;
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
  let ultimasAdicoes = 0;

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
      if (q.ano >= anoAtual - 1) ultimasAdicoes++;
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
    ultimasAdicoes,
    taxaAcertoMedia: null,
    questoesPorAno: anosMap,
    bancasPrincipais,
  };
}

// ============================================================
// SEÇÃO 8 — FUNÇÕES DE SELEÇÃO E BUSCA
// ============================================================

export function getQuestoesPorDisciplina(disciplina: Disciplina): Questao[] {
  return questoes.filter((q) => q.disciplina === disciplina);
}

export function getQuestoesPorDificuldade(dificuldade: 1 | 2 | 3): Questao[] {
  return questoes.filter((q) => q.dificuldade === dificuldade);
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
  const t = assunto.toLowerCase();
  return questoes.filter((q) => q.assunto?.toLowerCase().includes(t));
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
 *
 * FIX: agora emite aviso quando alguma disciplina tem questões insuficientes,
 * em vez de falhar silenciosamente. O chamador recebe o resultado parcial
 * junto com a lista de disciplinas com cobertura insuficiente.
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

  for (const [disciplina, quantidade] of Object.entries(todasEstrutura)) {
    if (!quantidade) continue;

    const disponivel = getQuestoesPorDisciplina(disciplina as Disciplina);
    const selecionadasDisciplina = shuffle(disponivel).slice(0, quantidade);

    if (selecionadasDisciplina.length < quantidade) {
      avisos.push(
        `${DISCIPLINAS_NOME[disciplina as Disciplina]}: solicitadas ${quantidade}, disponíveis ${selecionadasDisciplina.length}`,
      );
    }

    selecionadas.push(...selecionadasDisciplina);
  }

  return { questoes: selecionadas, avisos };
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
  return questoes.find((q) => q.id === id);
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
// SEÇÃO 9 — CÁLCULO DE ESTATÍSTICAS
// ============================================================

/**
 * Calcula estatísticas a partir de questões respondidas.
 *
 * FIX: distingue corretamente entre:
 *   - `brancos`       → respostaUsuario === null  (usuário decidiu deixar em branco)
 *   - `naoRespondidas`→ respostaUsuario === undefined (questão ainda não vista)
 *
 * Essa distinção é importante no sistema CEBRASPE: deixar em branco (null)
 * não desconta ponto, enquanto "ainda não viu" pode indicar simulado interrompido.
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
  XP_MAX_NIVEL,
  BADGES_CONFIG,
  // funções
  calcularNivel,
  xpParaProximoNivel,
  calcularProgressoNivel,
  verificarNovasConquistas,
  criarProgressoInicial,
  getStatsPorDisciplina,
  contarQuestoesPorDisciplina,
  getQuestoesPorDisciplina,
  getQuestoesPorDificuldade,
  getQuestoesPorBanca,
  buscarQuestoes,
  getQuestoesPorAssunto,
  selecionarQuestoesAleatorias,
  selecionarQuestoesPorDisciplina,
  selecionarQuestoesBalanceadas,
  verificarCobertura,
  getEstatisticasBanco,
  getQuestaoById,
  getQuestoesByIds,
  validarQuestoesExistentes,
  agruparQuestoesPorDisciplina,
  getTotalQuestoes,
  getDisciplinasDisponiveis,
  calcularEstatisticas,
  // validação
  validateHistoricoSimulado,
  validateUserProgress,
  validateUserSettings,
  safeValidate,
  isDisciplina,
  isModoSimulado,
  getDisciplinaLabel,
  getDisciplinaCor,
};
