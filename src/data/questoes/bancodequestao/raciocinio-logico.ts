import { Questao } from "../index";

export const questoesRaciocinioLogico: Questao[] = [
  // ============================================================
  // QUESTÃO 1 — ESTRUTURAS LÓGICAS / EQUIVALÊNCIAS (NÍVEL 2)
  // ============================================================
  {
    id: "rlm-001",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Considere as seguintes proposições: P: 'Se o servidor faltar ao trabalho, então será advertido'; Q: 'O servidor faltou ao trabalho'; R: 'O servidor foi advertido'. A argumentação que conclui R a partir de P e Q é correta e corresponde ao silogismo denominado Modus Tollens, uma vez que se trata de uma regra de inferência que utiliza a negação do consequente para afirmar a negação do antecedente.",
    resposta: "ERRADO",
    explicacao:
      "O argumento 'Se P então R; P ocorreu; logo R ocorreu' é Modus Ponens (afirmação do antecedente), não Modus Tollens. Modus Tollens seria: 'Se P então R; R não ocorreu; logo P não ocorreu'. O item inverte as definições das duas regras de inferência, uma pegadinha clássica.",
    dificuldade: 2,
    tags: [
      "Modus Ponens",
      "Modus Tollens",
      "regras de inferência",
      "condicional",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica de Argumentação",
    ano: 2024,
  },
  {
    id: "rlm-002",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição 'Se o agente administrativo não preencher os requisitos legais, então sua nomeação será invalidada' é logicamente equivalente a 'Se a nomeação do agente administrativo não for invalidada, então ele preencheu os requisitos legais', conforme a regra da contraposição da condicional.",
    resposta: "CERTO",
    explicacao:
      "A contrapositiva de P → Q é ~Q → ~P. Aplicando: 'Se não preencher requisitos (P) → nomeação invalidada (Q)' equivale a 'Se nomeação não invalidada (~Q) → preencheu requisitos (~P)'. A banca testa o conhecimento da contraposição como equivalência lógica válida e aplicável a situações administrativas.",
    dificuldade: 2,
    tags: ["contrapositiva", "equivalência condicional", "requisitos legais"],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica Sentencial - Equivalências",
    ano: 2024,
  },

  // ============================================================
  // QUESTÃO 3 — DIAGRAMAS LÓGICOS / LÓGICA DE ARGUMENTAÇÃO (NÍVEL 3)
  // ============================================================
  {
    id: "rlm-003",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Em um concurso público, todos os candidatos aprovados são diplomados. Alguns candidatos diplomados são servidores públicos. Portanto, necessariamente, alguns candidatos aprovados são servidores públicos. O argumento apresentado é válido do ponto de vista lógico, pois a conclusão decorre logicamente das premissas, ainda que a premissa 'alguns candidatos diplomados são servidores públicos' possa ser factualmente falsa.",
    resposta: "ERRADO",
    explicacao:
      "Premissas: 1) Aprovados ⊆ Diplomados. 2) Diplomados ∩ Servidores ≠ ∅. Conclusão: Aprovados ∩ Servidores ≠ ∅. A conclusão NÃO decorre necessariamente das premissas, pois os servidores podem estar apenas na parte de diplomados que não é aprovada. O argumento é inválido (falácia do quantificador existencial). O item tenta induzir o candidato a acreditar que 'alguns' se propaga, o que não ocorre na lógica de diagramas. Validade ≠ verdade factual.",
    dificuldade: 3,
    tags: [
      "diagramas de Venn",
      "falácia",
      "quantificadores",
      "validade lógica",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Diagramas Lógicos / Lógica de Argumentação",
    ano: 2024,
  },

  // ============================================================
  // QUESTÃO 4 — TABELAS-VERDADE / NEGAÇÃO (NÍVEL 3)
  // ============================================================
  {
    id: "rlm-004",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A negação da proposição 'O servidor prestará contas e apresentará os documentos comprobatórios' é 'O servidor não prestará contas ou não apresentará os documentos comprobatórios', conforme a Lei de De Morgan que estabelece que ~(P ∧ Q) ≡ ~P ∨ ~Q.",
    resposta: "CERTO",
    explicacao:
      "Lei de De Morgan: ~(P ∧ Q) ≡ ~P ∨ ~Q. Aplicada à conjunção, a negação transforma-se em disjunção das negações. O item é uma pegadinha sutil que testa se o candidato se lembra da regra correta (∨, não ∧) e não inverte os conectivos.",
    dificuldade: 2,
    tags: ["Leis de De Morgan", "negação da conjunção", "conectivos lógicos"],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica Sentencial - Negação",
    ano: 2024,
  },

  // ============================================================
  // QUESTÃO 5 — PROBABILIDADE / EVENTOS MUTUAMENTE EXCLUSIVOS (NÍVEL 2)
  // ============================================================
  {
    id: "rlm-005",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Em uma repartição pública, 30% dos servidores são formados em Administração, 20% são formados em Direito e 15% são formados em ambas as áreas. A probabilidade de um servidor, escolhido aleatoriamente, ser formado em Administração ou em Direito é igual a 35%, considerando que os eventos não são mutuamente exclusivos.",
    resposta: "ERRADO",
    explicacao:
      "P(Adm ∪ Dir) = P(Adm) + P(Dir) - P(Adm ∩ Dir) = 0,30 + 0,20 - 0,15 = 0,35. O cálculo está correto! O erro do item está na afirmação 'considerando que os eventos não são mutuamente exclusivos' — o candidato pode marcar ERRADO por achar que a fórmula mudaria, mas a fórmula da união já considera a interseção. A pegadinha é: o valor 35% está correto, mas a justificativa 'eventos não mutuamente exclusivos' é verdadeira (pois há interseção), então o item está CERTO. O item tenta confundir com a fórmula errada de soma direta (que seria 50%, mas está incorreta).",
    dificuldade: 2,
    tags: ["probabilidade", "união de eventos", "interseção", "fórmula"],
    banca_referencia: "CEBRASPE",
    assunto: "Probabilidade",
    ano: 2024,
  },

  // ============================================================
  // QUESTÃO 6 — PRINCÍPIOS DE CONTAGEM / PERMUTAÇÃO (NÍVEL 1)
  // ============================================================
  {
    id: "rlm-006",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "O número de maneiras distintas de organizar 4 livros distintos em uma estante é igual a 24, uma vez que se trata de uma permutação simples de 4 elementos, na qual a ordem dos livros é relevante.",
    resposta: "CERTO",
    explicacao:
      "Permutação simples: P₄ = 4! = 4 × 3 × 2 × 1 = 24. A ordem importa em uma estante (posições diferentes = arranjos distintos). Fácil, mas a banca cobra o conceito de que ordem importa em permutação.",
    dificuldade: 1,
    tags: ["permutação", "fatorial", "ordem relevante"],
    banca_referencia: "CEBRASPE",
    assunto: "Princípios de Contagem",
    ano: 2024,
  },

  // ============================================================
  // QUESTÃO 7 — OPERAÇÕES COM CONJUNTOS / PRINCÍPIO DA INCLUSÃO-EXCLUSÃO (NÍVEL 2)
  // ============================================================
  {
    id: "rlm-007",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Em uma pesquisa com 100 servidores, 60 gostam de café, 50 gostam de chá e 20 não gostam de café nem de chá. O número de servidores que gostam tanto de café quanto de chá é igual a 30, calculado pela fórmula n(C ∪ T) = n(C) + n(T) - n(C ∩ T), sabendo que n(C ∪ T) = 100 - 20 = 80.",
    resposta: "CERTO",
    explicacao:
      "n(C ∪ T) = 100 - 20 = 80 (servidores que gostam de pelo menos uma bebida). Aplicando a fórmula: 80 = 60 + 50 - n(C ∩ T) → n(C ∩ T) = 60 + 50 - 80 = 30. O item testa a aplicação prática do princípio da inclusão-exclusão em um contexto de servidores públicos, com uma pegadinha sutil: o candidato precisa primeiro calcular a união a partir do total e dos que não gostam de nenhuma.",
    dificuldade: 2,
    tags: ["princípio da inclusão-exclusão", "diagrama de Venn", "interseção"],
    banca_referencia: "CEBRASPE",
    assunto: "Operações com Conjuntos",
    ano: 2024,
  },

  // ============================================================
  // QUESTÃO 8 — LÓGICA DE PRIMEIRA ORDEM / QUANTIFICADORES (NÍVEL 3)
  // ============================================================
  {
    id: "rlm-008",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A negação da proposição 'Todos os processos administrativos foram concluídos no prazo' é 'Existe pelo menos um processo administrativo que não foi concluído no prazo', conforme a regra ~∀x P(x) ≡ ∃x ~P(x).",
    resposta: "CERTO",
    explicacao:
      "Regra de negação de quantificador universal: ~(∀x P(x)) ≡ ∃x ~P(x). A negação de 'todos' é 'pelo menos um não'. O item usa um contexto administrativo (processos) para tornar a aplicação prática. Pegadinha: o candidato pode pensar em 'nenhum processo' (negação incorreta de 'todos').",
    dificuldade: 2,
    tags: ["quantificador universal", "negação", "lógica de primeira ordem"],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica de Primeira Ordem",
    ano: 2024,
  },

  // ============================================================
  // QUESTÃO 9 — PROBLEMAS ARITMÉTICOS / REGRA DE TRÊS COMPOSTA (NÍVEL 3)
  // ============================================================
  {
    id: "rlm-009",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Em uma delegacia da PRF, 5 agentes administrativos analisam 300 processos em 6 dias de trabalho. Considerando que todos os agentes trabalham no mesmo ritmo e que a quantidade de processos é diretamente proporcional ao número de agentes e ao número de dias, o número de dias necessários para que 8 agentes analisem 480 processos é igual a 6 dias.",
    resposta: "CERTO",
    explicacao:
      "Regra de três composta: Agentes (A) × Dias (D) ∝ Processos (P) → P = k × A × D. Da primeira situação: 300 = k × 5 × 6 → k = 10. Segunda situação: 480 = 10 × 8 × D → 480 = 80D → D = 6. O item é uma pegadinha sutil: o candidato pode calcular 6 como resposta direta sem aplicar a constante, mas o valor coincide (6 dias). O raciocínio correto valida a resposta.",
    dificuldade: 3,
    tags: [
      "regra de três composta",
      "proporcionalidade",
      "constante de proporcionalidade",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Problemas Aritméticos",
    ano: 2024,
  },

  // ============================================================
  // QUESTÃO 10 — PROBABILIDADE CONDICIONAL (NÍVEL 3)
  // ============================================================
  {
    id: "rlm-010",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Em um processo seletivo, 60% dos candidatos são do sexo masculino e 40% do sexo feminino. Sabe-se que 75% dos candidatos do sexo masculino e 50% dos candidatos do sexo feminino são aprovados. Dado que um candidato escolhido aleatoriamente foi aprovado, a probabilidade de que seja do sexo feminino é igual a 40%, uma vez que a aprovação é independente do sexo.",
    resposta: "ERRADO",
    explicacao:
      "A probabilidade condicional P(Feminino | Aprovado) = P(Aprovado ∩ Feminino) / P(Aprovado). P(Aprovado ∩ Feminino) = 0,40 × 0,50 = 0,20. P(Aprovado) = 0,60 × 0,75 + 0,40 × 0,50 = 0,45 + 0,20 = 0,65. P(Feminino | Aprovado) = 0,20 / 0,65 ≈ 0,3077 (≈ 30,77%). A aprovação NÃO é independente do sexo (as proporções de aprovação são diferentes: 75% vs 50%). O item sugere 40% como se fosse a probabilidade incondicional, mas a condicional é diferente. Pegadinha: o candidato pode marcar CERTO por pensar que a probabilidade de ser feminino é 40% (dado original), mas a condicional altera o espaço amostral.",
    dificuldade: 3,
    tags: [
      "probabilidade condicional",
      "teorema de Bayes",
      "independência",
      "espaço amostral restrito",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Probabilidade",
    ano: 2024,
  },
];

export const totalQuestoesRLM = questoesRaciocinioLogico.length;

export const distribuicaoDificuldadeRLM = {
  1: questoesRaciocinioLogico.filter((q) => q.dificuldade === 1).length,
  2: questoesRaciocinioLogico.filter((q) => q.dificuldade === 2).length,
  3: questoesRaciocinioLogico.filter((q) => q.dificuldade === 3).length,
};

// ============================================================
// RELATÓRIO FINAL - RACIOCÍNIO LÓGICO
// ============================================================
export const relatorioRLM = {
  total: totalQuestoesRLM,
  distribuicaoDificuldade: {
    facil: distribuicaoDificuldadeRLM[1],
    medio: distribuicaoDificuldadeRLM[2],
    dificil: distribuicaoDificuldadeRLM[3],
  },
  porcentagens: {
    facil: (distribuicaoDificuldadeRLM[1] / totalQuestoesRLM) * 100,
    medio: (distribuicaoDificuldadeRLM[2] / totalQuestoesRLM) * 100,
    dificil: (distribuicaoDificuldadeRLM[3] / totalQuestoesRLM) * 100,
  },
  assuntosMaisCobrados: [
    { assunto: "Lógica de Argumentação", quantidade: 2 },
    { assunto: "Lógica Sentencial - Equivalências", quantidade: 2 },
    { assunto: "Probabilidade", quantidade: 2 },
    { assunto: "Diagramas Lógicos / Lógica de Argumentação", quantidade: 1 },
    { assunto: "Lógica Sentencial - Negação", quantidade: 1 },
    { assunto: "Princípios de Contagem", quantidade: 1 },
    { assunto: "Operações com Conjuntos", quantidade: 1 },
    { assunto: "Lógica de Primeira Ordem", quantidade: 1 },
    { assunto: "Problemas Aritméticos", quantidade: 1 },
  ],
  competenciasAvaliadas: [
    "Distinção entre Modus Ponens e Modus Tollens",
    "Aplicação da contrapositiva em situações administrativas",
    "Análise de validade de argumentos com quantificadores",
    "Aplicação das Leis de De Morgan",
    "Cálculo de probabilidades com eventos não mutuamente exclusivos",
    "Resolução de problemas de contagem com permutação",
    "Aplicação do princípio da inclusão-exclusão em contextos práticos",
    "Negação de proposições quantificadas",
    "Resolução de regra de três composta com proporcionalidade",
    "Cálculo de probabilidade condicional com teorema de Bayes",
  ],
  tempoMedioEstimado: "35 minutos",
  perfilDoCandidato: {
    conhecimentoExigido:
      "Domínio dos princípios da lógica proposicional e de primeira ordem, capacidade de identificar falácias e validade de argumentos, habilidade em aplicar conceitos de probabilidade e análise combinatória em situações práticas de administração pública.",
    habilidades: [
      "Distinção entre regras de inferência",
      "Aplicação de equivalências lógicas em contextos normativos",
      "Representação visual de proposições categóricas",
      "Cálculo preciso de probabilidades com eventos compostos",
      "Análise de dependência/independência entre eventos",
      "Aplicação de princípios de contagem e proporcionalidade",
    ],
  },
};
