import { Questao } from "../types";

export const questoesDireitoConstitucional: Questao[] = [
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
];

export const totalQuestoesDireitoConstitucional =
  questoesDireitoConstitucional.length;
