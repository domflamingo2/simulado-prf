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
  PESO_INCERTEZA: 0.4, // Bônus para disciplinas pouco vistas
  PESO_ERRO: 2.5, // Multiplicador de taxa de erro

  // Limiares
  MIN_QUESTOES_PARA_CONFIANCA: 8,
  MAX_TAXA_ERRO_PARA_DOMINIO: 0.15,
  MIN_TAXA_ERRO_PARA_FOCO: 0.45,

  // Distribuição
  PROPORCAO_NOVAS: 0.7, // 70% questões nunca vistas
  PROPORCAO_REVISAO: 0.3, // 30% questões erradas anteriormente
  MIN_QUESTOES_POR_DISCIPLINA: 2, // Garante variedade mínima

  // Decaimento temporal (peso de simulados antigos)
  MEIA_VIDA_DIAS: 30, // Simulado de 30 dias atrás vale metade
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
  confianca: number; // 0-1 quão confiável é a estatística
  ultimaRevisao?: Date;
}

export interface SelecaoAdaptativaResult {
  questoes: Questao[];
  metadados: {
    distribuicaoPorDisciplina: Record<Disciplina, number>;
    percentualNovas: number;
    percentualRevisao: number;
    disciplinasPriorizadas: Disciplina[];
    nivelAdaptacao: number; // 0-1 quão "personalizado" ficou
  };
}

export interface AnaliseAdaptativa {
  resumo: string;
  disciplinasCriticas: PesoDisciplina[];
  disciplinasDominadas: PesoDisciplina[];
  disciplinasEmAlta: PesoDisciplina[]; // Melhorando recentemente
  disciplinasEmBaixa: PesoDisciplina[]; // Piorando recentemente
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

/** Calcula fator de decaimento temporal */
function calcularDecaimentoTemporal(dataSimulado: string): number {
  const dias =
    (Date.now() - new Date(dataSimulado).getTime()) / (1000 * 60 * 60 * 24);
  return Math.exp(-dias / CONFIG.MEIA_VIDA_DIAS); // Decaimento exponencial
}

/** Analisa tendência comparando primeiros 50% vs últimos 50% do histórico */
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

/** Calcula confiança estatística baseada no tamanho da amostra */
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

  // Conta total disponível por disciplina (para normalização)
  const totalPorDisciplina = disciplinas.reduce(
    (acc, disc) => {
      acc[disc] = todasQuestoes.filter((q) => q.disciplina === disc).length;
      return acc;
    },
    {} as Record<Disciplina, number>,
  );

  const estatisticas = disciplinas.map((disciplina): PesoDisciplina => {
    // Coleta questões com peso temporal
    const questoesComPeso = historico.flatMap((h) =>
      h.questoes
        .filter((q) => q.disciplina === disciplina)
        .map((q) => ({
          ...q,
          pesoTemporal: calcularDecaimentoTemporal(h.data),
        })),
    );

    const questoesRespondidas = questoesComPeso.length;

    // Caso sem histórico: peso baseado na dificuldade percebida da disciplina
    if (questoesRespondidas === 0) {
      const dificuldadePercebida =
        {
          PORTUGUES: 1.0,
          ETICA: 0.9,
          RACIOCINIO_LOGICO: 1.2,
          DIREITO_CONSTITUCIONAL: 1.1,
          DIREITO_ADMINISTRATIVO: 1.1,
          ADMINISTRACAO: 1.0,
          ARQUIVOLOGIA: 1.3, // Geralmente mais difícil
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

    // Calcula taxas ponderadas temporalmente
    const pesoTotal = questoesComPeso.reduce(
      (acc, q) => acc + q.pesoTemporal,
      0,
    );

    const acertosPonderados = questoesComPeso
      .filter((q) => q.respostaUsuario === q.resposta)
      .reduce((acc, q) => acc + q.pesoTemporal, 0);

    const errosPonderados = questoesComPeso
      .filter((q) => q.respostaUsuario && q.respostaUsuario !== q.resposta)
      .reduce((acc, q) => acc + q.pesoTemporal, 0);

    const taxaAcerto = pesoTotal > 0 ? acertosPonderados / pesoTotal : 0;
    const taxaErro = pesoTotal > 0 ? errosPonderados / pesoTotal : 0;

    // Fórmula de peso adaptativa:
    // Base: 1.0
    // + Erro * 2.5 (foco em erros)
    // + Incerteza (poucas questões)
    // - Domínio (se acerta muito)
    const fatorErro = taxaErro * CONFIG.PESO_ERRO;
    const fatorIncerteza =
      questoesRespondidas < CONFIG.MIN_QUESTOES_PARA_CONFIANCA
        ? CONFIG.PESO_INCERTEZA *
          (1 - questoesRespondidas / CONFIG.MIN_QUESTOES_PARA_CONFIANCA)
        : 0;
    const fatorDominio = taxaAcerto > 0.85 ? -0.3 : 0; // Reduz se já domina

    const pesoBruto =
      CONFIG.PESO_NEUTRO + fatorErro + fatorIncerteza + fatorDominio;

    return {
      disciplina,
      peso: Math.max(0.3, pesoBruto), // Mínimo para não zerar
      pesoNormalizado: 0, // Calculado depois
      taxaErro,
      taxaAcerto,
      questoesRespondidas,
      tendencia: calcularTendencia(questoesComPeso),
      confianca: calcularConfianca(questoesRespondidas),
      ultimaRevisao:
        questoesComPeso.length > 0
          ? new Date(
              Math.max(...questoesComPeso.map((q) => new Date(q.id).getTime())),
            )
          : undefined,
    };
  });

  // Normalização para soma = número de disciplinas (média 1.0)
  const somaPesos = estatisticas.reduce((acc, e) => acc + e.peso, 0);
  const fatorNormalizacao = disciplinas.length / somaPesos;

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

  // Questões já vistas (para revisão inteligente)
  const questoesErradasAnteriormente = new Set(
    historico
      .flatMap((h) => h.questoes)
      .filter((q) => q.respostaUsuario && q.respostaUsuario !== q.resposta)
      .map((q) => q.id),
  );

  // Calcula distribuição proporcional
  let distribuicao = pesos.map((p) => ({
    disciplina: p.disciplina,
    quantidade: Math.floor(p.pesoNormalizado * (totalQuestoes / pesos.length)),
    peso: p.pesoNormalizado,
  }));

  // Ajusta para soma exata usando algoritmo de maior resto
  const totalCalculado = distribuicao.reduce((acc, d) => acc + d.quantidade, 0);
  const restante = totalQuestoes - totalCalculado;

  // Adiciona restante às disciplinas com maior parte decimal
  const comRestos = pesos
    .map((p, i) => ({
      index: i,
      resto: (p.pesoNormalizado * (totalQuestoes / pesos.length)) % 1,
      disciplina: p.disciplina,
    }))
    .sort((a, b) => b.resto - a.resto);

  for (let i = 0; i < restante; i++) {
    distribuicao[comRestos[i % comRestos.length].index].quantidade++;
  }

  // Garante mínimo por disciplina (evita zerar matérias)
  distribuicao = distribuicao.map((d) => ({
    ...d,
    quantidade: Math.max(d.quantidade, CONFIG.MIN_QUESTOES_POR_DISCIPLINA),
  }));

  // Reajusta se excedeu (remove do maior peso)
  while (
    distribuicao.reduce((acc, d) => acc + d.quantidade, 0) > totalQuestoes
  ) {
    const maior = distribuicao.reduce(
      (max, d, i) => (d.quantidade > distribuicao[max].quantidade ? i : max),
      0,
    );
    if (distribuicao[maior].quantidade > CONFIG.MIN_QUESTOES_POR_DISCIPLINA) {
      distribuicao[maior].quantidade--;
    } else {
      break; // Não consegue reduzir mais
    }
  }

  // Seleciona questões de cada disciplina
  const selecionadas: Questao[] = [];
  const metadados = {
    distribuicaoPorDisciplina: {} as Record<Disciplina, number>,
    novas: 0,
    revisao: 0,
  };

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

    // Prioridade: 1) Não vistas, 2) Erradas antes, 3) Certas antes (só se necessário)
    const qtdNovas = Math.min(
      Math.round(quantidade * CONFIG.PROPORCAO_NOVAS),
      naoVistas.length,
    );
    let restante = quantidade - qtdNovas;

    const qtdRevisao = Math.min(restante, vistasErradas.length);
    restante -= qtdRevisao;

    const qtdReforco = restante; // Questões certas, para variedade

    const selecionadasNovas = embaralhar(naoVistas).slice(0, qtdNovas);
    const selecionadasRevisao = embaralhar(vistasErradas).slice(0, qtdRevisao);
    const selecionadasReforco = embaralhar(vistasCertas).slice(0, qtdReforco);

    selecionadas.push(
      ...selecionadasNovas,
      ...selecionadasRevisao,
      ...selecionadasReforco,
    );

    metadados.distribuicaoPorDisciplina[disciplina] = quantidade;
    metadados.novas += qtdNovas;
    metadados.revisao += qtdRevisao;
  });

  // Embaralha final mantendo distribuição misturada
  const questoesFinais = embaralhar(selecionadas);

  // Calcula nível de adaptação (quanto se desviou da distribuição uniforme)
  const desvioPadrao = Math.sqrt(
    pesos.reduce((acc, p) => acc + Math.pow(p.pesoNormalizado - 1, 2), 0) /
      pesos.length,
  );
  const nivelAdaptacao = Math.min(desvioPadrao * 2, 1);

  return {
    questoes: questoesFinais,
    metadados: {
      distribuicaoPorDisciplina: metadados.distribuicaoPorDisciplina,
      percentualNovas: (metadados.novas / totalQuestoes) * 100,
      percentualRevisao: (metadados.revisao / totalQuestoes) * 100,
      disciplinasPriorizadas: pesos
        .filter((p) => p.pesoNormalizado > 1.3)
        .sort((a, b) => b.pesoNormalizado - a.pesoNormalizado)
        .map((p) => p.disciplina),
      nivelAdaptacao,
    },
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

  // Categorização
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

  // Gera recomendações textuais
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

  // Próximo milestone
  const proximoMilestone =
    pesos
      .filter((p) => p.taxaAcerto < 0.9 && p.confianca > 0.3)
      .sort((a, b) => b.taxaAcerto - a.taxaAcerto)[0] || null;

  // Resumo executivo
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

  // Confiança global
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

// ═══════════════════════════════════════════════════════════
// FUNÇÃO LEGACY (compatibilidade)
// ═══════════════════════════════════════════════════════════

/** @deprecated Use selecionarQuestoesAdaptativas com metadados */
export function selecionarQuestoesAdaptativasLegacy(
  todasQuestoes: Questao[],
  historico: HistoricoSimulado[],
  totalQuestoes: number = 60,
): Questao[] {
  return selecionarQuestoesAdaptativas(todasQuestoes, historico, totalQuestoes)
    .questoes;
}
