// ============================================================
// ARQUIVO PRINCIPAL: questoes/index.ts
// Centraliza todas as questões por disciplina
// ============================================================

import { questoesAdministracao } from "./questoes/administracao";
import { questoesArquivologia } from "./questoes/arquivologia";
import { questoesDireitoAdministrativo } from "./questoes/direito-administrativo";
import { questoesDireitoConstitucional } from "./questoes/direito-constitucional";
import { questoesEtica } from "./questoes/etica";
import { questoesInformatica } from "./questoes/informatica";
import { questoesLegislacaoPRF } from "./questoes/legislacao-prf";
import { questoesPortugues } from "./questoes/portugues";
import { questoesRaciocinioLogico } from "./questoes/raciocinio-logico";
import { Disciplina, EstruturaProva, ModoConfig, Questao } from "./types";

// ============================================================
// CONSTANTES DA PROVA
// ============================================================

export const TEMPO_PROVA_MINUTOS = 240;
export const TEMPO_TURBO_MINUTOS = 40;

/** Nomes das disciplinas para exibição */
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

/** Estrutura oficial da prova PRF Administrativo CEBRASPE */
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

/** Configurações dos modos de simulado */
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

// ============================================================
// BANCO DE QUESTÕES COMBINADO
// ============================================================

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
// TIPO PÚBLICO — StatsData
// Forma exata consumida por EstatisticasBanco e BancoQuestoesPage.
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
  /** Questões adicionadas nos últimos 30 dias */
  ultimasAdicoes: number;
  /** Taxa de acerto média dos usuários (0-100). null quando não disponível. */
  taxaAcertoMedia: number | null;
  /** Quantidade de questões por ano — chave: "YYYY" */
  questoesPorAno: Record<string, number>;
  /** Top N bancas — chave: nome da banca, valor: total de questões */
  bancasPrincipais: Record<string, number>;
}

// ============================================================
// FUNÇÕES DE ESTATÍSTICA E ANÁLISE
// ============================================================

/** Disciplinas válidas (lista única — evita duplication) */
const DISCIPLINAS_LIST: Disciplina[] = [
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

/** Type-guard para disciplinas */
function isValidDisciplina(d: string): d is Disciplina {
  return DISCIPLINAS_LIST.includes(d as Disciplina);
}

/** Obtém estatísticas de questões por disciplina */
export function getStatsPorDisciplina() {
  const counts = new Map<Disciplina, number>();

  for (const q of questoes) {
    counts.set(q.disciplina, (counts.get(q.disciplina) ?? 0) + 1);
  }

  return DISCIPLINAS_LIST.filter((d) => counts.has(d))
    .map((d) => ({
      disciplina: d,
      nome: DISCIPLINAS_NOME[d],
      count: counts.get(d) ?? 0,
    }))
    .sort((a, b) => b.count - a.count);
}

/** Conta questões por disciplina no banco */
export function contarQuestoesPorDisciplina(): Record<Disciplina, number> {
  const contagem = Object.fromEntries(
    DISCIPLINAS_LIST.map((d) => [d, 0]),
  ) as Record<Disciplina, number>;

  for (const q of questoes) {
    if (isValidDisciplina(q.disciplina)) {
      contagem[q.disciplina]++;
    }
  }

  return contagem;
}

/**
 * Estatísticas completas do banco de questões.
 *
 * Retorna um objeto `StatsData` — mesma forma consumida por
 * `EstatisticasBanco` e `BancoQuestoesPage`.
 *
 * Mudanças em relação à versão anterior:
 *  - `estatisticasPorBanca` → renomeado para `bancasPrincipais`   ← fix crítico
 *  - `questoesPorAno` adicionado                                   ← campo ausente
 *  - `ultimasAdicoes` calculado com base em `q.ano` (fallback: 0) ← campo ausente
 *  - `taxaAcertoMedia` tipado como `number | null`                 ← fix tipo
 */
export function getEstatisticasBanco(): StatsData {
  const total = questoes.length;

  // ── Dificuldade ──────────────────────────────────────────────────────────
  const porDificuldade = { 1: 0, 2: 0, 3: 0 };
  let somaDificuldade = 0;

  // ── Completude ────────────────────────────────────────────────────────────
  let totalComTags = 0;
  let totalComFonteLegal = 0;
  let totalComBanca = 0;
  let totalComAssunto = 0;
  let totalComAno = 0;

  // ── Bancas e anos ─────────────────────────────────────────────────────────
  const bancasMap: Record<string, number> = {};
  const anosMap: Record<string, number> = {};

  // ── Data de corte: "últimas adições" = questões do ano corrente ───────────
  const anoAtual = new Date().getFullYear();
  let ultimasAdicoes = 0;

  // ── Loop único ────────────────────────────────────────────────────────────
  for (const q of questoes) {
    // dificuldade
    if (q.dificuldade === 1 || q.dificuldade === 2 || q.dificuldade === 3) {
      porDificuldade[q.dificuldade]++;
      somaDificuldade += q.dificuldade;
    }

    // completude
    if (q.tags && q.tags.length > 0) totalComTags++;
    if (q.fonte_legal && q.fonte_legal.length > 0) totalComFonteLegal++;
    if (q.banca_referencia) totalComBanca++;
    if (q.assunto) totalComAssunto++;
    if (q.ano) totalComAno++;

    // bancas
    if (q.banca_referencia) {
      bancasMap[q.banca_referencia] = (bancasMap[q.banca_referencia] ?? 0) + 1;
    }

    // anos
    if (q.ano) {
      const chave = String(q.ano);
      anosMap[chave] = (anosMap[chave] ?? 0) + 1;

      if (Number(q.ano) >= anoAtual - 1) {
        ultimasAdicoes++;
      }
    }
  }

  // ── bancasPrincipais — top 10 por volume ──────────────────────────────────
  const bancasPrincipais = Object.fromEntries(
    Object.entries(bancasMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
  );

  // ── média de dificuldade ──────────────────────────────────────────────────
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
    taxaAcertoMedia: null, // calculado externamente (histórico do usuário)
    questoesPorAno: anosMap,
    bancasPrincipais,
  };
}

// ============================================================
// DEMAIS FUNÇÕES (inalteradas)
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

/** Fisher-Yates in-place shuffle (returns new array) */
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

export function selecionarQuestoesBalanceadas(): Questao[] {
  const selecionadas: Questao[] = [];
  const todasEstrutura = {
    ...ESTRUTURA_PROVA.conhecimentosBasicos.disciplinas,
    ...ESTRUTURA_PROVA.conhecimentosEspecificos.disciplinas,
  };

  for (const [disciplina, quantidade] of Object.entries(todasEstrutura)) {
    if (!quantidade) continue;
    selecionadas.push(
      ...selecionarQuestoesPorDisciplina(disciplina as Disciplina, quantidade),
    );
  }

  return selecionadas;
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
    DISCIPLINAS_LIST.map((d) => [d, []]),
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
  return DISCIPLINAS_LIST.filter((d) => contagem[d] > 0);
}

// ============================================================
// EXPORT DEFAULT PARA COMPATIBILIDADE
// ============================================================

export default {
  questoes,
  ESTRUTURA_PROVA,
  MODOS_CONFIG,
  TEMPO_PROVA_MINUTOS,
  TEMPO_TURBO_MINUTOS,
  DISCIPLINAS_NOME,
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
};
