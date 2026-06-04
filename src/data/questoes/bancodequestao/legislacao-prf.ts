import { Questao } from "../index";

export const questoesLegislacaoPRF: Questao[] = [
  // ============================================================
  // TÓPICO 1: ART. 144 DA CONSTITUIÇÃO FEDERAL - PERFIL CONSTITUCIONAL
  // ============================================================
  {
    id: "prf-001",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal, órgão permanente, organizado e mantido pela União e estruturado em carreira, destina-se, na forma da lei, ao patrulhamento ostensivo das rodovias federais.",
    resposta: "CERTO",
    explicacao:
      "Art. 144, § 1º, V, CF/88: redação constitucional exata. A PRF é órgão da União, estruturado em carreira, com competência constitucional para patrulhar rodovias federais.",
    dificuldade: 1,
    tags: [
      "art. 144 CF",
      "PRF",
      "patrulhamento ostensivo",
      "rodovias federais",
    ],
    fonte_legal: ["Art. 144, § 1º, V, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Art. 144 da Constituição Federal",
    ano: 2024,
  },
  {
    id: "prf-002",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal integra o rol dos órgãos de segurança pública previstos no caput do art. 144 da Constituição Federal, ao lado da Polícia Federal, Polícias Civis, Polícias Militares e Corpos de Bombeiros Militares.",
    resposta: "CERTO",
    explicacao:
      "Art. 144, caput, CF/88: rol taxativo de órgãos de segurança pública. A PRF está expressamente incluída no § 1º, V, integrando o sistema constitucional de segurança.",
    dificuldade: 1,
    tags: [
      "segurança pública",
      "art. 144 caput",
      "rol taxativo",
      "órgãos de segurança",
    ],
    fonte_legal: ["Art. 144, caput e § 1º, V, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Art. 144 da Constituição Federal",
    ano: 2023,
  },
  {
    id: "prf-003",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A competência da Polícia Rodoviária Federal restringe-se exclusivamente ao patrulhamento de trânsito, não incluindo atividades de polícia judiciária ou investigação criminal.",
    resposta: "ERRADO",
    explicacao:
      "Art. 144, § 1º, V, CF/88: 'na forma da lei' remete à legislação infraconstitucional que atribui à PRF também funções de polícia judiciária em crimes ocorridos em rodovias federais (ex: tráfico, descaminho).",
    dificuldade: 2,
    tags: [
      "competência PRF",
      "polícia judiciária",
      "investigação criminal",
      "na forma da lei",
    ],
    fonte_legal: ["Art. 144, § 1º, V, CF/88"],
    banca_referencia: "FGV",
    assunto: "Art. 144 da Constituição Federal",
    ano: 2024,
  },
  {
    id: "prf-004",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "As rodovias federais, objeto de atuação da PRF, são aquelas construídas ou exploradas pela União, incluindo as que ligam um Estado a outro, ao Distrito Federal ou a países estrangeiros.",
    resposta: "CERTO",
    explicacao:
      "Conceito de rodovia federal: competência da União para explorar (art. 21, XII, 'd', CF/88). Inclui rodovias interestaduais, internacionais e que liguem a territórios ou ao DF.",
    dificuldade: 2,
    tags: ["rodovias federais", "competência da União", "art. 21 CF"],
    fonte_legal: ["Art. 21, XII, 'd', CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Art. 144 da Constituição Federal",
    ano: 2023,
  },
  {
    id: "prf-005",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal está subordinada hierarquicamente ao Comando do Exército Brasileiro, por tratar-se de força de segurança com natureza militar.",
    resposta: "ERRADO",
    explicacao:
      "PRF é órgão civil, vinculado ao Ministério da Justiça e Segurança Pública (MJSP). Não possui natureza militar. Polícias Militares e Bombeiros são forças auxiliares do Exército (art. 144, § 6º).",
    dificuldade: 1,
    tags: ["vínculo institucional", "MJSP", "natureza civil", "não militar"],
    fonte_legal: ["Art. 144, § 1º, V e § 6º, CF/88"],
    banca_referencia: "VUNESP",
    assunto: "Art. 144 da Constituição Federal",
    ano: 2022,
  },
  {
    id: "prf-006",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A atuação da PRF em operações de Garantia da Lei e da Ordem (GLO) depende de requisição do Presidente da República, nos termos do art. 142, § 3º, da Constituição Federal.",
    resposta: "CERTO",
    explicacao:
      "GLO: emprego das Forças Armadas e, por extensão, forças de segurança em situações excepcionais. A PRF pode ser empregada em GLO mediante requisição presidencial e observância da Lei Complementar 97/1999.",
    dificuldade: 3,
    tags: [
      "GLO",
      "art. 142 CF",
      "emprego de forças de segurança",
      "LC 97/1999",
    ],
    fonte_legal: ["Art. 142, § 3º, CF/88", "LC 97/1999"],
    banca_referencia: "FCC",
    assunto: "Art. 144 da Constituição Federal",
    ano: 2024,
  },
  {
    id: "prf-007",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O princípio da cooperação entre os órgãos de segurança pública, previsto no art. 144, § 10, da CF/88, autoriza a PRF a atuar em vias estaduais ou municipais quando houver convênio ou requisição formal.",
    resposta: "CERTO",
    explicacao:
      "Art. 144, § 10, CF/88 (EC 115/2022): segurança pública é dever do Estado e direito de todos, exercida para preservação da ordem pública. A cooperação entre órgãos é constitucionalmente prevista.",
    dificuldade: 2,
    tags: [
      "cooperação entre órgãos",
      "art. 144 § 10",
      "EC 115/2022",
      "atuação integrada",
    ],
    fonte_legal: ["Art. 144, § 10, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Art. 144 da Constituição Federal",
    ano: 2024,
  },
  {
    id: "prf-008",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Polícia Rodoviária Federal possui competência para investigar crimes contra a ordem tributária praticados em rodovias federais, em concorrência com a Polícia Federal.",
    resposta: "CERTO",
    explicacao:
      "Crimes contra a ordem tributária e financeira são de competência da União. A PRF atua em flagrante e investigação preliminar em rodovias federais; a PF tem competência para investigação aprofundada. Há cooperação institucional.",
    dificuldade: 3,
    tags: [
      "competência investigatória",
      "crimes tributários",
      "cooperação PRF-PF",
    ],
    fonte_legal: ["Art. 144, § 1º, IV e V, CF/88"],
    banca_referencia: "FGV",
    assunto: "Art. 144 da Constituição Federal",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 2: ART. 20 DA LEI Nº 9.503/1997 (CTB) - COMPETÊNCIAS DA PRF
  // ============================================================
  {
    id: "prf-009",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "Conforme o art. 20 do CTB, compete à Polícia Rodoviária Federal, no âmbito das rodovias e estradas federais, fiscalizar, autuar, aplicar penalidades e arrecadar multas por infrações de trânsito.",
    resposta: "CERTO",
    explicacao:
      "Art. 20, I, Lei 9.503/1997: competência expressa para fiscalização, autuação, aplicação de penalidades e arrecadação de multas em rodovias federais.",
    dificuldade: 1,
    tags: [
      "art. 20 CTB",
      "fiscalização",
      "autuação",
      "multas",
      "competência PRF",
    ],
    fonte_legal: ["Art. 20, I, Lei 9.503/1997"],
    banca_referencia: "CEBRASPE",
    assunto: "Art. 20 da Lei 9.503/1997",
    ano: 2024,
  },
  {
    id: "prf-010",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF pode realizar operações de fiscalização de trânsito em conjunto com órgãos estaduais e municipais, desde que respeitada a circunscrição de cada ente sobre suas vias.",
    resposta: "CERTO",
    explicacao:
      "Art. 20, § 1º, CTB: operações integradas são permitidas. A PRF atua em rodovias federais; DETRAN/órgãos municipais atuam em suas respectivas circunscrições, com cooperação mútua.",
    dificuldade: 2,
    tags: [
      "operações integradas",
      "circunscrição",
      "cooperação institucional",
      "art. 20 § 1º CTB",
    ],
    fonte_legal: ["Art. 20, § 1º, Lei 9.503/1997"],
    banca_referencia: "FGV",
    assunto: "Art. 20 da Lei 9.503/1997",
    ano: 2023,
  },
  {
    id: "prf-011",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "Compete à PRF, nos termos do art. 20 do CTB, realizar o cadastramento de acidentes de trânsito ocorridos em rodovias federais e fornecer estatísticas para o Sistema Nacional de Trânsito.",
    resposta: "CERTO",
    explicacao:
      "Art. 20, III, CTB: PRF deve registrar acidentes e fornecer dados estatísticos ao SNT, contribuindo para políticas públicas de segurança viária.",
    dificuldade: 1,
    tags: ["acidentes de trânsito", "estatísticas", "SNT", "art. 20 III CTB"],
    fonte_legal: ["Art. 20, III, Lei 9.503/1997"],
    banca_referencia: "CEBRASPE",
    assunto: "Art. 20 da Lei 9.503/1997",
    ano: 2022,
  },
  {
    id: "prf-012",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF não possui competência para fiscalizar o transporte escolar em rodovias federais, sendo essa atribuição exclusiva dos órgãos estaduais de trânsito.",
    resposta: "ERRADO",
    explicacao:
      "Art. 20, II, CTB: compete à PRF cumprir e fazer cumprir a legislação de trânsito, o que inclui fiscalização de transporte escolar (art. 136, CTB) em rodovias federais.",
    dificuldade: 2,
    tags: [
      "transporte escolar",
      "fiscalização",
      "art. 20 II CTB",
      "competência PRF",
    ],
    fonte_legal: ["Art. 20, II e Art. 136, Lei 9.503/1997"],
    banca_referencia: "VUNESP",
    assunto: "Art. 20 da Lei 9.503/1997",
    ano: 2023,
  },
  {
    id: "prf-013",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A aplicação de penalidades de suspensão ou cassação da CNH por infrações cometidas em rodovias federais é de competência exclusiva do DETRAN do estado onde ocorreu a infração.",
    resposta: "ERRADO",
    explicacao:
      "Art. 20, IV, CTB: a PRF aplica penalidades de suspensão do direito de dirigir e cassação da CNH por infrações cometidas em sua circunscrição, comunicando ao órgão de trânsito do registro do condutor.",
    dificuldade: 3,
    tags: ["suspensão da CNH", "cassação", "competência PRF", "art. 20 IV CTB"],
    fonte_legal: ["Art. 20, IV, Lei 9.503/1997"],
    banca_referencia: "FCC",
    assunto: "Art. 20 da Lei 9.503/1997",
    ano: 2024,
  },
  {
    id: "prf-014",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF deve promover e participar de projetos e programas de educação e segurança de trânsito, em conformidade com as diretrizes do CONTRAN.",
    resposta: "CERTO",
    explicacao:
      "Art. 20, V, CTB: atribuição educativa da PRF, alinhada às políticas nacionais de trânsito estabelecidas pelo CONTRAN (art. 19, CTB).",
    dificuldade: 1,
    tags: [
      "educação para o trânsito",
      "CONTRAN",
      "políticas públicas",
      "art. 20 V CTB",
    ],
    fonte_legal: ["Art. 20, V, Lei 9.503/1997"],
    banca_referencia: "CEBRASPE",
    assunto: "Art. 20 da Lei 9.503/1997",
    ano: 2023,
  },
  {
    id: "prf-015",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF pode delegar a órgãos municipais a competência para aplicar multas por infrações de trânsito em rodovias federais, desde que haja convênio formal.",
    resposta: "ERRADO",
    explicacao:
      "Competência da PRF é indelegável em rodovias federais. Convênios podem prever cooperação operacional, mas a aplicação de penalidades em rodovias federais permanece com a PRF (art. 24, CTB).",
    dificuldade: 3,
    tags: [
      "delegação de competência",
      "convênios",
      "art. 24 CTB",
      "indisponibilidade",
    ],
    fonte_legal: ["Art. 20 e 24, Lei 9.503/1997"],
    banca_referencia: "FGV",
    assunto: "Art. 20 da Lei 9.503/1997",
    ano: 2024,
  },
  {
    id: "prf-016",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A fiscalização do transporte de produtos perigosos em rodovias federais é atribuição concorrente da PRF e da ANTT, cabendo à PRF a abordagem e à ANTT a aplicação de sanções administrativas específicas.",
    resposta: "CERTO",
    explicacao:
      "PRF fiscaliza condições de segurança do transporte (CTB); ANTT regula aspectos econômicos e técnicos do transporte de cargas. Atuação complementar, com comunicação entre órgãos.",
    dificuldade: 2,
    tags: [
      "produtos perigosos",
      "ANTT",
      "fiscalização integrada",
      "transporte de cargas",
    ],
    fonte_legal: ["Lei 9.503/1997", "Lei 10.233/2001"],
    banca_referencia: "CEBRASPE",
    assunto: "Art. 20 da Lei 9.503/1997",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 3: DECRETO Nº 1.655/1995 - REGULAMENTO DA PRF
  // ============================================================
  {
    id: "prf-017",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O Decreto nº 1.655/1995 aprova o Regulamento da Polícia Rodoviária Federal, estabelecendo normas de organização, competência e funcionamento da instituição.",
    resposta: "CERTO",
    explicacao:
      "Decreto 1.655/1995: regulamenta a estrutura e funcionamento da PRF, complementando a legislação constitucional e infraconstitucional.",
    dificuldade: 1,
    tags: [
      "Decreto 1.655/1995",
      "regulamento PRF",
      "organização institucional",
    ],
    fonte_legal: ["Decreto 1.655/1995"],
    banca_referencia: "CEBRASPE",
    assunto: "Decreto nº 1.655/1995",
    ano: 2022,
  },
  {
    id: "prf-018",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "Conforme o Decreto 1.655/1995, a PRF é organizada em Superintendências Regionais, que coordenam as atividades operacionais e administrativas em suas respectivas áreas de atuação.",
    resposta: "CERTO",
    explicacao:
      "Estrutura descentralizada: Superintendências Regionais (SRs) distribuídas estrategicamente pelo território nacional, subordinadas à Direção-Geral da PRF.",
    dificuldade: 2,
    tags: [
      "Superintendências Regionais",
      "estrutura organizacional",
      "descentralização",
    ],
    fonte_legal: ["Decreto 1.655/1995"],
    banca_referencia: "FGV",
    assunto: "Decreto nº 1.655/1995",
    ano: 2023,
  },
  {
    id: "prf-019",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O Regulamento da PRF (Decreto 1.655/1995) estabelece que os servidores da carreira de Policial Rodoviário Federal devem portar arma de fogo em serviço, sendo vedado o porte fora de serviço sem autorização expressa.",
    resposta: "CERTO",
    explicacao:
      "Porte funcional de arma é atributo da função policial. Fora de serviço, o porte depende de autorização específica, conforme legislação de armas (Estatuto do Desarmamento).",
    dificuldade: 2,
    tags: ["porte de arma", "serviço policial", "Estatuto do Desarmamento"],
    fonte_legal: ["Decreto 1.655/1995", "Lei 10.826/2003"],
    banca_referencia: "CEBRASPE",
    assunto: "Decreto nº 1.655/1995",
    ano: 2024,
  },
  {
    id: "prf-020",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A hierarquia e a disciplina são princípios fundamentais da PRF, conforme estabelecido no Decreto 1.655/1995, sendo dever do servidor acatar ordens superiores, exceto quando manifestamente ilegais.",
    resposta: "CERTO",
    explicacao:
      "Princípios militares aplicados à carreira policial civil: hierarquia (escalonamento de autoridade) e disciplina (acatamento de ordens). Recusa de ordem ilegal é dever (art. 116, Lei 8.112/1990).",
    dificuldade: 2,
    tags: ["hierarquia", "disciplina", "ordem ilegal", "dever funcional"],
    fonte_legal: ["Decreto 1.655/1995", "Lei 8.112/1990"],
    banca_referencia: "VUNESP",
    assunto: "Decreto nº 1.655/1995",
    ano: 2023,
  },
  {
    id: "prf-021",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O Decreto 1.655/1995 prevê que a PRF deve manter sistema de comunicação próprio e integrado com os órgãos de segurança pública, para garantir a rapidez e eficiência nas operações.",
    resposta: "CERTO",
    explicacao:
      "Comunicação integrada é essencial para operações policiais. A PRF mantém sistemas de rádio, dados e vídeo integrados ao SUSP (Sistema Único de Segurança Pública).",
    dificuldade: 1,
    tags: [
      "sistema de comunicação",
      "integração",
      "SUSP",
      "eficiência operacional",
    ],
    fonte_legal: ["Decreto 1.655/1995"],
    banca_referencia: "CEBRASPE",
    assunto: "Decreto nº 1.655/1995",
    ano: 2022,
  },
  {
    id: "prf-022",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF pode requisitar o auxílio de forças policiais estaduais ou municipais para operações em rodovias federais, desde que haja convênio prévio entre os entes.",
    resposta: "ERRADO",
    explicacao:
      "A requisição de auxílio em situações de emergência ou operações especiais não depende de convênio prévio, mas de necessidade operacional e cooperação institucional (art. 144, § 10, CF/88).",
    dificuldade: 3,
    tags: [
      "requisição de auxílio",
      "cooperação institucional",
      "emergência",
      "art. 144 § 10 CF",
    ],
    fonte_legal: ["Decreto 1.655/1995", "Art. 144, § 10, CF/88"],
    banca_referencia: "FCC",
    assunto: "Decreto nº 1.655/1995",
    ano: 2024,
  },
  {
    id: "prf-023",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O Regulamento da PRF estabelece que os policiais rodoviários federais devem usar uniforme padronizado em serviço ostensivo, sendo facultativo o uso em atividades administrativas internas.",
    resposta: "CERTO",
    explicacao:
      "Uniforme é símbolo da autoridade e identificação institucional. Uso obrigatório em serviço ostensivo; em atividades administrativas, pode ser dispensado conforme regulamento interno.",
    dificuldade: 1,
    tags: ["uniforme", "serviço ostensivo", "identificação institucional"],
    fonte_legal: ["Decreto 1.655/1995"],
    banca_referencia: "CEBRASPE",
    assunto: "Decreto nº 1.655/1995",
    ano: 2023,
  },
  {
    id: "prf-024",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A PRF deve manter registro centralizado de todas as ocorrências policiais e de trânsito em rodovias federais, para fins estatísticos e de planejamento operacional.",
    resposta: "CERTO",
    explicacao:
      "Registro sistemático de ocorrências é fundamental para inteligência policial, estatísticas de criminalidade e trânsito, e formulação de políticas públicas de segurança.",
    dificuldade: 2,
    tags: [
      "registro de ocorrências",
      "inteligência policial",
      "estatísticas",
      "planejamento",
    ],
    fonte_legal: ["Decreto 1.655/1995"],
    banca_referencia: "FGV",
    assunto: "Decreto nº 1.655/1995",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 4: DECRETO Nº 6.061/2007 - ESTRUTURA REGIMENTAL DA PRF
  // ============================================================
  {
    id: "prf-025",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O Decreto nº 6.061/2007 aprova a Estrutura Regimental da Polícia Rodoviária Federal, definindo competências, atribuições e organização interna da instituição.",
    resposta: "CERTO",
    explicacao:
      "Decreto 6.061/2007: norma regimental que detalha a estrutura administrativa e operacional da PRF, complementando o Decreto 1.655/1995 e a legislação específica.",
    dificuldade: 1,
    tags: ["Decreto 6.061/2007", "estrutura regimental", "organização interna"],
    fonte_legal: ["Decreto 6.061/2007"],
    banca_referencia: "CEBRASPE",
    assunto: "Decreto nº 6.061/2007",
    ano: 2023,
  },
  {
    id: "prf-026",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "Conforme o Decreto 6.061/2007, a Direção-Geral da PRF é o órgão de direção superior, responsável pela coordenação, supervisão e controle das atividades institucionais.",
    resposta: "CERTO",
    explicacao:
      "Direção-Geral: órgão máximo da PRF, subordinado ao MJSP. Responsável por políticas institucionais, gestão estratégica e representação da corporação.",
    dificuldade: 1,
    tags: ["Direção-Geral", "órgão de direção superior", "gestão estratégica"],
    fonte_legal: ["Decreto 6.061/2007"],
    banca_referencia: "CEBRASPE",
    assunto: "Decreto nº 6.061/2007",
    ano: 2022,
  },
  {
    id: "prf-027",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Estrutura Regimental da PRF prevê a existência de órgãos de assessoramento direto ao Diretor-Geral, como a Corregedoria, a Ouvidoria e a Assessoria de Comunicação Social.",
    resposta: "CERTO",
    explicacao:
      "Órgãos de assessoramento: Corregedoria (controle interno), Ouvidoria (interface com sociedade), ASCOM (comunicação institucional). Atuam diretamente sob a Direção-Geral.",
    dificuldade: 2,
    tags: ["órgãos de assessoramento", "Corregedoria", "Ouvidoria", "ASCOM"],
    fonte_legal: ["Decreto 6.061/2007"],
    banca_referencia: "FGV",
    assunto: "Decreto nº 6.061/2007",
    ano: 2024,
  },
  {
    id: "prf-028",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "As Superintendências Regionais da PRF, conforme o Decreto 6.061/2007, possuem autonomia administrativa e financeira para celebrar contratos e convênios em nome da União.",
    resposta: "ERRADO",
    explicacao:
      "Superintendências Regionais têm autonomia operacional e administrativa, mas a celebração de contratos e convênios em nome da União compete à Direção-Geral ou ao MJSP, conforme legislação orçamentária.",
    dificuldade: 3,
    tags: [
      "autonomia das SRs",
      "celebração de contratos",
      "competência da União",
    ],
    fonte_legal: ["Decreto 6.061/2007", "Lei 4.320/1964"],
    banca_referencia: "FCC",
    assunto: "Decreto nº 6.061/2007",
    ano: 2023,
  },
  {
    id: "prf-029",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O Decreto 6.061/2007 estabelece que a PRF deve manter programas de capacitação continuada para seus servidores, visando à atualização técnica e ao aprimoramento profissional.",
    resposta: "CERTO",
    explicacao:
      "Capacitação continuada é diretriz institucional. A PRF mantém escolas de formação e programas de aperfeiçoamento em parceria com instituições de ensino e segurança.",
    dificuldade: 1,
    tags: [
      "capacitação continuada",
      "formação profissional",
      "educação corporativa",
    ],
    fonte_legal: ["Decreto 6.061/2007"],
    banca_referencia: "CEBRASPE",
    assunto: "Decreto nº 6.061/2007",
    ano: 2024,
  },
  {
    id: "prf-030",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Estrutura Regimental da PRF prevê a criação de Núcleos de Inteligência Policial, responsáveis pela produção de conhecimento estratégico para apoio às operações.",
    resposta: "CERTO",
    explicacao:
      "Inteligência policial é função essencial para prevenção e repressão qualificada. Núcleos de inteligência produzem análises de risco, mapeamento criminal e suporte operacional.",
    dificuldade: 2,
    tags: [
      "inteligência policial",
      "núcleos de inteligência",
      "análise de risco",
    ],
    fonte_legal: ["Decreto 6.061/2007"],
    banca_referencia: "VUNESP",
    assunto: "Decreto nº 6.061/2007",
    ano: 2023,
  },
  {
    id: "prf-031",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "O Decreto 6.061/2007 autoriza a PRF a celebrar termos de cooperação técnica com instituições de ensino e pesquisa para desenvolvimento de projetos de inovação tecnológica.",
    resposta: "CERTO",
    explicacao:
      "Inovação tecnológica é prioridade institucional. Cooperação com universidades e centros de pesquisa viabiliza desenvolvimento de sistemas, equipamentos e metodologias para a segurança pública.",
    dificuldade: 2,
    tags: [
      "cooperação técnica",
      "inovação tecnológica",
      "parcerias acadêmicas",
    ],
    fonte_legal: ["Decreto 6.061/2007"],
    banca_referencia: "CEBRASPE",
    assunto: "Decreto nº 6.061/2007",
    ano: 2024,
  },
  {
    id: "prf-032",
    disciplina: "LEGISLACAO_PRF",
    enunciado:
      "A Estrutura Regimental da PRF determina que todas as unidades operacionais devem manter plantão permanente, garantindo atendimento ininterrupto às ocorrências em rodovias federais.",
    resposta: "CERTO",
    explicacao:
      "Plantão 24h é atributo essencial da atividade policial ostensiva. Garante resposta imediata a acidentes, crimes e emergências em rodovias federais.",
    dificuldade: 1,
    tags: [
      "plantão permanente",
      "atendimento ininterrupto",
      "atividade ostensiva",
    ],
    fonte_legal: ["Decreto 6.061/2007"],
    banca_referencia: "CEBRASPE",
    assunto: "Decreto nº 6.061/2007",
    ano: 2023,
  },
];

export const totalQuestoesLegislacaoPRF = questoesLegislacaoPRF.length;
