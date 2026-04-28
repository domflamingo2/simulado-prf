import { Questao } from "../index";

export const questoesDireitoAdministrativo: Questao[] = [
  // ============================================================
  // TÓPICO 1: ATO ADMINISTRATIVO
  // ============================================================
  {
    id: "diradm-001",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "Os requisitos do ato administrativo são competência, finalidade, forma, motivo e objeto, sendo a falta de qualquer deles capaz de gerar nulidade.",
    resposta: "CERTO",
    explicacao:
      "São os 5 elementos essenciais (COMP-FIN-FOR-MOT-OBJ). A ausência ou vício em qualquer requisito torna o ato nulo, sujeito à anulação.",
    dificuldade: 1,
    tags: ["ato administrativo", "requisitos", "nulidade"],
    fonte_legal: ["Doutrina clássica (Meirelles, Carvalho Filho)"],
    banca_referencia: "CEBRASPE",
    assunto: "Ato Administrativo - Requisitos",
    ano: 2023,
  },
  {
    id: "diradm-002",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A autoexecutoriedade é atributo que permite à Administração executar seus atos sem necessidade de autorização judicial prévia, nos casos previstos em lei.",
    resposta: "CERTO",
    explicacao:
      "Autoexecutoriedade: execução direta de atos administrativos (ex: apreensão de mercadorias, interdição de estabelecimento) sem intervenção do Judiciário.",
    dificuldade: 2,
    tags: ["ato administrativo", "atributos", "autoexecutoriedade"],
    banca_referencia: "FGV",
    assunto: "Ato Administrativo - Atributos",
    ano: 2024,
  },
  {
    id: "diradm-003",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A anulação do ato administrativo produz efeitos retroativos (ex tunc), enquanto a revogação opera efeitos prospectivos (ex nunc).",
    resposta: "CERTO",
    explicacao:
      "Anulação = ilegalidade (retroage para desfazer). Revogação = conveniência/oportunidade (não retroage, respeita atos consumados e direitos adquiridos).",
    dificuldade: 2,
    tags: ["invalidação", "anulação", "revogação", "efeitos"],
    fonte_legal: ["Súmula 473 STF", "Lei 9.784/1999"],
    banca_referencia: "FCC",
    assunto: "Ato Administrativo - Invalidação",
    ano: 2023,
  },
  {
    id: "diradm-004",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O prazo decadencial para a Administração anular atos administrativos que gerem efeitos favoráveis aos destinatários é de 5 anos, salvo comprovada má-fé.",
    resposta: "CERTO",
    explicacao:
      "Art. 54 da Lei nº 9.784/1999: decadência de 5 anos para atos favoráveis. Se houver má-fé do beneficiário, a Administração pode anular a qualquer tempo.",
    dificuldade: 3,
    tags: ["prescrição", "decadência", "lei 9.784/1999", "ato favorável"],
    fonte_legal: ["Art. 54, Lei 9.784/1999"],
    banca_referencia: "FGV",
    assunto: "Ato Administrativo - Prescrição/Decadência",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 2: CONTROLE DA ADMINISTRAÇÃO PÚBLICA
  // ============================================================
  {
    id: "diradm-005",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O controle judicial da administração pública limita-se à análise da legalidade, sendo vedado ao Judiciário adentrar o mérito administrativo.",
    resposta: "CERTO",
    explicacao:
      "Separação de poderes: Judiciário controla conformidade com a lei, mas não substitui a discricionariedade (mérito) do administrador.",
    dificuldade: 1,
    tags: ["controle judicial", "mérito administrativo", "legalidade"],
    banca_referencia: "CEBRASPE",
    assunto: "Controle da Administração Pública",
    ano: 2023,
  },
  {
    id: "diradm-006",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O Congresso Nacional pode sustar atos normativos do Poder Executivo que exorbitem do poder regulamentar, mediante decreto legislativo.",
    resposta: "CERTO",
    explicacao:
      "Art. 49, V, da CF/88: controle legislativo externo sobre atos normativos do Executivo que ultrapassem os limites da lei.",
    dificuldade: 2,
    tags: ["controle legislativo", "decreto legislativo", "CF/88"],
    fonte_legal: ["Art. 49, V, CF/88"],
    banca_referencia: "FCC",
    assunto: "Controle Legislativo",
    ano: 2023,
  },
  {
    id: "diradm-007",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O controle finalístico ou tutela administrativa é exercido pela Administração Direta sobre as entidades da Administração Indireta.",
    resposta: "CERTO",
    explicacao:
      "Controle finalístico (tutela): vínculo de supervisão ministerial para verificar legalidade e alinhamento à política pública, sem hierarquia.",
    dificuldade: 2,
    tags: ["controle administrativo", "tutela", "administração indireta"],
    banca_referencia: "VUNESP",
    assunto: "Controle Administrativo",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 3: AGENTES ADMINISTRATIVOS E PROCESSO ADMINISTRATIVO
  // ============================================================
  {
    id: "diradm-008",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "Na Lei nº 8.112/1990, a posse é o vínculo entre o servidor e o cargo, enquanto o exercício é o desempenho efetivo das atribuições.",
    resposta: "CERTO",
    explicacao:
      "Posse: ato de investidura (15 dias para nomeação). Exercício: início das atividades (30 dias após a posse).",
    dificuldade: 1,
    tags: ["posse", "exercício", "lei 8.112/1990"],
    fonte_legal: ["Arts. 13 e 15, Lei 8.112/1990"],
    banca_referencia: "CEBRASPE",
    assunto: "Agentes Administrativos",
    ano: 2023,
  },
  {
    id: "diradm-009",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O processo administrativo federal deve ser iniciado de ofício ou a requerimento do interessado, observados os princípios da legalidade e do contraditório.",
    resposta: "CERTO",
    explicacao:
      "Art. 2º da Lei 9.784/1999: instauração por iniciativa da Administração ou pedido do particular, com garantia ampla de defesa e motivação.",
    dificuldade: 1,
    tags: ["processo administrativo", "instauração", "lei 9.784/1999"],
    fonte_legal: ["Art. 2º, Lei 9.784/1999"],
    banca_referencia: "FGV",
    assunto: "Processo Administrativo - Conceito e Princípios",
    ano: 2024,
  },
  {
    id: "diradm-010",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "As fases do processo administrativo incluem instauração, instrução, decisão e recursos, sendo vedada a produção de provas de ofício pela Administração.",
    resposta: "ERRADO",
    explicacao:
      "A Administração pode determinar diligências e produzir provas de ofício para melhor esclarecer os fatos (princípio da verdade material).",
    dificuldade: 2,
    tags: ["fases do processo", "instrução", "verdade material"],
    banca_referencia: "FCC",
    assunto: "Processo Administrativo - Fases",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 4: PODERES DA ADMINISTRAÇÃO
  // ============================================================
  {
    id: "diradm-011",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O poder disciplinar permite à Administração apurar infrações e aplicar penalidades aos servidores públicos e a particulares que mantenham vínculo jurídico com ela.",
    resposta: "CERTO",
    explicacao:
      "Poder disciplinar é interno (servidores) e externo (particulares com vínculo específico, ex: concessionários, permissionários).",
    dificuldade: 2,
    tags: ["poder disciplinar", "poderes administrativos", "sanção"],
    banca_referencia: "CEBRASPE",
    assunto: "Poderes da Administração",
    ano: 2023,
  },
  {
    id: "diradm-012",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O poder regulamentar permite ao Chefe do Executivo editar decretos para explicar a lei e fiel execução, vedada a inovação na ordem jurídica.",
    resposta: "CERTO",
    explicacao:
      "Art. 84, IV, CF/88: decretos regulamentares não podem criar direitos ou obrigações não previstos na lei.",
    dificuldade: 1,
    tags: ["poder regulamentar", "decreto", "CF/88"],
    fonte_legal: ["Art. 84, IV, CF/88"],
    banca_referencia: "FGV",
    assunto: "Poderes da Administração",
    ano: 2024,
  },
  {
    id: "diradm-013",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O poder hierárquico confere à Administração a faculdade de aplicar penalidades funcionais por descumprimento de deveres internos.",
    resposta: "ERRADO",
    explicacao:
      "Aplicação de sanções é atributo do poder disciplinar. O poder hierárquico organiza e coordena a estrutura administrativa.",
    dificuldade: 2,
    tags: ["poder hierárquico vs disciplinar", "confusão conceitual"],
    banca_referencia: "VUNESP",
    assunto: "Poderes da Administração",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 5: PRINCÍPIOS, RESPONSABILIDADE E IMPROBIDADE
  // ============================================================
  {
    id: "diradm-014",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O princípio da legalidade na administração pública significa que o administrador só pode agir conforme a lei autoriza ou determina.",
    resposta: "CERTO",
    explicacao:
      "Diferente do particular (que pode tudo que a lei não proíbe), o administrador está estritamente vinculado à lei (reserva legal).",
    dificuldade: 1,
    tags: ["princípio da legalidade", "administração pública"],
    banca_referencia: "CEBRASPE",
    assunto: "Princípios da Administração",
    ano: 2023,
  },
  {
    id: "diradm-015",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A responsabilidade civil do Estado é objetiva, fundamentada na teoria do risco administrativo, exigindo apenas ação/omissão estatal, dano e nexo causal.",
    resposta: "CERTO",
    explicacao:
      "Art. 37, §6º, CF/88: independe de dolo ou culpa. Exceções: culpa exclusiva da vítima ou caso fortuito/força maior.",
    dificuldade: 2,
    tags: ["responsabilidade objetiva", "risco administrativo", "CF/88"],
    fonte_legal: ["Art. 37, §6º, CF/88"],
    banca_referencia: "FCC",
    assunto: "Responsabilidade Civil do Estado",
    ano: 2024,
  },
  {
    id: "diradm-016",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "Após a Lei nº 14.230/2021, a configuração de ato de improbidade administrativa exige a comprovação de dolo específico do agente.",
    resposta: "CERTO",
    explicacao:
      "Nova LIA: elimina a modalidade culposa. Exige intenção livre e consciente de alcançar o resultado ilícito (art. 1º, §1º).",
    dificuldade: 3,
    tags: ["improbidade administrativa", "lei 14.230/2021", "dolo específico"],
    fonte_legal: ["Art. 1º, §1º, Lei 8.429/1992 (alterada pela 14.230/21)"],
    banca_referencia: "FGV",
    assunto: "Improbidade Administrativa",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 6: SERVIÇOS PÚBLICOS
  // ============================================================
  {
    id: "diradm-017",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "Os serviços públicos de natureza uti universi são prestados de forma geral e indivisível, custeados por impostos, como segurança e iluminação pública.",
    resposta: "CERTO",
    explicacao:
      "Uti universi: benefício difuso à coletividade. Uti singuli: benefício individual e mensurável (ex: água, energia), custeados por taxas/tarifas.",
    dificuldade: 2,
    tags: ["serviços públicos", "uti universi", "uti singuli"],
    banca_referencia: "FCC",
    assunto: "Serviços Públicos - Classificação",
    ano: 2023,
  },
  {
    id: "diradm-018",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A autorização de serviço público é ato precário, discricionário e unilateral, podendo ser revogada a qualquer momento pela Administração.",
    resposta: "CERTO",
    explicacao:
      "Diferente da concessão/permissão (contrato), a autorização é ato administrativo unilateral, sem indenização em caso de revogação.",
    dificuldade: 3,
    tags: ["autorização", "concessão", "permissão", "precariedade"],
    banca_referencia: "FGV",
    assunto: "Serviços Públicos - Formas de Prestação",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 7: ADMINISTRAÇÃO DIRETA E INDIRETA
  // ============================================================
  {
    id: "diradm-019",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A desconcentração administrativa consiste na criação de novas pessoas jurídicas, enquanto a descentralização distribui competências internamente no mesmo ente.",
    resposta: "ERRADO",
    explicacao:
      "Está invertido. Desconcentração = distribuição interna (órgãos). Descentralização = transferência para outra pessoa jurídica (entidades).",
    dificuldade: 1,
    tags: ["desconcentração vs descentralização", "organização administrativa"],
    banca_referencia: "CEBRASPE",
    assunto: "Administração Direta e Indireta",
    ano: 2022,
  },
  {
    id: "diradm-020",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "As fundações públicas podem ser de direito público ou privado, sendo criadas por lei específica e destinadas a fins de interesse coletivo.",
    resposta: "CERTO",
    explicacao:
      "CF/88, art. 37, XIX: fundações públicas integram a administração indireta. Podem ter regime jurídico conforme sua natureza (Lei 13.301/2016).",
    dificuldade: 2,
    tags: ["fundações públicas", "administração indireta", "CF/88"],
    fonte_legal: ["Art. 37, XIX, CF/88"],
    banca_referencia: "VUNESP",
    assunto: "Administração Indireta",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 8: LEI Nº 8.112/1990
  // ============================================================
  {
    id: "diradm-021",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O servidor federal adquirirá estabilidade após 3 anos de efetivo exercício, mediante avaliação especial de desempenho por comissão instituída para essa finalidade.",
    resposta: "CERTO",
    explicacao:
      "Art. 41 da CF/88 e Lei 8.112/1990: estágio probatório de 36 meses com avaliação de aptidão e capacidade.",
    dificuldade: 1,
    tags: ["estabilidade", "estágio probatório", "lei 8.112/1990"],
    fonte_legal: ["Art. 41, CF/88", "Art. 20, Lei 8.112/1990"],
    banca_referencia: "CEBRASPE",
    assunto: "Lei 8.112/1990 - Estabilidade",
    ano: 2024,
  },
  {
    id: "diradm-022",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A pena de demissão é aplicada nos casos de abandono de cargo, acumulação ilícita de cargos e improbidade administrativa.",
    resposta: "CERTO",
    explicacao:
      "Art. 132 da Lei 8.112/1990: rol taxativo de infrações graves que ensejam demissão, incluindo improbidade e acumulação ilícita.",
    dificuldade: 2,
    tags: ["penalidades", "demissão", "lei 8.112/1990"],
    fonte_legal: ["Art. 132, Lei 8.112/1990"],
    banca_referencia: "FGV",
    assunto: "Lei 8.112/1990 - Penalidades",
    ano: 2023,
  },
  {
    id: "diradm-023",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A licença para capacitação é direito do servidor a cada 5 anos de exercício, por até 3 meses, sem prejuízo da remuneração.",
    resposta: "CERTO",
    explicacao:
      "Art. 87-A da Lei 8.112/1990: licença-prêmio convertida em licença-capacitação. Período aquisitivo quinquenal.",
    dificuldade: 3,
    tags: ["licenças", "capacitação", "lei 8.112/1990"],
    fonte_legal: ["Art. 87-A, Lei 8.112/1990"],
    banca_referencia: "FCC",
    assunto: "Lei 8.112/1990 - Licenças",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 9: LEI Nº 8.666/1993 (ARTS. 1-6, 20-26, 54-80)
  // ============================================================
  {
    id: "diradm-024",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "Segundo a Lei 8.666/1993, a licitação tem por objetivo assegurar igualdade de condições, selecionar a proposta mais vantajosa e promover o desenvolvimento nacional sustentável.",
    resposta: "CERTO",
    explicacao:
      "Arts. 1º a 3º da Lei 8.666/1993: finalidades clássicas do processo licitatório, alinhadas aos princípios constitucionais.",
    dificuldade: 1,
    tags: ["licitação", "objetivos", "lei 8.666/1993"],
    fonte_legal: ["Arts. 1º a 3º, Lei 8.666/1993"],
    banca_referencia: "CEBRASPE",
    assunto: "Lei 8.666/1993 - Princípios e Objetivos",
    ano: 2022,
  },
  {
    id: "diradm-025",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A inexigibilidade de licitação ocorre quando há inviabilidade de competição, como na contratação de artista consagrado pela crítica ou de serviço técnico especializado de natureza singular.",
    resposta: "CERTO",
    explicacao:
      "Art. 25 da Lei 8.666/1993: hipóteses de inexigibilidade (notória especialização, fornecedor exclusivo, serviço singular).",
    dificuldade: 2,
    tags: ["inexigibilidade", "notória especialização", "lei 8.666/1993"],
    fonte_legal: ["Art. 25, Lei 8.666/1993"],
    banca_referencia: "FGV",
    assunto: "Lei 8.666/1993 - Inexigibilidade",
    ano: 2023,
  },
  {
    id: "diradm-026",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "Os contratos administrativos podem ser alterados unilateralmente pela Administração, respeitado o equilíbrio econômico-financeiro e o limite de 25% do valor inicial.",
    resposta: "CERTO",
    explicacao:
      "Art. 65 da Lei 8.666/1993: cláusula exorbitante permite acréscimos ou supressões até 25% (50% para reformas/edifícios).",
    dificuldade: 3,
    tags: [
      "contrato administrativo",
      "alteração unilateral",
      "cláusulas exorbitantes",
    ],
    fonte_legal: ["Art. 65, Lei 8.666/1993"],
    banca_referencia: "FCC",
    assunto: "Lei 8.666/1993 - Contratos",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 10: LEI Nº 9.784/1999
  // ============================================================
  {
    id: "diradm-027",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "Os atos do processo administrativo devem ser motivados, com indicação dos fatos e fundamentos jurídicos, sendo nulos quando ausente a motivação nos casos obrigatórios.",
    resposta: "CERTO",
    explicacao:
      "Art. 50 da Lei 9.784/1999: motivação é requisito de validade, exceto em despachos de mero expediente ou atos de conteúdo vinculatório.",
    dificuldade: 1,
    tags: ["motivação", "nulidade", "lei 9.784/1999"],
    fonte_legal: ["Art. 50, Lei 9.784/1999"],
    banca_referencia: "CEBRASPE",
    assunto: "Lei 9.784/1999 - Motivação",
    ano: 2023,
  },
  {
    id: "diradm-028",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "O recurso administrativo contra decisão de processo federal tem efeito suspensivo, salvo disposição legal em contrário.",
    resposta: "ERRADO",
    explicacao:
      "Art. 63, §1º da Lei 9.784/1999: o recurso administrativo tem efeito devolutivo, sendo o efeito suspensivo a exceção, dependente de decisão fundamentada.",
    dificuldade: 3,
    tags: ["recurso administrativo", "efeito suspensivo", "lei 9.784/1999"],
    fonte_legal: ["Art. 63, §1º, Lei 9.784/1999"],
    banca_referencia: "VUNESP",
    assunto: "Lei 9.784/1999 - Recursos",
    ano: 2024,
  },
  {
    id: "diradm-029",
    disciplina: "DIREITO_ADMINISTRATIVO",
    enunciado:
      "A Lei 9.784/1999 aplica-se subsidiariamente aos processos administrativos específicos da administração pública estadual e municipal, na falta de legislação própria.",
    resposta: "CERTO",
    explicacao:
      "Art. 1º, parágrafo único, da Lei 9.784/1999: aplicação supletiva aos demais entes federativos que não possuam legislação processual própria.",
    dificuldade: 2,
    tags: ["âmbito de aplicação", "lei 9.784/1999", "entidades federativas"],
    fonte_legal: ["Art. 1º, parágrafo único, Lei 9.784/1999"],
    banca_referencia: "FGV",
    assunto: "Lei 9.784/1999 - Disposições Gerais",
    ano: 2023,
  },
];

export const totalQuestoesDireitoAdministrativo =
  questoesDireitoAdministrativo.length;
