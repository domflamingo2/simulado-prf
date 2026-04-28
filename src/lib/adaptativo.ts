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
  // FIX: reduzido de 8 para 4 — disciplinas como Arquivologia aparecem
  // apenas 4x por simulado, nunca alcançariam confiança com limite 8.
  MIN_QUESTOES_PARA_CONFIANCA: 4,
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
// NOMES LEGÍVEIS DAS DISCIPLINAS
// FIX: centralizado aqui para usar nas recomendações — antes usava
// `disciplina.replace(/_/g, " ").toLowerCase()` que gerava "portugues"
// em vez de "Língua Portuguesa".
// ═══════════════════════════════════════════════════════════

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

function nomeDisciplina(disc: string): string {
  return DISCIPLINAS_NOME[disc] ?? disc.replace(/_/g, " ");
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

/**
 * FIX: clamp em 0–1 para evitar peso > 1 quando data for futura
 * (dado corrompido). `dias` negativo → `exp > 1` infla o peso artificialmente.
 */
function calcularDecaimentoTemporal(dataSimuladoISO: string): number {
  const dias =
    (Date.now() - new Date(dataSimuladoISO).getTime()) / (1000 * 60 * 60 * 24);
  // dias negativos (data futura) → clamp para 0 dias → peso = 1
  const diasPositivos = Math.max(0, dias);
  return Math.exp(-diasPositivos / CONFIG.MEIA_VIDA_DIAS);
}

/**
 * Calcula tendência dividindo as questões cronologicamente.
 *
 * FIX: recebe questões já ordenadas cronologicamente pelo chamador.
 * A função não assume ordem — usa o índice de posição no array recebido
 * como proxy de tempo, o que é válido se o chamador ordena por data.
 */
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

// ═══════════════════════════════════════════════════════════
// CÁLCULO DE PESOS ADAPTATIVOS
// ═══════════════════════════════════════════════════════════

export function calcularPesosAdaptativos(
  historico: HistoricoSimulado[],
  _todasQuestoes: Questao[], // FIX: prefixado com _ pois era usado apenas em código morto
): PesoDisciplina[] {
  // FIX: removido `totalPorDisciplina` que era calculado mas nunca usado
  // (era código morto que executava um reduce completo sem propósito)

  // Ordena histórico cronologicamente para que calcularTendencia funcione corretamente
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
      // Dificuldade percebida para disciplinas sem histórico
      const dificuldadePercebida: Record<string, number> = {
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
  totalQuestoes = 60,
): SelecaoAdaptativaResult {
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

  // ── Distribuição proporcional ──────────────────────────────────────────────

  // Calcula quantidades brutas
  const quantidades = pesos.map((p) =>
    Math.max(
      CONFIG.MIN_QUESTOES_POR_DISCIPLINA,
      Math.floor(p.pesoNormalizado * (totalQuestoes / pesos.length)),
    ),
  );

  // Ajusta diferença com o total alvo usando algoritmo de maior resto
  const totalCalculado = quantidades.reduce((a, b) => a + b, 0);
  let diferenca = totalQuestoes - totalCalculado;

  if (diferenca !== 0) {
    // Calcula restos para saber onde arredondar para cima/baixo
    const restos = pesos.map((p, i) => {
      const bruto = p.pesoNormalizado * (totalQuestoes / pesos.length);
      return {
        index: i,
        resto: bruto - Math.floor(bruto),
        // Para redução: prioriza remover dos maiores acima do mínimo
        quantidade: quantidades[i],
      };
    });

    if (diferenca > 0) {
      // Falta questões — adiciona nos de maior resto
      restos
        .sort((a, b) => b.resto - a.resto)
        .slice(0, diferenca)
        .forEach(({ index }) => quantidades[index]++);
    } else {
      // Sobra questões — remove dos de menor resto que estão acima do mínimo
      // FIX: O(1) por passo — sem loop while com safetyCounter
      restos
        .filter((r) => r.quantidade > CONFIG.MIN_QUESTOES_POR_DISCIPLINA)
        .sort((a, b) => a.resto - b.resto)
        .slice(0, Math.abs(diferenca))
        .forEach(({ index }) => quantidades[index]--);

      // Se ainda sobra (todas no mínimo), corta dos maiores
      const totalAjustado = quantidades.reduce((a, b) => a + b, 0);
      if (totalAjustado > totalQuestoes) {
        const excesso = totalAjustado - totalQuestoes;
        restos
          .sort((a, b) => b.quantidade - a.quantidade)
          .slice(0, excesso)
          .forEach(({ index }) => {
            if (quantidades[index] > 0) quantidades[index]--;
          });
      }
    }
  }

  // ── Seleção por disciplina ─────────────────────────────────────────────────

  const selecionadas: Questao[] = [];
  let novasCount = 0;
  let revisaoCount = 0;

  pesos.forEach((p, i) => {
    const quantidade = quantidades[i];
    if (quantidade === 0) return;

    const questoesDisciplina = todasQuestoes.filter(
      (q) => q.disciplina === p.disciplina,
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

    const qtdReforco = Math.min(restante, vistasCertas.length);
    restante -= qtdReforco;

    // FIX: fallback quando os três pools não cobrem `quantidade`
    // (ex: banco de questões muito pequeno para a disciplina).
    // Reutiliza questões já vistas em vez de simplesmente não incluir.
    const qtdFallback = restante > 0 ? restante : 0;

    const selecionadasNovas = embaralhar(naoVistas).slice(0, qtdNovas);
    const selecionadasRevisao = embaralhar(vistasErradas).slice(0, qtdRevisao);
    const selecionadasReforco = embaralhar(vistasCertas).slice(0, qtdReforco);

    // Fallback: questões aleatórias da disciplina (qualquer pool)
    const selecionadasFallback =
      qtdFallback > 0
        ? embaralhar(questoesDisciplina)
            .filter(
              (q) =>
                !selecionadasNovas.some((s) => s.id === q.id) &&
                !selecionadasRevisao.some((s) => s.id === q.id) &&
                !selecionadasReforco.some((s) => s.id === q.id),
            )
            .slice(0, qtdFallback)
        : [];

    selecionadas.push(
      ...selecionadasNovas,
      ...selecionadasRevisao,
      ...selecionadasReforco,
      ...selecionadasFallback,
    );

    novasCount += qtdNovas;
    revisaoCount += qtdRevisao;
  });

  const questoesFinais = embaralhar(selecionadas);
  const totalFinal = questoesFinais.length;

  // FIX: guard contra divisão por zero em percentuais
  const percentualNovas = totalFinal > 0 ? (novasCount / totalFinal) * 100 : 0;
  const percentualRevisao =
    totalFinal > 0 ? (revisaoCount / totalFinal) * 100 : 0;

  // Nível de adaptação: desvio padrão normalizado dos pesos
  const somaDiferencasQuadradas = pesos.reduce(
    (acc, p) => acc + (p.pesoNormalizado - 1) ** 2,
    0,
  );
  const nivelAdaptacao = Math.min(
    Math.sqrt(somaDiferencasQuadradas / pesos.length) * 2,
    1,
  );

  const metadados: SelecaoAdaptativaResult["metadados"] = {
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

  return { questoes: questoesFinais, metadados };
}

// ═══════════════════════════════════════════════════════════
// ANÁLISE E RECOMENDAÇÕES
// ═══════════════════════════════════════════════════════════

export function gerarAnaliseAdaptativa(
  historico: HistoricoSimulado[],
  todasQuestoes: Questao[],
): AnaliseAdaptativa {
  const pesos = calcularPesosAdaptativos(historico, todasQuestoes);

  // FIX: todos os sorts abaixo usam [...array].sort() — não mutam `pesos`
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

  // ── Recomendações com nomes legíveis ──────────────────────────────────────

  const recomendacoes: string[] = [];

  if (criticas.length > 0) {
    // FIX: usa nomeDisciplina() em vez de replace(/_/g, " ").toLowerCase()
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

  // ── Próximo milestone ─────────────────────────────────────────────────────
  // FIX: usa [...].sort() para não mutar `pesos`

  const proximoMilestoneItem =
    [...pesos]
      .filter((p) => p.taxaAcerto < 0.9 && p.confianca > 0.3)
      .sort((a, b) => b.taxaAcerto - a.taxaAcerto)[0] ?? null;

  // ── Distribuição sugerida ─────────────────────────────────────────────────
  // FIX: retorna cópia ordenada — não muta `pesos` original

  const distribuicaoSugerida = [...pesos].sort(
    (a, b) => b.pesoNormalizado - a.pesoNormalizado,
  );

  // ── Resumo ────────────────────────────────────────────────────────────────

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
 * Este wrapper existe apenas para compatibilidade com chamadas legadas.
 */
export function selecionarQuestoesAdaptativasLegacy(
  todasQuestoes: Questao[],
  historico: HistoricoSimulado[],
  totalQuestoes = 60,
): Questao[] {
  return selecionarQuestoesAdaptativas(todasQuestoes, historico, totalQuestoes)
    .questoes;
}
