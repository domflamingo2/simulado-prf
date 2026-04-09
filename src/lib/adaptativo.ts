// lib/adaptativo.ts
import {
  Disciplina,
  HistoricoSimulado,
  Questao,
  QuestaoRespondida,
} from "@/data/types";
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
  MIN_QUESTOES_PARA_CONFIANCA: 8,
  MAX_TAXA_ERRO_PARA_DOMINIO: 0.15,
  MIN_TAXA_ERRO_PARA_FOCO: 0.45,

  // Distribuição
  PROPORCAO_NOVAS: 0.7,
  PROPORCAO_REVISAO: 0.3,
  MIN_QUESTOES_POR_DISCIPLINA: 2,

  // Decaimento temporal
  MEIA_VIDA_DIAS: 30,
} as const;

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

export interface SelecaoAdaptativaResult {
  questoes: Questao[];
  metadados: {
    distribuicaoPorDisciplina: Record<string, number>;
    percentualNovas: number;
    percentualRevisao: number;
    disciplinasPriorizadas: Disciplina[];
    nivelAdaptacao: number;
  };
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
// FUNÇÕES AUXILIARES
// ═══════════════════════════════════════════════════════════

function calcularDecaimentoTemporal(dataSimuladoISO: string): number {
  const dias =
    (Date.now() - new Date(dataSimuladoISO).getTime()) / (1000 * 60 * 60 * 24);
  return Math.exp(-dias / CONFIG.MEIA_VIDA_DIAS);
}

function calcularTendencia(
  questoes: QuestaoRespondida[],
): PesoDisciplina["tendencia"] {
  if (questoes.length < 4) return "insuficiente";

  const meio = Math.floor(questoes.length / 2);
  const primeiraMetade = questoes.slice(0, meio);
  const segundaMetade = questoes.slice(meio);

  const acertosPrimeira = primeiraMetade.filter(
    (q) => q.respostaUsuario === q.resposta,
  ).length;
  const acertosSegunda = segundaMetade.filter(
    (q) => q.respostaUsuario === q.resposta,
  ).length;

  const taxaPrimeira = acertosPrimeira / primeiraMetade.length;
  const taxaSegunda = acertosSegunda / segundaMetade.length;

  const diferenca = taxaSegunda - taxaPrimeira;

  if (diferenca > 0.15) return "melhorando";
  if (diferenca < -0.15) return "piorando";
  return "estavel";
}

function calcularConfianca(n: number): number {
  return Math.min(n / CONFIG.MIN_QUESTOES_PARA_CONFIANCA, 1);
}

// ═══════════════════════════════════════════════════════════
// CÁLCULO DE PESOS ADAPTATIVOS
// ═══════════════════════════════════════════════════════════

export function calcularPesosAdaptativos(
  historico: HistoricoSimulado[],
  todasQuestoes: Questao[],
): PesoDisciplina[] {
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

  // ✅ CORREÇÃO TS: Inicializa explicitamente com Record<Disciplina, number> ou usa cast seguro
  const totalPorDisciplina = todasQuestoes.reduce<Record<string, number>>(
    (acc, q) => {
      // ✅ CORREÇÃO TS: Acesso seguro após tipagem do reduce
      acc[q.disciplina] = (acc[q.disciplina] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>, // Ou inicializar com um objeto mapeado das disciplinas
  );

  const estatisticas = disciplinas.map((disciplina): PesoDisciplina => {
    const questoesComPeso: (QuestaoRespondida & { pesoTemporal: number })[] =
      [];
    let ultimaDataRevisaoTimestamp = 0;

    for (const h of historico) {
      const peso = calcularDecaimentoTemporal(h.data);
      const questoesDisciplina = h.questoes.filter(
        (q) => q.disciplina === disciplina,
      );

      for (const q of questoesDisciplina) {
        questoesComPeso.push({ ...q, pesoTemporal: peso });
        const timestampSimulado = new Date(h.data).getTime();
        if (timestampSimulado > ultimaDataRevisaoTimestamp) {
          ultimaDataRevisaoTimestamp = timestampSimulado;
        }
      }
    }

    const questoesRespondidas = questoesComPeso.length;

    if (questoesRespondidas === 0) {
      const dificuldadePercebida =
        {
          PORTUGUES: 1.0,
          ETICA: 0.9,
          RACIOCINIO_LOGICO: 1.2,
          DIREITO_CONSTITUCIONAL: 1.1,
          DIREITO_ADMINISTRATIVO: 1.1,
          ADMINISTRACAO: 1.0,
          ARQUIVOLOGIA: 1.3,
          INFORMATICA: 0.8,
          LEGISLACAO_PRF: 1.2,
        }[disciplina] || 1.0;

      return {
        disciplina,
        peso: CONFIG.PESO_NEUTRO * dificuldadePercebida + CONFIG.PESO_INCERTEZA,
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
  const fatorNormalizacao = somaPesos > 0 ? disciplinas.length / somaPesos : 0;

  return estatisticas.map((e) => ({
    ...e,
    pesoNormalizado: e.peso * fatorNormalizacao,
  }));
}

// ═══════════════════════════════════════════════════════════
// SELEÇÃO DE QUESTÕES ADAPTATIVA
// ═══════════════════════════════════════════════════════════

export function selecionarQuestoesAdaptativas(
  todasQuestoes: Questao[],
  historico: HistoricoSimulado[],
  totalQuestoes: number = 60,
): SelecaoAdaptativaResult {
  const pesos = calcularPesosAdaptativos(historico, todasQuestoes);

  const historicoIds = new Set(
    historico.flatMap((h) => h.questoes.map((q) => q.id)),
  );

  const questoesErradasAnteriormente = new Set<string>();
  historico.forEach((h) => {
    h.questoes.forEach((q) => {
      if (q.respostaUsuario && q.respostaUsuario !== q.resposta) {
        questoesErradasAnteriormente.add(q.id);
      }
    });
  });

  // Calcula distribuição proporcional
  let distribuicao = pesos.map((p) => {
    const qtdAlvo = p.pesoNormalizado * (totalQuestoes / pesos.length);
    return {
      disciplina: p.disciplina,
      quantidade: Math.floor(qtdAlvo),
      peso: p.pesoNormalizado,
    };
  });

  // Ajusta para soma exata usando algoritmo de maior resto
  const totalCalculado = distribuicao.reduce((acc, d) => acc + d.quantidade, 0);
  const restante = totalQuestoes - totalCalculado;

  const comRestos = pesos
    .map((p, i) => {
      const qtdAlvo = p.pesoNormalizado * (totalQuestoes / pesos.length);
      return {
        index: i,
        resto: qtdAlvo % 1,
        disciplina: p.disciplina,
      };
    })
    .sort((a, b) => b.resto - a.resto);

  for (let i = 0; i < restante; i++) {
    const idx = comRestos[i % comRestos.length].index;
    distribuicao[idx].quantidade++;
  }

  // Garante mínimo por disciplina
  distribuicao = distribuicao.map((d) => ({
    ...d,
    quantidade: Math.max(d.quantidade, CONFIG.MIN_QUESTOES_POR_DISCIPLINA),
  }));

  // ✅ MELHORIA LÓGICA: Tratamento de overflow onde MIN > TOTAL_POSSIVEL
  // Se mesmo reduzindo ao máximo (min por disciplina) a soma exceder o total,
  // precisamos aceitar que o simulado terá mais questões ou lançar erro.
  // Aqui, faremos um "Best Effort" para cortar dos maiores pesos ainda possíveis.

  let safetyCounter = 0;
  while (
    distribuicao.reduce((acc, d) => acc + d.quantidade, 0) > totalQuestoes &&
    safetyCounter < 1000 // Aumentado ligeiramente para segurança
  ) {
    // Encontra a disciplina com maior quantidade que ainda pode ser reduzida ( > MIN )
    // Ordena por quantidade decrescente para pegar a mais "cheia"
    const candidatos = distribuicao
      .map((d, i) => ({ ...d, originalIndex: i }))
      .filter((d) => d.quantidade > CONFIG.MIN_QUESTOES_POR_DISCIPLINA)
      .sort((a, b) => b.quantidade - a.quantidade);

    if (candidatos.length === 0) {
      // Situação crítica: Todas estão no mínimo e ainda estoura o total.
      // Ação de emergência: cortar 1 da que tem mais quantidade mesmo que seja o mínimo
      // (Isso quebra a regra MIN, mas evita loop infinito)
      const maiorQuantidade = Math.max(
        ...distribuicao.map((d) => d.quantidade),
      );
      const idxMaior = distribuicao.findIndex(
        (d) => d.quantidade === maiorQuantidade,
      );
      if (idxMaior !== -1) distribuicao[idxMaior].quantidade--;
      break;
    }

    // Reduz o maior candidato
    const idxParaCortar = candidatos[0].originalIndex;
    distribuicao[idxParaCortar].quantidade--;

    safetyCounter++;
  }

  const selecionadas: Questao[] = [];

  // ✅ CORREÇÃO TS: Variável auxiliar para contagem estrita
  let novasCount = 0;
  let revisaoCount = 0;

  distribuicao.forEach(({ disciplina, quantidade }) => {
    if (quantidade === 0) return;

    const questoesDisciplina = todasQuestoes.filter(
      (q) => q.disciplina === disciplina,
    );

    const naoVistas = questoesDisciplina.filter((q) => !historicoIds.has(q.id));
    const vistasErradas = questoesDisciplina.filter((q) =>
      questoesErradasAnteriormente.has(q.id),
    );
    const vistasCertas = questoesDisciplina.filter(
      (q) => historicoIds.has(q.id) && !questoesErradasAnteriormente.has(q.id),
    );

    const qtdNovas = Math.min(
      Math.round(quantidade * CONFIG.PROPORCAO_NOVAS),
      naoVistas.length,
    );
    let restante = quantidade - qtdNovas;

    const qtdRevisao = Math.min(restante, vistasErradas.length);
    restante -= qtdRevisao;

    const qtdReforco = restante;

    const selecionadasNovas = embaralhar(naoVistas).slice(0, qtdNovas);
    const selecionadasRevisao = embaralhar(vistasErradas).slice(0, qtdRevisao);
    const selecionadasReforco = embaralhar(vistasCertas).slice(0, qtdReforco);

    selecionadas.push(
      ...selecionadasNovas,
      ...selecionadasRevisao,
      ...selecionadasReforco,
    );

    novasCount += qtdNovas;
    revisaoCount += qtdRevisao;
  });

  const questoesFinais = embaralhar(selecionadas);

  // Cálculo de desvio padrão
  const somaDiferencasQuadradas = pesos.reduce(
    (acc, p) => acc + Math.pow(p.pesoNormalizado - 1, 2),
    0,
  );
  const desvioPadrao = Math.sqrt(somaDiferencasQuadradas / pesos.length);
  const nivelAdaptacao = Math.min(desvioPadrao * 2, 1);

  // ✅ CORREÇÃO TS: Retorno limpo batendo exatamente com a interface
  const metadados: SelecaoAdaptativaResult["metadados"] = {
    distribuicaoPorDisciplina: distribuicao.reduce(
      (acc, curr) => {
        acc[curr.disciplina] = curr.quantidade;
        return acc;
      },
      {} as Record<string, number>,
    ),
    percentualNovas: (novasCount / questoesFinais.length) * 100,
    percentualRevisao: (revisaoCount / questoesFinais.length) * 100,
    disciplinasPriorizadas: pesos
      .filter((p) => p.pesoNormalizado > 1.3)
      .sort((a, b) => b.pesoNormalizado - a.pesoNormalizado)
      .map((p) => p.disciplina),
    nivelAdaptacao,
  };

  return {
    questoes: questoesFinais,
    metadados,
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
    const nomes = criticas
      .slice(0, 2)
      .map((p) => p.disciplina.replace(/_/g, " ").toLowerCase());
    recomendacoes.push(`🎯 Foco prioritário: ${nomes.join(" e ")}`);
  }

  if (emAlta.length > 0) {
    recomendacoes.push(
      `📈 Continue assim em: ${emAlta[0].disciplina.replace(/_/g, " ")}`,
    );
  }

  if (emBaixa.length > 0) {
    recomendacoes.push(
      `⚠️ Atenção: ${emBaixa[0].disciplina.replace(/_/g, " ")} está em queda`,
    );
  }

  const semDados = pesos.filter((p) => p.questoesRespondidas === 0);
  if (semDados.length > 0) {
    recomendacoes.push(
      `❓ Faça mais questões de: ${semDados[0].disciplina.replace(/_/g, " ")}`,
    );
  }

  const candidatosMilestone = pesos.filter(
    (p) => p.taxaAcerto < 0.9 && p.confianca > 0.3,
  );

  const proximoMilestone =
    candidatosMilestone.sort((a, b) => b.taxaAcerto - a.taxaAcerto)[0] || null;

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
    distribuicaoSugerida: pesos.sort(
      (a, b) => b.pesoNormalizado - a.pesoNormalizado,
    ),
    nivelConfiancaGlobal: confiancaGlobal,
    proximoMilestone: proximoMilestone
      ? {
          disciplina: proximoMilestone.disciplina,
          meta: 90,
          atual: Math.round(proximoMilestone.taxaAcerto * 100),
        }
      : null,
  };
}

export function selecionarQuestoesAdaptativasLegacy(
  todasQuestoes: Questao[],
  historico: HistoricoSimulado[],
  totalQuestoes: number = 60,
): Questao[] {
  return selecionarQuestoesAdaptativas(todasQuestoes, historico, totalQuestoes)
    .questoes;
}
