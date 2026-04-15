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
// CONSTANTES DA PROVA (movidas para arquivo separado)
// ============================================================

export const TEMPO_PROVA_MINUTOS = 240;
export const TEMPO_TURBO_MINUTOS = 40;

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
// VALIDAÇÃO E CONTROLE DE VERSÃO
// ============================================================

// Type guard para verificar se uma disciplina é válida
function isValidDisciplina(disciplina: string): disciplina is Disciplina {
  const disciplinasValidas: Disciplina[] = [
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
  return disciplinasValidas.includes(disciplina as Disciplina);
}

/** Conta questões por disciplina no banco */
export function contarQuestoesPorDisciplina(): Record<Disciplina, number> {
  const contagem = {} as Record<Disciplina, number>;
  const disciplinas: Disciplina[] = [
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

  disciplinas.forEach((d) => (contagem[d] = 0));

  questoes.forEach((q) => {
    if (isValidDisciplina(q.disciplina)) {
      contagem[q.disciplina]++;
    }
  });

  return contagem;
}

/** Filtra questões por disciplina */
export function getQuestoesPorDisciplina(disciplina: Disciplina): Questao[] {
  return questoes.filter((q) => q.disciplina === disciplina);
}

/** Filtra questões por dificuldade */
export function getQuestoesPorDificuldade(dificuldade: 1 | 2 | 3): Questao[] {
  return questoes.filter((q) => q.dificuldade === dificuldade);
}

/** Filtra questões por banca */
export function getQuestoesPorBanca(banca: string): Questao[] {
  return questoes.filter((q) => q.banca_referencia === banca);
}

/** Busca questões por termo no enunciado ou tags */
export function buscarQuestoes(termo: string): Questao[] {
  const termoLower = termo.toLowerCase();
  return questoes.filter(
    (q) =>
      q.enunciado.toLowerCase().includes(termoLower) ||
      q.explicacao.toLowerCase().includes(termoLower) ||
      q.tags?.some((tag) => tag.toLowerCase().includes(termoLower)),
  );
}

/** Busca questões por assunto */
export function getQuestoesPorAssunto(assunto: string): Questao[] {
  const assuntoLower = assunto.toLowerCase();
  return questoes.filter((q) =>
    q.assunto?.toLowerCase().includes(assuntoLower),
  );
}

/** Seleciona questões aleatórias */
export function selecionarQuestoesAleatorias(quantidade: number): Questao[] {
  const shuffled = [...questoes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, quantidade);
}

/** Seleciona questões por disciplina e quantidade */
export function selecionarQuestoesPorDisciplina(
  disciplina: Disciplina,
  quantidade: number,
): Questao[] {
  const questoesDisciplina = getQuestoesPorDisciplina(disciplina);
  const shuffled = [...questoesDisciplina];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, quantidade);
}

/** Seleciona questões balanceadas por disciplina para simulado completo */
export function selecionarQuestoesBalanceadas(): Questao[] {
  const selecionadas: Questao[] = [];
  const estrutura = ESTRUTURA_PROVA;

  // Conhecimentos básicos
  Object.entries(estrutura.conhecimentosBasicos.disciplinas).forEach(
    ([disciplina, quantidade]) => {
      if (quantidade && quantidade > 0) {
        const questoesDisciplina = getQuestoesPorDisciplina(
          disciplina as Disciplina,
        );
        const shuffled = [...questoesDisciplina];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        selecionadas.push(...shuffled.slice(0, quantidade));
      }
    },
  );

  // Conhecimentos específicos
  Object.entries(estrutura.conhecimentosEspecificos.disciplinas).forEach(
    ([disciplina, quantidade]) => {
      if (quantidade && quantidade > 0) {
        const questoesDisciplina = getQuestoesPorDisciplina(
          disciplina as Disciplina,
        );
        const shuffled = [...questoesDisciplina];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        selecionadas.push(...shuffled.slice(0, quantidade));
      }
    },
  );

  return selecionadas;
}

/** Verifica se há questões suficientes para um simulado completo */
export function verificarCobertura(): { ok: boolean; faltantes: Disciplina[] } {
  const necessario = {
    ...ESTRUTURA_PROVA.conhecimentosBasicos.disciplinas,
    ...ESTRUTURA_PROVA.conhecimentosEspecificos.disciplinas,
  };

  const disponivel = contarQuestoesPorDisciplina();
  const faltantes: Disciplina[] = [];

  Object.entries(necessario).forEach(([disc, qtd]) => {
    const disciplina = disc as Disciplina;
    if (disponivel[disciplina] < (qtd || 0) * 3) {
      faltantes.push(disciplina);
    }
  });

  return {
    ok: faltantes.length === 0,
    faltantes,
  };
}

/** Estatísticas do banco de questões */
export function getEstatisticasBanco() {
  const total = questoes.length;
  const porDisciplina = contarQuestoesPorDisciplina();
  const porDificuldade = {
    1: questoes.filter((q) => q.dificuldade === 1).length,
    2: questoes.filter((q) => q.dificuldade === 2).length,
    3: questoes.filter((q) => q.dificuldade === 3).length,
  };

  const totalComTags = questoes.filter(
    (q) => q.tags && q.tags.length > 0,
  ).length;
  const totalComFonteLegal = questoes.filter(
    (q) => q.fonte_legal && q.fonte_legal.length > 0,
  ).length;
  const totalComBanca = questoes.filter((q) => q.banca_referencia).length;
  const totalComAssunto = questoes.filter((q) => q.assunto).length;
  const totalComAno = questoes.filter((q) => q.ano).length;

  const mediaDificuldade =
    total > 0
      ? (questoes.reduce((acc, q) => acc + q.dificuldade, 0) / total).toFixed(2)
      : "0.00";

  const bancas = new Map<string, number>();
  questoes.forEach((q) => {
    if (q.banca_referencia) {
      bancas.set(q.banca_referencia, (bancas.get(q.banca_referencia) || 0) + 1);
    }
  });

  return {
    total,
    porDisciplina,
    porDificuldade,
    mediaDificuldade,
    totalComTags,
    totalComFonteLegal,
    totalComBanca,
    totalComAssunto,
    totalComAno,
    estatisticasPorBanca: Object.fromEntries(bancas),
  };
}

/** Obtém uma questão pelo ID */
export function getQuestaoById(id: string): Questao | undefined {
  return questoes.find((q) => q.id === id);
}

/** Obtém múltiplas questões por IDs */
export function getQuestoesByIds(ids: string[]): Questao[] {
  return questoes.filter((q) => ids.includes(q.id));
}

/** Valida se todas as questões existem */
export function validarQuestoesExistentes(ids: string[]): {
  validos: string[];
  invalidos: string[];
} {
  const idsSet = new Set(questoes.map((q) => q.id));
  const validos: string[] = [];
  const invalidos: string[] = [];

  ids.forEach((id) => {
    if (idsSet.has(id)) {
      validos.push(id);
    } else {
      invalidos.push(id);
    }
  });

  return { validos, invalidos };
}

/** Agrupa questões por disciplina */
export function agruparQuestoesPorDisciplina(): Map<Disciplina, Questao[]> {
  const mapa = new Map<Disciplina, Questao[]>();
  const disciplinas: Disciplina[] = [
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

  disciplinas.forEach((disciplina) => {
    mapa.set(disciplina, []);
  });

  questoes.forEach((questao) => {
    const lista = mapa.get(questao.disciplina);
    if (lista) {
      lista.push(questao);
    }
  });

  return mapa;
}

/** Retorna o total de questões disponíveis */
export function getTotalQuestoes(): number {
  return questoes.length;
}

/** Retorna disciplinas que têm questões disponíveis */
export function getDisciplinasDisponiveis(): Disciplina[] {
  const contagem = contarQuestoesPorDisciplina();
  const disciplinas: Disciplina[] = [
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
  return disciplinas.filter((disciplina) => contagem[disciplina] > 0);
}

// Export default para compatibilidade
export default {
  questoes,
  ESTRUTURA_PROVA,
  MODOS_CONFIG,
  TEMPO_PROVA_MINUTOS,
  TEMPO_TURBO_MINUTOS,
  contarQuestoesPorDisciplina,
  getQuestoesPorDisciplina,
  getQuestoesPorDificuldade,
  buscarQuestoes,
  selecionarQuestoesAleatorias,
  selecionarQuestoesBalanceadas,
  verificarCobertura,
  getEstatisticasBanco,
  getQuestaoById,
  getQuestoesByIds,
  validarQuestoesExistentes,
  getTotalQuestoes,
  getDisciplinasDisponiveis,
};
