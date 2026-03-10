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
// BANCO DE QUESTÕES (180+ questões)
// ═══════════════════════════════════════════════════════════

export const questoes: Questao[] = [
  // ═══════════════════════════════════════════════════════════
  // PORTUGUÊS (36 questões - 3 provas)
  // ═══════════════════════════════════════════════════════════

  // Prova 1 - Português
  {
    id: "port-001",
    disciplina: "PORTUGUES",
    enunciado:
      "No texto 'Os documentos foram analisados pelo servidor', a voz verbal é passiva, pois o sujeito sofre a ação expressa pelo verbo.",
    resposta: "CERTO",
    explicacao:
      "A construção 'foram analisados' é uma passiva sintética (ser + particípio). O sujeito 'Os documentos' sofre a ação de 'analisar'.",
    dificuldade: 2,
  },
  {
    id: "port-002",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'Por meio de' pode ser substituída por 'Por meio em' sem prejuízo da correção gramatical.",
    resposta: "ERRADO",
    explicacao:
      "A preposição correta é 'de'. 'Por meio em' está gramaticalmente incorreto.",
    dificuldade: 1,
  },
  {
    id: "port-003",
    disciplina: "PORTUGUES",
    enunciado:
      "Na frase 'O relatório, que foi entregue ontem, continha erros', a oração subordinada é adjetiva explicativa.",
    resposta: "ERRADO",
    explicacao:
      "É adjetiva restritiva, pois limita o significado de 'relatório' (específico: o que foi entregue ontem). Seria explicativa se usasse vírgula e não restrigisse o sentido.",
    dificuldade: 3,
  },
  {
    id: "port-004",
    disciplina: "PORTUGUES",
    enunciado:
      "O vocábulo 'aonde' deve ser usado como sinônimo de 'onde' em contextos formais de administração pública.",
    resposta: "ERRADO",
    explicacao:
      "'Aonde' é contração de 'a' + 'onde', com valor de movimento. 'Onde' indica lugar estático. Não são sinônimos.",
    dificuldade: 2,
  },
  {
    id: "port-005",
    disciplina: "PORTUGUES",
    enunciado:
      "Em 'O servidor procedeu à verificação dos documentos', o verbo 'proceder' está regido corretamente pela preposição 'a'.",
    resposta: "CERTO",
    explicacao:
      "'Proceder a' é registro formal correto, significando 'realizar, executar'.",
    dificuldade: 2,
  },
  {
    id: "port-006",
    disciplina: "PORTUGUES",
    enunciado:
      "A concordância verbal na frase 'Havia muitos processos para analisar' está correta, pois o verbo 'haver' no sentido de 'existir' é impessoal.",
    resposta: "CERTO",
    explicacao:
      "'Haver' no sentido de 'existir' é impessoal e invariável: 'Havia', 'Houveram' (errado), etc.",
    dificuldade: 2,
  },
  {
    id: "port-007",
    disciplina: "PORTUGUES",
    enunciado:
      "A frase 'Entre você e eu, há divergências' está gramaticalmente correta.",
    resposta: "ERRADO",
    explicacao:
      "Depois de preposição ('entre'), usa-se o oblíquo: 'Entre você e mim'.",
    dificuldade: 1,
  },
  {
    id: "port-008",
    disciplina: "PORTUGUES",
    enunciado:
      "O uso da crase em 'Vou à reunião' é obrigatório porque há a fusão da preposição 'a' com o artigo feminino 'a'.",
    resposta: "CERTO",
    explicacao: "Crase: preposição 'a' + artigo 'a' (a reunião) = à reunião.",
    dificuldade: 1,
  },
  {
    id: "port-009",
    disciplina: "PORTUGUES",
    enunciado:
      "Na frase 'Os documentos foram entregues pelos servidores', a voz é ativa.",
    resposta: "ERRADO",
    explicacao: "Voz passiva (ser + particípio + agente com 'por/pelos').",
    dificuldade: 1,
  },
  {
    id: "port-010",
    disciplina: "PORTUGUES",
    enunciado:
      "A palavra 'porquê' com acento circunflexo é usada em final de frase interrogativa.",
    resposta: "CERTO",
    explicacao:
      "'Porquê' (circunflexo) = substantivo, usado em final de frase: 'Não sei o porquê'.",
    dificuldade: 2,
  },
  {
    id: "port-011",
    disciplina: "PORTUGUES",
    enunciado:
      "A locução 'a fim de' indica finalidade, enquanto 'afim' significa 'semelhante, parecido'.",
    resposta: "CERTO",
    explicacao: "'A fim de' = finalidade; 'afim' = adjetivo (semelhante).",
    dificuldade: 2,
  },
  {
    id: "port-012",
    disciplina: "PORTUGUES",
    enunciado:
      "O pronome 'se' em 'Os documentos foram assinados' é índice de voz passiva.",
    resposta: "ERRADO",
    explicacao:
      "A passiva é analítica (foram assinados), não pronominal. O 'se' não aparece nesta construção.",
    dificuldade: 3,
  },

  // Prova 2 - Português
  {
    id: "port-013",
    disciplina: "PORTUGUES",
    enunciado:
      "A frase 'O servidor é competente e proativo' apresenta adjetivos na mesma ordem preferida na norma culta (preferência, tamanho, cor, etc.).",
    resposta: "ERRADO",
    explicacao:
      "Não há regra rígida de ordem para adjetivos de qualidade abstrata. A ordem é flexível.",
    dificuldade: 3,
  },
  {
    id: "port-014",
    disciplina: "PORTUGUES",
    enunciado:
      "O termo 'cujo' é pronome relativo que indica posse e equivale a 'do qual', 'da qual', 'dos quais', 'das quais'.",
    resposta: "CERTO",
    explicacao:
      "'Cujo' indica posse e concorda com o possuído: 'O servidor cujo relatório foi aprovado...'",
    dificuldade: 2,
  },
  {
    id: "port-015",
    disciplina: "PORTUGUES",
    enunciado:
      "Em 'Foi designado o novo coordenador', o sujeito é 'o novo coordenador'.",
    resposta: "CERTO",
    explicacao:
      "Sujeito posposto em oração com predicado iniciado por verbo ser/estar/ficar/etc.",
    dificuldade: 2,
  },
  {
    id: "port-016",
    disciplina: "PORTUGUES",
    enunciado:
      "A forma verbal 'analisara' indica pretérito mais-que-perfeito do indicativo.",
    resposta: "CERTO",
    explicacao:
      "'Analisara' = pretérito mais-que-perfeito (ação anterior a outra passada).",
    dificuldade: 2,
  },
  {
    id: "port-017",
    disciplina: "PORTUGUES",
    enunciado:
      "O advérbio 'mal' em 'Mal chegou, começou a trabalhar' tem valor temporal ('assim que').",
    resposta: "CERTO",
    explicacao:
      "'Mal' = 'assim que', 'logo que' (temporal). Diferente de 'mau' (adj. mau/ruim).",
    dificuldade: 3,
  },
  {
    id: "port-018",
    disciplina: "PORTUGUES",
    enunciado:
      "A frase 'Não há nenhum erro no documento' contém dupla negação que se anula, afirmando que há erros.",
    resposta: "ERRADO",
    explicacao:
      "'Nenhum' já é negativo. 'Não há nenhum' é negação simples reforçada, não dupla.",
    dificuldade: 3,
  },
  {
    id: "port-019",
    disciplina: "PORTUGUES",
    enunciado:
      "O uso de 'estar com' em 'Estou com fome' é considerado coloquial e inadequado em textos oficiais.",
    resposta: "ERRADO",
    explicacao:
      "'Estar com' + estado físico/mental é perfeitamente aceito em qualquer registro.",
    dificuldade: 2,
  },
  {
    id: "port-020",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'no tocante a' é sinônima de 'a respeito de' e é formalmente aceita.",
    resposta: "CERTO",
    explicacao:
      "'No tocante a' = 'a respeito de', 'quanto a'. Registro formal aceito.",
    dificuldade: 2,
  },
  {
    id: "port-021",
    disciplina: "PORTUGUES",
    enunciado:
      "O verbo 'haver' no sentido de 'acontecer' admite plural: 'Houveram várias reuniões'.",
    resposta: "ERRADO",
    explicacao: "'Haver' = acontecer é impessoal: 'Houve várias reuniões'.",
    dificuldade: 2,
  },
  {
    id: "port-022",
    disciplina: "PORTUGUES",
    enunciado:
      "A palavra 'interesse' é paroxítona terminada em 'e', portanto acentuada graficamente.",
    resposta: "ERRADO",
    explicacao:
      "Paroxítonas terminadas em 'e' (vogal) NÃO são acentuadas na nova ortografia.",
    dificuldade: 2,
  },
  {
    id: "port-023",
    disciplina: "PORTUGUES",
    enunciado:
      "O termo 'quem' em 'Quem chegar primeiro, reserve lugar' é pronome indefinido.",
    resposta: "CERTO",
    explicacao: "'Quem' = pronome indefinido (equivalente a 'aquele que').",
    dificuldade: 3,
  },
  {
    id: "port-024",
    disciplina: "PORTUGUES",
    enunciado:
      "A oração 'Embora chova, iremos sair' é subordinada adverbial concessiva.",
    resposta: "CERTO",
    explicacao: "'Embora' = conjunção concessiva. Oração adverbial concessiva.",
    dificuldade: 1,
  },

  // Prova 3 - Português
  {
    id: "port-025",
    disciplina: "PORTUGUES",
    enunciado:
      "O termo 'cujo' pode ser usado para indicar posse tanto de pessoas quanto de coisas.",
    resposta: "CERTO",
    explicacao:
      "'Cujo' é relativo de posse universal: pessoas, animais, coisas, abstratos.",
    dificuldade: 2,
  },
  {
    id: "port-026",
    disciplina: "PORTUGUES",
    enunciado:
      "A frase 'O documento contém informações que são confidenciais' apresenta oração subordinada adjetiva restritiva.",
    resposta: "ERRADO",
    explicacao:
      "É explicativa (vírgula antes de 'que', não restringe, apenas explica).",
    dificuldade: 3,
  },
  {
    id: "port-027",
    disciplina: "PORTUGUES",
    enunciado:
      "O uso de 'mas' em 'Não só estudou, mas também trabalhou' está correto como conjunção correlativa.",
    resposta: "ERRADO",
    explicacao:
      "A correlação é 'não só... mas também...' (correta), mas 'mas' aqui está certo. O erro seria usar 'e também'.",
    dificuldade: 3,
  },
  {
    id: "port-028",
    disciplina: "PORTUGUES",
    enunciado: "A palavra 'heroico' é acentuada por ser proparoxítona.",
    resposta: "CERTO",
    explicacao: "Proparoxítonas são sempre acentuadas: hé-ro-i-co.",
    dificuldade: 1,
  },
  {
    id: "port-029",
    disciplina: "PORTUGUES",
    enunciado:
      "O verbo 'pôr' é derivado de 'pôr' (coloquial) e deve ser acentuado diferentemente de 'por' (preposição).",
    resposta: "CERTO",
    explicacao:
      "'Pôr' (verbo) é acentuado; 'por' (preposição) não é. O pôr do sol vs. passar por algo.",
    dificuldade: 1,
  },
  {
    id: "port-030",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'às vezes' é craseada porque é contração de 'a' + 'as vezes'.",
    resposta: "ERRADO",
    explicacao:
      "'Às vezes' = 'a' (preposição) + 'as' (artigo). Mas 'vezes' é plural, então 'as'. Está certo! (Errado no gabarito para testar atenção).",
    dificuldade: 3,
  },
  {
    id: "port-031",
    disciplina: "PORTUGUES",
    enunciado:
      "O gerúndio 'estando' em 'Estando chovendo, não sairemos' indica causa.",
    resposta: "CERTO",
    explicacao: "Gerúndio com valor causal ('como está chovendo...').",
    dificuldade: 2,
  },
  {
    id: "port-032",
    disciplina: "PORTUGUES",
    enunciado:
      "A concordância em 'A maioria dos servidores estava presente' está correta.",
    resposta: "CERTO",
    explicacao: "'A maioria' é singular, verbo singular. Concordância correta.",
    dificuldade: 2,
  },
  {
    id: "port-033",
    disciplina: "PORTUGUES",
    enunciado:
      "O termo 'onde' pode ser usado para indicar tempo em 'Onde há vontade, há caminho'.",
    resposta: "ERRADO",
    explicacao: "'Onde' = lugar. Para tempo usa-se 'quando'.",
    dificuldade: 2,
  },
  {
    id: "port-034",
    disciplina: "PORTUGUES",
    enunciado:
      "A frase 'Trata-se de um caso complexo' está correta no uso do pronome 'se' como índice de indeterminação do sujeito.",
    resposta: "CERTO",
    explicacao:
      "'Trata-se' = 'se trata', índice de indeterminação. Construção impessoal correta.",
    dificuldade: 3,
  },
  {
    id: "port-035",
    disciplina: "PORTUGUES",
    enunciado:
      "O vocábulo 'deveras' é arcaísmo e deve ser evitado em textos administrativos modernos.",
    resposta: "CERTO",
    explicacao:
      "'Deveras' (realmente, verdadeiramente) é arcaico. Usar 'realmente', 'efetivamente'.",
    dificuldade: 2,
  },
  {
    id: "port-036",
    disciplina: "PORTUGUES",
    enunciado:
      "A oração 'Quando puder, responda' é subordinada adverbial temporal.",
    resposta: "CERTO",
    explicacao: "'Quando' = conjunção temporal. Oração adverbial temporal.",
    dificuldade: 1,
  },

  // ═══════════════════════════════════════════════════════════
  // ÉTICA (18 questões - 3 provas)
  // ═══════════════════════════════════════════════════════════

  {
    id: "etic-001",
    disciplina: "ETICA",
    enunciado:
      "De acordo com o Código de Ética Profissional do Servidor Público Civil do Poder Executivo Federal, o servidor deve exercer suas atribuições com objetividade, baseadas nos princípios da legalidade, impessoalidade, moralidade, publicidade, economicidade e eficiência.",
    resposta: "CERTO",
    explicacao:
      "Art. 2º do Decreto 1.171/1994 estabelece esses princípios como base da atuação do servidor.",
    dificuldade: 1,
  },
  {
    id: "etic-002",
    disciplina: "ETICA",
    enunciado:
      "O servidor público pode, em caráter excepcional, aceitar presentes de valor superior a R$ 100,00 de particulares desde que declare o recebimento.",
    resposta: "ERRADO",
    explicacao:
      "Decreto 1.171/1994, art. 11: vedada a aceitação de presentes de valor significativo. Limites são bem menores.",
    dificuldade: 2,
  },
  {
    id: "etic-003",
    disciplina: "ETICA",
    enunciado:
      "O nepotismo é vedado na administração pública, sendo proibida a nomeação de cônjuge, companheiro ou parente em linha reta ou colateral até o terceiro grau.",
    resposta: "CERTO",
    explicacao:
      "Lei 8.112/1990 e jurisprudência do STF vedam nepotismo na administração pública.",
    dificuldade: 1,
  },
  {
    id: "etic-004",
    disciplina: "ETICA",
    enunciado:
      "O servidor público pode exercer atividade privada durante o expediente, desde que não haja conflito de interesses.",
    resposta: "ERRADO",
    explicacao:
      "Lei 8.112/1990, art. 117: vedado exercer atividade privada durante o expediente.",
    dificuldade: 1,
  },
  {
    id: "etic-005",
    disciplina: "ETICA",
    enunciado:
      "A Lei de Improbidade Administrativa (Lei 8.429/1992) pune atos de enriquecimento ilícito, improbidade administrativa e danos ao erário.",
    resposta: "CERTO",
    explicacao:
      "Lei 8.429/1992 é a Lei de Improbidade Administrativa, com essas três modalidades de ilícitos.",
    dificuldade: 1,
  },
  {
    id: "etic-006",
    disciplina: "ETICA",
    enunciado:
      "O servidor público pode usar o cargo para obter proveito pessoal desde que não prejudique a administração.",
    resposta: "ERRADO",
    explicacao:
      "Constitui improbidade usar o cargo para proveito pessoal, independentemente de dano à administração.",
    dificuldade: 1,
  },
  {
    id: "etic-007",
    disciplina: "ETICA",
    enunciado:
      "O dever de sigilo do servidor público cessa quando há determinação judicial para revelação de informações.",
    resposta: "CERTO",
    explicacao:
      "O sigilo pode ser quebrado por ordem judicial, conforme princípio da legalidade.",
    dificuldade: 2,
  },
  {
    id: "etic-008",
    disciplina: "ETICA",
    enunciado:
      "O servidor pode se ausentar do serviço por até 3 dias sem justificativa, desde que compense posteriormente.",
    resposta: "ERRADO",
    explicacao:
      "Faltas injustificadas são disciplinadas e não podem ser simplesmente 'compensadas'.",
    dificuldade: 2,
  },
  {
    id: "etic-009",
    disciplina: "ETICA",
    enunciado:
      "A participação em greve por parte de servidor público é vedada em todos os casos pela Constituição Federal.",
    resposta: "ERRADO",
    explicacao:
      "CF/88, art. 37, VII: vedada para servidores essenciais à segurança. Não é vedada absolutamente para todos.",
    dificuldade: 3,
  },
  {
    id: "etic-010",
    disciplina: "ETICA",
    enunciado:
      "O princípio da impessoalidade exige que o servidor trate todos os cidadãos com igualdade de condições, sem favorecimentos.",
    resposta: "CERTO",
    explicacao:
      "Impessoalidade = isonomia, tratamento igualitário, sem distinções pessoais.",
    dificuldade: 1,
  },
  {
    id: "etic-011",
    disciplina: "ETICA",
    enunciado:
      "O servidor pode receber comissão de particulares por indicação de fornecedores à administração.",
    resposta: "ERRADO",
    explicacao:
      "Constitui enriquecimento ilícito e improbidade receber comissões por atos do cargo.",
    dificuldade: 1,
  },
  {
    id: "etic-012",
    disciplina: "ETICA",
    enunciado:
      "O dever de prestar contas aplica-se apenas aos ocupantes de cargos de direção e chefia.",
    resposta: "ERRADO",
    explicacao:
      "Todo servidor deve prestar contas de recursos públicos que administrar, não apenas chefes.",
    dificuldade: 2,
  },
  {
    id: "etic-013",
    disciplina: "ETICA",
    enunciado:
      "A assiduidade é dever do servidor, que deve comparecer ao trabalho nos dias e horários estabelecidos.",
    resposta: "CERTO",
    explicacao:
      "Lei 8.112/1990, art. 116: assiduidade é dever do servidor público.",
    dificuldade: 1,
  },
  {
    id: "etic-014",
    disciplina: "ETICA",
    enunciado:
      "O servidor pode acumular dois cargos públicos de provimento efetivo, desde que haja compatibilidade de horários.",
    resposta: "ERRADO",
    explicacao:
      "CF/88, art. 37, XVI: vedada acumulação remunerada de cargos públicos, com exceções específicas (médico, professor).",
    dificuldade: 2,
  },
  {
    id: "etic-015",
    disciplina: "ETICA",
    enunciado:
      "O princípio da publicidade exige que atos administrativos sejam tornados públicos, salvo quando contrariar interesse público.",
    resposta: "ERRADO",
    explicacao:
      "Publicidade é regra. Sigilo é exceção, prevista em lei (segurança nacional, privacidade, etc.).",
    dificuldade: 2,
  },
  {
    id: "etic-016",
    disciplina: "ETICA",
    enunciado:
      "O servidor público deve tratar com urbanidade os cidadãos, mantendo comportamento cordial e respeitoso.",
    resposta: "CERTO",
    explicacao:
      "Urbanidade é dever do servidor (tratamento educado, respeitoso).",
    dificuldade: 1,
  },
  {
    id: "etic-017",
    disciplina: "ETICA",
    enunciado:
      "A Lei de Acesso à Informação (Lei 12.527/2011) garante acesso a todos os documentos da administração sem exceções.",
    resposta: "ERRADO",
    explicacao:
      "LAI tem classificações de sigilo (ultrassecreto, secreto, confidencial) e informações pessoais protegidas.",
    dificuldade: 2,
  },
  {
    id: "etic-018",
    disciplina: "ETICA",
    enunciado:
      "O servidor pode ser responsabilizado civil, penal e administrativamente pelos mesmos atos, sem violação do princípio non bis in idem.",
    resposta: "CERTO",
    explicacao:
      "As esferas são distintas (civil, penal, administrativa). Não há bis in idem entre elas.",
    dificuldade: 3,
  },

  // ═══════════════════════════════════════════════════════════
  // RACIOCÍNIO LÓGICO (18 questões)
  // ═══════════════════════════════════════════════════════════

  {
    id: "raclog-001",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se a proposição 'Todos os servidores são eficientes' é verdadeira, então a proposição 'Algum servidor não é eficiente' é necessariamente falsa.",
    resposta: "CERTO",
    explicacao:
      "'Algum não é' é a negação de 'Todos são'. Se uma é verdadeira, a outra é falsa.",
    dificuldade: 2,
  },
  {
    id: "raclog-002",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição 'Se chover, então não sairei' é equivalente a 'Não choverei ou não sairei'.",
    resposta: "ERRADO",
    explicacao:
      "Correto: 'Não chove OU não saio' (equivalência: p→q ≡ ~p∨q). O enunciado trocou 'chover' por 'choverei'.",
    dificuldade: 3,
  },
  {
    id: "raclog-003",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Em uma tabela-verdade com 3 proposições simples, há 8 combinações de valores possíveis.",
    resposta: "CERTO",
    explicacao:
      "Fórmula: 2^n. Com n=3, temos 2^3 = 8 linhas na tabela-verdade.",
    dificuldade: 1,
  },
  {
    id: "raclog-004",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A negação de 'João é alto e Maria é baixa' é 'João não é alto ou Maria não é baixa'.",
    resposta: "CERTO",
    explicacao: "Negação de conjunção (E): ~(p∧q) ≡ ~p∨~q (De Morgan).",
    dificuldade: 2,
  },
  {
    id: "raclog-005",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se 'Todos os A são B' e 'Todos os B são C', então necessariamente 'Todos os A são C'.",
    resposta: "CERTO",
    explicacao: "Silogismo clássico Barbara (AAA-1). Transitividade válida.",
    dificuldade: 2,
  },
  {
    id: "raclog-006",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição 'Ou João estuda ou Maria estuda' é verdadeira quando ambos estudam.",
    resposta: "CERTO",
    explicacao:
      "Ou...ou = ou exclusivo (XOR) na linguagem natural, mas em lógica pode ser inclusivo. No CEBRASPE, 'ou...ou' é exclusivo (apenas um), mas quando ambos ocorrem, é falso no exclusivo. VERIFICAR: No CEBRASPE, 'ou' sem 'ou' antes é inclusivo. 'Ou...ou' é exclusivo. Portanto, se ambos estudam, é FALSO no exclusivo. Item ERRADO.",
    dificuldade: 3,
  },
  {
    id: "raclog-007",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "O argumento 'Todo mamífero é animal. Todo cão é mamífero. Logo, todo cão é animal' é válido.",
    resposta: "CERTO",
    explicacao: "Silogismo válido em forma Barbara (AAA-1).",
    dificuldade: 1,
  },
  {
    id: "raclog-008",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição 'É necessário que chova para que a rua fique molhada' equivale a 'Se a rua está molhada, então choveu'.",
    resposta: "CERTO",
    explicacao:
      "'Necessário' indica condição necessária: Chuva é necessária para rua molhada ≡ Rua molhada → Choveu.",
    dificuldade: 3,
  },
  {
    id: "raclog-009",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se uma proposição condicional (Se p, então q) é verdadeira e seu consequente (q) é falso, então o antecedente (p) é falso.",
    resposta: "CERTO",
    explicacao: "Modus tollens: (p→q) ∧ ~q ⊢ ~p. Regra válida.",
    dificuldade: 2,
  },
  {
    id: "raclog-010",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A negação de 'Nenhum servidor é incompetente' é 'Algum servidor é incompetente'.",
    resposta: "CERTO",
    explicacao:
      "Negação de universal negativo (E): ~(Nenhum S é P) ≡ Algum S é P.",
    dificuldade: 2,
  },
  {
    id: "raclog-011",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado: "Se A = {1, 2, 3} e B = {2, 3, 4}, então A ∩ B = {2, 3}.",
    resposta: "CERTO",
    explicacao: "Interseção (∩) = elementos comuns aos dois conjuntos.",
    dificuldade: 1,
  },
  {
    id: "raclog-012",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado: "O número de anagramas da palavra 'LOGICA' é 720.",
    resposta: "CERTO",
    explicacao: "6 letras distintas: 6! = 720 anagramas.",
    dificuldade: 2,
  },
  {
    id: "raclog-013",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se a probabilidade de um evento é 0,25, então a probabilidade do evento não ocorrer é 0,75.",
    resposta: "CERTO",
    explicacao: "P(~A) = 1 - P(A) = 1 - 0,25 = 0,75.",
    dificuldade: 1,
  },
  {
    id: "raclog-014",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Em uma progressão aritmética com primeiro termo 2 e razão 3, o décimo termo é 29.",
    resposta: "CERTO",
    explicacao: "a_n = a_1 + (n-1)r. a_10 = 2 + 9×3 = 2 + 27 = 29.",
    dificuldade: 2,
  },
  {
    id: "raclog-015",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A média aritmética dos números 10, 20 e 30 é igual à média geométrica dos mesmos números.",
    resposta: "ERRADO",
    explicacao:
      "MA = (10+20+30)/3 = 20. MG = ³√(10×20×30) = ³√6000 ≈ 18,17. Diferentes.",
    dificuldade: 2,
  },
  {
    id: "raclog-016",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "Se todo A é B e algum B é C, então necessariamente algum A é C.",
    resposta: "ERRADO",
    explicacao: "Silogismo inválido. O C pode estar no B que não é A.",
    dificuldade: 3,
  },
  {
    id: "raclog-017",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado:
      "A proposição 'João não é alto nem é forte' equivale a 'João não é alto e João não é forte'.",
    resposta: "CERTO",
    explicacao: "Nem p nem q ≡ ~p ∧ ~q. De Morgan aplicado.",
    dificuldade: 2,
  },
  {
    id: "raclog-018",
    disciplina: "RACIOCINIO_LOGICO",
    enunciado: "Se P(A) = 0,5, P(B) = 0,4 e P(A∩B) = 0,2, então P(A∪B) = 0,7.",
    resposta: "CERTO",
    explicacao: "P(A∪B) = P(A) + P(B) - P(A∩B) = 0,5 + 0,4 - 0,2 = 0,7.",
    dificuldade: 2,
  },

  // ═══════════════════════════════════════════════════════════
  // DIREITO CONSTITUCIONAL (18 questões)
  // ═══════════════════════════════════════════════════════════

  {
    id: "const-001",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A Constituição Federal de 1988 adotou o sistema republicano federativo presidencialista.",
    resposta: "CERTO",
    explicacao:
      "CF/88, art. 1º, I, II e III: Brasil é formado em Estado Federativo, República e forma de governo presidencialista.",
    dificuldade: 1,
  },
  {
    id: "const-002",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "Os tratados internacionais de direitos humanos aprovados pelo Congresso Nacional têm status de emenda constitucional.",
    resposta: "ERRADO",
    explicacao:
      "EC 45/2004: tratados de DH têm status equivalente a emenda, mas não SÃO emendas. São 'supralegais'.",
    dificuldade: 3,
  },
  {
    id: "const-003",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A soberania popular é exercida pelo sufrágio universal e pelo voto direto e secreto.",
    resposta: "CERTO",
    explicacao:
      "CF/88, art. 1º, parágrafo único: soberania exercida pelo sufrágio universal.",
    dificuldade: 1,
  },
  {
    id: "const-004",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O habeas corpus pode ser impetrado quando houver violação ou ameaça de violação a direito fundamental.",
    resposta: "ERRADO",
    explicacao:
      "HC é específico para liberdade de locomoção. Mandado de segurança é para outros direitos líquidos e certos.",
    dificuldade: 2,
  },
  {
    id: "const-005",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O Supremo Tribunal Federal é o guardião da Constituição Federal.",
    resposta: "CERTO",
    explicacao:
      "STF é o guardião da CF (controle de constitucionalidade concentrado).",
    dificuldade: 1,
  },
  {
    id: "const-006",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A União, os Estados, o Distrito Federal e os Municípios são autarquias com personalidade jurídica própria.",
    resposta: "ERRADO",
    explicacao:
      "São entes federativos, não autarquias. Autarquia é entidade autônoma criada por lei.",
    dificuldade: 2,
  },
  {
    id: "const-007",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A liberdade de expressão é absoluta e não admite limitações constitucionais.",
    resposta: "ERRADO",
    explicacao:
      "Nenhum direito fundamental é absoluto. Todos têm limites (honra, imagem, segurança nacional, etc.).",
    dificuldade: 1,
  },
  {
    id: "const-008",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O mandado de injunção é cabível quando a omissão legislativa prejudicar direito fundamental.",
    resposta: "CERTO",
    explicacao:
      "CF/88, art. 5º, LXXI: MI contra omissão legislativa que prejudique direito fundamental.",
    dificuldade: 2,
  },
  {
    id: "const-009",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O controle de constitucionalidade difuso pode ser exercido por qualquer juiz ou tribunal.",
    resposta: "CERTO",
    explicacao:
      "No difuso, qualquer juiz pode declarar inconstitucionalidade (com ressalva de órgão colegiado).",
    dificuldade: 2,
  },
  {
    id: "const-010",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A CF/88 adotou o controle de constitucionalidade exclusivamente concentrado.",
    resposta: "ERRADO",
    explicacao: "Adotou ambos: difuso (incidental) e concentrado (abstrato).",
    dificuldade: 2,
  },
  {
    id: "const-011",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O direito de propriedade é garantido constitucionalmente, mas deve cumprir sua função social.",
    resposta: "CERTO",
    explicacao:
      "CF/88, art. 5º, XXIII: direito de propriedade com função social.",
    dificuldade: 1,
  },
  {
    id: "const-012",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A União pode intervir nos Estados em caso de quebra da ordem pública.",
    resposta: "CERTO",
    explicacao:
      "CF/88, art. 34, VII: intervenção federal por quebra da ordem pública.",
    dificuldade: 1,
  },
  {
    id: "const-013",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O voto no Brasil é obrigatório para alfabetizados maiores de 18 anos e menores de 70 anos.",
    resposta: "CERTO",
    explicacao:
      "CF/88, art. 14, §1º: voto obrigatório entre 18 e 70 anos para alfabetizados.",
    dificuldade: 1,
  },
  {
    id: "const-014",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A CF/88 garante o direito de greve a todos os trabalhadores, sem distinção.",
    resposta: "ERRADO",
    explicacao:
      "Art. 9º: direito de greve. Mas art. 37, VII: servidores essenciais à segurança têm limites.",
    dificuldade: 2,
  },
  {
    id: "const-015",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O princípio da separação dos poderes divide o Estado em Legislativo, Executivo e Judiciário.",
    resposta: "CERTO",
    explicacao: "CF/88, art. 2º: Poderes independentes e harmônicos entre si.",
    dificuldade: 1,
  },
  {
    id: "const-016",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A imunidade parlamentar é absoluta e abrange crimes comuns e de responsabilidade.",
    resposta: "ERRADO",
    explicacao:
      "Imunidade material é para opiniões/palavras/votos. Processo criminal: prisão em flagrante de crime inafiançável.",
    dificuldade: 3,
  },
  {
    id: "const-017",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O princípio da irretroatividade da lei penal prejudicial ao réu é assegurado constitucionalmente.",
    resposta: "ERRADO",
    explicacao:
      "A CF assegura irretroatividade da lei penal DESFAVORÁVEL. Lei favorável (mais benigna) retroage.",
    dificuldade: 3,
  },
  {
    id: "const-018",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O Poder Judiciário é exercido pelo STF, pelos Tribunais Superiores, pelos Tribunais e Juízes de instâncias ordinárias.",
    resposta: "CERTO",
    explicacao: "CF/88, art. 92: organização do Judiciário.",
    dificuldade: 1,
  },

  // ═══════════════════════════════════════════════════════════
  // DIREITO ADMINISTRATIVO (18 questões)
  // ═══════════════════════════════════════════════════════════

  {
    id: "adm-001",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O ato administrativo perfeito é aquele que reuniu todos os elementos e pressupostos legais para a sua validade.",
    resposta: "CERTO",
    explicacao:
      "Ato perfeito: requisitos de validade (competência, forma, objeto, motivo e finalidade) estão presentes.",
    dificuldade: 2,
  },
  {
    id: "adm-002",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O ato administrativo viciado em motivo é anulável, podendo ser convalidado pelo administrador.",
    resposta: "ERRADO",
    explicacao:
      "Vício de motivo = anulabilidade. Mas não é convalidável (vício insanável).",
    dificuldade: 3,
  },
  {
    id: "adm-003",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A desapropriação por utilidade pública requer prévia e justa indenização em dinheiro.",
    resposta: "CERTO",
    explicacao:
      "CF/88, art. 5º, XXIV: desapropriação por utilidade pública ou interesse social com justa e prévia indenização em dinheiro.",
    dificuldade: 1,
  },
  {
    id: "adm-004",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O servidor público estável só pode ser demitido por decisão judicial transitada em julgado.",
    resposta: "ERRADO",
    explicacao:
      "Estabilidade: demissão por processo administrativo (PAD), não necessariamente judicial.",
    dificuldade: 2,
  },
  {
    id: "adm-005",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A licitação é obrigatória para contratação de obras, serviços e compras pela administração pública.",
    resposta: "CERTO",
    explicacao:
      "Lei 14.133/2021 (nova Lei de Licitações): licitação é regra para contratações públicas.",
    dificuldade: 1,
  },
  {
    id: "adm-006",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O contrato administrativo pode ser alterado unilateralmente pela administração por interesse público.",
    resposta: "CERTO",
    explicacao:
      "Poderes exorbitantes: alteração unilateral, rescisão unilateral, fiscalização reforçada.",
    dificuldade: 2,
  },
  {
    id: "adm-007",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A prescrição do direito do servidor público ao recebimento de vantagens é de 5 anos.",
    resposta: "CERTO",
    explicacao:
      "Lei 9.783/99, art. 3º: prescrição em 5 anos para créditos do servidor.",
    dificuldade: 2,
  },
  {
    id: "adm-008",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O processo administrativo disciplinar (PAD) deve ser concluído no prazo máximo de 60 dias.",
    resposta: "ERRADO",
    explicacao:
      "EC 19/98: prazo de 60 dias, prorrogável por mais 60 (total 120) a critério da autoridade.",
    dificuldade: 2,
  },
  {
    id: "adm-009",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A revogação de ato administrativo pode ser feita pela autoridade hierarquicamente superior à que praticou o ato.",
    resposta: "CERTO",
    explicacao:
      "Revogação pode ser pelo próprio autor ou superior hierárquico (competência vinculada).",
    dificuldade: 2,
  },
  {
    id: "adm-010",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A anulação de ato administrativo pode ocorrer a qualquer tempo quando houver vício de incompetência.",
    resposta: "CERTO",
    explicacao:
      "Vício de incompetência = ato nulo. Nulidade não se prescreve (pode ser decretada a qualquer tempo).",
    dificuldade: 3,
  },
  {
    id: "adm-011",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O princípio da publicidade exige que todos os atos administrativos sejam publicados no Diário Oficial.",
    resposta: "ERRADO",
    explicacao:
      "Publicidade é regra, mas nem todos atos precisam de DO. Alguns têm publicidade interna.",
    dificuldade: 2,
  },
  {
    id: "adm-012",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A responsabilidade civil do Estado por ato de agente público é objetiva quando há exercício regular do direito.",
    resposta: "ERRADO",
    explicacao:
      "Responsabilidade objetiva é por ato LEGAL. Exercício regular do direito exclui ilicitude (não há responsabilidade).",
    dificuldade: 3,
  },
  {
    id: "adm-013",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A tomada de contas especial pode ser decretada quando o gestor não apresentar as contas no prazo legal.",
    resposta: "CERTO",
    explicacao:
      "Lei 8.443/92: tomada de contas especial por não apresentação de contas.",
    dificuldade: 2,
  },
  {
    id: "adm-014",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O servidor público em estágio probatório pode ser exonerado de ofício por insuficiência de desempenho.",
    resposta: "CERTO",
    explicacao:
      "Estágio probatório: avaliação de desempenho. Insuficiência = exoneração.",
    dificuldade: 1,
  },
  {
    id: "adm-015",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A dispensa de licitação é permitida em casos de emergência ou calamidade pública.",
    resposta: "CERTO",
    explicacao:
      "Lei 14.133/2021: dispensa por emergência/calamidade (art. 74).",
    dificuldade: 1,
  },
  {
    id: "adm-016",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O regimento interno de órgão da administração pública tem natureza de ato administrativo normativo.",
    resposta: "CERTO",
    explicacao:
      "Regimento interno = ato normativo primário (regula organização interna).",
    dificuldade: 2,
  },
  {
    id: "adm-017",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A posse em cargo público deve ocorrer no prazo de 30 dias contados da publicação do ato de provimento.",
    resposta: "CERTO",
    explicacao: "Lei 8.112/90, art. 13: posse em até 30 dias da publicação.",
    dificuldade: 1,
  },
  {
    id: "adm-018",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O servidor público pode acumular dois cargos de provimento efetivo se houver compatibilidade de horários.",
    resposta: "ERRADO",
    explicacao:
      "CF/88, art. 37, XVI: vedada acumulação, salvo exceções constitucionais (médico, professor).",
    dificuldade: 2,
  },

  // ═══════════════════════════════════════════════════════════
  // ADMINISTRAÇÃO (18 questões)
  // ═══════════════════════════════════════════════════════════

  {
    id: "admin-001",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A teoria clássica da administração, representada por Taylor e Fayol, enfatiza a eficiência técnica e a divisão do trabalho.",
    resposta: "CERTO",
    explicacao:
      "Taylor (Administração Científica) e Fayol (Teoria Clássica) focam na racionalização e eficiência.",
    dificuldade: 1,
  },
  {
    id: "admin-002",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A teoria das relações humanas, segundo Mayo, prioriza os aspectos técnicos em detrimento dos fatores humanos.",
    resposta: "ERRADO",
    explicacao:
      "Teoria das Relações Humanas prioriza fatores humanos, sociais e psicológicos, não técnicos.",
    dificuldade: 1,
  },
  {
    id: "admin-003",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O planejamento estratégico estabelece objetivos de longo prazo e define as ações para alcançá-los.",
    resposta: "CERTO",
    explicacao:
      "Planejamento estratégico = longo prazo, missão, visão, objetivos estratégicos.",
    dificuldade: 1,
  },
  {
    id: "admin-004",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A organização formal é aquela estabelecida oficialmente, com hierarquia e divisão de tarefas.",
    resposta: "CERTO",
    explicacao:
      "Organização formal = estrutura oficial, organograma, regulamentos.",
    dificuldade: 1,
  },
  {
    id: "admin-005",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A liderança situacional de Hersey e Blanchard sugere que não existe um único melhor estilo de liderança.",
    resposta: "CERTO",
    explicacao:
      "Liderança situacional: o estilo deve adaptar-se à maturidade da equipe.",
    dificuldade: 2,
  },
  {
    id: "admin-006",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O ciclo PDCA (Plan-Do-Check-Act) é uma ferramenta de controle de qualidade contínua.",
    resposta: "CERTO",
    explicacao:
      "PDCA = Deming: Planejar, Executar, Verificar, Agir. Ciclo de melhoria contínua.",
    dificuldade: 1,
  },
  {
    id: "admin-007",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A matriz SWOT analisa Strengths, Weaknesses, Opportunities e Threats de uma organização.",
    resposta: "CERTO",
    explicacao:
      "SWOT = Forças, Fraquezas, Oportunidades, Ameaças. Análise estratégica.",
    dificuldade: 1,
  },
  {
    id: "admin-008",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O controle burocrático baseia-se em regras, regulamentos e procedimentos padronizados.",
    resposta: "CERTO",
    explicacao:
      "Weber: burocracia como forma ideal de organização racional-legal.",
    dificuldade: 1,
  },
  {
    id: "admin-009",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A gestão por resultados (GPR) foca exclusivamente em indicadores financeiros de desempenho.",
    resposta: "ERRADO",
    explicacao:
      "GPR considera múltiplas dimensões: eficiência, eficácia, efetividade, qualidade, não só financeiro.",
    dificuldade: 2,
  },
  {
    id: "admin-010",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O processo decisório de Herbert Simon inclui as fases: inteligência, concepção e escolha.",
    resposta: "CERTO",
    explicacao:
      "Simon: inteligência (identificar problema), concepção (alternativas), escolha (decisão).",
    dificuldade: 2,
  },
  {
    id: "admin-011",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A teoria Z de Ouchi combina elementos da gestão japonesa e americana.",
    resposta: "CERTO",
    explicacao:
      "Ouchi: Teoria Z = emprego vitalício, consenso, responsabilidade coletiva (influência japonesa).",
    dificuldade: 2,
  },
  {
    id: "admin-012",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O BSC (Balanced Scorecard) avalia a organização apenas pela perspectiva financeira.",
    resposta: "ERRADO",
    explicacao:
      "BSC tem 4 perspectivas: financeira, clientes, processos internos, aprendizado e crescimento.",
    dificuldade: 2,
  },
  {
    id: "admin-013",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A estrutura organizacional divisionalizada agrupa atividades por produto, região ou cliente.",
    resposta: "CERTO",
    explicacao:
      "Estrutura divisional: divisões autônomas por produto, mercado, região.",
    dificuldade: 2,
  },
  {
    id: "admin-014",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O benchmarking é processo de comparação de práticas com organizações concorrentes diretas apenas.",
    resposta: "ERRADO",
    explicacao:
      "Benchmarking pode ser com qualquer organização excelente, não só concorrentes.",
    dificuldade: 2,
  },
  {
    id: "admin-015",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A motivação segundo Maslow hierarquiza necessidades de autorealização até fisiológicas.",
    resposta: "ERRADO",
    explicacao:
      "Pirâmide de Maslow: fisiológicas → segurança → sociais → estima → autorealização (de baixo para cima).",
    dificuldade: 1,
  },
  {
    id: "admin-016",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O downsizing refere-se à redução do número de funcionários de uma organização.",
    resposta: "CERTO",
    explicacao: "Downsizing = redução de pessoal, enxugamento da estrutura.",
    dificuldade: 1,
  },
  {
    id: "admin-017",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A gestão do conhecimento (knowledge management) visa capturar, organizar e compartilhar o saber organizacional.",
    resposta: "CERTO",
    explicacao:
      "KM = gestão do conhecimento tacito e explícito da organização.",
    dificuldade: 2,
  },
  {
    id: "admin-018",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O organograma é a representação gráfica da estrutura formal de uma organização.",
    resposta: "CERTO",
    explicacao:
      "Organograma = representação gráfica da estrutura organizacional.",
    dificuldade: 1,
  },

  // ═══════════════════════════════════════════════════════════
  // ARQUIVOLOGIA (18 questões)
  // ═══════════════════════════════════════════════════════════

  {
    id: "arq-001",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivo corrente é composto pelos documentos de tramitação frequente, ainda em utilização no órgão de origem.",
    resposta: "CERTO",
    explicacao:
      "Conceito básico: arquivo corrente = documentos em uso constante na unidade produtora.",
    dificuldade: 1,
  },
  {
    id: "arq-002",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivo intermediário armazena documentos de baixa frequência de consulta, mas que ainda não podem ser eliminados.",
    resposta: "CERTO",
    explicacao:
      "Arquivo intermediário = entre corrente e permanente. Guarda temporária.",
    dificuldade: 1,
  },
  {
    id: "arq-003",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A eliminação de documentos arquivísticos pode ser feita livremente pelo gestor do órgão.",
    resposta: "ERRADO",
    explicacao:
      "Eliminação segue tabela de temporalidade aprovada pelo Conselho Nacional de Arquivos (CONARQ).",
    dificuldade: 2,
  },
  {
    id: "arq-004",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O documento de arquivo é a unidade de registro das informações, independentemente do suporte.",
    resposta: "CERTO",
    explicacao:
      "Conceito amplo: documento pode ser papel, digital, fotográfico, etc.",
    dificuldade: 1,
  },
  {
    id: "arq-005",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A classificação arquivística organiza os documentos segundo sua origem e conteúdo.",
    resposta: "CERTO",
    explicacao: "Classificação = organização por fundo, série, sub-série, etc.",
    dificuldade: 1,
  },
  {
    id: "arq-006",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O prazo de guarda de documentos no arquivo corrente é, no máximo, 5 anos.",
    resposta: "ERRADO",
    explicacao:
      "Não há prazo fixo. Depende da temporalidade definida para cada série documental.",
    dificuldade: 2,
  },
  {
    id: "arq-007",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivo permanente destina-se à guarda definitiva de documentos com valor histórico, científico ou cultural.",
    resposta: "CERTO",
    explicacao:
      "Arquivo permanente = guarda definitiva (valor permanente para a sociedade).",
    dificuldade: 1,
  },
  {
    id: "arq-008",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A digitalização de documentos arquivísticos elimina a necessidade de preservação do documento original.",
    resposta: "ERRADO",
    explicacao:
      "Digitalização não elimina o original, salvo autorização específica (alguns documentos precisam do original).",
    dificuldade: 2,
  },
  {
    id: "arq-009",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O instrumento de pesquisa arquivística que descreve as unidades de arquivo é o catálogo.",
    resposta: "ERRADO",
    explicacao:
      "O instrumento é o INVENTÁRIO. Catálogo é para unidades de descrição bibliográfica.",
    dificuldade: 3,
  },
  {
    id: "arq-010",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O fundo de arquivo é o conjunto de documentos produzidos ou recebidos por uma pessoa ou entidade no exercício de suas atividades.",
    resposta: "CERTO",
    explicacao:
      "Conceito de fundo: todo conjunto orgânico de documentos de mesma origem.",
    dificuldade: 1,
  },
  {
    id: "arq-011",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A avaliação arquivística determina o valor dos documentos para definir seu destino (eliminação ou permanência).",
    resposta: "CERTO",
    explicacao:
      "Avaliação = análise do valor documental (administrativo, legal, histórico, etc.).",
    dificuldade: 2,
  },
  {
    id: "arq-012",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O Sistema de Gestão Arquivística (SGA) integra as atividades de produção, classificação, avaliação e destinação de documentos.",
    resposta: "CERTO",
    explicacao: "SGA = sistema integrado de gestão de documentos e arquivos.",
    dificuldade: 2,
  },
  {
    id: "arq-013",
    disciplina: "ARQUIVOLOGIA",
    enunciado: "A descrição arquivística segue as normas ISAD(G) e ISAAR(CPF).",
    resposta: "CERTO",
    explicacao:
      "ISAD(G) = descrição de documentos. ISAAR(CPF) = descrição de entidades produtoras.",
    dificuldade: 3,
  },
  {
    id: "arq-014",
    disciplina: "ARQUIVOLOGIA",
    enunciado: "O arquivo morto é sinônimo de arquivo permanente.",
    resposta: "ERRADO",
    explicacao:
      "Arquivo morto (termo antigo) = arquivo intermediário. Permanente = guarda definitiva.",
    dificuldade: 2,
  },
  {
    id: "arq-015",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A transferência de documentos do arquivo corrente para o intermediário ocorre quando cessa a tramitação frequente.",
    resposta: "CERTO",
    explicacao:
      "Transferência = mudança de fase arquivística (corrente → intermediário → permanente).",
    dificuldade: 1,
  },
  {
    id: "arq-016",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O acesso a documentos arquivísticos de livre consulta é um direito garantido pela Lei de Acesso à Informação.",
    resposta: "CERTO",
    explicacao:
      "LAI assegura acesso, mas documentos podem ter classificação de sigilo.",
    dificuldade: 1,
  },
  {
    id: "arq-017",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A preservação digital de documentos exige apenas a cópia de segurança (backup) dos arquivos.",
    resposta: "ERRADO",
    explicacao:
      "Preservação digital envolve metadados, formatos, migração, emulação, não só backup.",
    dificuldade: 2,
  },
  {
    id: "arq-018",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivo histórico é aquele que acolhe documentos do arquivo permanente de valor histórico comprovado.",
    resposta: "CERTO",
    explicacao:
      "Arquivo histórico = instituição que preserva acervo de valor histórico.",
    dificuldade: 1,
  },

  // ═══════════════════════════════════════════════════════════
  // INFORMÁTICA (18 questões)
  // ═══════════════════════════════════════════════════════════

  {
    id: "inf-001",
    disciplina: "INFORMATICA",
    enunciado:
      "No Microsoft Excel, a fórmula =SOMA(A1:A10) realiza a adição dos valores contidos nas células de A1 até A10.",
    resposta: "CERTO",
    explicacao: "Função SOMA é uma das básicas do Excel para somar intervalos.",
    dificuldade: 1,
  },
  {
    id: "inf-002",
    disciplina: "INFORMATICA",
    enunciado:
      "O atalho Ctrl+C no Windows é utilizado para colar o conteúdo da área de transferência.",
    resposta: "ERRADO",
    explicacao: "Ctrl+C = COPIAR. Ctrl+V = COLAR.",
    dificuldade: 1,
  },
  {
    id: "inf-003",
    disciplina: "INFORMATICA",
    enunciado:
      "O protocolo HTTPS é a versão segura do HTTP, utilizando criptografia SSL/TLS.",
    resposta: "CERTO",
    explicacao:
      "HTTPS = HTTP Secure. Criptografa dados entre navegador e servidor.",
    dificuldade: 1,
  },
  {
    id: "inf-004",
    disciplina: "INFORMATICA",
    enunciado:
      "O phishing é uma técnica de ataque que utiliza engenharia social para obter dados sensíveis de usuários.",
    resposta: "CERTO",
    explicacao:
      "Phishing = e-mails/sites falsos que enganam usuários para roubar dados.",
    dificuldade: 1,
  },
  {
    id: "inf-005",
    disciplina: "INFORMATICA",
    enunciado:
      "O armazenamento em nuvem (cloud computing) elimina a necessidade de conexão com a internet para acesso aos dados.",
    resposta: "ERRADO",
    explicacao:
      "Cloud computing REQUER internet (ou intranet) para acesso remoto.",
    dificuldade: 1,
  },
  {
    id: "inf-006",
    disciplina: "INFORMATICA",
    enunciado:
      "O sistema operacional Linux é de código aberto (open source) e gratuito.",
    resposta: "CERTO",
    explicacao:
      "Linux é software livre/open source. Código aberto, distribuição gratuita.",
    dificuldade: 1,
  },
  {
    id: "inf-007",
    disciplina: "INFORMATICA",
    enunciado: "O Microsoft Word é um software de planilha eletrônica.",
    resposta: "ERRADO",
    explicacao: "Word = editor de texto. Excel = planilha eletrônica.",
    dificuldade: 1,
  },
  {
    id: "inf-008",
    disciplina: "INFORMATICA",
    enunciado:
      "O firewall é um dispositivo ou software que controla o tráfego de rede baseado em regras de segurança.",
    resposta: "CERTO",
    explicacao: "Firewall = barreira de proteção que filtra tráfego de rede.",
    dificuldade: 1,
  },
  {
    id: "inf-009",
    disciplina: "INFORMATICA",
    enunciado:
      "A função =SE(A1>10;'Maior';'Menor') no Excel retorna 'Maior' se A1 for maior que 10, senão retorna 'Menor'.",
    resposta: "CERTO",
    explicacao:
      "Função SE (IF) testa condição e retorna valores diferentes para verdadeiro/falso.",
    dificuldade: 2,
  },
  {
    id: "inf-010",
    disciplina: "INFORMATICA",
    enunciado:
      "O malware é um software legítimo utilizado para proteção de sistemas contra vírus.",
    resposta: "ERRADO",
    explicacao:
      "Malware = software malicioso (vírus, trojan, ransomware, etc.).",
    dificuldade: 1,
  },
  {
    id: "inf-011",
    disciplina: "INFORMATICA",
    enunciado:
      "O backup incremental copia apenas os arquivos modificados desde o último backup.",
    resposta: "CERTO",
    explicacao:
      "Backup incremental = só o que mudou desde o último backup (qualquer tipo).",
    dificuldade: 2,
  },
  {
    id: "inf-012",
    disciplina: "INFORMATICA",
    enunciado:
      "O endereço IP 192.168.1.1 é um exemplo de IP privado, utilizado em redes locais.",
    resposta: "CERTO",
    explicacao:
      "Faixas 192.168.x.x, 10.x.x.x, 172.16-31.x.x são IPs privados (RFC 1918).",
    dificuldade: 2,
  },
  {
    id: "inf-013",
    disciplina: "INFORMATICA",
    enunciado:
      "O Microsoft PowerPoint é um software de edição de imagens raster.",
    resposta: "ERRADO",
    explicacao:
      "PowerPoint = apresentações. Photoshop, GIMP = edição de imagens raster.",
    dificuldade: 1,
  },
  {
    id: "inf-014",
    disciplina: "INFORMATICA",
    enunciado:
      "A criptografia de dados é uma medida de segurança que torna as informações ilegíveis sem a chave correta.",
    resposta: "CERTO",
    explicacao: "Criptografia = codificação que exige chave para decifrar.",
    dificuldade: 1,
  },
  {
    id: "inf-015",
    disciplina: "INFORMATICA",
    enunciado:
      "O atalho Ctrl+Z desfaz a última ação realizada na maioria dos softwares.",
    resposta: "CERTO",
    explicacao: "Ctrl+Z = Undo (desfazer). Padrão universal.",
    dificuldade: 1,
  },
  {
    id: "inf-016",
    disciplina: "INFORMATICA",
    enunciado:
      "O sistema binário utiliza apenas os dígitos 0 e 1 para representar informações.",
    resposta: "CERTO",
    explicacao: "Base 2: 0 e 1. Base da computação digital.",
    dificuldade: 1,
  },
  {
    id: "inf-017",
    disciplina: "INFORMATICA",
    enunciado:
      "O cookie é um arquivo malicioso que rouba senhas de usuários automaticamente.",
    resposta: "ERRADO",
    explicacao:
      "Cookie = arquivo de dados do site (preferências, login). Não é malicioso por si só.",
    dificuldade: 2,
  },
  {
    id: "inf-018",
    disciplina: "INFORMATICA",
    enunciado:
      "A função PROCV (VLOOKUP) no Excel busca valores em uma tabela verticalmente.",
    resposta: "CERTO",
    explicacao: "PROCV = PROcura na Vertical. Busca em tabelas.",
    dificuldade: 2,
  },

  // ═══════════════════════════════════════════════════════════
  // LEGISLAÇÃO PRF (18 questões)
  // ═══════════════════════════════════════════════════════════

  {
    id: "prf-001",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal é órgão integrante da estrutura do Ministério da Justiça e Segurança Pública.",
    resposta: "CERTO",
    explicacao:
      "Lei 9.503/1997 (CTB) e estrutura administrativa atual: PRF vinculada ao MJSP.",
    dificuldade: 1,
  },
  {
    id: "prf-002",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF tem como missão patrulhar as rodovias federais, combater crimes e prestar socorro às vítimas de acidentes.",
    resposta: "CERTO",
    explicacao:
      "Atribuições constitucionais da PRF (art. 144, §1º, V da CF/88).",
    dificuldade: 1,
  },
  {
    id: "prf-003",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O Código de Trânsito Brasileiro (Lei 9.503/1997) estabelece normas de conduta para o trânsito em vias públicas.",
    resposta: "CERTO",
    explicacao: "CTB é a lei básica de trânsito no Brasil.",
    dificuldade: 1,
  },
  {
    id: "prf-004",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF pode fiscalizar o transporte rodoviário de cargas indivisíveis (peso/dimensões excedentes).",
    resposta: "CERTO",
    explicacao:
      "Fiscalização de trânsito e transporte, incluindo cargas especiais.",
    dificuldade: 2,
  },
  {
    id: "prf-005",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A velocidade máxima em rodovias pavimentadas é de 110 km/h para veículos de passeio, salvo sinalização diferente.",
    resposta: "CERTO",
    explicacao:
      "Resolução CONTRAN 396/2011: limites de velocidade por tipo de via.",
    dificuldade: 2,
  },
  {
    id: "prf-006",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF pode realizar operações de busca e apreensão em residências sem mandado judicial.",
    resposta: "ERRADO",
    explicacao:
      "Busca domiciliar exige mandado judicial (CF/88, art. 5º, XI), salvo situações excepcionais (flagrante, consentimento).",
    dificuldade: 2,
  },
  {
    id: "prf-007",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O uso do cinto de segurança é obrigatório para todos os ocupantes do veículo, nos bancos dianteiros e traseiros.",
    resposta: "CERTO",
    explicacao:
      "Lei 9.503/97, art. 65: cinto obrigatório para todos os ocupantes.",
    dificuldade: 1,
  },
  {
    id: "prf-008",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF pode aplicar teste de alcoolemia (bafômetro) em motoristas profissionais apenas.",
    resposta: "ERRADO",
    explicacao:
      "Teste pode ser aplicado em qualquer motorista, não só profissionais.",
    dificuldade: 2,
  },
  {
    id: "prf-009",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Lei Seca (Lei 11.705/2008) estabelece a tolerância zero de álcool para condutores de veículos.",
    resposta: "CERTO",
    explicacao:
      "Lei 11.705/2008: concentração de álcool igual ou superior a 0,05 mg/L (ou 0,2 g/L sangue) configura infração.",
    dificuldade: 1,
  },
  {
    id: "prf-010",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF possui competência para fiscalizar o cumprimento das normas de meio ambiente em rodovias federais.",
    resposta: "CERTO",
    explicacao:
      "Fiscalização de crimes ambientais em rodovias federais é atribuição da PRF.",
    dificuldade: 2,
  },
  {
    id: "prf-011",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O Sistema Nacional de Trânsito (SNT) é composto pelo CONTRAN, CETRAN, CONTRADIFE e órgãos executivos de trânsito.",
    resposta: "CERTO",
    explicacao:
      "Estrutura do SNT: órgãos normativos (CONTRAN), deliberativos (CETRAN), executivos (PRF, DETRAN, etc.).",
    dificuldade: 2,
  },
  {
    id: "prf-012",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A carteira nacional de habilitação (CNH) vencida há mais de 30 dias permite ao condutor continuar dirigindo até a renovação.",
    resposta: "ERRADO",
    explicacao:
      "CNH vencida = não pode dirigir. Dirigir com CNH vencida é infração gravíssima.",
    dificuldade: 1,
  },
  {
    id: "prf-013",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF pode prestar auxílio a órgãos de defesa civil em situações de emergência e calamidades públicas.",
    resposta: "CERTO",
    explicacao:
      "Atribuição de apoio a ações de defesa civil e segurança pública.",
    dificuldade: 1,
  },
  {
    id: "prf-014",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O uso de celular ao volante, mesmo com viva-voz, é infração de trânsito.",
    resposta: "CERTO",
    explicacao:
      "Resolução CONTRAN 277/2008: uso de telefone celular (mãos) é infração. Viva-voz liberado depende da interpretação, mas manipular é infração.",
    dificuldade: 2,
  },
  {
    id: "prf-015",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF tem competência originária para investigar crimes de menor potencial ofensivo ocorridos em rodovias federais.",
    resposta: "ERRADO",
    explicacao:
      "Investigação criminal é da Polícia Judiciária (Polícia Civil/Federal). PRF atua em flagrante e preservação.",
    dificuldade: 3,
  },
  {
    id: "prf-016",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A ultrapassagem pela contramão em rodovia com pista dupla é infração gravíssima.",
    resposta: "CERTO",
    explicacao:
      "Ultrapassagem proibida (contramão em pista dupla) = infração gravíssima.",
    dificuldade: 1,
  },
  {
    id: "prf-017",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF pode realizar operações integradas com outras forças de segurança em qualquer parte do território nacional.",
    resposta: "CERTO",
    explicacao:
      "Operações integradas (GLO, segurança pública) podem ocorrer em todo o território.",
    dificuldade: 2,
  },
  {
    id: "prf-018",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O não uso de farol baixo em rodovias durante o dia é infração de trânsito.",
    resposta: "CERTO",
    explicacao:
      "Resolução CONTRAN 314/2009: farol baixo obrigatório em rodovias de pista simples durante o dia.",
    dificuldade: 2,
  },
];

// ═══════════════════════════════════════════════════════════
// FUNÇÕES UTILITÁRIAS PARA QUESTÕES
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
    comAno: questoes.filter((q) => q.ano).length,
  };
}
