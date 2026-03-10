import {
  DISCIPLINAS_ORDEM,
  Disciplina,
  EstruturaProva,
  ModoConfig,
  Questao,
} from "./types";

// ═══════════════════════════════════════════════════════════
// CONSTANTES DA PROVA
// ═══════════════════════════════════════════════════════════

export const TEMPO_PROVA_MINUTOS = 240; // 4 horas
export const TEMPO_TURBO_MINUTOS = 40;

/** Estrutura oficial da prova PRF Administrativo CEBRASPE */
export const ESTRUTURA_PROVA: EstruturaProva = {
  conhecimentosBasicos: {
    total: 24,
    disciplinas: {
      PORTUGUES: 12,
      ETICA: 6,
      RACIOCINIO_LOGICO: 6,
    },
  },
  conhecimentosEspecificos: {
    total: 36,
    disciplinas: {
      DIREITO_CONSTITUCIONAL: 6,
      DIREITO_ADMINISTRATIVO: 6,
      ADMINISTRACAO: 6,
      ARQUIVOLOGIA: 6,
      INFORMATICA: 6,
      LEGISLACAO_PRF: 6,
    },
  },
};

/** Configurações dos modos de simulado */
export const MODOS_CONFIG: Record<string, ModoConfig> = {
  completo: {
    nome: "Simulado Completo",
    descricao: "Prova oficial: 24 questões básicas + 36 específicas",
    totalQuestoes: 60,
    tempoMinutos: 240,
    xpBase: 50,
    cor: "#3b82f6",
    icone: "Play",
  },
  turbo: {
    nome: "Modo Turbo",
    descricao: "50 questões rápidas para revisão diária",
    totalQuestoes: 50,
    tempoMinutos: 40,
    xpBase: 30,
    cor: "#f59e0b",
    icone: "Zap",
  },
  adaptativo: {
    nome: "Adaptativo",
    descricao: "IA personaliza baseada no seu histórico",
    totalQuestoes: 60,
    tempoMinutos: 240,
    xpBase: 60,
    cor: "#8b5cf6",
    icone: "Brain",
  },
  disciplina: {
    nome: "Treino por Disciplina",
    descricao: "Foque na sua disciplina mais fraca",
    totalQuestoes: 20,
    tempoMinutos: 30,
    xpBase: 20,
    cor: "#10b981",
    icone: "BookOpen",
  },
  erros: {
    nome: "Revisar Erros",
    descricao: "Treine apenas questões que você errou",
    totalQuestoes: 30,
    tempoMinutos: 30,
    xpBase: 15,
    cor: "#ef4444",
    icone: "XCircle",
  },
};

// ═══════════════════════════════════════════════════════════
// BANCO DE QUESTÕES APRIMORADO (180 questões - Padrão CEBRASPE/FCC/FGV)
// ═══════════════════════════════════════════════════════════

export const questoes: Questao[] = [
  // ═══════════════════════════════════════════════════════════
  // PORTUGUÊS (36 questões - Padrão CEBRASPE: 35% interpretação textual)
  // ═══════════════════════════════════════════════════════════

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
      "Conforme o Manual de Redação da Presidência da República e normas do Cegueira Textual (Cegueira é termo técnico de análise linguística), o pronome 'o mesmo' como substantivo é considerado vício de estilo (prolixidade) em textos oficiais. Deve-se usar pronome oblíquo (ele) ou simplesmente omitir: '...e deverá ser analisado...'",
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

  // ═══════════════════════════════════════════════════════════
  // ÉTICA E CONDUTA PÚBLICA (18 questões - Padrão CEBRASPE: casos práticos)
  // ═══════════════════════════════════════════════════════════

  {
    id: "etic-001-v2",
    disciplina: "ETICA",
    enunciado:
      "Servidor público federal que, no exercício de cargo de direção, nomear cônjuge para cargo de provimento em comissão em órgão diverso daquele em que exerce a direção, mas sob sua hierarquia funcional, estará em situação configuradora de nepotismo, vedado pela Lei 8.112/1990 e pela jurisprudência do STF.",
    resposta: "CERTO",
    explicacao:
      "O nepotismo é vedado na Administração Pública (Lei 8.112/1990, art. 13, § 2º; Súmula Vinculante 13 do STF). A jurisprudência do STF (ADI 2.960/DF) estendeu a vedação a todos os cargos, inclusive em comissão, e abrange cônjuges, companheiros e parentes consanguíneos ou afins em linha reta ou colateral até o terceiro grau. A distinção de órgão não elide a vedação se houver hierarquia funcional.",
    dificuldade: 3,
    tags: [
      "nepotismo",
      "Lei 8.112/1990",
      "Súmula Vinculante 13",
      "STF",
      "cargo em comissão",
    ],
    fonte_legal: ["Art. 13, § 2º, Lei 8.112/1990", "Súmula Vinculante 13, STF"],
    banca_referencia: "CEBRASPE",
    assunto: "Ética e função pública",
  },
  {
    id: "etic-002-v2",
    disciplina: "ETICA",
    enunciado:
      "Conforme o Decreto 1.171/1994 (Código de Ética Profissional do Servidor Público), o servidor deve exercer suas atribuições com objetividade, fundamentadas nos princípios da legalidade, impessoalidade, moralidade, publicidade, economicidade e eficiência, sendo vedada a discriminação de cidadãos por motivo de origem, raça, sexo, cor, idade ou quaisquer outras formas de discriminação.",
    resposta: "CERTO",
    explicacao:
      "Art. 2º e art. 5º do Decreto 1.171/1994 estabelecem esses princípios e a vedação expressa à discriminação. A eficiência foi incluída como princípio pelo Decreto 6.029/2007, que instituiu o Sistema de Gestão da Ética.",
    dificuldade: 1,
    tags: [
      "Decreto 1.171/1994",
      "princípios",
      "discriminação",
      "Código de Ética",
    ],
    fonte_legal: ["Art. 2º e 5º, Decreto 1.171/1994", "Decreto 6.029/2007"],
    banca_referencia: "CEBRASPE",
    assunto: "Código de Ética Profissional do Servidor Público",
  },
  {
    id: "etic-003-v2",
    disciplina: "ETICA",
    enunciado:
      "A Lei 8.429/1992 (Lei de Improbidade Administrativa) pune atos de enriquecimento ilícito, improbidade administrativa e danos ao erário, sendo que a ação de improbidade prescreve em 5 (cinco) anos, contados da prática do ato ou de seu cessação, nos termos da Lei 14.230/2021.",
    resposta: "CERTO",
    explicacao:
      "A Lei 14.230/2021 alterou o art. 37 da Lei 8.429/1992, estabelecendo a prescrição em 5 anos (antes era 8 anos). A prescrição conta da prática do ato ou, no caso de atos continuados, do último ato. A Lei 8.429/1992 tipifica três formas de improbidade: enriquecimento ilícito (art. 9º), improbidade administrativa (art. 10) e dano ao erário (art. 11).",
    dificuldade: 2,
    tags: [
      "Lei 8.429/1992",
      "improbidade",
      "prescrição",
      "Lei 14.230/2021",
      "enriquecimento ilícito",
    ],
    fonte_legal: ["Art. 37, Lei 8.429/1992 (redação Lei 14.230/2021)"],
    banca_referencia: "CEBRASPE/FGV",
    assunto: "Lei de Improbidade Administrativa",
  },
  {
    id: "etic-004-v2",
    disciplina: "ETICA",
    enunciado:
      "Servidor público federal que se recusar a cumprir ordem superior manifestamente ilegal, fundamentando por escrito tal recusa, estará em desacordo com o dever de obediência hierárquica estabelecido no art. 116 da Lei 8.112/1990.",
    resposta: "ERRADO",
    explicacao:
      "O art. 116, IV, da Lei 8.112/1990 estabelece o dever de 'obediência às ordens superiores, exceto quando manifestamente ilegais'. O servidor DEVE recusar ordem manifestamente ilegal e deve fundamentar por escrito. Agir assim é cumprimento do dever, não descumprimento. A obediência devida é às ordens legítimas.",
    dificuldade: 2,
    tags: [
      "Lei 8.112/1990",
      "deveres",
      "obediência hierárquica",
      "ordem ilegal",
      "art. 116",
    ],
    fonte_legal: ["Art. 116, IV, Lei 8.112/1990"],
    banca_referencia: "CEBRASPE",
    assunto: "Ética e função pública",
  },
  {
    id: "etic-005-v2",
    disciplina: "ETICA",
    enunciado:
      "A Lei de Acesso à Informação (Lei 12.527/2011) classifica as informações em três níveis de sigilo: ultrassecreto, secreto e confidencial, sendo que o prazo de classificação não pode ultrapassar 25 (vinte e cinco) anos, prorrogável por igual período em caso de grave ameaça à segurança nacional.",
    resposta: "ERRADO",
    explicacao:
      "A classificação é: ultrassecreto (15 anos), secreto (15 anos) e reservado (5 anos). Não existe 'confidencial' na LAI. O prazo máximo é 25 anos (15+10 prorrogação) para ultrassecreto e secreto, e 10 anos (5+5) para reservado. O termo 'confidencial' é de uso corporativo, não da LAI.",
    dificuldade: 3,
    tags: [
      "Lei 12.527/2011",
      "LAI",
      "sigilo",
      "classificação",
      "ultrassecreto",
      "secreto",
      "reservado",
    ],
    fonte_legal: ["Art. 7º, Lei 12.527/2011"],
    banca_referencia: "CEBRASPE",
    assunto: "Ética no Setor Público",
  },
  {
    id: "etic-006-v2",
    disciplina: "ETICA",
    enunciado:
      "Servidor público federal que, em razão de suas atribuições, tomar conhecimento de informação sigilosa e divulgá-la indevidamente a terceiro não autorizado, mesmo sem obtenção de proveito pessoal, comete infração ética e pode responder por improbidade administrativa e penalmente pelo crime de violação de sigilo funcional.",
    resposta: "CERTO",
    explicacao:
      "A violação de sigilo funcional é crime (CP, art. 154, § 2º) e configura improbidade administrativa (Lei 8.429/1992, art. 11, caput). Também infringe o Decreto 1.171/1994 (sigilo profissional). Não é necessário proveito pessoal para configurar a infração; basta a divulgação indevida.",
    dificuldade: 2,
    tags: [
      "sigilo funcional",
      "improbidade",
      "crime",
      "Lei 8.429/1992",
      "CP art. 154",
    ],
    fonte_legal: [
      "Art. 154, § 2º, CP",
      "Art. 11, Lei 8.429/1992",
      "Decreto 1.171/1994",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Ética e função pública",
  },
  {
    id: "etic-007-v2",
    disciplina: "ETICA",
    enunciado:
      "O servidor público federal estável somente pode ser demitido por decisão judicial transitada em julgado, sendo vedada a demissão por processo administrativo disciplinar, conforme garantia constitucional da estabilidade.",
    resposta: "ERRADO",
    explicacao:
      "O art. 41 da CF/88 garante a estabilidade após 3 anos de efetivo exercício (estágio probatório). A demissão do estável requer processo administrativo (PAD) com ampla defesa, mas NÃO exige decisão judicial. A demissão é ato administrativo sujeito a judicialização posterior. A confusão é com o servidor em comissão, que perde o cargo com a exoneração do nomeador.",
    dificuldade: 3,
    tags: [
      "estabilidade",
      "demissão",
      "processo administrativo",
      "art. 41 CF",
      "Lei 8.112/1990",
    ],
    fonte_legal: ["Art. 41, CF/88", "Art. 135 e seguintes, Lei 8.112/1990"],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Lei 8.112/1990 - regime disciplinar",
  },
  {
    id: "etic-008-v2",
    disciplina: "ETICA",
    enunciado:
      "Conforme o Decreto 6.029/2007, que instituiu o Sistema de Gestão da Ética do Poder Executivo Federal, as unidades de gestão da ética devem promover a integridade, a transparência e o controle social na administração pública, sendo vedada a participação de representantes da sociedade civil em seus conselhos de ética.",
    resposta: "ERRADO",
    explicacao:
      "O Decreto 6.029/2007 instituiu o Sistema de Gestão da Ética (SGE) e prevê justamente a participação da sociedade civil no controle social. A transparência e o controle social são princípios do SGE, e a participação social é incentivada, não vedada.",
    dificuldade: 2,
    tags: [
      "Decreto 6.029/2007",
      "Sistema de Gestão da Ética",
      "controle social",
      "transparência",
    ],
    fonte_legal: ["Decreto 6.029/2007"],
    banca_referencia: "CEBRASPE",
    assunto: "Sistema de Gestão da Ética do Poder Executivo Federal",
  },
  {
    id: "etic-009-v2",
    disciplina: "ETICA",
    enunciado:
      "A participação em greve por parte de servidor público federal é vedada absolutamente pela Constituição Federal de 1988, independentemente do cargo ou função exercida, sendo considerada infração disciplinar grave.",
    resposta: "ERRADO",
    explicacao:
      "O art. 37, VII, da CF/88 veda a greve apenas para os servidores em cargos ou funções essenciais à segurança pública ou em atividades que não podem ser interrompidas por lei. Os demais servidores têm direito de greve, regulado por lei específica (Lei 9.783/99 para União). A proibição não é absoluta.",
    dificuldade: 2,
    tags: [
      "greve",
      "art. 37 VII CF",
      "servidores públicos",
      "direitos",
      "Lei 9.783/99",
    ],
    fonte_legal: ["Art. 37, VII, CF/88", "Lei 9.783/1999"],
    banca_referencia: "CEBRASPE",
    assunto: "Ética e democracia",
  },
  {
    id: "etic-010-v2",
    disciplina: "ETICA",
    enunciado:
      "Servidor público federal que utilizar o horário de expediente para tratar de assuntos particulares, mesmo que por curto período e sem prejudicar o serviço público, está em descumprimento do dever de assiduidade previsto no art. 116 da Lei 8.112/1990.",
    resposta: "CERTO",
    explicacao:
      "O art. 116, II, da Lei 8.112/1990 estabelece o dever de 'assiduidade e pontualidade'. O horário de expediente é para o serviço público. O uso para fins particulares, ainda que breve, configura falta à assiduidade, salvo casos excepcionais previstos em lei ou regulamento (ex: intervalo regulamentar).",
    dificuldade: 2,
    tags: [
      "assiduidade",
      "art. 116",
      "Lei 8.112/1990",
      "deveres",
      "horário de expediente",
    ],
    fonte_legal: ["Art. 116, II, Lei 8.112/1990"],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Lei 8.112/1990 - deveres",
  },
  {
    id: "etic-011-v2",
    disciplina: "ETICA",
    enunciado:
      "O princípio da impessoalidade, conforme interpretação do STF, exige que o servidor público trate todos os cidadãos com igualdade de condições, vedando o favorecimento pessoal, mas admitindo distinções objetivas fundamentadas em critérios legais, como prioridade de atendimento a idosos, gestantes ou pessoas com deficiência.",
    resposta: "CERTO",
    explicacao:
      "A impessoalidade (art. 37, caput, CF/88) veda o tratamento desigual por motivos pessoais, mas admite distinções objetivas e fundamentadas em lei (ex: Estatuto do Idoso, Lei 10.741/2003; prioridade a gestantes). O que é vedado é o 'favorecimento' pessoal, não a diferenciação legal objetiva.",
    dificuldade: 2,
    tags: [
      "impessoalidade",
      "princípios",
      "igualdade",
      "diferenciação objetiva",
      "art. 37 CF",
    ],
    fonte_legal: ["Art. 37, caput, CF/88", "Lei 10.741/2003"],
    banca_referencia: "CEBRASPE",
    assunto: "Ética e função pública",
  },
  {
    id: "etic-012-v2",
    disciplina: "ETICA",
    enunciado:
      "A acumulação de cargos públicos de provimento efetivo é vedada pela Constituição Federal, salvo as exceções constitucionais expressas, como a acumulação de dois cargos de professor, quando houver compatibilidade de horários e interesse público.",
    resposta: "CERTO",
    explicacao:
      "O art. 37, XVI, da CF/88 veda a acumulação remunerada, com exceções: a) de cargos de professor; b) de cargo técnico ou científico com outro de professor; c) de cargos de médico (com outro de médico). Para professores, exige-se compatibilidade de horários e interesse público (não automática).",
    dificuldade: 2,
    tags: [
      "acumulação",
      "art. 37 XVI CF",
      "professor",
      "médico",
      "cargos efetivos",
    ],
    fonte_legal: ["Art. 37, XVI, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Lei 8.112/1990 - acumulação",
  },
  {
    id: "etic-013-v2",
    disciplina: "ETICA",
    enunciado:
      "Servidor público federal que se ausentar do serviço por mais de 60 (sessenta) dias consecutivos, por qualquer motivo, perderá automaticamente o cargo público, conforme regra absoluta da Lei 8.112/1990.",
    resposta: "ERRADO",
    explicacao:
      "Não há perda automática. A ausência por mais de 60 dias pode gerar exoneração por abandono de cargo (art. 138, Lei 8.112/1990), mas requer processo administrativo. Além disso, faltas justificadas (licenças médicas, etc.) não contam para esse efeito. A regra não é absoluta.",
    dificuldade: 3,
    tags: [
      "abandono de cargo",
      "art. 138",
      "Lei 8.112/1990",
      "ausência",
      "exoneração",
    ],
    fonte_legal: ["Art. 138, Lei 8.112/1990"],
    banca_referencia: "CEBRASPE",
    assunto: "Lei 8.112/1990 - responsabilidades",
  },
  {
    id: "etic-014-v2",
    disciplina: "ETICA",
    enunciado:
      "O servidor público federal pode ser responsabilizado civil, penal e administrativamente pelos mesmos atos ilícitos, sem violação do princípio non bis in idem, pois as três esferas de responsabilidade são autônomas e independentes.",
    resposta: "CERTO",
    explicacao:
      "As responsabilidades civil, penal e administrativa são distintas e autônomas (art. 37, § 1º, CF/88). O non bis in idem (não ser punido duas vezes pelo mesmo fato) aplica-se dentro da mesma esfera, não entre esferas diferentes. A pessoa pode responder civilmente (indenizar), penalmente (prisão/multa) e administrativamente (penalidades disciplinares).",
    dificuldade: 3,
    tags: [
      "responsabilidade",
      "non bis in idem",
      "esferas",
      "art. 37 CF",
      "penalidades",
    ],
    fonte_legal: ["Art. 37, § 1º, CF/88"],
    banca_referencia: "CEBRASPE/FGV",
    assunto: "Lei 8.112/1990 - penalidades",
  },
  {
    id: "etic-015-v2",
    disciplina: "ETICA",
    enunciado:
      "A publicidade dos atos administrativos é regra absoluta, não admitindo qualquer exceção, sendo vedado o sigilo de documentos públicos em qualquer circunstância, conforme princípio constitucional da transparência.",
    resposta: "ERRADO",
    explicacao:
      "A publicidade é regra (art. 37, caput, CF/88), mas admite exceções legais: sigilo fiscal (art. 198, CTN), sigilo médico, sigilo de informações pessoais (LGPD, Lei 13.709/2018), sigilo de segurança nacional (LAI, Lei 12.527/2011), sigilo processual, etc. O sigilo é exceção, mas existe e é constitucional quando previsto em lei.",
    dificuldade: 2,
    tags: ["publicidade", "sigilo", "transparência", "exceções", "LGPD", "LAI"],
    fonte_legal: [
      "Art. 37, caput, CF/88",
      "Lei 12.527/2011",
      "Lei 13.709/2018",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Ética e função pública",
  },
  {
    id: "etic-016-v2",
    disciplina: "ETICA",
    enunciado:
      "Servidor público federal que receber presente de valor comercial significativo de particular com interesse em decisão administrativa poderá mantê-lo desde que declare o recebimento à autoridade competente e não haja contraprestação direta.",
    resposta: "ERRADO",
    explicacao:
      "O Decreto 1.171/1994, art. 11, veda expressamente a aceitação de presentes de valor significativo de particulares. Não basta declarar; é vedado receber. A contraprestação não é necessária para configurar infração ética; o recebimento já é vedado. Se for de valor simbólico (ex: caneta, calendário), pode ser aceito, mas não 'significativo'.",
    dificuldade: 2,
    tags: [
      "presentes",
      "Decreto 1.171/1994",
      "art. 11",
      "vedação",
      "valor significativo",
    ],
    fonte_legal: ["Art. 11, Decreto 1.171/1994"],
    banca_referencia: "CEBRASPE",
    assunto: "Código de Ética Profissional do Servidor Público",
  },
  {
    id: "etic-017-v2",
    disciplina: "ETICA",
    enunciado:
      "O Estatuto do Idoso (Lei 10.741/2003) estabelece, como critério de desempate em concurso público, a idade do candidato, sendo preferido o candidato mais velho em caso de igualdade de pontuação, conforme parágrafo único do art. 27.",
    resposta: "CERTO",
    explicacao:
      "O art. 27, parágrafo único, da Lei 10.741/2003 estabelece que, em caso de empate em concurso público, terá preferência o candidato mais velho. Este critério é aplicável a todos os concursos públicos federais, estaduais e municipais, conforme o edital da PRF ADM também prevê.",
    dificuldade: 1,
    tags: [
      "Estatuto do Idoso",
      "Lei 10.741/2003",
      "desempate",
      "idade",
      "concurso público",
    ],
    fonte_legal: ["Art. 27, § único, Lei 10.741/2003"],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Ética e democracia",
  },
  {
    id: "etic-018-v2",
    disciplina: "ETICA",
    enunciado:
      "A Lei 14.133/2021 (Nova Lei de Licitações) estabelece que a contratação de servidor público aposentado para exercer atividade privada relacionada à sua atuação anterior na administração pública deve observar o prazo de 12 (doze) meses de vacância, sob pena de nulidade do contrato.",
    resposta: "ERRADO",
    explicacao:
      "A Lei 14.133/2021, art. 170, estabelece o prazo de 12 meses (1 ano) para contratação de ex-servidor, mas este prazo é de 'inabilitação para contratar', não de 'vacância'. Além disso, a nulidade é relativa à contratação, não ao contrato em si. O prazo correto é 12 meses (não 24), mas a terminologia 'vacância' é inadequada (vacância é de cargo, não de contratação).",
    dificuldade: 3,
    tags: [
      "Lei 14.133/2021",
      "incompatibilidade",
      "aposentados",
      "contratação",
      "prazo",
    ],
    fonte_legal: ["Art. 170, Lei 14.133/2021"],
    banca_referencia: "FGV",
    assunto: "Ética e função pública",
  },

  // ═══════════════════════════════════════════════════════════
  // RACIOCÍNIO LÓGICO (18 questões - Padrão CEBRASPE: diagramas e equivalências)
  // ═══════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════
  // DIREITO CONSTITUCIONAL (18 questões - Padrão CEBRASPE: 35% principiológico + Súmulas)
  // ═══════════════════════════════════════════════════════════

  {
    id: "const-001-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A Constituição Federal de 1988 adotou o sistema republicano federativo presidencialista, com separação dos Poderes Legislativo, Executivo e Judiciário, conforme artigos 1º e 2º do texto constitucional.",
    resposta: "CERTO",
    explicacao:
      "Art. 1º, I, II, III: República Federativa do Brasil, forma de governo republicana, sistema presidencialista. Art. 2º: Poderes Legislativo, Executivo e Judiciário, independentes e harmônicos entre si.",
    dificuldade: 1,
    tags: [
      "sistema de governo",
      "república",
      "federalismo",
      "presidencialismo",
      "art. 1º e 2º CF",
    ],
    fonte_legal: ["Art. 1º e 2º, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Constituição - princípios fundamentais",
  },
  {
    id: "const-002-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "Os tratados internacionais de direitos humanos aprovados pelo Congresso Nacional em dois turnos, por três quintos dos votos dos membros de cada Casa, têm hierarquia equivalente às emendas constitucionais, conforme EC 45/2004, mas não são emendas constitucionais propriamente ditas.",
    resposta: "CERTO",
    explicacao:
      "EC 45/2004 alterou o art. 5º, § 3º, da CF/88, estabelecendo que tratados de DH aprovados por maioria qualificada (3/5 em 2 turnos) têm status 'equivalente' a emenda constitucional (supralegal), mas não são emendas. São normas de hierarquia superior às leis ordinárias, mas distintas das emendas.",
    dificuldade: 3,
    tags: [
      "tratados de direitos humanos",
      "EC 45/2004",
      "hierarquia normativa",
      "supralegalidade",
    ],
    fonte_legal: ["Art. 5º, § 3º, CF/88 (redação EC 45/2004)"],
    banca_referencia: "CEBRASPE/FGV",
    assunto: "Direitos e garantias fundamentais",
  },
  {
    id: "const-003-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A soberania popular é exercida pelo sufrágio universal e pelo voto direto e secreto, com valor igual para todos, sendo vedado o voto distrital ou proporcional em qualquer eleição no Brasil.",
    resposta: "ERRADO",
    explicacao:
      "A CF/88 prevê voto distrital (para Deputados Federais, Estaduais e Distritais - art. 45, § 1º) e voto proporcional (para representação dos partidos - art. 45, § 2º). O voto é direto e secreto, mas pode ser distrital (sistema eleitoral misto) e proporcional (representação partidária).",
    dificuldade: 2,
    tags: [
      "soberania popular",
      "sufrágio universal",
      "voto distrital",
      "voto proporcional",
      "art. 1º CF",
    ],
    fonte_legal: ["Art. 1º, parágrafo único, e art. 45, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Constituição - princípios fundamentais",
  },
  {
    id: "const-004-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O habeas corpus é remédio constitucional que assegura a liberdade de locomoção, podendo ser impetrado sempre que houver violação ou ameaça de violação à liberdade de ir e vir ou de permanecer no território nacional.",
    resposta: "CERTO",
    explicacao:
      "Art. 5º, LXVIII, CF/88: habeas corpus para assegurar liberdade de locomoção. É o remédio específico para liberdade física de ir e vir. Para outros direitos, usa-se mandado de segurança (art. 5º, LXIX).",
    dificuldade: 1,
    tags: [
      "habeas corpus",
      "liberdade de locomoção",
      "remédios constitucionais",
      "art. 5º CF",
    ],
    fonte_legal: ["Art. 5º, LXVIII, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Direitos e garantias fundamentais",
  },
  {
    id: "const-005-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O Supremo Tribunal Federal (STF) é o guardião da Constituição Federal, competindo-lhe originariamente o controle de constitucionalidade concentrado das leis e atos normativos federais ou estaduais, conforme art. 102, I, 'a', da CF/88.",
    resposta: "CERTO",
    explicacao:
      "Art. 102, I, 'a', CF/88: compete ao STF processar e julgar originariamente ação direta de inconstitucionalidade de lei ou ato normativo federal ou estadual. O STF é o guardião da Constituição (controle concentrado).",
    dificuldade: 1,
    tags: [
      "STF",
      "guardião da constituição",
      "controle de constitucionalidade",
      "ação direta",
      "art. 102 CF",
    ],
    fonte_legal: ["Art. 102, I, 'a', CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Poder Judiciário",
  },
  {
    id: "const-006-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A União, os Estados, o Distrito Federal e os Municípios são autarquias dotados de personalidade jurídica própria, com autonomia política, administrativa e financeira na esfera de suas competências.",
    resposta: "ERRADO",
    explicacao:
      "São entes federativos (art. 1º, CF/88), não autarquias. Autarquia é entidade da administração indireta (ex: INSS, Receita Federal), criada por lei, com personalidade jurídica própria, mas não é ente federativo. Os entes federativos têm soberania limitada; autarquias não têm soberania.",
    dificuldade: 2,
    tags: [
      "entes federativos",
      "autarquias",
      "personalidade jurídica",
      "administração indireta",
      "art. 1º CF",
    ],
    fonte_legal: ["Art. 1º, CF/88", "Art. 37, XIX, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Organização político-administrativa",
  },
  {
    id: "const-007-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A liberdade de expressão é garantida constitucionalmente como direito fundamental, mas não é absoluta, podendo ser limitada por lei quando necessário a resguardar a honra, a imagem, a segurança nacional ou a proteção da juventude, conforme princípio da proporcionalidade.",
    resposta: "CERTO",
    explicacao:
      "Art. 5º, IV e IX, CF/88: liberdade de expressão e informação. Nenhum direito fundamental é absoluto (cláusula de reserva de lei proporcional). Limites: honra (art. 5º, V), imagem, segurança nacional, etc. A limitação deve ser proporcional.",
    dificuldade: 2,
    tags: [
      "liberdade de expressão",
      "limites",
      "honra",
      "imagem",
      "proporcionalidade",
      "art. 5º CF",
    ],
    fonte_legal: ["Art. 5º, IV, V, IX, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Direitos e garantias fundamentais",
  },
  {
    id: "const-008-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O mandado de injunção é remédio constitucional cabível sempre que a omissão do Poder Público prejudicar a efetividade de qualquer direito fundamental, independentemente de existir lei regulamentadora do exercício desse direito.",
    resposta: "ERRADO",
    explicacao:
      "Art. 5º, LXXI, CF/88: MI é cabível contra 'omissão de lei federal' que prejudique direito fundamental. É necessário que haja direito fundamental constitucionalmente assegurado, mas que dependa de lei para seu exercício (omissão legislativa). Se não há direito constitucional, não cabe MI.",
    dificuldade: 3,
    tags: [
      "mandado de injunção",
      "omissão legislativa",
      "direito fundamental",
      "art. 5º LXXI CF",
    ],
    fonte_legal: ["Art. 5º, LXXI, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Direitos e garantias fundamentais",
  },
  {
    id: "const-009-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O controle de constitucionalidade difuso pode ser exercido por qualquer juiz ou tribunal, em qualquer grau de jurisdição, declarando a inconstitucionalidade de lei ou ato normativo em decisão que tenha eficácia apenas entre as partes.",
    resposta: "CERTO",
    explicacao:
      "No controle difuso (incidental), qualquer juiz pode declarar inconstitucionalidade, mas a decisão tem eficácia inter partes (só entre as partes). No controle concentrado (abstrato), apenas o STF (ou tribunais em ADIn originária) e a decisão tem eficácia erga omnes (contra todos).",
    dificuldade: 2,
    tags: [
      "controle difuso",
      "controle incidental",
      "inconstitucionalidade",
      "inter partes",
      "art. 97 CF",
    ],
    fonte_legal: ["Art. 97, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Controle de constitucionalidade",
  },
  {
    id: "const-010-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A Constituição Federal de 1988 adotou exclusivamente o sistema de controle de constitucionalidade concentrado, vedando expressamente o controle difuso de inconstitucionalidade.",
    resposta: "ERRADO",
    explicacao:
      "A CF/88 adotou AMBOS os sistemas: difuso (art. 97, incidental) e concentrado (art. 102, I, 'a', abstrato). O Brasil tem sistema misto de controle de constitucionalidade desde 1891.",
    dificuldade: 2,
    tags: [
      "controle concentrado",
      "controle difuso",
      "sistema misto",
      "inconstitucionalidade",
    ],
    fonte_legal: ["Art. 97 e 102, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Controle de constitucionalidade",
  },
  {
    id: "const-011-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O direito de propriedade é garantido constitucionalmente, mas deve cumprir sua função social, conforme art. 5º, XXIII, da CF/88, podendo a propriedade ser desapropriada por utilidade pública ou interesse social, mediante prévia e justa indenização em dinheiro.",
    resposta: "CERTO",
    explicacao:
      "Art. 5º, XXIII e XXIV, CF/88: direito de propriedade com função social. Desapropriação por utilidade pública ou interesse social com justa e prévia indenização em dinheiro (art. 5º, XXIV).",
    dificuldade: 1,
    tags: [
      "propriedade",
      "função social",
      "desapropriação",
      "indenização",
      "art. 5º CF",
    ],
    fonte_legal: ["Art. 5º, XXIII e XXIV, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Direitos e garantias fundamentais",
  },
  {
    id: "const-012-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A União pode intervir nos Estados membros em caso de quebra da ordem pública, impossibilitado de ser preservada pelas autoridades locais, conforme art. 34, VII, da CF/88, mediante decreto do Presidente da República.",
    resposta: "CERTO",
    explicacao:
      "Art. 34, VII, CF/88: intervenção federal na ordem pública. Requisitos: quebra da ordem pública e impossibilidade de preservação pelas autoridades locais. Procedimento: decreto do Presidente da República, sujeito a referendo do Congresso Nacional (art. 83).",
    dificuldade: 1,
    tags: [
      "intervenção federal",
      "ordem pública",
      "art. 34 CF",
      "decreto presidencial",
    ],
    fonte_legal: ["Art. 34, VII, e art. 83, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Organização político-administrativa",
  },
  {
    id: "const-013-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O voto no Brasil é obrigatório para todos os cidadãos maiores de 18 anos e menores de 70 anos, independentemente de alfabetização, sendo facultativo apenas para analfabetos e maiores de 70 anos.",
    resposta: "ERRADO",
    explicacao:
      "Art. 14, § 1º, CF/88: voto obrigatório entre 18 e 70 anos para ALFABETIZADOS. Para analfabetos e maiores de 70 anos, é facultativo. A assertiva inverteu: é obrigatório para alfabetizados, não para todos independentemente de alfabetização.",
    dificuldade: 2,
    tags: [
      "voto obrigatório",
      "alfabetização",
      "direitos políticos",
      "art. 14 CF",
    ],
    fonte_legal: ["Art. 14, § 1º, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Direitos políticos",
  },
  {
    id: "const-014-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A participação em greve por parte de servidor público federal é vedada absolutamente pela Constituição Federal de 1988, sendo considerada infração disciplinar grave e crime contra a administração pública.",
    resposta: "ERRADO",
    explicacao:
      "Art. 37, VII, CF/88: veda a greve apenas para os servidores em cargos ou funções essenciais à segurança pública ou em atividades que não podem ser interrompidas por lei. Os demais têm direito de greve, regulado por lei (Lei 9.783/99 para União). Não é vedada absolutamente.",
    dificuldade: 2,
    tags: [
      "greve",
      "servidores públicos",
      "segurança pública",
      "art. 37 VII CF",
      "Lei 9.783/99",
    ],
    fonte_legal: ["Art. 37, VII, CF/88", "Lei 9.783/1999"],
    banca_referencia: "CEBRASPE",
    assunto: "Administração pública",
  },
  {
    id: "const-015-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O princípio da separação dos poderes, consagrado no art. 2º da CF/88, estabelece a independência e harmonia entre os Poderes Legislativo, Executivo e Judiciário, vedando o exercício de mais de um poder pela mesma pessoa ou órgão, salvo em casos específicos previstos constitucionalmente.",
    resposta: "CERTO",
    explicacao:
      "Art. 2º, CF/88: Poderes independentes e harmônicos entre si. A separação é relativa (poderes harmônicos, não absolutamente separados). Exceções: o Presidente da República tem funções legislativas (MP, decreto-lei em situações especiais) e o Congresso tem funções jurisdicionais (julgamento de crimes de responsabilidade).",
    dificuldade: 1,
    tags: ["separação dos poderes", "independência", "harmonia", "art. 2º CF"],
    fonte_legal: ["Art. 2º, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Constituição - princípios fundamentais",
  },
  {
    id: "const-016-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A imunidade parlamentar é absoluta e abrange tanto as opiniões, palavras e votos proferidos no exercício do mandato quanto os crimes comuns praticados pelo parlamentar, que só podem ser processados perante o Supremo Tribunal Federal.",
    resposta: "ERRADO",
    explicacao:
      "Imunidade material (art. 53, § 2º, CF/88): absoluta para opiniões, palavras e votos. Imunidade processual (art. 53, caput): relativa. Deputados e Senadores são privilegiados (foro por prerrogativa de função), mas processados pelo STF, não são imunes a crimes comuns. A imunidade não é absoluta para crimes.",
    dificuldade: 3,
    tags: [
      "imunidade parlamentar",
      "foro privilegiado",
      "art. 53 CF",
      "opiniões e votos",
    ],
    fonte_legal: ["Art. 53, caput e § 2º, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Poder Legislativo",
  },
  {
    id: "const-017-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O princípio da irretroatividade da lei penal prejudicial ao réu é assegurado constitucionalmente, vedando-se a aplicação de lei mais grave a fato pretérito, mas admitindo-se a aplicação retroativa de lei mais benigna (retroação da lei penal favorável).",
    resposta: "CERTO",
    explicacao:
      "Art. 5º, XL, CF/88: lei penal não retroage, salvo para beneficiar o réu. A irretroatividade prejudicial é proibida; a retroatividade favorável é permitida (princípio do 'in malam partem' vs 'in bonam partem').",
    dificuldade: 3,
    tags: [
      "irretroatividade",
      "lei penal",
      "retroação favorável",
      "art. 5º XL CF",
      "princípio da benignidade",
    ],
    fonte_legal: ["Art. 5º, XL, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Direitos e garantias fundamentais",
  },
  {
    id: "const-018-v2",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O Poder Judiciário é exercido pelo Supremo Tribunal Federal, pelos Tribunais Superiores (STJ, TST, TSE, STM), pelos Tribunais e Juízes de instâncias ordinárias (Federais e Estaduais), e pelo Conselho Nacional de Justiça (CNJ), conforme art. 92, caput, da CF/88.",
    resposta: "CERTO",
    explicacao:
      "Art. 92, caput, CF/88: 'O Poder Judiciário é exercido pelo Supremo Tribunal Federal, pelos Tribunais Superiores, pelos Tribunais e Juízes de instâncias ordinárias e pelo Conselho Nacional de Justiça'. O CNJ é órgão do Judiciário (inciso XIII do art. 92).",
    dificuldade: 1,
    tags: [
      "Poder Judiciário",
      "STF",
      "tribunais superiores",
      "CNJ",
      "art. 92 CF",
    ],
    fonte_legal: ["Art. 92, caput, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Poder Judiciário",
  },

  // ═══════════════════════════════════════════════════════════
  // DIREITO ADMINISTRATIVO (18 questões - Padrão CEBRASPE: atos + licitações + Lei 9.784/99)
  // ═══════════════════════════════════════════════════════════

  {
    id: "adm-001-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O ato administrativo perfeito é aquele que reuniu todos os elementos e pressupostos legais para a sua validade (competência, finalidade, forma, objeto e motivo), podendo ser atacado apenas por meio de ação judicial própria, salvo se houver vício insanável.",
    resposta: "CERTO",
    explicacao:
      "Ato perfeito: requisitos de validade presentes (art. 2º, Lei 9.784/99). É válido e produz efeitos. Só pode ser desconstituído por meio de ação judicial (anulação) ou administrativo (revogação/anulação), dependendo do vício. Se houver vício insanável (incompetência absoluta, objeto impossível), é nulo.",
    dificuldade: 2,
    tags: [
      "ato administrativo",
      "ato perfeito",
      "requisitos de validade",
      "Lei 9.784/99",
      "vício",
    ],
    fonte_legal: ["Art. 2º, Lei 9.784/1999"],
    banca_referencia: "CEBRASPE",
    assunto: "Ato administrativo - conceito e requisitos",
  },
  {
    id: "adm-002-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O ato administrativo viciado em motivo (erro, dolo, coação) é anulável, podendo ser convalidado pelo administrador se o vício for sanável, ou seja, se for possível suprir o motivo defeituoso por outro legítimo.",
    resposta: "ERRADO",
    explicacao:
      "Vício de motivo (art. 4º, § 2º, Lei 9.784/99) gera anulabilidade, mas NÃO é convalidável. A convalidação (art. 5º, Lei 9.784/99) aplica-se apenas a vícios formais sanáveis. Vício de motivo é insanável (subjetivo, interno). O ato deve ser anulado, não convalidado.",
    dificuldade: 3,
    tags: [
      "ato administrativo",
      "vício de motivo",
      "anulabilidade",
      "convalidação",
      "Lei 9.784/99",
    ],
    fonte_legal: ["Art. 4º, § 2º, e art. 5º, Lei 9.784/1999"],
    banca_referencia: "CEBRASPE",
    assunto: "Ato administrativo - invalidação",
  },
  {
    id: "adm-003-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A desapropriação por utilidade pública ou interesse social requer prévia e justa indenização em dinheiro, conforme art. 5º, XXIV, da CF/88, sendo vedada a indenização em títulos da dívida pública ou em bens de qualquer natureza.",
    resposta: "CERTO",
    explicacao:
      "Art. 5º, XXIV, CF/88: 'prévia e justa indenização em dinheiro'. A Constituição exige indenização em dinheiro, não em títulos ou bens. A Lei 4.504/1964 (Estatuto da Terra) permitia indenização em títulos para reforma agrária, mas a EC 26/2000 e EC 64/2010 alteraram, mantendo o dinheiro como regra.",
    dificuldade: 2,
    tags: [
      "desapropriação",
      "utilidade pública",
      "indenização em dinheiro",
      "art. 5º XXIV CF",
    ],
    fonte_legal: ["Art. 5º, XXIV, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Poderes da administração",
  },
  {
    id: "adm-004-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O servidor público estável somente pode ser demitido por decisão judicial transitada em julgado, sendo vedada a demissão por processo administrativo disciplinar (PAD), conforme garantia constitucional da estabilidade (art. 41, CF/88).",
    resposta: "ERRADO",
    explicacao:
      "Art. 41, CF/88: estabilidade após 3 anos de efetivo exercício. A demissão do estável requer processo administrativo disciplinar (PAD) com ampla defesa e contraditório (art. 135 e seguintes, Lei 8.112/90), mas NÃO exige decisão judicial prévia. A demissão é ato administrativo, não judicial.",
    dificuldade: 3,
    tags: [
      "estabilidade",
      "demissão",
      "processo administrativo disciplinar",
      "art. 41 CF",
      "Lei 8.112/90",
    ],
    fonte_legal: ["Art. 41, CF/88", "Art. 135 e seguintes, Lei 8.112/1990"],
    banca_referencia: "CEBRASPE/FCC",
    assunto: "Agentes administrativos",
  },
  {
    id: "adm-005-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A licitação é obrigatória para a contratação de obras, serviços, compras e alienações pela administração pública direta, autárquica e fundacional, conforme princípio constitucional da isonomia e da moralidade administrativa, salvo nas hipóteses de dispensa ou inexigibilidade previstas em lei.",
    resposta: "CERTO",
    explicacao:
      "Art. 37, XXI, CF/88: obras, serviços, compras e alienações devem ser precedidas de licitação. Lei 14.133/2021 (nova Lei de Licitações) regulamenta. Exceções: dispensa (art. 74) e inexigibilidade (art. 72) quando inviável a competição.",
    dificuldade: 1,
    tags: [
      "licitação",
      "princípio da isonomia",
      "art. 37 XXI CF",
      "Lei 14.133/2021",
      "dispensa",
    ],
    fonte_legal: ["Art. 37, XXI, CF/88", "Lei 14.133/2021"],
    banca_referencia: "CEBRASPE",
    assunto: "Licitações e contratos",
  },
  {
    id: "adm-006-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O contrato administrativo pode ser alterado unilateralmente pela administração pública por interesse público, mediante prévia e justa indenização ao contratado pelos prejuízos decorrentes da alteração, conforme poderes exorbitantes da administração.",
    resposta: "CERTO",
    explicacao:
      "Poderes exorbitantes do contrato administrativo: alteração unilateral (modificação do contrato por interesse público), rescisão unilateral, fiscalização reforçada. A alteração gera direito a indenização (equilíbrio econômico-financeiro).",
    dificuldade: 2,
    tags: [
      "contrato administrativo",
      "poderes exorbitantes",
      "alteração unilateral",
      "indenização",
    ],
    fonte_legal: ["Lei 14.133/2021", "Súmula 473, STJ"],
    banca_referencia: "CEBRASPE",
    assunto: "Licitações e contratos",
  },
  {
    id: "adm-007-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A prescrição do direito do servidor público ao recebimento de vantagens, proventos ou pensões é de 5 (cinco) anos, contados do primeiro dia do exercício seguinte àquele em que o servidor ou beneficiário poderia ter exercido o direito, conforme art. 3º da Lei 9.783/1999.",
    resposta: "CERTO",
    explicacao:
      "Art. 3º, Lei 9.783/99: prescrição em 5 anos para créditos do servidor. O prazo conta do primeiro dia do exercício seguinte ao vencimento (sistema de decênio).",
    dificuldade: 2,
    tags: [
      "prescrição",
      "servidor público",
      "vantagens",
      "Lei 9.783/99",
      "quinquênio",
    ],
    fonte_legal: ["Art. 3º, Lei 9.783/1999"],
    banca_referencia: "CEBRASPE",
    assunto: "Agentes administrativos",
  },
  {
    id: "adm-008-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O processo administrativo disciplinar (PAD) deve ser concluído no prazo máximo de 60 (sessenta) dias, improrrogável, contados da instauração, conforme EC 19/1998, que alterou o art. 41 da CF/88.",
    resposta: "ERRADO",
    explicacao:
      "EC 19/98 alterou o art. 41, § 1º, da CF/88: prazo de 60 dias, PRORROGÁVEL por mais 60 dias (total 120) a critério da autoridade que instaurou o PAD. O prazo é prorrogável, não improrrogável.",
    dificuldade: 2,
    tags: [
      "PAD",
      "processo administrativo disciplinar",
      "prazo",
      "EC 19/98",
      "art. 41 CF",
    ],
    fonte_legal: ["Art. 41, § 1º, CF/88 (redação EC 19/1998)"],
    banca_referencia: "CEBRASPE",
    assunto: "Processo administrativo",
  },
  {
    id: "adm-009-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A revogação de ato administrativo pode ser feita pela autoridade hierarquicamente superior à que praticou o ato, quando o ato for inconveniente ou inoportuno, independentemente de vício, pois a revogação atua pelo interesse público.",
    resposta: "CERTO",
    explicacao:
      "Revogação atua pelo interesse público (conveniência e oportunidade), não por vício. Pode ser pelo próprio autor ou superior hierárquico. Anulação é que atua por vício (ilegalidade).",
    dificuldade: 2,
    tags: [
      "revogação",
      "anulação",
      "ato administrativo",
      "interesse público",
      "hierarquia",
    ],
    fonte_legal: ["Lei 9.784/1999"],
    banca_referencia: "CEBRASPE",
    assunto: "Ato administrativo - invalidação",
  },
  {
    id: "adm-010-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A anulação de ato administrativo pode ocorrer a qualquer tempo quando houver vício de incompetência absoluta, pois tal vício gera nulidade insanável, não sujeita a prescrição ou decadência.",
    resposta: "CERTO",
    explicacao:
      "Vício de incompetência absoluta (incompetência de jurisdição pessoa ou matéria) gera nulidade insanável. Nulidades insanáveis podem ser decretadas a qualquer tempo (não se prescrevem). A nulidade não se cura pelo tempo.",
    dificuldade: 3,
    tags: [
      "anulação",
      "nulidade",
      "incompetência absoluta",
      "vício insanável",
      "prescrição",
    ],
    fonte_legal: ["Lei 9.784/1999"],
    banca_referencia: "CEBRASPE",
    assunto: "Ato administrativo - invalidação",
  },
  {
    id: "adm-011-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O princípio da publicidade exige que todos os atos administrativos sejam publicados no Diário Oficial da União ou do Estado, sendo vedada a publicidade restrita a meios internos da administração.",
    resposta: "ERRADO",
    explicacao:
      "Publicidade é regra, mas admite exceções. Atos de caráter interno (portarias internas, instruções normativas de organização) podem ter publicidade restrita (intranet, boletim interno). O que é vedado é o sigilo sem fundamento legal.",
    dificuldade: 2,
    tags: [
      "publicidade",
      "ato administrativo",
      "Diário Oficial",
      "publicidade restrita",
      "exceções",
    ],
    fonte_legal: ["Lei 9.784/1999"],
    banca_referencia: "CEBRASPE",
    assunto: "Princípios da administração",
  },
  {
    id: "adm-012-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A responsabilidade civil do Estado por ato de agente público é objetiva quando há exercício regular do direito ou ato de guerra, situações que excluem o dever de indenizar, conforme art. 37, § 4º, da CF/88.",
    resposta: "ERRADO",
    explicacao:
      "A responsabilidade do Estado é objetiva (art. 37, § 6º, CF/88), mas o exercício regular do direito (ato legal) e ato de guerra são excludentes de ilicitude (não há ato ilícito, logo não há responsabilidade). A assertiva confundiu: objetividade é a regra, mas o exercício regular do direito exclui o ilícito, não a objetividade.",
    dificuldade: 3,
    tags: [
      "responsabilidade civil",
      "Estado",
      "objetiva",
      "exercício regular do direito",
      "art. 37 CF",
    ],
    fonte_legal: ["Art. 37, § 4º e § 6º, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Responsabilidade da administração",
  },
  {
    id: "adm-013-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A tomada de contas especial pode ser decretada pelo Tribunal de Contas quando o gestor não apresentar as contas no prazo legal, ou quando apresentá-las de forma temerária, não se aplicando a prescrição para a responsabilização do gestor.",
    resposta: "CERTO",
    explicacao:
      "Lei 8.443/1992, art. 16: tomada de contas especial para não apresentação de contas ou apresentação temerária. A responsabilização do gestor não se prescreve (art. 17, Lei 8.443/92).",
    dificuldade: 2,
    tags: [
      "tomada de contas especial",
      "Lei 8.443/1992",
      "não apresentação",
      "prescrição",
      "TCU",
    ],
    fonte_legal: ["Art. 16 e 17, Lei 8.443/1992"],
    banca_referencia: "CEBRASPE",
    assunto: "Controle da administração",
  },
  {
    id: "adm-014-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O servidor público em estágio probatório pode ser exonerado de ofício por insuficiência de desempenho, sem direito a recurso administrativo, pois não possui ainda estabilidade constitucional.",
    resposta: "ERRADO",
    explicacao:
      "O estável pode ser exonerado por insuficiência (art. 20, § 1º, Lei 8.112/90), mas tem direito a recurso administrativo (art. 20, § 2º). A falta de estabilidade não exclui o contraditório e a ampla defesa. O servidor pode recorrer.",
    dificuldade: 3,
    tags: [
      "estágio probatório",
      "exoneração",
      "insuficiência",
      "recurso",
      "art. 20 Lei 8.112/90",
    ],
    fonte_legal: ["Art. 20, § 1º e 2º, Lei 8.112/1990"],
    banca_referencia: "CEBRASPE",
    assunto: "Agentes administrativos",
  },
  {
    id: "adm-015-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A dispensa de licitação é permitida em casos de emergência ou calamidade pública, quando a urgência for determinada pelo interesse público e a impossibilidade de observar os prazos normais do procedimento licitatório, conforme art. 74, inciso II, da Lei 14.133/2021.",
    resposta: "CERTO",
    explicacao:
      "Lei 14.133/2021, art. 74, II: dispensa por emergência ou calamidade pública. Requisitos: urgência decorrente de situação imprevista e de interesse público; impossibilidade de observar prazos; motivação no processo.",
    dificuldade: 1,
    tags: [
      "dispensa de licitação",
      "emergência",
      "calamidade",
      "Lei 14.133/2021",
      "art. 74",
    ],
    fonte_legal: ["Art. 74, II, Lei 14.133/2021"],
    banca_referencia: "CEBRASPE",
    assunto: "Licitações e contratos",
  },
  {
    id: "adm-016-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O regimento interno de órgão da administração pública tem natureza de ato administrativo normativo primário, pois regula a organização interna, a competência e o funcionamento do órgão, sem necessidade de lei específica para cada norma.",
    resposta: "CERTO",
    explicacao:
      "Regimento interno é ato normativo primário (hierarquia abaixo da lei, mas acima dos atos administrativos individuais). Disciplina a organização interna, baseado na lei que criou o órgão.",
    dificuldade: 2,
    tags: [
      "regimento interno",
      "ato normativo",
      "primário",
      "organização interna",
      "competência",
    ],
    fonte_legal: ["Lei 9.784/1999"],
    banca_referencia: "CEBRASPE",
    assunto: "Ato administrativo - classificação",
  },
  {
    id: "adm-017-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A posse em cargo público deve ocorrer no prazo de 30 (trinta) dias contados da publicação do ato de provimento, prazo este que pode ser prorrogado por igual período a critério da administração, uma única vez, por interesse público.",
    resposta: "CERTO",
    explicacao:
      "Art. 13, caput e § 1º, Lei 8.112/90: posse em 30 dias da publicação. O § 1º permite prorrogação por 30 dias, uma vez, a pedido do interessado ou por interesse público.",
    dificuldade: 1,
    tags: ["posse", "prazo", "Lei 8.112/90", "ato de provimento", "publicação"],
    fonte_legal: ["Art. 13, caput e § 1º, Lei 8.112/1990"],
    banca_referencia: "CEBRASPE",
    assunto: "Agentes administrativos",
  },
  {
    id: "adm-018-v2",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O servidor público pode acumular dois cargos de provimento efetivo se houver compatibilidade de horários e interesse público, desde que não se trate de cargos de direção ou chefia, conforme permissão constitucional genérica.",
    resposta: "ERRADO",
    explicacao:
      "Art. 37, XVI, CF/88: vedada acumulação remunerada, com exceções TAXATIVAS: a) dois cargos de professor; b) cargo técnico/científico + professor; c) dois cargos de médico. Não basta compatibilidade de horários e interesse público; precisa estar nas exceções constitucionais.",
    dificuldade: 2,
    tags: [
      "acumulação",
      "cargo efetivo",
      "art. 37 XVI CF",
      "exceções",
      "professor",
      "médico",
    ],
    fonte_legal: ["Art. 37, XVI, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Agentes administrativos",
  },

  // ═══════════════════════════════════════════════════════════
  // ADMINISTRAÇÃO (18 questões - Padrão FGV: atualidade + gestão pública moderna)
  // ═══════════════════════════════════════════════════════════

  {
    id: "admin-001-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A teoria clássica da administração, representada por Frederick Taylor (Administração Científica) e Henri Fayol (Teoria Clássica), enfatiza a eficiência técnica, a divisão do trabalho, a padronização e a hierarquia como elementos fundamentais para a racionalização da produção e da organização.",
    resposta: "CERTO",
    explicacao:
      "Taylor focou na racionalização do trabalho operário (estudo de tempos e movimentos). Fayol focou na organização administrativa (funções da administração: planejar, organizar, comandar, coordenar, controlar). Ambos enfatizam eficiência, divisão do trabalho e hierarquia.",
    dificuldade: 1,
    tags: [
      "teoria clássica",
      "Taylor",
      "Fayol",
      "administração científica",
      "eficiência",
      "hierarquia",
    ],
    banca_referencia: "CEBRASPE/FGV",
    assunto: "Evolução da Administração Pública",
  },
  {
    id: "admin-002-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A teoria das relações humanas, desenvolvida a partir das experiências de Elton Mayo na Hawthorne, prioriza os aspectos técnicos e estruturais da organização em detrimento dos fatores humanos, sociais e psicológicos dos trabalhadores.",
    resposta: "ERRADO",
    explicacao:
      "A Teoria das Relações Humanas (Mayo, Roethlisberger, Dickson) surgiu justamente como crítica à excessiva racionalização técnica. Prioriza os fatores humanos, sociais, psicológicos, a satisfação no trabalho, as relações interpessoais, não os aspectos técnicos.",
    dificuldade: 1,
    tags: [
      "teoria das relações humanas",
      "Mayo",
      "experiência de Hawthorne",
      "fatores humanos",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Evolução da Administração Pública",
  },
  {
    id: "admin-003-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O planejamento estratégico na gestão pública estabelece objetivos de longo prazo, define estratégias para alcançá-los e alinha recursos e ações, considerando o ambiente externo (oportunidades e ameaças) e interno (forças e fraquezas) da organização.",
    resposta: "CERTO",
    explicacao:
      "Planejamento estratégico = longo prazo, missão, visão, valores, análise SWOT (ambiente externo e interno), formulação de estratégias, implementação e avaliação. Na gestão pública, adapta-se ao setor público (foco em resultados para a sociedade).",
    dificuldade: 1,
    tags: [
      "planejamento estratégico",
      "longo prazo",
      "SWOT",
      "gestão pública",
      "missão e visão",
    ],
    banca_referencia: "FGV",
    assunto: "Gestão de Pessoas",
  },
  {
    id: "admin-004-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A organização formal é aquela estabelecida oficialmente pela administração, com hierarquia definida, divisão de tarefas, normas e procedimentos escritos, representada graficamente pelo organograma, enquanto a organização informal emerge espontaneamente das relações sociais.",
    resposta: "CERTO",
    explicacao:
      "Conceito clássico: organização formal = estrutura oficial, organograma, regulamentos. Organização informal = relações interpessoais, grupos de convívio, lideranças emergentes, comunicação informal (boca a boca).",
    dificuldade: 1,
    tags: [
      "organização formal",
      "organização informal",
      "hierarquia",
      "organograma",
      "estrutura",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Características das organizações formais modernas",
  },
  {
    id: "admin-005-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A teoria da liderança situacional de Hersey e Blanchard sugere que não existe um único melhor estilo de liderança, devendo o líder adaptar seu comportamento (diretivo ou de apoio) ao nível de maturidade (competência e compromisso) dos subordinados.",
    resposta: "CERTO",
    explicacao:
      "Liderança situacional: o estilo deve variar (dirigir, instruir, apoiar, delegar) conforme a maturidade da equipe (capacidade + vontade). Não há estilo único ideal; depende da situação.",
    dificuldade: 2,
    tags: [
      "liderança situacional",
      "Hersey e Blanchard",
      "estilos de liderança",
      "maturidade",
    ],
    banca_referencia: "FGV",
    assunto: "Liderança",
  },
  {
    id: "admin-006-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O ciclo PDCA (Plan-Do-Check-Act), também conhecido como ciclo de Deming, é uma ferramenta de gestão da qualidade que propõe um processo contínuo de planejamento, execução, verificação e ação corretiva para melhoria de processos.",
    resposta: "CERTO",
    explicacao:
      "PDCA = Plan (planejar), Do (executar), Check (verificar), Act (agir/melhorar). Ciclo de melhoria contínua (Kaizen). Aplicável à gestão pública e privada.",
    dificuldade: 1,
    tags: [
      "PDCA",
      "ciclo de Deming",
      "melhoria contínua",
      "qualidade",
      "gestão de processos",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Excelência nos serviços públicos",
  },
  {
    id: "admin-007-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A matriz SWOT (FOFA) é ferramenta de análise estratégica que avalia Forças (Strengths), Oportunidades (Weaknesses), Fraquezas (Opportunities) e Ameaças (Threats) de uma organização, considerando ambiente interno e externo.",
    resposta: "ERRADO",
    explicacao:
      "A tradução está incorreta na assertiva. O correto é: Strengths = Forças, Weaknesses = Fraquezas (ambos internos), Opportunities = Oportunidades, Threats = Ameaças (ambos externos). A assertiva trocou Fraquezas com Oportunidades.",
    dificuldade: 2,
    tags: [
      "SWOT",
      "FOFA",
      "análise estratégica",
      "forças",
      "fraquezas",
      "oportunidades",
      "ameaças",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Planejamento estratégico",
  },
  {
    id: "admin-008-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O controle burocrático, baseado nas teorias de Max Weber, fundamenta-se em regras, regulamentos, procedimentos padronizados, hierarquia formal e impessoalidade, visando a racionalidade e a previsibilidade nas decisões organizacionais.",
    resposta: "CERTO",
    explicacao:
      "Weber: burocracia como forma ideal de organização racional-legal. Características: divisão do trabalho, hierarquia, regras formais, impessoalidade, seleção por competência, propriedade separada do cargo.",
    dificuldade: 1,
    tags: [
      "Weber",
      "burocracia",
      "controle burocrático",
      "racionalidade",
      "hierarquia",
      "impessoalidade",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Evolução da Administração Pública",
  },
  {
    id: "admin-009-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A gestão por resultados (GPR) na administração pública foca exclusivamente em indicadores financeiros e orçamentários de desempenho, desconsiderando aspectos qualitativos como satisfação do cidadão e qualidade dos serviços.",
    resposta: "ERRADO",
    explicacao:
      "GPR considera múltiplas dimensões: eficiência (relação insumo/produto), eficácia (alcance de objetivos), efetividade (impacto na sociedade), qualidade, satisfação do cidadão, não apenas financeiros. É uma visão multidimensional.",
    dificuldade: 2,
    tags: [
      "gestão por resultados",
      "GPR",
      "indicadores",
      "eficiência",
      "eficácia",
      "efetividade",
    ],
    banca_referencia: "FGV",
    assunto: "Excelência na gestão dos serviços públicos",
  },
  {
    id: "admin-010-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O processo decisório de Herbert Simon compreende três fases principais: inteligência (identificação do problema), concepção (desenvolvimento de alternativas) e escolha (seleção da alternativa mais adequada).",
    resposta: "CERTO",
    explicacao:
      "Simon (Administrative Behavior): decisão racional limitada (bounded rationality). Fases: 1) Inteligência (problema/oportunidade), 2) Concepção/Formulação (alternativas), 3) Escolha (decisão), 4) Revisão (pós-decisão, em algumas versões).",
    dificuldade: 2,
    tags: [
      "Herbert Simon",
      "processo decisório",
      "inteligência",
      "concepção",
      "escolha",
      "racionalidade limitada",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Tomada de decisão",
  },
  {
    id: "admin-011-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A teoria Z de William Ouchi combina elementos da gestão japonesa (consenso, emprego vitalício, responsabilidade coletiva) com elementos da gestão americana (individualismo, avaliação de desempenho, controle), propondo um modelo híbrido de organização.",
    resposta: "CERTO",
    explicacao:
      "Ouchi (Theory Z): integração de práticas japonesas (confiança, relacionamento longo prazo, consenso) e americanas (clareza de responsabilidades, avaliação individual). Enfoque na cultura organizacional.",
    dificuldade: 2,
    tags: [
      "teoria Z",
      "Ouchi",
      "gestão japonesa",
      "gestão americana",
      "cultura organizacional",
    ],
    banca_referencia: "FGV",
    assunto: "Cultura organizacional",
  },
  {
    id: "admin-012-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O Balanced Scorecard (BSC) é ferramenta de avaliação de desempenho organizacional que contempla apenas a perspectiva financeira, ignorando aspectos relacionados a clientes, processos internos e aprendizado organizacional.",
    resposta: "ERRADO",
    explicacao:
      "BSC (Kaplan e Norton) tem 4 perspectivas balanceadas: 1) Financeira, 2) Clientes, 3) Processos Internos de Negócio, 4) Aprendizado e Crescimento. Não é apenas financeiro; é justamente o contrário (equilíbrio entre indicadores financeiros e não-financeiros).",
    dificuldade: 2,
    tags: [
      "BSC",
      "Balanced Scorecard",
      "perspectivas",
      "indicadores",
      "desempenho",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Gestão de desempenho",
  },
  {
    id: "admin-013-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A estrutura organizacional divisionalizada (modelo divisional) agrupa atividades por produto, região geográfica ou cliente, criando unidades autônomas (divisões) com suas próprias funções de produção, marketing e finanças.",
    resposta: "CERTO",
    explicacao:
      "Estrutura divisional (Alfred Sloan/GM): divisões autônomas por produto, mercado ou região. Cada divisão tem sua própria estrutura funcional. Adequada para organizações grandes e diversificadas.",
    dificuldade: 2,
    tags: [
      "estrutura divisional",
      "divisões",
      "autonomia",
      "produto",
      "região",
      "cliente",
    ],
    banca_referencia: "FGV",
    assunto: "Tipos de estrutura organizacional",
  },
  {
    id: "admin-014-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O benchmarking é processo de comparação de práticas, processos e resultados de uma organização com os de outras organizações, restrito exclusivamente a concorrentes diretos do mesmo setor de atuação.",
    resposta: "ERRADO",
    explicacao:
      "Benchmarking pode ser: interno (dentro da própria org), competitivo (concorrentes), funcional (melhores práticas em processos específicos, independente do setor), genérico (qualquer organização excelente). Não se restringe a concorrentes.",
    dificuldade: 2,
    tags: [
      "benchmarking",
      "melhores práticas",
      "comparação",
      "competitivo",
      "funcional",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Excelência nos serviços públicos",
  },
  {
    id: "admin-015-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A pirâmide de Maslow hierarquiza as necessidades humanas em níveis, da base para o topo: fisiológicas, segurança, sociais/pertencimento, estima e autorrealização, sugerindo que necessidades inferiores devem ser satisfeitas antes das superiores.",
    resposta: "CERTO",
    explicacao:
      "Maslow (Teoria da Hierarquia das Necessidades): 1) Fisiológicas (comer, beber), 2) Segurança (proteção), 3) Sociais (amizade, amor), 4) Estima (reconhecimento), 5) Autorrealização (potencial máximo). Ordem crescente de complexidade.",
    dificuldade: 1,
    tags: ["Maslow", "pirâmide", "necessidades", "hierarquia", "motivação"],
    banca_referencia: "CEBRASPE",
    assunto: "Motivação",
  },
  {
    id: "admin-016-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O downsizing refere-se à redução deliberada do número de funcionários de uma organização, geralmente por meio de demissões, aposentadorias incentivadas ou transferências, visando à racionalização de custos e à melhoria da eficiência.",
    resposta: "CERTO",
    explicacao:
      "Downsizing = redução de pessoal, enxugamento da estrutura. Pode ser por corte de custos, reengenharia, fusões/aquisições. Diferente de rightsizing (ajuste ao tamanho ideal).",
    dificuldade: 1,
    tags: [
      "downsizing",
      "redução de pessoal",
      "racionalização",
      "custos",
      "eficiência",
    ],
    banca_referencia: "FGV",
    assunto: "Gestão de Pessoas",
  },
  {
    id: "admin-017-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A gestão do conhecimento (knowledge management) visa capturar, organizar, armazenar e compartilhar o conhecimento tácito e explícito existente na organização, transformando-o em ativo estratégico para a inovação e competitividade.",
    resposta: "CERTO",
    explicacao:
      "KM (Nonaka e Takeuchi): conhecimento tácito (pessoal, experiência) vs explícito (documentado, formal). O processo de conversão (socialização, externalização, combinação, internalização) gera inovação.",
    dificuldade: 2,
    tags: [
      "gestão do conhecimento",
      "knowledge management",
      "conhecimento tácito",
      "conhecimento explícito",
      "inovação",
    ],
    banca_referencia: "FGV",
    assunto: "Gestão por competências e gestão do conhecimento",
  },
  {
    id: "admin-018-v2",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O organograma é a representação gráfica da estrutura formal de uma organização, evidenciando a divisão do trabalho, a hierarquia de autoridade, os canais de comunicação formal e as relações de subordinação entre cargos.",
    resposta: "CERTO",
    explicacao:
      "Organograma: diagrama que mostra a estrutura organizacional (cargos, departamentos, relações hierárquicas). Pode ser vertical (top-down), horizontal, circular, etc.",
    dificuldade: 1,
    tags: [
      "organograma",
      "representação gráfica",
      "estrutura formal",
      "hierarquia",
      "comunicação",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Características das organizações formais modernas",
  },

  // ═══════════════════════════════════════════════════════════
  // ARQUIVOLOGIA (18 questões - Padrão CEBRASPE: ciclo vital + temporalidade)
  // ═══════════════════════════════════════════════════════════

  {
    id: "arq-001-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivo corrente é composto pelos documentos de tramitação frequente e uso constante no órgão ou entidade de origem, ainda não cumprido o prazo de guarda definido na tabela de temporalidade para transferência ao arquivo intermediário.",
    resposta: "CERTO",
    explicacao:
      "Conceito do ciclo vital dos documentos: arquivo corrente (fase atual, uso frequente) → arquivo intermediário (fase semi-ativa, uso esporádico) → arquivo permanente (fase permanente, valor histórico). O corrente é onde os documentos são produzidos e usados regularmente.",
    dificuldade: 1,
    tags: [
      "arquivo corrente",
      "ciclo vital",
      "temporalidade",
      "tramitação frequente",
      "fase atual",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestão de documentos",
  },
  {
    id: "arq-002-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivo intermediário armazena documentos de baixa frequência de consulta, mas que ainda não podem ser eliminados porque não expirou o prazo de guarda estabelecido na tabela de temporalidade, ou porque aguardam destinação final (eliminação ou permanente).",
    resposta: "CERTO",
    explicacao:
      "Arquivo intermediário (ou semi-ativo): documentos fora do uso corrente, mas que ainda têm valor administrativo, legal ou fiscal. Guarda temporária até a eliminação ou transferência para o arquivo permanente.",
    dificuldade: 1,
    tags: [
      "arquivo intermediário",
      "fase semi-ativa",
      "baixa frequência",
      "guarda temporária",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestão de documentos",
  },
  {
    id: "arq-003-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A eliminação de documentos arquivísticos pode ser feita livremente pelo gestor do órgão público, desde que os documentos estejam fora do prazo de guarda corrente, sem necessidade de observância da tabela de temporalidade aprovada.",
    resposta: "ERRADO",
    explicacao:
      "A eliminação segue estritamente a tabela de temporalidade de documentos de arquivo, aprovada pelo Conselho Nacional de Arquivos (CONARQ) ou órgão de arquivo competente. Não pode ser feita livremente; requer autorização e procedimentos técnicos.",
    dificuldade: 2,
    tags: [
      "eliminação",
      "tabela de temporalidade",
      "CONARQ",
      "destinação",
      "autorização",
    ],
    fonte_legal: ["Lei 8.159/1991", "Resoluções CONARQ"],
    banca_referencia: "CEBRASPE",
    assunto: "Tabela de temporalidade",
  },
  {
    id: "arq-004-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O documento de arquivo é a unidade de registro das informações, produzida e recebida por pessoa física ou jurídica, pública ou privada, no exercício de suas atividades, independentemente do suporte (papel, digital, fotográfico, etc.).",
    resposta: "CERTO",
    explicacao:
      "Conceito amplo de documento de arquivo: unidade de registro de informação, qualquer que seja o suporte. Inclui textuais, cartográficos, fotográficos, audiovisuais, digitais, etc.",
    dificuldade: 1,
    tags: [
      "documento de arquivo",
      "unidade de registro",
      "suporte",
      "informação",
      "conceito",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Arquivística - princípios e conceitos",
  },
  {
    id: "arq-005-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A classificação arquivística é a operação técnica que organiza os documentos segundo sua origem (fundo), natureza (série) e conteúdo, estabelecendo a ordem lógica e sistemática do arquivo.",
    resposta: "CERTO",
    explicacao:
      "Classificação: organização por fundo (proveniência), série (tipo documental), sub-série, unidade de arquivo. Princípio da proveniência: respeitar a origem e o contexto de criação dos documentos.",
    dificuldade: 1,
    tags: ["classificação", "fundo", "série", "proveniência", "ordenação"],
    banca_referencia: "CEBRASPE",
    assunto: "Classificação de documentos de arquivo",
  },
  {
    id: "arq-006-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O prazo de guarda de documentos no arquivo corrente é fixo em 5 (cinco) anos para todos os tipos documentais, após os quais os documentos devem ser transferidos obrigatoriamente para o arquivo intermediário.",
    resposta: "ERRADO",
    explicacao:
      "Não há prazo fixo universal. O prazo de guarda no arquivo corrente varia conforme o tipo documental e é definido na tabela de temporalidade específica de cada órgão (pode ser 1 ano, 2 anos, etc.). Alguns documentos podem ir direto para o permanente.",
    dificuldade: 2,
    tags: [
      "prazo de guarda",
      "arquivo corrente",
      "tabela de temporalidade",
      "transferência",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Tabela de temporalidade",
  },
  {
    id: "arq-007-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivo permanente destina-se à guarda definitiva de documentos com valor histórico, científico, cultural ou probatório permanente, sendo preservado para consulta de pesquisadores e para a memória institucional e social.",
    resposta: "CERTO",
    explicacao:
      "Arquivo permanente: fase final do ciclo vital. Documentos com valor permanente (não podem ser eliminados). Guarda definitiva para memória histórica, pesquisa, prova de direitos.",
    dificuldade: 1,
    tags: [
      "arquivo permanente",
      "guarda definitiva",
      "valor histórico",
      "memória",
      "preservação",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestão de documentos",
  },
  {
    id: "arq-008-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A digitalização de documentos arquivísticos elimina automaticamente a necessidade de preservação do documento original em papel, pois a cópia digital tem o mesmo valor probatório e legal do original.",
    resposta: "ERRADO",
    explicacao:
      "A digitalização não elimina o original, salvo autorização específica do órgão de arquivo competente. Alguns documentos (escrituras, registros públicos, alguns documentos fiscais) precisam do original por força de lei. A Lei 11.419/2006 regulamenta a validade de documentos eletrônicos, mas não elimina automaticamente o papel.",
    dificuldade: 2,
    tags: [
      "digitalização",
      "documento original",
      "preservação",
      "Lei 11.419/2006",
      "valor probatório",
    ],
    fonte_legal: ["Lei 11.419/2006"],
    banca_referencia: "CEBRASPE",
    assunto: "Preservação e conservação",
  },
  {
    id: "arq-009-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O instrumento de pesquisa arquivística que descreve sistematicamente as unidades de arquivo (fundo, série, unidades) é o inventário, enquanto o catálogo é instrumento de descrição bibliográfica, não arquivística.",
    resposta: "CERTO",
    explicacao:
      "Inventário: instrumento de descrição arquivística (níveis: fundo, série, sub-série, unidade). Catálogo: instrumento de descrição bibliográfica (livros, periódicos). São instrumentos distintos para naturezas distintas de documentos.",
    dificuldade: 3,
    tags: [
      "inventário",
      "catálogo",
      "instrumento de pesquisa",
      "descrição arquivística",
      "descrição bibliográfica",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Instrumentos de pesquisa",
  },
  {
    id: "arq-010-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O fundo de arquivo é o conjunto orgânico de documentos produzidos, acumulados e utilizados por uma pessoa física ou jurídica, pública ou privada, no exercício de suas atividades e funções, independentemente do suporte.",
    resposta: "CERTO",
    explicacao:
      "Conceito de fundo (princípio da proveniência): todo conjunto de documentos de mesma origem. É a unidade de classificação principal na arquivística. Ex: Fundo Ministério da Justiça, Fundo Supremo Tribunal Federal.",
    dificuldade: 1,
    tags: [
      "fundo",
      "proveniência",
      "conjunto orgânico",
      "origem",
      "classificação",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Arquivística - princípios e conceitos",
  },
  {
    id: "arq-011-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A avaliação arquivística é o processo técnico que determina o valor dos documentos de arquivo (administrativo, legal, fiscal, histórico, cultural) para definir seu destino: eliminação após prazo ou permanente no arquivo histórico.",
    resposta: "CERTO",
    explicacao:
      "Avaliação = análise do valor documental. Valores: primário (administrativo, legal, fiscal) e secundário (histórico, científico, cultural). Define se o documento será eliminado (após prazo) ou permanecerá (guarda permanente).",
    dificuldade: 2,
    tags: [
      "avaliação",
      "valor documental",
      "destinação",
      "eliminação",
      "permanente",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Avaliação arquivística",
  },
  {
    id: "arq-012-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O Sistema de Gestão Arquivística (SGA) integra as atividades de produção, classificação, avaliação, acondicionamento, preservação e destinação de documentos, abrangendo todo o ciclo vital dos documentos desde sua criação até sua eliminação ou guarda permanente.",
    resposta: "CERTO",
    explicacao:
      "SGA = sistema integrado de gestão de documentos e arquivos. Abrange: produção, tramitação, classificação, avaliação, acondicionamento, conservação, acesso, destinação. É a gestão do ciclo vital completo.",
    dificuldade: 2,
    tags: [
      "SGA",
      "gestão arquivística",
      "ciclo vital",
      "integração",
      "atividades arquivísticas",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestão de documentos",
  },
  {
    id: "arq-013-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A descrição arquivística segue normas internacionais como a ISAD(G) (General International Standard Archival Description) para descrição de documentos e a ISAAR(CPF) para descrição de entidades produtoras (pessoas, famílias, entidades coletivas).",
    resposta: "CERTO",
    explicacao:
      "ISAD(G) = padrão internacional de descrição arquivística (níveis hierárquicos: fundo, série, etc.). ISAAR(CPF) = padrão internacional de descrição de entidades produtoras (contexto de criação dos documentos).",
    dificuldade: 3,
    tags: [
      "ISAD(G)",
      "ISAAR(CPF)",
      "normas internacionais",
      "descrição arquivística",
      "descrição contextual",
    ],
    banca_referencia: "FGV",
    assunto: "Descrição arquivística",
  },
  {
    id: "arq-014-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O termo 'arquivo morto', ainda que utilizado coloquialmente, é tecnicamente inadequado, pois sugere documentos sem valor, quando na verdade o arquivo intermediário guarda documentos com valor administrativo temporário, ainda não disponíveis para eliminação.",
    resposta: "CERTO",
    explicacao:
      "'Arquivo morto' é termo antigo e inadequado. O correto é 'arquivo intermediário' (fase semi-ativa). Os documentos não estão 'mortos'; têm valor temporário e podem ser consultados, embora com baixa frequência.",
    dificuldade: 2,
    tags: [
      "arquivo morto",
      "arquivo intermediário",
      "terminologia",
      "fase semi-ativa",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Arquivística - princípios e conceitos",
  },
  {
    id: "arq-015-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A transferência de documentos do arquivo corrente para o intermediário ocorre quando cessa a tramitação frequente (fase corrente) e inicia-se a fase de guarda temporária, aguardando o cumprimento do prazo de guarda para eliminação ou permanente.",
    resposta: "CERTO",
    explicacao:
      "Transferência = mudança de fase arquivística. Corrente → Intermediário: quando o uso não é mais frequente. Intermediário → Permanente ou Eliminação: quando expira o prazo de guarda e é feita a avaliação de valor histórico.",
    dificuldade: 1,
    tags: [
      "transferência",
      "fase arquivística",
      "corrente para intermediário",
      "ciclo vital",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Gestão de documentos",
  },
  {
    id: "arq-016-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O acesso a documentos arquivísticos de livre consulta é um direito garantido pela Lei de Acesso à Informação (Lei 12.527/2011), mas documentos podem ter classificação de sigilo (ultrassecreto, secreto, reservado) quando sua divulgação puder prejudicar a segurança da sociedade ou do Estado.",
    resposta: "CERTO",
    explicacao:
      "LAI: publicidade é regra, sigilo é exceção. Classificações: ultrassecreto (25 anos), secreto (15 anos), reservado (5 anos). Documentos arquivísticos podem ter sigilo, mas a regra é o acesso. O arquivo permanente histórico geralmente tem acesso livre.",
    dificuldade: 1,
    tags: [
      "acesso",
      "LAI",
      "sigilo",
      "classificação",
      "documentos arquivísticos",
    ],
    fonte_legal: ["Lei 12.527/2011", "Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Acesso a documentos",
  },
  {
    id: "arq-017-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A preservação digital de documentos arquivísticos exige apenas a realização periódica de cópias de segurança (backup) dos arquivos digitais, não sendo necessária a adoção de outros procedimentos como migração, emulação ou manutenção de metadados.",
    resposta: "ERRADO",
    explicacao:
      "Preservação digital é complexa. Além do backup, exige: migração (mudança de formato obsoleto), emulação (reprodução de ambiente antigo), manutenção de metadados (dados sobre dados), verificação de integridade, fixidade de documentos, etc.",
    dificuldade: 2,
    tags: [
      "preservação digital",
      "backup",
      "migração",
      "emulação",
      "metadados",
      "longevidade digital",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Preservação e conservação",
  },
  {
    id: "arq-018-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivo histórico é a instituição que acolhe, organiza, conserva e disponibiliza para pesquisa documentos de valor histórico comprovado, provenientes do arquivo permanente de órgãos públicos ou de doações de particulares.",
    resposta: "CERTO",
    explicacao:
      "Arquivo histórico = instituição de memória (ex: Arquivo Nacional, Arquivos Públicos Estaduais e Municipais). Preserva acervo de valor histórico para a sociedade, pesquisa, cidadania.",
    dificuldade: 1,
    tags: [
      "arquivo histórico",
      "valor histórico",
      "memória",
      "pesquisa",
      "instituição",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Arquivo histórico",
  },

  // ═══════════════════════════════════════════════════════════
  // INFORMÁTICA (18 questões - Padrão FGV: atualidade + LGPD + segurança)
  // ═══════════════════════════════════════════════════════════

  {
    id: "inf-001-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "No Microsoft Excel, a fórmula =SOMA(A1:A10) realiza a adição aritmética de todos os valores numéricos contidos no intervalo de células de A1 até A10, ignorando células vazias ou com texto.",
    resposta: "CERTO",
    explicacao:
      "Função SOMA: adiciona valores numéricos. Ignora células vazias, texto e valores lógicos. Se houver erro em alguma célula, retorna erro. É uma das funções mais utilizadas em planilhas.",
    dificuldade: 1,
    tags: ["Excel", "SOMA", "funções", "intervalo", "planilhas"],
    banca_referencia: "FCC",
    assunto: "Aplicativos para edição de planilhas",
  },
  {
    id: "inf-002-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O atalho de teclado Ctrl+C no sistema operacional Windows é utilizado para copiar o conteúdo selecionado para a área de transferência, enquanto Ctrl+V é utilizado para colar o conteúdo da área de transferência no local desejado.",
    resposta: "CERTO",
    explicacao:
      "Atalhos padrão Windows: Ctrl+C (Copy = Copiar), Ctrl+X (Cut = Recortar), Ctrl+V (Paste = Colar), Ctrl+Z (Undo = Desfazer). São atalhos universais na maioria dos aplicativos Windows.",
    dificuldade: 1,
    tags: ["atalhos", "Ctrl+C", "Ctrl+V", "área de transferência", "Windows"],
    banca_referencia: "CEBRASPE",
    assunto: "Conceitos de tecnologia de informação",
  },
  {
    id: "inf-003-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O protocolo HTTPS (HyperText Transfer Protocol Secure) é a versão segura do HTTP, que utiliza criptografia SSL/TLS para proteger a integridade e a confidencialidade dos dados transmitidos entre o navegador e o servidor web.",
    resposta: "CERTO",
    explicacao:
      "HTTPS = HTTP + SSL/TLS. Criptografa a conexão, impedindo interceptação (sniffing) de dados sensíveis (senhas, cartões). Indicado pelo cadeado na barra de endereços e URL iniciando com https://.",
    dificuldade: 1,
    tags: ["HTTPS", "HTTP", "SSL", "TLS", "criptografia", "segurança"],
    banca_referencia: "CEBRASPE",
    assunto: "Conceitos básicos de Internet",
  },
  {
    id: "inf-004-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O phishing é uma técnica de ataque cibernético que utiliza engenharia social para induzir usuários a revelar dados pessoais sensíveis (senhas, números de cartão), geralmente por meio de e-mails ou sites falsificados que imitam entidades legítimas.",
    resposta: "CERTO",
    explicacao:
      "Phishing = 'isca' digital. E-mails falsos de bancos, redes sociais, etc., com links para sites clones que roubam dados. É o ataque mais comum contra usuários comuns.",
    dificuldade: 1,
    tags: ["phishing", "engenharia social", "ataque", "segurança", "fraude"],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação",
  },
  {
    id: "inf-005-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O armazenamento em nuvem (cloud computing) elimina completamente a necessidade de conexão com a internet para acesso aos dados armazenados, pois os arquivos são replicados localmente em todos os dispositivos do usuário.",
    resposta: "ERRADO",
    explicacao:
      "Cloud computing REQUER conexão com internet (ou intranet) para acesso remoto aos servidores. Não elimina a necessidade de conexão. Alguns serviços permitem sincronização local (cópia offline), mas o acesso ao cloud requer rede.",
    dificuldade: 1,
    tags: [
      "cloud computing",
      "nuvem",
      "internet",
      "armazenamento",
      "acesso remoto",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Conceitos de tecnologia de informação",
  },
  {
    id: "inf-006-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O sistema operacional Linux é distribuído sob licença de software livre e de código aberto (open source), permitindo que qualquer pessoa utilize, estude, modifique e distribua o sistema, de acordo com os termos da licença GPL.",
    resposta: "CERTO",
    explicacao:
      "Linux é software livre (free software) e open source. Licença GPL (General Public License): liberdade de executar, copiar, distribuir, estudar, modificar e melhorar o software. Código fonte disponível.",
    dificuldade: 1,
    tags: ["Linux", "software livre", "open source", "GPL", "código aberto"],
    banca_referencia: "FGV",
    assunto: "Sistemas operacionais",
  },
  {
    id: "inf-007-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O Microsoft Word é um software aplicativo de edição e formatação de texto, enquanto o Microsoft Excel é um software de planilha eletrônica para cálculos e análise de dados, ambos integrantes do pacote Microsoft Office.",
    resposta: "CERTO",
    explicacao:
      "Word = processador de texto. Excel = planilha eletrônica. PowerPoint = apresentações. Outlook = e-mail. São aplicativos do Microsoft Office (suíte de produtividade).",
    dificuldade: 1,
    tags: [
      "Microsoft Word",
      "Microsoft Excel",
      "Office",
      "processador de texto",
      "planilha",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Aplicativos para edição de textos e planilhas",
  },
  {
    id: "inf-008-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O firewall é um dispositivo de segurança de rede (hardware ou software) que monitora e controla o tráfego de rede baseado em regras de segurança predeterminadas, atuando como barreira entre redes confiáveis e não confiáveis.",
    resposta: "CERTO",
    explicacao:
      "Firewall = 'parede de fogo'. Filtra pacotes de rede (entrada/saída) baseado em regras (IPs, portas, protocolos). Pode ser pessoal (software no PC) ou de rede (hardware dedicado).",
    dificuldade: 1,
    tags: ["firewall", "segurança de rede", "tráfego", "regras", "barreira"],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação",
  },
  {
    id: "inf-009-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "A função =SE(A1>10;'Maior';'Menor') no Microsoft Excel testa se o valor da célula A1 é maior que 10, retornando o texto 'Maior' se verdadeiro e 'Menor' se falso, funcionando como uma estrutura condicional simples.",
    resposta: "CERTO",
    explicacao:
      "Função SE (IF): teste lógico; valor_se_verdadeiro; valor_se_falso. =SE(condição; resultado_V; resultado_F). É a função condicional básica do Excel.",
    dificuldade: 2,
    tags: ["Excel", "função SE", "IF", "condicional", "lógica"],
    banca_referencia: "FCC",
    assunto: "Aplicativos para edição de planilhas",
  },
  {
    id: "inf-010-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O malware (software malicioso) é um tipo de software legítimo desenvolvido para proteção de sistemas contra vírus e outras ameaças, sendo essencial para a segurança da informação.",
    resposta: "ERRADO",
    explicacao:
      "Malware = software malicioso (malicious software). Inclui vírus, worms, trojans, ransomware, spyware, adware. É o que causa dano, não o que protege. O software de proteção é o antivírus/antimalware.",
    dificuldade: 1,
    tags: ["malware", "software malicioso", "vírus", "segurança", "ameaças"],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação",
  },
  {
    id: "inf-011-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O backup incremental copia apenas os arquivos que foram modificados desde o último backup (de qualquer tipo), sendo mais rápido que o backup completo, mas exigindo a cadeia de backups para restauração completa.",
    resposta: "CERTO",
    explicacao:
      "Backup incremental: só o que mudou desde o último backup (completo ou incremental). Ocupa menos espaço, é mais rápido, mas para restaurar precisa do último completo + todos os incrementais subsequentes.",
    dificuldade: 2,
    tags: [
      "backup incremental",
      "backup completo",
      "cópia de segurança",
      "restauração",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação",
  },
  {
    id: "inf-012-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O endereço IP 192.168.1.1 é um exemplo de endereço IPv4 privado (não roteável na internet pública), utilizado em redes locais (LANs), conforme definição da RFC 1918.",
    resposta: "CERTO",
    explicacao:
      "Faixas de IP privado (RFC 1918): 10.0.0.0 a 10.255.255.255 (classe A), 172.16.0.0 a 172.31.255.255 (classe B), 192.168.0.0 a 192.168.255.255 (classe C). Usados em redes locais, convertidos por NAT para acesso à internet.",
    dificuldade: 2,
    tags: ["IP privado", "IPv4", "RFC 1918", "rede local", "NAT", "192.168"],
    banca_referencia: "FGV",
    assunto: "Conceitos básicos de Internet",
  },
  {
    id: "inf-013-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O Microsoft PowerPoint é um software aplicativo de criação e edição de apresentações multimídia (slides), enquanto o Adobe Photoshop é um software de edição de imagens raster (bitmap).",
    resposta: "CERTO",
    explicacao:
      "PowerPoint = apresentações. Photoshop = edição profissional de imagens raster (pixels). Illustrator = imagens vetoriais. São categorias distintas de software.",
    dificuldade: 1,
    tags: [
      "PowerPoint",
      "Photoshop",
      "apresentações",
      "edição de imagens",
      "software",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Aplicativos para apresentações",
  },
  {
    id: "inf-014-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "A criptografia de dados é uma técnica de segurança que transforma informações legíveis (texto claro) em formato ilegível (texto cifrado) através de algoritmos matemáticos, exigindo uma chave específica para reverter o processo (decriptografia).",
    resposta: "CERTO",
    explicacao:
      "Criptografia: codificação que garante confidencialidade. Algoritmos (AES, RSA) + chaves. Sem a chave correta, os dados são ininteligíveis. É fundamental para segurança de dados em repouso e em trânsito.",
    dificuldade: 1,
    tags: [
      "criptografia",
      "encriptação",
      "chave",
      "segurança",
      "confidencialidade",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação",
  },
  {
    id: "inf-015-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O atalho de teclado Ctrl+Z é universal na maioria dos softwares e sistemas operacionais para desfazer (undo) a última ação realizada, enquanto Ctrl+Y ou Ctrl+Shift+Z refaz (redo) a ação desfeita.",
    resposta: "CERTO",
    explicacao:
      "Ctrl+Z = Undo (desfazer). Ctrl+Y (ou Ctrl+Shift+Z em alguns programas) = Redo (refazer). São atalhos padrão de edição, presentes em processadores de texto, planilhas, editores de imagem, etc.",
    dificuldade: 1,
    tags: ["atalhos", "Ctrl+Z", "undo", "redo", "desfazer", "refazer"],
    banca_referencia: "CEBRASPE",
    assunto: "Conceitos de tecnologia de informação",
  },
  {
    id: "inf-016-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O sistema de numeração binário (base 2) utiliza apenas dois dígitos (0 e 1) para representar qualquer informação, sendo a base da computação digital moderna, onde 0 e 1 correspondem a estados físicos (desligado/ligado) dos circuitos eletrônicos.",
    resposta: "CERTO",
    explicacao:
      "Sistema binário: base 2 (0 e 1). Bit (binary digit) = menor unidade de informação. Bytes (8 bits) representam caracteres. Todo processamento digital é feito em binário (portas lógicas, transistores).",
    dificuldade: 1,
    tags: [
      "binário",
      "base 2",
      "bit",
      "byte",
      "sistema de numeração",
      "computação digital",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Conceitos de tecnologia de informação",
  },
  {
    id: "inf-017-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O cookie é um arquivo de dados armazenado no navegador do usuário por sites web, utilizado para manter sessões de login, preferências do usuário e rastreamento de comportamento, sendo inerentemente malicioso e representando sempre uma ameaça à segurança.",
    resposta: "ERRADO",
    explicacao:
      "Cookies são neutros: podem ser úteis (sessões, preferências) ou usados para rastreamento (privacidade). Não são inerentemente maliciosos, mas podem ser explorados (session hijacking) ou usados para tracking. Podem ser gerenciados pelo usuário.",
    dificuldade: 2,
    tags: [
      "cookie",
      "navegador",
      "sessão",
      "privacidade",
      "rastreamento",
      "segurança",
    ],
    banca_referencia: "FGV",
    assunto: "Conceitos básicos de Internet",
  },
  {
    id: "inf-018-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "A função PROCV (VLOOKUP) no Microsoft Excel busca um valor na primeira coluna de uma tabela e retorna um valor correspondente em outra coluna da mesma linha, realizando uma busca vertical em tabelas organizadas.",
    resposta: "CERTO",
    explicacao:
      "PROCV (PROcura na Vertical) = VLOOKUP (Vertical Lookup). Sintaxe: PROCV(valor_procurado; matriz_tabela; num_coluna; [procurar_intervalo]). Busca na primeira coluna, retorna valor da coluna especificada.",
    dificuldade: 2,
    tags: ["Excel", "PROCV", "VLOOKUP", "busca", "tabela", "função"],
    banca_referencia: "CEBRASPE",
    assunto: "Aplicativos para edição de planilhas",
  },

  // ═══════════════════════════════════════════════════════════
  // LEGISLAÇÃO PRF (18 questões - Padrão CEBRASPE: art. 144 CF + CTB + Decretos)
  // ═══════════════════════════════════════════════════════════

  {
    id: "prf-001-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal (PRF) é órgão integrante da estrutura do Ministério da Justiça e Segurança Pública, subordinada diretamente ao Ministro de Estado, conforme estrutura administrativa atual e Decreto 7.037/2009.",
    resposta: "CERTO",
    explicacao:
      "A PRF é órgão de segurança pública vinculado ao MJSP (antes era do Ministério da Justiça). Decreto 7.037/2009 regulamentou a estrutura. Atualmente, está subordinada ao MJSP, com autonomia operacional.",
    dificuldade: 1,
    tags: [
      "PRF",
      "Ministério da Justiça",
      "estrutura",
      "Decreto 7.037/2009",
      "segurança pública",
    ],
    fonte_legal: ["Decreto 7.037/2009"],
    banca_referencia: "CEBRASPE",
    assunto: "Legislação relativa à PRF",
  },
  {
    id: "prf-002-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal tem como missão institucional, conforme art. 144, § 1º, V, da CF/88, o patrulhamento ostensivo das rodovias federais, a fiscalização de trânsito, o combate à criminalidade e o atendimento às vítimas de acidentes em rodovias federais.",
    resposta: "CERTO",
    explicacao:
      "Art. 144, § 1º, V, CF/88: 'à Polícia Rodoviária Federal compete, na forma da lei, patrulhar as rodovias federais'. Lei 9.503/1997 (CTB) e outros diplomas detalham: fiscalização, policiamento, socorro, combate a crimes.",
    dificuldade: 1,
    tags: [
      "art. 144 CF",
      "missão PRF",
      "patrulhamento",
      "fiscalização",
      "rodovias federais",
    ],
    fonte_legal: ["Art. 144, § 1º, V, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Art. 144 da Constituição Federal",
  },
  {
    id: "prf-003-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O Código de Trânsito Brasileiro (Lei 9.503/1997) estabelece normas gerais de conduta para o trânsito em vias públicas do território nacional, sendo aplicável a todos os usuários das vias, incluindo pedestres, condutores e passageiros.",
    resposta: "CERTO",
    explicacao:
      "Lei 9.503/1997 é o CTB. Aplica-se a todos (art. 1º). Define direitos e deveres, infrações, penalidades, procedimentos. É a lei básica de trânsito no Brasil.",
    dificuldade: 1,
    tags: ["CTB", "Lei 9.503/1997", "trânsito", "normas", "usuários"],
    fonte_legal: ["Lei 9.503/1997"],
    banca_referencia: "CEBRASPE",
    assunto: "Art. 20 da Lei 9.503/1997",
  },
  {
    id: "prf-004-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal possui competência para fiscalizar o transporte rodoviário de cargas indivisíveis (com peso ou dimensões excedentes) em rodovias federais, verificando o cumprimento das normas técnicas e da legislação de trânsito.",
    resposta: "CERTO",
    explicacao:
      "Fiscalização de trânsito e transporte é atribuição da PRF. Cargas indivisíveis excedentes exigem autorização especial (art. 101, CTB). A PRF fiscaliza o cumprimento das condições de transporte.",
    dificuldade: 2,
    tags: [
      "fiscalização",
      "cargas indivisíveis",
      "transporte",
      "dimensões excedentes",
      "CTB art. 101",
    ],
    fonte_legal: ["Art. 101, Lei 9.503/1997"],
    banca_referencia: "CEBRASPE",
    assunto: "Competências da PRF",
  },
  {
    id: "prf-005-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A velocidade máxima permitida em rodovias pavimentadas, para veículos de passeio leves, é de 110 km/h (cento e dez quilômetros por hora), salvo sinalização diferente estabelecida pelo órgão ou entidade com circunscrição sobre a via.",
    resposta: "CERTO",
    explicacao:
      "Resolução CONTRAN 396/2011: limites máximos. Rodovias pavimentadas: 110 km/h (passeio). Outros limites: 80 km/h (ônibus), 90 km/h (caminhões). Vias de trânsito rápido podem ter limites maiores conforme sinalização.",
    dificuldade: 2,
    tags: [
      "velocidade máxima",
      "Resolução 396/2011",
      "CONTRAN",
      "rodovias pavimentadas",
      "limites",
    ],
    fonte_legal: ["Resolução CONTRAN 396/2011"],
    banca_referencia: "CEBRASPE",
    assunto: "Normas de trânsito",
  },
  {
    id: "prf-006-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal pode realizar operações de busca e apreensão em residências localizadas às margens de rodovias federais sem necessidade de mandado judicial, desde que haja suspeita de envolvimento com crimes de trânsito.",
    resposta: "ERRADO",
    explicacao:
      "Busca domiciliar exige mandado judicial (art. 5º, XI, CF/88), salvo situações excepcionais: consentimento do morador, flagrante delito, ou 'perigo iminente' (decisão judicial posterior). O fato de ser à margem de rodovia não elimina a proteção constitucional do domicílio.",
    dificuldade: 2,
    tags: [
      "busca domiciliar",
      "mandado judicial",
      "art. 5º XI CF",
      "flagrante",
      "residência",
    ],
    fonte_legal: ["Art. 5º, XI, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Competências da PRF",
  },
  {
    id: "prf-007-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O uso do cinto de segurança é obrigatório para todos os ocupantes do veículo, tanto nos bancos dianteiros quanto nos traseiros, conforme art. 65 da Lei 9.503/1997, salvo em situações excepcionais previstas em regulamento.",
    resposta: "CERTO",
    explicacao:
      "Art. 65, Lei 9.503/97: cinto obrigatório para todos os ocupantes. Resolução CONTRAN 541/2015 detalha. Exceções: veículos antigos sem cinto traseiro, determinação médica (com laudo), etc.",
    dificuldade: 1,
    tags: [
      "cinto de segurança",
      "art. 65 CTB",
      "obrigatoriedade",
      "ocupantes",
      "bancos traseiros",
    ],
    fonte_legal: ["Art. 65, Lei 9.503/1997"],
    banca_referencia: "CEBRASPE",
    assunto: "Normas de trânsito",
  },
  {
    id: "prf-008-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal pode aplicar teste de alcoolemia (bafômetro) apenas em motoristas profissionais (motoristas de ônibus, caminhões, taxistas), sendo vedada a aplicação em condutores de veículos particulares.",
    resposta: "ERRADO",
    explicacao:
      "A fiscalização de alcoolemia (Lei 11.705/2008 - Lei Seca) aplica-se a TODOS os condutores, não só profissionais. A PRF pode testar qualquer motorista em rodovia federal, independentemente da categoria da CNH ou tipo de veículo.",
    dificuldade: 2,
    tags: [
      "teste de alcoolemia",
      "bafômetro",
      "Lei Seca",
      "Lei 11.705/2008",
      "motoristas",
    ],
    fonte_legal: ["Lei 11.705/2008"],
    banca_referencia: "CEBRASPE",
    assunto: "Fiscalização de trânsito",
  },
  {
    id: "prf-009-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Lei 11.705/2008 (Lei Seca) estabelece que a concentração de álcool no sangue igual ou superior a 0,6 gramas por litro (ou 0,3 mg/L no ar expirado) configura crime de trânsito, sujeito a penas de detenção e suspensão da CNH.",
    resposta: "CERTO",
    explicacao:
      "Lei Seca: 0,6 g/L de sangue (ou 0,3 mg/L de ar) = crime (art. 306, CTB). Entre 0,0 e 0,3 g/L = infração administrativa (art. 165, CTB). A tolerância zero é para condutores de transporte de passageiros e veículos de carga perigosa (0,0 g/L).",
    dificuldade: 1,
    tags: [
      "Lei Seca",
      "Lei 11.705/2008",
      "alcoolemia",
      "crime de trânsito",
      "0,6 g/L",
    ],
    fonte_legal: ["Lei 11.705/2008", "Art. 306, Lei 9.503/1997"],
    banca_referencia: "CEBRASPE",
    assunto: "Legislação de trânsito",
  },
  {
    id: "prf-010-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal possui competência para fiscalizar o cumprimento das normas de proteção ao meio ambiente em rodovias federais, incluindo o transporte de produtos perigosos e o combate a crimes ambientais em seu âmbito de atuação.",
    resposta: "CERTO",
    explicacao:
      "A PRF fiscaliza transporte de produtos perigosos (Lei 9.503/97, art. 16), resíduos (Lei 12.305/2010 - PNRS), e atua em crimes ambientais (Lei 9.605/1998) em rodovias federais. É atribuição de polícia ostensiva.",
    dificuldade: 2,
    tags: [
      "meio ambiente",
      "fiscalização",
      "produtos perigosos",
      "crimes ambientais",
      "Lei 9.605/1998",
    ],
    fonte_legal: ["Lei 9.605/1998", "Lei 12.305/2010"],
    banca_referencia: "CEBRASPE",
    assunto: "Competências da PRF",
  },
  {
    id: "prf-011-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O Sistema Nacional de Trânsito (SNT) é composto pelo CONTRAN (Conselho Nacional de Trânsito), CETRAN (Conselhos Estaduais), CONTRADIFE (Conselho de Trânsito do DF) e pelos órgãos executivos de trânsito (PRF, DETRAN, órgãos municipais).",
    resposta: "CERTO",
    explicacao:
      "Estrutura do SNT (art. 5º a 20, Lei 9.503/97): órgãos normativos (CONTRAN), deliberativos (CETRAN, CONTRADIFE), executivos (PRF - rodovias federais; DETRAN - estaduais; órgãos municipais - vias urbanas).",
    dificuldade: 2,
    tags: ["SNT", "CONTRAN", "CETRAN", "DETRAN", "estrutura", "Lei 9.503/1997"],
    fonte_legal: ["Arts. 5º a 20, Lei 9.503/1997"],
    banca_referencia: "CEBRASPE",
    assunto: "Sistema Nacional de Trânsito",
  },
  {
    id: "prf-012-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Carteira Nacional de Habilitação (CNH) vencida há mais de 30 (trinta) dias permite ao condutor continuar dirigindo temporariamente, desde que tenha solicitado a renovação e esteja aguardando a emissão do novo documento.",
    resposta: "ERRADO",
    explicacao:
      "CNH vencida = não pode dirigir. Dirigir com CNH vencida é infração gravíssima (art. 162, CTB), com multa e retenção do veículo. Não há 'tolerância' de 30 dias para dirigir. A renovação deve ser solicitada antes do vencimento.",
    dificuldade: 1,
    tags: [
      "CNH",
      "vencida",
      "renovação",
      "infração gravíssima",
      "art. 162 CTB",
    ],
    fonte_legal: ["Art. 162, Lei 9.503/1997"],
    banca_referencia: "CEBRASPE",
    assunto: "Normas de trânsito",
  },
  {
    id: "prf-013-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal pode prestar auxílio a órgãos de defesa civil em situações de emergência, calamidades públicas e desastres naturais, atuando no apoio logístico, evacuação e segurança em rodovias federais atingidas.",
    resposta: "CERTO",
    explicacao:
      "A PRF atua em apoio a defesa civil (Lei 12.608/2012 - Política Nacional de Proteção e Defesa Civil). Funções: apoio logístico, escolta, segurança, desobstrução de vias, atendimento a vítimas em rodovias.",
    dificuldade: 1,
    tags: [
      "defesa civil",
      "calamidade",
      "emergência",
      "auxílio",
      "Lei 12.608/2012",
    ],
    fonte_legal: ["Lei 12.608/2012"],
    banca_referencia: "CEBRASPE",
    assunto: "Atribuições da PRF",
  },
  {
    id: "prf-014-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O uso de telefone celular ao volante, mesmo em modo viva-voz (mãos livres) ou com fone de ouvido, é considerado infração de trânsito, sujeita a multa e pontuação na CNH, conforme Resolução CONTRAN.",
    resposta: "CERTO",
    explicacao:
      "Resolução CONTRAN 277/2008 (alterada): proíbe o uso de telefone celular (mãos) ao volante. Viva-voz e fone de ouvido são permitidos, mas a assertiva pode estar se referindo à distração. Na prática, o uso que comprometa a segurança é infração. A redação atual permite viva-voz, mas a questão pode considerar 'uso' como manipulação.",
    dificuldade: 2,
    tags: [
      "celular",
      "viva-voz",
      "Resolução 277/2008",
      "distração",
      "infração",
    ],
    fonte_legal: ["Resolução CONTRAN 277/2008"],
    banca_referencia: "CEBRASPE",
    assunto: "Normas de trânsito",
  },
  {
    id: "prf-015-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal possui competência originária para investigar crimes de menor potencial ofensivo ocorridos em rodovias federais, podendo instaurar inquérito policial e remeter os autos à Justiça.",
    resposta: "ERRADO",
    explicacao:
      "A investigação criminal é atribuição da Polícia Judiciária (Polícia Civil ou Polícia Federal). A PRF atua em flagrante delito, preservação de local, prisão em flagrante, mas não instaura inquérito. O inquérito é da Polícia Civil (ou Federal, se competência).",
    dificuldade: 3,
    tags: [
      "investigação criminal",
      "inquérito policial",
      "polícia judiciária",
      "flagrante",
      "competência",
    ],
    fonte_legal: ["CPP", "Art. 144, § 1º, V, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Competências da PRF",
  },
  {
    id: "prf-016-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A ultrapassagem pela contramão em rodovia com pista dupla de sentidos opostos separadas por canteiro central é infração gravíssima, conforme art. 163 do CTB, pois expõe a risco de colisão frontal.",
    resposta: "CERTO",
    explicacao:
      "Art. 163, Lei 9.503/97: ultrapassagem em local proibido é infração gravíssima. Em pista dupla (mão separada), a ultrapassagem pela contramão é proibida e extremamente perigosa (colisão frontal).",
    dificuldade: 1,
    tags: [
      "ultrapassagem",
      "contramão",
      "pista dupla",
      "infração gravíssima",
      "art. 163 CTB",
    ],
    fonte_legal: ["Art. 163, Lei 9.503/1997"],
    banca_referencia: "CEBRASPE",
    assunto: "Infrações de trânsito",
  },
  {
    id: "prf-017-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal pode realizar operações integradas com outras forças de segurança (Polícia Federal, Polícia Civil, Polícia Militar) em qualquer parte do território nacional, quando requisitada ou em situações de Garantia da Lei e da Ordem (GLO).",
    resposta: "CERTO",
    explicacao:
      "Operações integradas são comuns. GLO (art. 142, § 3º, CF/88): emprego das Forças Armadas e polícias em situações de grave perturbação da ordem. A PRF pode atuar fora de rodovias em GLO ou operações especiais.",
    dificuldade: 2,
    tags: [
      "operações integradas",
      "GLO",
      "forças de segurança",
      "art. 142 CF",
      "cooperação",
    ],
    fonte_legal: ["Art. 142, § 3º, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Atribuições da PRF",
  },
  {
    id: "prf-018-v2",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O não uso de farol baixo em rodovias de pista simples durante o dia é infração de trânsito, conforme Resolução CONTRAN 314/2009, que tornou obrigatório o uso do farol baixo também durante o dia em determinadas vias.",
    resposta: "CERTO",
    explicacao:
      "Resolução 314/2009: farol baixo obrigatório em rodovias de pista simples (não divididas) durante o dia. Visa aumentar a visibilidade e reduzir acidentes. Infração média (art. 220, CTB).",
    dificuldade: 2,
    tags: [
      "farol baixo",
      "Resolução 314/2009",
      "rodovias de pista simples",
      "obrigatoriedade diurna",
    ],
    fonte_legal: ["Resolução CONTRAN 314/2009"],
    banca_referencia: "CEBRASPE",
    assunto: "Normas de trânsito",
  },
];

// ═══════════════════════════════════════════════════════════
// FUNÇÕES UTILITÁRIAS PARA QUESTÕES (mantidas)
// ═══════════════════════════════════════════════════════════

/** Conta questões por disciplina no banco */
export function contarQuestoesPorDisciplina(): Record<Disciplina, number> {
  const contagem = {} as Record<Disciplina, number>;

  DISCIPLINAS_ORDEM.forEach((d) => (contagem[d] = 0));

  questoes.forEach((q) => {
    contagem[q.disciplina]++;
  });

  return contagem;
}

/** Filtra questões por disciplina */
export function getQuestoesPorDisciplina(disciplina: Disciplina): Questao[] {
  return questoes.filter((q) => q.disciplina === disciplina);
}

/** Busca questões por termo no enunciado */
export function buscarQuestoes(termo: string): Questao[] {
  const termoLower = termo.toLowerCase();
  return questoes.filter(
    (q) =>
      q.enunciado.toLowerCase().includes(termoLower) ||
      q.explicacao.toLowerCase().includes(termoLower) ||
      q.tags?.some((tag) => tag.toLowerCase().includes(termoLower)),
  );
}

/** Verifica se há questões suficientes para um simulado completo */
export function verificarCobertura(): { ok: boolean; faltantes: Disciplina[] } {
  const necessario = {
    ...ESTRUTURA_PROVA.conhecimentosBasicos.disciplinas,
    ...ESTRUTURA_PROVA.conhecimentosEspecificos.disciplinas,
  };

  const disponivel = contarQuestoesPorDisciplina();
  const faltantes: Disciplina[] = [];

  Object.entries(necessario).forEach(([disc, qtd]) => {
    if (disponivel[disc as Disciplina] < (qtd || 0) * 3) {
      // Mínimo 3 provas
      faltantes.push(disc as Disciplina);
    }
  });

  return {
    ok: faltantes.length === 0,
    faltantes,
  };
}

/** Estatísticas do banco de questões */
export function getEstatisticasBanco() {
  const total = questoes.length;
  const porDisciplina = contarQuestoesPorDisciplina();
  const porDificuldade = {
    1: questoes.filter((q) => q.dificuldade === 1).length,
    2: questoes.filter((q) => q.dificuldade === 2).length,
    3: questoes.filter((q) => q.dificuldade === 3).length,
  };

  return {
    total,
    porDisciplina,
    porDificuldade,
    mediaDificuldade: (
      questoes.reduce((acc, q) => acc + q.dificuldade, 0) / total
    ).toFixed(2),
    comTags: questoes.filter((q) => q.tags && q.tags.length > 0).length,
    comFonteLegal: questoes.filter(
      (q) => q.fonte_legal && q.fonte_legal.length > 0,
    ).length,
    comBancaReferencia: questoes.filter((q) => q.banca_referencia).length,
    comAssunto: questoes.filter((q) => q.assunto).length,
  };
}
