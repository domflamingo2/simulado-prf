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
// CONSTANTES — fonte de verdade dos limiares
// FIX: limiares usados diretamente na função de classificação
// para evitar duplicação que pode divergir.
// Os valores são proporções de `notaMinimaAprovacao`, não absolutos.
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

// ═══════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function calcularNotaCEBRASPE(
  acertos: number,
  erros: number,
  opcoes: OpcoesCalculo = {},
): NotaCEBRASPE {
  const { totalQuestoes = 60, notaMinimaAprovacao = 35 } = opcoes;

  // ── Validação e normalização ──────────────────────────────────────────────

  const sanitizar = (valor: number, nome: string): number => {
    if (!Number.isFinite(valor) || valor < 0) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[calcularNotaCEBRASPE] Valor inválido para ${nome}: ${valor}. Usando 0.`,
        );
      }
      return 0;
    }
    return Math.floor(valor); // Garante inteiro
  };

  const acertosRaw = sanitizar(acertos, "acertos");
  const errosRaw = sanitizar(erros, "erros");

  // FIX: garante que acertos + erros não ultrapasse totalQuestoes.
  // Se ultrapassar, escala proporcionalmente.
  const totalRespondido = acertosRaw + errosRaw;
  let acertosVal: number;
  let errosVal: number;

  if (totalRespondido > totalQuestoes) {
    // Escala proporcional para caber no total
    const fator = totalQuestoes / totalRespondido;
    acertosVal = Math.floor(acertosRaw * fator);
    errosVal = Math.floor(errosRaw * fator);
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[calcularNotaCEBRASPE] acertos+erros (${totalRespondido}) > totalQuestoes (${totalQuestoes}). Escalado proporcionalmente.`,
      );
    }
  } else {
    acertosVal = acertosRaw;
    errosVal = errosRaw;
  }

  const brancos = totalQuestoes - acertosVal - errosVal;
  const notaFinal = acertosVal - errosVal;

  // ── Percentuais (taxa de acerto real, não nota CEBRASPE) ──────────────────

  const porcentagemAcertos =
    totalQuestoes > 0 ? (acertosVal / totalQuestoes) * 100 : 0;
  const porcentagemErros =
    totalQuestoes > 0 ? (errosVal / totalQuestoes) * 100 : 0;
  const porcentagemBrancos =
    totalQuestoes > 0 ? (brancos / totalQuestoes) * 100 : 0;

  // ── Classificação ─────────────────────────────────────────────────────────
  // FIX: limiares relativos a `notaMinimaAprovacao`, não absolutos.
  // Isso garante que a classificação faz sentido independente do total de questões.
  //
  // Limiares usados (em função de notaMinimaAprovacao = NM):
  //   Excelente : notaFinal >= NM * 1.28  (≈28% acima da mínima)
  //   Bom       : notaFinal >= NM          (aprovado)
  //   Regular   : notaFinal >= NM * 0.71  (≈71% da mínima)
  //   Risco     : notaFinal >= NM * 0.43  (≈43% da mínima)
  //   Reprovado : abaixo de tudo

  type ClassEntry = {
    config: (typeof CLASSIFICACOES)[keyof typeof CLASSIFICACOES];
    mensagem: string;
    dicas: string[];
    chances: ChancesLabel;
  };

  const resolverClassificacao = (): ClassEntry => {
    if (notaFinal >= notaMinimaAprovacao * 1.28) {
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
    if (notaFinal >= notaMinimaAprovacao) {
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
    if (notaFinal >= notaMinimaAprovacao * 0.71) {
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
    if (notaFinal >= notaMinimaAprovacao * 0.43) {
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
  // FIX: fórmula correta para CEBRASPE.
  // nota = acertos - erros >= notaMinima
  // → acertos >= notaMinima + erros
  // Logo: acertosNecessarios = notaMinimaAprovacao + errosVal
  const acertosNecessariosParaAprovacao = Math.min(
    totalQuestoes,
    Math.max(0, notaMinimaAprovacao + errosVal),
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
      notaMinimaAprovacao,
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

/**
 * FIX: interface dedicada em vez de `NotaCEBRASPE & { ... }` intersection.
 * FIX: guard para lista vazia — evita divisão por zero.
 */
export function calcularNotaPorRespostas(
  respostas: RespostaQuestao[],
  opcoes?: OpcoesCalculo,
): NotaCEBRASPEDetalhada {
  // FIX: lista vazia → retorna nota zerada com disciplinas vazias
  if (respostas.length === 0) {
    const notaZerada = calcularNotaCEBRASPE(0, 0, opcoes);
    return { ...notaZerada, porDisciplina: {} };
  }

  const totalQuestoes = respostas.length;
  const acertos = respostas.filter((r) => r.acertou).length;
  const erros = respostas.filter((r) => r.respondeu && !r.acertou).length;

  // Stats por disciplina
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
    /** null quando o usuário já está aprovado */
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
  // FIX: guard para horasEstudoDiarias inválido
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

  // FIX: se já aprovado, não há semanas para aprovação
  let semanasParaAprovacao: number | null = null;
  let simuladosNecessarios = 5; // mínimo recomendado mesmo estando aprovado

  if (deficitNota > 0) {
    // Estimativa: ganhar ~5 pontos por semana com 4h/dia de estudo.
    // Ajusta pelo fator de horas: mais horas → menos semanas.
    const semanasBruto = Math.ceil((deficitNota / 5) * (4 / horasValidas));
    semanasParaAprovacao = Math.max(1, semanasBruto);
    // Um simulado a cada 2 semanas como referência
    simuladosNecessarios = Math.max(5, Math.ceil(semanasParaAprovacao / 2));
  }

  return {
    nota,
    pontosFortes,
    pontosFracos,
    // FIX: deduplicação de recomendações com Set
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
 * FIX: recebe `totalQuestoes` como parâmetro explícito — antes usava 60
 * hardcoded, gerando percentuais errados para modos com total diferente (ex: Turbo = 50).
 * FIX: usa `CLASSIFICACOES` para mapear cor da barra — sem duplicação.
 */
export function formatarNotaParaExibicao(
  nota: NotaCEBRASPE,
  totalQuestoes = 60,
): NotaFormatada {
  // FIX: mapa derivado de CLASSIFICACOES — única fonte de verdade para cores
  const corBarra =
    Object.values(CLASSIFICACOES).find((c) => c.label === nota.classificacao)
      ?.corBarra ?? "bg-slate-500";

  // Percentual da nota CEBRASPE: (notaFinal / totalQuestoes) * 100
  // notaFinal pode ser negativo → clamp em [0, 100]
  const percentualNota =
    totalQuestoes > 0
      ? Math.min(100, Math.max(0, (nota.notaFinal / totalQuestoes) * 100))
      : 0;

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
 * Calcula a pontuação mínima de acertos necessária para aprovação,
 * dado um número de erros já cometidos.
 *
 * Fórmula CEBRASPE: nota = acertos - erros >= notaMinima
 * → acertos >= notaMinima + erros
 */
export function calcularAcertosNecessarios(
  erros: number,
  notaMinimaAprovacao = 35,
  totalQuestoes = 60,
): number {
  return Math.min(totalQuestoes, Math.max(0, notaMinimaAprovacao + erros));
}
