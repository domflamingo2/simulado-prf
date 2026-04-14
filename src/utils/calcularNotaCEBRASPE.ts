// src/utils/calcularNotaCEBRASPE.ts (VERSÃO OTIMIZADA)

export interface NotaCEBRASPE {
  acertos: number;
  erros: number;
  brancos: number;
  notaFinal: number;
  porcentagemAcertos: number;
  porcentagemErros: number;
  porcentagemBrancos: number;
  classificacao: "Excelente" | "Bom" | "Regular" | "Risco" | "Reprovado";
  mensagem: string;
  cor: string;
  dicas: string[];
  estatisticas: {
    mediaNecessaria: number;
    notaMinimaAprovacao: number;
    chances: "Alta" | "Média" | "Baixa" | "Crítica";
  };
}

export interface OpcoesCalculo {
  totalQuestoes?: number;
  notaMinimaAprovacao?: number;
}

export function calcularNotaCEBRASPE(
  acertos: number,
  erros: number,
  opcoes: OpcoesCalculo = {}
): NotaCEBRASPE {
  const { totalQuestoes = 60, notaMinimaAprovacao = 35 } = opcoes;
  
  // Validações de entrada
  const validarInput = (valor: number, nome: string): number => {
    if (isNaN(valor) || valor < 0) {
      console.warn(`Valor inválido para ${nome}: ${valor}, usando 0`);
      return 0;
    }
    return Math.min(valor, totalQuestoes);
  };

  const acertosValidados = validarInput(acertos, "acertos");
  const errosValidados = validarInput(erros, "erros");
  
  // Calcular brancos (garantindo que não ultrapasse o total)
  const brancos = Math.max(0, totalQuestoes - acertosValidados - errosValidados);
  
  const notaFinal = acertosValidados - errosValidados;
  const porcentagemAcertos = (acertosValidados / totalQuestoes) * 100;
  const porcentagemErros = (errosValidados / totalQuestoes) * 100;
  const porcentagemBrancos = (brancos / totalQuestoes) * 100;

  // Classificação baseada na nota final e contexto do concurso
  let classificacao: NotaCEBRASPE["classificacao"];
  let mensagem: string;
  let cor: string;
  let dicas: string[] = [];
  let chances: NotaCEBRASPE["estatisticas"]["chances"];

  if (notaFinal >= 45) {
    classificacao = "Excelente";
    mensagem = "🎉 Parabéns! Você está muito acima da média. Continue assim!";
    cor = "text-purple-400";
    chances = "Alta";
    dicas = [
      "Mantenha o ritmo de estudos",
      "Ajude outros estudantes compartilhando suas técnicas",
      "Faça simulados completos para manter o desempenho",
    ];
  } else if (notaFinal >= notaMinimaAprovacao) {
    classificacao = "Bom";
    mensagem = "✅ Bom desempenho! Você está no caminho certo para a aprovação.";
    cor = "text-blue-400";
    chances = "Alta";
    dicas = [
      "Foque nas disciplinas com menor pontuação",
      "Revise os erros cometidos neste simulado",
      "Mantenha a consistência nos estudos diários",
    ];
  } else if (notaFinal >= 25) {
    classificacao = "Regular";
    mensagem = "📊 Desempenho regular. Com ajustes estratégicos você chega lá!";
    cor = "text-yellow-400";
    chances = "Média";
    dicas = [
      "Identifique suas disciplinas mais fracas",
      "Dedique mais tempo à teoria antes de novos simulados",
      "Crie um cronograma de revisão espaçada",
    ];
  } else if (notaFinal >= 15) {
    classificacao = "Risco";
    mensagem = "⚠️ Você está na zona de risco. É hora de intensificar os estudos!";
    cor = "text-orange-400";
    chances = "Baixa";
    dicas = [
      "Reveja toda a teoria desde o básico",
      "Faça questões por disciplina separadamente",
      "Busque grupos de estudo ou mentoria",
      "Aumente sua carga horária de estudos gradualmente",
    ];
  } else {
    classificacao = "Reprovado";
    mensagem = "🔴 É preciso melhorar significativamente. Não desista!";
    cor = "text-rose-400";
    chances = "Crítica";
    dicas = [
      "Recomece pelos fundamentos de cada disciplina",
      "Assista videoaulas das matérias base",
      "Faça resumos e mapas mentais",
      "Considere um curso preparatório estruturado",
      "Estabeleça metas realistas e mensuráveis",
    ];
  }

  // Calcular média necessária para aprovação
  const acertosNecessarios = Math.ceil((notaMinimaAprovacao + errosValidados) / 2);
  const mediaNecessaria = Math.max(0, Math.min(totalQuestoes, acertosNecessarios));

  return {
    acertos: acertosValidados,
    erros: errosValidados,
    brancos,
    notaFinal,
    porcentagemAcertos,
    porcentagemErros,
    porcentagemBrancos,
    classificacao,
    mensagem,
    cor,
    dicas,
    estatisticas: {
      mediaNecessaria,
      notaMinimaAprovacao,
      chances,
    },
  };
}

// Função para calcular nota com base em respostas individuais
export interface RespostaQuestao {
  id: string;
  disciplina: string;
  acertou: boolean;
  respondeu: boolean;
}

export function calcularNotaPorRespostas(
  respostas: RespostaQuestao[],
  opcoes?: OpcoesCalculo
): NotaCEBRASPE & { porDisciplina: Record<string, { acertos: number; erros: number; total: number; porcentagem: number }> } {
  const totalQuestoes = respostas.length;
  
  const acertos = respostas.filter(r => r.acertou).length;
  const erros = respostas.filter(r => r.respondeu && !r.acertou).length;
  
  // Calcular por disciplina
  const porDisciplina: Record<string, { acertos: number; erros: number; total: number; porcentagem: number }> = {};
  
  respostas.forEach(resposta => {
    if (!porDisciplina[resposta.disciplina]) {
      porDisciplina[resposta.disciplina] = { acertos: 0, erros: 0, total: 0, porcentagem: 0 };
    }
    
    porDisciplina[resposta.disciplina].total++;
    if (resposta.acertou) {
      porDisciplina[resposta.disciplina].acertos++;
    } else if (resposta.respondeu) {
      porDisciplina[resposta.disciplina].erros++;
    }
  });
  
  // Calcular porcentagens
  Object.keys(porDisciplina).forEach(disciplina => {
    const stats = porDisciplina[disciplina];
    stats.porcentagem = (stats.acertos / stats.total) * 100;
  });
  
  const notaGeral = calcularNotaCEBRASPE(acertos, erros, { ...opcoes, totalQuestoes });
  
  return {
    ...notaGeral,
    porDisciplina,
  };
}

// Função para gerar análise detalhada
export interface AnaliseDetalhada {
  nota: NotaCEBRASPE;
  pontosFortes: string[];
  pontosFracos: string[];
  recomendacoes: string[];
  previsao: {
    horasEstudoDiarias: number;
    semanasParaAprovacao: number;
    simuladosNecessarios: number;
  };
}

export function gerarAnaliseDetalhada(
  acertos: number,
  erros: number,
  horasEstudoDiarias: number = 4
): AnaliseDetalhada {
  const nota = calcularNotaCEBRASPE(acertos, erros);
  const pontosFortes: string[] = [];
  const pontosFracos: string[] = [];
  const recomendacoes: string[] = [...nota.dicas];
  
  // Análise de pontos fortes/fracos baseada na porcentagem
  if (nota.porcentagemAcertos >= 70) {
    pontosFortes.push("Ótimo aproveitamento geral");
  } else if (nota.porcentagemAcertos >= 50) {
    pontosFortes.push("Aproveitamento mediano, com margem para evolução");
  } else {
    pontosFracos.push("Aproveitamento geral abaixo do esperado");
  }
  
  if (nota.porcentagemErros > 30) {
    pontosFracos.push("Alto índice de erros - cuidado com chutes");
    recomendacoes.push("Evite chutar sem eliminar alternativas");
  }
  
  if (nota.porcentagemBrancos > 20) {
    pontosFracos.push("Muitas questões em branco");
    recomendacoes.push("Gerencie melhor seu tempo durante a prova");
  }
  
  // Calcular previsão
  const deficitNota = nota.estatisticas.notaMinimaAprovacao - nota.notaFinal;
  const semanasParaAprovacao = Math.max(4, Math.ceil((deficitNota / 5) * (8 / horasEstudoDiarias)));
  const simuladosNecessarios = Math.max(5, Math.ceil(semanasParaAprovacao / 2));
  
  return {
    nota,
    pontosFortes,
    pontosFracos,
    recomendacoes: [...new Set(recomendacoes)], // Remove duplicatas
    previsao: {
      horasEstudoDiarias,
      semanasParaAprovacao,
      simuladosNecessarios,
    },
  };
}

// Função de utilidade para formatar nota para exibição
export function formatarNotaParaExibicao(nota: NotaCEBRASPE): {
  resumo: string;
  barraProgresso: { width: string; cor: string };
  textoClassificacao: string;
} {
  let corBarra = "";
  if (nota.classificacao === "Excelente") corBarra = "bg-purple-500";
  else if (nota.classificacao === "Bom") corBarra = "bg-blue-500";
  else if (nota.classificacao === "Regular") corBarra = "bg-yellow-500";
  else if (nota.classificacao === "Risco") corBarra = "bg-orange-500";
  else corBarra = "bg-rose-500";
  
  const percentualNota = (nota.notaFinal / 60) * 100;
  
  return {
    resumo: `${nota.acertos} acertos, ${nota.erros} erros, ${nota.brancos} em branco = ${nota.notaFinal} pontos`,
    barraProgresso: {
      width: `${Math.min(100, Math.max(0, percentualNota))}%`,
      cor: corBarra,
    },
    textoClassificacao: `${nota.classificacao} - ${nota.mensagem}`,
  };
}

// Constantes úteis
export const CLASSIFICACOES = {
  EXCELENTE: { min: 45, label: "Excelente", cor: "purple" },
  BOM: { min: 35, label: "Bom", cor: "blue" },
  REGULAR: { min: 25, label: "Regular", cor: "yellow" },
  RISCO: { min: 15, label: "Risco", cor: "orange" },
  REPROVADO: { min: 0, label: "Reprovado", cor: "rose" },
} as const;

// Função para validar se total de questões é consistente
export function validarTotalQuestoes(acertos: number, erros: number, brancos: number, total: number = 60): boolean {
  return acertos + erros + brancos === total;
}