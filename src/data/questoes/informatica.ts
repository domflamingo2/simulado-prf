import { Questao } from "../types";

export const questoesInformatica: Questao[] = [
  {
    id: "inf-001-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "No Microsoft Excel, a fórmula =SOMA(A1:A10) realiza a adição aritmética de todos os valores numéricos contidos no intervalo de células de A1 até A10, ignorando células vazias ou com texto.",
    resposta: "CERTO",
    explicacao:
      "Função SOMA: adiciona valores numéricos. Ignora células vazias, texto e valores lógicos. Se houver erro em alguma célula, retorna erro. É uma das funções mais utilizadas em planilhas.",
    dificuldade: 1,
    tags: ["Excel", "SOMA", "funções", "intervalo", "planilhas"],
    banca_referencia: "FCC",
    assunto: "Aplicativos para edição de planilhas",
  },
  {
    id: "inf-002-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O atalho de teclado Ctrl+C no sistema operacional Windows é utilizado para copiar o conteúdo selecionado para a área de transferência, enquanto Ctrl+V é utilizado para colar o conteúdo da área de transferência no local desejado.",
    resposta: "CERTO",
    explicacao:
      "Atalhos padrão Windows: Ctrl+C (Copy = Copiar), Ctrl+X (Cut = Recortar), Ctrl+V (Paste = Colar), Ctrl+Z (Undo = Desfazer). São atalhos universais na maioria dos aplicativos Windows.",
    dificuldade: 1,
    tags: ["atalhos", "Ctrl+C", "Ctrl+V", "área de transferência", "Windows"],
    banca_referencia: "CEBRASPE",
    assunto: "Conceitos de tecnologia de informação",
  },
  {
    id: "inf-003-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O protocolo HTTPS (HyperText Transfer Protocol Secure) é a versão segura do HTTP, que utiliza criptografia SSL/TLS para proteger a integridade e a confidencialidade dos dados transmitidos entre o navegador e o servidor web.",
    resposta: "CERTO",
    explicacao:
      "HTTPS = HTTP + SSL/TLS. Criptografa a conexão, impedindo interceptação (sniffing) de dados sensíveis (senhas, cartões). Indicado pelo cadeado na barra de endereços e URL iniciando com https://.",
    dificuldade: 1,
    tags: ["HTTPS", "HTTP", "SSL", "TLS", "criptografia", "segurança"],
    banca_referencia: "CEBRASPE",
    assunto: "Conceitos básicos de Internet",
  },
  {
    id: "inf-004-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O phishing é uma técnica de ataque cibernético que utiliza engenharia social para induzir usuários a revelar dados pessoais sensíveis (senhas, números de cartão), geralmente por meio de e-mails ou sites falsificados que imitam entidades legítimas.",
    resposta: "CERTO",
    explicacao:
      "Phishing = 'isca' digital. E-mails falsos de bancos, redes sociais, etc., com links para sites clones que roubam dados. É o ataque mais comum contra usuários comuns.",
    dificuldade: 1,
    tags: ["phishing", "engenharia social", "ataque", "segurança", "fraude"],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação",
  },
  {
    id: "inf-005-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O armazenamento em nuvem (cloud computing) elimina completamente a necessidade de conexão com a internet para acesso aos dados armazenados, pois os arquivos são replicados localmente em todos os dispositivos do usuário.",
    resposta: "ERRADO",
    explicacao:
      "Cloud computing REQUER conexão com internet (ou intranet) para acesso remoto aos servidores. Não elimina a necessidade de conexão. Alguns serviços permitem sincronização local (cópia offline), mas o acesso ao cloud requer rede.",
    dificuldade: 1,
    tags: [
      "cloud computing",
      "nuvem",
      "internet",
      "armazenamento",
      "acesso remoto",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Conceitos de tecnologia de informação",
  },
  {
    id: "inf-006-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O sistema operacional Linux é distribuído sob licença de software livre e de código aberto (open source), permitindo que qualquer pessoa utilize, estude, modifique e distribua o sistema, de acordo com os termos da licença GPL.",
    resposta: "CERTO",
    explicacao:
      "Linux é software livre (free software) e open source. Licença GPL (General Public License): liberdade de executar, copiar, distribuir, estudar, modificar e melhorar o software. Código fonte disponível.",
    dificuldade: 1,
    tags: ["Linux", "software livre", "open source", "GPL", "código aberto"],
    banca_referencia: "FGV",
    assunto: "Sistemas operacionais",
  },
  {
    id: "inf-007-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O Microsoft Word é um software aplicativo de edição e formatação de texto, enquanto o Microsoft Excel é um software de planilha eletrônica para cálculos e análise de dados, ambos integrantes do pacote Microsoft Office.",
    resposta: "CERTO",
    explicacao:
      "Word = processador de texto. Excel = planilha eletrônica. PowerPoint = apresentações. Outlook = e-mail. São aplicativos do Microsoft Office (suíte de produtividade).",
    dificuldade: 1,
    tags: [
      "Microsoft Word",
      "Microsoft Excel",
      "Office",
      "processador de texto",
      "planilha",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Aplicativos para edição de textos e planilhas",
  },
  {
    id: "inf-008-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O firewall é um dispositivo de segurança de rede (hardware ou software) que monitora e controla o tráfego de rede baseado em regras de segurança predeterminadas, atuando como barreira entre redes confiáveis e não confiáveis.",
    resposta: "CERTO",
    explicacao:
      "Firewall = 'parede de fogo'. Filtra pacotes de rede (entrada/saída) baseado em regras (IPs, portas, protocolos). Pode ser pessoal (software no PC) ou de rede (hardware dedicado).",
    dificuldade: 1,
    tags: ["firewall", "segurança de rede", "tráfego", "regras", "barreira"],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação",
  },
  {
    id: "inf-009-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "A função =SE(A1>10;'Maior';'Menor') no Microsoft Excel testa se o valor da célula A1 é maior que 10, retornando o texto 'Maior' se verdadeiro e 'Menor' se falso, funcionando como uma estrutura condicional simples.",
    resposta: "CERTO",
    explicacao:
      "Função SE (IF): teste lógico; valor_se_verdadeiro; valor_se_falso. =SE(condição; resultado_V; resultado_F). É a função condicional básica do Excel.",
    dificuldade: 2,
    tags: ["Excel", "função SE", "IF", "condicional", "lógica"],
    banca_referencia: "FCC",
    assunto: "Aplicativos para edição de planilhas",
  },
  {
    id: "inf-010-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O malware (software malicioso) é um tipo de software legítimo desenvolvido para proteção de sistemas contra vírus e outras ameaças, sendo essencial para a segurança da informação.",
    resposta: "ERRADO",
    explicacao:
      "Malware = software malicioso (malicious software). Inclui vírus, worms, trojans, ransomware, spyware, adware. É o que causa dano, não o que protege. O software de proteção é o antivírus/antimalware.",
    dificuldade: 1,
    tags: ["malware", "software malicioso", "vírus", "segurança", "ameaças"],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação",
  },
  {
    id: "inf-011-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O backup incremental copia apenas os arquivos que foram modificados desde o último backup (de qualquer tipo), sendo mais rápido que o backup completo, mas exigindo a cadeia de backups para restauração completa.",
    resposta: "CERTO",
    explicacao:
      "Backup incremental: só o que mudou desde o último backup (completo ou incremental). Ocupa menos espaço, é mais rápido, mas para restaurar precisa do último completo + todos os incrementais subsequentes.",
    dificuldade: 2,
    tags: [
      "backup incremental",
      "backup completo",
      "cópia de segurança",
      "restauração",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação",
  },
  {
    id: "inf-012-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O endereço IP 192.168.1.1 é um exemplo de endereço IPv4 privado (não roteável na internet pública), utilizado em redes locais (LANs), conforme definição da RFC 1918.",
    resposta: "CERTO",
    explicacao:
      "Faixas de IP privado (RFC 1918): 10.0.0.0 a 10.255.255.255 (classe A), 172.16.0.0 a 172.31.255.255 (classe B), 192.168.0.0 a 192.168.255.255 (classe C). Usados em redes locais, convertidos por NAT para acesso à internet.",
    dificuldade: 2,
    tags: ["IP privado", "IPv4", "RFC 1918", "rede local", "NAT", "192.168"],
    banca_referencia: "FGV",
    assunto: "Conceitos básicos de Internet",
  },
  {
    id: "inf-013-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O Microsoft PowerPoint é um software aplicativo de criação e edição de apresentações multimídia (slides), enquanto o Adobe Photoshop é um software de edição de imagens raster (bitmap).",
    resposta: "CERTO",
    explicacao:
      "PowerPoint = apresentações. Photoshop = edição profissional de imagens raster (pixels). Illustrator = imagens vetoriais. São categorias distintas de software.",
    dificuldade: 1,
    tags: [
      "PowerPoint",
      "Photoshop",
      "apresentações",
      "edição de imagens",
      "software",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Aplicativos para apresentações",
  },
  {
    id: "inf-014-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "A criptografia de dados é uma técnica de segurança que transforma informações legíveis (texto claro) em formato ilegível (texto cifrado) através de algoritmos matemáticos, exigindo uma chave específica para reverter o processo (decriptografia).",
    resposta: "CERTO",
    explicacao:
      "Criptografia: codificação que garante confidencialidade. Algoritmos (AES, RSA) + chaves. Sem a chave correta, os dados são ininteligíveis. É fundamental para segurança de dados em repouso e em trânsito.",
    dificuldade: 1,
    tags: [
      "criptografia",
      "encriptação",
      "chave",
      "segurança",
      "confidencialidade",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação",
  },
  {
    id: "inf-015-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O atalho de teclado Ctrl+Z é universal na maioria dos softwares e sistemas operacionais para desfazer (undo) a última ação realizada, enquanto Ctrl+Y ou Ctrl+Shift+Z refaz (redo) a ação desfeita.",
    resposta: "CERTO",
    explicacao:
      "Ctrl+Z = Undo (desfazer). Ctrl+Y (ou Ctrl+Shift+Z em alguns programas) = Redo (refazer). São atalhos padrão de edição, presentes em processadores de texto, planilhas, editores de imagem, etc.",
    dificuldade: 1,
    tags: ["atalhos", "Ctrl+Z", "undo", "redo", "desfazer", "refazer"],
    banca_referencia: "CEBRASPE",
    assunto: "Conceitos de tecnologia de informação",
  },
  {
    id: "inf-016-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O sistema de numeração binário (base 2) utiliza apenas dois dígitos (0 e 1) para representar qualquer informação, sendo a base da computação digital moderna, onde 0 e 1 correspondem a estados físicos (desligado/ligado) dos circuitos eletrônicos.",
    resposta: "CERTO",
    explicacao:
      "Sistema binário: base 2 (0 e 1). Bit (binary digit) = menor unidade de informação. Bytes (8 bits) representam caracteres. Todo processamento digital é feito em binário (portas lógicas, transistores).",
    dificuldade: 1,
    tags: [
      "binário",
      "base 2",
      "bit",
      "byte",
      "sistema de numeração",
      "computação digital",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Conceitos de tecnologia de informação",
  },
  {
    id: "inf-017-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "O cookie é um arquivo de dados armazenado no navegador do usuário por sites web, utilizado para manter sessões de login, preferências do usuário e rastreamento de comportamento, sendo inerentemente malicioso e representando sempre uma ameaça à segurança.",
    resposta: "ERRADO",
    explicacao:
      "Cookies são neutros: podem ser úteis (sessões, preferências) ou usados para rastreamento (privacidade). Não são inerentemente maliciosos, mas podem ser explorados (session hijacking) ou usados para tracking. Podem ser gerenciados pelo usuário.",
    dificuldade: 2,
    tags: [
      "cookie",
      "navegador",
      "sessão",
      "privacidade",
      "rastreamento",
      "segurança",
    ],
    banca_referencia: "FGV",
    assunto: "Conceitos básicos de Internet",
  },
  {
    id: "inf-018-v2",
    disciplina: "INFORMATICA",
    enunciado:
      "A função PROCV (VLOOKUP) no Microsoft Excel busca um valor na primeira coluna de uma tabela e retorna um valor correspondente em outra coluna da mesma linha, realizando uma busca vertical em tabelas organizadas.",
    resposta: "CERTO",
    explicacao:
      "PROCV (PROcura na Vertical) = VLOOKUP (Vertical Lookup). Sintaxe: PROCV(valor_procurado; matriz_tabela; num_coluna; [procurar_intervalo]). Busca na primeira coluna, retorna valor da coluna especificada.",
    dificuldade: 2,
    tags: ["Excel", "PROCV", "VLOOKUP", "busca", "tabela", "função"],
    banca_referencia: "CEBRASPE",
    assunto: "Aplicativos para edição de planilhas",
  },
];

export const totalQuestoesInformatica = questoesInformatica.length;
