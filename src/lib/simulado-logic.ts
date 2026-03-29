// lib/simulado-logic.ts
import {
  ClassificacaoDesempenho,
  Disciplina,
  EstatisticasDisciplina,
  EstatisticasSimulado,
  ModoSimulado,
  Questao,
  QuestaoRespondida,
} from "@/data/types";

import { ESTRUTURA_PROVA } from "@/data/questoes";

// ═══════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════

export const CONSTANTES = {
  TEMPO_PROVA_COMPLETA: 14400, // 4 horas em segundos
  TEMPO_PROVA_TURBO: 2400, // 40 minutos em segundos
  QUESTOES_COMPLETO: 60,
  QUESTOES_TURBO: 50,
  META_APROVACAO: 60, // 60% para aprovação típica
  PONTUACAO_MINIMA: -60, // CEBRASPE permite negativo
} as const;

const ORDEM_DISCIPLINAS: Disciplina[] = [
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
// ERROS CUSTOMIZADOS
// ═══════════════════════════════════════════════════════════

export class SimuladoError extends Error {
  constructor(
    message: string,
    public code:
      | "QUESTOES_INSUFICIENTES"
      | "DISCIPLINA_VAZIA"
      | "ESTRUTURA_INVALIDA",
  ) {
    super(message);
    this.name = "SimuladoError";
  }
}

// ═══════════════════════════════════════════════════════════
// FUNÇÕES DE EMBARALHAMENTO E SELEÇÃO
// ═══════════════════════════════════════════════════════════

/**
 * Gera uma nova seed derivada a partir de uma base e um índice.
 * Garante que o embaralhamento seja único por disciplina/etapa,
 * mas reprodutível se a seed base for a mesma.
 */
function deriveSeed(baseSeed: number, modifier: number): number {
  // Algoritmo simples de hash para modificar a seed
  return (baseSeed * 31 + modifier) % 2147483647;
}

/**
 * Embaralha array usando algoritmo Fisher-Yates com seed opcional.
 * Modifica o array in-place para performance, mas retorna a referência.
 */
export function embaralhar<T>(array: T[], seed?: number): T[] {
  let m = array.length;
  let s = seed ?? Math.floor(Math.random() * 1000000);

  // Enquanto houver elementos para embaralhar
  while (m) {
    // Pega um índice aleatório restante
    s = (s * 9301 + 49297) % 233280;
    const i = Math.floor((s / 233280) * m--);

    // Troca com o elemento atual
    [array[m], array[i]] = [array[i], array[m]];
  }

  return array;
}

/** Gera seed baseado em data para simulados diários */
export function gerarSeedDiario(): number {
  const hoje = new Date();
  return (
    hoje.getFullYear() * 10000 + (hoje.getMonth() + 1) * 100 + hoje.getDate()
  );
}

interface SelecionarQuestoesOptions {
  modo: ModoSimulado;
  seed?: number; // para reproduzir mesmo simulado
  garantirCobertura?: boolean; // garante pelo menos 1 de cada disciplina
}

/**
 * Seleciona questões proporcionalmente por disciplina
 * @throws {SimuladoError} Se não houver questões suficientes
 */
export function selecionarQuestoes(
  todasQuestoes: Questao[],
  options: SelecionarQuestoesOptions,
): Questao[] {
  const { modo, seed, garantirCobertura = true } = options;

  const isTurbo = modo === "TURBO";
  const proporcao = isTurbo
    ? CONSTANTES.QUESTOES_TURBO / CONSTANTES.QUESTOES_COMPLETO
    : 1;

  const selecionadas: Questao[] = [];
  const erros: string[] = [];
  const baseSeed = seed ?? Date.now();
  let seedIncremental = 0;

  // Helper para processar uma área (básica ou específica)
  const processarArea = (
    disciplinas: Record<string, number>,
    nomeArea: string,
  ) => {
    Object.entries(disciplinas).forEach(([disc, qtdOriginal]) => {
      const qtd = Math.round((qtdOriginal || 0) * proporcao);
      if (qtd === 0) return;

      // Filtra questões da disciplina atual
      let questoesDisponiveis = todasQuestoes.filter(
        (q) => q.disciplina === disc,
      );

      // Validação de existência
      if (questoesDisponiveis.length === 0) {
        erros.push(`Disciplina ${disc} não possui questões cadastradas`);
        return;
      }

      // Embaralha a lista disponível com uma seed única para esta disciplina
      // Isso evita que a mesma ordem se repita em todas as matérias
      const seedDisciplina = deriveSeed(baseSeed, ++seedIncremental);
      embaralhar(questoesDisponiveis, seedDisciplina);

      // Remove as questões selecionadas do pool disponível para evitar duplicatas
      // (Se o banco for pequeno e reutilizar questões, o slice abaixo já isola as usadas)
      // O ideal seria ter um pool global, mas a estrutura atual é por disciplina.

      // Verifica se há quantidade suficiente
      if (questoesDisponiveis.length < qtd) {
        if (garantirCobertura) {
          console.warn(
            `[Simulado] ${disc}: solicitadas ${qtd}, disponíveis ${questoesDisponiveis.length}. Usando todas.`,
          );
          selecionadas.push(...questoesDisponiveis);
        } else {
          erros.push(
            `${disc}: insuficiente (precisa: ${qtd}, tem: ${questoesDisponiveis.length})`,
          );
        }
        return;
      }

      // Adiciona as N primeiras questões da lista embaralhada
      selecionadas.push(...questoesDisponiveis.slice(0, qtd));
    });
  };

  // Processa áreas
  processarArea(ESTRUTURA_PROVA.conhecimentosBasicos.disciplinas, "Básicos");
  processarArea(
    ESTRUTURA_PROVA.conhecimentosEspecificos.disciplinas,
    "Específicos",
  );

  // Lança erro se houver problemas críticos e não estiver em modo cobertura forçada
  if (erros.length > 0 && !garantirCobertura) {
    throw new SimuladoError(
      `Erro ao montar simulado:\n${erros.join("\n")}`,
      "QUESTOES_INSUFICIENTES",
    );
  }

  // Validação final de quantidade mínima (80% do esperado)
  const qtdEsperada = isTurbo
    ? CONSTANTES.QUESTOES_TURBO
    : CONSTANTES.QUESTOES_COMPLETO;
  if (selecionadas.length < qtdEsperada * 0.8) {
    throw new SimuladoError(
      `Simulado incompleto: ${selecionadas.length}/${qtdEsperada} questões`,
      "QUESTOES_INSUFICIENTES",
    );
  }

  // Embaralhamento final para misturar Básicos e Específicos
  // Usa uma nova seed derivada para não repetir a ordem anterior
  return embaralhar(selecionadas, deriveSeed(baseSeed, 9999));
}

// ═══════════════════════════════════════════════════════════
// CÁLCULO DE ESTATÍSTICAS
// ═══════════════════════════════════════════════════════════

/** Inicializa estatísticas vazias para todas as disciplinas conhecidas */
function inicializarEstatisticasDisciplina(): Record<
  string,
  EstatisticasDisciplina
> {
  return ORDEM_DISCIPLINAS.reduce(
    (acc, disc) => {
      acc[disc] = {
        total: 0,
        acertos: 0,
        erros: 0,
        brancos: 0,
        percentual: 0,
        pontuacao: 0,
      };
      return acc;
    },
    {} as Record<string, EstatisticasDisciplina>,
  );
}

/** Processa uma questão e atualiza estatísticas de forma segura */
function processarQuestao(
  questao: QuestaoRespondida,
  stats: Record<string, EstatisticasDisciplina>,
  contadores: { acertos: number; erros: number; brancos: number },
): void {
  const disc = questao.disciplina as unknown as string; // Type guard se necessário

  // Garante entrada no objeto de stats mesmo se a disciplina não estiver na lista padrão
  if (!stats[disc]) {
    console.warn(
      `[Estatísticas] Disciplina não mapeada: ${disc}. Inicializando dinamicamente.`,
    );
    stats[disc] = {
      total: 0,
      acertos: 0,
      erros: 0,
      brancos: 0,
      percentual: 0,
      pontuacao: 0,
    };
  }

  stats[disc].total++;

  const resposta = questao.respostaUsuario;

  if (resposta === null || resposta === undefined) {
    contadores.brancos++;
    stats[disc].brancos++;
  } else if (resposta === questao.resposta) {
    contadores.acertos++;
    stats[disc].acertos++;
  } else {
    contadores.erros++;
    stats[disc].erros++;
  }
}

/** Finaliza cálculos por disciplina (percentuais e pontuações) */
function finalizarEstatisticasDisciplina(
  stats: Record<string, EstatisticasDisciplina>,
): void {
  Object.keys(stats).forEach((disc) => {
    const s = stats[disc];
    if (s.total > 0) {
      s.percentual = (s.acertos / s.total) * 100;
      // Regra CEBRASPE por disciplina também (útil para análise posterior)
      s.pontuacao = s.acertos - s.erros;
    }
  });
}

/**
 * Calcula estatísticas segundo regra CEBRASPE oficial
 * Pontuação = acertos - erros (pode ser negativa!)
 */
export function calcularEstatisticas(
  questoes: QuestaoRespondida[],
  tempoTotal: number,
  tempoLimite?: number,
): EstatisticasSimulado {
  const contadores = { acertos: 0, erros: 0, brancos: 0 };
  const desempenhoPorDisciplina = inicializarEstatisticasDisciplina();

  // Processa todas as questões
  questoes.forEach((q) =>
    processarQuestao(q, desempenhoPorDisciplina, contadores),
  );

  // Finaliza cálculos por disciplina
  finalizarEstatisticasDisciplina(desempenhoPorDisciplina);

  // Regra CEBRASPE: pontuação bruta = acertos - erros
  const pontuacao = contadores.acertos - contadores.erros;

  // Percentual baseado na pontuação possível (pontos / total questões)
  // Nota: Se a prova vale 60 pontos, e você fez 20, seu % é 33.3%, mesmo que tenha acertado 40 e errado 20.
  const percentual =
    questoes.length > 0 ? (pontuacao / questoes.length) * 100 : 0;

  // Calcula tempo efetivo (não pode ser maior que o limite se encerrado automaticamente)
  const tempoEfetivo = Math.min(tempoTotal, tempoLimite ?? Infinity);
  const questoesRespondidas = contadores.acertos + contadores.erros;

  return {
    totalQuestoes: questoes.length,
    acertos: contadores.acertos,
    erros: contadores.erros,
    brancos: contadores.brancos,
    pontuacao, // Pode ser negativa!
    percentual, // Pode ser negativo
    tempoTotal: tempoEfetivo,
    tempoMedioPorQuestao:
      questoesRespondidas > 0
        ? Math.round(tempoEfetivo / questoesRespondidas)
        : 0,
    desempenhoPorDisciplina: desempenhoPorDisciplina as Record<
      Disciplina,
      EstatisticasDisciplina
    >,
    taxaResposta:
      questoes.length > 0 ? (questoesRespondidas / questoes.length) * 100 : 0,
  };
}

// ═══════════════════════════════════════════════════════════
// ANÁLISE E CLASSIFICAÇÃO
// ═══════════════════════════════════════════════════════════

/**
 * Classifica desempenho baseado na pontuação CEBRASPE
 * Considera que a prova pode ter nota negativa
 */
export function classificarDesempenho(
  pontuacao: number,
  totalQuestoes: number,
): ClassificacaoDesempenho {
  // Cálculo do percentual de aproveitamento real da pontuação
  const percentual = totalQuestoes > 0 ? (pontuacao / totalQuestoes) * 100 : 0;

  // Faixas baseadas na regra de corte e margem de segurança
  // CEBRASPE: Acerto +1, Erro -1. Range teórico: -60 a +60.
  // Aprovação geralmente gira em torno de 40-50% da pontuação MÁXIMA possível,
  // mas para regra CEBRASPE (que anula), o corte costuma ser mais baixo.
  // Aqui consideramos 60% da pontuação MÁXIMA (ex: 36 pontos em 60) como Excelente.

  if (pontuacao >= totalQuestoes * 0.6) {
    return {
      nivel: "excelente",
      mensagem:
        pontuacao >= totalQuestoes * 0.75
          ? "🎯 Excelente! Aprovação confortável!"
          : "✅ Muito bom! Dentro da faixa de aprovação.",
      cor: "#10b981",
      icone: "trophy",
      score: percentual,
    };
  }

  if (pontuacao >= totalQuestoes * 0.3) {
    return {
      nivel: "bom",
      mensagem: "📊 Na média, mas precisa garantir mais acertos.",
      cor: "#3b82f6",
      icone: "chart-line-up",
      score: percentual,
    };
  }

  if (pontuacao >= 0) {
    return {
      nivel: "regular",
      mensagem: "⚠️ Abaixo da média. Muitos erros estão anulando acertos.",
      cor: "#f59e0b",
      icone: "warning",
      score: percentual,
    };
  }

  // Pontuação negativa
  return {
    nivel: "critico",
    mensagem: "🚨 Crítico! Erros estão superando acertos.",
    cor: "#ef4444",
    icone: "warning-circle",
    score: percentual,
  };
}

/** Identifica disciplinas mais fracas para foco de estudo */
export function identificarPontosFracos(
  estatisticas: EstatisticasSimulado,
  limitePercentual: number = 50, // Ajustado para 50% (pontuação positiva)
): Disciplina[] {
  return ORDEM_DISCIPLINAS.filter((disc) => {
    const stats = estatisticas.desempenhoPorDisciplina[disc];
    // Filtro: tem questões respondidas E pontuação percentual abaixo do limite
    return stats.total > 0 && stats.percentual < limitePercentual;
  }).sort((a, b) => {
    const pa = estatisticas.desempenhoPorDisciplina[a].percentual;
    const pb = estatisticas.desempenhoPorDisciplina[b].percentual;
    return pa - pb; // Ordem crescente (piores primeiro)
  });
}

/** Calcula tendência comparando com histórico recente */
export function calcularTendencia(
  estatisticasAtual: EstatisticasSimulado,
  historico: EstatisticasSimulado[],
): "subindo" | "estavel" | "caindo" {
  if (historico.length < 2) return "estavel";

  // Pega os últimos 3 simulados ou menos se não houver
  const qtdHistorico = Math.min(historico.length, 3);
  const recentes = historico.slice(-qtdHistorico);

  const mediaRecente =
    recentes.reduce((a, h) => a + h.pontuacao, 0) / recentes.length;

  const diferenca = estatisticasAtual.pontuacao - mediaRecente;

  // Limiar de sensibilidade (5 pontos de diferença)
  if (diferenca > 5) return "subindo";
  if (diferenca < -5) return "caindo";
  return "estavel";
}

// ═══════════════════════════════════════════════════════════
// FORMATAÇÃO DE TEMPO
// ═══════════════════════════════════════════════════════════

export interface OpcoesFormatacao {
  sempreComHoras?: boolean;
  abreviado?: boolean;
  separador?: string;
}

/**
 * Formata tempo em segundos para exibição (HH:MM:SS ou MM:SS)
 */
export function formatarTempo(
  segundos: number,
  opcoes: OpcoesFormatacao = {},
): string {
  const { sempreComHoras = false, abreviado = false, separador = ":" } = opcoes;

  // Garante que segundos seja não-negativo
  const s = Math.max(0, Math.floor(segundos));

  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (abreviado) {
    if (hrs > 0) return `${hrs}h ${mins}min`;
    if (mins > 0) return `${mins}min ${secs}s`;
    return `${secs}s`;
  }

  const parts: string[] = [];

  if (hrs > 0 || sempreComHoras) {
    parts.push(hrs.toString().padStart(2, "0"));
  }

  parts.push(mins.toString().padStart(2, "0"));
  parts.push(secs.toString().padStart(2, "0"));

  return parts.join(separador);
}

/** Formata tempo em minutos para exibição amigável */
export function formatarTempoMinutos(minutos: number): string {
  return formatarTempo(minutos * 60, { abreviado: true });
}

/** Formata tempo em segundos para texto legível */
export function formatarTempoLegivel(segundos: number): string {
  return formatarTempo(segundos, { abreviado: true });
}

/** Converte string de tempo (HH:MM:SS) para segundos */
export function parseTempo(tempoStr: string): number {
  const parts = tempoStr.split(":").map((p) => parseInt(p, 10));

  if (parts.some(isNaN)) {
    throw new Error(`Formato de tempo inválido: ${tempoStr}`);
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  return parts[0] || 0;
}

// ═══════════════════════════════════════════════════════════
// UTILITÁRIOS DE SIMULADO
// ═══════════════════════════════════════════════════════════

/** Gera resumo executivo do simulado */
export function gerarResumoSimulado(
  estatisticas: EstatisticasSimulado,
): string {
  const classificacao = classificarDesempenho(
    estatisticas.pontuacao,
    estatisticas.totalQuestoes,
  );

  const pontosFracos = identificarPontosFracos(estatisticas);

  const linhas = [
    `📊 Simulado PRF - Resumo`,
    ``,
    `Pontuação: ${estatisticas.pontuacao}/${estatisticas.totalQuestoes} (${estatisticas.percentual.toFixed(1)}%)`,
    `Status: ${classificacao.mensagem}`,
    `Tempo: ${formatarTempoLegivel(estatisticas.tempoTotal)}`,
    ``,
    `Acertos: ${estatisticas.acertos} | Erros: ${estatisticas.erros} | Brancos: ${estatisticas.brancos}`,
  ];

  if (pontosFracos.length > 0) {
    linhas.push(``);
    linhas.push(`⚠️ Disciplinas que precisam de atenção:`);
    pontosFracos.slice(0, 3).forEach((disc) => {
      const stats = estatisticas.desempenhoPorDisciplina[disc];
      linhas.push(
        `  • ${disc}: ${stats.percentual.toFixed(0)}% (${stats.pontuacao} pts)`,
      );
    });
  }

  return linhas.join("\n");
}

/** Exporta para formato compatível com planilhas */
export function exportarCSV(estatisticas: EstatisticasSimulado): string {
  const headers = [
    "Disciplina",
    "Total",
    "Acertos",
    "Erros",
    "Brancos",
    "% Acerto",
    "Pontuação (Adq - Err)",
  ];
  const rows = ORDEM_DISCIPLINAS.map((disc) => {
    const s = estatisticas.desempenhoPorDisciplina[disc];
    return [
      disc,
      s.total,
      s.acertos,
      s.erros,
      s.brancos,
      s.percentual.toFixed(1).replace(".", ","),
      s.pontuacao,
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}
