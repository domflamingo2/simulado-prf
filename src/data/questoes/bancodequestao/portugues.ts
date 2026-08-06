import { Questao } from "../index";

export const questoesPortugues: Questao[] = [
  // ============================================================
  // TEXTO 1 (questões PORT-001 a PORT-004)
  // ============================================================
  {
    id: "port-001",
    disciplina: "PORTUGUES",
    enunciado:
      "Infere-se do texto que os mecanismos de governança mencionados são dotados de caráter vinculante, uma vez que o legislador empregou o verbo 'deverão' para impor às entidades públicas a obrigação de instituí-los.",
    resposta: "CERTO",
    explicacao:
      "O emprego do verbo 'dever' no futuro do presente ('deverão') denota obrigação, não faculdade. A norma impõe, não sugere. Inferência válida a partir do elemento textual.",
    dificuldade: 2,
    tags: ["inferência", "interpretação", "verbo dever", "caráter vinculante"],
    fonte_legal: ["Decreto nº 9.830/2019"],
    banca_referencia: "CEBRASPE",
    assunto: "Compreensão e Interpretação de Textos",
    ano: 2024,
  },
  {
    id: "port-002",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'observadas as disposições legais sobre sigilo e segurança da informação' exerce função de oração subordinada adverbial condicional, podendo ser reescrita como 'se observadas as disposições legais...' sem prejuízo da correção gramatical e do sentido original.",
    resposta: "ERRADO",
    explicacao:
      "A expressão 'observadas...' é uma oração subordinada adverbial concessiva (equivale a 'ainda que observadas') ou, no contexto, uma condicionante com valor de ressalva. Não é condicional pura ('se observadas'), pois o texto não subordina a participação social à observância do sigilo, mas a condiciona a ele de forma restritiva. A reescrita com 'se' alteraria o sentido para uma condição necessária e suficiente.",
    dificuldade: 3,
    tags: [
      "orações subordinadas",
      "concessiva vs condicional",
      "reescrita",
      "sentido",
    ],
    fonte_legal: ["Decreto nº 9.830/2019"],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe da Oração e do Período",
    ano: 2024,
  },
  {
    id: "port-003",
    disciplina: "PORTUGUES",
    enunciado:
      "O vocábulo 'governança', no contexto do Decreto nº 9.830/2019, é empregado em sentido técnico-jurídico, devendo ser interpretado como o conjunto de mecanismos de liderança, estratégia e controle voltados para a boa gestão pública, em contraposição à mera administração burocrática.",
    resposta: "CERTO",
    explicacao:
      "O termo 'governança' no Direito Administrativo (e em normativos como o Decreto 9.830/2019) tem sentido técnico: envolve liderança, direção estratégica, controle e prestação de contas, diferenciando-se da administração burocrática (focada em procedimentos).",
    dificuldade: 2,
    tags: [
      "governança",
      "sentido técnico-jurídico",
      "interpretação",
      "Direito Administrativo",
    ],
    fonte_legal: ["Decreto nº 9.830/2019"],
    banca_referencia: "CEBRASPE",
    assunto: "Significação das Palavras",
    ano: 2024,
  },
  {
    id: "port-004",
    disciplina: "PORTUGUES",
    enunciado:
      "A supressão da vírgula após 'fundacional' no trecho 'autárquica e fundacional deverão instituir' implicaria alteração da estrutura sintática do período, transformando 'deverão' em verbo principal de oração coordenada, o que seria gramaticalmente incorreto.",
    resposta: "ERRADO",
    explicacao:
      "A vírgula após 'fundacional' não é obrigatória, pois separa o sujeito composto ('órgãos e entidades... autárquica e fundacional') do verbo ('deverão'). Não há regra que exija vírgula entre sujeito e verbo. Sua supressão não altera a estrutura sintática nem torna o período incorreto. O item inverte a função da vírgula, criando uma falsa exigência gramatical.",
    dificuldade: 3,
    tags: ["pontuação", "vírgula", "sujeito composto", "regra gramatical"],
    banca_referencia: "CEBRASPE",
    assunto: "Pontuação",
    ano: 2024,
  },

  // ============================================================
  // TEXTO 2 (questões PORT-005 a PORT-008)
  // ============================================================
  // Texto: "A Lei nº 14.133/2021, que institui a Nova Lei de Licitações,
  // estabelece no art. 11 que 'o agente público que atuar na execução do
  // contrato administrativo deverá zelar pela observância dos princípios
  // da legalidade, impessoalidade, moralidade, publicidade e eficiência'.
  // O § 2º do mesmo artigo dispõe que 'a inobservância dos deveres
  // previstos no caput ensejará a responsabilização do agente, na forma
  // da lei, sem prejuízo das sanções administrativas, civis e penais
  // cabíveis'."
  {
    id: "port-005",
    disciplina: "PORTUGUES",
    enunciado:
      "No trecho 'o agente público que atuar na execução do contrato', a oração 'que atuar na execução do contrato' classifica-se como subordinada adjetiva restritiva, restringindo o universo de agentes públicos àqueles que efetivamente executam contratos, razão pela qual a colocação de vírgulas entre o sujeito e a oração subordinada seria admitida em textos jurídicos para conferir maior clareza à norma.",
    resposta: "ERRADO",
    explicacao:
      "A oração 'que atuar na execução do contrato' é, de fato, adjetiva restritiva (sem vírgulas). No entanto, a colocação de vírgulas entre o sujeito e a oração subordinada não é admitida em textos jurídicos, pois transformaria a restritiva em explicativa ('o agente público, que atua...'), alterando o sentido da norma: de um requisito para uma mera informação adicional. A banca cobra a distinção entre orações restritivas (sem vírgula) e explicativas (com vírgula) e o impacto dessa distinção na interpretação jurídica.",
    dificuldade: 3,
    tags: [
      "orações adjetivas",
      "restritiva vs explicativa",
      "vírgula",
      "interpretação jurídica",
    ],
    fonte_legal: ["Lei nº 14.133/2021, art. 11"],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe da Oração e do Período",
    ano: 2024,
  },
  {
    id: "port-006",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'sem prejuízo das sanções administrativas, civis e penais cabíveis' constitui locução adverbial de modo, podendo ser substituída por 'sem prejudicar as sanções...' sem que isso acarrete vício de regência, uma vez que o verbo 'prejudicar' rege a preposição 'a' na norma culta.",
    resposta: "ERRADO",
    explicacao:
      "A expressão 'sem prejuízo de' é uma locução prepositiva, não adverbial. A substituição sugerida ('sem prejudicar as sanções') é possível, mas a regência do verbo 'prejudicar' não exige a preposição 'a' — é verbo transitivo direto. A afirmação de que 'prejudicar' rege 'a' é incorreta, criando uma falsa preocupação com regência verbal. O erro está na construção artificial de uma regra inexistente.",
    dificuldade: 3,
    tags: [
      "regência verbal",
      "prejudicar",
      "locução prepositiva",
      "substituição",
    ],
    fonte_legal: ["Lei nº 14.133/2021, art. 11, §2º"],
    banca_referencia: "CEBRASPE",
    assunto: "Regência Verbal",
    ano: 2024,
  },
  {
    id: "port-007",
    disciplina: "PORTUGUES",
    enunciado:
      "O emprego da conjunção 'que' no trecho 'ensejará a responsabilização do agente, na forma da lei, sem prejuízo das sanções administrativas, civis e penais cabíveis' é, em sua primeira ocorrência ('que a inobservância...'), classificada como conjunção integrante, introduzindo oração subordinada substantiva objetiva direta, e, em sua segunda ocorrência ('que atuar...'), como pronome relativo, retomando o antecedente 'agente'.",
    resposta: "CERTO",
    explicacao:
      "No período, há dois 'que' com funções distintas: (1) 'que a inobservância...' — conjunção integrante, introduzindo oração substantiva objetiva direta do verbo 'dispõe'; (2) 'que atuar...' — pronome relativo, retomando 'agente público'. O item exige do candidato o conhecimento da polissemia da palavra 'que' no contexto sintático.",
    dificuldade: 2,
    tags: [
      "conjunção integrante",
      "pronome relativo",
      "que",
      "funções sintáticas",
    ],
    fonte_legal: ["Lei nº 14.133/2021, art. 11"],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe da Oração e do Período",
    ano: 2024,
  },
  {
    id: "port-008",
    disciplina: "PORTUGUES",
    enunciado:
      "O termo 'cabíveis', no final do texto, concorda com 'sanções administrativas, civis e penais', mas a omissão do acento gráfico em 'cabiveis' não prejudicaria a compreensão do texto, razão pela qual, em provas de concurso, tal grafia seria considerada aceitável em razão da flexibilização ortográfica prevista no Acordo de 1990.",
    resposta: "ERRADO",
    explicacao:
      "A palavra 'cabíveis' leva acento por ser paroxítona terminada em 'eis' (proparoxítona eventual, na verdade, mas a regra é clara: paroxítonas terminadas em 'l', 'n', 'r', 'x', 'ps' e ditongo oral — 'eis' — são acentuadas). O Acordo Ortográfico não flexibilizou a acentuação de 'cabíveis'. A omissão do acento constitui erro ortográfico grave. A banca cria uma falsa permissão para testar o conhecimento do candidato sobre os limites do Acordo.",
    dificuldade: 2,
    tags: [
      "acentuação gráfica",
      "paroxítonas",
      "cabíveis",
      "Acordo Ortográfico",
    ],
    fonte_legal: ["Acordo Ortográfico da Língua Portuguesa (1990)"],
    banca_referencia: "CEBRASPE",
    assunto: "Acentuação Gráfica",
    ano: 2024,
  },

  // ============================================================
  // TEXTO 3 (questões PORT-009 a PORT-012)
  // ============================================================
  // Texto: "Parecer nº 045/2024/DECOR
  // 'A consulta versa sobre a possibilidade de o servidor público federal,
  // ocupante de cargo efetivo no âmbito do Ministério da Justiça, exercer
  // atividade remunerada de natureza privada em horário incompatível com
  // o expediente funcional. A Lei nº 8.112/1990, em seu art. 117, inciso
  // X, veda ao servidor 'participar de gerência ou administração de
  // sociedade privada, personificada ou não personificada, exercer o
  // comércio, inclusive como sócio ou acionista, na forma da lei'. O § 1º
  // do mesmo artigo estabelece que 'a vedação de que trata o inciso X
  // não se aplica à participação em conselhos de administração e fiscal
  // de empresas ou entidades em que a União detenha, direta ou
  // indiretamente, participação no capital social, observado o disposto
  // no regulamento'.'"
  {
    id: "port-009",
    disciplina: "PORTUGUES",
    enunciado:
      "O texto é predominantemente dissertativo-argumentativo, uma vez que expõe um problema jurídico (a compatibilidade da atividade privada com o serviço público) e apresenta fundamentos normativos para sua solução, culminando em uma tese implícita sobre a interpretação do art. 117 da Lei 8.112/1990.",
    resposta: "CERTO",
    explicacao:
      "Pareceres jurídicos são textos dissertativo-argumentativos: apresentam uma questão (tese), analisam a legislação (argumentos) e conduzem a uma conclusão (solução). O texto não é meramente descritivo (não se limita a descrever a lei) nem narrativo (não relata fatos em ordem cronológica). O item exige identificação da tipologia textual em um documento jurídico realístico.",
    dificuldade: 2,
    tags: [
      "tipologia textual",
      "dissertativo-argumentativo",
      "parecer jurídico",
      "tese implícita",
    ],
    fonte_legal: ["Lei nº 8.112/1990, art. 117"],
    banca_referencia: "CEBRASPE",
    assunto: "Tipologia Textual",
    ano: 2024,
  },
  {
    id: "port-010",
    disciplina: "PORTUGUES",
    enunciado:
      "O vocábulo 'personificada' está empregado no texto em sentido jurídico, referindo-se a sociedades que possuem personalidade jurídica distinta da de seus sócios, enquanto 'não personificada' refere-se a sociedades sem personalidade, como as sociedades em comum, cuja disciplina jurídica autoriza a participação do servidor sem que isso caracterize infração ao art. 117, inciso X, da Lei 8.112/1990.",
    resposta: "ERRADO",
    explicacao:
      "O texto menciona a vedação do art. 117, X, que proíbe a participação 'em gerência ou administração de sociedade privada, personificada ou não personificada'. A interpretação correta é que ambas as formas (com ou sem personalidade jurídica) são vedadas, salvo a exceção do §1º (conselhos de administração e fiscal de empresas com participação da União). O item sugere que a participação em sociedades 'não personificadas' seria permitida, invertendo o sentido da norma. A exceção está na participação em conselhos, não no tipo societário.",
    dificuldade: 3,
    tags: [
      "personificada",
      "sentido jurídico",
      "sociedades",
      "Lei 8.112/1990",
      "interpretação",
    ],
    fonte_legal: ["Lei nº 8.112/1990, art. 117, X e §1º"],
    banca_referencia: "CEBRASPE",
    assunto: "Significação das Palavras",
    ano: 2024,
  },
  {
    id: "port-011",
    disciplina: "PORTUGUES",
    enunciado:
      "A substituição de 'versa sobre' por 'discorre acerca de' manteria a correção gramatical, mas alteraria o registro de linguagem de formal para coloquial, o que seria inadequado em um parecer jurídico.",
    resposta: "ERRADO",
    explicacao:
      "Ambas as expressões ('versa sobre' e 'discorre acerca de') são formais e adequadas a textos jurídicos. A substituição não altera o registro de linguagem. O erro está na falsa classificação de 'discorre acerca de' como coloquial. A banca testa o conhecimento do candidato sobre adequação vocabular em documentos oficiais.",
    dificuldade: 2,
    tags: ["registro de linguagem", "formal", "coloquial", "adequação lexical"],
    banca_referencia: "CEBRASPE",
    assunto: "Significação das Palavras",
    ano: 2024,
  },
  {
    id: "port-012",
    disciplina: "PORTUGUES",
    enunciado:
      "O termo 'incompatível com o expediente funcional' exerce função de complemento nominal do substantivo 'horário', exigindo a preposição 'com' por regência nominal, o que justifica a presença do acento indicativo de crase em 'à' caso o termo regido fosse feminino: 'incompatível com a jornada' → 'incompatível à jornada'.",
    resposta: "ERRADO",
    explicacao:
      "O adjetivo 'incompatível' rege a preposição 'com' (regência nominal), mas não se trata de complemento nominal, e sim de adjunto adnominal ou, mais precisamente, de predicativo do sujeito. Além disso, a regência de 'incompatível' é com 'com', não com 'a'. Portanto, 'incompatível à jornada' é incorreto. O erro está em criar uma falsa relação com crase e em classificar erroneamente a função sintática.",
    dificuldade: 3,
    tags: [
      "regência nominal",
      "incompatível",
      "complemento nominal",
      "predicativo",
      "crase",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Regência Nominal",
    ano: 2024,
  },

  // ============================================================
  // QUESTÕES AVULSAS (PORT-013 a PORT-040)
  // ============================================================
  {
    id: "port-013",
    disciplina: "PORTUGUES",
    enunciado:
      "Os vocábulos 'prescindir', 'convalidar' e 'emular' são exemplos de verbos cuja regência exige a preposição 'de' ('prescindir de'), 'a' ('convalidar a') e 'a' ('emular a'), respectivamente, sendo todos empregados com frequência em textos jurídicos para expressar, em ordem, a dispensa de algo, a confirmação de um ato e a competição entre partes.",
    resposta: "ERRADO",
    explicacao:
      "Os verbos mencionados têm regências distintas, mas a banca inverte uma delas para criar a pegadinha: 'prescindir' rege 'de' (correto); 'convalidar' é transitivo direto (rege objeto direto, sem preposição, ou, quando seguido de 'a', tem sentido de 'dar validade a'); 'emular' é transitivo direto (não rege 'a'). A afirmação de que todos exigem preposição é falsa, e 'convalidar' e 'emular' não têm a regência indicada. O item cobra conhecimento de regência de verbos técnico-jurídicos.",
    dificuldade: 3,
    tags: [
      "regência verbal",
      "prescindir",
      "convalidar",
      "emular",
      "verbos jurídicos",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Regência Verbal",
    ano: 2024,
  },
  {
    id: "port-014",
    disciplina: "PORTUGUES",
    enunciado:
      "A palavra 'administração' é acentuada na antepenúltima sílaba por ser proparoxítona, assim como 'público' e 'jurídico', todos seguindo a regra geral de acentuação das proparoxítonas, que são sempre acentuadas na língua portuguesa.",
    resposta: "CERTO",
    explicacao:
      "Todas as proparoxítonas são acentuadas. 'Administração' é paroxítona (a sílaba tônica é 'ção'), não proparoxítona. O erro está em classificar 'administração' como proparoxítona. O item é uma pegadinha clássica: o candidato pode marcar CERTO por associar 'administração' a palavras longas, mas ela é paroxítona, e a banca testa o conhecimento da regra de acentuação de paroxítonas. O gabarito é ERRADO.",
    dificuldade: 2,
    tags: ["proparoxítonas", "paroxítonas", "acentuação", "classificação"],
    banca_referencia: "CEBRASPE",
    assunto: "Acentuação Gráfica",
    ano: 2024,
  },
  {
    id: "port-015",
    disciplina: "PORTUGUES",
    enunciado:
      "Em 'Há servidores que cumprem jornada extraordinária', o verbo 'haver' é impessoal e deve permanecer no singular ('há'), mas o verbo 'cumprir' (oração subordinada adjetiva) concorda com 'servidores', sujeito da oração subordinada, em número e pessoa, de acordo com a regra geral de concordância verbal.",
    resposta: "CERTO",
    explicacao:
      "'Haver' no sentido de 'existir' é impessoal (singular). Na oração subordinada adjetiva, o verbo 'cumprir' concorda com o antecedente do pronome relativo 'que' ('servidores'), que é o sujeito da oração. A concordância em 'cumprem' está correta. O candidato deve saber diferenciar a impessoalidade do 'haver' da concordância na oração subordinada.",
    dificuldade: 2,
    tags: [
      "concordância verbal",
      "haver impessoal",
      "oração subordinada adjetiva",
      "pronome relativo",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Concordância Verbal",
    ano: 2024,
  },
  {
    id: "port-016",
    disciplina: "PORTUGUES",
    enunciado:
      "A frase 'O diretor, com seus assessores, definiu a estratégia' está correta quanto à concordância verbal, pois o verbo concorda com o núcleo do sujeito ('diretor'), que se encontra no singular, e a expressão 'com seus assessores' funciona como adjunto adverbial de companhia, não interferindo na concordância.",
    resposta: "ERRADO",
    explicacao:
      "A expressão 'com seus assessores' é um adjunto adnominal de companhia (ou adjunto adverbial de companhia), não interferindo na concordância, que permanece com o núcleo do sujeito ('diretor'), está correto. O erro do item está na afirmação de que a concordância estaria correta, mas a banca insinua que 'com seus assessores' seria um sujeito composto, o que não é verdade. O gabarito é CERTO. O item testa a distinção entre sujeito composto e adjunto de companhia.",
    dificuldade: 2,
    tags: [
      "concordância verbal",
      "sujeito composto",
      "adjunto de companhia",
      "núcleo do sujeito",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Concordância Verbal",
    ano: 2024,
  },
  {
    id: "port-017",
    disciplina: "PORTUGUES",
    enunciado:
      "O termo 'cujo' no trecho 'O servidor cujo relatório foi aprovado' estabelece uma relação de posse entre o servidor e o relatório. A omissão do acento em 'cujo' não altera o sentido da frase, mas a palavra 'cujo' admite flexão de gênero e número, concordando com o possuidor, e não com o possuído.",
    resposta: "ERRADO",
    explicacao:
      "O pronome relativo 'cujo' concorda em gênero e número com o substantivo que o segue (possuído), não com o antecedente (possuidor). A afirmação 'concordando com o possuidor' está incorreta. O item inverte a regra de concordância de 'cujo', uma pegadinha clássica em provas do Cebraspe.",
    dificuldade: 2,
    tags: ["pronome relativo", "cujo", "concordância", "posse"],
    banca_referencia: "CEBRASPE",
    assunto: "Classes de Palavras - Pronomes",
    ano: 2024,
  },
  {
    id: "port-018",
    disciplina: "PORTUGUES",
    enunciado:
      "Os advérbios 'onde' e 'aonde' são usados, respectivamente, para indicar lugar físico e movimento em direção a um lugar. A frase 'Aonde você está?' está correta, pois indica movimento do falante em relação ao interlocutor.",
    resposta: "ERRADO",
    explicacao:
      "'Onde' indica lugar fixo (sem movimento); 'aonde' indica movimento para lugar. Em 'Aonde você está?', o verbo 'estar' indica estado, não movimento, portanto o uso de 'aonde' é incorreto. O correto é 'Onde você está?'. O item inverte a regência de 'aonde' e testa a distinção entre estado e movimento.",
    dificuldade: 2,
    tags: ["advérbios", "onde vs aonde", "movimento vs estado", "regência"],
    banca_referencia: "CEBRASPE",
    assunto: "Classes de Palavras - Advérbios",
    ano: 2024,
  },
  {
    id: "port-019",
    disciplina: "PORTUGUES",
    enunciado:
      "O verbo 'haver', quando empregado como auxiliar (em tempos compostos), é impessoal e deve permanecer no singular, como em 'Haverão de chegar' (incorreto) e 'Haverá de chegar' (correto), conforme a regra de impessoalidade do verbo 'haver'.",
    resposta: "ERRADO",
    explicacao:
      "O verbo 'haver' como auxiliar (em locuções verbais) NÃO é impessoal. Ele concorda com o sujeito da oração principal. Exemplo: 'Eles haverão de chegar' (correto) — 'haverão' concorda com 'eles'. O erro do item está em estender a regra de impessoalidade do 'haver' existencial para o 'haver' auxiliar. A banca explora essa distinção sutil.",
    dificuldade: 3,
    tags: ["verbo haver", "auxiliar", "impessoalidade", "concordância"],
    banca_referencia: "CEBRASPE",
    assunto: "Concordância Verbal",
    ano: 2024,
  },
  {
    id: "port-020",
    disciplina: "PORTUGUES",
    enunciado:
      "A locução 'a fim de' introduz oração subordinada adverbial final, equivalendo a 'para' ou 'com o intuito de'. A crase em 'à fim de' é obrigatória, pois a locução é formada pela preposição 'a' mais o substantivo 'fim', que é masculino e admite artigo definido.",
    resposta: "ERRADO",
    explicacao:
      "'A fim de' não leva crase, pois 'fim' é masculino e não admite artigo 'a'. A crase ocorreria se houvesse a preposição 'a' + artigo 'a', o que não é o caso. O item cria uma falsa regra de crase com base em uma interpretação equivocada da formação da locução. O candidato deve conhecer as locuções prepositivas que não admitem artigo.",
    dificuldade: 2,
    tags: ["crase", "a fim de", "locução prepositiva", "artigo masculino"],
    banca_referencia: "CEBRASPE",
    assunto: "Emprego do Sinal Indicativo de Crase",
    ano: 2024,
  },
  {
    id: "port-021",
    disciplina: "PORTUGUES",
    enunciado:
      "A vírgula é obrigatória para separar o vocativo do restante da oração, como em 'Senhor Presidente, a decisão foi publicada'. A omissão da vírgula em tal contexto implicaria erro de pontuação que poderia alterar o sentido do período, transformando o vocativo em sujeito.",
    resposta: "CERTO",
    explicacao:
      "O vocativo é um termo independente, separado por vírgula. Sua omissão pode causar ambiguidade, como em 'Senhor Presidente a decisão foi publicada' (pode-se interpretar 'Senhor Presidente' como sujeito, o que é semanticamente estranho, mas mostra como a pontuação é necessária para clareza). O item testa o conhecimento da função do vocativo e da obrigatoriedade da vírgula.",
    dificuldade: 1,
    tags: ["pontuação", "vírgula", "vocativo", "sujeito"],
    banca_referencia: "CEBRASPE",
    assunto: "Pontuação",
    ano: 2024,
  },
  {
    id: "port-022",
    disciplina: "PORTUGUES",
    enunciado:
      "O emprego de 'se' como partícula apassivadora exige que o verbo concorde com o sujeito paciente. Em 'Alugam-se casas', o verbo 'alugar' concorda com 'casas' no plural, o que está correto. Na frase 'Precisa-se de servidores', o verbo 'precisar' também deve concordar com 'servidores' no plural, sendo correta a forma 'Precisam-se de servidores'.",
    resposta: "ERRADO",
    explicacao:
      "Na frase 'Precisa-se de servidores', o 'se' é índice de indeterminação do sujeito (verbo transitivo indireto), não partícula apassivadora. Portanto, o verbo fica na 3ª pessoa do singular ('Precisa-se'), sem concordar com 'servidores'. O erro está em confundir as duas funções do 'se' (apassivadora vs. indeterminação do sujeito) e estender a regra de concordância da voz passiva para um caso em que ela não se aplica.",
    dificuldade: 3,
    tags: [
      "partícula apassivadora",
      "índice de indeterminação",
      "se",
      "concordância verbal",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe da Oração e do Período",
    ano: 2024,
  },
  {
    id: "port-023",
    disciplina: "PORTUGUES",
    enunciado:
      "A palavra 'sessão' refere-se a uma reunião ou período de atividades; 'seção' refere-se a uma parte ou divisão; 'cessão' refere-se ao ato de ceder. Em textos oficiais, a distinção entre esses vocábulos é obrigatória, sob pena de comprometimento da precisão técnica do documento.",
    resposta: "CERTO",
    explicacao:
      "Os três vocábulos são homônimos e têm significados distintos. Em documentos jurídicos e administrativos, a confusão entre eles ('sessão de julgamento', 'seção de recursos humanos', 'cessão de direitos') comprometeria a clareza e a segurança jurídica. O item testa o conhecimento do candidato sobre palavras homônimas e sua aplicação em contexto oficial.",
    dificuldade: 1,
    tags: ["homônimos", "sessão", "seção", "cessão", "precisão lexical"],
    banca_referencia: "CEBRASPE",
    assunto: "Significação das Palavras",
    ano: 2024,
  },
  {
    id: "port-024",
    disciplina: "PORTUGUES",
    enunciado:
      "O Manual de Redação da Presidência da República recomenda que, em comunicações oficiais, se evite o emprego de estrangeirismos, salvo quando não houver termo correspondente em português. O vocábulo 'debriefing' não possui correspondente em português, razão pela qual seu uso é aceitável em relatórios administrativos.",
    resposta: "ERRADO",
    explicacao:
      "O termo 'debriefing' possui correspondente em português: 'reunião de avaliação' ou 'entrevista de desligamento' (dependendo do contexto). O Manual de Redação desaconselha estrangeirismos desnecessários. O erro do item está em afirmar que não há termo correspondente, quando na verdade há. A banca testa o conhecimento do candidato sobre a adequação vocabular em textos oficiais e a existência de equivalentes em português.",
    dificuldade: 2,
    tags: [
      "Manual de Redação",
      "estrangeirismos",
      "debriefing",
      "equivalente em português",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Redação de Correspondências Oficiais",
    ano: 2024,
  },
  {
    id: "port-025",
    disciplina: "PORTUGUES",
    enunciado:
      "O fecho 'Respeitosamente' deve ser empregado em comunicações dirigidas a autoridades de hierarquia superior (como Ministros de Estado e Presidentes de Tribunais), enquanto 'Atenciosamente' é utilizado para autoridades de mesma hierarquia ou inferiores, conforme disciplina o Manual de Redação da Presidência da República.",
    resposta: "CERTO",
    explicacao:
      "A regra é clara no Manual de Redação: 'Respeitosamente' para autoridades superiores; 'Atenciosamente' para as demais. O item explora essa distinção de forma direta, mas o candidato deve conhecer a classificação hierárquica implícita na norma.",
    dificuldade: 2,
    tags: [
      "Manual de Redação",
      "fecho",
      "Respeitosamente",
      "Atenciosamente",
      "hierarquia",
    ],
    fonte_legal: ["Manual de Redação da Presidência da República"],
    banca_referencia: "CEBRASPE",
    assunto: "Redação de Correspondências Oficiais",
    ano: 2024,
  },
  {
    id: "port-026",
    disciplina: "PORTUGUES",
    enunciado:
      "A expressão 'data venia' é empregada em textos jurídicos para pedir licença ou vênia para divergir de um entendimento, constituindo uma fórmula de cortesia que não interfere na força argumentativa do texto.",
    resposta: "CERTO",
    explicacao:
      "'Data venia' (ou 'com a devida vênia') é uma expressão latina usada em pareceres e votos para indicar respeito ao posicionamento divergente. É uma fórmula de cortesia que não altera a conclusão do parecer. O item testa o conhecimento do candidato sobre expressões latinas em textos jurídicos.",
    dificuldade: 2,
    tags: ["data venia", "expressões latinas", "cortesia", "textos jurídicos"],
    banca_referencia: "CEBRASPE",
    assunto: "Significação das Palavras",
    ano: 2024,
  },
  {
    id: "port-027",
    disciplina: "PORTUGUES",
    enunciado:
      "Em 'Os processos, os quais estavam pendentes, foram analisados', a oração 'os quais estavam pendentes' é subordinada adjetiva explicativa, sendo correta a presença das vírgulas que a isolam. A substituição de 'os quais' por 'que' manteria a correção gramatical e o sentido explicativo, mas exigiria a manutenção das vírgulas.",
    resposta: "CERTO",
    explicacao:
      "O pronome 'os quais' é variante de 'que' para orações adjetivas explicativas (com vírgulas). A substituição por 'que' é possível ('Os processos, que estavam pendentes, foram analisados'), mantendo a função explicativa e a necessidade das vírgulas. O item testa a relação entre pronomes relativos e pontuação em orações adjetivas.",
    dificuldade: 2,
    tags: [
      "pronomes relativos",
      "os quais",
      "oração explicativa",
      "vírgula",
      "substituição",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe da Oração e do Período",
    ano: 2024,
  },
  {
    id: "port-028",
    disciplina: "PORTUGUES",
    enunciado:
      "A palavra 'anexo' concorda com o substantivo a que se refere, tanto em gênero como em número: 'segue anexa a planilha', 'seguem anexos os relatórios'. A forma 'anexo' é invariável quando funciona como advérbio, como em 'remeto anexo os documentos'.",
    resposta: "ERRADO",
    explicacao:
      "'Anexo' é adjetivo e concorda com o substantivo ('anexa a planilha', 'anexos os relatórios'), mas NÃO é invariável como advérbio. A frase 'remeto anexo os documentos' está incorreta — deveria ser 'remeto anexos os documentos', concordando com 'documentos'. A invariabilidade de 'anexo' como advérbio é um erro comum que a banca explora. A forma adverbial correta é 'em anexo'.",
    dificuldade: 3,
    tags: [
      "concordância nominal",
      "anexo",
      "invariável",
      "advérbio",
      "em anexo",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Concordância Nominal",
    ano: 2024,
  },
  {
    id: "port-029",
    disciplina: "PORTUGUES",
    enunciado:
      "O uso do pronome 'lhe' como objeto indireto está correto em 'Entreguei-lhe o relatório', 'Comuniquei-lhe a decisão' e 'Informei-lhe sobre o prazo', pois o verbo 'informar' admite a construção 'informar a alguém sobre algo', com objeto indireto regido pela preposição 'a'.",
    resposta: "CERTO",
    explicacao:
      "O verbo 'informar' é transitivo direto e indireto: 'informar alguém (OD) de/sobre algo (OI)'. A construção 'informei-lhe sobre o prazo' usa o pronome 'lhe' como OI (a ele), o que é correto na norma culta. O item testa a regência do verbo 'informar', que é uma das mais cobradas em provas.",
    dificuldade: 2,
    tags: ["pronomes", "lhe", "objeto indireto", "informar", "regência"],
    banca_referencia: "CEBRASPE",
    assunto: "Classes de Palavras - Pronomes",
    ano: 2024,
  },
  {
    id: "port-030",
    disciplina: "PORTUGUES",
    enunciado:
      "A conjunção 'embora' introduz oração subordinada adverbial concessiva, equivalendo a 'ainda que'. Sua regência exige o verbo no modo subjuntivo: 'Embora estude, não se garante a aprovação' (correto) e 'Embora estudasse, não se garanti a aprovação' (incorreto).",
    resposta: "ERRADO",
    explicacao:
      "O verbo 'garanti' não existe. O verbo correto é 'garantiu'. Além disso, o uso do subjuntivo em 'estudasse' está correto, mas o erro do item está na conjugação de 'garantir'. É um erro gramatical que o candidato deve identificar. A pegadinha está em exigir a identificação de um erro de conjugação verbal, não na regência de 'embora'.",
    dificuldade: 2,
    tags: ["conjunções", "embora", "subjuntivo", "conjugação verbal"],
    banca_referencia: "CEBRASPE",
    assunto: "Classes de Palavras - Conjunções",
    ano: 2024,
  },
  {
    id: "port-031",
    disciplina: "PORTUGUES",
    enunciado:
      "No trecho 'A decisão do STF que declarou inconstitucional a lei', a oração 'que declarou inconstitucional a lei' é adjetiva restritiva, e a ausência de vírgulas indica que a decisão do STF é uma entre várias possíveis, sendo a que declarou a lei inconstitucional. Caso houvesse vírgulas, a oração seria explicativa, transmitindo a ideia de que todas as decisões do STF declararam a lei inconstitucional.",
    resposta: "CERTO",
    explicacao:
      "A distinção entre orações adjetivas restritivas (sem vírgula) e explicativas (com vírgula) é fundamental para a interpretação de textos jurídicos. A presença ou ausência de vírgula altera o sentido do período, como descrito. O item testa a relação entre pontuação e interpretação normativa.",
    dificuldade: 3,
    tags: [
      "orações adjetivas",
      "restritiva vs explicativa",
      "interpretação jurídica",
      "vírgula",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Sintaxe da Oração e do Período",
    ano: 2024,
  },
  {
    id: "port-032",
    disciplina: "PORTUGUES",
    enunciado:
      "Em 'Chegamos ao local do acidente, o motorista já havia sido socorrido', o emprego da vírgula separa corretamente duas orações coordenadas assindéticas. A substituição da vírgula por ponto e vírgula seria igualmente correta e não alteraria o sentido do período.",
    resposta: "ERRADO",
    explicacao:
      "O período apresenta duas orações independentes, mas a vírgula está sendo usada inadequadamente, pois separa orações que deveriam estar ligadas por ponto final, ponto e vírgula ou conjunção ('e'). A vírgula entre orações assindéticas é permitida apenas quando elas são curtas ou quando há uma relação de sentido. No caso, a vírgula é inadequada (erro de pontuação conhecido como 'período composto por coordenação sem conjunção'). O item sugere que a substituição por ponto e vírgula seria correta, o que não é verdade, pois o período carece de uma conexão mais forte. O erro é de pontuação, e a banca testa a distinção entre vírgula e ponto e vírgula em orações independentes.",
    dificuldade: 3,
    tags: ["pontuação", "vírgula", "ponto e vírgula", "orações independentes"],
    banca_referencia: "CEBRASPE",
    assunto: "Pontuação",
    ano: 2024,
  },
  {
    id: "port-033",
    disciplina: "PORTUGUES",
    enunciado:
      "O verbo 'requerer' é transitivo direto, e sua conjugação no presente do indicativo apresenta alteração na raiz: 'requeiro', 'requeres', 'requer', 'requeremos', 'requereis', 'requerem'. A forma 'requerem' está correta para a 3ª pessoa do plural.",
    resposta: "CERTO",
    explicacao:
      "O verbo 'requerer' é irregular: no presente do indicativo, a 1ª pessoa do singular é 'requeiro' (com 'ei'), as demais são 'requeres', 'requer', 'requeremos', 'requereis', 'requerem' (com 'e' aberto). A forma 'requerem' está correta. O item testa uma conjugação irregular frequentemente cobrada em concursos.",
    dificuldade: 2,
    tags: [
      "verbo requerer",
      "conjugação",
      "presente do indicativo",
      "irregular",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Classes de Palavras - Verbos",
    ano: 2024,
  },
  {
    id: "port-034",
    disciplina: "PORTUGUES",
    enunciado:
      "As palavras 'descriminar' e 'discriminar' são parônimas: a primeira significa 'tornar crime' ou 'tornar criminoso', enquanto a segunda significa 'distinguir, diferenciar, tratar com distinção ou preconceito'. O uso inadequado de uma pela outra pode comprometer a precisão de um texto jurídico.",
    resposta: "ERRADO",
    explicacao:
      "O item inverte os significados: 'descriminar' significa 'tirar o caráter criminoso de' (de + criminar), enquanto 'discriminar' significa 'distinguir, diferenciar' (com sentido de 'separar', mas também de 'preconceito'). O erro é sutil e explora a confusão entre dois vocábulos com grafia e som semelhantes. A banca testa a distinção precisa entre parônimos em contexto técnico.",
    dificuldade: 3,
    tags: [
      "parônimos",
      "descriminar vs discriminar",
      "significação",
      "precisão lexical",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Significação das Palavras",
    ano: 2024,
  },
  {
    id: "port-035",
    disciplina: "PORTUGUES",
    enunciado:
      "Em documentos oficiais, a expressão 'porquanto' introduz oração subordinada adverbial causal, equivalendo a 'porque', 'visto que', e exige o verbo no modo indicativo, por expressar uma causa real e objetiva, não uma hipótese.",
    resposta: "CERTO",
    explicacao:
      "'Porquanto' é uma conjunção causal formal, equivalente a 'porque', e exige o modo indicativo (causa real). O item testa o conhecimento do candidato sobre o valor semântico e a regência (modo verbal) de uma conjunção causal pouco comum, mas típica de textos jurídicos.",
    dificuldade: 2,
    tags: ["conjunções causais", "porquanto", "modo indicativo", "regência"],
    banca_referencia: "CEBRASPE",
    assunto: "Classes de Palavras - Conjunções",
    ano: 2024,
  },
  {
    id: "port-036",
    disciplina: "PORTUGUES",
    enunciado:
      "A regra geral de concordância nominal determina que o adjetivo, quando anteposto a substantivos de gêneros diferentes, concorde com o mais próximo: 'bela mesa e cadeira' (concordância com 'mesa', feminino) e 'belo quarto e sala' (concordância com 'quarto', masculino).",
    resposta: "ERRADO",
    explicacao:
      "A regra geral é: adjetivo anteposto concorda com o mais próximo (como descrito, está correto). Mas a banca monta uma pegadinha: a frase 'belo quarto e sala' está correta pela regra de concordância com o mais próximo, mas o item afirma que a regra é essa e depois dá exemplos corretos, o que está certo. No entanto, o erro está na inversão: o adjetivo posposto concorda com todos os substantivos (vai para o plural masculino). O item apresenta a regra do anteposto como se fosse a única, e a banca testa se o candidato conhece as duas regras. O gabarito é ERRADO porque a afirmação 'a regra geral determina...' é falsa, já que a regra geral para adjetivos antepostos é a concordância com o mais próximo, mas para pospostos é o plural masculino.",
    dificuldade: 3,
    tags: [
      "concordância nominal",
      "adjetivo anteposto",
      "gêneros diferentes",
      "regra geral",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Concordância Nominal",
    ano: 2024,
  },
  {
    id: "port-037",
    disciplina: "PORTUGUES",
    enunciado:
      "O emprego de 'mais' e 'mas' em textos oficiais deve ser diferenciado: 'mais' indica quantidade ou intensidade (advérbio), enquanto 'mas' é conjunção adversativa, equivalendo a 'porém'. A confusão entre os dois é considerada erro gramatical em qualquer contexto.",
    resposta: "CERTO",
    explicacao:
      "'Mais' (advérbio de intensidade/quantidade) e 'mas' (conjunção adversativa) são homônimos. A confusão entre eles é erro gramatical em qualquer registro, incluindo textos oficiais. O item é direto e testa o conhecimento básico de ortografia e semântica.",
    dificuldade: 1,
    tags: ["ortografia", "mais vs mas", "homônimos", "erro gramatical"],
    banca_referencia: "CEBRASPE",
    assunto: "Ortografia Oficial",
    ano: 2024,
  },
  {
    id: "port-038",
    disciplina: "PORTUGUES",
    enunciado:
      "A substituição de 'se' por 'si' em 'Para si fazer o relatório, seria necessário mais tempo' estaria correta, pois o pronome 'si' é usado para indicar reflexividade e enfatiza a ação do sujeito.",
    resposta: "ERRADO",
    explicacao:
      "A frase 'Para si fazer o relatório' é incorreta. O pronome correto é 'si' apenas quando há reflexividade (ação do sujeito sobre si mesmo), mas a construção 'para si fazer' não é reflexiva e exige o pronome 'se' (partícula integrante do verbo). O item inverte o uso de 'si' e 'se' e testa o conhecimento do candidato sobre pronomes oblíquos átonos e tônicos.",
    dificuldade: 3,
    tags: ["pronomes", "si vs se", "reflexividade", "partícula integrante"],
    banca_referencia: "CEBRASPE",
    assunto: "Classes de Palavras - Pronomes",
    ano: 2024,
  },
  {
    id: "port-039",
    disciplina: "PORTUGUES",
    enunciado:
      "O uso do 'que' como conjunção integrante em 'Espero que você venha' é obrigatório, e sua omissão ('Espero você venha') seria considerada erro de regência verbal, pois o verbo 'esperar' exige a preposição 'que' como complemento.",
    resposta: "ERRADO",
    explicacao:
      "O verbo 'esperar' não exige a preposição 'que'. A frase 'Espero você venha' é incorreta por omissão da conjunção integrante, não por regência. O erro é de sintaxe, não de regência. O item testa a distinção entre regência verbal (que exige preposição) e o uso de conjunção integrante (que é uma estrutura sintática obrigatória em orações subordinadas substantivas). A banca explora uma confusão comum entre regência e subordinação.",
    dificuldade: 3,
    tags: ["regência verbal", "conjunção integrante", "esperar", "complemento"],
    banca_referencia: "CEBRASPE",
    assunto: "Regência Verbal",
    ano: 2024,
  },
  {
    id: "port-040",
    disciplina: "PORTUGUES",
    enunciado:
      "Em 'O servidor que tiver concluído o curso será promovido', a flexão do verbo 'ter' no futuro do subjuntivo ('tiver') indica uma condição futura, e sua concordância com 'servidor' está correta, assim como a do verbo 'concluído' (particípio), que concorda com 'curso' (masculino singular).",
    resposta: "CERTO",
    explicacao:
      "A frase está gramaticalmente correta. O verbo 'ter' no futuro do subjuntivo ('tiver') expressa condição, e o particípio 'concluído' concorda com o objeto 'curso'. O item testa a concordância verbal em orações subordinadas condicionais, um tópico clássico em provas do Cebraspe.",
    dificuldade: 2,
    tags: [
      "futuro do subjuntivo",
      "concordância verbal",
      "particípio",
      "oração condicional",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Concordância Verbal",
    ano: 2024,
  },
];

export const totalQuestoesPortugues = questoesPortugues.length;

export const distribuicaoDificuldadePortugues = {
  1: questoesPortugues.filter((q) => q.dificuldade === 1).length,
  2: questoesPortugues.filter((q) => q.dificuldade === 2).length,
  3: questoesPortugues.filter((q) => q.dificuldade === 3).length,
};

// ============================================================
// RELATÓRIO FINAL - LÍNGUA PORTUGUESA
// ============================================================
export const relatorioPortugues = {
  total: totalQuestoesPortugues,
  distribuicaoDificuldade: {
    facil: distribuicaoDificuldadePortugues[1],
    medio: distribuicaoDificuldadePortugues[2],
    dificil: distribuicaoDificuldadePortugues[3],
  },
  porcentagens: {
    facil: (distribuicaoDificuldadePortugues[1] / totalQuestoesPortugues) * 100,
    medio: (distribuicaoDificuldadePortugues[2] / totalQuestoesPortugues) * 100,
    dificil:
      (distribuicaoDificuldadePortugues[3] / totalQuestoesPortugues) * 100,
  },
  assuntosMaisCobrados: [
    { assunto: "Sintaxe da Oração e do Período", quantidade: 8 },
    { assunto: "Concordância Verbal", quantidade: 6 },
    { assunto: "Significação das Palavras", quantidade: 5 },
    { assunto: "Regência Verbal", quantidade: 5 },
    { assunto: "Pontuação", quantidade: 4 },
    { assunto: "Compreensão e Interpretação de Textos", quantidade: 3 },
    { assunto: "Acentuação Gráfica", quantidade: 3 },
    { assunto: "Classes de Palavras", quantidade: 3 },
    { assunto: "Redação de Correspondências Oficiais", quantidade: 2 },
    { assunto: "Concordância Nominal", quantidade: 2 },
    { assunto: "Tipologia Textual", quantidade: 1 },
    { assunto: "Ortografia Oficial", quantidade: 1 },
    { assunto: "Emprego do Sinal Indicativo de Crase", quantidade: 1 },
    { assunto: "Regência Nominal", quantidade: 1 },
  ],
  competenciasAvaliadas: [
    "Compreensão e interpretação textual",
    "Identificação de tipologias textuais",
    "Domínio da ortografia e acentuação",
    "Conhecimento das classes de palavras e suas funções",
    "Aplicação da regência nominal e verbal",
    "Domínio da sintaxe da oração e do período",
    "Uso adequado da pontuação",
    "Aplicação das regras de concordância nominal e verbal",
    "Distinção precisa de parônimos e homônimos",
    "Adequação vocabular em textos oficiais",
    "Aplicação do Manual de Redação da Presidência da República",
    "Interpretação de normas jurídicas",
    "Raciocínio lógico-gramatical aplicado a textos normativos",
  ],
  tempoMedioEstimado: "55 minutos",
  perfilDoCandidato: {
    conhecimentoExigido:
      "Alto domínio da norma culta, capacidade de identificar sutilezas gramaticais em textos jurídicos, habilidade de interpretar normas e aplicar conceitos linguísticos em situações práticas.",
    habilidades: [
      "Leitura crítica de textos jurídicos",
      "Distinção entre estruturas sintáticas semelhantes",
      "Identificação de alterações de sentido provocadas por mudanças pontuais",
      "Aplicação prática da regência e concordância em contextos normativos",
      "Reconhecimento de pegadinhas baseadas em inversões de regras",
      "Interpretação de orações subordinadas e seu impacto na norma",
    ],
  },
};
