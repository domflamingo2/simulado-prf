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
// TIPOS
// ═══════════════════════════════════════════════════════════

export interface HistoricoEstatisticas {
  id: string;
  data: Date;
  estatisticas: EstatisticasSimulado;
  modo: ModoSimulado;
  seed?: number;
}

export interface RecomendacaoPosSimulado {
  acoesImediatas: string[];
  disciplinasPrioritarias: Disciplina[];
  tempoSugeridoEstudo: number;
  questoesRecomendadas: number;
  estrategia: "revisar" | "aprofundar" | "manter";
  proximoSimulado: {
    modo: ModoSimulado;
    justificativa: string;
  };
}

export interface MetricasSimulado {
  totalSimulados: number;
  simuladosCompletos: number;
  simuladosTurbo: number;
  tempoMedioSelecao: number;
  questoesSelecionadasMedia: number;
  coberturaDisciplinas: Record<Disciplina, number>;
  questoesUtilizadasPercentual: number;
  taxaAbandono: number;
  tempoMedioPorUsuario: number;
  questoesPorDisciplina: Record<Disciplina, number>;
}

export interface OpcoesFormatacao {
  sempreComHoras?: boolean;
  abreviado?: boolean;
  separador?: string;
}

export interface SelecionarQuestoesPorDisciplinaOptions {
  disciplinas: Disciplina[];
  quantidadePorDisciplina: number;
  seed?: number;
  evitarRepetidas?: Set<string>;
}

interface SelecionarQuestoesOptions {
  modo: ModoSimulado;
  seed?: number;
  garantirCobertura?: boolean;
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
// EMBARALHAMENTO
// ═══════════════════════════════════════════════════════════

function deriveSeed(baseSeed: number, modifier: number): number {
  const val = (Math.abs(baseSeed) * 31 + Math.abs(modifier)) % 2147483647;
  return val === 0 ? 1 : val;
}

export function embaralhar<T>(array: readonly T[], seed?: number): T[] {
  const copia = [...array];
  let m = copia.length;
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

// ═══════════════════════════════════════════════════════════
// CACHE DE QUESTÕES POR DISCIPLINA
// ═══════════════════════════════════════════════════════════

// FIX: o cache era global e nunca era invalidado quando `todasQuestoes`
// mudava entre chamadas (ex: banco atualizado em runtime). Agora o cache
// é vinculado à referência do array — se o array mudar, o cache é descartado.
let cachedQuestoesPorDisciplina: Map<Disciplina, Questao[]> | null = null;
let cachedQuestoesRef: readonly Questao[] | null = null;

function getQuestoesPorDisciplina(
  todasQuestoes: readonly Questao[],
): Map<Disciplina, Questao[]> {
  // FIX: invalida automaticamente se o array de questões for diferente
  if (cachedQuestoesPorDisciplina && cachedQuestoesRef === todasQuestoes) {
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
  cachedQuestoesRef = todasQuestoes;
  return mapa;
}

function clearQuestoesCache(): void {
  cachedQuestoesPorDisciplina = null;
  cachedQuestoesRef = null;
}

// ═══════════════════════════════════════════════════════════
// SELEÇÃO DE QUESTÕES
// ═══════════════════════════════════════════════════════════

export function selecionarQuestoesPorDisciplina(
  todasQuestoes: readonly Questao[],
  options: SelecionarQuestoesPorDisciplinaOptions,
): Questao[] {
  const { disciplinas, quantidadePorDisciplina, seed, evitarRepetidas } =
    options;

  // FIX: validação de entrada — evita loop silencioso com dados inválidos
  if (quantidadePorDisciplina <= 0) {
    throw new SimuladoError(
      "quantidadePorDisciplina deve ser positivo",
      "QUESTOES_INSUFICIENTES",
    );
  }

  const selecionadas: Questao[] = [];
  const idsSelecionados = new Set<string>();
  const baseSeed = seed ?? Date.now();

  for (let i = 0; i < disciplinas.length; i++) {
    const disc = disciplinas[i];
    let questoesDisc = todasQuestoes.filter((q) => q.disciplina === disc);

    if (evitarRepetidas) {
      questoesDisc = questoesDisc.filter((q) => !evitarRepetidas.has(q.id));
    }

    if (questoesDisc.length === 0) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[Simulado Parcial] Disciplina ${disc} não possui questões disponíveis`,
        );
      }
      continue;
    }

    const embaralhadas = embaralhar(questoesDisc, deriveSeed(baseSeed, i));
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
      estrutura.conhecimentosBasicos?.disciplinas ?? {},
    ) as Disciplina[]),
    ...(Object.keys(
      estrutura.conhecimentosEspecificos?.disciplinas ?? {},
    ) as Disciplina[]),
  ]);

  const questoesPorDisc = getQuestoesPorDisciplina(todasQuestoes);

  for (const disc of disciplinasEstrutura) {
    const count = (questoesPorDisc.get(disc) ?? []).length;
    if (count === 0) {
      erros.push(`Disciplina ${disc} não possui questões cadastradas`);
    } else if (count < 5) {
      avisos.push(
        `Disciplina ${disc} possui apenas ${count} questões (mínimo recomendado: 10)`,
      );
    }
  }

  return { valido: erros.length === 0, erros, avisos };
}

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
  for (const [disc, qtdOriginal] of Object.entries(disciplinas)) {
    // FIX: qtdOriginal pode ser 0 ou NaN se vier de uma estrutura mal formada
    const qtdBase =
      Number.isFinite(qtdOriginal) && qtdOriginal > 0 ? qtdOriginal : 0;
    const qtd = Math.max(1, Math.round(qtdBase * proporcao));

    const questoesDisponiveis = todasQuestoes.filter(
      (q) => q.disciplina === disc,
    );

    if (questoesDisponiveis.length === 0) {
      erros.push(`Disciplina ${disc} não possui questões cadastradas`);
      continue;
    }

    if (
      process.env.NODE_ENV === "development" &&
      questoesDisponiveis.length < qtd
    ) {
      console.warn(
        `[Simulado] ${disc}: banco pequeno (${questoesDisponiveis.length}/${qtd}). ` +
          `Adicione mais questões desta disciplina.`,
      );
    }

    const embaralhadas = embaralhar(
      questoesDisponiveis,
      deriveSeed(baseSeed, ++seedIncremental.value),
    );

    if (embaralhadas.length < qtd) {
      if (garantirCobertura) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[Simulado] ${disc}: solicitadas ${qtd}, disponíveis ${embaralhadas.length}. Usando todas.`,
          );
        }
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

  if (!ESTRUTURA_PROVA) {
    throw new SimuladoError(
      "Estrutura da prova não definida.",
      "ESTRUTURA_INVALIDA",
    );
  }

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

  if (selecionadas.length < qtdEsperada * 0.8) {
    throw new SimuladoError(
      `Simulado incompleto: ${selecionadas.length}/${qtdEsperada} questões selecionadas`,
      "QUESTOES_INSUFICIENTES",
    );
  }

  // FIX: deduplicação explícita antes do embaralhamento final.
  // processarArea pode inserir a mesma questão duas vezes se ela aparecer
  // em conhecimentosBasicos e conhecimentosEspecificos simultaneamente.
  const idsSelecionados = new Set<string>();
  const unicas = selecionadas.filter((q) => {
    if (idsSelecionados.has(q.id)) return false;
    idsSelecionados.add(q.id);
    return true;
  });

  return embaralhar(unicas, deriveSeed(baseSeed, 9999));
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
  const resp = questao.respostaUsuario;

  if (resp === undefined) {
    contadores.naoRespondidas++;
    stat.naoRespondidas++;
  } else if (resp === null) {
    contadores.brancos++;
    stat.brancos++;
  } else if (resp === questao.resposta) {
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
  for (const stat of Object.values(stats)) {
    if (stat.total > 0) {
      stat.percentual = (stat.acertos / stat.total) * 100;
      stat.pontuacao = stat.acertos - stat.erros;
    }
  }
}

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
  if (totalQuestoes <= 0) return 0;
  return ((pontuacao + totalQuestoes) / (2 * totalQuestoes)) * 100;
}

export function calcularEstatisticas(
  questoes: QuestaoRespondida[],
  tempoTotal: number,
  tempoLimite?: number,
): EstatisticasSimulado {
  // FIX: guard para lista vazia — evita divisão por zero em tempoMedioPorQuestao
  // e percentual sem questões
  if (questoes.length === 0) {
    return {
      totalQuestoes: 0,
      acertos: 0,
      erros: 0,
      brancos: 0,
      naoRespondidas: 0,
      pontuacao: 0,
      percentual: 0,
      tempoTotal: 0,
      tempoMedioPorQuestao: 0,
      desempenhoPorDisciplina: inicializarEstatisticasDisciplina(),
      taxaResposta: 0,
    };
  }

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
  // FIX: tempoTotal negativo é inválido — clamp em 0
  const tempoSanitizado = Math.max(0, tempoTotal);
  const tempoEfetivo =
    tempoLimite != null
      ? Math.min(tempoSanitizado, tempoLimite)
      : tempoSanitizado;

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
  if (totalQuestoes <= 0) {
    return {
      nivel: "regular",
      mensagem: "⚠️ Sem questões para avaliar.",
      cor: "#f59e0b",
      icone: "warning",
      score: 0,
    };
  }

  const score = calcularPercentualCEBRASPE(pontuacaoBruta, totalQuestoes);

  if (pontuacaoBruta >= totalQuestoes * 0.6) {
    return {
      nivel: "excelente",
      mensagem:
        pontuacaoBruta >= totalQuestoes * 0.75
          ? "🎯 Excelente! Aprovação confortável!"
          : "✅ Muito bom! Dentro da faixa de aprovação.",
      cor: "#10b981",
      icone: "trophy",
      score,
    };
  }

  if (pontuacaoBruta >= totalQuestoes * 0.3) {
    return {
      nivel: "bom",
      mensagem: "📊 Na média, mas precisa garantir mais acertos.",
      cor: "#3b82f6",
      icone: "chart-line-up",
      score,
    };
  }
  if (pontuacaoBruta >= 0) {
    return {
      nivel: "regular",
      mensagem: "⚠️ Abaixo da média. Muitos erros estão anulando acertos.",
      cor: "#f59e0b",
      icone: "warning",
      score,
    };
  }
  return {
    nivel: "critico",
    mensagem: "🚨 Crítico! Erros estão superando acertos.",
    cor: "#ef4444",
    icone: "warning-circle",
    score,
  };
}

export function identificarPontosFracos(
  estatisticas: EstatisticasSimulado,
  limitePercentual = 50,
): Disciplina[] {
  return ORDEM_DISCIPLINAS.filter((disc) => {
    const stat = estatisticas.desempenhoPorDisciplina[disc];
    return stat && stat.total > 0 && stat.percentual < limitePercentual;
  }).sort((a, b) => {
    const pa = estatisticas.desempenhoPorDisciplina[a]?.percentual ?? 0;
    const pb = estatisticas.desempenhoPorDisciplina[b]?.percentual ?? 0;
    return pa - pb;
  });
}

export function calcularTendencia(
  estatisticasAtual: EstatisticasSimulado,
  historicoAnterior: EstatisticasSimulado[],
): "subindo" | "estavel" | "caindo" {
  if (historicoAnterior.length < 2) return "estavel";

  const recentes = historicoAnterior.slice(
    -Math.min(historicoAnterior.length, 3),
  );
  const mediaRecente =
    recentes.reduce((a, h) => a + h.pontuacao, 0) / recentes.length;
  const desvioPadrao = Math.sqrt(
    recentes.reduce((a, h) => a + (h.pontuacao - mediaRecente) ** 2, 0) /
      recentes.length,
  );

  const diferenca = estatisticasAtual.pontuacao - mediaRecente;
  const limiar = Math.max(5, desvioPadrao * 0.5);

  if (diferenca > limiar) return "subindo";
  if (diferenca < -limiar) return "caindo";
  return "estavel";
}

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
      "⏱️ Treinar gerenciamento de tempo — muitas questões não respondidas",
    );
  }
  if (estatisticas.brancos > estatisticas.totalQuestoes * 0.2) {
    acoesImediatas.push(
      "📝 Evite deixar questões em branco — no CEBRASPE não penaliza",
    );
  }
  if (estatisticas.erros > estatisticas.acertos) {
    acoesImediatas.push("🎯 Revisar teoria antes de fazer mais simulados");
  }

  let estrategia: RecomendacaoPosSimulado["estrategia"] = "manter";
  let modoSugerido: ModoSimulado = "COMPLETO";
  let justificativa = "";

  if (tendencia === "caindo" || muitoFracas.length > 0) {
    estrategia = "revisar";
    modoSugerido = "TURBO";
    justificativa = "Simulado menor para focar nas disciplinas com dificuldade";
  } else if (estatisticas.percentual > 75 && fracas.length === 0) {
    estrategia = "aprofundar";
    modoSugerido = "COMPLETO";
    justificativa = "Manter o ritmo com simulado completo";
  } else {
    estrategia = "manter";
    modoSugerido = estatisticas.taxaResposta < 85 ? "TURBO" : "COMPLETO";
    justificativa =
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
    proximoSimulado: { modo: modoSugerido, justificativa },
  };
}

// ═══════════════════════════════════════════════════════════
// FORMATAÇÃO DE TEMPO
// ═══════════════════════════════════════════════════════════

export function formatarTempo(
  segundos: number,
  opcoes: OpcoesFormatacao = {},
): string {
  const { sempreComHoras = false, abreviado = false, separador = ":" } = opcoes;

  // FIX: NaN e Infinity produziam "NaN:NaN:NaN" — guard explícito
  if (!Number.isFinite(segundos)) return abreviado ? "0s" : "00:00";

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
  if (hrs > 0 || sempreComHoras) parts.push(hrs.toString().padStart(2, "0"));
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
  if (!tempoStr?.trim()) return 0;

  // FIX: a regex original `/^(\d{1,2}:)?(\d{1,2}:)?\d{1,2}$/` aceitava
  // strings como "99:99:99" (minutos e segundos > 59) sem validar os intervalos.
  // Também aceitava uma única parte isolada como "45", interpretada como
  // segundos — mas `parseTempo("45")` deveria retornar 45, não lançar erro.
  // Novo comportamento:
  //   "45"         → 45s  (aceito)
  //   "02:30"      → 150s (aceito)
  //   "01:02:30"   → 3750s (aceito)
  //   "99:99"      → SimuladoError (minutos/segundos fora de range)
  //   "abc"        → SimuladoError

  const partes = tempoStr.trim().split(":");

  if (partes.length > 3) {
    throw new SimuladoError(
      `Formato de tempo inválido: "${tempoStr}". Esperado HH:MM:SS, MM:SS ou SS.`,
      "FORMATO_TEMPO_INVALIDO",
    );
  }

  const nums = partes.map((p) => {
    const n = parseInt(p.trim(), 10);
    if (Number.isNaN(n) || n < 0) {
      throw new SimuladoError(
        `Formato de tempo inválido: "${tempoStr}" (parte inválida: "${p}").`,
        "FORMATO_TEMPO_INVALIDO",
      );
    }
    return n;
  });

  // Valida que minutos e segundos estão no range [0, 59]
  if (nums.length >= 2 && nums[nums.length - 1] > 59) {
    throw new SimuladoError(
      `Segundos inválidos em "${tempoStr}": ${nums[nums.length - 1]} > 59`,
      "FORMATO_TEMPO_INVALIDO",
    );
  }
  if (nums.length === 3 && nums[1] > 59) {
    throw new SimuladoError(
      `Minutos inválidos em "${tempoStr}": ${nums[1]} > 59`,
      "FORMATO_TEMPO_INVALIDO",
    );
  }

  if (nums.length === 3) return nums[0] * 3600 + nums[1] * 60 + nums[2];
  if (nums.length === 2) return nums[0] * 60 + nums[1];
  return nums[0];
}

// ═══════════════════════════════════════════════════════════
// UTILITÁRIOS
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
        linhas.push(
          `  • ${DISCIPLINAS_NOME[disc]}: ${stat.percentual.toFixed(0)}% (${stat.pontuacao} pts)`,
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

  const montarLinha = (disc: string): string => {
    const stat = estatisticas.desempenhoPorDisciplina[disc as Disciplina];
    const nome = DISCIPLINAS_NOME[disc as Disciplina] ?? disc;
    if (!stat) return [escapar(nome), 0, 0, 0, 0, 0, "0,0", 0].join(",");
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

  // FIX: disciplinas extras não presentes em ORDEM_DISCIPLINAS
  const extras = Object.keys(estatisticas.desempenhoPorDisciplina).filter(
    (d) => !ORDEM_DISCIPLINAS.includes(d as Disciplina),
  );
  for (const disc of extras) rows.push(montarLinha(disc));

  return [headers.join(","), ...rows].join("\n");
}

// ═══════════════════════════════════════════════════════════
// MÉTRICAS
// ═══════════════════════════════════════════════════════════

export function coletarMetricas(
  simuladosRealizados: HistoricoEstatisticas[],
  todasQuestoes: Questao[],
): MetricasSimulado {
  let simuladosCompletos = 0;
  let simuladosTurbo = 0;
  let simuladosFinalizados = 0;

  for (const s of simuladosRealizados) {
    if (s.estatisticas.totalQuestoes === CONSTANTES.QUESTOES_COMPLETO)
      simuladosCompletos++;
    if (s.modo === "TURBO") simuladosTurbo++;
    if (s.estatisticas.taxaResposta > 80) simuladosFinalizados++;
  }

  const questoesPorDisc = getQuestoesPorDisciplina(todasQuestoes);
  const coberturaDisciplinas = {} as Record<Disciplina, number>;

  for (const disc of ORDEM_DISCIPLINAS) {
    const totalDisc = (questoesPorDisc.get(disc) ?? []).length;
    // FIX: `flatMap(...).reduce(...)` somava arrays de números escalares —
    // `desempenhoPorDisciplina[disc]?.total` já é um número, não um array.
    // flatMap produzia um array com um número por simulado; reduce somava
    // corretamente por acaso, mas o tipo era confuso. Simplificado com reduce.
    const usadasDisc = simuladosRealizados.reduce(
      (acc, s) =>
        acc + (s.estatisticas.desempenhoPorDisciplina[disc]?.total ?? 0),
      0,
    );
    coberturaDisciplinas[disc] =
      totalDisc > 0 ? (usadasDisc / totalDisc) * 100 : 0;
  }

  const n = simuladosRealizados.length;

  return {
    totalSimulados: n,
    simuladosCompletos,
    simuladosTurbo,
    // tempoMedioSelecao não temos dado real — 0 é mais honesto que um mock
    tempoMedioSelecao: 0,
    questoesSelecionadasMedia:
      n > 0
        ? simuladosRealizados.reduce(
            (a, s) => a + s.estatisticas.totalQuestoes,
            0,
          ) / n
        : 0,
    coberturaDisciplinas,
    // FIX: questoesUsadas nunca era preenchido no original — era sempre 0%.
    // Mantemos 0 com comentário honesto até haver rastreamento real de IDs.
    questoesUtilizadasPercentual: 0, // requer rastreamento de IDs por simulado
    taxaAbandono: n > 0 ? ((n - simuladosFinalizados) / n) * 100 : 0,
    tempoMedioPorUsuario: 0, // requer dados do usuário
    questoesPorDisciplina: Object.fromEntries(
      ORDEM_DISCIPLINAS.map((disc) => [
        disc,
        (questoesPorDisc.get(disc) ?? []).length,
      ]),
    ) as Record<Disciplina, number>,
  };
}

// ═══════════════════════════════════════════════════════════
// EXPORTS AUXILIARES
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
