import { Questao } from "../types";

export const questoesArquivologia: Questao[] = [
  {
    id: "arq-001-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivo corrente é composto pelos documentos de tramitação frequente e uso constante no órgão ou entidade de origem, ainda não cumprido o prazo de guarda definido na tabela de temporalidade para transferência ao arquivo intermediário.",
    resposta: "CERTO",
    explicacao:
      "Conceito do ciclo vital dos documentos: arquivo corrente (fase atual, uso frequente) → arquivo intermediário (fase semi-ativa, uso esporádico) → arquivo permanente (fase permanente, valor histórico). O corrente é onde os documentos são produzidos e usados regularmente.",
    dificuldade: 1,
    tags: [
      "arquivo corrente",
      "ciclo vital",
      "temporalidade",
      "tramitação frequente",
      "fase atual",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestão de documentos",
  },
  {
    id: "arq-002-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivo intermediário armazena documentos de baixa frequência de consulta, mas que ainda não podem ser eliminados porque não expirou o prazo de guarda estabelecido na tabela de temporalidade, ou porque aguardam destinação final (eliminação ou permanente).",
    resposta: "CERTO",
    explicacao:
      "Arquivo intermediário (ou semi-ativo): documentos fora do uso corrente, mas que ainda têm valor administrativo, legal ou fiscal. Guarda temporária até a eliminação ou transferência para o arquivo permanente.",
    dificuldade: 1,
    tags: [
      "arquivo intermediário",
      "fase semi-ativa",
      "baixa frequência",
      "guarda temporária",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestão de documentos",
  },
  {
    id: "arq-003-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A eliminação de documentos arquivísticos pode ser feita livremente pelo gestor do órgão público, desde que os documentos estejam fora do prazo de guarda corrente, sem necessidade de observância da tabela de temporalidade aprovada.",
    resposta: "ERRADO",
    explicacao:
      "A eliminação segue estritamente a tabela de temporalidade de documentos de arquivo, aprovada pelo Conselho Nacional de Arquivos (CONARQ) ou órgão de arquivo competente. Não pode ser feita livremente; requer autorização e procedimentos técnicos.",
    dificuldade: 2,
    tags: [
      "eliminação",
      "tabela de temporalidade",
      "CONARQ",
      "destinação",
      "autorização",
    ],
    fonte_legal: ["Lei 8.159/1991", "Resoluções CONARQ"],
    banca_referencia: "CEBRASPE",
    assunto: "Tabela de temporalidade",
  },
  {
    id: "arq-004-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O documento de arquivo é a unidade de registro das informações, produzida e recebida por pessoa física ou jurídica, pública ou privada, no exercício de suas atividades, independentemente do suporte (papel, digital, fotográfico, etc.).",
    resposta: "CERTO",
    explicacao:
      "Conceito amplo de documento de arquivo: unidade de registro de informação, qualquer que seja o suporte. Inclui textuais, cartográficos, fotográficos, audiovisuais, digitais, etc.",
    dificuldade: 1,
    tags: [
      "documento de arquivo",
      "unidade de registro",
      "suporte",
      "informação",
      "conceito",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Arquivística - princípios e conceitos",
  },
  {
    id: "arq-005-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A classificação arquivística é a operação técnica que organiza os documentos segundo sua origem (fundo), natureza (série) e conteúdo, estabelecendo a ordem lógica e sistemática do arquivo.",
    resposta: "CERTO",
    explicacao:
      "Classificação: organização por fundo (proveniência), série (tipo documental), sub-série, unidade de arquivo. Princípio da proveniência: respeitar a origem e o contexto de criação dos documentos.",
    dificuldade: 1,
    tags: ["classificação", "fundo", "série", "proveniência", "ordenação"],
    banca_referencia: "CEBRASPE",
    assunto: "Classificação de documentos de arquivo",
  },
  {
    id: "arq-006-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O prazo de guarda de documentos no arquivo corrente é fixo em 5 (cinco) anos para todos os tipos documentais, após os quais os documentos devem ser transferidos obrigatoriamente para o arquivo intermediário.",
    resposta: "ERRADO",
    explicacao:
      "Não há prazo fixo universal. O prazo de guarda no arquivo corrente varia conforme o tipo documental e é definido na tabela de temporalidade específica de cada órgão (pode ser 1 ano, 2 anos, etc.). Alguns documentos podem ir direto para o permanente.",
    dificuldade: 2,
    tags: [
      "prazo de guarda",
      "arquivo corrente",
      "tabela de temporalidade",
      "transferência",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Tabela de temporalidade",
  },
  {
    id: "arq-007-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivo permanente destina-se à guarda definitiva de documentos com valor histórico, científico, cultural ou probatório permanente, sendo preservado para consulta de pesquisadores e para a memória institucional e social.",
    resposta: "CERTO",
    explicacao:
      "Arquivo permanente: fase final do ciclo vital. Documentos com valor permanente (não podem ser eliminados). Guarda definitiva para memória histórica, pesquisa, prova de direitos.",
    dificuldade: 1,
    tags: [
      "arquivo permanente",
      "guarda definitiva",
      "valor histórico",
      "memória",
      "preservação",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestão de documentos",
  },
  {
    id: "arq-008-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A digitalização de documentos arquivísticos elimina automaticamente a necessidade de preservação do documento original em papel, pois a cópia digital tem o mesmo valor probatório e legal do original.",
    resposta: "ERRADO",
    explicacao:
      "A digitalização não elimina o original, salvo autorização específica do órgão de arquivo competente. Alguns documentos (escrituras, registros públicos, alguns documentos fiscais) precisam do original por força de lei. A Lei 11.419/2006 regulamenta a validade de documentos eletrônicos, mas não elimina automaticamente o papel.",
    dificuldade: 2,
    tags: [
      "digitalização",
      "documento original",
      "preservação",
      "Lei 11.419/2006",
      "valor probatório",
    ],
    fonte_legal: ["Lei 11.419/2006"],
    banca_referencia: "CEBRASPE",
    assunto: "Preservação e conservação",
  },
  {
    id: "arq-009-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O instrumento de pesquisa arquivística que descreve sistematicamente as unidades de arquivo (fundo, série, unidades) é o inventário, enquanto o catálogo é instrumento de descrição bibliográfica, não arquivística.",
    resposta: "CERTO",
    explicacao:
      "Inventário: instrumento de descrição arquivística (níveis: fundo, série, sub-série, unidade). Catálogo: instrumento de descrição bibliográfica (livros, periódicos). São instrumentos distintos para naturezas distintas de documentos.",
    dificuldade: 3,
    tags: [
      "inventário",
      "catálogo",
      "instrumento de pesquisa",
      "descrição arquivística",
      "descrição bibliográfica",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Instrumentos de pesquisa",
  },
  {
    id: "arq-010-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O fundo de arquivo é o conjunto orgânico de documentos produzidos, acumulados e utilizados por uma pessoa física ou jurídica, pública ou privada, no exercício de suas atividades e funções, independentemente do suporte.",
    resposta: "CERTO",
    explicacao:
      "Conceito de fundo (princípio da proveniência): todo conjunto de documentos de mesma origem. É a unidade de classificação principal na arquivística. Ex: Fundo Ministério da Justiça, Fundo Supremo Tribunal Federal.",
    dificuldade: 1,
    tags: [
      "fundo",
      "proveniência",
      "conjunto orgânico",
      "origem",
      "classificação",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Arquivística - princípios e conceitos",
  },
  {
    id: "arq-011-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A avaliação arquivística é o processo técnico que determina o valor dos documentos de arquivo (administrativo, legal, fiscal, histórico, cultural) para definir seu destino: eliminação após prazo ou permanente no arquivo histórico.",
    resposta: "CERTO",
    explicacao:
      "Avaliação = análise do valor documental. Valores: primário (administrativo, legal, fiscal) e secundário (histórico, científico, cultural). Define se o documento será eliminado (após prazo) ou permanecerá (guarda permanente).",
    dificuldade: 2,
    tags: [
      "avaliação",
      "valor documental",
      "destinação",
      "eliminação",
      "permanente",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Avaliação arquivística",
  },
  {
    id: "arq-012-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O Sistema de Gestão Arquivística (SGA) integra as atividades de produção, classificação, avaliação, acondicionamento, preservação e destinação de documentos, abrangendo todo o ciclo vital dos documentos desde sua criação até sua eliminação ou guarda permanente.",
    resposta: "CERTO",
    explicacao:
      "SGA = sistema integrado de gestão de documentos e arquivos. Abrange: produção, tramitação, classificação, avaliação, acondicionamento, conservação, acesso, destinação. É a gestão do ciclo vital completo.",
    dificuldade: 2,
    tags: [
      "SGA",
      "gestão arquivística",
      "ciclo vital",
      "integração",
      "atividades arquivísticas",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Gestão de documentos",
  },
  {
    id: "arq-013-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A descrição arquivística segue normas internacionais como a ISAD(G) (General International Standard Archival Description) para descrição de documentos e a ISAAR(CPF) para descrição de entidades produtoras (pessoas, famílias, entidades coletivas).",
    resposta: "CERTO",
    explicacao:
      "ISAD(G) = padrão internacional de descrição arquivística (níveis hierárquicos: fundo, série, etc.). ISAAR(CPF) = padrão internacional de descrição de entidades produtoras (contexto de criação dos documentos).",
    dificuldade: 3,
    tags: [
      "ISAD(G)",
      "ISAAR(CPF)",
      "normas internacionais",
      "descrição arquivística",
      "descrição contextual",
    ],
    banca_referencia: "FGV",
    assunto: "Descrição arquivística",
  },
  {
    id: "arq-014-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O termo 'arquivo morto', ainda que utilizado coloquialmente, é tecnicamente inadequado, pois sugere documentos sem valor, quando na verdade o arquivo intermediário guarda documentos com valor administrativo temporário, ainda não disponíveis para eliminação.",
    resposta: "CERTO",
    explicacao:
      "'Arquivo morto' é termo antigo e inadequado. O correto é 'arquivo intermediário' (fase semi-ativa). Os documentos não estão 'mortos'; têm valor temporário e podem ser consultados, embora com baixa frequência.",
    dificuldade: 2,
    tags: [
      "arquivo morto",
      "arquivo intermediário",
      "terminologia",
      "fase semi-ativa",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Arquivística - princípios e conceitos",
  },
  {
    id: "arq-015-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A transferência de documentos do arquivo corrente para o intermediário ocorre quando cessa a tramitação frequente (fase corrente) e inicia-se a fase de guarda temporária, aguardando o cumprimento do prazo de guarda para eliminação ou permanente.",
    resposta: "CERTO",
    explicacao:
      "Transferência = mudança de fase arquivística. Corrente → Intermediário: quando o uso não é mais frequente. Intermediário → Permanente ou Eliminação: quando expira o prazo de guarda e é feita a avaliação de valor histórico.",
    dificuldade: 1,
    tags: [
      "transferência",
      "fase arquivística",
      "corrente para intermediário",
      "ciclo vital",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Gestão de documentos",
  },
  {
    id: "arq-016-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O acesso a documentos arquivísticos de livre consulta é um direito garantido pela Lei de Acesso à Informação (Lei 12.527/2011), mas documentos podem ter classificação de sigilo (ultrassecreto, secreto, reservado) quando sua divulgação puder prejudicar a segurança da sociedade ou do Estado.",
    resposta: "CERTO",
    explicacao:
      "LAI: publicidade é regra, sigilo é exceção. Classificações: ultrassecreto (25 anos), secreto (15 anos), reservado (5 anos). Documentos arquivísticos podem ter sigilo, mas a regra é o acesso. O arquivo permanente histórico geralmente tem acesso livre.",
    dificuldade: 1,
    tags: [
      "acesso",
      "LAI",
      "sigilo",
      "classificação",
      "documentos arquivísticos",
    ],
    fonte_legal: ["Lei 12.527/2011", "Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Acesso a documentos",
  },
  {
    id: "arq-017-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "A preservação digital de documentos arquivísticos exige apenas a realização periódica de cópias de segurança (backup) dos arquivos digitais, não sendo necessária a adoção de outros procedimentos como migração, emulação ou manutenção de metadados.",
    resposta: "ERRADO",
    explicacao:
      "Preservação digital é complexa. Além do backup, exige: migração (mudança de formato obsoleto), emulação (reprodução de ambiente antigo), manutenção de metadados (dados sobre dados), verificação de integridade, fixidade de documentos, etc.",
    dificuldade: 2,
    tags: [
      "preservação digital",
      "backup",
      "migração",
      "emulação",
      "metadados",
      "longevidade digital",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Preservação e conservação",
  },
  {
    id: "arq-018-v2",
    disciplina: "ARQUIVOLOGIA",
    enunciado:
      "O arquivo histórico é a instituição que acolhe, organiza, conserva e disponibiliza para pesquisa documentos de valor histórico comprovado, provenientes do arquivo permanente de órgãos públicos ou de doações de particulares.",
    resposta: "CERTO",
    explicacao:
      "Arquivo histórico = instituição de memória (ex: Arquivo Nacional, Arquivos Públicos Estaduais e Municipais). Preserva acervo de valor histórico para a sociedade, pesquisa, cidadania.",
    dificuldade: 1,
    tags: [
      "arquivo histórico",
      "valor histórico",
      "memória",
      "pesquisa",
      "instituição",
    ],
    fonte_legal: ["Lei 8.159/1991"],
    banca_referencia: "CEBRASPE",
    assunto: "Arquivo histórico",
  },
];

export const totalQuestoesArquivologia = questoesArquivologia.length;
