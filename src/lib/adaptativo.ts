// lib/adaptativo.ts
import {
  Disciplina,
  HistoricoSimulado,
  Questao,
  QuestaoRespondida,
} from "@/data/index";
import { embaralhar } from "./simulado-logic";

// ═══════════════════════════════════════════════════════════
// CONSTANTES CONFIGURÁVEIS
// ═══════════════════════════════════════════════════════════

const CONFIG = {
  PESO_NEUTRO: 1.0,
  PESO_INCERTEZA: 0.4,
  PESO_ERRO: 2.5,

  MIN_QUESTOES_PARA_CONFIANCA: 4,
  MAX_TAXA_ERRO_PARA_DOMINIO: 0.15,
  MIN_TAXA_ERRO_PARA_FOCO: 0.45,

  PROPORCAO_NOVAS: 0.7,
  PROPORCAO_REVISAO: 0.3,
  MIN_QUESTOES_POR_DISCIPLINA: 2,

  MEIA_VIDA_DIAS: 30,
  PESO_MINIMO_DECAIMENTO: 0.05,

  CACHE_TTL_MS: 5 * 60 * 1000,
} as const;

// ═══════════════════════════════════════════════════════════
// NOMES LEGÍVEIS DAS DISCIPLINAS
// ═══════════════════════════════════════════════════════════

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

// Dificuldade percebida base por disciplina — usada quando não há histórico
const DIFICULDADE_BASE: Record<Disciplina, number> = {
  PORTUGUES: 1.0,
  ETICA: 0.9,
  RACIOCINIO_LOGICO: 1.2,
  DIREITO_CONSTITUCIONAL: 1.1,
  DIREITO_ADMINISTRATIVO: 1.1,
  ADMINISTRACAO: 1.0,
  ARQUIVOLOGIA: 1.3,
  INFORMATICA: 0.8,
  LEGISLACAO_PRF: 1.2,
};

function nomeDisciplina(disc: Disciplina): string {
  return DISCIPLINAS_NOME[disc];
}

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

export interface PesoDisciplina {
  disciplina: Disciplina;
  peso: number;
  pesoNormalizado: number;
  taxaErro: number;
  taxaAcerto: number;
  questoesRespondidas: number;
  tendencia: "melhorando" | "piorando" | "estavel" | "insuficiente";
  confianca: number;
  ultimaRevisao?: Date;
}

export interface FeedbackUsuarioQuestao {
  questaoId: string;
  dificuldadePercebida: 1 | 2 | 3 | 4 | 5;
  tempoGastoSegundos?: number;
  marcadaParaRevisao?: boolean;
  comentario?: string;
}

export interface RevisaoAgendada {
  questaoId: string;
  disciplina: Disciplina;
  proximaRevisao: Date;
  ultimaRevisao: Date;
  intervalo: number;
  nivelDificuldade: 1 | 2 | 3;
  acertosConsecutivos: number;
}

export interface MetricasAdaptativas {
  evolucaoTaxaAcerto: {
    data: string;
    global: number;
    porDisciplina: Record<Disciplina, number>;
  }[];
  tempoEstimadoParaDominio: Record<Disciplina, number | null>;
  recomendacaoProximoSimulado: {
    disciplinas: Disciplina[];
    justificativa: string;
  };
  estatisticasPorDisciplina: Record<
    Disciplina,
    {
      tendencia: string;
      confianca: number;
      questoesVistas: number;
      taxaAcerto: number;
      necessidadeRevisao: "alta" | "media" | "baixa";
    }
  >;
}

export interface DiagnosticoAdaptativo {
  viabilidade: {
    bancoSuficiente: boolean;
    historicoConfiável: boolean;
  };
  estatisticas: {
    questoesPorDisciplina: Record<Disciplina, number>;
    simuladosAnalisados: number;
    dataMaisAntiga: string | null;
    dataMaisRecente: string | null;
  };
  avisos: string[];
}

export interface SelecaoAdaptativaResult {
  questoes: Questao[];
  metadados: {
    distribuicaoPorDisciplina: Record<string, number>;
    percentualNovas: number;
    percentualRevisao: number;
    disciplinasPriorizadas: Disciplina[];
    nivelAdaptacao: number;
  };
  revisoesAgendadas?: RevisaoAgendada[];
}

export interface AnaliseAdaptativa {
  resumo: string;
  disciplinasCriticas: PesoDisciplina[];
  disciplinasDominadas: PesoDisciplina[];
  disciplinasEmAlta: PesoDisciplina[];
  disciplinasEmBaixa: PesoDisciplina[];
  recomendacoes: string[];
  distribuicaoSugerida: PesoDisciplina[];
  nivelConfiancaGlobal: number;
  proximoMilestone: {
    disciplina: Disciplina;
    meta: number;
    atual: number;
  } | null;
}

// ═══════════════════════════════════════════════════════════
// CACHE
// ═══════════════════════════════════════════════════════════

interface CachePesos {
  timestamp: number; // FIX: number (Date.now()) em vez de Date — evita comparação .getTime() desnecessária
  pesos: PesoDisciplina[];
  historicoHash: string;
}

let cachePesos: CachePesos | null = null;

function calcularHashHistorico(historico: HistoricoSimulado[]): string {
  // FIX: inclui a soma de questões no hash para detectar mudanças
  // dentro de um mesmo número de simulados (ex: simulado editado).
  const ultimaData = historico[historico.length - 1]?.data ?? "";
  const totalQst = historico.reduce((acc, h) => acc + h.questoes.length, 0);
  return `${historico.length}:${ultimaData}:${totalQst}`;
}

function getCachedPesos(
  historico: HistoricoSimulado[],
): PesoDisciplina[] | null {
  if (!cachePesos) return null;
  const hash = calcularHashHistorico(historico);
  const idade = Date.now() - cachePesos.timestamp;
  if (cachePesos.historicoHash === hash && idade < CONFIG.CACHE_TTL_MS) {
    return cachePesos.pesos;
  }
  return null;
}

function setCachedPesos(
  historico: HistoricoSimulado[],
  pesos: PesoDisciplina[],
): void {
  cachePesos = {
    timestamp: Date.now(),
    pesos,
    historicoHash: calcularHashHistorico(historico),
  };
}

// ─── Invalida o cache manualmente (útil após salvar novo simulado) ────────────
export function invalidarCachePesos(): void {
  cachePesos = null;
}

// ═══════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES
// ═══════════════════════════════════════════════════════════

function calcularDecaimentoTemporal(dataSimuladoISO: string): number {
  // FIX: datas inválidas retornam o peso mínimo em vez de NaN
  const ts = Date.parse(dataSimuladoISO);
  if (Number.isNaN(ts)) return CONFIG.PESO_MINIMO_DECAIMENTO;
  const dias = Math.max(0, (Date.now() - ts) / (1000 * 60 * 60 * 24));
  return Math.max(
    CONFIG.PESO_MINIMO_DECAIMENTO,
    Math.exp(-dias / CONFIG.MEIA_VIDA_DIAS),
  );
}

function calcularTendencia(
  questoes: QuestaoRespondida[],
): PesoDisciplina["tendencia"] {
  if (questoes.length < 4) return "insuficiente";
  const meio = Math.floor(questoes.length / 2);
  const primeira = questoes.slice(0, meio);
  const segunda = questoes.slice(meio);
  const taxaPrimeira =
    primeira.filter((q) => q.respostaUsuario === q.resposta).length /
    primeira.length;
  const taxaSegunda =
    segunda.filter((q) => q.respostaUsuario === q.resposta).length /
    segunda.length;
  const delta = taxaSegunda - taxaPrimeira;
  if (delta > 0.15) return "melhorando";
  if (delta < -0.15) return "piorando";
  return "estavel";
}

function calcularConfianca(n: number): number {
  return Math.min(n / CONFIG.MIN_QUESTOES_PARA_CONFIANCA, 1);
}

// ─── Distribuição com ajuste de resto ────────────────────────────────────────

export function ajustarQuantidadesPorResto(
  quantidades: number[],
  pesos: number[],
  totalAlvo: number,
  minPorDisciplina: number,
): number[] {
  const result = [...quantidades];
  const totalCalc = result.reduce((a, b) => a + b, 0);
  let diferenca = totalAlvo - totalCalc;
  if (diferenca === 0) return result;

  // FIX: `totalAlvo / pesos.length` pode ser 0 se pesos for vazio — guard
  const basePorItem = pesos.length > 0 ? totalAlvo / pesos.length : 0;

  const restos = pesos.map((p, i) => ({
    index: i,
    resto: basePorItem > 0 ? p * basePorItem - Math.floor(p * basePorItem) : 0,
    quantidade: result[i],
  }));

  if (diferenca > 0) {
    restos
      .sort((a, b) => b.resto - a.resto)
      .slice(0, diferenca)
      .forEach(({ index }) => result[index]++);
  } else {
    const abs = Math.abs(diferenca);
    const candidatos = restos.filter((r) => r.quantidade > minPorDisciplina);

    if (candidatos.length >= abs) {
      candidatos
        .sort((a, b) => a.resto - b.resto)
        .slice(0, abs)
        .forEach(({ index }) => result[index]--);
    } else {
      // Fallback: reduz os menores restos, nunca abaixo de 0
      restos
        .sort((a, b) => a.resto - b.resto)
        .slice(0, abs)
        .forEach(({ index }) => {
          if (result[index] > 0) result[index]--;
        });
    }
  }

  return result;
}

// ═══════════════════════════════════════════════════════════
// REVISÃO ESPAÇADA
// ═══════════════════════════════════════════════════════════

export function atualizarIntervaloRevisao(
  acertou: boolean,
  intervaloAtual: number,
  dificuldade: 1 | 2 | 3,
): number {
  // FIX: intervaloAtual deve ser ≥ 1 — guard contra valores inválidos
  const intervaloSeguro = Math.max(
    1,
    Number.isFinite(intervaloAtual) ? intervaloAtual : 1,
  );
  const fator = dificuldade === 3 ? 0.5 : dificuldade === 2 ? 0.8 : 1.2;

  if (acertou) {
    return Math.min(Math.floor(intervaloSeguro * 1.5 * fator), 180);
  }
  return Math.max(Math.floor(intervaloSeguro / 2), 1);
}

export function gerarRevisoesAgendadas(
  historico: HistoricoSimulado[],
  questoesErradas: Set<string>,
  feedbacks: Map<string, FeedbackUsuarioQuestao>,
): RevisaoAgendada[] {
  const revisoes: RevisaoAgendada[] = [];
  const hoje = new Date();
  // FIX: deduplicação — cada questão deve aparecer no máximo uma vez,
  // usando o simulado mais recente onde ela foi respondida.
  const vistas = new Map<string, RevisaoAgendada>();

  // Percorre do mais antigo para o mais recente; o último sobrescreve
  for (const simulado of historico) {
    for (const questao of simulado.questoes) {
      const feedback = feedbacks.get(questao.id);
      const dificuldade: 1 | 2 | 3 = feedback?.dificuldadePercebida
        ? feedback.dificuldadePercebida <= 2
          ? 1
          : feedback.dificuldadePercebida <= 4
            ? 2
            : 3
        : 2;

      const precisaRevisar =
        questoesErradas.has(questao.id) ||
        feedback?.marcadaParaRevisao === true ||
        (feedback?.dificuldadePercebida ?? 0) >= 4;

      if (!precisaRevisar) continue;

      const intervaloBase = questoesErradas.has(questao.id) ? 3 : 7;
      const proximaRevisao = new Date(hoje);
      proximaRevisao.setDate(hoje.getDate() + intervaloBase);

      // FIX: data inválida no histórico → usa hoje como ultimaRevisao
      const ultimaRevisaoTs = Date.parse(simulado.data);
      const ultimaRevisao = Number.isNaN(ultimaRevisaoTs)
        ? new Date()
        : new Date(ultimaRevisaoTs);

      vistas.set(questao.id, {
        questaoId: questao.id,
        disciplina: questao.disciplina,
        proximaRevisao,
        ultimaRevisao,
        intervalo: intervaloBase,
        nivelDificuldade: dificuldade,
        acertosConsecutivos: 0,
      });
    }
  }

  revisoes.push(...vistas.values());
  return revisoes;
}

// ═══════════════════════════════════════════════════════════
// MÉTRICAS PARA DASHBOARD
// ═══════════════════════════════════════════════════════════

export function gerarMetricasDashboard(
  historico: HistoricoSimulado[],
  pesos: PesoDisciplina[],
): MetricasAdaptativas {
  const ultimosSimulados = historico.slice(-10);

  const evolucaoTaxaAcerto = ultimosSimulados.map((simulado) => {
    const qs = simulado.questoes;
    // FIX: guard contra simulado sem questões — evita divisão por zero
    const global =
      qs.length > 0
        ? qs.filter((q) => q.respostaUsuario === q.resposta).length / qs.length
        : 0;

    const porDisciplina = {} as Record<Disciplina, number>;
    for (const disc of ORDEM_DISCIPLINAS) {
      const qd = qs.filter((q) => q.disciplina === disc);
      porDisciplina[disc] =
        qd.length > 0
          ? qd.filter((q) => q.respostaUsuario === q.resposta).length /
            qd.length
          : 0;
    }

    return { data: simulado.data, global, porDisciplina };
  });

  const tempoEstimadoParaDominio = {} as Record<Disciplina, number | null>;
  for (const p of pesos) {
    if (p.taxaAcerto >= 0.85) {
      tempoEstimadoParaDominio[p.disciplina] = 0;
    } else if (p.confianca < 0.3) {
      tempoEstimadoParaDominio[p.disciplina] = null;
    } else {
      const deficit = 0.85 - p.taxaAcerto;
      const melhoriasPorSimulado = p.tendencia === "melhorando" ? 0.05 : 0.02;
      // FIX: melhoriasPorSimulado nunca é 0 (constante), mas guard defensivo
      const simuladosNecessarios =
        melhoriasPorSimulado > 0
          ? Math.ceil(deficit / melhoriasPorSimulado)
          : null;
      tempoEstimadoParaDominio[p.disciplina] =
        simuladosNecessarios !== null ? simuladosNecessarios * 7 : null;
    }
  }

  const disciplinasPrioritarias = pesos
    .filter((p) => p.pesoNormalizado > 1.2)
    .sort((a, b) => b.pesoNormalizado - a.pesoNormalizado)
    .slice(0, 3)
    .map((p) => p.disciplina);

  const justificativa =
    disciplinasPrioritarias.length > 0
      ? `Foco em ${disciplinasPrioritarias.map(nomeDisciplina).join(", ")} — áreas com maior necessidade de prática.`
      : "Distribuição equilibrada, mantenha revisão regular.";

  const estatisticasPorDisciplina =
    {} as MetricasAdaptativas["estatisticasPorDisciplina"];
  for (const p of pesos) {
    let necessidadeRevisao: "alta" | "media" | "baixa" = "baixa";
    if (p.taxaErro > 0.4 || p.tendencia === "piorando") {
      necessidadeRevisao = "alta";
    } else if (p.taxaErro > 0.2 || p.tendencia === "estavel") {
      necessidadeRevisao = "media";
    }
    estatisticasPorDisciplina[p.disciplina] = {
      tendencia: p.tendencia,
      confianca: p.confianca,
      questoesVistas: p.questoesRespondidas,
      taxaAcerto: p.taxaAcerto,
      necessidadeRevisao,
    };
  }

  return {
    evolucaoTaxaAcerto,
    tempoEstimadoParaDominio,
    recomendacaoProximoSimulado: {
      disciplinas: disciplinasPrioritarias,
      justificativa,
    },
    estatisticasPorDisciplina,
  };
}

// ═══════════════════════════════════════════════════════════
// DIAGNÓSTICO E TELEMETRIA
// ═══════════════════════════════════════════════════════════

export function gerarDiagnosticoAdaptativo(
  todasQuestoes: Questao[],
  historico: HistoricoSimulado[],
): DiagnosticoAdaptativo {
  const avisos: string[] = [];

  const questoesPorDisciplina = {} as Record<Disciplina, number>;
  for (const disc of ORDEM_DISCIPLINAS) {
    questoesPorDisciplina[disc] = todasQuestoes.filter(
      (q) => q.disciplina === disc,
    ).length;
  }

  const bancoSuficiente = ORDEM_DISCIPLINAS.every(
    (disc) => questoesPorDisciplina[disc] >= CONFIG.MIN_QUESTOES_POR_DISCIPLINA,
  );
  if (!bancoSuficiente) {
    const carentes = ORDEM_DISCIPLINAS.filter(
      (d) => questoesPorDisciplina[d] < CONFIG.MIN_QUESTOES_POR_DISCIPLINA,
    )
      .map(nomeDisciplina)
      .join(", ");
    avisos.push(
      `Banco de questões pequeno: ${carentes} têm menos de ${CONFIG.MIN_QUESTOES_POR_DISCIPLINA} questões.`,
    );
  }

  const historicoConfiável = historico.length >= 3;
  if (!historicoConfiável) {
    avisos.push(
      `Poucos simulados realizados (${historico.length}). As recomendações serão menos precisas.`,
    );
  }

  const disciplinasComHistorico = new Set<Disciplina>();
  for (const h of historico) {
    for (const q of h.questoes) disciplinasComHistorico.add(q.disciplina);
  }
  const semHistorico = ORDEM_DISCIPLINAS.filter(
    (d) => !disciplinasComHistorico.has(d),
  );
  if (semHistorico.length > 0) {
    avisos.push(
      `Disciplinas sem histórico: ${semHistorico.map(nomeDisciplina).join(", ")}. Faça questões para calibragem.`,
    );
  }

  // FIX: datas calculadas sem criar arrays temporários duplos com .sort().reverse()
  const datas = historico
    .map((h) => h.data)
    .filter(Boolean)
    .sort();
  const dataMaisAntiga = datas.length > 0 ? datas[0] : null;
  const dataMaisRecente = datas.length > 0 ? datas[datas.length - 1] : null;

  return {
    viabilidade: { bancoSuficiente, historicoConfiável },
    estatisticas: {
      questoesPorDisciplina,
      simuladosAnalisados: historico.length,
      dataMaisAntiga,
      dataMaisRecente,
    },
    avisos,
  };
}

// ═══════════════════════════════════════════════════════════
// CÁLCULO DE PESOS ADAPTATIVOS
// ═══════════════════════════════════════════════════════════

export function calcularPesosAdaptativos(
  historico: HistoricoSimulado[],
  _todasQuestoes: Questao[],
): PesoDisciplina[] {
  const cached = getCachedPesos(historico);
  if (cached) return cached;

  const historicoOrdenado = [...historico].sort(
    (a, b) => Date.parse(a.data) - Date.parse(b.data),
  );

  const estatisticas = ORDEM_DISCIPLINAS.map((disciplina): PesoDisciplina => {
    const questoesComPeso: (QuestaoRespondida & { pesoTemporal: number })[] =
      [];
    let ultimaDataRevisaoTimestamp = 0;

    for (const h of historicoOrdenado) {
      const peso = calcularDecaimentoTemporal(h.data);
      for (const q of h.questoes) {
        if (q.disciplina !== disciplina) continue;
        questoesComPeso.push({ ...q, pesoTemporal: peso });
        const ts = Date.parse(h.data);
        if (!Number.isNaN(ts) && ts > ultimaDataRevisaoTimestamp) {
          ultimaDataRevisaoTimestamp = ts;
        }
      }
    }

    const questoesRespondidas = questoesComPeso.length;

    if (questoesRespondidas === 0) {
      // FIX: DIFICULDADE_BASE extraída como constante — sem objeto inline duplicado
      return {
        disciplina,
        peso:
          CONFIG.PESO_NEUTRO * (DIFICULDADE_BASE[disciplina] ?? 1.0) +
          CONFIG.PESO_INCERTEZA,
        pesoNormalizado: 0,
        taxaErro: 0.5,
        taxaAcerto: 0,
        questoesRespondidas: 0,
        tendencia: "insuficiente",
        confianca: 0,
      };
    }

    let pesoTotal = 0;
    let acertosPonderados = 0;
    let errosPonderados = 0;

    for (const q of questoesComPeso) {
      pesoTotal += q.pesoTemporal;
      if (q.respostaUsuario === q.resposta) {
        acertosPonderados += q.pesoTemporal;
      } else if (q.respostaUsuario && q.respostaUsuario !== q.resposta) {
        errosPonderados += q.pesoTemporal;
      }
    }

    // FIX: pesoTotal pode ser 0 se todos os pesos forem 0 (datas muito antigas
    // + PESO_MINIMO_DECAIMENTO = 0 numa config customizada) — guard explícito
    const taxaAcerto = pesoTotal > 0 ? acertosPonderados / pesoTotal : 0;
    const taxaErro = pesoTotal > 0 ? errosPonderados / pesoTotal : 0;

    const fatorErro = taxaErro * CONFIG.PESO_ERRO;
    const fatorIncerteza =
      questoesRespondidas < CONFIG.MIN_QUESTOES_PARA_CONFIANCA
        ? CONFIG.PESO_INCERTEZA *
          (1 - questoesRespondidas / CONFIG.MIN_QUESTOES_PARA_CONFIANCA)
        : 0;
    const fatorDominio = taxaAcerto > 0.85 ? -0.3 : 0;
    const pesoBruto =
      CONFIG.PESO_NEUTRO + fatorErro + fatorIncerteza + fatorDominio;

    return {
      disciplina,
      peso: Math.max(0.3, pesoBruto),
      pesoNormalizado: 0,
      taxaErro,
      taxaAcerto,
      questoesRespondidas,
      tendencia: calcularTendencia(questoesComPeso),
      confianca: calcularConfianca(questoesRespondidas),
      ultimaRevisao:
        ultimaDataRevisaoTimestamp > 0
          ? new Date(ultimaDataRevisaoTimestamp)
          : undefined,
    };
  });

  const somaPesos = estatisticas.reduce((acc, e) => acc + e.peso, 0);
  // FIX: somaPesos pode ser 0 se todo o histórico tiver questoes.length === 0
  const fatorNormalizacao =
    somaPesos > 0 ? ORDEM_DISCIPLINAS.length / somaPesos : 0;

  const resultado = estatisticas.map((e) => ({
    ...e,
    pesoNormalizado: Math.min(2.0, e.peso * fatorNormalizacao),
  }));

  setCachedPesos(historico, resultado);
  return resultado;
}

// ═══════════════════════════════════════════════════════════
// SELEÇÃO ADAPTATIVA
// ═══════════════════════════════════════════════════════════

export function selecionarQuestoesAdaptativas(
  todasQuestoes: Questao[],
  historico: HistoricoSimulado[],
  totalQuestoes = 60,
  feedbacks?: Map<string, FeedbackUsuarioQuestao>,
): SelecaoAdaptativaResult {
  if (totalQuestoes <= 0) {
    throw new Error("[ADAPTATIVO] totalQuestoes deve ser positivo");
  }

  if (todasQuestoes.length === 0) {
    return {
      questoes: [],
      metadados: {
        distribuicaoPorDisciplina: {},
        percentualNovas: 0,
        percentualRevisao: 0,
        disciplinasPriorizadas: [],
        nivelAdaptacao: 0,
      },
      revisoesAgendadas: [],
    };
  }

  const totalAjustado = Math.min(totalQuestoes, todasQuestoes.length);
  if (totalAjustado < totalQuestoes) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[ADAPTATIVO] Apenas ${todasQuestoes.length} questões disponíveis. Ajustando de ${totalQuestoes} para ${totalAjustado}.`,
      );
    }
  }

  const pesos = calcularPesosAdaptativos(historico, todasQuestoes);

  const historicoIds = new Set(
    historico.flatMap((h) => h.questoes.map((q) => q.id)),
  );

  const questoesErradas = new Set<string>();
  for (const h of historico) {
    for (const q of h.questoes) {
      if (q.respostaUsuario && q.respostaUsuario !== q.resposta) {
        questoesErradas.add(q.id);
      }
    }
  }

  const quantidadesBase = pesos.map((p) =>
    Math.max(
      CONFIG.MIN_QUESTOES_POR_DISCIPLINA,
      Math.floor(p.pesoNormalizado * (totalAjustado / pesos.length)),
    ),
  );

  const quantidades = ajustarQuantidadesPorResto(
    quantidadesBase,
    pesos.map((p) => p.pesoNormalizado),
    totalAjustado,
    CONFIG.MIN_QUESTOES_POR_DISCIPLINA,
  );

  const selecionadas: Questao[] = [];
  const idsSelecionados = new Set<string>();
  let novasCount = 0;
  let revisaoCount = 0;

  for (let i = 0; i < pesos.length; i++) {
    const p = pesos[i];
    const quantidade = quantidades[i];
    if (quantidade === 0) continue;

    const disciplinaQs = todasQuestoes.filter(
      (q) => q.disciplina === p.disciplina,
    );

    const naoVistas = disciplinaQs.filter(
      (q) => !historicoIds.has(q.id) && !idsSelecionados.has(q.id),
    );
    const vistasErradas = disciplinaQs.filter(
      (q) => questoesErradas.has(q.id) && !idsSelecionados.has(q.id),
    );
    const vistasCertas = disciplinaQs.filter(
      (q) =>
        historicoIds.has(q.id) &&
        !questoesErradas.has(q.id) &&
        !idsSelecionados.has(q.id),
    );

    const qtdNovas = Math.min(
      Math.round(quantidade * CONFIG.PROPORCAO_NOVAS),
      naoVistas.length,
    );
    let restante = quantidade - qtdNovas;

    const qtdRevisao = Math.min(restante, vistasErradas.length);
    restante -= qtdRevisao;

    const qtdReforco = Math.min(restante, vistasCertas.length);
    restante -= qtdReforco;

    const selNovas = embaralhar(naoVistas).slice(0, qtdNovas);
    const selRevisao = embaralhar(vistasErradas).slice(0, qtdRevisao);
    const selReforco = embaralhar(vistasCertas).slice(0, qtdReforco);

    // Fallback: questões de qualquer tipo não selecionadas ainda
    const selFallback =
      restante > 0
        ? embaralhar(disciplinaQs)
            .filter((q) => !idsSelecionados.has(q.id))
            .slice(0, restante)
        : [];

    const totalDisponivel =
      naoVistas.length + vistasErradas.length + vistasCertas.length;
    if (
      process.env.NODE_ENV === "development" &&
      totalDisponivel < quantidade
    ) {
      console.warn(
        `[ADAPTATIVO] ${p.disciplina}: ${totalDisponivel} disponíveis, ${quantidade} solicitadas. Usando fallback.`,
      );
    }

    for (const q of [
      ...selNovas,
      ...selRevisao,
      ...selReforco,
      ...selFallback,
    ]) {
      idsSelecionados.add(q.id);
      selecionadas.push(q);
    }

    novasCount += qtdNovas;
    revisaoCount += qtdRevisao + qtdReforco;
  }

  const questoesFinais = embaralhar(selecionadas);
  const totalFinal = questoesFinais.length;

  const percentualNovas = totalFinal > 0 ? (novasCount / totalFinal) * 100 : 0;
  const percentualRevisao =
    totalFinal > 0 ? (revisaoCount / totalFinal) * 100 : 0;

  // Nível de adaptação: 0 = distribuição uniforme, 1 = altamente concentrada
  const somaDiffSq = pesos.reduce(
    (acc, p) => acc + (p.pesoNormalizado - 1) ** 2,
    0,
  );
  // FIX: guard contra pesos.length === 0
  const nivelAdaptacao =
    pesos.length > 0
      ? Math.min(Math.sqrt(somaDiffSq / pesos.length) * 2, 1)
      : 0;

  const revisoesAgendadas = feedbacks
    ? gerarRevisoesAgendadas(historico, questoesErradas, feedbacks)
    : [];

  return {
    questoes: questoesFinais,
    metadados: {
      distribuicaoPorDisciplina: Object.fromEntries(
        pesos.map((p, i) => [p.disciplina, quantidades[i]]),
      ),
      percentualNovas,
      percentualRevisao,
      disciplinasPriorizadas: pesos
        .filter((p) => p.pesoNormalizado > 1.3)
        .sort((a, b) => b.pesoNormalizado - a.pesoNormalizado)
        .map((p) => p.disciplina),
      nivelAdaptacao,
    },
    revisoesAgendadas:
      revisoesAgendadas.length > 0 ? revisoesAgendadas : undefined,
  };
}

// ═══════════════════════════════════════════════════════════
// ANÁLISE E RECOMENDAÇÕES
// ═══════════════════════════════════════════════════════════

export function gerarAnaliseAdaptativa(
  historico: HistoricoSimulado[],
  todasQuestoes: Questao[],
): AnaliseAdaptativa {
  const pesos = calcularPesosAdaptativos(historico, todasQuestoes);

  const criticas = pesos
    .filter(
      (p) =>
        p.taxaErro > CONFIG.MIN_TAXA_ERRO_PARA_FOCO ||
        (p.tendencia === "piorando" && p.confianca > 0.5),
    )
    .sort((a, b) => b.pesoNormalizado - a.pesoNormalizado);

  const dominadas = pesos
    .filter(
      (p) =>
        p.taxaAcerto > 0.8 && p.tendencia !== "piorando" && p.confianca > 0.5,
    )
    .sort((a, b) => a.pesoNormalizado - b.pesoNormalizado);

  const emAlta = pesos
    .filter((p) => p.tendencia === "melhorando" && p.confianca > 0.3)
    .sort((a, b) => b.taxaAcerto - a.taxaAcerto);

  const emBaixa = pesos
    .filter((p) => p.tendencia === "piorando" && p.confianca > 0.3)
    .sort((a, b) => a.taxaAcerto - b.taxaAcerto);

  const recomendacoes: string[] = [];

  if (criticas.length > 0) {
    recomendacoes.push(
      `🎯 Foco prioritário: ${criticas
        .slice(0, 2)
        .map((p) => nomeDisciplina(p.disciplina))
        .join(" e ")}`,
    );
  }
  if (emAlta.length > 0) {
    recomendacoes.push(
      `📈 Continue assim em: ${nomeDisciplina(emAlta[0].disciplina)}`,
    );
  }
  if (emBaixa.length > 0) {
    recomendacoes.push(
      `⚠️ Atenção: ${nomeDisciplina(emBaixa[0].disciplina)} está em queda`,
    );
  }

  const semDados = pesos.filter((p) => p.questoesRespondidas === 0);
  if (semDados.length > 0) {
    recomendacoes.push(
      `❓ Faça mais questões de: ${nomeDisciplina(semDados[0].disciplina)}`,
    );
  }

  const proximoMilestoneItem =
    pesos
      .filter((p) => p.taxaAcerto < 0.9 && p.confianca > 0.3)
      .sort((a, b) => b.taxaAcerto - a.taxaAcerto)[0] ?? null;

  const distribuicaoSugerida = [...pesos].sort(
    (a, b) => b.pesoNormalizado - a.pesoNormalizado,
  );

  let resumo: string;
  if (criticas.length >= 3) {
    resumo =
      "Você tem vários pontos fracos. O modo adaptativo vai focar neles.";
  } else if (criticas.length === 0 && dominadas.length >= 5) {
    resumo =
      "Excelente! Você domina a maioria das disciplinas. Mantenha a revisão.";
  } else if (emBaixa.length > emAlta.length) {
    resumo =
      "Atenção: seu desempenho geral está em queda. Hora de reforçar os estudos.";
  } else {
    resumo =
      "Desempenho equilibrado. O sistema vai otimizar sua rotina de estudos.";
  }

  // FIX: guard contra pesos vazio — confiancaGlobal seria NaN
  const confiancaGlobal =
    pesos.length > 0
      ? pesos.reduce((acc, p) => acc + p.confianca, 0) / pesos.length
      : 0;

  return {
    resumo,
    disciplinasCriticas: criticas,
    disciplinasDominadas: dominadas,
    disciplinasEmAlta: emAlta,
    disciplinasEmBaixa: emBaixa,
    recomendacoes:
      recomendacoes.length > 0
        ? recomendacoes
        : ["Continue estudando regularmente!"],
    distribuicaoSugerida,
    nivelConfiancaGlobal: confiancaGlobal,
    proximoMilestone: proximoMilestoneItem
      ? {
          disciplina: proximoMilestoneItem.disciplina,
          meta: 90,
          atual: Math.round(proximoMilestoneItem.taxaAcerto * 100),
        }
      : null,
  };
}

// ═══════════════════════════════════════════════════════════
// LEGACY
// ═══════════════════════════════════════════════════════════

/**
 * @deprecated Use `selecionarQuestoesAdaptativas` diretamente.
 */
export function selecionarQuestoesAdaptativasLegacy(
  todasQuestoes: Questao[],
  historico: HistoricoSimulado[],
  totalQuestoes = 60,
): Questao[] {
  return selecionarQuestoesAdaptativas(todasQuestoes, historico, totalQuestoes)
    .questoes;
}
