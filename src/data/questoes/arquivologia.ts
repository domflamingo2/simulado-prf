import { Questao } from "../types";

export const questoesArquivologia: Questao[] = [
  // ============================================================
  // TÓPICO 1: ARQUIVÍSTICA: PRINCÍPIOS E CONCEITOS
  // ============================================================
  {
    id: "arq-001",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O princípio da proveniência estabelece que os documentos produzidos e recebidos por um órgão ou entidade devem ser mantidos sob sua custódia, sem serem misturados com documentos de outras origens.",
    resposta: "CERTO",
    explicacao:
      "Também chamado de princípio do respeito aos fundos, é a base da arquivística moderna e visa preservar o contexto de produção dos documentos.",
    dificuldade: 1,
    tags: ["principio da proveniencia", "respeito aos fundos", "arquivistica"],
    banca_referencia: "CEBRASPE",
    assunto: "Principios e Conceitos",
    ano: 2023,
  },
  {
    id: "arq-002",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O princípio da ordem original determina que a estrutura e a sequência dos documentos devem ser mantidas conforme foram organizadas pela entidade produtora.",
    resposta: "CERTO",
    explicacao:
      "Preserva o contexto administrativo e a funcionalidade do arquivo, evitando reclassificações arbitrárias.",
    dificuldade: 1,
    tags: ["ordem original", "principios arquivisticos"],
    banca_referencia: "FGV",
    assunto: "Principios e Conceitos",
    ano: 2023,
  },
  {
    id: "arq-003",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "Arquivos e bibliotecas possuem a mesma natureza documental, diferenciando-se apenas pelo suporte físico em que a informação é registrada.",
    resposta: "ERRADO",
    explicacao:
      "Arquivos = documentos produzidos/recebidos no exercício de atividades (proveniência, organicidade). Bibliotecas = coleções adquiridas para estudo/pesquisa (artificiais, sem vínculo funcional).",
    dificuldade: 2,
    tags: ["arquivo vs biblioteca", "natureza documental"],
    banca_referencia: "FCC",
    assunto: "Principios e Conceitos",
    ano: 2022,
  },
  {
    id: "arq-004",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O ciclo vital dos documentos é dividido em três idades: corrente, intermediária e permanente, definidas pelo valor e frequência de uso.",
    resposta: "CERTO",
    explicacao:
      "Corrente (em trâmite), Intermediária (uso pouco frequente, aguarda destinação), Permanente (valor histórico/cultural, guarda definitiva).",
    dificuldade: 1,
    tags: [
      "ciclo vital",
      "idades do arquivo",
      "corrente intermediario permanente",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Ciclo Vital dos Documentos",
    ano: 2024,
  },
  {
    id: "arq-005",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O valor secundário dos documentos arquivísticos refere-se à sua utilidade para a administração que os produziu.",
    resposta: "ERRADO",
    explicacao:
      "Valor primário = utilidade administrativa/jurídica/fiscal para a entidade produtora. Valor secundário = interesse para terceiros (histórico, pesquisa, cultural).",
    dificuldade: 2,
    tags: ["valor primario", "valor secundario", "avaliacao documental"],
    banca_referencia: "FGV",
    assunto: "Principios e Conceitos",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 2: GESTÃO DE DOCUMENTOS
  // ============================================================
  {
    id: "arq-006",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A gestão de documentos compreende o planejamento, o controle e a execução das atividades de produção, tramitação, uso, avaliação e arquivamento de documentos.",
    resposta: "CERTO",
    explicacao:
      "Definição CONARQ: visa racionalizar a criação, organização e destinação de documentos em todas as fases do ciclo vital.",
    dificuldade: 1,
    tags: ["gestao de documentos", "CONARQ", "ciclo documental"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestao de Documentos",
    ano: 2023,
  },
  {
    id: "arq-007",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A eliminação de documentos públicos pode ser realizada a qualquer tempo, desde que autorizada pelo gestor imediato da unidade.",
    resposta: "ERRADO",
    explicacao:
      "Eliminação só é permitida após aprovação da tabela de temporalidade por órgão competente (ex: CONARQ, CNJ, CMN) e avaliação formal.",
    dificuldade: 2,
    tags: ["eliminacao de documentos", "tabela de temporalidade", "legalidade"],
    banca_referencia: "FCC",
    assunto: "Gestao de Documentos",
    ano: 2022,
  },
  {
    id: "arq-008",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "Os documentos eletrônicos possuem validade jurídica quando gerados com certificação digital ou outro meio de verificação de autenticidade previsto em lei.",
    resposta: "CERTO",
    explicacao:
      "MP 2.200-2/2001 e Lei 14.063/2020: documentos eletrônicos com ICP-Brasil ou assinaturas válidas têm fé pública e validade jurídica.",
    dificuldade: 2,
    tags: ["documento eletronico", "certificacao digital", "ICP-Brasil"],
    banca_referencia: "FGV",
    assunto: "Gestao de Documentos Eletronico",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 2.1: PROTOCOLO
  // ============================================================
  {
    id: "arq-009",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O protocolo atua na fase corrente dos documentos, sendo responsável pelo recebimento, registro, classificação, distribuição, tramitação e expedição.",
    resposta: "CERTO",
    explicacao:
      "Protocolo é a porta de entrada/saída dos documentos correntes. Não atua nas fases intermediária ou permanente.",
    dificuldade: 1,
    tags: ["protocolo", "fase corrente", "tramitacao"],
    banca_referencia: "CEBRASPE",
    assunto: "Protocolo",
    ano: 2023,
  },
  {
    id: "arq-010",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O registro protocolar é dispensável para documentos internos que não possuem valor jurídico ou financeiro.",
    resposta: "ERRADO",
    explicacao:
      "Todo documento que entra ou sai da organização deve ser registrado para garantir controle, rastreabilidade e transparência.",
    dificuldade: 1,
    tags: ["registro protocolar", "controle documental"],
    banca_referencia: "VUNESP",
    assunto: "Protocolo",
    ano: 2022,
  },
  {
    id: "arq-011",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A distribuição de documentos no protocolo deve ser feita conforme o código de classificação e o plano de destinação da instituição.",
    resposta: "CERTO",
    explicacao:
      "Distribuição correta depende da classificação prévia, encaminhando o documento à unidade/setor competente para providências.",
    dificuldade: 2,
    tags: ["distribuicao", "codigo de classificacao", "protocolo"],
    banca_referencia: "FCC",
    assunto: "Protocolo",
    ano: 2023,
  },
  {
    id: "arq-012",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A expedição de correspondências pelo protocolo envolve a conferência do conteúdo, endereçamento, selagem e registro no sistema de controle.",
    resposta: "CERTO",
    explicacao:
      "Fluxo de saída: revisão → protocolo (registro/carimbo) → postagem/entrega → arquivamento do cópia/registro.",
    dificuldade: 2,
    tags: ["expedicao", "fluxo documental", "protocolo"],
    banca_referencia: "CEBRASPE",
    assunto: "Protocolo",
    ano: 2024,
  },
  {
    id: "arq-013",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O setor de protocolo é responsável pela guarda definitiva de documentos históricos e pela sua microfilmagem.",
    resposta: "ERRADO",
    explicacao:
      "Guarda definitiva e preservação histórica são atribuições do arquivo permanente. Protocolo atua apenas na fase corrente.",
    dificuldade: 2,
    tags: ["protocolo vs arquivo permanente", "fases do arquivo"],
    banca_referencia: "FGV",
    assunto: "Protocolo",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 2.2: CLASSIFICAÇÃO DE DOCUMENTOS DE ARQUIVO
  // ============================================================
  {
    id: "arq-014",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A classificação funcional de documentos organiza a informação por atividades e funções institucionais, e não apenas por assuntos genéricos.",
    resposta: "CERTO",
    explicacao:
      "Recomendação CONARQ: classificação por funções/atividades reflete a estrutura orgânica e facilita a recuperação e a aplicação da tabela de temporalidade.",
    dificuldade: 2,
    tags: ["classificacao funcional", "CONARQ", "atividades institucionais"],
    banca_referencia: "FCC",
    assunto: "Classificacao de Documentos",
    ano: 2023,
  },
  {
    id: "arq-015",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A classificação de segurança dos documentos segue a Lei nº 12.527/2011, dividindo-se em ostensivo, sigiloso, secreto e ultrassecreto.",
    resposta: "ERRADO",
    explicacao:
      "A LAI (12.527/2011) classifica como: Ostensivo (acesso público) e Sigiloso (ultrassecreto, secreto, reservado). 'Sigiloso' não é categoria separada de secreto/ultrassecreto na LAI.",
    dificuldade: 3,
    tags: ["classificacao de seguranca", "LAI", "Lei 12.527/2011"],
    banca_referencia: "FGV",
    assunto: "Classificacao de Documentos",
    ano: 2024,
  },
  {
    id: "arq-016",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O código de classificação é a representação numérica ou alfanumérica dos assuntos ou funções, utilizado para padronizar a organização documental.",
    resposta: "CERTO",
    explicacao:
      "Código = abreviação lógica da estrutura de classificação. Facilita indexação, recuperação e vinculação à tabela de temporalidade.",
    dificuldade: 1,
    tags: ["codigo de classificacao", "padronizacao documental"],
    banca_referencia: "CEBRASPE",
    assunto: "Classificacao de Documentos",
    ano: 2022,
  },
  {
    id: "arq-017",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A classificação de documentos deve ser realizada apenas após o encerramento do processo ou trâmite administrativo.",
    resposta: "ERRADO",
    explicacao:
      "A classificação ocorre no momento da produção ou recebimento, ainda na fase corrente, para orientar trâmite e futura avaliação.",
    dificuldade: 2,
    tags: ["classificacao documental", "momento da classificacao"],
    banca_referencia: "VUNESP",
    assunto: "Classificacao de Documentos",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 2.3: ARQUIVAMENTO E ORDENAÇÃO DE DOCUMENTOS
  // ============================================================
  {
    id: "arq-018",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "Os métodos de arquivamento dividem-se em diretos (busca pelo nome ou código) e indiretos (necessidade de índice auxiliar para localização).",
    resposta: "CERTO",
    explicacao:
      "Direto: busca imediata (ex: alfabético, cronológico). Indireto: requer consulta prévia a um índice (ex: numérico cronológico, duplex, variado).",
    dificuldade: 2,
    tags: ["metodos de arquivamento", "direto e indireto"],
    banca_referencia: "FCC",
    assunto: "Arquivamento e Ordenacao",
    ano: 2023,
  },
  {
    id: "arq-019",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O método alfabético é considerado indireto, pois exige a consulta prévia a um índice para localizar o documento.",
    resposta: "ERRADO",
    explicacao:
      "O alfabético é direto: a ordem das pastas segue a sequência alfabética, permitindo busca imediata sem índice auxiliar.",
    dificuldade: 1,
    tags: ["metodo alfabetico", "arquivamento direto"],
    banca_referencia: "CEBRASPE",
    assunto: "Arquivamento e Ordenacao",
    ano: 2022,
  },
  {
    id: "arq-020",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O método numérico simples utiliza números sequenciais para identificar pastas, sendo um dos métodos mais seguros contra extravios.",
    resposta: "CERTO",
    explicacao:
      "Numeração sequencial evita duplicidades e facilita controle. É indireto se não houver índice nominal associando nome ao número.",
    dificuldade: 2,
    tags: ["metodo numerico simples", "controle documental"],
    banca_referencia: "FGV",
    assunto: "Arquivamento e Ordenacao",
    ano: 2023,
  },
  {
    id: "arq-021",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O método geográfico ordena os documentos por localidade (país, estado, município), sendo ideal para instituições com atuação regionalizada.",
    resposta: "CERTO",
    explicacao:
      "Ordenação por localização física ou administrativa. Útil para filiais, agências ou atendimento por região.",
    dificuldade: 1,
    tags: ["metodo geografico", "ordenacao regional"],
    banca_referencia: "CEBRASPE",
    assunto: "Arquivamento e Ordenacao",
    ano: 2022,
  },
  {
    id: "arq-022",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivamento vertical (pastas em pé) é mais eficiente que o horizontal para recuperação rápida e ocupação otimizada de espaço.",
    resposta: "CERTO",
    explicacao:
      "Padrão moderno de arquivo: pastas suspensas ou caixas em estantes. Evita amassados, facilita visualização e reduz tempo de busca.",
    dificuldade: 1,
    tags: ["arquivamento vertical", "organizacao fisica"],
    banca_referencia: "VUNESP",
    assunto: "Arquivamento e Ordenacao",
    ano: 2023,
  },
  {
    id: "arq-023",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A ordenação cronológica é aplicada dentro de pastas temáticas para manter a sequência temporal de documentos de um mesmo assunto.",
    resposta: "CERTO",
    explicacao:
      "Dentro de cada código/assunto, os documentos são ordenados do mais antigo para o mais recente (ou vice-versa), garantindo lógica processual.",
    dificuldade: 2,
    tags: ["ordenacao cronologica", "organizacao interna de pastas"],
    banca_referencia: "FCC",
    assunto: "Arquivamento e Ordenacao",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 2.4: TABELA DE TEMPORALIDADE DE DOCUMENTOS
  // ============================================================
  {
    id: "arq-024",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A tabela de temporalidade e destinação de documentos (TTD) é o instrumento que define os prazos de guarda nas fases corrente e intermediária e a destinação final.",
    resposta: "CERTO",
    explicacao:
      "Elaborada com base na avaliação documental, a TTD orienta quando eliminar ou recolher ao arquivo permanente.",
    dificuldade: 1,
    tags: ["tabela de temporalidade", "TTD", "avaliacao documental"],
    banca_referencia: "CEBRASPE",
    assunto: "Tabela de Temporalidade",
    ano: 2023,
  },
  {
    id: "arq-025",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O prazo de guarda de um documento começa a contar a partir da data de sua produção ou recebimento pelo órgão.",
    resposta: "ERRADO",
    explicacao:
      "O prazo conta a partir da conclusão do processo, ato ou fato gerador, ou da data de emissão do documento, conforme a TTD.",
    dificuldade: 3,
    tags: ["prazo de guarda", "inico da contagem", "TTD"],
    banca_referencia: "FGV",
    assunto: "Tabela de Temporalidade",
    ano: 2024,
  },
  {
    id: "arq-026",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A destinação final dos documentos pode ser a eliminação ou o recolhimento ao arquivo permanente, conforme o valor atribuído na avaliação.",
    resposta: "CERTO",
    explicacao:
      "Eliminação = valor administrativo/jurídico esgotado. Permanente = valor histórico, científico ou cultural comprovado.",
    dificuldade: 1,
    tags: ["destinacao final", "eliminacao", "arquivo permanente"],
    banca_referencia: "CEBRASPE",
    assunto: "Tabela de Temporalidade",
    ano: 2022,
  },
  {
    id: "arq-027",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A comissão de avaliação de documentos deve ser multidisciplinar e incluir representantes do setor produtor, arquivo e jurídico.",
    resposta: "CERTO",
    explicacao:
      "Avaliação requer visão técnica, administrativa e legal. Resolução CONARQ nº 45/2017 recomenda composição técnica e formal.",
    dificuldade: 2,
    tags: ["comissao de avaliacao", "CONARQ", "gestao documental"],
    banca_referencia: "FCC",
    assunto: "Tabela de Temporalidade",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 3: ACONDICIONAMENTO E ARMAZENAMENTO
  // ============================================================
  {
    id: "arq-028",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O acondicionamento refere-se ao material que envolve o documento (pastas, caixas, envelopes), enquanto o armazenamento refere-se ao local e mobiliário onde são guardados.",
    resposta: "CERTO",
    explicacao:
      "Acondicionamento = proteção individual. Armazenamento = disposição física em estantes, compactadores ou depósitos.",
    dificuldade: 1,
    tags: ["acondicionamento", "armazenamento", "diferencas"],
    banca_referencia: "CEBRASPE",
    assunto: "Acondicionamento e Armazenamento",
    ano: 2023,
  },
  {
    id: "arq-029",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "Para documentos de arquivo, recomenda-se o uso de caixas e pastas com pH ácido para evitar a proliferação de fungos.",
    resposta: "ERRADO",
    explicacao:
      "Materiais devem ser livres de ácidos (pH neutro ou alcalino). Papel ácido acelera a degradação por hidrólise.",
    dificuldade: 2,
    tags: ["materiais de acondicionamento", "pH neutro", "preservacao"],
    banca_referencia: "FGV",
    assunto: "Acondicionamento e Armazenamento",
    ano: 2024,
  },
  {
    id: "arq-030",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "As estantes compactas (móveis) otimizam o espaço físico e são indicadas para acervos intermediários e permanentes com alto volume documental.",
    resposta: "CERTO",
    explicacao:
      "Sistema deslizante sobre trilhos permite aproveitar até 80% mais espaço que estantes fixas, mantendo acesso seguro.",
    dificuldade: 2,
    tags: [
      "estantes compactas",
      "mobiliario arquivistico",
      "otimizacao de espaco",
    ],
    banca_referencia: "VUNESP",
    assunto: "Acondicionamento e Armazenamento",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 4: PRESERVAÇÃO E CONSERVAÇÃO
  // ============================================================
  {
    id: "arq-031",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A conservação preventiva busca evitar a deterioração dos documentos por meio do controle ambiental e de boas práticas de manuseio.",
    resposta: "CERTO",
    explicacao:
      "Estratégia proativa: controle de temperatura, UR, iluminação, pragas e treinamento de pessoal. Mais eficaz e barata que a restauração.",
    dificuldade: 1,
    tags: ["conservacao preventiva", "controle ambiental"],
    banca_referencia: "CEBRASPE",
    assunto: "Preservacao e Conservacao",
    ano: 2023,
  },
  {
    id: "arq-032",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A temperatura e a umidade relativa ideais para guarda de documentos em papel são, respectivamente, 20–22°C e 45–55%.",
    resposta: "CERTO",
    explicacao:
      "Padrão CONARQ e ISO 11799: variações bruscas aceleram degradação. Controle estável é essencial para longevidade.",
    dificuldade: 2,
    tags: ["temperatura", "umidade relativa", "padroes internacionais"],
    banca_referencia: "FCC",
    assunto: "Preservacao e Conservacao",
    ano: 2024,
  },
  {
    id: "arq-033",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A digitalização de documentos é considerada, por si só, uma técnica de preservação, permitindo a eliminação automática dos originais em papel.",
    resposta: "ERRADO",
    explicacao:
      "Digitalização visa principalmente ao acesso e à cópia de segurança. A preservação requer guarda do original + gestão do digital. Eliminação só segue TTD.",
    dificuldade: 3,
    tags: ["digitalizacao", "preservacao vs acesso", "eliminacao"],
    banca_referencia: "FGV",
    assunto: "Preservacao e Conservacao",
    ano: 2024,
  },
  {
    id: "arq-034",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A restauração é uma intervenção curativa, aplicada apenas quando o documento já apresenta danos físicos, devendo ser precedida de estudo técnico.",
    resposta: "CERTO",
    explicacao:
      "Restauração = reparo de danos existentes (limpeza, reforço, desacidificação). É cara, lenta e excepcional. O foco moderno é a prevenção.",
    dificuldade: 2,
    tags: ["restauracao", "intervenção curativa", "preservacao documental"],
    banca_referencia: "CEBRASPE",
    assunto: "Preservacao e Conservacao",
    ano: 2023,
  },
];

export const totalQuestoesArquivologia = questoesArquivologia.length;
