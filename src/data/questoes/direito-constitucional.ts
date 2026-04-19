import { Questao } from "../types";

export const questoesDireitoConstitucional: Questao[] = [
  // ============================================================
  // TÓPICO 1: CONSTITUIÇÃO: CONCEITO, CLASSIFICAÇÕES, PRINCÍPIOS
  // ============================================================
  {
    id: "const-001",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A Constituição Federal de 1988 é classificada, quanto à forma, como escrita; quanto ao conteúdo, como dogmática; quanto à rigidez, como rígida; e quanto à origem, como promulgada.",
    resposta: "CERTO",
    explicacao:
      "CF/88 foi elaborada por Assembleia Constituinte (promulgada), codificada em texto único (escrita), baseada em dogmas políticos (dogmática) e exige quórum qualificado para alteração (rígida).",
    dificuldade: 1,
    tags: ["classificação constitucional", "teoria da constituição"],
    fonte_legal: ["Doutrina clássica"],
    banca_referencia: "CEBRASPE",
    assunto: "Classificação da Constituição",
    ano: 2023,
  },
  {
    id: "const-002",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "Os objetivos fundamentais da República Federativa do Brasil, previstos no art. 3º da CF/88, possuem natureza programática e orientam a atuação estatal para a construção de uma sociedade livre, justa e solidária.",
    resposta: "CERTO",
    explicacao:
      "Art. 3º (objetivos) difere do Art. 1º (fundamentos). Os objetivos são metas a serem alcançadas pelo Estado, possuindo caráter programático.",
    dificuldade: 2,
    tags: ["objetivos fundamentais", "art. 3º", "normas programáticas"],
    fonte_legal: ["Art. 3º, CF/88"],
    banca_referencia: "FGV",
    assunto: "Princípios Fundamentais",
    ano: 2024,
  },
  {
    id: "const-003",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O princípio da separação dos Poderes é absoluto, não admitindo qualquer interferência entre as funções legislativa, executiva e judiciária.",
    resposta: "ERRADO",
    explicacao:
      "A CF/88 adota a separação com sistema de freios e contrapesos (checks and balances), permitindo controle recíproco e funções atípicas entre os Poderes.",
    dificuldade: 2,
    tags: ["separação de poderes", "freios e contrapesos", "funções atípicas"],
    fonte_legal: ["Art. 2º, CF/88"],
    banca_referencia: "FCC",
    assunto: "Separação de Poderes",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 2: DIREITOS E GARANTIAS FUNDAMENTAIS
  // ============================================================
  {
    id: "const-004",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "Os direitos e garantias fundamentais expressos na Constituição não excluem outros decorrentes do regime e dos princípios por ela adotados ou de tratados internacionais de direitos humanos dos quais o Brasil seja parte.",
    resposta: "CERTO",
    explicacao:
      "Art. 5º, §2º, CF/88: catálogo de direitos é aberto (cláusula de abertura). Tratados de DH aprovados por rito especial têm status supralegal ou constitucional.",
    dificuldade: 2,
    tags: [
      "catálogo aberto",
      "tratados internacionais",
      "status constitucional",
    ],
    fonte_legal: ["Art. 5º, §2º, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Direitos Fundamentais - Características",
    ano: 2024,
  },
  {
    id: "const-005",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A pena de morte é vedada no ordenamento jurídico brasileiro em qualquer hipótese, configurando cláusula pétrea intocável.",
    resposta: "ERRADO",
    explicacao:
      "Art. 5º, XLVII, 'a': a pena de morte é vedada, salvo em caso de guerra declarada, nos termos do art. 84, XIX.",
    dificuldade: 2,
    tags: ["pena de morte", "exceções constitucionais", "art. 5º"],
    fonte_legal: ["Art. 5º, XLVII, a, CF/88"],
    banca_referencia: "VUNESP",
    assunto: "Direitos Individuais",
    ano: 2022,
  },
  {
    id: "const-006",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O Mandado de Injunção é cabível sempre que a falta de norma regulamentadora torne inviável o exercício dos direitos e liberdades constitucionais e das prerrogativas inerentes à nacionalidade, à soberania e à cidadania.",
    resposta: "CERTO",
    explicacao:
      "Art. 5º, LXXI, CF/88: MI visa suprir omissão legislativa ou administrativa que impeça o exercício de direitos constitucionais.",
    dificuldade: 3,
    tags: [
      "mandado de injunção",
      "remédios constitucionais",
      "omissão legislativa",
    ],
    fonte_legal: ["Art. 5º, LXXI, CF/88"],
    banca_referencia: "FCC",
    assunto: "Remédios Constitucionais",
    ano: 2023,
  },
  {
    id: "const-007",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O transporte foi incluído no rol dos direitos sociais pela Emenda Constitucional nº 90/2015, reforçando o caráter social do Estado brasileiro.",
    resposta: "CERTO",
    explicacao:
      "EC 90/2015 alterou o art. 6º para incluir expressamente o transporte como direito social, ao lado de educação, saúde, trabalho, moradia, etc.",
    dificuldade: 2,
    tags: ["direitos sociais", "EC 90/2015", "transporte"],
    fonte_legal: ["Art. 6º, CF/88"],
    banca_referencia: "FGV",
    assunto: "Direitos Sociais",
    ano: 2024,
  },
  {
    id: "const-008",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "São privativos de brasileiro nato os cargos de Presidente e Vice-Presidente da República, Ministro do STF, Presidente do Senado Federal e da Câmara dos Deputados, Ministro de Estado da Defesa e oficial das Forças Armadas.",
    resposta: "CERTO",
    explicacao:
      "Art. 12, §3º, CF/88: rol taxativo de cargos privativos de nato. Não inclui cargos de Governador ou Prefeito.",
    dificuldade: 3,
    tags: ["nacionalidade", "cargos privativos de nato", "art. 12"],
    fonte_legal: ["Art. 12, §3º, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Nacionalidade",
    ano: 2023,
  },
  {
    id: "const-009",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "Os partidos políticos, após o registro definitivo de seus estatutos no TSE, gozam de autonomia para definir sua estrutura interna, organização e funcionamento, não podendo receber recursos financeiros de entidade ou governo estrangeiros.",
    resposta: "CERTO",
    explicacao:
      "Art. 17, §1º e §4º, CF/88: autonomia partidativa e vedação expressa de financiamento estrangeiro.",
    dificuldade: 2,
    tags: ["partidos políticos", "autonomia", "financiamento"],
    fonte_legal: ["Art. 17, CF/88"],
    banca_referencia: "VUNESP",
    assunto: "Partidos Políticos",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 3: ORGANIZAÇÃO POLÍTICO-ADMINISTRATIVA
  // ============================================================
  {
    id: "const-010",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A União, os Estados, o Distrito Federal e os Municípios são entes federativos autônomos, não havendo relação de subordinação entre eles, apenas de coordenação.",
    resposta: "CERTO",
    explicacao:
      "Art. 18, CF/88: federação brasileira é baseada na autonomia político-administrativa e financeira dos entes, sem hierarquia.",
    dificuldade: 1,
    tags: ["federação", "autonomia", "entes federativos"],
    fonte_legal: ["Art. 18, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Organização Político-Administrativa",
    ano: 2024,
  },
  {
    id: "const-011",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "Os Territórios Federais integram a União e, quando criados por lei complementar, não possuem a mesma autonomia política dos Estados e Municípios, sendo sua administração direta da União.",
    resposta: "CERTO",
    explicacao:
      "Art. 18, §2º, CF/88: Territórios não são entes federativos. Sua criação, transformação em Estado ou extinção depende de LC.",
    dificuldade: 2,
    tags: ["territórios", "competência da União", "lei complementar"],
    fonte_legal: ["Art. 18, §2º, CF/88"],
    banca_referencia: "FCC",
    assunto: "Territórios Federais",
    ano: 2023,
  },
  {
    id: "const-012",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A competência para legislar sobre direito civil é privativa da União, sendo vedada a delegação aos Estados em qualquer hipótese.",
    resposta: "ERRADO",
    explicacao:
      "Art. 22, parágrafo único, CF/88: a competência privativa da União pode ser delegada aos Estados por lei complementar que autorize.",
    dificuldade: 3,
    tags: ["competência legislativa", "delegação", "lei complementar"],
    fonte_legal: ["Art. 22, parágrafo único, CF/88"],
    banca_referencia: "FGV",
    assunto: "Competências Legislativas",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 4: ADMINISTRAÇÃO PÚBLICA E SERVIDORES
  // ============================================================
  {
    id: "const-013",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O acesso a cargos, empregos e funções públicas depende de aprovação prévia em concurso público de provas ou de provas e títulos, ressalvadas as nomeações para cargo em comissão declarado em lei de livre nomeação e exoneração.",
    resposta: "CERTO",
    explicacao:
      "Art. 37, II, CF/88: regra geral do concurso público. Comissões são exceção constitucional para cargos de direção, chefia e assessoramento.",
    dificuldade: 1,
    tags: ["concurso público", "cargo em comissão", "art. 37"],
    fonte_legal: ["Art. 37, II, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Administração Pública - Acesso",
    ano: 2023,
  },
  {
    id: "const-014",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O servidor público estável só perderá o cargo em virtude de sentença judicial transitada em julgado ou mediante processo administrativo em que lhe seja assegurada ampla defesa, sendo vedada a perda por avaliação de desempenho.",
    resposta: "ERRADO",
    explicacao:
      "Art. 41, §1º, III, CF/88 (redação EC 19/98): a estabilidade também pode ser perdida mediante avaliação periódica de desempenho, na forma de lei complementar.",
    dificuldade: 3,
    tags: ["estabilidade", "avaliação de desempenho", "EC 19/1998"],
    fonte_legal: ["Art. 41, CF/88"],
    banca_referencia: "FGV",
    assunto: "Servidores Públicos - Estabilidade",
    ano: 2024,
  },
  {
    id: "const-015",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A remuneração dos servidores públicos e o subsídio de que trata o §4º do art. 39 somente poderão ser fixados ou alterados por lei específica, observada a iniciativa privativa em cada caso.",
    resposta: "CERTO",
    explicacao:
      "Art. 37, X, CF/88: reserva legal para fixação/altação de vencimentos e subsídios, com iniciativa conforme a esfera (Executivo, Legislativo, Judiciário).",
    dificuldade: 2,
    tags: ["remuneração", "subsídio", "reserva legal"],
    fonte_legal: ["Art. 37, X, CF/88"],
    banca_referencia: "VUNESP",
    assunto: "Remuneração dos Servidores",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 5: PODER LEGISLATIVO
  // ============================================================
  {
    id: "const-016",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O Congresso Nacional é composto pela Câmara dos Deputados e pelo Senado Federal, com mandato de 4 anos para deputados e 8 anos para senadores.",
    resposta: "CERTO",
    explicacao:
      "Art. 44 e 45, CF/88: sistema bicameral. Eleições são simultâneas, renovando-se 1/3 ou 2/3 do Senado a cada 4 anos.",
    dificuldade: 1,
    tags: ["congresso nacional", "mandato", "bicameralismo"],
    fonte_legal: ["Arts. 44 e 45, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Poder Legislativo - Composição",
    ano: 2023,
  },
  {
    id: "const-017",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "Os Deputados e Senadores são invioláveis, civil e penalmente, por quaisquer de suas opiniões, palavras e votos.",
    resposta: "CERTO",
    explicacao:
      "Art. 53, caput, CF/88: imunidade parlamentar material (inviolabilidade absoluta por opiniões, palavras e votos no exercício do mandato).",
    dificuldade: 2,
    tags: ["imunidade parlamentar", "inviolabilidade", "art. 53"],
    fonte_legal: ["Art. 53, CF/88"],
    banca_referencia: "FGV",
    assunto: "Imunidades Parlamentares",
    ano: 2024,
  },
  {
    id: "const-018",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "As leis complementares são aprovadas por maioria absoluta dos membros do Congresso Nacional, enquanto as leis ordinárias exigem maioria simples.",
    resposta: "ERRADO",
    explicacao:
      "Lei complementar: maioria absoluta (metade + 1 do total de membros). Lei ordinária: maioria relativa (metade + 1 dos presentes), desde que haja quórum de maioria absoluta para deliberação.",
    dificuldade: 3,
    tags: ["processo legislativo", "quórum", "lei complementar vs ordinária"],
    fonte_legal: ["Art. 47 e 69, CF/88"],
    banca_referencia: "FCC",
    assunto: "Processo Legislativo",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 6: PODER EXECUTIVO
  // ============================================================
  {
    id: "const-019",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O Presidente da República pode editar medidas provisórias com força de lei em caso de relevância e urgência, exceto em matéria de direito penal, processual penal e processual civil.",
    resposta: "CERTO",
    explicacao:
      "Art. 62, §1º, CF/88: vedações materiais expressas à edição de MP, incluindo direito penal, processual penal/civil, planejamento tributário e organização do Judiciário/MP.",
    dificuldade: 2,
    tags: ["medida provisória", "competência do presidente", "vedações"],
    fonte_legal: ["Art. 62, §1º, CF/88"],
    banca_referencia: "VUNESP",
    assunto: "Poder Executivo - Medidas Provisórias",
    ano: 2024,
  },
  {
    id: "const-020",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "Os Ministros de Estado são nomeados pelo Presidente da República e possuem competência para referendar atos presidenciais e expedir instruções para a execução de leis.",
    resposta: "CERTO",
    explicacao:
      "Art. 87 e 88, CF/88: ministros auxiliam o Presidente, referendam atos, expedem instruções e praticam atos de gestão administrativa.",
    dificuldade: 1,
    tags: ["ministros de estado", "competência", "art. 87"],
    fonte_legal: ["Arts. 87 e 88, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Poder Executivo - Ministros",
    ano: 2023,
  },

  // ============================================================
  // TÓPICO 7: PODER JUDICIÁRIO E CNJ
  // ============================================================
  {
    id: "const-021",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O Supremo Tribunal Federal tem como função precípua a guarda da Constituição, competindo-lhe processar e julgar, originariamente, a ação direta de inconstitucionalidade de lei ou ato normativo federal ou estadual.",
    resposta: "CERTO",
    explicacao:
      "Art. 102, I, 'a', CF/88: competência originária do STF para controle concentrado de constitucionalidade (ADI, ADC, ADPF, etc.).",
    dificuldade: 2,
    tags: ["STF", "competência", "controle de constitucionalidade"],
    fonte_legal: ["Art. 102, I, CF/88"],
    banca_referencia: "FCC",
    assunto: "Poder Judiciário - STF",
    ano: 2024,
  },
  {
    id: "const-022",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O Conselho Nacional de Justiça (CNJ) integra o Poder Judiciário e exerce o controle da atuação administrativa e financeira do Judiciário, bem como o cumprimento dos deveres funcionais dos juízes.",
    resposta: "CERTO",
    explicacao:
      "Art. 92, I-A, e 103-B, CF/88 (EC 45/2004): CNJ integra o Judiciário e atua na esfera administrativa, financeira e disciplinar, sem função jurisdicional.",
    dificuldade: 2,
    tags: ["CNJ", "composição", "funções", "EC 45/2004"],
    fonte_legal: ["Art. 92, I-A e 103-B, CF/88"],
    banca_referencia: "FGV",
    assunto: "CNJ - Composição e Competências",
    ano: 2023,
  },
  {
    id: "const-023",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O ingresso na carreira da magistratura depende de concurso público de provas e títulos, com a participação da OAB em todas as fases, exigindo-se no mínimo três anos de atividade jurídica.",
    resposta: "ERRADO",
    explicacao:
      "Art. 93, I, CF/88: exige mínimo de 3 anos de atividade jurídica. A participação da OAB ocorre, mas não em todas as fases obrigatoriamente; a banca é composta por magistrados, membros do MP, advogados e sociedade.",
    dificuldade: 3,
    tags: ["magistratura", "concurso", "atividade jurídica"],
    fonte_legal: ["Art. 93, I, CF/88"],
    banca_referencia: "VUNESP",
    assunto: "Magistratura - Ingresso",
    ano: 2022,
  },
  {
    id: "const-024",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A vitaliciedade dos magistrados é adquirida após dois anos de exercício, sendo a perda do cargo, nesse período, determinada por sentença judicial transitada em julgado.",
    resposta: "CERTO",
    explicacao:
      "Art. 95, I, CF/88: vitaliciedade após 2 anos (estágio probatório na magistratura). Antes disso, perda por deliberação do tribunal ou sentença judicial.",
    dificuldade: 2,
    tags: ["garantias da magistratura", "vitaliciedade", "art. 95"],
    fonte_legal: ["Art. 95, I, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Garantias da Magistratura",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 8: FUNÇÕES ESSENCIAIS À JUSTIÇA
  // ============================================================
  {
    id: "const-025",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O Ministério Público é instituição permanente, essencial à função jurisdicional do Estado, incumbindo-lhe a defesa da ordem jurídica, do regime democrático e dos interesses sociais e individuais indisponíveis.",
    resposta: "CERTO",
    explicacao:
      "Art. 127, caput, CF/88: missões constitucionais do MP. Possui princípios da unidade, indivisibilidade e independência funcional.",
    dificuldade: 1,
    tags: ["ministério público", "função institucional", "art. 127"],
    fonte_legal: ["Art. 127, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Ministério Público",
    ano: 2023,
  },
  {
    id: "const-026",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A Defensoria Pública é instituição permanente, essencial à função jurisdicional do Estado, incumbindo-lhe, como expressão e instrumento do regime democrático, fundamentalmente, a orientação jurídica, a promoção dos direitos humanos e a defesa, em todos os graus, judicial e extrajudicial, dos direitos individuais e coletivos, de forma integral e gratuita, aos necessitados.",
    resposta: "CERTO",
    explicacao:
      "Art. 134, caput, CF/88 (redação EC 80/2014): essencialidade reforçada, autonomia funcional e administrativa, com atuação na defesa dos hipossuficientes.",
    dificuldade: 2,
    tags: ["defensoria pública", "EC 80/2014", "assistência jurídica"],
    fonte_legal: ["Art. 134, CF/88"],
    banca_referencia: "FGV",
    assunto: "Defensoria Pública",
    ano: 2024,
  },
  {
    id: "const-027",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A Advocacia-Geral da União é instituição essencial à função jurisdicional do Estado, incumbindo-lhe, diretamente ou através de órgão vinculado, a representação judicial e a consultoria jurídica da União.",
    resposta: "CERTO",
    explicacao:
      "Art. 131, CF/88: AGU representa a União judicial e extrajudicialmente, com autonomia administrativa e financeira garantida.",
    dificuldade: 1,
    tags: ["AGU", "advocacia pública", "representação judicial"],
    fonte_legal: ["Art. 131, CF/88"],
    banca_referencia: "VUNESP",
    assunto: "Advocacia Pública",
    ano: 2022,
  },
  {
    id: "const-028",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A advocacia e a defensoria pública são funções essenciais à justiça, sendo vedada a acumulação de cargos de Procurador do Estado com o de Defensor Público.",
    resposta: "CERTO",
    explicacao:
      "Ambas são carreiras de Estado com ingresso via concurso, incompatíveis por natureza de atuação (representação estatal vs defesa do cidadão) e vedação constitucional de acumulação de cargos públicos (art. 37, XVI).",
    dificuldade: 2,
    tags: ["funções essenciais", "acumulação", "carreiras jurídicas"],
    fonte_legal: ["Art. 37, XVI e Art. 131/134, CF/88"],
    banca_referencia: "FCC",
    assunto: "Funções Essenciais à Justiça",
    ano: 2023,
  },

  // ============================================================
  // QUESTÕES DE ATUALIZAÇÃO E CONTROLE DE CONSTITUCIONALIDADE
  // ============================================================
  {
    id: "const-029",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A forma federativa de Estado, o voto direto, secreto, universal e periódico, a separação dos Poderes e os direitos e garantias individuais constituem cláusulas pétreas, insuscetíveis de emenda constitucional tendente a aboli-las.",
    resposta: "CERTO",
    explicacao:
      "Art. 60, §4º, CF/88: rol taxativo de cláusulas pétreas. República e Presidencialismo não constam expressamente.",
    dificuldade: 3,
    tags: ["cláusulas pétreas", "limites ao poder de reforma", "art. 60"],
    fonte_legal: ["Art. 60, §4º, CF/88"],
    banca_referencia: "FGV",
    assunto: "Cláusulas Pétreas",
    ano: 2024,
  },
  {
    id: "const-030",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O controle de constitucionalidade pode ser exercido de forma difusa (qualquer juiz ou tribunal, via exceção ou defesa) ou concentrada (STF, via ação direta), sendo que a decisão no controle difuso produz efeitos erga omnes e vinculação geral apenas se o Senado Federal suspender a execução do lei.",
    resposta: "CERTO",
    explicacao:
      "Art. 52, X, CF/88: no controle difuso, a declaração de inconstitucionalidade é inter partes, mas a resolução do Senado pode ampliar os efeitos (efeito erga omnes).",
    dificuldade: 3,
    tags: ["controle de constitucionalidade", "efeitos", "resolução do senado"],
    fonte_legal: ["Art. 52, X, CF/88"],
    banca_referencia: "CEBRASPE",
    assunto: "Controle de Constitucionalidade",
    ano: 2023,
  },
  {
    id: "const-031",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "O Estado de Defesa pode ser decretado pelo Presidente da República para preservar ou prontamente restabelecer a ordem pública ou a paz social ameaçadas por grave e iminente instabilidade institucional ou atingidas por calamidades de grandes proporções na natureza.",
    resposta: "ERRADO",
    explicacao:
      "Estado de Defesa (art. 136) protege ordem pública/paz social em instabilidade institucional ou calamidades. Estado de Sítio (art. 137) protege em comoção grave de repercussão nacional ou guerra. O enunciado mistura fundamentos.",
    dificuldade: 3,
    tags: ["estado de defesa", "estado de sítio", "medidas de exceção"],
    fonte_legal: ["Arts. 136 e 137, CF/88"],
    banca_referencia: "FGV",
    assunto: "Estado de Defesa e de Sítio",
    ano: 2024,
  },
  {
    id: "const-032",
    disciplina: "DIREITO_CONSTITUCIONAL",
    enunciado:
      "A Emenda Constitucional nº 132/2023 introduziu no ordenamento jurídico brasileiro a reforma tributária sobre o consumo, criando o Imposto sobre Bens e Serviços (IBS) e a Contribuição sobre Bens e Serviços (CBS), substituindo vários impostos existentes.",
    resposta: "CERTO",
    explicacao:
      "EC 132/2023 reformou profundamente o sistema tributário, instituindo IBS (Estados/Municípios) e CBS (União), com vigência progressiva e transição constitucional.",
    dificuldade: 3,
    tags: ["EC 132/2023", "reforma tributária", "IBS", "CBS"],
    fonte_legal: ["EC 132/2023", "Arts. 152-A a 152-D, CF/88"],
    banca_referencia: "FCC",
    assunto: "Atualização Constitucional",
    ano: 2024,
  },
];

export const totalQuestoesDireitoConstitucional =
  questoesDireitoConstitucional.length;
