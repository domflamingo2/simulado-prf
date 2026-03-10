import { BadgeType, Disciplina, NivelInfo, UserProgress } from "./types";

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO DE NÍVEIS
// ═══════════════════════════════════════════════════════════

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
];

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO DE XP
// ═══════════════════════════════════════════════════════════

export const XP_REWARDS = {
  // Base
  QUESTAO_RESPONDIDA: 1,
  ACERTO: 10,
  ERRO: 2, // XP de consolação (aprendizado)

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
  DISCIPLINA_DOMINADA: 100, // 70%+ em uma disciplina
  PROVA_PERFEITA: 200, // 60/60 acertos
};

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO DE BADGES
// ═══════════════════════════════════════════════════════════

export const BADGES_CONFIG: Record<
  BadgeType,
  {
    titulo: string;
    descricao: string;
    condicao: (progress: UserProgress, dadosExtras?: any) => boolean;
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
    descricao: "60+ pontos em 3 simulados completos",
    condicao: (p) => {
      // Verificar histórico seria necessário aqui
      return false; // Implementar com histórico real
    },
  },
  polivalente: {
    titulo: "Polivalente",
    descricao: "70%+ de aproveitamento em todas as disciplinas",
    condicao: (p) => p.conquistas.disciplinasDominadas.length >= 9,
  },
  velocista: {
    titulo: "Velocista",
    descricao: "Complete o modo Turbo em menos de 30 minutos",
    condicao: (p, extras) => extras?.turboTempo < 30 * 60,
  },
  perfeccionista: {
    titulo: "Perfeccionista",
    descricao: "Acerte todas as questões de um simulado",
    condicao: (p, extras) => extras?.acertos === 60,
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
    descricao: "Complete todos os níveis com todas as conquistas",
    condicao: (p) => p.nivel >= 10 && p.badges.length >= 10,
  },
};

// ═══════════════════════════════════════════════════════════
// FUNÇÕES UTILITÁRIAS
// ═══════════════════════════════════════════════════════════

/** Calcula nível atual baseado no XP total */
export function calcularNivel(xpTotal: number): NivelInfo {
  return NIVEIS.findLast((n) => xpTotal >= n.xpMin) || NIVEIS[0];
}

/** Calcula XP necessário para o próximo nível */
export function xpParaProximoNivel(xpTotal: number): number {
  const nivelAtual = calcularNivel(xpTotal);
  return nivelAtual.xpMax - xpTotal;
}

/** Calcula progresso percentual no nível atual (0-100) */
export function calcularProgressoNivel(xpTotal: number): number {
  const nivel = calcularNivel(xpTotal);
  const xpNoNivel = xpTotal - nivel.xpMin;
  const xpTotalNivel = nivel.xpMax - nivel.xpMin;
  return (xpNoNivel / xpTotalNivel) * 100;
}

/** Verifica novas conquistas desbloqueadas */
export function verificarNovasConquistas(
  progress: UserProgress,
  extras?: {
    simuladoPontuacao?: number;
    simuladoAcertos?: number;
    simuladoTotal?: number;
    turboTempo?: number;
    disciplinaStats?: Record<Disciplina, { acertos: number; total: number }>;
  },
): BadgeType[] {
  const novas: BadgeType[] = [];

  (Object.keys(BADGES_CONFIG) as BadgeType[]).forEach((badgeId) => {
    // Verifica se já não tem
    if (progress.badges.some((b) => b.id === badgeId)) return;

    // Verifica condição
    const config = BADGES_CONFIG[badgeId];
    if (config.condicao(progress, extras)) {
      novas.push(badgeId);
    }
  });

  return novas;
}

/** Cria progresso inicial para novo usuário */
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
      recordes: {
        turboMaisRapido: null,
        melhorPontuacao: 0,
      },
      disciplinasDominadas: [],
    },
  };
}
