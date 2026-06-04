import { Questao } from "../index";

export const questoesAdministracao: Questao[] = [
  // ============================================================
  // TÓPICO 1: EVOLUÇÃO DA ADMINISTRAÇÃO PÚBLICA
  // ============================================================
  {
    id: "admin-001",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A reforma do Estado no Brasil buscou substituir o modelo burocrático tradicional por um modelo gerencial, com foco em eficiência, resultados e qualidade dos serviços públicos.",
    resposta: "CERTO",
    explicacao:
      "A reforma gerencial (PDRAE/1995) introduziu foco em desempenho, eficiência, orientação ao cidadão e controle de resultados.",
    dificuldade: 1,
    tags: ["reforma do estado", "administracao publica gerencial", "PDRAE"],
    banca_referencia: "CEBRASPE",
    assunto: "Evolucao da Administracao Publica",
    ano: 2023,
  },
  {
    id: "admin-002",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A gestão pública e a gestão privada são idênticas quanto aos seus objetivos, pois ambas visam exclusivamente ao lucro.",
    resposta: "ERRADO",
    explicacao:
      "Gestão pública busca interesse coletivo e bem comum; gestão privada visa lucro. Há convergências em técnicas, mas divergências em finalidades.",
    dificuldade: 1,
    tags: ["gestao publica vs privada", "objetivos organizacionais"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestao Publica e Privada",
    ano: 2022,
  },
  {
    id: "admin-003",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A excelência nos serviços públicos está associada à eficiência, eficácia e efetividade na entrega de resultados à sociedade.",
    resposta: "CERTO",
    explicacao:
      "Excelência = eficiência (meios), eficácia (resultados) e efetividade (impacto social). Modelo 3Es da gestão pública.",
    dificuldade: 1,
    tags: ["excelencia", "eficiencia", "eficacia", "efetividade"],
    banca_referencia: "FGV",
    assunto: "Excelencia nos Servicos Publicos",
    ano: 2023,
  },
  {
    id: "admin-004",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O modelo patrimonialista de administração pública caracteriza-se pela confusão entre o patrimônio do Estado e o do governante.",
    resposta: "CERTO",
    explicacao:
      "Patrimonialismo: ausência de distinção entre público e privado, nepotismo, clientelismo. Superado pelo modelo burocrático weberiano.",
    dificuldade: 2,
    tags: ["patrimonialismo", "evolucao historica", "weber"],
    banca_referencia: "FCC",
    assunto: "Evolucao da Administracao Publica",
    ano: 2023,
  },
  {
    id: "admin-005",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A governança pública moderna incorpora princípios de transparência, accountability e participação social como pilares da gestão.",
    resposta: "CERTO",
    explicacao:
      "Governança pública = mecanismos de direção, controle e prestação de contas, com foco em legitimidade e resultados sociais.",
    dificuldade: 2,
    tags: ["governanca publica", "accountability", "transparencia"],
    banca_referencia: "FGV",
    assunto: "Gestao Publica Contemporanea",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 2: GESTÃO DE PESSOAS
  // ============================================================
  {
    id: "admin-006",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A gestão de pessoas no setor público limita-se à administração de folha de pagamento e controle de frequência.",
    resposta: "ERRADO",
    explicacao:
      "Gestão de pessoas moderna inclui: recrutamento, desenvolvimento, avaliação de desempenho, clima organizacional e retenção de talentos.",
    dificuldade: 1,
    tags: ["gestao de pessoas", "RH estrategico"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestao de Pessoas - Conceitos",
    ano: 2022,
  },
  {
    id: "admin-007",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O planejamento estratégico de recursos humanos deve estar alinhado ao planejamento estratégico organizacional.",
    resposta: "CERTO",
    explicacao:
      "RH estratégico atua como parceiro de negócio, alinhando competências humanas aos objetivos institucionais de longo prazo.",
    dificuldade: 2,
    tags: ["planejamento estrategico rh", "alinhamento estrategico"],
    banca_referencia: "FGV",
    assunto: "Planejamento Estrategico de RH",
    ano: 2023,
  },
  {
    id: "admin-008",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A gestão de desempenho avalia apenas resultados individuais, desconsiderando metas organizacionais.",
    resposta: "ERRADO",
    explicacao:
      "Gestão de desempenho integra avaliação individual, equipes e metas institucionais, com foco em feedback e desenvolvimento contínuo.",
    dificuldade: 2,
    tags: ["gestao de desempenho", "avaliacao 360", "feedback"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestao de Desempenho",
    ano: 2023,
  },
  {
    id: "admin-009",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "Cultura organizacional refere-se aos valores, crenças e práticas compartilhadas dentro da organização.",
    resposta: "CERTO",
    explicacao:
      "Cultura = conjunto de pressupostos básicos, valores e artefatos que orientam o comportamento organizacional (Schein).",
    dificuldade: 1,
    tags: ["cultura organizacional", "valores", "crencas"],
    banca_referencia: "CEBRASPE",
    assunto: "Comportamento Organizacional",
    ano: 2022,
  },
  {
    id: "admin-010",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "Clima organizacional e cultura organizacional são conceitos sinônimos e intercambiáveis na gestão de pessoas.",
    resposta: "ERRADO",
    explicacao:
      "Cultura = profundo, estável, valores fundamentais. Clima = percepção momentânea, superficial, influenciado por eventos recentes.",
    dificuldade: 2,
    tags: ["clima organizacional", "cultura organizacional", "diferencas"],
    banca_referencia: "FCC",
    assunto: "Comportamento Organizacional",
    ano: 2023,
  },
  {
    id: "admin-011",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A gestão por competências busca alinhar conhecimentos, habilidades e atitudes às necessidades organizacionais.",
    resposta: "CERTO",
    explicacao:
      "Modelo CHA: Conhecimento (saber), Habilidade (saber fazer), Atitude (querer fazer). Base para recrutamento, avaliação e desenvolvimento.",
    dificuldade: 2,
    tags: ["gestao por competencias", "CHA", "mapeamento de competencias"],
    banca_referencia: "FGV",
    assunto: "Gestao por Competencias",
    ano: 2023,
  },
  {
    id: "admin-012",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A gestão do conhecimento visa apenas ao registro documental de informações, sem preocupação com a socialização do saber.",
    resposta: "ERRADO",
    explicacao:
      "Gestão do conhecimento = criar, compartilhar e aplicar conhecimento tácito e explícito (Nonaka & Takeuchi). Foco em aprendizagem organizacional.",
    dificuldade: 3,
    tags: [
      "gestao do conhecimento",
      "conhecimento tacito",
      "aprendizagem organizacional",
    ],
    banca_referencia: "FGV",
    assunto: "Gestao do Conhecimento",
    ano: 2024,
  },
  {
    id: "admin-013",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "Qualidade de vida no trabalho está relacionada apenas a benefícios financeiros oferecidos ao servidor.",
    resposta: "ERRADO",
    explicacao:
      "QVT inclui: ergonomia, saúde ocupacional, equilíbrio vida-trabalho, reconhecimento, autonomia e desenvolvimento profissional.",
    dificuldade: 1,
    tags: ["qualidade de vida no trabalho", "QVT", "bem-estar"],
    banca_referencia: "CEBRASPE",
    assunto: "Qualidade de Vida no Trabalho",
    ano: 2021,
  },
  {
    id: "admin-014",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A departamentalização funcional agrupa atividades com base em funções semelhantes, como marketing, finanças e produção.",
    resposta: "CERTO",
    explicacao:
      "Estrutura funcional: especialização por áreas técnicas. Vantagem: eficiência. Desvantagem: visão fragmentada (silos).",
    dificuldade: 1,
    tags: ["departamentalizacao", "estrutura funcional", "organizacao"],
    banca_referencia: "CEBRASPE",
    assunto: "Estrutura Organizacional",
    ano: 2022,
  },
  {
    id: "admin-015",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A estrutura matricial combina departamentalização funcional e por projetos, permitindo alocação flexível de recursos.",
    resposta: "CERTO",
    explicacao:
      "Matricial: dupla subordinação (gerente funcional + gerente de projeto). Flexível, mas pode gerar conflitos de autoridade.",
    dificuldade: 2,
    tags: ["estrutura matricial", "gestao por projetos", "departamentalizacao"],
    banca_referencia: "FCC",
    assunto: "Estrutura Organizacional",
    ano: 2023,
  },
  {
    id: "admin-016",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A liderança eficaz depende exclusivamente de características inatas do líder.",
    resposta: "ERRADO",
    explicacao:
      "Teorias contemporâneas: liderança é comportamental e situacional. Pode ser desenvolvida por treinamento e experiência (liderança servidora, transformacional).",
    dificuldade: 2,
    tags: ["lideranca", "teorias da lideranca", "desenvolvimento"],
    banca_referencia: "FGV",
    assunto: "Lideranca",
    ano: 2023,
  },
  {
    id: "admin-017",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A teoria da expectativa de Vroom afirma que a motivação depende da relação entre esforço, desempenho e recompensa esperada.",
    resposta: "CERTO",
    explicacao:
      "Motivação = Expectativa (esforço→desempenho) × Instrumentalidade (desempenho→recompensa) × Valência (valor da recompensa).",
    dificuldade: 3,
    tags: ["motivacao", "teoria da expectativa", "vroom"],
    banca_referencia: "FCC",
    assunto: "Motivacao e Satisfacao no Trabalho",
    ano: 2024,
  },
  {
    id: "admin-018",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O recrutamento pode ser interno ou externo, dependendo da origem dos candidatos.",
    resposta: "CERTO",
    explicacao:
      "Recrutamento interno: promove talentos existentes (motivação, custo). Externo: traz novas competências, mas pode desmotivar internos.",
    dificuldade: 1,
    tags: ["recrutamento", "selecao de pessoas", "RH"],
    banca_referencia: "CEBRASPE",
    assunto: "Recrutamento e Selecao",
    ano: 2022,
  },
  {
    id: "admin-019",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A análise e descrição de cargos define responsabilidades, requisitos e competências necessárias para o desempenho de funções.",
    resposta: "CERTO",
    explicacao:
      "Análise de cargos = base para recrutamento, avaliação de desempenho, remuneração e treinamento. Inclui tarefas, responsabilidades e perfil necessário.",
    dificuldade: 1,
    tags: ["analise de cargos", "descricao de cargos", "gestao de cargos"],
    banca_referencia: "CEBRASPE",
    assunto: "Analise e Descricao de Cargos",
    ano: 2021,
  },
  {
    id: "admin-020",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A seleção por competências utiliza técnicas como assessment center e dinâmicas de grupo para avaliar comportamentos esperados.",
    resposta: "CERTO",
    explicacao:
      "Seleção por competências foca em evidências comportamentais. Assessment center simula situações reais para observar competências em ação.",
    dificuldade: 2,
    tags: [
      "selecao por competencias",
      "assessment center",
      "entrevista comportamental",
    ],
    banca_referencia: "FGV",
    assunto: "Recrutamento e Selecao",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 3: EDUCAÇÃO, TREINAMENTO E DESENVOLVIMENTO
  // ============================================================
  {
    id: "admin-021",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "Treinamento e desenvolvimento são conceitos idênticos e possuem o mesmo foco organizacional.",
    resposta: "ERRADO",
    explicacao:
      "Treinamento = curto prazo, foco em habilidades específicas para cargo atual. Desenvolvimento = longo prazo, foco em crescimento profissional e carreira.",
    dificuldade: 2,
    tags: ["treinamento", "desenvolvimento", "educacao corporativa"],
    banca_referencia: "FGV",
    assunto: "Educacao Corporativa",
    ano: 2023,
  },
  {
    id: "admin-022",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A educação corporativa busca o desenvolvimento contínuo dos colaboradores alinhado à estratégia organizacional.",
    resposta: "CERTO",
    explicacao:
      "Educação corporativa = sistema integrado de aprendizagem que conecta desenvolvimento humano aos objetivos estratégicos da organização.",
    dificuldade: 2,
    tags: ["educacao corporativa", "aprendizagem organizacional", "estrategia"],
    banca_referencia: "CEBRASPE",
    assunto: "Educacao Corporativa",
    ano: 2023,
  },
  {
    id: "admin-023",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A educação a distância elimina totalmente a necessidade de interação entre instrutor e aluno.",
    resposta: "ERRADO",
    explicacao:
      "EAD de qualidade combina recursos assíncronos (videoaulas, fóruns) e síncronos (webinars, tutoria). Interação é essencial para aprendizagem significativa.",
    dificuldade: 1,
    tags: ["ead", "educacao a distancia", "interacao"],
    banca_referencia: "CEBRASPE",
    assunto: "Educacao a Distancia",
    ano: 2022,
  },
  {
    id: "admin-024",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O modelo 70-20-10 de desenvolvimento propõe que 70% da aprendizagem ocorre na prática, 20% em interações sociais e 10% em treinamentos formais.",
    resposta: "CERTO",
    explicacao:
      "Modelo 70-20-10 (Lombardo & Eichinger): aprendizagem experiencial (on-the-job) é predominante. Base para programas modernos de desenvolvimento.",
    dificuldade: 3,
    tags: [
      "modelo 70-20-10",
      "desenvolvimento profissional",
      "aprendizagem experiencial",
    ],
    banca_referencia: "FCC",
    assunto: "Educacao Corporativa",
    ano: 2024,
  },
  {
    id: "admin-025",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A LGPD impacta a gestão de pessoas ao exigir consentimento e transparência no tratamento de dados pessoais dos servidores.",
    resposta: "CERTO",
    explicacao:
      "Lei 13.709/2018: RH deve adequar processos de recrutamento, avaliação e folha de pagamento aos princípios de finalidade, necessidade e segurança de dados.",
    dificuldade: 3,
    tags: ["lgpd", "gestao de pessoas", "protecao de dados"],
    banca_referencia: "FGV",
    assunto: "Gestao de Pessoas e Legislacao",
    ano: 2024,
  },

  // ============================================================
  // QUESTÕES INTERDISCIPLINARES E DE APROFUNDAMENTO
  // ============================================================
  {
    id: "admin-026",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A nova gestão pública (New Public Management) incorpora técnicas do setor privado, como foco em resultados, descentralização e competição controlada.",
    resposta: "CERTO",
    explicacao:
      "NPM: movimento global dos anos 80-90 que influenciou a reforma gerencial brasileira. Ênfase em eficiência, métricas de desempenho e orientação ao cidadão.",
    dificuldade: 2,
    tags: [
      "new public management",
      "reforma gerencial",
      "gestao por resultados",
    ],
    banca_referencia: "FCC",
    assunto: "Evolucao da Administracao Publica",
    ano: 2023,
  },
  {
    id: "admin-027",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A avaliação de desempenho com foco punitivo tende a gerar resistência e reduzir a eficácia do processo de gestão de pessoas.",
    resposta: "CERTO",
    explicacao:
      "Avaliação formativa (com feedback construtivo) é mais eficaz que abordagem punitiva. Foco deve ser desenvolvimento, não apenas julgamento.",
    dificuldade: 2,
    tags: ["avaliacao de desempenho", "feedback", "gestao de pessoas"],
    banca_referencia: "VUNESP",
    assunto: "Gestao de Desempenho",
    ano: 2023,
  },
  {
    id: "admin-028",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A teoria dos dois fatores de Herzberg distingue fatores higiênicos (evitam insatisfação) de fatores motivacionais (geram satisfação).",
    resposta: "CERTO",
    explicacao:
      "Herzberg: salário, condições de trabalho = higiênicos. Reconhecimento, realização, responsabilidade = motivacionais. Ambos são necessários para alta performance.",
    dificuldade: 3,
    tags: ["herzberg", "motivacao", "teoria dos dois fatores"],
    banca_referencia: "FCC",
    assunto: "Motivacao e Satisfacao no Trabalho",
    ano: 2024,
  },
  {
    id: "admin-029",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A estrutura organizacional em rede caracteriza-se por parcerias, terceirização e flexibilidade, sendo adequada para ambientes dinâmicos.",
    resposta: "CERTO",
    explicacao:
      "Estrutura em rede: organização focal coordena parceiros especializados. Vantagens: agilidade, redução de custos fixos. Desafio: gestão de relações.",
    dificuldade: 3,
    tags: ["estrutura em rede", "organizacao flexivel", "terceirizacao"],
    banca_referencia: "FGV",
    assunto: "Estrutura Organizacional",
    ano: 2024,
  },
  {
    id: "admin-030",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O endomarketing aplica técnicas de marketing interno para engajar servidores, melhorar clima organizacional e alinhar valores institucionais.",
    resposta: "CERTO",
    explicacao:
      "Endomarketing = comunicação estratégica interna para construir identidade organizacional, engajamento e cultura de serviço público.",
    dificuldade: 2,
    tags: ["endomarketing", "comunicacao interna", "engajamento"],
    banca_referencia: "VUNESP",
    assunto: "Comportamento Organizacional",
    ano: 2023,
  },
  {
    id: "admin-031",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A gestão do conhecimento explícito é mais desafiadora que a do conhecimento tácito, por depender de documentação formal.",
    resposta: "ERRADO",
    explicacao:
      "Conhecimento tácito (experiência, intuição) é mais difícil de codificar e transferir. Gestão do conhecimento foca em converter tácito em explícito (socialização, externalização).",
    dificuldade: 3,
    tags: ["gestao do conhecimento", "conhecimento tacito", "nonaka"],
    banca_referencia: "FGV",
    assunto: "Gestao do Conhecimento",
    ano: 2024,
  },
  {
    id: "admin-032",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O feedback 360 graus avalia o servidor a partir de múltiplas fontes: superiores, pares, subordinados e autoavaliação.",
    resposta: "CERTO",
    explicacao:
      "Feedback 360°: visão multidimensional do desempenho. Requer cultura de confiança e foco em desenvolvimento, não em punição.",
    dificuldade: 2,
    tags: ["feedback 360", "avaliacao de desempenho", "multisource feedback"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestao de Desempenho",
    ano: 2023,
  },
  {
    id: "admin-033",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A diversidade e inclusão no serviço público fortalecem a legitimidade institucional e a qualidade das políticas públicas.",
    resposta: "CERTO",
    explicacao:
      "Diversidade (gênero, raça, PCD, etc.) traz perspectivas múltiplas, melhora tomada de decisão e representa melhor a sociedade atendida.",
    dificuldade: 2,
    tags: ["diversidade", "inclusao", "gestao de pessoas"],
    banca_referencia: "FGV",
    assunto: "Gestao de Pessoas Contemporanea",
    ano: 2024,
  },
  {
    id: "admin-034",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "A departamentalização por produtos ou serviços é mais adequada para organizações com portfólio diversificado e mercados distintos.",
    resposta: "CERTO",
    explicacao:
      "Estrutura divisional: cada divisão foca em um produto/mercado. Vantagem: foco no cliente. Desvantagem: duplicação de recursos.",
    dificuldade: 2,
    tags: [
      "departamentalizacao",
      "estrutura divisional",
      "gestao por produtos",
    ],
    banca_referencia: "FCC",
    assunto: "Estrutura Organizacional",
    ano: 2023,
  },
  {
    id: "admin-035",
    disciplina: "ADMINISTRACAO",
    enunciado:
      "O planejamento de sucessão é estratégia de retenção de talentos que visa preparar profissionais para assumir cargos-chave no futuro.",
    resposta: "CERTO",
    explicacao:
      "Sucessão planejada reduz riscos de descontinuidade, desenvolve lideranças internas e demonstra compromisso com carreira dos servidores.",
    dificuldade: 2,
    tags: [
      "planejamento de sucessao",
      "retencao de talentos",
      "desenvolvimento de liderancas",
    ],
    banca_referencia: "VUNESP",
    assunto: "Gestao de Pessoas Estrategica",
    ano: 2024,
  },
];

export const totalQuestoesAdministracao = questoesAdministracao.length;
