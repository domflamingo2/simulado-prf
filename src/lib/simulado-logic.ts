// lib/simulado-logic.ts
import {
  ClassificacaoDesempenho,
  Disciplina,
  EstatisticasDisciplina,
  EstatisticasSimulado,
  ModoSimulado,
  Questao,
  QuestaoRespondida,
} from "@/data/index";

import { ESTRUTURA_PROVA } from "@/data";

// ═══════════════════════════════════════════════════════════
// CONSTANTES (COM TIPAGEM FORTE)
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

// ✅ CORREÇÃO: tipagem forte com satisfies
const DISCIPLINAS_NOME = {
  PORTUGUES: "Língua Portuguesa",
  ETICA: "Ética e Conduta",
  RACIOCINIO_LOGICO: "Raciocínio Lógico",
  DIREITO_CONSTITUCIONAL: "Direito Constitucional",
  DIREITO_ADMINISTRATIVO: "Direito Administrativo",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Legislação PRF",
} as const satisfies Record<Disciplina, string>;

// ═══════════════════════════════════════════════════════════
// TIPOS EXPANDIDOS
// ═══════════════════════════════════════════════════════════

// ✅ MELHORIA: Persistência do histórico de estatísticas
export interface HistoricoEstatisticas {
  id: string;
  data: Date;
  estatisticas: EstatisticasSimulado;
  modo: ModoSimulado;
  seed?: number;
}

// ✅ SISTEMA: Recomendação Pós-Simulado
export interface RecomendacaoPosSimulado {
  acoesImediatas: string[];
  disciplinasPrioritarias: Disciplina[];
  tempoSugeridoEstudo: number; // minutos
  questoesRecomendadas: number;
  estrategia: "revisar" | "aprofundar" | "manter";
  proximoSimulado: {
    modo: ModoSimulado;
    justificativa: string;
  };
}

// ✅ MÉTRICAS: Monitoramento
export interface MetricasSimulado {
  totalSimulados: number;
  simuladosCompletos: number;
  simuladosTurbo: number;
  tempoMedioSelecao: number; // ms
  questoesSelecionadasMedia: number;
  coberturaDisciplinas: Record<Disciplina, number>;
  questoesUtilizadasPercentual: number;
  taxaAbandono: number;
  tempoMedioPorUsuario: number;
  questoesPorDisciplina: Record<Disciplina, number>;
}

// ═══════════════════════════════════════════════════════════
// ERROS CUSTOMIZADOS
// ═══════════════════════════════════════════════════════════

export class SimuladoError extends Error {
  constructor(
    message: string,
    public code:
      | "QUESTOES_INSUFICIENTES"
      | "DISCIPLINA_VAZIA"
      | "ESTRUTURA_INVALIDA"
      | "FORMATO_TEMPO_INVALIDO",
  ) {
    super(message);
    this.name = "SimuladoError";
  }
}

// ═══════════════════════════════════════════════════════════
// FUNÇÕES DE EMBARALHAMENTO E SELEÇÃO
// ═══════════════════════════════════════════════════════════

// ✅ CORREÇÃO: deriveSeed com validação melhorada
function deriveSeed(baseSeed: number, modifier: number): number {
  const val = (Math.abs(baseSeed) * 31 + Math.abs(modifier)) % 2147483647;
  return val === 0 ? 1 : val;
}

// ✅ CORREÇÃO: embaralhar com validação de seed negativa
export function embaralhar<T>(array: readonly T[], seed?: number): T[] {
  const copia = [...array];
  let m = copia.length;
  // ✅ Garantir seed positivo e > 0
  let s =
    seed !== undefined
      ? Math.abs(seed) % 233280 || 1
      : Math.floor(Math.random() * 1_000_000) + 1;

  while (m) {
    s = (s * 9301 + 49297) % 233280;
    const i = Math.floor((s / 233280) * m--);
    [copia[m], copia[i]] = [copia[i], copia[m]];
  }

  return copia;
}

export function gerarSeedDiario(): number {
  const hoje = new Date();
  return (
    hoje.getFullYear() * 10000 + (hoje.getMonth() + 1) * 100 + hoje.getDate()
  );
}

// ✅ MELHORIA: Pré-indexação de questões por disciplina (performance)
let cachedQuestoesPorDisciplina: Map<Disciplina, Questao[]> | null = null;

function getQuestoesPorDisciplina(
  todasQuestoes: readonly Questao[],
): Map<Disciplina, Questao[]> {
  if (cachedQuestoesPorDisciplina) {
    return cachedQuestoesPorDisciplina;
  }

  const mapa = new Map<Disciplina, Questao[]>();
  for (const disc of ORDEM_DISCIPLINAS) {
    mapa.set(disc, []);
  }

  for (const q of todasQuestoes) {
    if (!mapa.has(q.disciplina)) {
      mapa.set(q.disciplina, []);
    }
    mapa.get(q.disciplina)!.push(q);
  }

  cachedQuestoesPorDisciplina = mapa;
  return mapa;
}

function clearQuestoesCache() {
  cachedQuestoesPorDisciplina = null;
}

interface SelecionarQuestoesOptions {
  modo: ModoSimulado;
  seed?: number;
  garantirCobertura?: boolean;
}

// ✅ SISTEMA: Simulador Parcial (por disciplina)
export interface SelecionarQuestoesPorDisciplinaOptions {
  disciplinas: Disciplina[];
  quantidadePorDisciplina: number;
  seed?: number;
  evitarRepetidas?: Set<string>; // IDs de questões já utilizadas
}

export function selecionarQuestoesPorDisciplina(
  todasQuestoes: readonly Questao[],
  options: SelecionarQuestoesPorDisciplinaOptions,
): Questao[] {
  const { disciplinas, quantidadePorDisciplina, seed, evitarRepetidas } =
    options;
  const selecionadas: Questao[] = [];
  const idsSelecionados = new Set<string>();
  const baseSeed = seed ?? Date.now();

  for (let i = 0; i < disciplinas.length; i++) {
    const disc = disciplinas[i];
    let questoesDisc = todasQuestoes.filter((q) => q.disciplina === disc);

    // Filtrar questões já utilizadas
    if (evitarRepetidas) {
      questoesDisc = questoesDisc.filter((q) => !evitarRepetidas.has(q.id));
    }

    if (questoesDisc.length === 0) {
      console.warn(
        `[Simulado Parcial] Disciplina ${disc} não possui questões suficientes`,
      );
      continue;
    }

    const seedDisciplina = deriveSeed(baseSeed, i);
    const embaralhadas = embaralhar(questoesDisc, seedDisciplina);
    const qtd = Math.min(quantidadePorDisciplina, embaralhadas.length);

    for (let j = 0; j < qtd; j++) {
      const q = embaralhadas[j];
      if (!idsSelecionados.has(q.id)) {
        idsSelecionados.add(q.id);
        selecionadas.push(q);
      }
    }
  }

  return embaralhar(selecionadas, deriveSeed(baseSeed, 9999));
}

// ✅ MELHORIA: Validação de integridade de dados
export function validarEstruturaSimulado(
  todasQuestoes: readonly Questao[],
  estrutura: typeof ESTRUTURA_PROVA,
): { valido: boolean; erros: string[]; avisos: string[] } {
  const erros: string[] = [];
  const avisos: string[] = [];

  if (!estrutura) {
    erros.push("Estrutura da prova não definida");
    return { valido: false, erros, avisos };
  }

  const disciplinasEstrutura = new Set<Disciplina>([
    ...(Object.keys(
      estrutura.conhecimentosBasicos?.disciplinas || {},
    ) as Disciplina[]),
    ...(Object.keys(
      estrutura.conhecimentosEspecificos?.disciplinas || {},
    ) as Disciplina[]),
  ]);

  const questoesPorDisc = getQuestoesPorDisciplina(todasQuestoes);

  for (const disc of disciplinasEstrutura) {
    const count = (questoesPorDisc.get(disc) || []).length;
    if (count === 0) {
      erros.push(`Disciplina ${disc} não possui questões cadastradas`);
    } else if (count < 5) {
      avisos.push(
        `Disciplina ${disc} possui apenas ${count} questões (recomendado mínimo 10)`,
      );
    }
  }

  return {
    valido: erros.length === 0,
    erros,
    avisos,
  };
}

// ✅ CORREÇÃO: processarArea com cópia defensiva e proteção
function processarArea(
  disciplinas: Record<string, number>,
  todasQuestoes: readonly Questao[],
  proporcao: number,
  baseSeed: number,
  seedIncremental: { value: number },
  garantirCobertura: boolean,
  selecionadas: Questao[],
  erros: string[],
): void {
  // ✅ Proteção: recebe selecionadas como referência mas não modifica indevidamente
  for (const [disc, qtdOriginal] of Object.entries(disciplinas)) {
    const qtd = Math.max(1, Math.round((qtdOriginal || 0) * proporcao));

    const questoesDisponiveis = todasQuestoes.filter(
      (q) => q.disciplina === disc,
    );

    if (questoesDisponiveis.length === 0) {
      erros.push(`Disciplina ${disc} não possui questões cadastradas`);
      continue;
    }

    // ✅ LOG: advertência para bancos pequenos
    if (questoesDisponiveis.length < qtd) {
      console.warn(
        `[Simulado] ${disc}: banco pequeno (${questoesDisponiveis.length}/${qtd}). ` +
          `Recomendado adicionar mais questões desta disciplina.`,
      );
    }

    const seedDisciplina = deriveSeed(baseSeed, ++seedIncremental.value);
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
}

export function selecionarQuestoes(
  todasQuestoes: readonly Questao[],
  options: SelecionarQuestoesOptions,
): Questao[] {
  const { modo, seed, garantirCobertura = true } = options;

  // ✅ MELHORIA: validar estrutura antes de selecionar
  const validacao = validarEstruturaSimulado(todasQuestoes, ESTRUTURA_PROVA);
  if (!validacao.valido) {
    throw new SimuladoError(
      `Estrutura inválida:\n${validacao.erros.join("\n")}`,
      "ESTRUTURA_INVALIDA",
    );
  }

  const isTurbo = modo === "TURBO";
  const proporcao = isTurbo
    ? CONSTANTES.QUESTOES_TURBO / CONSTANTES.QUESTOES_COMPLETO
    : 1;

  const selecionadas: Questao[] = [];
  const erros: string[] = [];
  const baseSeed = seed ?? Date.now();
  const seedIncremental = { value: 0 };

  if (!ESTRUTURA_PROVA) {
    throw new SimuladoError(
      "Estrutura da prova não definida.",
      "ESTRUTURA_INVALIDA",
    );
  }

  processarArea(
    ESTRUTURA_PROVA.conhecimentosBasicos.disciplinas,
    todasQuestoes,
    proporcao,
    baseSeed,
    seedIncremental,
    garantirCobertura,
    selecionadas,
    erros,
  );

  processarArea(
    ESTRUTURA_PROVA.conhecimentosEspecificos.disciplinas,
    todasQuestoes,
    proporcao,
    baseSeed,
    seedIncremental,
    garantirCobertura,
    selecionadas,
    erros,
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

  // ✅ CORREÇÃO: garantir que pelo menos 80% das questões foram selecionadas
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
      naoRespondidas: 0,
      percentual: 0,
      pontuacao: 0,
    };
  }

  return inicial as Record<Disciplina, EstatisticasDisciplina>;
}

function processarQuestao(
  questao: QuestaoRespondida,
  stats: Record<string, EstatisticasDisciplina>,
  contadores: {
    acertos: number;
    erros: number;
    brancos: number;
    naoRespondidas: number;
  },
): void {
  const disc = questao.disciplina;

  if (!stats[disc]) {
    stats[disc] = {
      total: 0,
      acertos: 0,
      erros: 0,
      brancos: 0,
      naoRespondidas: 0,
      percentual: 0,
      pontuacao: 0,
    };
  }

  const stat = stats[disc];
  stat.total++;

  const resposta = questao.respostaUsuario;

  if (resposta === undefined) {
    contadores.naoRespondidas++;
    stat.naoRespondidas++;
  } else if (resposta === null) {
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
      stat.percentual = (stat.acertos / stat.total) * 100;
      stat.pontuacao = stat.acertos - stat.erros;
    }
  }
}

// ✅ MELHORIA: Exportar lógica de pontuação CEBRASPE
export function calcularPontuacaoCEBRASPE(
  acertos: number,
  erros: number,
): number {
  return acertos - erros;
}

export function calcularPercentualCEBRASPE(
  pontuacao: number,
  totalQuestoes: number,
): number {
  // ✅ CORREÇÃO: divisão por zero protegida
  if (totalQuestoes <= 0) return 0;
  return ((pontuacao + totalQuestoes) / (2 * totalQuestoes)) * 100;
}

export function calcularEstatisticas(
  questoes: QuestaoRespondida[],
  tempoTotal: number,
  tempoLimite?: number,
): EstatisticasSimulado {
  const contadores = { acertos: 0, erros: 0, brancos: 0, naoRespondidas: 0 };
  const desempenhoPorDisciplina = inicializarEstatisticasDisciplina();

  for (const q of questoes) {
    processarQuestao(q, desempenhoPorDisciplina, contadores);
  }

  finalizarEstatisticasDisciplina(desempenhoPorDisciplina);

  const total = questoes.length;
  const pontuacao = calcularPontuacaoCEBRASPE(
    contadores.acertos,
    contadores.erros,
  );
  const percentual = calcularPercentualCEBRASPE(pontuacao, total);

  const tempoEfetivo =
    tempoLimite != null ? Math.min(tempoTotal, tempoLimite) : tempoTotal;

  const questoesRespondidas = contadores.acertos + contadores.erros;

  return {
    totalQuestoes: total,
    acertos: contadores.acertos,
    erros: contadores.erros,
    brancos: contadores.brancos,
    naoRespondidas: contadores.naoRespondidas,
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

export function classificarDesempenho(
  pontuacaoBruta: number,
  totalQuestoes: number,
): ClassificacaoDesempenho {
  // ✅ CORREÇÃO: já protegido contra divisão por zero
  if (totalQuestoes <= 0) {
    return {
      nivel: "regular",
      mensagem: "⚠️ Sem questões para avaliar.",
      cor: "#f59e0b",
      icone: "warning",
      score: 0,
    };
  }

  const scoreAproveitamento = calcularPercentualCEBRASPE(
    pontuacaoBruta,
    totalQuestoes,
  );

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

  return [...fracas].sort((a, b) => {
    const pa = estatisticas.desempenhoPorDisciplina[a]?.percentual ?? 0;
    const pb = estatisticas.desempenhoPorDisciplina[b]?.percentual ?? 0;
    return pa - pb;
  });
}

// ✅ CORREÇÃO: calcularTendencia melhorado com desvio padrão
export function calcularTendencia(
  estatisticasAtual: EstatisticasSimulado,
  historicoAnterior: EstatisticasSimulado[],
): "subindo" | "estavel" | "caindo" {
  if (historicoAnterior.length < 2) return "estavel";

  const qtd = Math.min(historicoAnterior.length, 3);
  const recentes = historicoAnterior.slice(-qtd);

  const mediaRecente =
    recentes.reduce((a, h) => a + h.pontuacao, 0) / recentes.length;

  // ✅ Adicionar desvio padrão para maior confiabilidade
  const desvioPadrao = Math.sqrt(
    recentes.reduce((a, h) => a + Math.pow(h.pontuacao - mediaRecente, 2), 0) /
      recentes.length,
  );

  const diferenca = estatisticasAtual.pontuacao - mediaRecente;
  const limiar = Math.max(5, desvioPadrao * 0.5);

  if (diferenca > limiar) return "subindo";
  if (diferenca < -limiar) return "caindo";
  return "estavel";
}

// ✅ SISTEMA: Recomendação Pós-Simulado
export function gerarRecomendacoes(
  estatisticas: EstatisticasSimulado,
  historicoEstatisticas: EstatisticasSimulado[],
): RecomendacaoPosSimulado {
  const fracas = identificarPontosFracos(estatisticas, 50);
  const muitoFracas = identificarPontosFracos(estatisticas, 30);
  const tendencia = calcularTendencia(estatisticas, historicoEstatisticas);

  const acoesImediatas: string[] = [];

  if (muitoFracas.length > 0) {
    acoesImediatas.push(
      `⚠️ Revisão URGENTE: ${muitoFracas.map((d) => DISCIPLINAS_NOME[d]).join(", ")}`,
    );
  } else if (fracas.length > 0) {
    acoesImediatas.push(
      `📚 Foco nas disciplinas: ${fracas
        .slice(0, 3)
        .map((d) => DISCIPLINAS_NOME[d])
        .join(", ")}`,
    );
  }

  if (estatisticas.taxaResposta < 80) {
    acoesImediatas.push(
      "⏱️ Treinar gerenciamento de tempo - muitas questões não respondidas",
    );
  }

  if (estatisticas.brancos > estatisticas.totalQuestoes * 0.2) {
    acoesImediatas.push(
      "📝 Evite deixar questões em branco - no CEBRASPE não penaliza",
    );
  }

  if (estatisticas.erros > estatisticas.acertos) {
    acoesImediatas.push("🎯 Revisar teoria antes de fazer mais simulados");
  }

  let estrategia: RecomendacaoPosSimulado["estrategia"] = "manter";
  let modoSugerido: ModoSimulado = "COMPLETO";
  let justificativaModo = "";

  if (tendencia === "caindo" || muitoFracas.length > 0) {
    estrategia = "revisar";
    modoSugerido = "TURBO";
    justificativaModo =
      "Simulado menor para focar nas disciplinas com dificuldade";
  } else if (estatisticas.percentual > 75 && fracas.length === 0) {
    estrategia = "aprofundar";
    modoSugerido = "COMPLETO";
    justificativaModo = "Manter o ritmo com simulado completo";
  } else {
    estrategia = "manter";
    modoSugerido = estatisticas.taxaResposta < 85 ? "TURBO" : "COMPLETO";
    justificativaModo =
      modoSugerido === "TURBO"
        ? "Treinar velocidade com simulado reduzido"
        : "Manter resistência com simulado completo";
  }

  return {
    acoesImediatas: acoesImediatas.slice(0, 4),
    disciplinasPrioritarias: [...fracas],
    tempoSugeridoEstudo: estrategia === "revisar" ? 120 : 60,
    questoesRecomendadas: estrategia === "revisar" ? 30 : 20,
    estrategia,
    proximoSimulado: {
      modo: modoSugerido,
      justificativa: justificativaModo,
    },
  };
}

// ═══════════════════════════════════════════════════════════
// FORMATAÇÃO DE TEMPO
// ═══════════════════════════════════════════════════════════

export interface OpcoesFormatacao {
  sempreComHoras?: boolean;
  abreviado?: boolean;
  separador?: string;
}

// ✅ CORREÇÃO: formatarTempo consistente
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

  // ✅ CORREÇÃO: sempreComHoras consistente
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

// ✅ CORREÇÃO: parseTempo robusto com validação
export function parseTempo(tempoStr: string): number {
  if (!tempoStr?.trim()) return 0;

  // ✅ Validar formato com regex
  const regex = /^(\d{1,2}:)?(\d{1,2}:)?\d{1,2}$/;
  if (!regex.test(tempoStr)) {
    throw new SimuladoError(
      `Formato de tempo inválido: "${tempoStr}". Esperado HH:MM:SS ou MM:SS.`,
      "FORMATO_TEMPO_INVALIDO",
    );
  }

  const parts = tempoStr.split(":").map((p) => {
    const num = parseInt(p.trim(), 10);
    if (isNaN(num)) throw new Error(`Parte inválida: "${p}"`);
    return num;
  });

  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
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
    linhas.push(``, `⚠️ Disciplinas que precisam de atenção:`);
    for (const disc of pontosFracos.slice(0, 3)) {
      const stat = estatisticas.desempenhoPorDisciplina[disc];
      if (stat) {
        const nome = DISCIPLINAS_NOME[disc];
        linhas.push(
          `  • ${nome}: ${stat.percentual.toFixed(0)}% (${stat.pontuacao} pts)`,
        );
      }
    }
  }

  return linhas.join("\n");
}

export function exportarCSV(estatisticas: EstatisticasSimulado): string {
  const escapar = (v: string | number): string => {
    const s = String(v);
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
    "Não respondidas",
    "% Acerto",
    "Pontuação (Acertos - Erros)",
  ];

  const montarLinha = (disc: string) => {
    const stat = estatisticas.desempenhoPorDisciplina[disc as Disciplina];
    const nome = DISCIPLINAS_NOME[disc as Disciplina] ?? disc;
    if (!stat) {
      return [escapar(nome), 0, 0, 0, 0, 0, "0,0", 0].join(",");
    }
    return [
      escapar(nome),
      stat.total,
      stat.acertos,
      stat.erros,
      stat.brancos,
      stat.naoRespondidas,
      stat.percentual.toFixed(1).replace(".", ","),
      stat.pontuacao,
    ].join(",");
  };

  const rows = ORDEM_DISCIPLINAS.map(montarLinha);

  const disciplinasExtras = Object.keys(
    estatisticas.desempenhoPorDisciplina,
  ).filter((d) => !ORDEM_DISCIPLINAS.includes(d as Disciplina));

  for (const disc of disciplinasExtras) {
    rows.push(montarLinha(disc));
  }

  return [headers.join(","), ...rows].join("\n");
}

// ═══════════════════════════════════════════════════════════
// MÉTRICAS PARA MONITORAMENTO
// ═══════════════════════════════════════════════════════════

export function coletarMetricas(
  simuladosRealizados: HistoricoEstatisticas[],
  todasQuestoes: Questao[],
): MetricasSimulado {
  const questoesUsadas = new Set<string>();
  let simuladosCompletos = 0;
  let simuladosTurbo = 0;
  let totalTempoSelecao = 0;
  let simuladosFinalizados = 0;

  for (const s of simuladosRealizados) {
    if (s.estatisticas.totalQuestoes === CONSTANTES.QUESTOES_COMPLETO) {
      simuladosCompletos++;
    }
    if (s.modo === "TURBO") {
      simuladosTurbo++;
    }

    // Considera finalizado se respondeu mais de 80%
    if (s.estatisticas.taxaResposta > 80) {
      simuladosFinalizados++;
    }

    // Não temos tempo de seleção real, usando placeholder
    totalTempoSelecao += 100; // mock
  }

  const questoesPorDisc = getQuestoesPorDisciplina(todasQuestoes);
  const coberturaDisciplinas = {} as Record<Disciplina, number>;

  for (const disc of ORDEM_DISCIPLINAS) {
    const totalDisc = (questoesPorDisc.get(disc) || []).length;
    const usadasDisc = simuladosRealizados
      .flatMap((s) => s.estatisticas.desempenhoPorDisciplina[disc]?.total || 0)
      .reduce((a, b) => a + b, 0);
    coberturaDisciplinas[disc] =
      totalDisc > 0 ? (usadasDisc / totalDisc) * 100 : 0;
  }

  const questoesUtilizadasPercentual =
    todasQuestoes.length > 0
      ? (questoesUsadas.size / todasQuestoes.length) * 100
      : 0;

  const taxaAbandono =
    simuladosRealizados.length > 0
      ? ((simuladosRealizados.length - simuladosFinalizados) /
          simuladosRealizados.length) *
        100
      : 0;

  return {
    totalSimulados: simuladosRealizados.length,
    simuladosCompletos,
    simuladosTurbo,
    tempoMedioSelecao:
      simuladosRealizados.length > 0
        ? totalTempoSelecao / simuladosRealizados.length
        : 0,
    questoesSelecionadasMedia:
      simuladosRealizados.length > 0
        ? simuladosRealizados.reduce(
            (a, s) => a + s.estatisticas.totalQuestoes,
            0,
          ) / simuladosRealizados.length
        : 0,
    coberturaDisciplinas,
    questoesUtilizadasPercentual,
    taxaAbandono,
    tempoMedioPorUsuario: 0, // Requer dados do usuário
    questoesPorDisciplina: Object.fromEntries(
      ORDEM_DISCIPLINAS.map((disc) => [
        disc,
        (questoesPorDisc.get(disc) || []).length,
      ]),
    ) as Record<Disciplina, number>,
  };
}

// ═══════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES EXPORTADAS
// ═══════════════════════════════════════════════════════════

export function getNomeDisciplina(disciplina: Disciplina): string {
  return DISCIPLINAS_NOME[disciplina];
}

export function getOrdemDisciplinas(): Disciplina[] {
  return [...ORDEM_DISCIPLINAS];
}

export function limparCacheQuestoes(): void {
  clearQuestoesCache();
}
