import { Questao } from "../types";

export const questoesRaciocinioLogico: Questao[] = [
  // ============================================================
  // TÓPICO 1: ESTRUTURAS LÓGICAS
  // ============================================================
  {
    id: "rlm-001",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Uma proposição é uma sentença declarativa que pode ser classificada como verdadeira ou falsa, não sendo possível que seja simultaneamente verdadeira e falsa, conforme o princípio do terceiro excluído.",
    resposta: "CERTO",
    explicacao:
      "Princípios fundamentais da lógica clássica: (1) Identidade (p é p); (2) Não contradição (p não pode ser V e F); (3) Terceiro excluído (p é V ou F, não há terceira opção). Proposições obedecem a esses princípios.",
    dificuldade: 1,
    tags: [
      "proposição",
      "princípio do terceiro excluído",
      "valores lógicos",
      "lógica clássica",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Estruturas Lógicas",
    ano: 2024,
  },
  {
    id: "rlm-002",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A sentença 'x + 5 = 10' é uma proposição lógica, pois possui valor verdadeiro ou falso definido.",
    resposta: "ERRADO",
    explicacao:
      "'x + 5 = 10' é uma sentença aberta (função proposicional), pois seu valor lógico depende do valor de x. Só é proposição quando x é especificado (ex: '3 + 5 = 10' é proposição falsa).",
    dificuldade: 2,
    tags: ["sentença aberta", "função proposicional", "proposição", "variável"],
    banca_referencia: "FGV",
    assunto: "Estruturas Lógicas",
    ano: 2023,
  },
  {
    id: "rlm-003",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A negação da proposição '2 + 2 = 4' é a proposição '2 + 2 ≠ 4', e ambas não podem ser verdadeiras simultaneamente, caracterizando proposições contraditórias.",
    resposta: "CERTO",
    explicacao:
      "Proposições contraditórias: uma é a negação da outra. Se p é verdadeira, ~p é falsa, e vice-versa. '2 + 2 = 4' (V) e '2 + 2 ≠ 4' (F) são contraditórias por definição.",
    dificuldade: 1,
    tags: ["negação", "proposições contraditórias", "valores lógicos"],
    banca_referencia: "CEBRASPE",
    assunto: "Estruturas Lógicas",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 2: LÓGICA DE ARGUMENTAÇÃO
  // ============================================================
  {
    id: "rlm-004",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "O argumento 'Se chove, então a rua fica molhada. Choveu. Logo, a rua ficou molhada' é válido e corresponde ao Modus Ponens, regra de inferência fundamental na lógica dedutiva.",
    resposta: "CERTO",
    explicacao:
      "Modus Ponens: (p → q) ∧ p ⊢ q. Se a condicional é verdadeira e o antecedente ocorre, o consequente necessariamente ocorre. É uma regra de inferência válida e amplamente cobrada.",
    dificuldade: 2,
    tags: ["Modus Ponens", "inferência válida", "condicional", "argumentação"],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica de Argumentação",
    ano: 2024,
  },
  {
    id: "rlm-005",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "O argumento 'Se estudo, então passo. Não passei. Logo, não estudei' é válido e corresponde ao Modus Tollens, desde que a condicional inicial seja verdadeira.",
    resposta: "CERTO",
    explicacao:
      "Modus Tollens: (p → q) ∧ ~q ⊢ ~p. Se a condicional é verdadeira e o consequente é falso, o antecedente deve ser falso. É regra válida, mas depende da veracidade da premissa condicional.",
    dificuldade: 2,
    tags: ["Modus Tollens", "inferência válida", "condicional", "negação"],
    banca_referencia: "FCC",
    assunto: "Lógica de Argumentação",
    ano: 2023,
  },
  {
    id: "rlm-006",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A afirmação 'Todo político é honesto. João é político. Logo, João é honesto' é um argumento válido, independentemente da veracidade factual da premissa 'Todo político é honesto'.",
    resposta: "CERTO",
    explicacao:
      "Validade ≠ Verdade. Um argumento é válido se a conclusão decorre logicamente das premissas, mesmo que as premissas sejam falsas factualmente. Aqui, a forma é válida (silogismo em Barbara).",
    dificuldade: 3,
    tags: ["validade vs verdade", "silogismo", "argumentação dedutiva"],
    banca_referencia: "FGV",
    assunto: "Lógica de Argumentação",
    ano: 2024,
  },
  {
    id: "rlm-007",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A analogia é um tipo de raciocínio indutivo que estabelece conclusão provável (não necessária) com base em semelhanças entre casos, sendo útil em argumentação, mas não garantindo validade lógica formal.",
    resposta: "CERTO",
    explicacao:
      "Analogia = raciocínio por semelhança. É indutivo (ampliativo), não dedutivo. A conclusão é provável, não necessária. CEBRASPE cobra essa distinção entre validade formal e força argumentativa.",
    dificuldade: 2,
    tags: ["analogia", "raciocínio indutivo", "argumentação", "validade"],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica de Argumentação",
    ano: 2023,
  },
  {
    id: "rlm-008",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A falácia da afirmação do consequente ocorre quando se infere 'p' a partir de 'p → q' e 'q', o que é logicamente inválido, pois q pode ser verdadeiro por outras razões além de p.",
    resposta: "CERTO",
    explicacao:
      "Falácia: (p → q) ∧ q ⊬ p. Ex: 'Se chove, rua molha. Rua molhou. Logo, choveu' (inválido: pode ter sido mangueira). CEBRASPE adora cobrar reconhecimento de falácias.",
    dificuldade: 3,
    tags: ["falácia", "afirmação do consequente", "invalidade", "condicional"],
    banca_referencia: "VUNESP",
    assunto: "Lógica de Argumentação",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 3: LÓGICA SENTENCIAL (PROPOSICIONAL)
  // ============================================================
  {
    id: "rlm-009",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A tabela-verdade de uma proposição composta com 4 proposições simples distintas possui 16 linhas, calculadas por 2⁴, representando todas as combinações possíveis de valores V/F.",
    resposta: "CERTO",
    explicacao:
      "Fórmula: número de linhas = 2ⁿ, onde n = número de proposições simples. Para n=4: 2⁴ = 16 linhas. Cada linha representa uma combinação única de V/F para as proposições.",
    dificuldade: 1,
    tags: ["tabela-verdade", "combinações", "proposições simples", "cálculo"],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica Sentencial - Tabelas-Verdade",
    ano: 2024,
  },
  {
    id: "rlm-010",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição condicional 'Se p, então q' é falsa apenas quando p é verdadeiro e q é falso; nos demais casos (V→V, F→V, F→F), a condicional é verdadeira.",
    resposta: "CERTO",
    explicacao:
      "Tabela-verdade da condicional (→): só é F quando antecedente V e consequente F. Isso reflete que uma promessa 'Se p, então q' só é quebrada quando p ocorre e q não.",
    dificuldade: 1,
    tags: ["condicional", "tabela-verdade", "implicação", "valores lógicos"],
    banca_referencia: "FCC",
    assunto: "Lógica Sentencial - Conectivos",
    ano: 2023,
  },
  {
    id: "rlm-011",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A equivalência lógica '~(p ∧ q) ≡ ~p ∨ ~q' é uma das Leis de De Morgan, que permite transformar a negação de uma conjunção em uma disjunção das negações.",
    resposta: "CERTO",
    explicacao:
      "Leis de De Morgan: (1) ~(p ∧ q) ≡ ~p ∨ ~q; (2) ~(p ∨ q) ≡ ~p ∧ ~q. São fundamentais para simplificação e negação de proposições compostas.",
    dificuldade: 2,
    tags: [
      "Leis de De Morgan",
      "equivalência",
      "negação",
      "conjunção",
      "disjunção",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica Sentencial - Equivalências",
    ano: 2024,
  },
  {
    id: "rlm-012",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição 'p ↔ q' (bicondicional) é verdadeira quando p e q possuem o mesmo valor lógico (ambos V ou ambos F), e falsa quando possuem valores diferentes.",
    resposta: "CERTO",
    explicacao:
      "Bicondicional (↔) = 'se e somente se'. É verdadeira quando os componentes têm valores iguais. Equivale a (p → q) ∧ (q → p).",
    dificuldade: 1,
    tags: [
      "bicondicional",
      "tabela-verdade",
      "equivalência lógica",
      "conectivos",
    ],
    banca_referencia: "FGV",
    assunto: "Lógica Sentencial - Conectivos",
    ano: 2023,
  },
  {
    id: "rlm-013",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A equivalência 'p → q ≡ ~q → ~p' representa a contrapositiva da condicional, que é logicamente equivalente à proposição original, sendo útil em demonstrações e inferências.",
    resposta: "CERTO",
    explicacao:
      "Contrapositiva: inverte e nega antecedente e consequente. (p → q) ≡ (~q → ~p). É sempre equivalente, diferentemente da recíproca (q → p) ou inversa (~p → ~q).",
    dificuldade: 2,
    tags: ["contrapositiva", "equivalência", "condicional", "demonstração"],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica Sentencial - Equivalências",
    ano: 2024,
  },
  {
    id: "rlm-014",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A negação da condicional 'Se estudo, então passo' é 'Estudo e não passo', conforme a equivalência ~(p → q) ≡ p ∧ ~q, que pode ser derivada das Leis de De Morgan.",
    resposta: "CERTO",
    explicacao:
      "Negação da condicional: ~(p → q) ≡ ~(~p ∨ q) ≡ p ∧ ~q (por De Morgan). 'Não é verdade que se estudo então passo' = 'Estudo e não passo'. Pegadinha clássica!",
    dificuldade: 3,
    tags: [
      "negação da condicional",
      "Leis de De Morgan",
      "equivalência",
      "pegadinha",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica Sentencial - Negação",
    ano: 2023,
  },
  {
    id: "rlm-015",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição 'p ∨ ~p' é uma tautologia, pois é sempre verdadeira independentemente do valor de p, exemplificando o princípio do terceiro excluído.",
    resposta: "CERTO",
    explicacao:
      "Tautologia = proposição sempre V. 'p ou não-p' cobre todas as possibilidades (p é V ou F). É a expressão lógica do princípio do terceiro excluído.",
    dificuldade: 2,
    tags: [
      "tautologia",
      "terceiro excluído",
      "princípios lógicos",
      "proposição composta",
    ],
    banca_referencia: "FCC",
    assunto: "Lógica Sentencial - Classificação",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 3.5: DIAGRAMAS LÓGICOS
  // ============================================================
  {
    id: "rlm-016",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "No diagrama de Venn, a proposição 'Todo A é B' é representada pelo conjunto A completamente contido no conjunto B, indicando que todos os elementos de A também pertencem a B.",
    resposta: "CERTO",
    explicacao:
      "Diagramas de Venn: 'Todo A é B' = A ⊆ B (A dentro de B). 'Algum A é B' = interseção não vazia. 'Nenhum A é B' = conjuntos disjuntos (sem interseção).",
    dificuldade: 1,
    tags: [
      "diagramas de Venn",
      "inclusão de conjuntos",
      "proposições categóricas",
      "representação visual",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Diagramas Lógicos",
    ano: 2024,
  },
  {
    id: "rlm-017",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se 'Algum A é B' e 'Todo B é C' são verdadeiras, então necessariamente 'Algum A é C' é verdadeira, conforme pode ser verificado pela sobreposição de diagramas de Venn.",
    resposta: "CERTO",
    explicacao:
      "Silogismo válido: Algum A é B (interseção A∩B ≠ ∅) + Todo B é C (B ⊆ C) → Algum A é C (A∩C ≠ ∅). O elemento comum a A e B também está em C.",
    dificuldade: 2,
    tags: [
      "silogismo válido",
      "diagramas de Venn",
      "inferência",
      "proposições categóricas",
    ],
    banca_referencia: "FGV",
    assunto: "Diagramas Lógicos",
    ano: 2023,
  },
  {
    id: "rlm-018",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição 'Nenhum A é B' é representada no diagrama de Venn por dois conjuntos disjuntos, sem qualquer área de interseção entre A e B.",
    resposta: "CERTO",
    explicacao:
      "'Nenhum A é B' = A ∩ B = ∅ (conjuntos disjuntos). No diagrama, os círculos de A e B não se sobrepõem. É a representação visual da exclusão total.",
    dificuldade: 1,
    tags: [
      "diagramas de Venn",
      "conjuntos disjuntos",
      "proposição universal negativa",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Diagramas Lógicos",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 4: LÓGICA DE PRIMEIRA ORDEM (QUANTIFICADORES)
  // ============================================================
  {
    id: "rlm-019",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A negação da proposição 'Todo servidor é eficiente' é 'Algum servidor não é eficiente', e não 'Nenhum servidor é eficiente', conforme as regras de negação de quantificadores.",
    resposta: "CERTO",
    explicacao:
      "Negação de quantificadores: ~(∀x P(x)) ≡ ∃x ~P(x). 'Nem todo' = 'Algum não'. 'Nenhum' seria a negação de 'Algum é', não de 'Todo é'.",
    dificuldade: 2,
    tags: [
      "quantificadores",
      "negação",
      "lógica de primeira ordem",
      "proposições categóricas",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica de Primeira Ordem",
    ano: 2024,
  },
  {
    id: "rlm-020",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição 'Existe x tal que x é par e x é primo' é verdadeira, pois o número 2 satisfaz simultaneamente as duas condições, sendo o único número par primo.",
    resposta: "CERTO",
    explicacao:
      "Quantificador existencial (∃): basta um exemplo para tornar a proposição verdadeira. 2 é par e primo → a proposição é V. CEBRASPE cobra atenção a exemplos concretos.",
    dificuldade: 2,
    tags: [
      "quantificador existencial",
      "números primos",
      "exemplo concreto",
      "lógica de primeira ordem",
    ],
    banca_referencia: "FCC",
    assunto: "Lógica de Primeira Ordem",
    ano: 2023,
  },
  {
    id: "rlm-021",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A equivalência '~(∃x P(x)) ≡ ∀x ~P(x)' indica que negar 'existe x com propriedade P' equivale a afirmar 'para todo x, não-P', sendo fundamental para negação de proposições quantificadas.",
    resposta: "CERTO",
    explicacao:
      "Regra de negação de quantificadores: (1) ~∀x P(x) ≡ ∃x ~P(x); (2) ~∃x P(x) ≡ ∀x ~P(x). Troca-se o quantificador e nega-se o predicado.",
    dificuldade: 3,
    tags: [
      "negação de quantificadores",
      "equivalência",
      "lógica de primeira ordem",
      "regras formais",
    ],
    banca_referencia: "FGV",
    assunto: "Lógica de Primeira Ordem",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 5: PRINCÍPIOS DE CONTAGEM E PROBABILIDADE
  // ============================================================
  {
    id: "rlm-022",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "O número de maneiras de organizar 5 pessoas em uma fila é 120, calculado por 5! (5 fatorial), pois a ordem dos elementos é relevante, caracterizando uma permutação simples.",
    resposta: "CERTO",
    explicacao:
      "Permutação simples de n elementos: Pₙ = n!. Para 5 pessoas: 5! = 5×4×3×2×1 = 120. Ordem importa → permutação. Se ordem não importasse, seria combinação.",
    dificuldade: 1,
    tags: [
      "permutação",
      "fatorial",
      "princípio fundamental da contagem",
      "ordem importa",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Princípios de Contagem",
    ano: 2023,
  },
  {
    id: "rlm-023",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A probabilidade de obter face 6 em um lançamento de dado honesto é 1/6, e a probabilidade de NÃO obter face 6 (evento complementar) é 5/6, pois P(A) + P(~A) = 1.",
    resposta: "CERTO",
    explicacao:
      "Evento complementar: P(~A) = 1 - P(A). Dado honesto: P(6) = 1/6 → P(não-6) = 1 - 1/6 = 5/6. Soma das probabilidades do espaço amostral = 1.",
    dificuldade: 1,
    tags: ["probabilidade", "evento complementar", "dado", "espaço amostral"],
    banca_referencia: "FCC",
    assunto: "Probabilidade",
    ano: 2024,
  },
  {
    id: "rlm-024",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se dois eventos A e B são mutuamente exclusivos, então P(A ∪ B) = P(A) + P(B), pois não há interseção a ser subtraída na fórmula geral da união.",
    resposta: "CERTO",
    explicacao:
      "Eventos mutuamente exclusivos: A ∩ B = ∅ → P(A ∩ B) = 0. Fórmula da união: P(A ∪ B) = P(A) + P(B) - P(A ∩ B) → simplifica para P(A) + P(B).",
    dificuldade: 2,
    tags: [
      "eventos mutuamente exclusivos",
      "probabilidade da união",
      "interseção vazia",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Probabilidade",
    ano: 2023,
  },
  {
    id: "rlm-025",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "O número de combinações possíveis de 3 elementos escolhidos entre 5 é 10, calculado por C(5,3) = 5!/(3!×2!), pois na combinação a ordem dos elementos não importa.",
    resposta: "CERTO",
    explicacao:
      "Combinação: C(n,p) = n!/(p!(n-p)!). C(5,3) = 5!/(3!×2!) = (120)/(6×2) = 10. Ordem não importa → combinação. Se importasse, seria arranjo: A(5,3) = 60.",
    dificuldade: 2,
    tags: [
      "combinação",
      "fatorial",
      "ordem não importa",
      "análise combinatória",
    ],
    banca_referencia: "VUNESP",
    assunto: "Princípios de Contagem",
    ano: 2022,
  },
  {
    id: "rlm-026",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A probabilidade condicional P(A|B) = P(A ∩ B)/P(B) representa a probabilidade de A ocorrer dado que B já ocorreu, sendo fundamental para problemas de dependência entre eventos.",
    resposta: "CERTO",
    explicacao:
      "Probabilidade condicional: P(A|B) = P(A e B)/P(B). Restringe o espaço amostral a B. Se A e B são independentes, P(A|B) = P(A).",
    dificuldade: 3,
    tags: [
      "probabilidade condicional",
      "eventos dependentes",
      "fórmula",
      "espaço amostral restrito",
    ],
    banca_referencia: "FGV",
    assunto: "Probabilidade",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 6: OPERAÇÕES COM CONJUNTOS
  // ============================================================
  {
    id: "rlm-027",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Dados os conjuntos A = {1, 2, 3, 4} e B = {3, 4, 5, 6}, a diferença A - B é igual a {1, 2}, contendo apenas os elementos que pertencem a A mas não a B.",
    resposta: "CERTO",
    explicacao:
      "Diferença de conjuntos: A - B = {x | x ∈ A e x ∉ B}. Elementos de A que não estão em B: 1 e 2. B - A seria {5, 6}. Atenção: A - B ≠ B - A.",
    dificuldade: 1,
    tags: [
      "diferença de conjuntos",
      "operações com conjuntos",
      "elementos exclusivos",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Operações com Conjuntos",
    ano: 2023,
  },
  {
    id: "rlm-028",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A propriedade distributiva da união sobre a interseção é expressa por A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C), sendo válida para quaisquer conjuntos A, B e C.",
    resposta: "CERTO",
    explicacao:
      "Propriedades de conjuntos: (1) Distributiva: A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C) e A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C); (2) Comutativa, associativa, De Morgan. São cobradas em equivalências.",
    dificuldade: 3,
    tags: [
      "propriedades de conjuntos",
      "distributiva",
      "álgebra de conjuntos",
      "equivalência",
    ],
    banca_referencia: "FCC",
    assunto: "Operações com Conjuntos",
    ano: 2024,
  },
  {
    id: "rlm-029",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se n(A) = 20, n(B) = 30 e n(A ∩ B) = 10, então n(A ∪ B) = 40, calculado pela fórmula n(A ∪ B) = n(A) + n(B) - n(A ∩ B), que evita a dupla contagem da interseção.",
    resposta: "CERTO",
    explicacao:
      "Fórmula da união de conjuntos: n(A ∪ B) = n(A) + n(B) - n(A ∩ B). Substituindo: 20 + 30 - 10 = 40. A interseção é subtraída para não contar duas vezes.",
    dificuldade: 2,
    tags: [
      "união de conjuntos",
      "fórmula da união",
      "princípio da inclusão-exclusão",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Operações com Conjuntos",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 7: PROBLEMAS ARITMÉTICOS, GEOMÉTRICOS E MATRICIAIS
  // ============================================================
  {
    id: "rlm-030",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Em uma progressão geométrica (PG) com primeiro termo a₁ = 2 e razão q = 3, o quarto termo (a₄) é igual a 54, calculado pela fórmula aₙ = a₁ × qⁿ⁻¹.",
    resposta: "CERTO",
    explicacao:
      "Fórmula do termo geral da PG: aₙ = a₁ × qⁿ⁻¹. a₄ = 2 × 3³ = 2 × 27 = 54. PG: cada termo é o anterior multiplicado pela razão.",
    dificuldade: 2,
    tags: ["progressão geométrica", "termo geral", "razão", "PG"],
    banca_referencia: "FCC",
    assunto: "Problemas Aritméticos",
    ano: 2024,
  },
  {
    id: "rlm-031",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A matriz identidade de ordem 3 possui 1s na diagonal principal e 0s nas demais posições, sendo o elemento neutro da multiplicação de matrizes quadradas.",
    resposta: "CERTO",
    explicacao:
      "Matriz identidade Iₙ: diagonal principal = 1, demais = 0. Propriedade: A × I = I × A = A (para matrizes quadradas compatíveis). Elemento neutro multiplicativo.",
    dificuldade: 2,
    tags: [
      "matriz identidade",
      "matrizes",
      "elemento neutro",
      "multiplicação de matrizes",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Problemas Matriciais",
    ano: 2023,
  },
  {
    id: "rlm-032",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A área de um triângulo retângulo com catetos medindo 3 cm e 4 cm é igual a 6 cm², calculada por (base × altura)/2, onde os catetos funcionam como base e altura.",
    resposta: "CERTO",
    explicacao:
      "Triângulo retângulo: área = (cateto₁ × cateto₂)/2. (3 × 4)/2 = 6 cm². A hipotenusa (5 cm, por Pitágoras) não é usada no cálculo da área.",
    dificuldade: 1,
    tags: ["triângulo retângulo", "área", "catetos", "geometria plana"],
    banca_referencia: "VUNESP",
    assunto: "Problemas Geométricos",
    ano: 2022,
  },
  {
    id: "rlm-033",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se uma matriz A é de ordem 2×3 e uma matriz B é de ordem 3×2, então o produto AB é possível e resulta em uma matriz de ordem 2×2, enquanto BA resulta em uma matriz de ordem 3×3.",
    resposta: "CERTO",
    explicacao:
      "Multiplicação de matrizes: A(m×n) × B(n×p) = C(m×p). AB: (2×3)×(3×2) → 2×2. BA: (3×2)×(2×3) → 3×3. A multiplicação de matrizes não é comutativa (AB ≠ BA em geral).",
    dificuldade: 3,
    tags: [
      "multiplicação de matrizes",
      "ordem de matrizes",
      "não comutatividade",
    ],
    banca_referencia: "FGV",
    assunto: "Problemas Matriciais",
    ano: 2024,
  },
  {
    id: "rlm-034",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A soma dos ângulos internos de qualquer triângulo é sempre igual a 180°, independentemente do tipo de triângulo (equilátero, isósceles ou escaleno), conforme propriedade fundamental da geometria euclidiana plana.",
    resposta: "CERTO",
    explicacao:
      "Teorema da soma dos ângulos internos: em qualquer triângulo no plano euclidiano, a soma é 180°. É propriedade invariante, usada em diversos problemas geométricos.",
    dificuldade: 1,
    tags: [
      "triângulo",
      "soma dos ângulos internos",
      "geometria euclidiana",
      "propriedade invariante",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Problemas Geométricos",
    ano: 2023,
  },
];

export const totalQuestoesRLM = questoesRaciocinioLogico.length;

export const distribuicaoDificuldadeRLM = {
  1: questoesRaciocinioLogico.filter((q) => q.dificuldade === 1).length,
  2: questoesRaciocinioLogico.filter((q) => q.dificuldade === 2).length,
  3: questoesRaciocinioLogico.filter((q) => q.dificuldade === 3).length,
};
