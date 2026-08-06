// src/constants/estruturaProva.ts

export interface Disciplina {
  qtd: number;
  topicos: string[];
}

export interface GrupoDisciplinas {
  total: number;
  disciplinas: Record<string, Disciplina>;
}

export interface EstruturaProva {
  conhecimentosBasicos: GrupoDisciplinas;
  conhecimentosEspecificos: GrupoDisciplinas;
}

export const ESTRUTURA_PROVA: EstruturaProva = {
  conhecimentosBasicos: {
    total: 24,
    disciplinas: {
      "Língua Portuguesa": {
        qtd: 8,
        topicos: [
          "Compreensão e interpretação de textos",
          "Tipologia textual",
          "Ortografia oficial",
          "Acentuação gráfica",
          "Emprego das classes de palavras",
          "Emprego do sinal indicativo de crase",
          "Sintaxe da oração e do período",
          "Pontuação",
          "Concordâncias nominal e verbal",
          "Regências nominal e verbal",
          "Significação das palavras",
          "Redação de correspondências oficiais: Manual de Redação da Presidência da República",
        ],
      },
      "Ética e Conduta Pública": {
        qtd: 6,
        topicos: [
          "Ética e moral",
          "Ética, princípios e valores",
          "Ética e democracia: exercício da cidadania",
          "Ética e função pública",
          "Ética no Setor Público",
          "Decreto nº 1.171/1994 (Código de Ética Profissional do Serviço Público) e Decreto nº 6.029/2007 (Sistema de Gestão da Ética do Poder Executivo Federal)",
          "Lei nº 8.112/1990 e alterações – regime disciplinar: deveres e proibições, acumulação de cargos, responsabilidades, penalidades",
          "Lei nº 8.429/1992: disposições gerais, atos de improbidade administrativa",
        ],
      },
      "Raciocínio Lógico": {
        qtd: 10,
        topicos: [
          "Estruturas lógicas",
          "Lógica de argumentação: analogias, inferências, deduções e conclusões",
          "Lógica sentencial (ou proposicional)",
          "Proposições simples e compostas",
          "Tabelas verdade",
          "Equivalências",
          "Leis de De Morgan",
          "Diagramas lógicos",
          "Lógica de primeira ordem",
          "Princípios de contagem e probabilidade",
          "Operações com conjuntos",
          "Raciocínio lógico envolvendo problemas aritméticos, geométricos e matriciais",
        ],
      },
    },
  },
  conhecimentosEspecificos: {
    total: 36,
    disciplinas: {
      "Direito Constitucional": {
        qtd: 8,
        topicos: [
          "Constituição: conceito, classificações, princípios fundamentais",
          "Direitos e garantias fundamentais",
          "Direitos e deveres individuais e coletivos, direitos sociais, nacionalidade, cidadania, direitos políticos, partidos políticos",
          "Organização político-administrativa",
          "União, estados, Distrito Federal, municípios e territórios",
          "Administração pública: disposições gerais, servidores públicos",
          "Poder Legislativo: Congresso Nacional, Câmara dos Deputados, Senado Federal, deputados e senadores",
          "Poder Executivo: atribuições do Presidente da República e dos ministros de Estado",
          "Poder Judiciário: disposições gerais e órgãos",
          "Competências dos órgãos do Poder Judiciário",
          "Conselho Nacional de Justiça (CNJ): composição e competências",
          "Funções essenciais à justiça: Ministério Público, advocacia e defensoria públicas",
        ],
      },
      "Direito Administrativo": {
        qtd: 6,
        topicos: [
          "Ato administrativo: conceito, requisitos, atributos, classificação, espécies e invalidação",
          "Anulação e revogação",
          "Prescrição",
          "Controle da administração pública: administrativo, legislativo e judiciário",
          "Agentes administrativos: investidura e exercício da função pública",
          "Direitos e deveres dos servidores públicos",
          "Processo administrativo: conceito, princípios, fases e modalidades",
          "Poderes da administração: vinculado, discricionário, hierárquico, disciplinar e regulamentar",
          "Princípios básicos da administração",
          "Responsabilidade objetiva da administração",
          "Improbidade administrativa",
          "Serviços públicos: conceito, classificação, regulamentação, formas e competência de prestação",
          "Administração direta e indireta, centralizada e descentralizada",
          "Lei nº 8.112/1990 e alterações",
          "Lei nº 8.666/1993, arts. 1º a 6º, 20 a 26, e 54 a 80, e alterações",
          "Lei nº 9.784/1999: processo administrativo no âmbito da administração pública federal",
        ],
      },
      "Noções de Administração": {
        qtd: 6,
        topicos: [
          "A evolução da Administração Pública e a reforma do Estado",
          "Convergências e diferenças entre a gestão pública e a gestão privada",
          "Excelência nos serviços públicos e na gestão dos serviços públicos",
          "Gestão de Pessoas: conceitos e práticas de RH relativas ao servidor público",
          "Planejamento estratégico de RH",
          "Gestão de desempenho",
          "Comportamento, clima e cultura organizacional",
          "Gestão por competências e gestão do conhecimento",
          "Qualidade de vida no trabalho",
          "Estrutura organizacional: tipos, natureza, finalidades e critérios de departamentalização",
          "Liderança, motivação e satisfação no trabalho",
          "Recrutamento e seleção de pessoas",
          "Análise e descrição de cargos",
          "Educação, treinamento e desenvolvimento",
          "Educação corporativa e educação à distância",
        ],
      },
      "Noções de Arquivologia": {
        qtd: 4,
        topicos: [
          "Arquivística: princípios e conceitos",
          "Gestão de documentos",
          "Protocolo: recebimento, registro, distribuição, tramitação e expedição de documentos",
          "Classificação de documentos de arquivo",
          "Arquivamento e ordenação de documentos de arquivo",
          "Tabela de temporalidade de documentos de arquivo",
          "Acondicionamento e armazenamento de documentos de arquivo",
          "Preservação e conservação de documentos de arquivo",
        ],
      },
      "Noções de Informática": {
        qtd: 4,
        topicos: [
          "Aplicativos para edição de textos, planilhas e apresentações",
          "Conceitos básicos, ferramentas, aplicativos e procedimentos de Internet",
          "Correio eletrônico, grupos de discussão, busca e pesquisa",
          "Tecnologias, ferramentas e procedimentos associados à Internet e Intranet",
          "Tecnologia da informação: sistemas de informações e segurança da informação",
        ],
      },
      "Legislação PRF": {
        qtd: 8,
        topicos: [
          "Art. 144 da Constituição Federal - Perfil constitucional: funções institucionais",
          "Art. 20 da Lei nº 9.503/1997 (Código de Trânsito Brasileiro)",
          "Decreto nº 1.655/1995",
          "Decreto nº 6.061/2007",
        ],
      },
    },
  },
};
