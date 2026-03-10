import {
  ClassificacaoDesempenho,
  Disciplina,
  EstatisticasDisciplina,
  EstatisticasSimulado,
  FaseTempo,
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
 * Embaralha array usando algoritmo Fisher-Yates com seed opcional
 * Permite reproduzir o mesmo embaralhamento para debug
 */
export function embaralhar<T>(array: T[], seed?: number): T[] {
  const novoArray = [...array];
  let s = seed ?? Math.floor(Math.random() * 1000000);

  for (let i = novoArray.length - 1; i > 0; i--) {
    // Linear Congruential Generator para seed previsível
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
  }

  return novoArray;
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

  // Helper para processar uma área (básica ou específica)
  const processarArea = (
    disciplinas: Record<string, number>,
    nomeArea: string,
  ) => {
    Object.entries(disciplinas).forEach(([disc, qtdOriginal]) => {
      const qtd = Math.round((qtdOriginal || 0) * proporcao);
      const questoesDisc = todasQuestoes.filter((q) => q.disciplina === disc);

      // Validação
      if (questoesDisc.length === 0) {
        erros.push(`Disciplina ${disc} não possui questões cadastradas`);
        return;
      }

      if (questoesDisc.length < qtd) {
        if (garantirCobertura && questoesDisc.length > 0) {
          // Usa o que tem disponível
          console.warn(
            `[Simulado] ${disc}: solicitadas ${qtd}, disponíveis ${questoesDisc.length}`,
          );
          const embaralhadas = embaralhar(questoesDisc, seed);
          selecionadas.push(...embaralhadas);
        } else {
          erros.push(
            `${disc}: insuficiente (precisa: ${qtd}, tem: ${questoesDisc.length})`,
          );
        }
        return;
      }

      const embaralhadas = embaralhar(questoesDisc, seed);
      selecionadas.push(...embaralhadas.slice(0, qtd));
    });
  };

  // Processa áreas
  processarArea(ESTRUTURA_PROVA.conhecimentosBasicos.disciplinas, "Básicos");
  processarArea(
    ESTRUTURA_PROVA.conhecimentosEspecificos.disciplinas,
    "Específicos",
  );

  // Lança erro se houver problemas críticos
  if (erros.length > 0 && !garantirCobertura) {
    throw new SimuladoError(
      `Erro ao montar simulado:\n${erros.join("\n")}`,
      "QUESTOES_INSUFICIENTES",
    );
  }

  // Validação final
  const qtdEsperada = isTurbo
    ? CONSTANTES.QUESTOES_TURBO
    : CONSTANTES.QUESTOES_COMPLETO;
  if (selecionadas.length < qtdEsperada * 0.8) {
    throw new SimuladoError(
      `Simulado incompleto: ${selecionadas.length}/${qtdEsperada} questões`,
      "QUESTOES_INSUFICIENTES",
    );
  }

  // Embaralha final mantendo proporção de áreas misturadas
  return embaralhar(selecionadas, seed ? seed + 1 : undefined);
}

// ═══════════════════════════════════════════════════════════
// CÁLCULO DE ESTATÍSTICAS
// ═══════════════════════════════════════════════════════════

/** Inicializa estatísticas vazias para todas as disciplinas */
function inicializarEstatisticasDisciplina(): Record<
  Disciplina,
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
    {} as Record<Disciplina, EstatisticasDisciplina>,
  );
}

/** Processa uma questão e atualiza estatísticas */
function processarQuestao(
  questao: QuestaoRespondida,
  stats: Record<Disciplina, EstatisticasDisciplina>,
  contadores: { acertos: number; erros: number; brancos: number },
): void {
  const disc = questao.disciplina;

  if (!stats[disc]) {
    console.warn(`[Estatísticas] Disciplina desconhecida: ${disc}`);
    return;
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

/** Finaliza cálculos por disciplina */
function finalizarEstatisticasDisciplina(
  stats: Record<Disciplina, EstatisticasDisciplina>,
): void {
  ORDEM_DISCIPLINAS.forEach((disc) => {
    const s = stats[disc];
    if (s.total > 0) {
      s.percentual = (s.acertos / s.total) * 100;
      // Regra CEBRASPE por disciplina também
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
  const percentual = (pontuacao / questoes.length) * 100;

  // Calcula tempo efetivo
  const tempoEfetivo = Math.min(tempoTotal, tempoLimite ?? Infinity);
  const questoesRespondidas = contadores.acertos + contadores.erros;

  return {
    totalQuestoes: questoes.length,
    acertos: contadores.acertos,
    erros: contadores.erros,
    brancos: contadores.brancos,
    pontuacao, // Pode ser negativa! Não usar Math.max(0, ...)
    percentual, // Também pode ser negativa
    tempoTotal: tempoEfetivo,
    tempoMedioPorQuestao:
      questoesRespondidas > 0
        ? Math.round(tempoEfetivo / questoesRespondidas)
        : 0,
    desempenhoPorDisciplina,
    taxaResposta: (questoesRespondidas / questoes.length) * 100,
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
  const percentual = (pontuacao / totalQuestoes) * 100;
  const notaMaxima = totalQuestoes;
  const notaMinima = -totalQuestoes; // CEBRASPE: -1 por erro

  // Normaliza para escala 0-100 considerando range negativo
  const range = notaMaxima - notaMinima;
  const posicao = (pontuacao - notaMinima) / range;
  const scoreNormalizado = posicao * 100;

  if (percentual >= 60) {
    return {
      nivel: "excelente",
      mensagem:
        percentual >= 70
          ? "🎯 Excelente! Aprovação garantida!"
          : "✅ Bom! Dentro da média de aprovação",
      cor: "#10b981",
      icone: "trophy",
      score: scoreNormalizado,
    };
  }

  if (percentual >= 40) {
    return {
      nivel: "bom",
      mensagem: "📊 Na média, mas precisa melhorar para garantir",
      cor: "#3b82f6",
      icone: "chart",
      score: scoreNormalizado,
    };
  }

  if (percentual >= 20 || pontuacao >= 0) {
    return {
      nivel: "regular",
      mensagem: "⚠️ Abaixo da média. Foque nos pontos fracos!",
      cor: "#f59e0b",
      icone: "alert",
      score: scoreNormalizado,
    };
  }

  if (percentual >= 0) {
    return {
      nivel: "insuficiente",
      mensagem: "❌ Insuficiente. Revisão completa necessária",
      cor: "#f97316",
      icone: "warning",
      score: scoreNormalizado,
    };
  }

  // Pontuação negativa
  return {
    nivel: "critico",
    mensagem: "🚨 Crítico! Muitos erros anulando acertos",
    cor: "#ef4444",
    icone: "danger",
    score: scoreNormalizado,
  };
}

/** Identifica disciplinas mais fracas para foco de estudo */
export function identificarPontosFracos(
  estatisticas: EstatisticasSimulado,
  limitePercentual: number = 60,
): Disciplina[] {
  return ORDEM_DISCIPLINAS.filter((disc) => {
    const stats = estatisticas.desempenhoPorDisciplina[disc];
    return stats.total > 0 && stats.percentual < limitePercentual;
  }).sort((a, b) => {
    const pa = estatisticas.desempenhoPorDisciplina[a].percentual;
    const pb = estatisticas.desempenhoPorDisciplina[b].percentual;
    return pa - pb; // Ordem crescente (piores primeiro)
  });
}

/** Calcula tendência comparando com histórico */
export function calcularTendencia(
  estatisticasAtual: EstatisticasSimulado,
  historico: EstatisticasSimulado[],
): "subindo" | "estavel" | "caindo" {
  if (historico.length < 2) return "estavel";

  const recentes = historico.slice(-3);
  const mediaRecente =
    recentes.reduce((a, h) => a + h.pontuacao, 0) / recentes.length;
  const diferenca = estatisticasAtual.pontuacao - mediaRecente;

  if (diferenca > 5) return "subindo";
  if (diferenca < -5) return "caindo";
  return "estavel";
}

// ═══════════════════════════════════════════════════════════
// FORMATAÇÃO DE TEMPO (ÚNICA VERSÃO CONSOLIDADA)
// ═══════════════════════════════════════════════════════════

export interface OpcoesFormatacao {
  sempreComHoras?: boolean;
  abreviado?: boolean;
  separador?: string;
}

/**
 * Formata tempo em segundos para exibição
 */
export function formatarTempo(
  segundos: number,
  opcoes: OpcoesFormatacao = {},
): string {
  const { sempreComHoras = false, abreviado = false, separador = ":" } = opcoes;

  const hrs = Math.floor(segundos / 3600);
  const mins = Math.floor((segundos % 3600) / 60);
  const secs = segundos % 60;

  if (abreviado) {
    if (hrs > 0) return `${hrs}h${mins}min`;
    if (mins > 0) return `${mins}min`;
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

/** Calcula fase do cronômetro para estilização */
export function calcularFaseCronometro(
  tempoRestante: number,
  tempoTotal: number,
): FaseTempo {
  if (tempoRestante <= 0) return "esgotado";

  const percentual = (tempoRestante / tempoTotal) * 100;

  if (percentual <= 10) return "critico";
  if (percentual <= 25) return "atencao";
  return "normal";
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
      linhas.push(`  • ${disc}: ${stats.percentual.toFixed(0)}%`);
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
    "%",
    "Pontuação",
  ];
  const rows = ORDEM_DISCIPLINAS.map((disc) => {
    const s = estatisticas.desempenhoPorDisciplina[disc];
    return [
      disc,
      s.total,
      s.acertos,
      s.erros,
      s.brancos,
      s.percentual.toFixed(1),
      s.pontuacao,
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}
