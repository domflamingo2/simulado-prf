// ============================================================
// PORTUGUÊS - Questões (50+ questões)
// ============================================================

import { Questao } from "../types";

export const questoesPortugues: Questao[] = [
  // Bloco 1: Interpretação de Textos e Tipologia (12 questões)
  {
    id: "port-001-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "Considere o seguinte trecho de um ofício oficial: 'Conforme solicitação da vossa senhoria, encaminhamos os documentos pertinentes à análise requerida, ciente de que o prazo para manifestação esgotar-se-á no próximo dia 15.' A forma verbal 'esgotar-se-á' indica uma ação futura em relação ao momento da escrita, caracterizando uso do futuro do presente do indicativo com valor temporal prospectivo.",
    resposta: "CERTO",
    explicacao:
      "O futuro do presente (esgotar-se-á) indica ação futura em relação ao momento do enunciado. O valor é prospectivo/temporal. Conforme gramática normativa e Manual de Redação da Presidência da República, este tempo verbal é adequado para textos oficiais quando se refere a prazos futuros.",
    dificuldade: 2,
    tags: ["verbos", "futuro do presente", "texto oficial", "tempo verbal"],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Interpretação de textos oficiais",
  },
  {
    id: "port-002-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "No texto 'O servidor, embora tenha apresentado a documentação exigida, não teve seu pedido deferido', a oração subordinada reduzida 'embora tenha apresentado a documentação exigida' estabelece uma relação de concessão com a oração principal, indicando que apesar de uma condição ter sido satisfeita, o resultado esperado não ocorreu.",
    resposta: "CERTO",
    explicacao:
      "A conjunção concessiva 'embora' introduz uma oração que exprime um fato que deveria impedir o resultado da oração principal, mas não o impede. Trata-se de concessão, conforme a tipologia de orações subordinadas adverbiais.",
    dificuldade: 2,
    tags: [
      "orações subordinadas",
      "concessão",
      "conjunções",
      "análise sintática",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe do período",
  },
  {
    id: "port-003-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "Analise a seguinte construção presente em despacho oficial: 'Trata-se de processo administrativo instaurado para apuração de responsabilidade, sendo que o mesmo deverá ser analisado pelo setor competente.' O pronome 'o mesmo' está empregado corretamente como recurso de coesão textual, substituindo o termo 'processo administrativo' para evitar repetição.",
    resposta: "ERRADO",
    explicacao:
      "Conforme o Manual de Redação da Presidência da República, o pronome 'o mesmo' como substantivo é considerado vício de estilo (prolixidade) em textos oficiais. Deve-se usar pronome oblíquo (ele) ou simplesmente omitir: '...e deverá ser analisado...'",
    dificuldade: 3,
    tags: ["coesão textual", "pronomes", "Manual de Redação", "estilo oficial"],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Redação de correspondências oficiais",
  },
  {
    id: "port-004-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "Em correspondência oficial, a expressão 'no intuito de' pode ser substituída por 'com o intuito de' sem prejuízo do sentido original, sendo ambas as construções igualmente aceitas na norma culta escrita.",
    resposta: "CERTO",
    explicacao:
      "Ambas as construções são sinonímicas e adequadas. 'No intuito de' (preposição 'em' + artigo 'o') e 'com o intuito de' (preposição 'com' + artigo 'o') expressam finalidade de forma equivalente na norma culta.",
    dificuldade: 2,
    tags: [
      "regência nominal",
      "locuções prepositivas",
      "correspondência oficial",
    ],
    banca_referencia: "FCC",
    assunto: "Regência nominal e verbal",
  },
  {
    id: "port-005-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "Considere o seguinte período extraído de portaria: 'O servidor que não comparecer à reunião prevista no art. 3º, § 2º, desta norma, será submetido a processo administrativo disciplinar, sem prejuízo das demais sanções legais cabíveis.' A vírgula empregada após 'norma' é obrigatória por se tratar de oração subordinada adjetiva restritiva intercalada.",
    resposta: "ERRADO",
    explicacao:
      "A oração 'que não comparecer à reunião prevista no art. 3º, § 2º, desta norma' é restritiva (especifica qual servidor), e orações restritivas NÃO são isoladas por vírgulas. A vírgula após 'norma' está incorreta. O correto seria: 'O servidor que não comparecer à reunião prevista no art. 3º, § 2º, desta norma será submetido...'",
    dificuldade: 3,
    tags: [
      "pontuação",
      "orações adjetivas",
      "restritiva vs explicativa",
      "vírgula",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Pontuação",
  },
  {
    id: "port-006-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "No trecho 'Os documentos foram analisados pelos servidores designados', a voz passiva analítica (ser + particípio) é utilizada para destacar o objeto paciente ('os documentos') e ocultar ou despersonalizar o agente da ação, estratégia comum em textos administrativos quando o foco é o resultado, não o executor.",
    resposta: "CERTO",
    explicacao:
      "A voz passiva analítica (forma ser + particípio passado + preposição por/pelo) tem como função destacar o paciente e, frequentemente, omitir ou relegar a segundo plano o agente. É recurso legítimo e frequente em textos oficiais quando o resultado importa mais que quem executou.",
    dificuldade: 2,
    tags: ["voz passiva", "voz verbal", "sintaxe", "gênero textual"],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe da oração",
  },
  {
    id: "port-007-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A frase 'Entre você e eu, não há divergências quanto ao mérito da decisão' apresenta erro de regência verbal na construção 'há divergências', pois o verbo 'haver' no sentido de 'existir' rege objeto direto, não podendo ser seguido de termo preposicionado.",
    resposta: "ERRADO",
    explicacao:
      "O erro está no pronome 'eu', não na regência de 'haver'. Após preposição ('entre'), usa-se o pronome oblíquo: 'Entre você e mim'. O verbo 'haver' no sentido de existir é impessoal e invariável, e 'divergências' é sujeito (não objeto): 'há divergências' está correto.",
    dificuldade: 2,
    tags: ["pronomes", "casos oblíquos", "regência", "erro de concordância"],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Classes de palavras",
  },
  // Bloco 1: Interpretação de Textos e Tipologia (12 questões)
  {
    id: "port-008-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "No texto 'O relatório apresentado pelo setor de análise contém informações que são confidenciais e que não podem ser divulgadas', ambas as orações subordinadas adjetivas introduzidas pelo pronome relativo 'que' são classificadas como restritivas, pois limitam o significado do termo antecedente 'informações'.",
    resposta: "ERRADO",
    explicacao:
      "A primeira oração ('que são confidenciais') é explicativa (apenas explica, não limita - poderia ser omitida sem prejuízo da identificação). A segunda ('que não podem ser divulgadas') também é explicativa. Seriam restritivas se não houvesse vírgula antes e se limitassem o sentido (ex: 'informações que são confidenciais' vs 'informações confidenciais'). A presença da vírgula antes do 'que' indica explicativa.",
    dificuldade: 3,
    tags: [
      "orações adjetivas",
      "restritiva vs explicativa",
      "pronomes relativos",
      "pontuação",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe do período",
  },
  {
    id: "port-009-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'a fim de que' introduz oração subordinada adverbial final, equivalendo a 'para que', e rege modo subjuntivo: 'Aprovou-se a medida a fim de que sejam sanadas as irregularidades'.",
    resposta: "CERTO",
    explicacao:
      "'A fim de que' é locução conjuntiva final, introduz oração adverbial final (propósito), e exige modo subjuntivo (possibilidade, futuridade, não realizada). A conjugação 'sejam' está correta no presente do subjuntivo.",
    dificuldade: 2,
    tags: ["orações adverbiais", "finalidade", "modo subjuntivo", "conjunções"],
    banca_referencia: "FCC",
    assunto: "Sintaxe do período",
  },
  {
    id: "port-010-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "Em 'O servidor procedeu à análise dos documentos', o verbo 'proceder' está corretamente empregado no sentido de 'realizar, executar', com a preposição 'a' exigida pela regência verbal, conforme registro formal da norma culta.",
    resposta: "CERTO",
    explicacao:
      "'Proceder a' = realizar, executar (registro formal). Diferente de 'proceder de' (originar-se) ou 'proceder contra' (adotar medidas). A regência 'procedeu à análise' está correta e é típica de textos oficiais.",
    dificuldade: 2,
    tags: ["regência verbal", "proceder", "gênero oficial", "formalidade"],
    banca_referencia: "CEBRASPE",
    assunto: "Regência verbal",
  },
  {
    id: "port-011-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A palavra 'interessado' é paroxítona terminada em ditongo 'eo', portanto acentuada graficamente na nova ortografia, conforme regra geral de acentuação de paroxítonas.",
    resposta: "ERRADO",
    explicacao:
      "Paroxítonas terminadas em ditongo oral (ao, eo, ou) NÃO são mais acentuadas na ortografia vigente (reforma de 1990, vigor desde 2009/2015). 'Interessado' perdeu o acento. Apenas paroxítonas terminadas em 'i' ou 'u' tônicos (seguidos de s) ou em 'r', 'n', 'l', 'x', 'ps', 'ão', 'ã', 'ãs' são acentuadas.",
    dificuldade: 2,
    tags: ["acentuação gráfica", "paroxítonas", "ditongo", "nova ortografia"],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Acentuação gráfica",
  },
  {
    id: "port-012-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A construção 'Houveram diversos problemas na tramitação do processo' está gramaticalmente correta, pois o verbo 'haver' flexiona-se em número quando usado no sentido de 'acontecer' ou 'existir'.",
    resposta: "ERRADO",
    explicacao:
      "'Haver' no sentido de 'existir' ou 'acontecer' é impessoal e invariável. O correto é 'Houve diversos problemas' (singular) ou 'Havia diversos problemas'. 'Houveram' é erro de concordância vulgar, não aceito na norma culta.",
    dificuldade: 2,
    tags: ["concordância verbal", "haver", "impessoalidade", "erro comum"],
    banca_referencia: "CEBRASPE",
    assunto: "Concordância verbal",
  },

  // Bloco 2: Morfologia e Sintaxe Avançada (12 questões)
  {
    id: "port-013-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "No período 'Caso seja aprovado o projeto, as obras iniciar-se-ão imediatamente', a oração 'Caso seja aprovado o projeto' é subordinada adverbial condicional reduzida da proposição 'caso o projeto seja aprovado', exigindo modo subjuntivo na oração subordinada.",
    resposta: "CERTO",
    explicacao:
      "'Caso' é conjunção condicional (integra o grupo 'se, caso, contanto que, desde que, a menos que'). Introduz oração subordinada adverbial condicional. A forma reduzida 'Caso seja aprovado' equivale a 'Se for aprovado', com verbo no subjuntivo (futuro do subjuntivo/flexão de mesóclise).",
    dificuldade: 3,
    tags: [
      "orações condicionais",
      "modo subjuntivo",
      "redução de orações",
      "conjunções",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe do período",
  },
  {
    id: "port-014-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "O termo 'cujo' é pronome relativo que indica posse e estabelece concordância com o possuído (substantivo que segue), não com o possuidor (termo antecedente), como em 'O servidor cujo relatório foi aprovado'.",
    resposta: "CERTO",
    explicacao:
      "'Cujo' = 'do qual', 'da qual', 'dos quais', 'das quais'. Concorda com o substantivo seguinte (possuído): 'cujo relatório' (relatório = singular, masculino). O possuidor ('servidor') pode ser masculino ou feminino, singular ou plural, mas 'cujo' concorda com 'relatório'.",
    dificuldade: 2,
    tags: ["pronomes relativos", "cujo", "concordância", "posse"],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Classes de palavras",
  },
  {
    id: "port-015-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "Na frase 'Não só apresentou o projeto, como também o defendeu perante a comissão', a correlação conjuntiva 'não só... como também...' estabelece uma relação de adição, equivalente a 'e', mas com ênfase aditiva.",
    resposta: "CERTO",
    explicacao:
      "A correlação 'não só... como também...' (ou 'mas também') é aditiva, acrescentando uma informação à outra com ênfase. É estrutura coordenativa sindética aditiva, similar a 'e', mas com valor enfático de adição cumulativa.",
    dificuldade: 2,
    tags: ["conjunções coordenativas", "adição", "correlação", "sintaxe"],
    banca_referencia: "FCC",
    assunto: "Sintaxe do período",
  },
  {
    id: "port-016-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "O vocábulo 'porquê' com acento circunflexo é substantivo e pode ser substituído por 'motivo' ou 'razão', sendo usado geralmente em final de frase, precedido de artigo: 'Não compreendo o porquê da demora'.",
    resposta: "CERTO",
    explicacao:
      "'Porquê' (circunflexo) = substantivo masculino, sinônimo de 'motivo', 'causa'. Usa-se com artigo ('o porquê', 'um porquê') e frequentemente em final de oração. Diferente de 'por que' (pergunta), 'porquê' (fim de frase interrogativa) e 'porque' (= 'pois').",
    dificuldade: 2,
    tags: [
      "homônimos",
      "porquê/por que/porquê/porque",
      "acentuação",
      "classes de palavras",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Significação das palavras",
  },
  {
    id: "port-017-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "Em 'Mal chegou o ofício, o servidor providenciou a resposta', o advérbio 'mal' tem valor temporal, equivalente a 'logo que', 'assim que', 'no mesmo instante em que', indicando simultaneidade imediata entre as ações.",
    resposta: "CERTO",
    explicacao:
      "'Mal' (advérbio) = 'logo que', 'assim que' (temporal). Indica que uma ação ocorreu imediatamente após outra. Diferente de 'mau' (adj. 'ruim', 'mau exemplo'). A construção 'Mal + verbo, verbo' é temporal, não causal nem concessiva.",
    dificuldade: 3,
    tags: ["advérbios", "temporalidade", "mal vs mau", "conectivos"],
    banca_referencia: "CEBRASPE",
    assunto: "Classes de palavras",
  },
  {
    id: "port-018-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'às vezes' é craseada porque resulta da contração da preposição 'a' (exigida pelo regime de certos verbos ou locuções) com o artigo feminino plural 'as' da expressão 'vezes'.",
    resposta: "CERTO",
    explicacao:
      "'Às vezes' = 'a' (preposição, ex: 'chega a') + 'as' (artigo) + 'vezes'. É crase obrigatória quando houver a preposição 'a' + artigo feminino 'a/as'. A expressão 'às vezes' (= 'ocasionalmente') exige a crase.",
    dificuldade: 2,
    tags: ["crase", "contração", "preposição a", "artigo feminino"],
    banca_referencia: "FCC",
    assunto: "Emprego do sinal indicativo de crase",
  },
  {
    id: "port-019-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "O gerúndio 'sendo' em 'Sendo assim, aprovou-se a medida' tem valor causal, equivalente a 'como era assim', 'visto que era assim', estabelecendo uma relação de causa entre a oração reduzida e a oração principal.",
    resposta: "CERTO",
    explicacao:
      "O gerúndio 'sendo' pode ter valor causal ('como', 'visto que'), condicional ('se for'), temporal ('enquanto'), concessivo ('embora sendo') ou consecutivo. Em 'Sendo assim', é causal (dado que, considerando que).",
    dificuldade: 3,
    tags: [
      "gerúndio",
      "orações reduzidas",
      "causalidade",
      "valores do gerúndio",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe do período",
  },
  {
    id: "port-020-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A concordância verbal na frase 'A maioria dos servidores estavam presentes na reunião' está correta, pois o núcleo 'servidores' determina o plural do verbo, conforme regra de concordância com sujeito composto.",
    resposta: "ERRADO",
    explicacao:
      "O sujeito é 'A maioria dos servidores' = 'maioria' (substantivo coletivo partitivo). O núcleo é 'maioria' (singular), portanto o verbo deve ser singular: 'estava'. A regra é: coletivos partitivos (parte, metade, maioria, etc.) seguidos de 'de' + plural podem concordar no singular (com o coletivo) ou no plural (com o termo partido), mas a norma culta preferencial é o singular com o núcleo coletivo.",
    dificuldade: 3,
    tags: [
      "concordância verbal",
      "coletivos partitivos",
      "sujeito composto",
      "núcleo do sujeito",
    ],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Concordância verbal",
  },
  {
    id: "port-021-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "O termo 'onde' pode ser usado para indicar tempo em construções como 'Onde há vontade, há um caminho', sendo essa uma flexão poética aceita na norma culta estrita.",
    resposta: "ERRADO",
    explicacao:
      "'Onde' é adverbio relativo de lugar (lugar em que). Para tempo, usa-se 'quando' ('Quando há vontade...'). O uso de 'onde' para tempo é considerado coloquial ou poético, mas não é aceito na norma culta estrita, especialmente em textos oficiais.",
    dificuldade: 2,
    tags: [
      "pronomes relativos",
      "onde vs quando",
      "lugar vs tempo",
      "norma culta",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Classes de palavras",
  },
  {
    id: "port-022-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A frase 'Trata-se de um processo de complexa análise' emprega o pronome 'se' como índice de indeterminação do sujeito, caracterizando uma construção impessoal onde não se identifica o agente da ação.",
    resposta: "CERTO",
    explicacao:
      "'Trata-se' = locução verbal impessoal. 'Se' é partícula apassivadora ou índice de indeterminação. Aqui, é índice de indeterminação (ou partícula apassivadora), tornando a oração impessoal (sujeito indeterminado ou genérico). A construção é padrão em textos oficiais para introduzir temas.",
    dificuldade: 3,
    tags: [
      "pronomes",
      "índice de indeterminação",
      "construções impessoais",
      "trata-se",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe da oração",
  },
  {
    id: "port-023-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A palavra 'heroico' é proparoxítona e, portanto, graficamente acentuada na sílaba 'ro', conforme regra geral de acentuação tônica das palavras terminadas em ditongo 'eo'.",
    resposta: "ERRADO",
    explicacao:
      "'Heroico' é proparoxítona (he-rói-co), mas na nova ortografia as proparoxítonas terminadas em ditongo oral (ao, eo, ou) perderam o acento. O correto é 'heroico' (sem acento), pois termina em 'eo'. A regra é: proparoxítonas são acentuadas, EXCETO se terminarem em ditongo oral (i, u tônicos seguidos de outra vogal não são mais acentuados).",
    dificuldade: 3,
    tags: [
      "acentuação gráfica",
      "proparoxítonas",
      "ditongo",
      "nova ortografia",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Acentuação gráfica",
  },
  {
    id: "port-024-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A oração 'Quando puder, responda ao questionamento' é subordinada adverbial temporal reduzida de 'Quando você puder', equivalente a 'Assim que for possível', exigindo modo subjuntivo na oração subordinada.",
    resposta: "CERTO",
    explicacao:
      "'Quando' é conjunção adverbial temporal. A oração reduzida 'Quando puder' (= 'Quando for possível') exige futuro do subjuntivo ('puder'), pois indica ação futura em relação ao momento do enunciado, com possibilidade/condição.",
    dificuldade: 2,
    tags: ["orações temporais", "modo subjuntivo", "redução", "quando"],
    banca_referencia: "FCC",
    assunto: "Sintaxe do período",
  },

  // Bloco 3: Redação Oficial e Textos Administrativos (12 questões)
  {
    id: "port-025-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "Segundo o Manual de Redação da Presidência da República, o vocativo em ofícios deve ser feito com a expressão 'Senhor' ou 'Senhora', seguido do cargo ou nome do destinatário, e nunca com tratamentos como 'Vossa Excelência' ou 'Vossa Senhoria' no corpo do texto.",
    resposta: "ERRADO",
    explicacao:
      "O Manual permite 'Vossa Excelência' (para autoridades com tratamento de Excelência) e 'Vossa Senhoria' (VS) para tratamento genérico formal. 'Senhor' ou 'Senhora' também são aceitos. A proibição é de usar 'Você' ou tratamentos informais. 'Vossa Excelência' é obrigatório para Presidente, Ministros, etc.",
    dificuldade: 3,
    tags: [
      "Manual de Redação",
      "vocativo",
      "tratamento",
      "ofícios",
      "formalidade",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Redação de correspondências oficiais",
  },
  {
    id: "port-026-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "Em memorandos oficiais, a forma de tratamento 'Vossa Senhoria' deve ser empregada para destinatários de hierarquia inferior à do remetente, enquanto 'Vossa Excelência' é reservada para autoridades de hierarquia superior.",
    resposta: "ERRADO",
    explicacao:
      "'Vossa Senhoria' (VS) é tratamento formal genérico, independente de hierarquia. 'Vossa Excelência' (V. Ex.ª) é para autoridades específicas (Presidente, Ministros, Governadores, Deputados, Senadores, Juízes, etc.), não necessariamente superiores. A escolha depende do cargo, não da hierarquia relativa.",
    dificuldade: 3,
    tags: [
      "Manual de Redação",
      "memorandos",
      "formas de tratamento",
      "hierarquia",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Redação de correspondências oficiais",
  },
  {
    id: "port-027-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "O pronome de tratamento 'Vossa Magnificência' é utilizado no tratamento a reitores de universidades públicas e dirigentes de instituições de ensino superior, conforme estabelecido no Manual de Redação da Presidência da República.",
    resposta: "CERTO",
    explicacao:
      "O Manual de Redação da Presidência da República estabelece 'Vossa Magnificência' para Reitores de Universidades e 'Vossa Reverendíssima' para autoridades eclesiásticas. É uma das formas de tratamento específicas previstas.",
    dificuldade: 3,
    tags: [
      "Manual de Redação",
      "formas de tratamento",
      "reitores",
      "universidades",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "FCC",
    assunto: "Redação de correspondências oficiais",
  },
  {
    id: "port-028-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'no intuito de' é considerada prolixa pelo Manual de Redação da Presidência da República, devendo ser substituída por 'para' ou 'a fim de' em textos oficiais para garantir a concisão recomendada.",
    resposta: "ERRADO",
    explicacao:
      "'No intuito de' é aceita e é sinônima de 'a fim de'. O Manual critica excessos de 'de' (preposições em excesso) e vícios como 'o mesmo', 'em relação a' (quando 'sobre' serve), mas 'no intuito de' é locução válida. 'A fim de' é mais comum, mas ambas são aceitas.",
    dificuldade: 3,
    tags: [
      "Manual de Redação",
      "prolixidade",
      "concisão",
      "locuções prepositivas",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Redação de correspondências oficiais",
  },
  {
    id: "port-029-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "Em textos oficiais, o uso de 'e tal' ou 'etc.' no final de enumerações é admitido quando se deseja indicar que a lista não é exaustiva, desde que já haja pelo menos dois itens explícitos antes.",
    resposta: "ERRADO",
    explicacao:
      "O Manual de Redação da Presidência da República proíbe o uso de 'etc.' e 'e tal' em textos oficiais por serem abreviaturas coloquiais e imprecisas. Deve-se ou completar a enumeração ou usar 'entre outros', 'entre outras', ou reformular a frase.",
    dificuldade: 2,
    tags: [
      "Manual de Redação",
      "enumeração",
      "etc",
      "proibições",
      "formalidade",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Redação de correspondências oficiais",
  },
  {
    id: "port-030-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'em anexo' deve ser grafada separadamente, sem hífen, quando usada como locução adverbial ('envio o documento em anexo'), mas recebe hífen quando usada como adjetivo antes do substantivo ('o anexo-documento').",
    resposta: "CERTO",
    explicacao:
      "'Em anexo' (locução adverbial, separado) vs 'anexo' (adjetivo). Quanto ao hífen, 'anexo' como adjetivo não leva hífen ('documento anexo'), mas quando substantivo composto pode haver hífen ('anexo-documento' é raro). A regra geral é: 'em anexo' separado, 'anexo' junto como adjetivo pós-posto.",
    dificuldade: 3,
    tags: ["Manual de Redação", "anexo", "hífen", "locuções", "ortografia"],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "FCC",
    assunto: "Ortografia oficial",
  },
  {
    id: "port-031-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "O uso de parágrafos numerados em textos oficiais é obrigatório apenas em decretos e portarias, sendo facultativo em ofícios e memorandos, conforme determinação expressa do Manual de Redação da Presidência da República.",
    resposta: "ERRADO",
    explicacao:
      "O Manual recomenda a divisão em parágrafos numerados (1º, 2º, etc.) para TODOS os textos oficiais que sejam estruturados em argumentos ou itens, facilitando a referência. Não é obrigatório, mas é recomendado para ofícios extensos. A afirmação de 'obrigatório apenas em decretos' é falsa.",
    dificuldade: 3,
    tags: [
      "Manual de Redação",
      "estrutura textual",
      "parágrafos numerados",
      "ofícios",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Redação de correspondências oficiais",
  },
  {
    id: "port-032-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'no tocante a' é considerada arcaica e deve ser evitada em textos oficiais modernos, sendo preferível o uso de 'quanto a', 'a respeito de' ou 'sobre'.",
    resposta: "ERRADO",
    explicacao:
      "'No tocante a' é formal, mas não é arcaica. É aceita na linguagem oficial, embora 'sobre', 'quanto a', 'a respeito de' sejam mais simples. O Manual não proíbe 'no tocante a', apenas sugere preferência por termos mais diretos quando possível.",
    dificuldade: 2,
    tags: ["Manual de Redação", "arcaísmos", "formalidade", "locuções"],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Redação de correspondências oficiais",
  },
  {
    id: "port-033-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "O pronome de segunda pessoa 'você' é aceito em textos oficiais quando o destinatário é pessoa física de hierarquia equivalente à do remetente, desde que não seja autoridade com tratamento específico.",
    resposta: "ERRADO",
    explicacao:
      "O Manual de Redação da Presidência da República proíbe expressamente o uso de 'você' em textos oficiais. Deve-se usar 'Vossa Senhoria' (VS) ou, no vocativo, 'Senhor'/'Senhora'. 'Você' é considerado tratamento informal, inadequado para a Administração Pública.",
    dificuldade: 2,
    tags: [
      "Manual de Redação",
      "você",
      "proibições",
      "tratamento",
      "formalidade",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Redação de correspondências oficiais",
  },
  {
    id: "port-034-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "Em ofícios dirigidos a autoridades estrangeiras, o tratamento deve seguir as normas diplomáticas internacionais, podendo-se utilizar 'Your Excellency' para autoridades de nível ministerial, independentemente do Manual de Redação da Presidência da República.",
    resposta: "CERTO",
    explicacao:
      "Para autoridades estrangeiras, aplicam-se as normas do Protocolo do Itamaraty e convenções diplomáticas. 'Your Excellency' é tratamento adequado para ministros e equivalentes em correspondência internacional.",
    dificuldade: 3,
    tags: [
      "Manual de Redação",
      "correspondência internacional",
      "protocolo",
      "autoridades estrangeiras",
    ],
    fonte_legal: [
      "Manual de Redação da Presidência da República",
      "Protocolo do Itamaraty",
    ],
    banca_referencia: "FGV",
    assunto: "Redação de correspondências oficiais",
  },
  {
    id: "port-035-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'fazendo jus ao expediente' é vício de linguagem comum em textos administrativos e deve ser substituída por 'conforme solicitado' ou 'atendendo ao pedido', segundo as recomendações do Manual de Redação.",
    resposta: "CERTO",
    explicacao:
      "'Fazendo jus ao expediente' é considerada expressão burocrática, viciada e desnecessária. O Manual recomenda linguagem direta: 'conforme solicitado', 'atendendo ao pedido', 'em resposta ao ofício'.",
    dificuldade: 2,
    tags: [
      "Manual de Redação",
      "vícios de linguagem",
      "burocratismos",
      "concisão",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Redação de correspondências oficiais",
  },
  {
    id: "port-036-v2",
    disciplina: "PORTUGUES",
    enunciado:
      "A grafia 'para' é a única forma correta da preposição, sendo incorretas as formas 'prá', 'pra' ou 'p'ra', mesmo em textos informais ou coloquiais.",
    resposta: "CERTO",
    explicacao:
      "Na norma culta escrita, apenas 'para' é aceito. 'Pra', 'prá', 'p'ra' são formas coloquiais/fonéticas, inadequadas para textos oficiais e formais. O Manual de Redação exige a forma completa 'para'.",
    dificuldade: 1,
    tags: ["ortografia", "preposições", "para vs pra", "norma culta"],
    banca_referencia: "FCC",
    assunto: "Ortografia oficial",
  },
  {
    id: "port-037-v3",
    disciplina: "PORTUGUES",
    enunciado:
      "No trecho de decisão judicial: 'Diante do exposto, julgo PARCIALMENTE PROCEDENTE o pedido para reconhecer o direito do autor à correção monetária, nos termos da fundamentação.' A expressão 'Diante do exposto' estabelece coesão sequencial, remetendo aos argumentos anteriormente apresentados, sendo recurso adequado em textos jurídicos.",
    resposta: "CERTO",
    explicacao:
      "'Diante do exposto' é locução conectora de fechamento, típica de textos jurídicos e oficiais. Estabelece coesão referencial anafórica, retomando todo o conteúdo anterior. É amplamente aceita e recomendada em peças processuais e decisões judiciais.",
    dificuldade: 2,
    tags: [
      "coesão textual",
      "anáfora",
      "texto jurídico",
      "decisão judicial",
      "fechamento",
    ],
    banca_referencia: "FGV",
    assunto: "Coesão textual em textos jurídicos",
    ano: 2023,
  },
  {
    id: "port-038-v3",
    disciplina: "PORTUGUES",
    enunciado:
      "A construção 'Haviam muitos recursos pendentes de análise no tribunal' está gramaticalmente correta, pois o verbo 'haver' no sentido de 'existir' pode ser flexionado no plural quando o sujeito posposto está explícito.",
    resposta: "ERRADO",
    explicacao:
      "O verbo 'haver' no sentido de 'existir' ou 'acontecer' é IMPESSOAL, portanto invariável. O correto é 'Havia muitos recursos pendentes' (singular). A flexão para o plural ('haviam') é erro gramatical grave, característico da linguagem coloquial, inadmissível em textos formais e jurídicos.",
    dificuldade: 2,
    tags: [
      "concordância verbal",
      "haver impessoal",
      "erro comum",
      "texto formal",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Concordância verbal com verbo haver",
    ano: 2022,
  },
];

// Estatísticas do módulo
export const totalQuestoesPortugues = questoesPortugues.length;
export const distribuicaoDificuldadePortugues = {
  1: questoesPortugues.filter((q) => q.dificuldade === 1).length,
  2: questoesPortugues.filter((q) => q.dificuldade === 2).length,
  3: questoesPortugues.filter((q) => q.dificuldade === 3).length,
};
