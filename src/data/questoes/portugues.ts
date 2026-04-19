import { Questao } from "../types";

export const questoesPortugues: Questao[] = [
  // ============================================================
  // TÓPICO 1: COMPREENSÃO E INTERPRETAÇÃO DE TEXTOS
  // ============================================================
  {
    id: "port-001",
    disciplina: "PORTUGUES",
    enunciado:
      "Em textos oficiais, a clareza e a concisão são princípios fundamentais, devendo-se evitar expressões redundantes como 'criar novos empregos' ou 'encarar de frente', que constituem pleonasmos viciosos.",
    resposta: "CERTO",
    explicacao:
      "O Manual de Redação da Presidência da República recomenda linguagem direta e econômica. Pleonasmos viciosos ('subir para cima', 'criar novo') devem ser evitados por ferirem a concisão, princípio basilar da redação oficial.",
    dificuldade: 1,
    tags: ["clareza", "concisão", "pleonasmo", "Manual de Redação"],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Compreensão e Interpretação de Textos",
    ano: 2024,
  },
  {
    id: "port-002",
    disciplina: "PORTUGUES",
    enunciado:
      "A inferência é uma operação lógica que permite ao leitor extrair informações implícitas do texto, desde que fundamentadas em elementos textuais e no conhecimento de mundo, não configurando mera suposição pessoal.",
    resposta: "CERTO",
    explicacao:
      "Inferir ≠ inventar. Inferência válida parte de pistas textuais + conhecimento prévio. Em provas, a banca exige que a resposta esteja ancorada no texto, mesmo que indiretamente.",
    dificuldade: 2,
    tags: [
      "inferência",
      "interpretação",
      "informação implícita",
      "leitura crítica",
    ],
    banca_referencia: "FGV",
    assunto: "Compreensão e Interpretação de Textos",
    ano: 2023,
  },
  {
    id: "port-003",
    disciplina: "PORTUGUES",
    enunciado:
      "A ambiguidade em textos oficiais é sempre considerada vício de linguagem, devendo ser evitada por comprometer a precisão e a segurança jurídica do documento.",
    resposta: "CERTO",
    explicacao:
      "Precisão é requisito essencial da redação oficial. Ambiguidade (duplo sentido) gera insegurança interpretativa e deve ser eliminada por reformulação ou pontuação adequada.",
    dificuldade: 1,
    tags: [
      "ambiguidade",
      "precisão",
      "vício de linguagem",
      "segurança jurídica",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Compreensão e Interpretação de Textos",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 2: TIPOLOGIA TEXTUAL
  // ============================================================
  {
    id: "port-004",
    disciplina: "PORTUGUES",
    enunciado:
      "O texto dissertativo-argumentativo, predominante em pareceres e decisões administrativas, caracteriza-se pela defesa de um ponto de vista fundamentado em argumentos lógicos e dados objetivos.",
    resposta: "CERTO",
    explicacao:
      "Dissertativo-argumentativo = tese + argumentos + conclusão. É o tipo textual padrão para peças que exigem posicionamento fundamentado: pareceres, decisões, relatórios analíticos.",
    dificuldade: 1,
    tags: [
      "dissertativo-argumentativo",
      "parecer",
      "argumentação",
      "tipologia",
    ],
    banca_referencia: "FCC",
    assunto: "Tipologia Textual",
    ano: 2023,
  },
  {
    id: "port-005",
    disciplina: "PORTUGUES",
    enunciado:
      "A narração em textos oficiais limita-se a relatos de fatos em atas e relatórios, devendo ser impessoal, cronológica e objetiva, sem juízos de valor ou recursos literários.",
    resposta: "CERTO",
    explicacao:
      "Narração oficial = relato factual. Deve ser impessoal (3ª pessoa), linear (ordem cronológica) e objetiva (sem adjetivação subjetiva). Recursos como metáfora ou ironia são inadequados.",
    dificuldade: 2,
    tags: ["narração", "atas", "relatórios", "impessoalidade", "objetividade"],
    banca_referencia: "CEBRASPE",
    assunto: "Tipologia Textual",
    ano: 2022,
  },
  {
    id: "port-006",
    disciplina: "PORTUGUES",
    enunciado:
      "O texto descritivo, comum em laudos periciais, deve priorizar a ordem espacial e o uso de adjetivos técnicos precisos, evitando subjetivismo e impressões pessoais.",
    resposta: "CERTO",
    explicacao:
      "Descrição técnica = precisão + ordem lógica (espaço, tempo, importância). Adjetivos devem ser objetivos ('veículo de cor vermelha', não 'veículo bonito'). Subjetivismo compromete a credibilidade do laudo.",
    dificuldade: 2,
    tags: ["descrição", "laudos", "adjetivos técnicos", "ordem espacial"],
    banca_referencia: "VUNESP",
    assunto: "Tipologia Textual",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 3: ORTOGRAFIA OFICIAL
  // ============================================================
  {
    id: "port-007",
    disciplina: "PORTUGUES",
    enunciado:
      "Após o Acordo Ortográfico de 1990, o trema foi completamente abolido da língua portuguesa, não sendo mais utilizado em nenhuma palavra, nem mesmo em nomes próprios estrangeiros.",
    resposta: "ERRADO",
    explicacao:
      "O trema foi abolido em palavras portuguesas ('linguiça', 'frequente'), mas mantém-se em nomes próprios estrangeiros e seus derivados: 'Müller', 'mülleriano'. A exceção está no §1º do Art. 2º do Acordo.",
    dificuldade: 2,
    tags: ["trema", "Acordo Ortográfico", "nomes próprios", "exceções"],
    fonte_legal: ["Acordo Ortográfico da Língua Portuguesa (1990)"],
    banca_referencia: "FGV",
    assunto: "Ortografia Oficial",
    ano: 2024,
  },
  {
    id: "port-008",
    disciplina: "PORTUGUES",
    enunciado:
      "A grafia correta dos derivados de 'trazer' mantém o 'z': 'traz', 'trazes', 'trazem', 'trazia', 'trouxeram', conforme a regra de manutenção da consoante radical em verbos irregulares.",
    resposta: "ERRADO",
    explicacao:
      "O verbo 'trazer' é irregular: presente do indicativo = 'trago, trazes, traz, trazemos, trazeis, trazem' (com 'z'), mas o pretérito perfeito = 'trouxe, trouxeste, trouxe...' (com 'x'). A regra não é manutenção mecânica do radical.",
    dificuldade: 3,
    tags: ["verbos irregulares", "trazer", "ortografia", "conjugação"],
    banca_referencia: "CEBRASPE",
    assunto: "Ortografia Oficial",
    ano: 2023,
  },
  {
    id: "port-009",
    disciplina: "PORTUGUES",
    enunciado:
      "Usa-se 'ss' em substantivos derivados de verbos terminados em '-ceder', '-gredir', '-primir': 'concessão' (de conceder), 'agressão' (de agredir), 'impressão' (de imprimir).",
    resposta: "CERTO",
    explicacao:
      "Regra mnemônica: verbos em -ceder/-gredir/-primir → substantivos em -ssão. Exceções existem, mas esta regra cobre a maioria dos casos cobrados em concurso.",
    dificuldade: 2,
    tags: ["ss vs ç", "derivação", "substantivos", "ortografia"],
    banca_referencia: "FCC",
    assunto: "Ortografia Oficial",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 4: ACENTUAÇÃO GRÁFICA
  // ============================================================
  {
    id: "port-010",
    disciplina: "PORTUGUES",
    enunciado:
      "As paroxítonas terminadas em ditongo oral 'ei', 'oi' perderam o acento gráfico com o Acordo Ortográfico: 'ideia', 'jiboia', 'plateia' grafam-se sem acento.",
    resposta: "CERTO",
    explicacao:
      "Acordo Ortográfico (1990): paroxítonas com ditongos abertos 'ei', 'oi' não são mais acentuadas. Exceção: se o 'i' ou 'u' forem tônicos e precedidos de ditongo ('baiúca' mantém acento).",
    dificuldade: 1,
    tags: ["acentuação", "paroxítonas", "ditongo", "Acordo Ortográfico"],
    fonte_legal: ["Acordo Ortográfico da Língua Portuguesa (1990)"],
    banca_referencia: "CEBRASPE",
    assunto: "Acentuação Gráfica",
    ano: 2024,
  },
  {
    id: "port-011",
    disciplina: "PORTUGUES",
    enunciado:
      "A palavra 'pôde' (pretérito perfeito) mantém o acento diferencial para distinguir-se de 'pode' (presente do indicativo), conforme exceção expressa no Acordo Ortográfico.",
    resposta: "CERTO",
    explicacao:
      "Acordo manteve apenas três acentos diferenciais: pôde/pode (verbo), pôr/por (verbo/preposição), têm/tem (3ª pl./3ª sg.). 'Pôde' (passado) leva acento; 'pode' (presente) não.",
    dificuldade: 2,
    tags: ["acentos diferenciais", "pôde vs pode", "Acordo Ortográfico"],
    fonte_legal: ["Acordo Ortográfico da Língua Portuguesa (1990)"],
    banca_referencia: "FGV",
    assunto: "Acentuação Gráfica",
    ano: 2023,
  },
  {
    id: "port-012",
    disciplina: "PORTUGUES",
    enunciado:
      "Os monossílabos tônicos terminados em 'a', 'e', 'o' seguidos ou não de 's' são acentuados: 'pá', 'pé', 'pó', 'más', 'nós', 'vés'.",
    resposta: "CERTO",
    explicacao:
      "Regra clássica: monossílabos tônicos abertos (a, e, o) recebem acento agudo. Fechados (ê, ô) não: 'se', 'no', 'por'. Atenção: 'pôs' (pretérito de pôr) leva circunflexo por ser fechado.",
    dificuldade: 1,
    tags: ["monossílabos tônicos", "acentuação", "regra geral"],
    banca_referencia: "CEBRASPE",
    assunto: "Acentuação Gráfica",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 5: EMPREGO DAS CLASSES DE PALAVRAS
  // ============================================================
  {
    id: "port-013",
    disciplina: "PORTUGUES",
    enunciado:
      "O pronome 'cujo' é relativo possessivo que concorda em gênero e número com o substantivo que o segue (possuído), não com o antecedente (possuidor): 'O servidor cujo relatório foi aprovado'.",
    resposta: "CERTO",
    explicacao:
      "'Cujo' = 'do qual', 'da qual'. Concorda com o possuído: 'cujo relatório' (relatório = masc. sg.). O possuidor ('servidor') não influencia a flexão. Erro comum: 'cuja relatório' (incorreto).",
    dificuldade: 2,
    tags: ["pronomes relativos", "cujo", "concordância", "posse"],
    banca_referencia: "FCC",
    assunto: "Classes de Palavras - Pronomes",
    ano: 2024,
  },
  {
    id: "port-014",
    disciplina: "PORTUGUES",
    enunciado:
      "O advérbio 'onde' só deve ser empregado para indicar lugar físico; para tempo, usa-se 'quando': 'Onde há fumaça, há fogo' (lugar) × 'Quando chove, o trânsito piora' (tempo).",
    resposta: "CERTO",
    explicacao:
      "'Onde' = advérbio de lugar. Uso temporal ('onde eu estava') é coloquial, inadequado para textos formais. Em redação oficial, prefira 'quando', 'na ocasião em que', 'no momento em que'.",
    dificuldade: 1,
    tags: ["advérbios", "onde vs quando", "lugar vs tempo", "norma culta"],
    banca_referencia: "CEBRASPE",
    assunto: "Classes de Palavras - Advérbios",
    ano: 2023,
  },
  {
    id: "port-015",
    disciplina: "PORTUGUES",
    enunciado:
      "A conjunção 'conquanto' introduz oração subordinada adverbial concessiva, equivalendo a 'embora', 'ainda que', e exige verbo no modo subjuntivo: 'Conquanto tenha estudado, não foi aprovado'.",
    resposta: "CERTO",
    explicacao:
      "'Conquanto' = conjunção concessiva formal. Exige subjuntivo por indicar hipótese, possibilidade ou fato não realizado. Similar a 'embora', 'posto que', 'não obstante'.",
    dificuldade: 3,
    tags: ["conjunções concessivas", "conquanto", "modo subjuntivo", "sintaxe"],
    banca_referencia: "VUNESP",
    assunto: "Classes de Palavras - Conjunções",
    ano: 2022,
  },
  {
    id: "port-016",
    disciplina: "PORTUGUES",
    enunciado:
      "O verbo 'haver' no sentido de 'existir' é impessoal e invariável, devendo ser conjugado sempre na 3ª pessoa do singular: 'Havia muitos processos pendentes' (não 'haviam').",
    resposta: "CERTO",
    explicacao:
      "'Haver' existencial = impessoal (sem sujeito). O termo seguinte é objeto direto, não sujeito. Erro grave em concursos: flexionar 'haver' no plural ('haviam processos').",
    dificuldade: 2,
    tags: [
      "verbo haver",
      "impessoalidade",
      "concordância verbal",
      "erro comum",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Classes de Palavras - Verbos",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 6: EMPREGO DO SINAL INDICATIVO DE CRASE
  // ============================================================
  {
    id: "port-017",
    disciplina: "PORTUGUES",
    enunciado:
      "Ocorre crase obrigatória diante de palavras femininas que admitem artigo 'a(s)' e que são regidas por preposição 'a': 'Fui à reunião', 'Refiro-me às normas'.",
    resposta: "CERTO",
    explicacao:
      "Regra prática da crase: substitua a palavra feminina por masculina. Se surgir 'ao/aos', há crase: 'Fui à reunião' → 'Fui ao encontro' (✓ crase). 'Refiro-me às normas' → 'aos regulamentos' (✓ crase).",
    dificuldade: 1,
    tags: ["crase", "preposição a", "artigo feminino", "regra prática"],
    banca_referencia: "CEBRASPE",
    assunto: "Emprego do Sinal Indicativo de Crase",
    ano: 2023,
  },
  {
    id: "port-018",
    disciplina: "PORTUGUES",
    enunciado:
      "Não ocorre crase diante de verbos, mesmo que regidos pela preposição 'a': 'Começou a chover', 'Passou a estudar', 'Está a dever'.",
    resposta: "CERTO",
    explicacao:
      "Verbo não admite artigo. Se não há artigo, não há crase (crase = preposição 'a' + artigo 'a'). 'A' antes de verbo é sempre preposição isolada.",
    dificuldade: 1,
    tags: ["crase", "verbos", "preposição", "regra de exclusão"],
    banca_referencia: "FCC",
    assunto: "Emprego do Sinal Indicativo de Crase",
    ano: 2022,
  },
  {
    id: "port-019",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'à moda de', mesmo implícita, justifica o uso da crase: 'Frango à passarinho' (= à moda de passarinho), 'Escrito à Machado de Assis' (= à moda de).",
    resposta: "CERTO",
    explicacao:
      "Crase facultativa em locuções com 'à moda de' elíptica. É tradição gramatical manter o acento em expressões consagradas que remetem a estilo/maneira.",
    dificuldade: 3,
    tags: ["crase facultativa", "à moda de", "expressões consagradas"],
    banca_referencia: "FGV",
    assunto: "Emprego do Sinal Indicativo de Crase",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 7: SINTAXE DA ORAÇÃO E DO PERÍODO
  // ============================================================
  {
    id: "port-020",
    disciplina: "PORTUGUES",
    enunciado:
      "Na oração 'O servidor que faltou será advertido', a oração subordinada adjetiva 'que faltou' é restritiva, pois limita o universo de 'servidores' àqueles que faltaram.",
    resposta: "CERTO",
    explicacao:
      "Adjetiva restritiva = sem vírgula, especifica/limita o antecedente. Se fosse explicativa ('O servidor, que faltou, será advertido'), haveria vírgulas e a oração apenas acrescentaria informação.",
    dificuldade: 2,
    tags: [
      "orações adjetivas",
      "restritiva vs explicativa",
      "pontuação",
      "sintaxe",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe da Oração e do Período",
    ano: 2023,
  },
  {
    id: "port-021",
    disciplina: "PORTUGUES",
    enunciado:
      "A voz passiva sintética (com 'se') exige que o verbo concorde com o sujeito paciente: 'Vendem-se casas' (casas = sujeito plural) × 'Vende-se casa' (casa = sujeito singular).",
    resposta: "CERTO",
    explicacao:
      "Passiva sintética: verbo + 'se' + sujeito paciente. O verbo concorda com o sujeito: 'Alugam-se apartamentos' (✓) × 'Aluga-se apartamentos' (✗). Diferente de 'se' como índice de indeterminação.",
    dificuldade: 3,
    tags: [
      "voz passiva",
      "partícula apassivadora",
      "concordância verbal",
      "se",
    ],
    banca_referencia: "FCC",
    assunto: "Sintaxe da Oração e do Período",
    ano: 2024,
  },
  {
    id: "port-022",
    disciplina: "PORTUGUES",
    enunciado:
      "O período composto por subordinação pode apresentar orações reduzidas, que dispensam conectivos e empregam formas nominais do verbo (infinitivo, gerúndio, particípio): 'Ao chegar, assinou o termo' (= Quando chegou).",
    resposta: "CERTO",
    explicacao:
      "Oração reduzida = sem conjunção, com forma nominal. 'Ao chegar' (infinitivo) = temporal; 'Chegando' (gerúndio) = temporal/causal; 'Chegado' (particípio) = temporal/conclusiva.",
    dificuldade: 2,
    tags: ["orações reduzidas", "formas nominais", "conectivos", "sintaxe"],
    banca_referencia: "VUNESP",
    assunto: "Sintaxe da Oração e do Período",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 8: PONTUAÇÃO
  // ============================================================
  {
    id: "port-023",
    disciplina: "PORTUGUES",
    enunciado:
      "A vírgula é obrigatória para separar orações coordenadas assindéticas (sem conectivo) ou sindéticas (com conectivo), exceto quando ligadas por 'e' com sujeitos iguais: 'Chegou, cumprimentou a todos e sentou-se'.",
    resposta: "CERTO",
    explicacao:
      "Regra: vírgula separa orações coordenadas. Exceção: com 'e' e sujeitos iguais, a vírgula é facultativa ('Chegou, cumprimentou e sentou' ou 'Chegou, cumprimentou, e sentou').",
    dificuldade: 2,
    tags: ["pontuação", "vírgula", "orações coordenadas", "conjunção e"],
    banca_referencia: "CEBRASPE",
    assunto: "Pontuação",
    ano: 2023,
  },
  {
    id: "port-024",
    disciplina: "PORTUGUES",
    enunciado:
      "O uso de dois-pontos em textos oficiais é adequado para introduzir enumerações, citações diretas ou explicações: 'Requisitos: a) idade mínima; b) escolaridade; c) experiência'.",
    resposta: "CERTO",
    explicacao:
      "Dois-pontos = sinal de anúncio. Introduz: lista, fala de personagem, esclarecimento, consequência. Em redação oficial, é recurso válido para organizar informações de forma clara.",
    dificuldade: 1,
    tags: ["pontuação", "dois-pontos", "enumeração", "redação oficial"],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "FCC",
    assunto: "Pontuação",
    ano: 2024,
  },
  {
    id: "port-025",
    disciplina: "PORTUGUES",
    enunciado:
      "O ponto e vírgula é empregado para separar itens de uma enumeração quando estes já contêm vírgulas internas, ou para separar orações coordenadas extensas: 'Compareceram: o diretor, que chegou atrasado; a secretária, que trouxe os documentos; e o assessor'.",
    resposta: "CERTO",
    explicacao:
      "Ponto e vírgula = pausa intermediária. Usos principais: (1) separar itens complexos em listas; (2) separar orações coordenadas longas; (3) antes de conectivos adversativos/conclusivos ('contudo', 'portanto').",
    dificuldade: 3,
    tags: [
      "pontuação",
      "ponto e vírgula",
      "enumeração complexa",
      "orações longas",
    ],
    banca_referencia: "FGV",
    assunto: "Pontuação",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 9: CONCORDÂNCIAS NOMINAL E VERBAL
  // ============================================================
  {
    id: "port-026",
    disciplina: "PORTUGUES",
    enunciado:
      "Com expressões partitivas ('a maioria de', 'grande parte de') seguidas de substantivo plural, o verbo pode concordar com o núcleo da expressão (singular) ou com o especificador (plural): 'A maioria dos servidores compareceu/compareceram'.",
    resposta: "CERTO",
    explicacao:
      "Concordância atrativa: com coletivos partitivos, ambas as concordâncias são aceitas. Preferência da norma culta: singular (com o núcleo). Mas o plural não é erro.",
    dificuldade: 2,
    tags: [
      "concordância verbal",
      "expressões partitivas",
      "maioria",
      "flexibilidade",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Concordância Verbal",
    ano: 2024,
  },
  {
    id: "port-027",
    disciplina: "PORTUGUES",
    enunciado:
      "O adjetivo posposto a substantivos de gêneros diferentes concorda com o mais próximo ou vai para o plural masculino: 'Documento e planilha anexos' ou 'Documento e planilha anexa' (concordância atrativa).",
    resposta: "CERTO",
    explicacao:
      "Adjetivo após substantivos de gêneros distintos: (1) plural masculino (regra geral); (2) concordância com o mais próximo (aceita). 'Anexos' (✓) ou 'anexa' (✓ se 'planilha' for o mais próximo).",
    dificuldade: 3,
    tags: ["concordância nominal", "adjetivo posposto", "gêneros diferentes"],
    banca_referencia: "FCC",
    assunto: "Concordância Nominal",
    ano: 2022,
  },
  {
    id: "port-028",
    disciplina: "PORTUGUES",
    enunciado:
      "O verbo 'ser' pode concordar com o predicativo do sujeito quando este for plural e o sujeito for pronome indefinido ou interrogativo: 'Tudo são flores' (aceitável) × 'Tudo é flores' (preferencial).",
    resposta: "CERTO",
    explicacao:
      "Verbo 'ser': concorda com o sujeito, mas pode atrair para o predicativo quando este for plural e o sujeito for indefinido/interrogativo. Ambas as formas são aceitas, com preferência pela concordância com o sujeito.",
    dificuldade: 3,
    tags: ["concordância verbal", "verbo ser", "predicativo", "flexibilidade"],
    banca_referencia: "VUNESP",
    assunto: "Concordância Verbal",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 10: REGÊNCIAS NOMINAL E VERBAL
  // ============================================================
  {
    id: "port-029",
    disciplina: "PORTUGUES",
    enunciado:
      "O verbo 'assistir' no sentido de 'ver, presenciar' é transitivo indireto e rege preposição 'a': 'Assistiu ao filme' (✓) × 'Assistiu o filme' (✗).",
    resposta: "CERTO",
    explicacao:
      "Assistir: (1) ver = VTI + 'a' ('Assistiu ao jogo'); (2) ajudar = VTD ou VTI ('Assistiu os necessitados' / 'Assistiu aos necessitados'); (3) caber = VTI + 'a' ('Assiste ao juiz decidir').",
    dificuldade: 2,
    tags: ["regência verbal", "assistir", "preposição a", "polissemia"],
    banca_referencia: "CEBRASPE",
    assunto: "Regência Verbal",
    ano: 2024,
  },
  {
    id: "port-030",
    disciplina: "PORTUGUES",
    enunciado:
      "O nome 'ciente' rege preposição 'de': 'Está ciente das normas' (✓). A construção 'ciente que' é coloquial e deve ser evitada em textos oficiais, preferindo-se 'ciente de que'.",
    resposta: "CERTO",
    explicacao:
      "Regência nominal: 'ciente de algo'. Em textos formais, mantenha a preposição antes da conjunção integrante: 'ciente de que', 'ciente de que o prazo...'.",
    dificuldade: 2,
    tags: ["regência nominal", "ciente", "preposição de", "formalidade"],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "FCC",
    assunto: "Regência Nominal",
    ano: 2023,
  },
  {
    id: "port-031",
    disciplina: "PORTUGUES",
    enunciado:
      "O verbo 'preferir', na norma culta, é transitivo direto e indireto, não aceitando 'do que' após comparativo: 'Prefiro café a chá' (✓) × 'Prefiro café do que chá' (✗).",
    resposta: "CERTO",
    explicacao:
      "Preferir = VTDI: prefere-se algo A algo B. A preposição é 'a', não 'do que'. Erro comum em linguagem coloquial. Em concurso, a banca cobra a regência clássica.",
    dificuldade: 2,
    tags: ["regência verbal", "preferir", "comparação", "norma culta"],
    banca_referencia: "CEBRASPE",
    assunto: "Regência Verbal",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 11: SIGNIFICAÇÃO DAS PALAVRAS
  // ============================================================
  {
    id: "port-032",
    disciplina: "PORTUGUES",
    enunciado:
      "As palavras 'iminente' e 'eminente' são parônimas: 'iminente' = prestes a acontecer; 'eminente' = ilustre, elevado. 'Perigo iminente' (✓) × 'Perigo eminente' (✗).",
    resposta: "CERTO",
    explicacao:
      "Parônimos = palavras semelhantes na forma, diferentes no significado. 'Iminente' (de 'iminência') = próximo. 'Eminente' (de 'eminência') = destacado. Confusão frequente em provas.",
    dificuldade: 1,
    tags: ["parônimos", "iminente vs eminente", "significação", "homônimos"],
    banca_referencia: "CEBRASPE",
    assunto: "Significação das Palavras",
    ano: 2024,
  },
  {
    id: "port-033",
    disciplina: "PORTUGUES",
    enunciado:
      "A palavra 'ratificar' significa confirmar, validar; 'retificar' significa corrigir, emendar. 'Ratificar o acordo' (✓ confirmar) × 'Retificar o texto' (✓ corrigir).",
    resposta: "CERTO",
    explicacao:
      "Parônimos clássicos: ratificar (de 'rato' = firme) = confirmar; retificar (de 'reto' = corrigir) = emendar. Uso inadequado gera ambiguidade em textos jurídicos e oficiais.",
    dificuldade: 2,
    tags: [
      "parônimos",
      "ratificar vs retificar",
      "significação",
      "precisão lexical",
    ],
    banca_referencia: "FGV",
    assunto: "Significação das Palavras",
    ano: 2023,
  },
  {
    id: "port-034",
    disciplina: "PORTUGUES",
    enunciado:
      "O termo 'descrição' refere-se ao ato de descrever; 'discrição' significa reserva, prudência. 'Fazer a descrição do fato' (✓) × 'Agir com discrição' (✓).",
    resposta: "CERTO",
    explicacao:
      "Homônimos homófonos: mesma pronúncia, grafia e significado diferentes. 'Descrição' (de 'descrever'); 'Discrição' (de 'discreto'). Erro comum em redação oficial.",
    dificuldade: 1,
    tags: ["homônimos", "descrição vs discrição", "significação", "ortografia"],
    banca_referencia: "CEBRASPE",
    assunto: "Significação das Palavras",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 12: REDAÇÃO DE CORRESPONDÊNCIAS OFICIAIS
  // ============================================================
  {
    id: "port-035",
    disciplina: "PORTUGUES",
    enunciado:
      "Conforme o Manual de Redação da Presidência da República, o pronome de tratamento 'Vossa Senhoria' deve ser abreviado como 'V. Sa.' em textos oficiais, e a concordância verbal e nominal deve ser feita na 3ª pessoa.",
    resposta: "CERTO",
    explicacao:
      "Manual de Redação: 'Vossa Senhoria' = V. Sa. (abreviatura). Concordância: sempre na 3ª pessoa ('V. Sa. está convidado', não 'estais'). Tratamento formal impessoal.",
    dificuldade: 1,
    tags: [
      "Manual de Redação",
      "Vossa Senhoria",
      "abreviatura",
      "concordância",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Redação de Correspondências Oficiais",
    ano: 2024,
  },
  {
    id: "port-036",
    disciplina: "PORTUGUES",
    enunciado:
      "Em ofícios, o fecho 'Atenciosamente' é utilizado para autoridades de hierarquia superior, enquanto 'Respeitosamente' é empregado para destinatários de mesma hierarquia ou inferiores.",
    resposta: "ERRADO",
    explicacao:
      "Manual de Redação: 'Atenciosamente' = para autoridades de mesma hierarquia ou inferiores; 'Respeitosamente' = para autoridades superiores. A assertiva inverte a regra.",
    dificuldade: 2,
    tags: [
      "Manual de Redação",
      "fecho",
      "Atenciosamente",
      "Respeitosamente",
      "hierarquia",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "FCC",
    assunto: "Redação de Correspondências Oficiais",
    ano: 2023,
  },
  {
    id: "port-037",
    disciplina: "PORTUGUES",
    enunciado:
      "O uso de expressões como 'venho por meio deste' é considerado vício de linguagem em textos oficiais, devendo ser substituído por formas mais diretas como 'solicito', 'informo' ou 'comunico'.",
    resposta: "CERTO",
    explicacao:
      "Manual de Redação: evita-se prolixidade. 'Venho por meio deste' é redundante (todo ofício é meio de comunicação). Prefira verbos diretos no início: 'Solicito...', 'Informo que...'.",
    dificuldade: 2,
    tags: [
      "Manual de Redação",
      "vícios de linguagem",
      "prolixidade",
      "concisão",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Redação de Correspondências Oficiais",
    ano: 2024,
  },
  {
    id: "port-038",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'o mesmo' como pronome pessoal ('Encaminho o processo para análise e o mesmo será devolvido') é aceita em textos oficiais quando evita repetição desnecessária.",
    resposta: "ERRADO",
    explicacao:
      "Manual de Redação: 'o mesmo' como pronome é vício de estilo (ambiguidade, imprecisão). Substitua por 'ele', 'este', 'aquele' ou reestruture a frase: '...e será devolvido'.",
    dificuldade: 2,
    tags: ["Manual de Redação", "o mesmo", "vício de estilo", "coesão"],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "FGV",
    assunto: "Redação de Correspondências Oficiais",
    ano: 2023,
  },
  {
    id: "port-039",
    disciplina: "PORTUGUES",
    enunciado:
      "Em memorandos, o campo 'Assunto' deve ser redigido de forma clara e sintética, permitindo a identificação imediata do tema, conforme recomendação do Manual de Redação.",
    resposta: "CERTO",
    explicacao:
      "Manual de Redação: 'Assunto' = síntese do conteúdo. Deve permitir triagem e arquivamento eficiente. Evite generalidades ('Diversos') ou frases longas.",
    dificuldade: 1,
    tags: ["Manual de Redação", "memorando", "campo Assunto", "clareza"],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Redação de Correspondências Oficiais",
    ano: 2022,
  },
  {
    id: "port-040",
    disciplina: "PORTUGUES",
    enunciado:
      "A assinatura em documentos digitais oficiais deve ser feita com certificado digital ICP-Brasil, conferindo autenticidade, integridade e não repúdio, nos termos da MP 2.200-2/2001.",
    resposta: "CERTO",
    explicacao:
      "MP 2.200-2/2001 e Lei 14.063/2020: certificado digital ICP-Brasil tem fé pública. Garante autoria (autenticidade), não alteração (integridade) e impossibilidade de negar autoria (não repúdio).",
    dificuldade: 2,
    tags: [
      "assinatura digital",
      "ICP-Brasil",
      "MP 2.200-2/2001",
      "validade jurídica",
    ],
    fonte_legal: ["MP 2.200-2/2001", "Lei 14.063/2020"],
    banca_referencia: "VUNESP",
    assunto: "Redação de Correspondências Oficiais",
    ano: 2024,
  },
];

export const totalQuestoesPortugues = questoesPortugues.length;

export const distribuicaoDificuldadePortugues = {
  1: questoesPortugues.filter((q) => q.dificuldade === 1).length,
  2: questoesPortugues.filter((q) => q.dificuldade === 2).length,
  3: questoesPortugues.filter((q) => q.dificuldade === 3).length,
};
