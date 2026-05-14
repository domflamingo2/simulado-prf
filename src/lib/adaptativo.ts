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
  // Pesos base
  PESO_NEUTRO: 1.0,
  PESO_INCERTEZA: 0.4,
  PESO_ERRO: 2.5,

  // Limiares
  MIN_QUESTOES_PARA_CONFIANCA: 4,
  MAX_TAXA_ERRO_PARA_DOMINIO: 0.15,
  MIN_TAXA_ERRO_PARA_FOCO: 0.45,

  // Distribuição
  PROPORCAO_NOVAS: 0.7,
  PROPORCAO_REVISAO: 0.3,
  MIN_QUESTOES_POR_DISCIPLINA: 2,

  // Decaimento temporal
  MEIA_VIDA_DIAS: 30,
  PESO_MINIMO_DECAIMENTO: 0.05, // ✅ MELHORIA: evita peso zero para datas muito antigas

  // Cache
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutos
} as const;

// ═══════════════════════════════════════════════════════════
// NOMES LEGÍVEIS DAS DISCIPLINAS (COM TIPAGEM FORTE)
// ═══════════════════════════════════════════════════════════

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

function nomeDisciplina(disc: Disciplina): string {
  return DISCIPLINAS_NOME[disc];
}

// ═══════════════════════════════════════════════════════════
// TIPOS EXPANDIDOS
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

// ✅ MELHORIA: Feedback explícito do usuário
export interface FeedbackUsuarioQuestao {
  questaoId: string;
  dificuldadePercebida: 1 | 2 | 3 | 4 | 5; // 1=muito fácil, 5=muito difícil
  tempoGastoSegundos?: number;
  marcadaParaRevisao?: boolean;
  comentario?: string;
}

// ✅ SISTEMA: Revisão Espaçada
export interface RevisaoAgendada {
  questaoId: string;
  disciplina: Disciplina;
  proximaRevisao: Date;
  ultimaRevisao: Date;
  intervalo: number; // dias
  nivelDificuldade: 1 | 2 | 3; // 1=fácil, 2=médio, 3=difícil
  acertosConsecutivos: number;
}

// ✅ MÉTRICAS: Dashboard
export interface MetricasAdaptativas {
  evolucaoTaxaAcerto: {
    data: string;
    global: number;
    porDisciplina: Record<Disciplina, number>;
  }[];
  tempoEstimadoParaDominio: Record<Disciplina, number | null>; // dias
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

// ✅ DIAGNÓSTICO: Telemetria
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
  revisoesAgendadas?: RevisaoAgendada[]; // ✅ SISTEMA: revisões espaçadas
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
// PERSISTÊNCIA DE ESTADO (CACHE)
// ═══════════════════════════════════════════════════════════

interface CachePesos {
  timestamp: Date;
  pesos: PesoDisciplina[];
  historicoHash: string;
}

let cachePesos: CachePesos | null = null;

function calcularHashHistorico(historico: HistoricoSimulado[]): string {
  // Hash simples baseado na última data e quantidade de simulados
  const ultimaData = historico[historico.length - 1]?.data || "";
  return `${historico.length}:${ultimaData}`;
}

function getCachedPesos(
  historico: HistoricoSimulado[],
): PesoDisciplina[] | null {
  if (!cachePesos) return null;

  const hash = calcularHashHistorico(historico);
  const idade = Date.now() - cachePesos.timestamp.getTime();

  if (cachePesos.historicoHash === hash && idade < CONFIG.CACHE_TTL_MS) {
    return cachePesos.pesos;
  }
  return null;
}

function setCachedPesos(
  historico: HistoricoSimulado[],
  pesos: PesoDisciplina[],
) {
  cachePesos = {
    timestamp: new Date(),
    pesos,
    historicoHash: calcularHashHistorico(historico),
  };
}

// ═══════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES
// ═══════════════════════════════════════════════════════════

// ✅ CORREÇÃO: decaimento com peso mínimo
function calcularDecaimentoTemporal(dataSimuladoISO: string): number {
  const dias =
    (Date.now() - new Date(dataSimuladoISO).getTime()) / (1000 * 60 * 60 * 24);
  const diasPositivos = Math.max(0, dias);
  const peso = Math.exp(-diasPositivos / CONFIG.MEIA_VIDA_DIAS);
  return Math.max(CONFIG.PESO_MINIMO_DECAIMENTO, peso);
}

function calcularTendencia(
  questoes: QuestaoRespondida[],
): PesoDisciplina["tendencia"] {
  if (questoes.length < 4) return "insuficiente";

  const meio = Math.floor(questoes.length / 2);
  const primeiraMetade = questoes.slice(0, meio);
  const segundaMetade = questoes.slice(meio);

  const taxaPrimeira =
    primeiraMetade.filter((q) => q.respostaUsuario === q.resposta).length /
    primeiraMetade.length;
  const taxaSegunda =
    segundaMetade.filter((q) => q.respostaUsuario === q.resposta).length /
    segundaMetade.length;

  const diferenca = taxaSegunda - taxaPrimeira;

  if (diferenca > 0.15) return "melhorando";
  if (diferenca < -0.15) return "piorando";
  return "estavel";
}

function calcularConfianca(n: number): number {
  return Math.min(n / CONFIG.MIN_QUESTOES_PARA_CONFIANCA, 1);
}

// ✅ MELHORIA: lógica de distribuição exportada
export function ajustarQuantidadesPorResto(
  quantidades: number[],
  pesos: number[],
  totalAlvo: number,
  minPorDisciplina: number,
): number[] {
  const result = [...quantidades];
  const totalCalculado = result.reduce((a, b) => a + b, 0);
  let diferenca = totalAlvo - totalCalculado;

  if (diferenca === 0) return result;

  const restos = pesos.map((p, i) => {
    const bruto = p * (totalAlvo / pesos.length);
    return {
      index: i,
      resto: bruto - Math.floor(bruto),
      quantidade: result[i],
    };
  });

  if (diferenca > 0) {
    restos
      .sort((a, b) => b.resto - a.resto)
      .slice(0, diferenca)
      .forEach(({ index }) => result[index]++);
  } else {
    const diferencaAbs = Math.abs(diferenca);
    const candidatos = restos.filter((r) => r.quantidade > minPorDisciplina);

    if (candidatos.length >= diferencaAbs) {
      candidatos
        .sort((a, b) => a.resto - b.resto)
        .slice(0, diferencaAbs)
        .forEach(({ index }) => result[index]--);
    } else {
      // ✅ CORREÇÃO: fallback emergencial
      restos
        .sort((a, b) => a.resto - b.resto)
        .slice(0, diferencaAbs)
        .forEach(({ index }) => {
          if (result[index] > 0) result[index]--;
        });
    }
  }

  return result;
}

// ═══════════════════════════════════════════════════════════
// REVISÃO ESPAÇADA (SISTEMA)
// ═══════════════════════════════════════════════════════════

export function atualizarIntervaloRevisao(
  acertou: boolean,
  intervaloAtual: number,
  dificuldade: 1 | 2 | 3,
): number {
  const fatorDificuldade =
    dificuldade === 3 ? 0.5 : dificuldade === 2 ? 0.8 : 1.2;

  if (acertou) {
    const novoIntervalo = Math.floor(intervaloAtual * 1.5 * fatorDificuldade);
    return Math.min(novoIntervalo, 180); // max 6 meses
  } else {
    const novoIntervalo = Math.max(Math.floor(intervaloAtual / 2), 1);
    return novoIntervalo;
  }
}

export function gerarRevisoesAgendadas(
  historico: HistoricoSimulado[],
  questoesErradas: Set<string>,
  feedbacks: Map<string, FeedbackUsuarioQuestao>,
): RevisaoAgendada[] {
  const revisoes: RevisaoAgendada[] = [];
  const hoje = new Date();

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

      if (precisaRevisar) {
        const intervaloBase = questoesErradas.has(questao.id) ? 3 : 7;
        const proximaRevisao = new Date(hoje);
        proximaRevisao.setDate(hoje.getDate() + intervaloBase);

        revisoes.push({
          questaoId: questao.id,
          disciplina: questao.disciplina,
          proximaRevisao,
          ultimaRevisao: new Date(simulado.data),
          intervalo: intervaloBase,
          nivelDificuldade: dificuldade,
          acertosConsecutivos: 0,
        });
      }
    }
  }

  return revisoes;
}

// ═══════════════════════════════════════════════════════════
// MÉTRICAS PARA DASHBOARD
// ═══════════════════════════════════════════════════════════

export function gerarMetricasDashboard(
  historico: HistoricoSimulado[],
  pesos: PesoDisciplina[],
): MetricasAdaptativas {
  // Evolução da taxa de acerto ao longo do tempo (últimos 10 simulados)
  const ultimosSimulados = [...historico].slice(-10);
  const evolucaoTaxaAcerto = ultimosSimulados.map((simulado, idx) => {
    const questoesSimulado = simulado.questoes;
    const global =
      questoesSimulado.filter((q) => q.respostaUsuario === q.resposta).length /
      questoesSimulado.length;

    const porDisciplina = {} as Record<Disciplina, number>;
    for (const disc of ORDEM_DISCIPLINAS) {
      const questoesDisc = questoesSimulado.filter(
        (q) => q.disciplina === disc,
      );
      if (questoesDisc.length > 0) {
        porDisciplina[disc] =
          questoesDisc.filter((q) => q.respostaUsuario === q.resposta).length /
          questoesDisc.length;
      } else {
        porDisciplina[disc] = 0;
      }
    }

    return {
      data: simulado.data,
      global,
      porDisciplina,
    };
  });

  // Tempo estimado para domínio (>85% de acerto)
  const tempoEstimadoParaDominio = {} as Record<Disciplina, number | null>;
  for (const p of pesos) {
    if (p.taxaAcerto >= 0.85) {
      tempoEstimadoParaDominio[p.disciplina] = 0;
    } else if (p.confianca < 0.3) {
      tempoEstimadoParaDominio[p.disciplina] = null;
    } else {
      const deficit = 0.85 - p.taxaAcerto;
      const melhoriasPorSimulado = p.tendencia === "melhorando" ? 0.05 : 0.02;
      const simuladosNecessarios = Math.ceil(deficit / melhoriasPorSimulado);
      tempoEstimadoParaDominio[p.disciplina] = simuladosNecessarios * 7; // dias aproximados
    }
  }

  // Recomendação para próximo simulado
  const disciplinasPrioritarias = pesos
    .filter((p) => p.pesoNormalizado > 1.2)
    .sort((a, b) => b.pesoNormalizado - a.pesoNormalizado)
    .slice(0, 3)
    .map((p) => p.disciplina);

  let justificativa = "";
  if (disciplinasPrioritarias.length > 0) {
    justificativa = `Foco em ${disciplinasPrioritarias
      .map(nomeDisciplina)
      .join(", ")} - áreas com maior necessidade de prática.`;
  } else {
    justificativa = "Distribuição equilibrada, mantenha revisão regular.";
  }

  // Estatísticas por disciplina
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

  // Contagem de questões por disciplina
  const questoesPorDisciplina = {} as Record<Disciplina, number>;
  for (const disc of ORDEM_DISCIPLINAS) {
    questoesPorDisciplina[disc] = todasQuestoes.filter(
      (q) => q.disciplina === disc,
    ).length;
  }

  // Banco suficiente?
  const bancoSuficiente = ORDEM_DISCIPLINAS.every(
    (disc) => questoesPorDisciplina[disc] >= CONFIG.MIN_QUESTOES_POR_DISCIPLINA,
  );

  if (!bancoSuficiente) {
    avisos.push(
      `Banco de questões pequeno: ${ORDEM_DISCIPLINAS.filter(
        (d) => questoesPorDisciplina[d] < CONFIG.MIN_QUESTOES_POR_DISCIPLINA,
      )
        .map(nomeDisciplina)
        .join(
          ", ",
        )} têm menos de ${CONFIG.MIN_QUESTOES_POR_DISCIPLINA} questões.`,
    );
  }

  // Histórico confiável?
  const historicoConfiável = historico.length >= 3;
  if (!historicoConfiável) {
    avisos.push(
      `Poucos simulados realizados (${historico.length}). As recomendações serão menos precisas.`,
    );
  }

  // Verificar disciplinas sem histórico
  const disciplinasComHistorico = new Set<Disciplina>();
  for (const h of historico) {
    for (const q of h.questoes) {
      disciplinasComHistorico.add(q.disciplina);
    }
  }
  const disciplinasSemHistorico = ORDEM_DISCIPLINAS.filter(
    (d) => !disciplinasComHistorico.has(d),
  );
  if (disciplinasSemHistorico.length > 0) {
    avisos.push(
      `Disciplinas sem histórico: ${disciplinasSemHistorico
        .map(nomeDisciplina)
        .join(", ")}. Faça questões para calibragem.`,
    );
  }

  // Datas
  const datas = historico.map((h) => h.data).filter(Boolean);
  const dataMaisAntiga = datas.length > 0 ? datas.sort()[0] : null;
  const dataMaisRecente = datas.length > 0 ? datas.sort().reverse()[0] : null;

  return {
    viabilidade: {
      bancoSuficiente,
      historicoConfiável,
    },
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
// CÁLCULO DE PESOS ADAPTATIVOS (COM CACHE)
// ═══════════════════════════════════════════════════════════

export function calcularPesosAdaptativos(
  historico: HistoricoSimulado[],
  _todasQuestoes: Questao[],
): PesoDisciplina[] {
  // ✅ MELHORIA: verificar cache
  const cached = getCachedPesos(historico);
  if (cached) return cached;

  const historicoOrdenado = [...historico].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime(),
  );

  const estatisticas = ORDEM_DISCIPLINAS.map((disciplina): PesoDisciplina => {
    const questoesComPeso: (QuestaoRespondida & { pesoTemporal: number })[] =
      [];
    let ultimaDataRevisaoTimestamp = 0;

    for (const h of historicoOrdenado) {
      const peso = calcularDecaimentoTemporal(h.data);
      const questoesDisciplina = h.questoes.filter(
        (q) => q.disciplina === disciplina,
      );

      for (const q of questoesDisciplina) {
        questoesComPeso.push({ ...q, pesoTemporal: peso });
        const ts = new Date(h.data).getTime();
        if (ts > ultimaDataRevisaoTimestamp) {
          ultimaDataRevisaoTimestamp = ts;
        }
      }
    }

    const questoesRespondidas = questoesComPeso.length;

    if (questoesRespondidas === 0) {
      const dificuldadePercebida: Record<Disciplina, number> = {
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

      return {
        disciplina,
        peso:
          CONFIG.PESO_NEUTRO * (dificuldadePercebida[disciplina] ?? 1.0) +
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
  const fatorNormalizacao =
    somaPesos > 0 ? ORDEM_DISCIPLINAS.length / somaPesos : 0;

  const resultado = estatisticas.map((e) => ({
    ...e,
    // ✅ CORREÇÃO: clamp no pesoNormalizado
    pesoNormalizado: Math.min(2.0, e.peso * fatorNormalizacao),
  }));

  // ✅ MELHORIA: salvar no cache
  setCachedPesos(historico, resultado);

  return resultado;
}

// ═══════════════════════════════════════════════════════════
// SELEÇÃO DE QUESTÕES ADAPTATIVA
// ═══════════════════════════════════════════════════════════

export function selecionarQuestoesAdaptativas(
  todasQuestoes: Questao[],
  historico: HistoricoSimulado[],
  totalQuestoes = 60,
  feedbacks?: Map<string, FeedbackUsuarioQuestao>,
): SelecaoAdaptativaResult {
  // ✅ CORREÇÃO: validação de entrada
  if (totalQuestoes <= 0) {
    throw new Error("totalQuestoes deve ser positivo");
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

  let totalAjustado = totalQuestoes;
  if (totalQuestoes > todasQuestoes.length) {
    console.warn(
      `[ADAPTATIVO] Apenas ${todasQuestoes.length} questões disponíveis. Ajustando total de ${totalQuestoes} para ${todasQuestoes.length}.`,
    );
    totalAjustado = todasQuestoes.length;
  }

  const pesos = calcularPesosAdaptativos(historico, todasQuestoes);

  const historicoIds = new Set(
    historico.flatMap((h) => h.questoes.map((q) => q.id)),
  );

  const questoesErradasAnteriormente = new Set<string>();
  for (const h of historico) {
    for (const q of h.questoes) {
      if (q.respostaUsuario && q.respostaUsuario !== q.resposta) {
        questoesErradasAnteriormente.add(q.id);
      }
    }
  }

  // Distribuição proporcional usando função exportada
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

  // Seleção por disciplina
  const selecionadas: Questao[] = [];
  const idsSelecionados = new Set<string>(); // ✅ CORREÇÃO: evita repetição
  let novasCount = 0;
  let revisaoCount = 0;

  for (let i = 0; i < pesos.length; i++) {
    const p = pesos[i];
    const quantidade = quantidades[i];
    if (quantidade === 0) continue;

    const questoesDisciplina = todasQuestoes.filter(
      (q) => q.disciplina === p.disciplina,
    );

    const naoVistas = questoesDisciplina.filter(
      (q) => !historicoIds.has(q.id) && !idsSelecionados.has(q.id),
    );
    const vistasErradas = questoesDisciplina.filter(
      (q) =>
        questoesErradasAnteriormente.has(q.id) && !idsSelecionados.has(q.id),
    );
    const vistasCertas = questoesDisciplina.filter(
      (q) =>
        historicoIds.has(q.id) &&
        !questoesErradasAnteriormente.has(q.id) &&
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

    const qtdFallback = restante > 0 ? restante : 0;

    const selecionadasNovas = embaralhar(naoVistas).slice(0, qtdNovas);
    const selecionadasRevisao = embaralhar(vistasErradas).slice(0, qtdRevisao);
    const selecionadasReforco = embaralhar(vistasCertas).slice(0, qtdReforco);

    // Fallback evitando IDs já selecionados
    const selecionadasFallback =
      qtdFallback > 0
        ? embaralhar(questoesDisciplina)
            .filter((q) => !idsSelecionados.has(q.id))
            .slice(0, qtdFallback)
        : [];

    // ✅ CORREÇÃO: log de advertência para banco pequeno
    const totalDisponivel =
      naoVistas.length + vistasErradas.length + vistasCertas.length;
    if (totalDisponivel < quantidade) {
      console.warn(
        `[ADAPTATIVO] Disciplina ${p.disciplina}: apenas ${totalDisponivel} questões disponíveis, solicitado ${quantidade}. Usando fallback com repetição.`,
      );
    }

    for (const q of [
      ...selecionadasNovas,
      ...selecionadasRevisao,
      ...selecionadasReforco,
      ...selecionadasFallback,
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

  const somaDiferencasQuadradas = pesos.reduce(
    (acc, p) => acc + (p.pesoNormalizado - 1) ** 2,
    0,
  );
  const nivelAdaptacao = Math.min(
    Math.sqrt(somaDiferencasQuadradas / pesos.length) * 2,
    1,
  );

  // ✅ SISTEMA: gerar revisões agendadas
  const revisoesAgendadas = feedbacks
    ? gerarRevisoesAgendadas(historico, questoesErradasAnteriormente, feedbacks)
    : [];

  const metadados = {
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
  };

  return {
    questoes: questoesFinais,
    metadados,
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

  const criticas = [...pesos]
    .filter(
      (p) =>
        p.taxaErro > CONFIG.MIN_TAXA_ERRO_PARA_FOCO ||
        (p.tendencia === "piorando" && p.confianca > 0.5),
    )
    .sort((a, b) => b.pesoNormalizado - a.pesoNormalizado);

  const dominadas = [...pesos]
    .filter(
      (p) =>
        p.taxaAcerto > 0.8 && p.tendencia !== "piorando" && p.confianca > 0.5,
    )
    .sort((a, b) => a.pesoNormalizado - b.pesoNormalizado);

  const emAlta = [...pesos]
    .filter((p) => p.tendencia === "melhorando" && p.confianca > 0.3)
    .sort((a, b) => b.taxaAcerto - a.taxaAcerto);

  const emBaixa = [...pesos]
    .filter((p) => p.tendencia === "piorando" && p.confianca > 0.3)
    .sort((a, b) => a.taxaAcerto - b.taxaAcerto);

  const recomendacoes: string[] = [];

  if (criticas.length > 0) {
    const nomes = criticas.slice(0, 2).map((p) => nomeDisciplina(p.disciplina));
    recomendacoes.push(`🎯 Foco prioritário: ${nomes.join(" e ")}`);
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
    [...pesos]
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

  const confiancaGlobal =
    pesos.reduce((acc, p) => acc + p.confianca, 0) / pesos.length;

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
