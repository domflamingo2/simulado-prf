import { BadgeType, Disciplina, NivelInfo, UserProgress } from "./types";

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO DE NÍVEIS
// ═══════════════════════════════════════════════════════════

/**
 * Tabela de níveis ordenada do menor para o maior.
 * xpMin e xpMax são inclusivos no limite inferior e exclusivos no superior.
 * Ex: nível 1 vai de 0 (inclusive) a 99 XP; nível 2 começa em 100.
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
    xpMax: 999999,
    cor: "#ffd700",
    icone: "🏆",
  },
] as const;

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO DE XP
// ═══════════════════════════════════════════════════════════

export const XP_REWARDS = {
  // Questão individual
  QUESTAO_RESPONDIDA: 1,
  ACERTO: 10,
  // FIX: ERRO removido como recompensa de XP — errar não deveria dar XP positivo.
  // A penalidade já existe na pontuação CEBRASPE. XP representa progresso de estudo.
  // Se quiser penalizar XP por erro, use valor negativo e trate no hook com Math.max(0, total).

  // Modos de estudo
  SIMULADO_COMPLETO: 50,
  SIMULADO_TURBO: 30,
  SIMULADO_ADAPTATIVO: 60,
  TREINO_DISCIPLINA: 20,
  REVISAO_ERROS: 15,

  // Streaks
  STREAK_DIA: 25,
  STREAK_3: 50,
  STREAK_7: 100,
  STREAK_30: 500,

  // Conquistas especiais
  NOVO_RECORDE_PONTUACAO: 75,
  NOVO_RECORDE_VELOCIDADE: 50,
  DISCIPLINA_DOMINADA: 100,
  PROVA_PERFEITA: 200,
} as const;

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO DE BADGES
// ═══════════════════════════════════════════════════════════

interface BadgeExtras {
  simuladoPontuacao?: number;
  simuladoAcertos?: number;
  /** Total de questões do simulado — necessário para verificar prova perfeita */
  simuladoTotal?: number;
  turboTempo?: number;
  disciplinaStats?: Partial<
    Record<Disciplina, { acertos: number; total: number }>
  >;
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

  // FIX: condição real baseada em `simuladoPontuacao` e histórico de simulados.
  // Verifica se o simulado atual teve pontuação >= 60 E o usuário já completou >= 3 simulados.
  // Para histórico completo (3 simulados com 60+), precisaria de `dadosExtras` com array
  // do histórico — por ora, usa a pontuação atual + contador como proxy razoável.
  "cebraspe-master": {
    titulo: "Cebraspe Master",
    descricao: "60+ pontos em um simulado, tendo completado 3 ou mais",
    condicao: (p, extras) =>
      p.conquistas.simuladosCompletos >= 3 &&
      (extras?.simuladoPontuacao ?? 0) >= 60,
  },

  // FIX: verifica apenas disciplinas com `total > 0` — disciplinas nunca respondidas
  // não devem bloquear o badge. Requer ao menos 5 disciplinas com dados para evitar
  // desbloqueio prematuro em treinos com poucas disciplinas.
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

      // FIX: mínimo de 5 disciplinas com dados (não necessariamente todas as 9)
      if (disciplinasComDados.length < 5) return false;

      return disciplinasComDados.every(
        ([, stats]) => stats.acertos / stats.total >= 0.7,
      );
    },
  },

  // FIX: sem valor mágico 99999 — verificação explícita de nullability
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

  // FIX: `"cebraspe-master"` era inatingível (condicao: () => false), tornando
  // `"nivel-max"` também inatingível. Agora que cebraspe-master tem condição real,
  // nivel-max requer 9 outros badges (excluindo ele próprio) + nível 10.
  "nivel-max": {
    titulo: "Lenda da PRF",
    descricao: "Nível 10 com ao menos 9 conquistas desbloqueadas",
    condicao: (p) =>
      p.nivel >= 10 && p.badges.filter((b) => b.id !== "nivel-max").length >= 9,
  },
};

// ═══════════════════════════════════════════════════════════
// FUNÇÕES UTILITÁRIAS
// ═══════════════════════════════════════════════════════════

/**
 * Calcula o nível correspondente ao XP total.
 *
 * FIX: guard para xpTotal negativo (dados corrompidos).
 * Loop reverso é O(n) mas n=10 — eficiente o suficiente.
 */
export function calcularNivel(xpTotal: number): NivelInfo {
  const xp = Math.max(0, xpTotal);
  for (let i = NIVEIS.length - 1; i >= 0; i--) {
    if (xp >= NIVEIS[i].xpMin) {
      return NIVEIS[i];
    }
  }
  return NIVEIS[0];
}

/**
 * Retorna o XP restante para o próximo nível.
 * FIX: nunca retorna negativo — no nível máximo retorna 0.
 */
export function xpParaProximoNivel(xpTotal: number): number {
  const nivel = calcularNivel(xpTotal);
  // No nível máximo, xpMax é 999999 — diferença nunca é negativa na prática,
  // mas o Math.max garante para qualquer xpTotal acima do xpMax.
  return Math.max(0, nivel.xpMax - Math.max(0, xpTotal));
}

/**
 * Calcula o progresso percentual dentro do nível atual (0–100).
 * FIX: clampado em [0, 100] para evitar valores fora do intervalo.
 */
export function calcularProgressoNivel(xpTotal: number): number {
  const xp = Math.max(0, xpTotal);
  const nivel = calcularNivel(xp);
  const xpNoNivel = xp - nivel.xpMin;
  const xpTotalNivel = nivel.xpMax - nivel.xpMin;

  // Evita divisão por zero no nível máximo (xpMax = 999999, xpMin = 12000 → nunca zero)
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
 * Cria um objeto de progresso inicial para novo usuário.
 * Todos os contadores em zero, sem badges, sem streak.
 */
export function criarProgressoInicial(): UserProgress {
  return {
    nivel: 1,
    xpTotal: 0,
    xpAtual: 0,
    xpParaProximoNivel: NIVEIS[1].xpMin, // 100 — XP do nível 2
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
      recordes: {
        turboMaisRapido: null,
        melhorPontuacao: 0,
      },
      disciplinasDominadas: [],
    },
  };
}
