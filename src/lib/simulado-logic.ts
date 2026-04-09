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

// ATENÇÃO: Certifique-se de que este arquivo exporta este objeto
import { ESTRUTURA_PROVA } from "@/data/questoes";

// ═══════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════

export const CONSTANTES = {
  TEMPO_PROVA_COMPLETA: 14400, // 4 horas em segundos
  TEMPO_PROVA_TURBO: 2400, // 40 minutos em segundos
  QUESTOES_COMPLETO: 60,
  QUESTOES_TURBO: 50,
  META_APROVACAO: 60,
  PONTUACAO_MINIMA: -60,
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
 * Gera uma nova seed derivada sempre positiva.
 * ✅ CORREÇÃO: Math.abs() para garantir que o embaralhamento não quebre com índices negativos.
 */
function deriveSeed(baseSeed: number, modifier: number): number {
  const val = (baseSeed * 31 + modifier) % 2147483647;
  return Math.abs(val);
}

/**
 * Embaralha array usando algoritmo Fisher-Yates com seed opcional.
 */
export function embaralhar<T>(array: T[], seed?: number): T[] {
  let m = array.length;
  // Garante seed inicial positiva
  let s =
    seed !== undefined ? Math.abs(seed) : Math.floor(Math.random() * 1000000);

  while (m) {
    // Algoritmo LCG (Linear Congruential Generator) para pseudo-aleatoriedade
    s = (s * 9301 + 49297) % 233280;
    const i = Math.floor((s / 233280) * m--);

    // Troca Fisher-Yates
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
  seed?: number;
  garantirCobertura?: boolean;
}

/**
 * Seleciona questões proporcionalmente por disciplina
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

  const processarArea = (
    disciplinas: Record<string, number>,
    nomeArea: string,
  ) => {
    Object.entries(disciplinas).forEach(([disc, qtdOriginal]) => {
      const qtd = Math.round((qtdOriginal || 0) * proporcao);
      if (qtd === 0) return;

      let questoesDisponiveis = todasQuestoes.filter(
        (q) => q.disciplina === disc,
      );

      if (questoesDisponiveis.length === 0) {
        erros.push(`Disciplina ${disc} não possui questões cadastradas`);
        return;
      }

      const seedDisciplina = deriveSeed(baseSeed, ++seedIncremental);
      embaralhar(questoesDisponiveis, seedDisciplina);

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

      selecionadas.push(...questoesDisponiveis.slice(0, qtd));
    });
  };

  // ✅ CORREÇÃO: Adiciona verificação de segurança caso ESTRUTURA_PROVA não seja importado corretamente
  if (!ESTRUTURA_PROVA) {
    throw new SimuladoError(
      "Estrutura da prova não definida.",
      "ESTRUTURA_INVALIDA",
    );
  }

  processarArea(ESTRUTURA_PROVA.conhecimentosBasicos.disciplinas, "Básicos");
  processarArea(
    ESTRUTURA_PROVA.conhecimentosEspecificos.disciplinas,
    "Específicos",
  );

  if (erros.length > 0 && !garantirCobertura) {
    throw new SimuladoError(
      `Erro ao montar simulado:\n${erros.join("\n")}`,
      "QUESTOES_INSUFICIENTES",
    );
  }

  const qtdEsperada = isTurbo
    ? CONSTANTES.QUESTOES_TURBO
    : CONSTANTES.QUESTOES_COMPLETO;
  if (selecionadas.length < qtdEsperada * 0.8) {
    throw new SimuladoError(
      `Simulado incompleto: ${selecionadas.length}/${qtdEsperada} questões`,
      "QUESTOES_INSUFICIENTES",
    );
  }

  return embaralhar(selecionadas, deriveSeed(baseSeed, 9999));
}

// ═══════════════════════════════════════════════════════════
// CÁLCULO DE ESTATÍSTICAS
// ═══════════════════════════════════════════════════════════

function inicializarEstatisticasDisciplina(): Record<
  Disciplina,
  EstatisticasDisciplina
> {
  // ✅ CORREÇÃO TS: Tipagem explícita no reduce para garantir a chave seja Disciplina
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

function processarQuestao(
  questao: QuestaoRespondida,
  stats: Record<Disciplina, EstatisticasDisciplina>,
  contadores: { acertos: number; erros: number; brancos: number },
): void {
  // ✅ CORREÇÃO: Type cast seguro. Assumimos que a disciplina da questão é válida,
  // mas inicializamos se não existir para evitar crash.
  const disc = questao.disciplina as Disciplina;

  if (!stats[disc]) {
    console.warn(
      `[Estatísticas] Disciplina não mapeada: ${disc}. Inicializando.`,
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

function finalizarEstatisticasDisciplina(
  stats: Record<Disciplina, EstatisticasDisciplina>,
): void {
  // ✅ CORREÇÃO TS: Iterar sobre as chaves conhecidas (ORDEM_DISCIPLINAS) em vez de Object.keys
  // Isso garante que o TS entenda que `stats[disc]` é do tipo correto.
  ORDEM_DISCIPLINAS.forEach((disc) => {
    const s = stats[disc];
    if (s.total > 0) {
      s.percentual = (s.acertos / s.total) * 100;
      s.pontuacao = s.acertos - s.erros;
    }
  });

  // Também processa dinamicamente caso haja disciplinas extras não listadas em ORDEM_DISCIPLINAS
  (Object.keys(stats) as Disciplina[]).forEach((disc) => {
    if (!ORDEM_DISCIPLINAS.includes(disc)) {
      const s = stats[disc];
      if (s.total > 0) {
        s.percentual = (s.acertos / s.total) * 100;
        s.pontuacao = s.acertos - s.erros;
      }
    }
  });
}

export function calcularEstatisticas(
  questoes: QuestaoRespondida[],
  tempoTotal: number,
  tempoLimite?: number,
): EstatisticasSimulado {
  const contadores = { acertos: 0, erros: 0, brancos: 0 };
  const desempenhoPorDisciplina = inicializarEstatisticasDisciplina();

  questoes.forEach((q) =>
    processarQuestao(q, desempenhoPorDisciplina, contadores),
  );

  finalizarEstatisticasDisciplina(desempenhoPorDisciplina);

  const pontuacao = contadores.acertos - contadores.erros;
  const percentual =
    questoes.length > 0 ? (pontuacao / questoes.length) * 100 : 0;

  const tempoEfetivo = Math.min(tempoTotal, tempoLimite ?? Infinity);
  const questoesRespondidas = contadores.acertos + contadores.erros;

  return {
    totalQuestoes: questoes.length,
    acertos: contadores.acertos,
    erros: contadores.erros,
    brancos: contadores.brancos,
    pontuacao,
    percentual,
    tempoTotal: tempoEfetivo,
    tempoMedioPorQuestao:
      questoesRespondidas > 0
        ? Math.round(tempoEfetivo / questoesRespondidas)
        : 0,
    desempenhoPorDisciplina, // Tipo agora bate exatamente
    taxaResposta:
      questoes.length > 0 ? (questoesRespondidas / questoes.length) * 100 : 0,
  };
}

// ═══════════════════════════════════════════════════════════
// ANÁLISE E CLASSIFICAÇÃO
// ═══════════════════════════════════════════════════════════

export function classificarDesempenho(
  pontuacao: number,
  totalQuestoes: number,
): ClassificacaoDesempenho {
  const percentual = totalQuestoes > 0 ? (pontuacao / totalQuestoes) * 100 : 0;

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

  return {
    nivel: "critico",
    mensagem: "🚨 Crítico! Erros estão superando acertos.",
    cor: "#ef4444",
    icone: "warning-circle",
    score: percentual,
  };
}

export function identificarPontosFracos(
  estatisticas: EstatisticasSimulado,
  limitePercentual: number = 50,
): Disciplina[] {
  return ORDEM_DISCIPLINAS.filter((disc) => {
    const stats = estatisticas.desempenhoPorDisciplina[disc];
    return stats.total > 0 && stats.percentual < limitePercentual;
  }).sort((a, b) => {
    const pa = estatisticas.desempenhoPorDisciplina[a].percentual;
    const pb = estatisticas.desempenhoPorDisciplina[b].percentual;
    return pa - pb;
  });
}

export function calcularTendencia(
  estatisticasAtual: EstatisticasSimulado,
  historico: EstatisticasSimulado[],
): "subindo" | "estavel" | "caindo" {
  if (historico.length < 2) return "estavel";

  const qtdHistorico = Math.min(historico.length, 3);
  const recentes = historico.slice(-qtdHistorico);

  const mediaRecente =
    recentes.reduce((a, h) => a + h.pontuacao, 0) / recentes.length;

  const diferenca = estatisticasAtual.pontuacao - mediaRecente;

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

export function formatarTempo(
  segundos: number,
  opcoes: OpcoesFormatacao = {},
): string {
  const { sempreComHoras = false, abreviado = false, separador = ":" } = opcoes;

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

export function formatarTempoMinutos(minutos: number): string {
  return formatarTempo(minutos * 60, { abreviado: true });
}

export function formatarTempoLegivel(segundos: number): string {
  return formatarTempo(segundos, { abreviado: true });
}

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
