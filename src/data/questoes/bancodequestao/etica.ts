import { Questao } from "../index";

export const questoesEtica: Questao[] = [
  // ============================================================
  // TÓPICO 1 & 2: ÉTICA, MORAL, PRINCÍPIOS E VALORES
  // ============================================================
  {
    id: "etic-001",
    disciplina: "ETICA",
    enunciado:
      "A ética e a moral, embora relacionadas, possuem distinções conceituais: a moral refere-se ao conjunto de costumes e normas de uma sociedade em determinado momento, enquanto a ética é a reflexão filosófica sobre esses comportamentos.",
    resposta: "CERTO",
    explicacao:
      "Moral = conjunto de regras e costumes (normativo). Ética = teoria/filosofia que reflete sobre a moral (reflexivo).",
    dificuldade: 1,
    tags: ["ética e moral", "conceitos fundamentais", "filosofia moral"],
    banca_referencia: "CEBRASPE",
    assunto: "Ética e Moral",
    ano: 2023,
  },
  {
    id: "etic-002",
    disciplina: "ETICA",
    enunciado:
      "Os princípios da administração pública funcionam como vetores que orientam a conduta do servidor e a validade dos atos administrativos, não sendo meramente meras recomendações de conduta.",
    resposta: "CERTO",
    explicacao:
      "Princípios (LIMPE) possuem força normativa vinculante. Sua violação gera invalidade do ato e responsabilidade do agente público.",
    dificuldade: 1,
    tags: ["princípios administrativos", "vinculação", "LIMPE"],
    banca_referencia: "FGV",
    assunto: "Ética, Princípios e Valores",
    ano: 2023,
  },
  {
    id: "etic-003",
    disciplina: "ETICA",
    enunciado:
      "O princípio da moralidade administrativa exige que o servidor não apenas cumpra a lei formalmente, mas aja com honestidade, probidade e boa-fé objetiva.",
    resposta: "CERTO",
    explicacao:
      "Moralidade administrativa = exigência de conduta ética além da estrita legalidade, vedando o desvio de finalidade e o enriquecimento ilícito.",
    dificuldade: 2,
    tags: ["moralidade administrativa", "probidade", "boa-fé"],
    banca_referencia: "FCC",
    assunto: "Ética e Princípios",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 3: ÉTICA E DEMOCRACIA / CIDADANIA
  // ============================================================
  {
    id: "etic-004",
    disciplina: "ETICA",
    enunciado:
      "A cidadania no Estado Democrático de Direito abrange não apenas direitos políticos, mas também o exercício do controle social sobre a gestão pública.",
    resposta: "CERTO",
    explicacao:
      "Cidadania ativa = participação popular, transparência e prestação de contas (accountability). Base da democracia deliberativa.",
    dificuldade: 2,
    tags: ["cidadania", "democracia", "controle social"],
    banca_referencia: "CEBRASPE",
    assunto: "Ética e Democracia",
    ano: 2024,
  },
  {
    id: "etic-005",
    disciplina: "ETICA",
    enunciado:
      "O sigilo administrativo é regra absoluta no serviço público brasileiro, podendo ser quebrado apenas por ordem judicial em casos de investigação criminal.",
    resposta: "ERRADO",
    explicacao:
      "A publicidade é regra; o sigilo é exceção. A LAI (Lei 12.527/2011) garante acesso amplo à informação, com restrições temporárias apenas para segurança nacional ou dados pessoais.",
    dificuldade: 2,
    tags: ["transparência", "sigilo", "LAI", "acesso à informação"],
    banca_referencia: "FGV",
    assunto: "Ética e Transparência",
    ano: 2023,
  },
  {
    id: "etic-006",
    disciplina: "ETICA",
    enunciado:
      "O conflito de interesses ocorre quando um agente público exerce suas atribuições de forma que seus interesses pessoais colidam com o interesse público, devendo ser afastado da situação.",
    resposta: "CERTO",
    explicacao:
      "Lei 12.813/2013: conflito de interesses é vedado. O servidor deve declarar o impedimento e abster-se de atuar para preservar a imparcialidade administrativa.",
    dificuldade: 3,
    tags: ["conflito de interesses", "Lei 12.813/2013", "imparcialidade"],
    fonte_legal: ["Lei 12.813/2013"],
    banca_referencia: "CEBRASPE",
    assunto: "Ética e Função Pública",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 5.1: DECRETO 1.171/1994 E DECRETO 6.029/2007
  // ============================================================
  {
    id: "etic-007",
    disciplina: "ETICA",
    enunciado:
      "O Código de Ética Profissional do Servidor Público Civil (Decreto 1.171/1994) possui caráter meramente exemplificativo, não ensejando sanções disciplinares em caso de violação.",
    resposta: "ERRADO",
    explicacao:
      "O Decreto 1.171/1994 é vinculante e disciplinar. Sua violação pode acarretar processo perante a Comissão de Ética e penalidades administrativas.",
    dificuldade: 1,
    tags: ["Decreto 1.171/1994", "sanções", "Código de Ética"],
    fonte_legal: ["Decreto 1.171/1994"],
    banca_referencia: "CEBRASPE",
    assunto: "Código de Ética Profissional do Servidor",
    ano: 2022,
  },
  {
    id: "etic-008",
    disciplina: "ETICA",
    enunciado:
      "As Comissões de Ética Pública (CEP) e as Comissões de Ética nos órgãos da administração federal têm competência para aplicar penalidades como demissão ou suspensão imediata.",
    resposta: "ERRADO",
    explicacao:
      "As Comissões de Ética têm função consultiva e punitiva restrita (censura ética). Sanções gravíssimas (demissão, cassação) dependem de Processo Administrativo Disciplinar (PAD) conduzido pela autoridade competente.",
    dificuldade: 2,
    tags: ["Comissão de Ética", "competência punitiva", "censura ética"],
    fonte_legal: ["Decreto 6.029/2007", "Decreto 1.171/1994"],
    banca_referencia: "FGV",
    assunto: "Sistema de Gestão da Ética",
    ano: 2023,
  },
  {
    id: "etic-009",
    disciplina: "ETICA",
    enunciado:
      "É dever do servidor público tratar cuidadosamente os usuários dos serviços, sendo vedada a distinção baseada em condições sociais, econômicas ou culturais.",
    resposta: "CERTO",
    explicacao:
      "Item X do Decreto 1.171/1994: dignidade da pessoa humana, cortesia e não discriminação são pilares do atendimento ao cidadão.",
    dificuldade: 1,
    tags: ["atendimento ao cidadão", "não discriminação", "dignidade"],
    fonte_legal: ["Decreto 1.171/1994"],
    banca_referencia: "VUNESP",
    assunto: "Código de Ética Profissional do Servidor",
    ano: 2022,
  },
  {
    id: "etic-010",
    disciplina: "ETICA",
    enunciado:
      "O Sistema de Gestão da Ética do Poder Executivo Federal visa integrar as ações de promoção da ética e de combate à corrupção, sob coordenação da Comissão de Ética Pública da Presidência.",
    resposta: "CERTO",
    explicacao:
      "Decreto 6.029/2007 instituiu o sistema para integrar ações de integridade, promovendo transparência e fomento à cultura de compliance no serviço público.",
    dificuldade: 2,
    tags: ["Decreto 6.029/2007", "gestão da ética", "CEP"],
    fonte_legal: ["Decreto 6.029/2007"],
    banca_referencia: "CEBRASPE",
    assunto: "Sistema de Gestão da Ética",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 5.2: LEI 8.112/1990 - REGIME DISCIPLINAR
  // ============================================================
  {
    id: "etic-011",
    disciplina: "ETICA",
    enunciado:
      "Constitui proibição ao servidor público revelar fato de que tenha ciência em razão do cargo e que deva permanecer em segredo.",
    resposta: "CERTO",
    explicacao:
      "Art. 116, VII, Lei 8.112/1990: dever de sigilo. Violação pode gerar responsabilidade disciplinar (advertência até demissão, conforme o caso).",
    dificuldade: 1,
    tags: ["proibições", "sigilo funcional", "Lei 8.112/1990"],
    fonte_legal: ["Art. 116, VII, Lei 8.112/1990"],
    banca_referencia: "CEBRASPE",
    assunto: "Regime Disciplinar - Deveres e Proibições",
    ano: 2024,
  },
  {
    id: "etic-012",
    disciplina: "ETICA",
    enunciado:
      "O abandono de cargo configura infração disciplinar punível com demissão, ocorrendo quando o servidor falta por mais de 60 dias consecutivos sem justificativa.",
    resposta: "ERRADO",
    explicacao:
      "Art. 138, Lei 8.112/1990: abandono de cargo caracteriza-se por 30 dias consecutivos (e não 60). Inassiduidade habitual = 60 dias interpolados.",
    dificuldade: 3,
    tags: ["abandono de cargo", "inassiduidade", "prazo", "Lei 8.112/1990"],
    fonte_legal: ["Art. 138, Lei 8.112/1990"],
    banca_referencia: "FGV",
    assunto: "Regime Disciplinar - Penalidades",
    ano: 2023,
  },
  {
    id: "etic-013",
    disciplina: "ETICA",
    enunciado:
      "É permitida a acumulação de dois cargos públicos de professor com outro técnico ou científico, desde que haja compatibilidade de horários.",
    resposta: "ERRADO",
    explicacao:
      "Art. 37, XVI, CF/88: as exceções são cumulativas isoladamente (2 de professor; 1 professor + 1 técnico/científico; ou 2 de saúde). Não se permite acumular três cargos.",
    dificuldade: 2,
    tags: ["acumulação de cargos", "exceções constitucionais"],
    fonte_legal: ["Art. 37, XVI, CF/88"],
    banca_referencia: "FCC",
    assunto: "Acumulação de Cargos",
    ano: 2022,
  },
  {
    id: "etic-014",
    disciplina: "ETICA",
    enunciado:
      "A aplicação de penalidade disciplinar depende de processo que assegure ampla defesa e contraditório, sendo nula a punição imposta sem o devido processo legal.",
    resposta: "CERTO",
    explicacao:
      "Art. 156, Lei 8.112/1990 e CF/88: Processo Administrativo Disciplinar (PAD) é condição de validade para imposição de sanções graves.",
    dificuldade: 1,
    tags: ["PAD", "contraditório", "ampla defesa", "Lei 8.112/1990"],
    fonte_legal: ["Art. 156, Lei 8.112/1990"],
    banca_referencia: "CEBRASPE",
    assunto: "Responsabilidades do Servidor",
    ano: 2024,
  },
  {
    id: "etic-015",
    disciplina: "ETICA",
    enunciado:
      "A responsabilização do servidor público é tripla (administrativa, civil e penal), sendo que a absolvição por negativa de autoria ou inexistência do fato na esfera penal vincula a administração.",
    resposta: "CERTO",
    explicacao:
      "Art. 126, Lei 8.112/1990: as esferas são independentes, mas a absolvição criminal por negar autoria ou fato vincula a instância administrativa (coisa julgada).",
    dificuldade: 3,
    tags: ["tripla responsabilidade", "absolvição criminal", "vinculação"],
    fonte_legal: ["Art. 126, Lei 8.112/1990"],
    banca_referencia: "VUNESP",
    assunto: "Responsabilidades do Servidor",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 5.3: LEI 8.429/1992 (IMPROBIDADE) - ATUALIZADA
  // ============================================================
  {
    id: "etic-016",
    disciplina: "ETICA",
    enunciado:
      "Com a Lei nº 14.230/2021, a configuração de ato de improbidade administrativa passou a exigir a comprovação de dolo específico, excluindo-se a modalidade culposa.",
    resposta: "CERTO",
    explicacao:
      "Nova redação do art. 1º, §1º, da Lei 8.429/1992: exige vontade livre e consciente de alcançar o resultado ilícito. Culpa (negligência/imprudência) não mais configura improbidade.",
    dificuldade: 3,
    tags: ["improbidade administrativa", "Lei 14.230/2021", "dolo específico"],
    fonte_legal: ["Art. 1º, §1º, Lei 8.429/1992"],
    banca_referencia: "FGV",
    assunto: "Lei de Improbidade Administrativa - Disposições Gerais",
    ano: 2024,
  },
  {
    id: "etic-017",
    disciplina: "ETICA",
    enunciado:
      "O prazo prescricional para a ação de improbidade administrativa é de 8 anos, contados da data da prática do fato ou da ocorrência do dano ao erário.",
    resposta: "CERTO",
    explicacao:
      "Art. 23 da Lei 8.429/1992 (Lei 14.230/2021): prescrição geral de 8 anos. Para atos permanentes, conta-se da data da cessação.",
    dificuldade: 3,
    tags: ["prescrição", "improbidade", "prazo", "Lei 14.230/2021"],
    fonte_legal: ["Art. 23, Lei 8.429/1992"],
    banca_referencia: "CEBRASPE",
    assunto: "Lei de Improbidade Administrativa - Prazos",
    ano: 2024,
  },
  {
    id: "etic-018",
    disciplina: "ETICA",
    enunciado:
      "São passíveis de ação de improbidade apenas os agentes públicos, não alcançando terceiros que, sem essa qualidade, induzam ou concorram para a prática do ato ou dele se beneficiem.",
    resposta: "ERRADO",
    explicacao:
      "Art. 3º da Lei 8.429/1992: equiparados a agentes públicos, os terceiros que induzam, concorram ou se beneficiem podem ser réus na ação de improbidade.",
    dificuldade: 2,
    tags: ["terceiros", "indução ou concurso", "Lei 8.429/1992"],
    fonte_legal: ["Art. 3º, Lei 8.429/1992"],
    banca_referencia: "FCC",
    assunto: "Lei de Improbidade Administrativa - Sujeitos",
    ano: 2023,
  },

  // ============================================================
  // QUESTÕES DE FIXAÇÃO E APROFUNDAMENTO
  // ============================================================
  {
    id: "etic-019",
    disciplina: "ETICA",
    enunciado:
      "O nepotismo, ainda que não tipificado expressamente como crime no Código Penal, configura violação ética e administrativa, sendo vedado pela Súmula Vinculante 13 do STF.",
    resposta: "CERTO",
    explicacao:
      "Súmula 13 STF: nepotismo é vedado em todas as esferas da administração, direta ou indireta, em qualquer dos Poderes.",
    dificuldade: 2,
    tags: ["nepotismo", "Súmula 13 STF", "vedação"],
    fonte_legal: ["Súmula Vinculante 13"],
    banca_referencia: "VUNESP",
    assunto: "Ética e Função Pública",
    ano: 2022,
  },
  {
    id: "etic-020",
    disciplina: "ETICA",
    enunciado:
      "O servidor público deve ser assíduo e pontual, sendo que a inassiduidade habitual, para fins de demissão, caracteriza-se por faltas injustificadas a 60 dias interpolados no período de 12 meses.",
    resposta: "CERTO",
    explicacao:
      "Art. 139, Lei 8.112/1990: inassiduidade habitual = 60 dias interpolados. É infração gravíssima punida com demissão.",
    dificuldade: 2,
    tags: ["inassiduidade habitual", "assiduidade", "Lei 8.112/1990"],
    fonte_legal: ["Art. 139, Lei 8.112/1990"],
    banca_referencia: "CEBRASPE",
    assunto: "Regime Disciplinar",
    ano: 2023,
  },
  {
    id: "etic-021",
    disciplina: "ETICA",
    enunciado:
      "A pena de advertência será aplicada por escrito nos casos de violação de proibição que não tipifique infração sujeita a suspensão ou demissão.",
    resposta: "CERTO",
    explicacao:
      "Art. 129, Lei 8.112/1990: advertência é a penalidade mais branda, aplicada para infrações leves ou formais.",
    dificuldade: 1,
    tags: ["penalidade", "advertência", "Lei 8.112/1990"],
    fonte_legal: ["Art. 129, Lei 8.112/1990"],
    banca_referencia: "FGV",
    assunto: "Regime Disciplinar",
    ano: 2024,
  },
  {
    id: "etic-022",
    disciplina: "ETICA",
    enunciado:
      "O enriquecimento ilícito configura ato de improbidade administrativa que atenta contra os princípios da administração pública.",
    resposta: "ERRADO",
    explicacao:
      "Enriquecimento ilícito atenta contra o patrimônio público. Atos contra princípios (art. 11) envolvem violação de honestidade, imparcialidade e legalidade sem prejuízo financeiro direto.",
    dificuldade: 3,
    tags: ["enriquecimento ilícito", "patrimônio público vs princípios"],
    fonte_legal: ["Lei 8.429/1992"],
    banca_referencia: "CEBRASPE",
    assunto: "Lei de Improbidade Administrativa",
    ano: 2023,
  },
  {
    id: "etic-023",
    disciplina: "ETICA",
    enunciado:
      "A Lei de Improbidade Administrativa prevê a indisponibilidade de bens do investigado como medida cautelar para assegurar a reparação do dano.",
    resposta: "CERTO",
    explicacao:
      "Art. 7º da Lei 8.429/1992: indisponibilidade de bens até o limite do dano estimado. É medida excepcional, mas essencial para garantir a eficácia da condenação.",
    dificuldade: 2,
    tags: ["indisponibilidade de bens", "medida cautelar"],
    fonte_legal: ["Art. 7º, Lei 8.429/1992"],
    banca_referencia: "FGV",
    assunto: "Lei de Improbidade Administrativa",
    ano: 2024,
  },
  {
    id: "etic-024",
    disciplina: "ETICA",
    enunciado:
      "A função pública não pode ser exercida para benefício pessoal ou de terceiros, sendo vedado ao servidor auferir vantagem patrimonial em razão do exercício do cargo.",
    resposta: "CERTO",
    explicacao:
      "Item XIV do Decreto 1.171/1994: função pública exercida como um serviço público, vedada a apropriação de recursos ou vantagens indevidas.",
    dificuldade: 1,
    tags: ["finalidade pública", "vantagem indevida"],
    fonte_legal: ["Decreto 1.171/1994"],
    banca_referencia: "CEBRASPE",
    assunto: "Código de Ética Profissional do Servidor",
    ano: 2022,
  },
  {
    id: "etic-025",
    disciplina: "ETICA",
    enunciado:
      "O direito de greve dos servidores públicos é exercido na forma e nos limites definidos em lei específica, sendo vedada a sua prática em atividades essenciais à segurança pública.",
    resposta: "ERRADO",
    explicacao:
      "A Lei 7.783/1989 e entendimento do STF vedam greve em serviços essenciais (segurança, saúde, etc.), mas não existe lei específica federal regulamentando a greve do servidor (LC ainda pendente). O STF tem aplicado a lei geral por analogia.",
    dificuldade: 3,
    tags: ["direito de greve", "serviços essenciais", "CF/88"],
    fonte_legal: ["Art. 37, VII, CF/88"],
    banca_referencia: "FCC",
    assunto: "Ética e Democracia",
    ano: 2024,
  },
  {
    id: "etic-026",
    disciplina: "ETICA",
    enunciado:
      "O uso de veículos ou bens públicos para fins particulares, ainda que esporádico, configura desvio de finalidade e violação ética.",
    resposta: "CERTO",
    explicacao:
      "O patrimônio público é impenhorável e inalienável, devendo ser usado estritamente para fins institucionais. Uso particular gera improbidade e sanção disciplinar.",
    dificuldade: 2,
    tags: ["uso indevido", "patrimônio público", "desvio de finalidade"],
    fonte_legal: ["Decreto 1.171/1994", "Lei 8.429/1992"],
    banca_referencia: "CEBRASPE",
    assunto: "Ética no Setor Público",
    ano: 2023,
  },
  {
    id: "etic-027",
    disciplina: "ETICA",
    enunciado:
      "A publicidade dos atos administrativos visa garantir o controle social, mas não pode sobrepor-se à proteção de dados pessoais sensíveis, conforme a LGPD.",
    resposta: "CERTO",
    explicacao:
      "Lei 14.133/2021 e LGPD (Lei 13.709/2018): transparência não significa exposição indiscriminada. Dados pessoais devem ser tratados com finalidade legítima e anonimização quando possível.",
    dificuldade: 3,
    tags: ["publicidade", "LGPD", "dados pessoais", "transparência"],
    fonte_legal: ["Lei 14.133/2021", "Lei 13.709/2018"],
    banca_referencia: "VUNESP",
    assunto: "Ética e Proteção de Dados",
    ano: 2024,
  },
  {
    id: "etic-028",
    disciplina: "ETICA",
    enunciado:
      "O servidor deve prestar esclarecimentos requisitados sobre sua gestão, desde que não caracterize denúncia caluniosa ou constrangimento.",
    resposta: "CERTO",
    explicacao:
      "Item XI do Decreto 1.171/1994: dever de prestar contas e prestar informações aos órgãos de controle e à sociedade.",
    dificuldade: 1,
    tags: ["prestação de contas", "transparência"],
    fonte_legal: ["Decreto 1.171/1994"],
    banca_referencia: "CEBRASPE",
    assunto: "Código de Ética Profissional do Servidor",
    ano: 2022,
  },
  {
    id: "etic-029",
    disciplina: "ETICA",
    enunciado:
      "A prescrição da pretensão punitiva da administração ocorre em 5 anos, contados da data em que o ato foi praticado.",
    resposta: "CERTO",
    explicacao:
      "Art. 142, Lei 8.112/1990: prescrição administrativa de 5 anos para ilícitos puníveis com demissão. Para penalidades leves, o prazo pode variar conforme entendimento do STF (Súmula 1/CGU/Presidência: 5 anos para todas).",
    dificuldade: 3,
    tags: ["prescrição administrativa", "5 anos", "Lei 8.112/1990"],
    fonte_legal: ["Art. 142, Lei 8.112/1990"],
    banca_referencia: "FGV",
    assunto: "Regime Disciplinar",
    ano: 2023,
  },
  {
    id: "etic-030",
    disciplina: "ETICA",
    enunciado:
      "É vedado ao servidor público recusar fé a documentos públicos, independentemente de sua origem.",
    resposta: "ERRADO",
    explicacao:
      "Art. 116, III, Lei 8.112/1990: é dever do servidor prestar assistência aos atendentes, o que inclui reconhecer a fé de documentos públicos, salvo dúvida justificada sobre sua autenticidade.",
    dificuldade: 2,
    tags: ["deveres", "fé pública", "Lei 8.112/1990"],
    fonte_legal: ["Art. 116, Lei 8.112/1990"],
    banca_referencia: "FCC",
    assunto: "Regime Disciplinar",
    ano: 2022,
  },
  {
    id: "etic-031",
    disciplina: "ETICA",
    enunciado:
      "O Código de Ética da PRF reforça a importância do servidor agir com decoro, dignidade e respeito aos direitos humanos, alinhando-se aos valores constitucionais.",
    resposta: "CERTO",
    explicacao:
      "Códigos de ética específicos complementam o Decreto 1.171/1994, adaptando-os à realidade e missão institucional, sem contrariar os princípios gerais.",
    dificuldade: 1,
    tags: ["decoro", "dignidade", "código de ética PRF"],
    fonte_legal: ["Código de Ética PRF"],
    banca_referencia: "CEBRASPE",
    assunto: "Ética e Função Pública",
    ano: 2024,
  },
  {
    id: "etic-032",
    disciplina: "ETICA",
    enunciado:
      "A perda de cargo em caso de condenação criminal por ato de improbidade administrativa ocorre independentemente de trânsito em julgado da sentença, caso haja decisão de segunda instância.",
    resposta: "ERRADO",
    explicacao:
      "Perda do cargo público exige decisão judicial transitada em julgado (art. 41, CF/88), não bastando condenação em segunda instância.",
    dificuldade: 3,
    tags: ["perda de cargo", "trânsito em julgado", "CF/88"],
    fonte_legal: ["Art. 41, CF/88"],
    banca_referencia: "FGV",
    assunto: "Responsabilidades do Servidor",
    ano: 2023,
  },
  {
    id: "etic-033",
    disciplina: "ETICA",
    enunciado:
      "O princípio da eficiência exige do servidor não apenas o cumprimento formal da lei, mas a busca constante pela otimização dos resultados e pela qualidade do serviço prestado.",
    resposta: "CERTO",
    explicacao:
      "Eficiência = produtividade + qualidade. O servidor deve evitar desperdícios e burocratização excessiva, priorizando o interesse público e a satisfação do cidadão.",
    dificuldade: 1,
    tags: ["eficiência", "qualidade", "otimização"],
    fonte_legal: ["Art. 37, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Princípios da Administração",
    ano: 2024,
  },
];

export const totalQuestoesEtica = questoesEtica.length;
