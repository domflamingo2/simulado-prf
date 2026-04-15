import { Questao } from "../types";

export const questoesDireitoAdministrativo: Questao[] = [
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
];

export const totalQuestoesDireitoAdministrativo = questoesDireitoAdministrativo.length;
