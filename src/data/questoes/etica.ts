import { Questao } from "../types";

export const questoesEtica: Questao[] = [
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
];

export const totalQuestoesEtica = questoesEtica.length;
