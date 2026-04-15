import { Questao } from "../types";

export const questoesRaciocinioLogico: Questao[] = [
  {
    id: "raclog-001-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se a proposição 'Todos os servidores públicos são assíduos' é verdadeira, então a proposição 'Algum servidor público não é assíduo' é necessariamente falsa, pois constitui a negação lógica da proposição original.",
    resposta: "CERTO",
    explicacao:
      "A negação de 'Todos A são B' é 'Algum A não é B' (ou 'Existe A que não é B'). Se uma é verdadeira, a outra é falsa. São proposições contraditórias. Na lógica aristotélica e moderna, isso é válido.",
    dificuldade: 2,
    tags: [
      "lógica aristotélica",
      "quantificadores",
      "negação",
      "todos",
      "algum",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica de argumentação",
  },
  {
    id: "raclog-002-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição composta 'Se chover, então não sairei' é logicamente equivalente à proposição 'Não chove ou não saio', conforme a regra de equivalência entre condicional e disjunção na lógica proposicional.",
    resposta: "CERTO",
    explicacao:
      "Equivalência lógica: p → q ≡ ~p ∨ q. Aplicando: 'Se chover (p), não saio (q)' ≡ 'Não chove (~p) ou não saio (q)'. A assertiva está correta na forma lógica, embora o enunciado original mencionasse 'choverei' (erro tipográfico corrigido na versão v2).",
    dificuldade: 3,
    tags: [
      "equivalência lógica",
      "condicional",
      "disjunção",
      "Leis de De Morgan",
      "tabela-verdade",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica sentencial",
  },
  {
    id: "raclog-003-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Em uma tabela-verdade composta por 3 (três) proposições simples distintas (p, q, r), o número total de combinações possíveis de valores-verdade (V ou F) é igual a 8 (oito), calculado por 2^n, onde n é o número de proposições.",
    resposta: "CERTO",
    explicacao:
      "Fórmula: 2^n. Para n=3, temos 2³ = 8 linhas na tabela-verdade. As combinações são: VVV, VVF, VFV, VFF, FVV, FVF, FFV, FFF.",
    dificuldade: 1,
    tags: [
      "tabela-verdade",
      "combinações",
      "proposições simples",
      "cálculo combinatório",
    ],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Lógica sentencial",
  },
  {
    id: "raclog-004-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A negação da proposição composta 'João é alto e Maria é baixa', segundo as Leis de De Morgan, é logicamente equivalente a 'João não é alto ou Maria não é baixa', sendo que o conectivo 'e' é substituído por 'ou' e ambos os componentes são negados.",
    resposta: "CERTO",
    explicacao:
      "Lei de De Morgan: ~(p ∧ q) ≡ ~p ∨ ~q. A negação de uma conjunção é uma disjunção das negações. 'Não (A e B)' = 'Não A ou Não B'.",
    dificuldade: 2,
    tags: [
      "Leis de De Morgan",
      "negação",
      "conjunção",
      "disjunção",
      "equivalência",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica sentencial",
  },
  {
    id: "raclog-005-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se as premissas 'Todos os A são B' e 'Todos os B são C' são verdadeiras, então, necessariamente, a conclusão 'Todos os A são C' é verdadeira, configurando um silogismo válido na primeira figura (Barbara).",
    resposta: "CERTO",
    explicacao:
      "Silogismo categórico Barbara (AAA-1): Todo M é P, Todo S é M, logo Todo S é P. Aqui: Todo B é C, Todo A é B, logo Todo A é C. É válido por transitividade da inclusão de classes.",
    dificuldade: 2,
    tags: [
      "silogismo",
      "lógica aristotélica",
      "Barbara",
      "figura do silogismo",
      "validade",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica de argumentação",
  },
  {
    id: "raclog-006-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição 'Ou João estuda ou Maria estuda', sob a interpretação do ou exclusivo (disjunção exclusiva), é verdadeira quando ambos estudam, pois a condição de exclusividade é satisfeita pela participação de ambos.",
    resposta: "ERRADO",
    explicacao:
      "No 'ou exclusivo' (XOR), a proposição é verdadeira quando EXATAMENTE UM dos componentes é verdadeiro. Se ambos estudam (V e V), o ou exclusivo é FALSO. O ou inclusivo é que seria verdadeiro. O CEBRASPE usa 'ou...ou' como exclusivo.",
    dificuldade: 3,
    tags: [
      "ou exclusivo",
      "ou inclusivo",
      "disjunção",
      "tabela-verdade",
      "interpretação",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica sentencial",
  },
  {
    id: "raclog-007-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "O argumento dedutivo 'Todo mamífero é animal. Todo cão é mamífero. Logo, todo cão é animal' é válido e corresponde ao modo lógico Barbara da primeira figura do silogismo categórico.",
    resposta: "CERTO",
    explicacao:
      "Silogismo em Barbara: 1ª premissa (Maior): Todo M é P (Todo mamífero é animal). 2ª premissa (Menor): Todo S é M (Todo cão é mamífero). Conclusão: Todo S é P (Todo cão é animal). É válido.",
    dificuldade: 2,
    tags: [
      "silogismo",
      "Barbara",
      "validade",
      "dedução",
      "lógica aristotélica",
    ],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Lógica de argumentação",
  },
  {
    id: "raclog-008-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição 'É necessário que chova para que a rua fique molhada' estabelece que a chuva é condição necessária para a rua molhada, sendo logicamente equivalente a 'Se a rua está molhada, então choveu'.",
    resposta: "CERTO",
    explicacao:
      "Condição necessária: 'A apenas se B' ou 'Se A, então B'. Aqui: 'Rua molhada apenas se chove' = 'Se rua molhada, então choveu'. A chuva é necessária (sem chuva, não há rua molhada), mas não suficiente (pode chover sem molhar a rua específica).",
    dificuldade: 3,
    tags: [
      "condição necessária",
      "condição suficiente",
      "implicação",
      "lógica condicional",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica de argumentação",
  },
  {
    id: "raclog-009-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se uma proposição condicional 'Se p, então q' é verdadeira e seu consequente 'q' é falso, então, pelo Modus Tollens, o antecedente 'p' é necessariamente falso.",
    resposta: "CERTO",
    explicacao:
      "Modus Tollens: (p → q) ∧ ~q ⊢ ~p. Se 'Se p então q' é verdade e q é falso, então p deve ser falso (se p fosse verdadeiro, q seria verdadeiro, mas q é falso). É regra de inferência válida.",
    dificuldade: 2,
    tags: [
      "Modus Tollens",
      "inferência",
      "condicional",
      "consequente",
      "antecedente",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica de argumentação",
  },
  {
    id: "raclog-010-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A negação da proposição universal negativa 'Nenhum servidor é incompetente' é a proposição particular afirmativa 'Algum servidor é incompetente', conforme as regras de oposição entre proposições categóricas.",
    resposta: "CERTO",
    explicacao:
      "Negação de 'Nenhum A é B' (E) é 'Algum A é B' (I). São proposições contraditórias (não podem ser ambas verdadeiras nem ambas falsas). Se uma é verdadeira, a outra é falsa, e vice-versa.",
    dificuldade: 2,
    tags: [
      "negação",
      "proposições categóricas",
      "quadrilátero de oposição",
      "particular afirmativa",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica de argumentação",
  },
  {
    id: "raclog-011-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Dados os conjuntos A = {1, 2, 3} e B = {2, 3, 4}, a interseção A ∩ B é igual ao conjunto {2, 3}, contendo apenas os elementos que pertencem simultaneamente a ambos os conjuntos.",
    resposta: "CERTO",
    explicacao:
      "Interseção (∩): elementos comuns a A e B. A = {1, 2, 3}, B = {2, 3, 4}. Elementos comuns: 2 e 3. Logo, A ∩ B = {2, 3}.",
    dificuldade: 1,
    tags: [
      "teoria dos conjuntos",
      "interseção",
      "elementos comuns",
      "álgebra de conjuntos",
    ],
    banca_referencia: "FCC",
    assunto: "Operações com conjuntos",
  },
  {
    id: "raclog-012-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "O número de anagramas possíveis da palavra 'LOGICA' é igual a 720 (seiscentos e vinte), calculado por 6 fatorial (6!), pois a palavra possui 6 letras distintas.",
    resposta: "CERTO",
    explicacao:
      "Anagramas = permutações de letras. Para n elementos distintos: n! (n fatorial). 6! = 6 × 5 × 4 × 3 × 2 × 1 = 720. Como todas as letras de 'LOGICA' são distintas, o cálculo é direto.",
    dificuldade: 2,
    tags: [
      "anagramas",
      "permutação",
      "fatorial",
      "princípio fundamental da contagem",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Princípios de contagem",
  },
  {
    id: "raclog-013-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se a probabilidade de ocorrência de um evento A é 0,25 (vinte e cinco por cento), então a probabilidade do evento complementar (não-A) é 0,75 (setenta e cinco por cento), pois a soma das probabilidades de eventos complementares é sempre igual a 1 (um).",
    resposta: "CERTO",
    explicacao:
      "P(~A) = 1 - P(A). Se P(A) = 0,25, então P(~A) = 1 - 0,25 = 0,75. Eventos complementares são mutuamente exclusivos e exaustivos (cobrem todo o espaço amostral).",
    dificuldade: 1,
    tags: [
      "probabilidade",
      "evento complementar",
      "espaço amostral",
      "cálculo probabilístico",
    ],
    banca_referencia: "FCC",
    assunto: "Probabilidade",
  },
  {
    id: "raclog-014-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Em uma progressão aritmética (PA) com primeiro termo a₁ = 2 e razão r = 3, o décimo termo (a₁₀) é igual a 29 (vinte e nove), calculado pela fórmula aₙ = a₁ + (n-1) × r.",
    resposta: "CERTO",
    explicacao:
      "Fórmula do termo geral da PA: aₙ = a₁ + (n-1)r. a₁₀ = 2 + (10-1) × 3 = 2 + 9 × 3 = 2 + 27 = 29.",
    dificuldade: 2,
    tags: ["progressão aritmética", "termo geral", "razão", "PA"],
    banca_referencia: "CEBRASPE",
    assunto: "Raciocínio lógico envolvendo problemas aritméticos",
  },
  {
    id: "raclog-015-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A média aritmética dos números 10, 20 e 30 é igual à média geométrica dos mesmos números, pois ambas resultam em 20 (vinte).",
    resposta: "ERRADO",
    explicacao:
      "Média Aritmética (MA) = (10+20+30)/3 = 20. Média Geométrica (MG) = ³√(10×20×30) = ³√6000 ≈ 18,17. São diferentes. A igualdade só ocorre quando todos os valores são iguais.",
    dificuldade: 2,
    tags: [
      "média aritmética",
      "média geométrica",
      "medidas de centralidade",
      "cálculo",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Raciocínio lógico envolvendo problemas aritméticos",
  },
  {
    id: "raclog-016-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se as premissas 'Todo A é B' e 'Algum B é C' são verdadeiras, então, necessariamente, a conclusão 'Algum A é C' é verdadeira, configurando um silogismo válido.",
    resposta: "ERRADO",
    explicacao:
      "Silogismo inválido (falácia do termo médio não distribuído). O C pode estar no B que não é A. Ex: Todo cão é mamífero (A=B). Algum mamífero é gato (algum B é C). Mas nenhum cão é gato. A conclusão não é necessária.",
    dificuldade: 3,
    tags: ["silogismo", "falácia", "termo médio", "distribuição", "validade"],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica de argumentação",
  },
  {
    id: "raclog-017-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição 'João não é alto nem é forte' é logicamente equivalente a 'João não é alto e João não é forte', conforme a regra de equivalência entre a negação da disjunção e a conjunção das negações (Leis de De Morgan).",
    resposta: "CERTO",
    explicacao:
      "'Nem A nem B' = 'Não A e Não B'. Lei de De Morgan aplicada: ~(A ∨ B) ≡ ~A ∧ ~B. 'Não (A ou B)' = 'Não A e Não B'.",
    dificuldade: 2,
    tags: [
      "Leis de De Morgan",
      "nem...nem",
      "negação",
      "disjunção",
      "conjunção",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Lógica sentencial",
  },
  {
    id: "raclog-018-v2",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se P(A) = 0,5, P(B) = 0,4 e P(A ∩ B) = 0,2, então a probabilidade da união P(A ∪ B) é igual a 0,7 (sete décimos), calculada pela fórmula P(A ∪ B) = P(A) + P(B) - P(A ∩ B).",
    resposta: "CERTO",
    explicacao:
      "Fórmula da probabilidade da união: P(A ∪ B) = P(A) + P(B) - P(A ∩ B). Substituindo: 0,5 + 0,4 - 0,2 = 0,7. O valor 0,2 é subtraído para não contar duas vezes a interseção.",
    dificuldade: 2,
    tags: [
      "probabilidade",
      "união de eventos",
      "interseção",
      "fórmula da união",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Probabilidade",
  },
];

export const totalQuestoesRLM = questoesRaciocinioLogico.length;
