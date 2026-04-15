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

import { ESTRUTURA_PROVA } from "@/data";

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

const DISCIPLINAS_NOME: Record<string, string> = {
  PORTUGUES: "Língua Portuguesa",
  ETICA: "Ética e Conduta",
  RACIOCINIO_LOGICO: "Raciocínio Lógico",
  DIREITO_CONSTITUCIONAL: "Direito Constitucional",
  DIREITO_ADMINISTRATIVO: "Direito Administrativo",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Legislação PRF",
};

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
 * Gera uma nova seed derivada sempre positiva e nunca zero.
 */
function deriveSeed(baseSeed: number, modifier: number): number {
  // FIX: garante que o resultado nunca seja 0 (seed 0 em embaralhar é
  // tecnicamente válido mas pode produzir resultados previsíveis).
  // +1 no final garante que o resultado mínimo seja 1.
  const val = (Math.abs(baseSeed) * 31 + Math.abs(modifier)) % 2147483647;
  return val === 0 ? 1 : val;
}

/**
 * Embaralha uma CÓPIA do array usando Fisher-Yates com seed opcional.
 *
 * FIX crítico: a versão anterior mutava o array original in-place.
 * Isso corromperia a ordem de `todasQuestoes` (banco global de questões)
 * a cada chamada de `selecionarQuestoes`. Agora retorna sempre uma nova cópia.
 */
export function embaralhar<T>(array: readonly T[], seed?: number): T[] {
  // Cria cópia para não mutar o original
  const copia = [...array];
  let m = copia.length;
  let s =
    seed !== undefined
      ? Math.abs(seed) || 1 // seed 0 → 1
      : Math.floor(Math.random() * 1_000_000) + 1;

  while (m) {
    s = (s * 9301 + 49297) % 233280;
    const i = Math.floor((s / 233280) * m--);
    [copia[m], copia[i]] = [copia[i], copia[m]];
  }

  return copia;
}

/** Gera seed baseado em data para simulados diários consistentes */
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
 * Seleciona questões proporcionalmente por disciplina.
 *
 * FIX: `embaralhar` agora retorna cópia — o banco original nunca é mutado.
 * FIX: o retorno de `embaralhar` é atribuído à variável antes do slice.
 */
export function selecionarQuestoes(
  todasQuestoes: readonly Questao[],
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

  const processarArea = (disciplinas: Record<string, number>) => {
    for (const [disc, qtdOriginal] of Object.entries(disciplinas)) {
      const qtd = Math.round((qtdOriginal || 0) * proporcao);
      if (qtd === 0) continue;

      const questoesDisponiveis = todasQuestoes.filter(
        (q) => q.disciplina === disc,
      );

      if (questoesDisponiveis.length === 0) {
        erros.push(`Disciplina ${disc} não possui questões cadastradas`);
        continue;
      }

      const seedDisciplina = deriveSeed(baseSeed, ++seedIncremental);

      // FIX: embaralhar retorna nova cópia — atribuímos ao resultado
      const embaralhadas = embaralhar(questoesDisponiveis, seedDisciplina);

      if (embaralhadas.length < qtd) {
        if (garantirCobertura) {
          console.warn(
            `[Simulado] ${disc}: solicitadas ${qtd}, disponíveis ${embaralhadas.length}. Usando todas.`,
          );
          selecionadas.push(...embaralhadas);
        } else {
          erros.push(
            `${disc}: insuficiente (precisa: ${qtd}, tem: ${embaralhadas.length})`,
          );
        }
        continue;
      }

      selecionadas.push(...embaralhadas.slice(0, qtd));
    }
  };

  if (!ESTRUTURA_PROVA) {
    throw new SimuladoError(
      "Estrutura da prova não definida.",
      "ESTRUTURA_INVALIDA",
    );
  }

  processarArea(ESTRUTURA_PROVA.conhecimentosBasicos.disciplinas);
  processarArea(ESTRUTURA_PROVA.conhecimentosEspecificos.disciplinas);

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
  const inicial: Partial<Record<Disciplina, EstatisticasDisciplina>> = {};

  for (const disc of ORDEM_DISCIPLINAS) {
    inicial[disc] = {
      total: 0,
      acertos: 0,
      erros: 0,
      brancos: 0,
      percentual: 0,
      pontuacao: 0,
    };
  }

  return inicial as Record<Disciplina, EstatisticasDisciplina>;
}

function processarQuestao(
  questao: QuestaoRespondida,
  stats: Record<string, EstatisticasDisciplina>,
  contadores: { acertos: number; erros: number; brancos: number },
): void {
  const disc = questao.disciplina;

  if (!stats[disc]) {
    stats[disc] = {
      total: 0,
      acertos: 0,
      erros: 0,
      brancos: 0,
      percentual: 0,
      pontuacao: 0,
    };
  }

  const stat = stats[disc];
  stat.total++;

  const resposta = questao.respostaUsuario;

  if (resposta === null || resposta === undefined) {
    contadores.brancos++;
    stat.brancos++;
  } else if (resposta === questao.resposta) {
    contadores.acertos++;
    stat.acertos++;
  } else {
    contadores.erros++;
    stat.erros++;
  }
}

function finalizarEstatisticasDisciplina(
  stats: Record<string, EstatisticasDisciplina>,
): void {
  for (const [, stat] of Object.entries(stats)) {
    if (stat.total > 0) {
      // FIX: percentual = acertos / total × 100 (taxa de acerto real, 0–100)
      // Isso é consistente com como o restante do app usa `percentual`.
      // A pontuação CEBRASPE (acertos - erros) fica em `pontuacao`.
      stat.percentual = (stat.acertos / stat.total) * 100;
      stat.pontuacao = stat.acertos - stat.erros;
    }
  }
}

/**
 * Calcula estatísticas completas de um simulado.
 *
 * FIX: `percentual` agora é a taxa de acerto (acertos / total × 100),
 * separado de `pontuacao` que é a pontuação CEBRASPE (acertos - erros).
 * Antes, `percentual = pontuacao / total × 100` podia ser negativo.
 */
export function calcularEstatisticas(
  questoes: QuestaoRespondida[],
  tempoTotal: number,
  tempoLimite?: number,
): EstatisticasSimulado {
  const contadores = { acertos: 0, erros: 0, brancos: 0 };
  const desempenhoPorDisciplina = inicializarEstatisticasDisciplina();

  for (const q of questoes) {
    processarQuestao(q, desempenhoPorDisciplina, contadores);
  }

  finalizarEstatisticasDisciplina(desempenhoPorDisciplina);

  const total = questoes.length;
  const pontuacao = contadores.acertos - contadores.erros;

  // FIX: percentual = taxa de acerto real (sempre 0–100)
  const percentual = total > 0 ? (contadores.acertos / total) * 100 : 0;

  const tempoEfetivo =
    tempoLimite != null ? Math.min(tempoTotal, tempoLimite) : tempoTotal;

  const questoesRespondidas = contadores.acertos + contadores.erros;

  return {
    totalQuestoes: total,
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
    desempenhoPorDisciplina,
    taxaResposta: total > 0 ? (questoesRespondidas / total) * 100 : 0,
  };
}

// ═══════════════════════════════════════════════════════════
// ANÁLISE E CLASSIFICAÇÃO
// ═══════════════════════════════════════════════════════════

/**
 * Classifica o desempenho baseado na pontuação CEBRASPE bruta.
 *
 * FIX crítico: a assinatura foi clarificada.
 *
 * `pontuacaoBruta` é a pontuação CEBRASPE (acertos - erros), que vai de
 * -totalQuestoes até +totalQuestoes.
 *
 * O código anterior era chamado com `percentual` (0–100) em algumas páginas
 * e com pontuação bruta em outras, causando classificações sempre "excelente"
 * quando chamado com percentual já calculado.
 *
 * BREAKING CHANGE: se você chamava `classificarDesempenho(percentual, 60)`,
 * passe agora `classificarDesempenho(pontuacaoBruta, totalQuestoes)`.
 * O dashboard foi corrigido para passar `estatisticas.pontuacao` em vez de
 * um percentual pré-calculado.
 */
export function classificarDesempenho(
  pontuacaoBruta: number,
  totalQuestoes: number,
): ClassificacaoDesempenho {
  if (totalQuestoes <= 0) {
    return {
      nivel: "regular",
      mensagem: "⚠️ Sem questões para avaliar.",
      cor: "#f59e0b",
      icone: "warning",
      score: 0,
    };
  }

  // Converte para percentual de aproveitamento (0–100) para exibição
  // Fórmula: (pontuacao + total) / (2 * total) × 100
  // Onde: pontuacao = -total → 0%, pontuacao = 0 → 50%, pontuacao = +total → 100%
  const scoreAproveitamento =
    ((pontuacaoBruta + totalQuestoes) / (2 * totalQuestoes)) * 100;

  // Limiares baseados na pontuação bruta proporcional (igual ao original)
  if (pontuacaoBruta >= totalQuestoes * 0.6) {
    return {
      nivel: "excelente",
      mensagem:
        pontuacaoBruta >= totalQuestoes * 0.75
          ? "🎯 Excelente! Aprovação confortável!"
          : "✅ Muito bom! Dentro da faixa de aprovação.",
      cor: "#10b981",
      icone: "trophy",
      score: scoreAproveitamento,
    };
  }

  if (pontuacaoBruta >= totalQuestoes * 0.3) {
    return {
      nivel: "bom",
      mensagem: "📊 Na média, mas precisa garantir mais acertos.",
      cor: "#3b82f6",
      icone: "chart-line-up",
      score: scoreAproveitamento,
    };
  }

  if (pontuacaoBruta >= 0) {
    return {
      nivel: "regular",
      mensagem: "⚠️ Abaixo da média. Muitos erros estão anulando acertos.",
      cor: "#f59e0b",
      icone: "warning",
      score: scoreAproveitamento,
    };
  }

  return {
    nivel: "critico",
    mensagem: "🚨 Crítico! Erros estão superando acertos.",
    cor: "#ef4444",
    icone: "warning-circle",
    score: scoreAproveitamento,
  };
}

/**
 * Identifica disciplinas com aproveitamento abaixo do limite.
 * FIX: não muta o array interno — usa [...].sort() para retornar nova cópia.
 */
export function identificarPontosFracos(
  estatisticas: EstatisticasSimulado,
  limitePercentual = 50,
): Disciplina[] {
  const fracas: Disciplina[] = [];

  for (const disc of ORDEM_DISCIPLINAS) {
    const stat = estatisticas.desempenhoPorDisciplina[disc];
    if (stat && stat.total > 0 && stat.percentual < limitePercentual) {
      fracas.push(disc);
    }
  }

  // FIX: sort em cópia nova — fracas foi recém-criado, mas por clareza
  // e consistência usamos [...fracas].sort()
  return [...fracas].sort((a, b) => {
    const pa = estatisticas.desempenhoPorDisciplina[a]?.percentual ?? 0;
    const pb = estatisticas.desempenhoPorDisciplina[b]?.percentual ?? 0;
    return pa - pb;
  });
}

/**
 * Calcula tendência comparando o simulado atual com a média do histórico.
 *
 * FIX: exclui o simulado atual do histórico antes de calcular a média,
 * para evitar que o próprio atual entre na comparação (viés de referência).
 * Recebe `historicoAnterior` — o histórico SEM o simulado atual.
 */
export function calcularTendencia(
  estatisticasAtual: EstatisticasSimulado,
  historicoAnterior: EstatisticasSimulado[],
): "subindo" | "estavel" | "caindo" {
  if (historicoAnterior.length < 2) return "estavel";

  const qtd = Math.min(historicoAnterior.length, 3);
  // Pega os mais recentes do histórico anterior
  const recentes = historicoAnterior.slice(-qtd);

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

/**
 * FIX: trata string vazia e retorna 0 em vez de lançar erro genérico.
 */
export function parseTempo(tempoStr: string): number {
  if (!tempoStr?.trim()) return 0;

  const parts = tempoStr.split(":").map((p) => parseInt(p.trim(), 10));

  if (parts.some((p) => isNaN(p))) {
    throw new Error(
      `Formato de tempo inválido: "${tempoStr}". Esperado HH:MM:SS ou MM:SS.`,
    );
  }

  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
}

// ═══════════════════════════════════════════════════════════
// UTILITÁRIOS DE SIMULADO
// ═══════════════════════════════════════════════════════════

/**
 * FIX: usa DISCIPLINAS_NOME para exibir nomes legíveis no resumo.
 * Antes exibia chaves brutas como "PORTUGUES" em vez de "Língua Portuguesa".
 */
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
    linhas.push(``, `⚠️ Disciplinas que precisam de atenção:`);
    for (const disc of pontosFracos.slice(0, 3)) {
      const stat = estatisticas.desempenhoPorDisciplina[disc];
      if (stat) {
        // FIX: exibe nome legível em vez da chave bruta
        const nome = DISCIPLINAS_NOME[disc] ?? disc;
        linhas.push(
          `  • ${nome}: ${stat.percentual.toFixed(0)}% (${stat.pontuacao} pts)`,
        );
      }
    }
  }

  return linhas.join("\n");
}

/**
 * Exporta estatísticas por disciplina em formato CSV.
 *
 * FIX: campos de texto são envolvidos em aspas para evitar corrupção
 * caso o nome da disciplina contenha vírgula (ex: dados externos).
 */
export function exportarCSV(estatisticas: EstatisticasSimulado): string {
  const escapar = (v: string | number): string => {
    const s = String(v);
    // Envolve em aspas se contém vírgula, aspas ou quebra de linha
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const headers = [
    "Disciplina",
    "Total",
    "Acertos",
    "Erros",
    "Brancos",
    "% Acerto",
    "Pontuação (Acertos - Erros)",
  ];

  const montarLinha = (disc: string) => {
    const stat = estatisticas.desempenhoPorDisciplina[disc as Disciplina];
    const nome = DISCIPLINAS_NOME[disc] ?? disc;
    if (!stat) {
      return [escapar(nome), 0, 0, 0, 0, "0,0", 0].join(",");
    }
    return [
      escapar(nome), // FIX: nome legível + escapado
      stat.total,
      stat.acertos,
      stat.erros,
      stat.brancos,
      stat.percentual.toFixed(1).replace(".", ","),
      stat.pontuacao,
    ].join(",");
  };

  const rows = ORDEM_DISCIPLINAS.map(montarLinha);

  // Disciplinas extras (fora da ordem padrão)
  const disciplinasExtras = Object.keys(
    estatisticas.desempenhoPorDisciplina,
  ).filter((d) => !ORDEM_DISCIPLINAS.includes(d as Disciplina));

  for (const disc of disciplinasExtras) {
    rows.push(montarLinha(disc));
  }

  return [headers.join(","), ...rows].join("\n");
}
