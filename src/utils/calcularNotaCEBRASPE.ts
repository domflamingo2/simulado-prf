// src/utils/calcularNotaCEBRASPE.ts

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

export type ClassificacaoLabel =
  | "Excelente"
  | "Bom"
  | "Regular"
  | "Risco"
  | "Reprovado";
export type ChancesLabel = "Alta" | "Média" | "Baixa" | "Crítica";

export interface NotaCEBRASPE {
  acertos: number;
  erros: number;
  brancos: number;
  notaFinal: number;
  porcentagemAcertos: number;
  porcentagemErros: number;
  porcentagemBrancos: number;
  classificacao: ClassificacaoLabel;
  mensagem: string;
  cor: string;
  dicas: string[];
  estatisticas: {
    /** Mínimo de acertos que o usuário precisaria ter (com os erros atuais) para aprovação */
    acertosNecessariosParaAprovacao: number;
    notaMinimaAprovacao: number;
    chances: ChancesLabel;
  };
}

export interface OpcoesCalculo {
  totalQuestoes?: number;
  notaMinimaAprovacao?: number;
}

// ═══════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════

export const CLASSIFICACOES = {
  EXCELENTE: {
    label: "Excelente" as ClassificacaoLabel,
    cor: "text-purple-400",
    corBarra: "bg-purple-500",
  },
  BOM: {
    label: "Bom" as ClassificacaoLabel,
    cor: "text-blue-400",
    corBarra: "bg-blue-500",
  },
  REGULAR: {
    label: "Regular" as ClassificacaoLabel,
    cor: "text-yellow-400",
    corBarra: "bg-yellow-500",
  },
  RISCO: {
    label: "Risco" as ClassificacaoLabel,
    cor: "text-orange-400",
    corBarra: "bg-orange-500",
  },
  REPROVADO: {
    label: "Reprovado" as ClassificacaoLabel,
    cor: "text-rose-400",
    corBarra: "bg-rose-500",
  },
} as const;

// Limiares relativos à nota mínima de aprovação (NM).
// Centralizar aqui evita que `calcularNotaCEBRASPE` e testes
// usem números mágicos divergentes.
const LIMIARES = {
  EXCELENTE: 1.28, // ≥ 128% da NM
  BOM: 1.0, // ≥ 100% da NM (aprovado)
  REGULAR: 0.71, // ≥  71% da NM
  RISCO: 0.43, // ≥  43% da NM
  // abaixo → Reprovado
} as const;

// ═══════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function calcularNotaCEBRASPE(
  acertos: number,
  erros: number,
  opcoes: OpcoesCalculo = {},
): NotaCEBRASPE {
  const { totalQuestoes = 60, notaMinimaAprovacao = 35 } = opcoes;

  // FIX: notaMinimaAprovacao e totalQuestoes também precisam ser sanitizados —
  // um chamador pode passar NaN ou valor negativo via `opcoes`.
  const totalVal =
    Number.isFinite(totalQuestoes) && totalQuestoes > 0
      ? Math.floor(totalQuestoes)
      : 60;
  const notaMinimaVal =
    Number.isFinite(notaMinimaAprovacao) && notaMinimaAprovacao > 0
      ? notaMinimaAprovacao
      : 35;

  // ── Validação e normalização dos inputs ──────────────────────────────────

  const sanitizar = (valor: number, nome: string): number => {
    if (!Number.isFinite(valor) || valor < 0) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[calcularNotaCEBRASPE] Valor inválido para ${nome}: ${valor}. Usando 0.`,
        );
      }
      return 0;
    }
    return Math.floor(valor);
  };

  const acertosRaw = sanitizar(acertos, "acertos");
  const errosRaw = sanitizar(erros, "erros");

  // Escala proporcional se acertos + erros ultrapassar o total
  const totalRespondido = acertosRaw + errosRaw;
  let acertosVal: number;
  let errosVal: number;

  if (totalRespondido > totalVal) {
    const fator = totalVal / totalRespondido;
    acertosVal = Math.floor(acertosRaw * fator);
    errosVal = Math.floor(errosRaw * fator);
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[calcularNotaCEBRASPE] acertos+erros (${totalRespondido}) > totalQuestoes (${totalVal}). Escalado proporcionalmente.`,
      );
    }
  } else {
    acertosVal = acertosRaw;
    errosVal = errosRaw;
  }

  const brancos = totalVal - acertosVal - errosVal;
  // FIX: nota CEBRASPE pode ser negativa — não clampar aqui.
  // A exibição (formatarNotaParaExibicao) já faz o clamp para a barra.
  const notaFinal = acertosVal - errosVal;

  // ── Percentuais ───────────────────────────────────────────────────────────

  const porcentagemAcertos = (acertosVal / totalVal) * 100;
  const porcentagemErros = (errosVal / totalVal) * 100;
  const porcentagemBrancos = (brancos / totalVal) * 100;

  // ── Classificação ─────────────────────────────────────────────────────────

  type ClassEntry = {
    config: (typeof CLASSIFICACOES)[keyof typeof CLASSIFICACOES];
    mensagem: string;
    dicas: string[];
    chances: ChancesLabel;
  };

  const resolverClassificacao = (): ClassEntry => {
    if (notaFinal >= notaMinimaVal * LIMIARES.EXCELENTE) {
      return {
        config: CLASSIFICACOES.EXCELENTE,
        mensagem:
          "🎉 Parabéns! Você está muito acima da média. Continue assim!",
        chances: "Alta",
        dicas: [
          "Mantenha o ritmo de estudos",
          "Ajude outros estudantes compartilhando suas técnicas",
          "Faça simulados completos para manter o desempenho",
        ],
      };
    }
    if (notaFinal >= notaMinimaVal * LIMIARES.BOM) {
      return {
        config: CLASSIFICACOES.BOM,
        mensagem:
          "✅ Bom desempenho! Você está no caminho certo para a aprovação.",
        chances: "Alta",
        dicas: [
          "Foque nas disciplinas com menor pontuação",
          "Revise os erros cometidos neste simulado",
          "Mantenha a consistência nos estudos diários",
        ],
      };
    }
    if (notaFinal >= notaMinimaVal * LIMIARES.REGULAR) {
      return {
        config: CLASSIFICACOES.REGULAR,
        mensagem:
          "📊 Desempenho regular. Com ajustes estratégicos você chega lá!",
        chances: "Média",
        dicas: [
          "Identifique suas disciplinas mais fracas",
          "Dedique mais tempo à teoria antes de novos simulados",
          "Crie um cronograma de revisão espaçada",
        ],
      };
    }
    if (notaFinal >= notaMinimaVal * LIMIARES.RISCO) {
      return {
        config: CLASSIFICACOES.RISCO,
        mensagem:
          "⚠️ Você está na zona de risco. É hora de intensificar os estudos!",
        chances: "Baixa",
        dicas: [
          "Reveja toda a teoria desde o básico",
          "Faça questões por disciplina separadamente",
          "Busque grupos de estudo ou mentoria",
          "Aumente sua carga horária de estudos gradualmente",
        ],
      };
    }
    return {
      config: CLASSIFICACOES.REPROVADO,
      mensagem: "🔴 É preciso melhorar significativamente. Não desista!",
      chances: "Crítica",
      dicas: [
        "Recomece pelos fundamentos de cada disciplina",
        "Assista videoaulas das matérias base",
        "Faça resumos e mapas mentais",
        "Considere um curso preparatório estruturado",
        "Estabeleça metas realistas e mensuráveis",
      ],
    };
  };

  const { config, mensagem, dicas, chances } = resolverClassificacao();

  // ── Acertos necessários para aprovação ────────────────────────────────────
  // Fórmula: nota = acertos - erros >= notaMinima → acertos >= notaMinima + erros
  const acertosNecessariosParaAprovacao = Math.min(
    totalVal,
    Math.max(0, notaMinimaVal + errosVal),
  );

  return {
    acertos: acertosVal,
    erros: errosVal,
    brancos,
    notaFinal,
    porcentagemAcertos,
    porcentagemErros,
    porcentagemBrancos,
    classificacao: config.label,
    mensagem,
    cor: config.cor,
    dicas,
    estatisticas: {
      acertosNecessariosParaAprovacao,
      notaMinimaAprovacao: notaMinimaVal,
      chances,
    },
  };
}

// ═══════════════════════════════════════════════════════════
// CÁLCULO POR RESPOSTAS INDIVIDUAIS
// ═══════════════════════════════════════════════════════════

export interface RespostaQuestao {
  id: string;
  disciplina: string;
  acertou: boolean;
  respondeu: boolean;
}

export interface DisciplinaStats {
  acertos: number;
  erros: number;
  total: number;
  porcentagem: number;
}

export interface NotaCEBRASPEDetalhada extends NotaCEBRASPE {
  porDisciplina: Record<string, DisciplinaStats>;
}

export function calcularNotaPorRespostas(
  respostas: RespostaQuestao[],
  opcoes?: OpcoesCalculo,
): NotaCEBRASPEDetalhada {
  if (respostas.length === 0) {
    const notaZerada = calcularNotaCEBRASPE(0, 0, opcoes);
    return { ...notaZerada, porDisciplina: {} };
  }

  const totalQuestoes = respostas.length;
  const acertos = respostas.filter((r) => r.acertou).length;
  // FIX: `respondeu && !acertou` é correto para CEBRASPE — branco não penaliza.
  // Mas garante também que `acertou` não seja true junto com `!respondeu`
  // (estado inconsistente): acertou implica respondeu.
  const erros = respostas.filter((r) => r.respondeu && !r.acertou).length;

  const porDisciplina: Record<string, DisciplinaStats> = {};

  for (const r of respostas) {
    if (!porDisciplina[r.disciplina]) {
      porDisciplina[r.disciplina] = {
        acertos: 0,
        erros: 0,
        total: 0,
        porcentagem: 0,
      };
    }
    const s = porDisciplina[r.disciplina];
    s.total++;
    if (r.acertou) s.acertos++;
    else if (r.respondeu) s.erros++;
  }

  for (const s of Object.values(porDisciplina)) {
    s.porcentagem = s.total > 0 ? (s.acertos / s.total) * 100 : 0;
  }

  const notaGeral = calcularNotaCEBRASPE(acertos, erros, {
    ...opcoes,
    totalQuestoes,
  });

  return { ...notaGeral, porDisciplina };
}

// ═══════════════════════════════════════════════════════════
// ANÁLISE DETALHADA
// ═══════════════════════════════════════════════════════════

export interface AnaliseDetalhada {
  nota: NotaCEBRASPE;
  pontosFortes: string[];
  pontosFracos: string[];
  recomendacoes: string[];
  previsao: {
    horasEstudoDiarias: number;
    /** `null` quando o usuário já está aprovado */
    semanasParaAprovacao: number | null;
    simuladosNecessarios: number;
  };
}

export function gerarAnaliseDetalhada(
  acertos: number,
  erros: number,
  horasEstudoDiarias = 4,
  opcoes?: OpcoesCalculo,
): AnaliseDetalhada {
  const horasValidas = Math.max(
    0.5,
    Number.isFinite(horasEstudoDiarias) ? horasEstudoDiarias : 4,
  );

  const nota = calcularNotaCEBRASPE(acertos, erros, opcoes);
  const pontosFortes: string[] = [];
  const pontosFracos: string[] = [];
  const recomendacoes: string[] = [...nota.dicas];

  // ── Análise qualitativa ───────────────────────────────────────────────────

  if (nota.porcentagemAcertos >= 70) {
    pontosFortes.push("Ótimo aproveitamento geral");
  } else if (nota.porcentagemAcertos >= 50) {
    pontosFortes.push("Aproveitamento mediano com margem de evolução");
  } else {
    pontosFracos.push("Aproveitamento geral abaixo do esperado");
  }

  if (nota.porcentagemErros > 30) {
    pontosFracos.push("Alto índice de erros — cuidado com chutes");
    recomendacoes.push(
      "Evite responder quando a dúvida for total; em branco não penaliza",
    );
  }

  if (nota.porcentagemBrancos > 20) {
    pontosFracos.push("Muitas questões em branco");
    recomendacoes.push("Gerencie melhor seu tempo durante a prova");
  }

  if (nota.notaFinal >= nota.estatisticas.notaMinimaAprovacao) {
    pontosFortes.push("Nota acima da mínima de aprovação");
  }

  // ── Previsão ──────────────────────────────────────────────────────────────

  const deficitNota = nota.estatisticas.notaMinimaAprovacao - nota.notaFinal;

  let semanasParaAprovacao: number | null = null;
  let simuladosNecessarios = 5;

  if (deficitNota > 0) {
    // Estimativa: +5 pontos por semana com 4h/dia; escala linear com as horas.
    const semanasBruto = Math.ceil((deficitNota / 5) * (4 / horasValidas));
    semanasParaAprovacao = Math.max(1, semanasBruto);
    simuladosNecessarios = Math.max(5, Math.ceil(semanasParaAprovacao / 2));
  }

  return {
    nota,
    pontosFortes,
    pontosFracos,
    recomendacoes: [...new Set(recomendacoes)],
    previsao: {
      horasEstudoDiarias: horasValidas,
      semanasParaAprovacao,
      simuladosNecessarios,
    },
  };
}

// ═══════════════════════════════════════════════════════════
// FORMATAÇÃO PARA EXIBIÇÃO
// ═══════════════════════════════════════════════════════════

export interface NotaFormatada {
  resumo: string;
  barraProgresso: { width: string; cor: string };
  textoClassificacao: string;
}

/**
 * @param nota           - Resultado de `calcularNotaCEBRASPE`
 * @param totalQuestoes  - Total da prova (necessário para calcular % da barra).
 *                         Padrão 60; passe o valor correto para modos como Turbo (50).
 */
export function formatarNotaParaExibicao(
  nota: NotaCEBRASPE,
  totalQuestoes = 60,
): NotaFormatada {
  // Única fonte de verdade para a cor da barra — derivada de CLASSIFICACOES
  const corBarra =
    Object.values(CLASSIFICACOES).find((c) => c.label === nota.classificacao)
      ?.corBarra ?? "bg-slate-500";

  // FIX: totalQuestoes pode ser 0 se vier de um estado inválido — guard explícito
  const percentualNota =
    totalQuestoes > 0
      ? Math.min(100, Math.max(0, (nota.notaFinal / totalQuestoes) * 100))
      : 0;

  // FIX: nota negativa no resumo agora exibe sinal corretamente porque
  // `notaFinal` não é clampado em `calcularNotaCEBRASPE`.
  return {
    resumo: `${nota.acertos} acertos, ${nota.erros} erros, ${nota.brancos} em branco = ${nota.notaFinal} pontos`,
    barraProgresso: {
      width: `${percentualNota}%`,
      cor: corBarra,
    },
    textoClassificacao: `${nota.classificacao} — ${nota.mensagem}`,
  };
}

// ═══════════════════════════════════════════════════════════
// UTILITÁRIOS
// ═══════════════════════════════════════════════════════════

/**
 * Verifica se a soma acertos + erros + brancos é consistente com o total.
 */
export function validarTotalQuestoes(
  acertos: number,
  erros: number,
  brancos: number,
  total = 60,
): boolean {
  return (
    Number.isInteger(acertos) &&
    Number.isInteger(erros) &&
    Number.isInteger(brancos) &&
    acertos >= 0 &&
    erros >= 0 &&
    brancos >= 0 &&
    acertos + erros + brancos === total
  );
}

/**
 * Calcula o mínimo de acertos necessário para aprovação dado um número
 * de erros já cometidos.
 *
 * Fórmula CEBRASPE: nota = acertos - erros >= notaMinima
 * → acertos >= notaMinima + erros
 */
export function calcularAcertosNecessarios(
  erros: number,
  notaMinimaAprovacao = 35,
  totalQuestoes = 60,
): number {
  // FIX: guard para inputs inválidos — evita NaN silencioso
  if (!Number.isFinite(erros) || erros < 0) return notaMinimaAprovacao;
  return Math.min(totalQuestoes, Math.max(0, notaMinimaAprovacao + erros));
}
