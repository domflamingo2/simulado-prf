import { Questao } from "../index";

export const questoesInformatica: Questao[] = [
  // ============================================================
  // TÓPICO 1: EDITORES DE TEXTO, PLANILHAS E APRESENTAÇÕES
  // ============================================================
  {
    id: "inf-001",
    disciplina: "INFORMATICA",
    enunciado:
      "No Microsoft Word, o atalho Ctrl+B aplica formatação em negrito ao texto selecionado, enquanto Ctrl+I aplica itálico e Ctrl+U aplica sublinhado.",
    resposta: "CERTO",
    explicacao:
      "Atalhos padrão do Word (e da maioria dos editores de texto): Ctrl+B = Bold (negrito), Ctrl+I = Italic (itálico), Ctrl+U = Underline (sublinhado). São universais em ambientes Windows.",
    dificuldade: 1,
    tags: ["Word", "atalhos", "formatação", "negrito", "itálico"],
    banca_referencia: "CEBRASPE",
    assunto: "Editores de Texto - Microsoft Word",
    ano: 2023,
  },
  {
    id: "inf-002",
    disciplina: "INFORMATICA",
    enunciado:
      "A função =SE(E(A1>10;B1<5);'Aprovado';'Reprovado') no Excel utiliza a função E() para testar duas condições simultaneamente, retornando 'Aprovado' apenas se ambas forem verdadeiras.",
    resposta: "CERTO",
    explicacao:
      "Função E() retorna VERDADEIRO apenas se TODAS as condições forem verdadeiras. Combinada com SE(), permite testes lógicos compostos. Sintaxe: =SE(E(cond1;cond2);V;F).",
    dificuldade: 2,
    tags: ["Excel", "função SE", "função E", "lógica", "condicional composta"],
    banca_referencia: "FGV",
    assunto: "Planilhas Eletrônicas - Funções Lógicas",
    ano: 2024,
  },
  {
    id: "inf-003",
    disciplina: "INFORMATICA",
    enunciado:
      "No Microsoft PowerPoint, o modo de exibição 'Classificação de Slides' permite visualizar miniaturas de todos os slides em sequência, facilitando a reorganização e aplicação de transições em massa.",
    resposta: "CERTO",
    explicacao:
      "Modo Classificação de Slides (Slide Sorter): exibe thumbnails em grade. Ideal para reordenar, excluir, aplicar transições ou verificar fluxo da apresentação. Não permite edição de conteúdo dos slides.",
    dificuldade: 1,
    tags: [
      "PowerPoint",
      "modos de exibição",
      "classificação de slides",
      "organização",
    ],
    banca_referencia: "FCC",
    assunto: "Apresentações - Microsoft PowerPoint",
    ano: 2023,
  },
  {
    id: "inf-004",
    disciplina: "INFORMATICA",
    enunciado:
      "A formatação condicional no Excel permite alterar automaticamente a aparência de células com base em regras definidas, como destacar valores acima da média ou duplicatas.",
    resposta: "CERTO",
    explicacao:
      "Formatação condicional: aplica estilos (cores, ícones, barras) dinamicamente conforme o valor da célula. Útil para análise visual de dados, dashboards e alertas automáticos.",
    dificuldade: 2,
    tags: [
      "Excel",
      "formatação condicional",
      "análise de dados",
      "visualização",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Planilhas Eletrônicas - Formatação",
    ano: 2024,
  },
  {
    id: "inf-005",
    disciplina: "INFORMATICA",
    enunciado:
      "No LibreOffice Writer, o estilo de parágrafo 'Título 1' pode ser utilizado para gerar automaticamente um sumário atualizável, desde que aplicado consistentemente aos títulos do documento.",
    resposta: "CERTO",
    explicacao:
      "Estilos de parágrafo (Título 1, Título 2, etc.) estruturam o documento semanticamente. O recurso 'Inserir > Sumário' utiliza esses estilos para criar índice navegável e atualizável.",
    dificuldade: 2,
    tags: ["LibreOffice", "Writer", "estilos", "sumário", "estruturação"],
    banca_referencia: "VUNESP",
    assunto: "Editores de Texto - LibreOffice Writer",
    ano: 2023,
  },
  {
    id: "inf-006",
    disciplina: "INFORMATICA",
    enunciado:
      "A função =CONT.SE(A1:A100;'>=7') no Excel conta quantas células no intervalo A1:A100 contêm valores maiores ou iguais a 7, ignorando células vazias ou com texto.",
    resposta: "CERTO",
    explicacao:
      "CONT.SE (COUNTIF): conta células que atendem a um critério único. Sintaxe: =CONT.SE(intervalo;critério). Critérios numéricos usam operadores como '>=', '<>', etc., entre aspas.",
    dificuldade: 2,
    tags: ["Excel", "CONT.SE", "funções estatísticas", "contagem condicional"],
    banca_referencia: "FGV",
    assunto: "Planilhas Eletrônicas - Funções Estatísticas",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 2: CONCEITOS BÁSICOS DE INTERNET
  // ============================================================
  {
    id: "inf-007",
    disciplina: "INFORMATICA",
    enunciado:
      "O protocolo DNS (Domain Name System) converte nomes de domínio legíveis (ex: www.prf.gov.br) em endereços IP numéricos, permitindo que navegadores localizem servidores na internet.",
    resposta: "CERTO",
    explicacao:
      "DNS = 'lista telefônica da internet'. Traduz domínio → IP. Sem DNS, teríamos que decorar IPs como 192.0.2.1 para acessar sites. É um protocolo fundamental da infraestrutura da web.",
    dificuldade: 1,
    tags: [
      "DNS",
      "domínio",
      "IP",
      "infraestrutura da internet",
      "resolução de nomes",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Internet - Conceitos Básicos",
    ano: 2023,
  },
  {
    id: "inf-008",
    disciplina: "INFORMATICA",
    enunciado:
      "O endereço IPv6 utiliza 128 bits para endereçamento, permitindo aproximadamente 3,4×10³⁸ endereços únicos, resolvendo a escassez de endereços do IPv4 (32 bits).",
    resposta: "CERTO",
    explicacao:
      "IPv4: 32 bits (~4,3 bilhões de endereços). IPv6: 128 bits (3,4×10³⁸ endereços). Notação hexadecimal (ex: 2001:0db8::1). Transição em andamento globalmente.",
    dificuldade: 2,
    tags: ["IPv6", "IPv4", "endereçamento IP", "esgotamento de IPv4"],
    banca_referencia: "FGV",
    assunto: "Internet - Protocolos",
    ano: 2024,
  },
  {
    id: "inf-009",
    disciplina: "INFORMATICA",
    enunciado:
      "O cache do navegador armazena localmente recursos de sites (imagens, CSS, JS) para acelerar carregamentos futuros, mas pode exibir versões desatualizadas de páginas se não for limpo.",
    resposta: "CERTO",
    explicacao:
      "Cache = memória temporária local. Vantagem: velocidade. Desvantagem: conteúdo desatualizado. Solução: Ctrl+F5 (forçar recarregamento) ou limpar cache nas configurações.",
    dificuldade: 1,
    tags: ["cache", "navegador", "otimização", "atualização de conteúdo"],
    banca_referencia: "CEBRASPE",
    assunto: "Navegadores Web",
    ano: 2023,
  },
  {
    id: "inf-010",
    disciplina: "INFORMATICA",
    enunciado:
      "O download de arquivos via protocolo FTP (File Transfer Protocol) é sempre criptografado por padrão, garantindo confidencialidade durante a transferência.",
    resposta: "ERRADO",
    explicacao:
      "FTP tradicional NÃO é criptografado (dados trafegam em texto claro). Para segurança, deve-se usar FTPS (FTP sobre SSL/TLS) ou SFTP (SSH File Transfer Protocol).",
    dificuldade: 2,
    tags: ["FTP", "FTPS", "SFTP", "criptografia", "transferência de arquivos"],
    banca_referencia: "FCC",
    assunto: "Internet - Protocolos de Transferência",
    ano: 2022,
  },

  // ============================================================
  // TÓPICO 3: CORREIO ELETRÔNICO, BUSCA E PESQUISA
  // ============================================================
  {
    id: "inf-011",
    disciplina: "INFORMATICA",
    enunciado:
      "O protocolo SMTP é utilizado para envio de e-mails, enquanto POP3 e IMAP são utilizados para recebimento, sendo que o IMAP mantém as mensagens sincronizadas entre servidor e cliente.",
    resposta: "CERTO",
    explicacao:
      "SMTP (Simple Mail Transfer Protocol): envio. POP3: baixa e-mails para o dispositivo (pode excluir do servidor). IMAP: sincroniza com servidor, mantendo cópia e organização em múltiplos dispositivos.",
    dificuldade: 2,
    tags: ["SMTP", "POP3", "IMAP", "e-mail", "protocolos"],
    banca_referencia: "CEBRASPE",
    assunto: "Correio Eletrônico - Protocolos",
    ano: 2024,
  },
  {
    id: "inf-012",
    disciplina: "INFORMATICA",
    enunciado:
      "O operador de busca 'site:' no Google restringe os resultados a um domínio específico, como 'site:gov.br' para buscar apenas em sites do governo brasileiro.",
    resposta: "CERTO",
    explicacao:
      "Operadores de busca avançada: site: (domínio), filetype: (extensão), 'frase exata', - (exclusão), OR (ou lógico). Combinam-se para refinar pesquisas com precisão.",
    dificuldade: 1,
    tags: ["Google", "operadores de busca", "pesquisa avançada", "site:"],
    banca_referencia: "VUNESP",
    assunto: "Ferramentas de Busca e Pesquisa",
    ano: 2023,
  },
  {
    id: "inf-013",
    disciplina: "INFORMATICA",
    enunciado:
      "O spam é caracterizado como envio em massa de mensagens eletrônicas não solicitadas, geralmente com fins comerciais ou maliciosos, sendo combatido por filtros baseados em reputação, conteúdo e comportamento.",
    resposta: "CERTO",
    explicacao:
      "Spam = e-mail indesejado em massa. Filtros usam: blacklists, análise de conteúdo (palavras-chave), autenticação (SPF, DKIM, DMARC) e machine learning para classificação.",
    dificuldade: 1,
    tags: ["spam", "e-mail", "filtros", "segurança", "autenticação"],
    banca_referencia: "CEBRASPE",
    assunto: "Correio Eletrônico - Segurança",
    ano: 2023,
  },
  {
    id: "inf-014",
    disciplina: "INFORMATICA",
    enunciado:
      "O anexo de e-mail com extensão .exe é bloqueado por padrão na maioria dos provedores por representar risco de execução de código malicioso no dispositivo do destinatário.",
    resposta: "CERTO",
    explicacao:
      "Extensões executáveis (.exe, .bat, .scr, .js) são vetores comuns de malware. Provedores bloqueiam ou exigem confirmação explícita. Recomenda-se usar nuvem ou compactação com senha para envio seguro.",
    dificuldade: 2,
    tags: ["anexo", "extensão .exe", "malware", "segurança de e-mail"],
    banca_referencia: "FGV",
    assunto: "Correio Eletrônico - Boas Práticas",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 4: INTERNET E INTRANET
  // ============================================================
  {
    id: "inf-015",
    disciplina: "INFORMATICA",
    enunciado:
      "A Intranet é uma rede privada baseada em protocolos da internet (TCP/IP, HTTP), acessível apenas a usuários autorizados de uma organização, diferindo da Internet por seu alcance restrito.",
    resposta: "CERTO",
    explicacao:
      "Intranet = internet corporativa fechada. Usa mesmas tecnologias da web, mas com acesso controlado (VPN, autenticação). Extranet estende acesso a parceiros externos de forma segura.",
    dificuldade: 1,
    tags: ["intranet", "extranet", "rede privada", "TCP/IP", "acesso restrito"],
    banca_referencia: "CEBRASPE",
    assunto: "Internet e Intranet - Conceitos",
    ano: 2023,
  },
  {
    id: "inf-016",
    disciplina: "INFORMATICA",
    enunciado:
      "A VPN (Virtual Private Network) cria um túnel criptografado sobre uma rede pública (como a internet), permitindo acesso seguro a recursos da Intranet corporativa a partir de locais remotos.",
    resposta: "CERTO",
    explicacao:
      "VPN = conexão segura via internet. Criptografa todo o tráfego entre cliente e servidor corporativo. Essencial para teletrabalho, acesso a sistemas internos e proteção em redes públicas.",
    dificuldade: 2,
    tags: [
      "VPN",
      "túnel criptografado",
      "acesso remoto",
      "segurança",
      "teletrabalho",
    ],
    banca_referencia: "FCC",
    assunto: "Internet e Intranet - VPN",
    ano: 2024,
  },
  {
    id: "inf-017",
    disciplina: "INFORMATICA",
    enunciado:
      "O proxy atua como intermediário entre o cliente e a internet, podendo filtrar conteúdo, cachear páginas para acelerar acesso e registrar logs de navegação para auditoria.",
    resposta: "CERTO",
    explicacao:
      "Proxy = intermediário de rede. Funções: controle de acesso (bloqueio de sites), cache (performance), anonimato (oculta IP real) e logging (auditoria). Pode ser transparente ou explícito.",
    dificuldade: 2,
    tags: [
      "proxy",
      "intermediário",
      "cache",
      "filtro de conteúdo",
      "auditoria",
    ],
    banca_referencia: "FGV",
    assunto: "Internet e Intranet - Proxy",
    ano: 2023,
  },
  {
    id: "inf-018",
    disciplina: "INFORMATICA",
    enunciado:
      "O armazenamento em nuvem (cloud computing) elimina a necessidade de backup local, pois os provedores garantem 100% de disponibilidade e proteção contra perda de dados em qualquer circunstância.",
    resposta: "ERRADO",
    explicacao:
      "Cloud NÃO substitui backup local. Regra 3-2-1: 3 cópias, 2 mídias diferentes, 1 fora do local. Cloud pode sofrer falhas, ataques ou exclusão acidental. Backup local é camada adicional de proteção.",
    dificuldade: 3,
    tags: [
      "cloud computing",
      "backup",
      "regra 3-2-1",
      "resiliência",
      "continuidade",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Tecnologia da Informação - Nuvem",
    ano: 2024,
  },

  // ============================================================
  // TÓPICO 5: TI E SEGURANÇA DA INFORMAÇÃO
  // ============================================================
  {
    id: "inf-019",
    disciplina: "INFORMATICA",
    enunciado:
      "Os pilares da Segurança da Informação são Confidencialidade, Integridade, Disponibilidade, Autenticidade e Não Repúdio, conforme definido pela norma ABNT NBR ISO/IEC 27001.",
    resposta: "CERTO",
    explicacao:
      "CIA+ (Confidencialidade, Integridade, Disponibilidade) + Autenticidade + Não Repúdio formam a base da segurança. Normas como ISO 27001 e LGPD orientam implementação de controles.",
    dificuldade: 1,
    tags: ["segurança da informação", "CIA", "ISO 27001", "pilares", "LGPD"],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação - Conceitos Fundamentais",
    ano: 2023,
  },
  {
    id: "inf-020",
    disciplina: "INFORMATICA",
    enunciado:
      "O ransomware é um tipo de malware que criptografa os arquivos do usuário e exige pagamento de resgate (geralmente em criptomoedas) para fornecer a chave de descriptografia.",
    resposta: "CERTO",
    explicacao:
      "Ransomware = sequestro de dados. Criptografa arquivos locais e de rede. Prevenção: backup offline, atualizações, antivírus, treinamento. Não se recomenda pagar resgate (não garante recuperação).",
    dificuldade: 1,
    tags: ["ransomware", "malware", "criptografia", "resgate", "backup"],
    banca_referencia: "FGV",
    assunto: "Segurança da Informação - Ameaças",
    ano: 2024,
  },
  {
    id: "inf-021",
    disciplina: "INFORMATICA",
    enunciado:
      "A autenticação de dois fatores (2FA) exige duas formas distintas de comprovação de identidade (ex: senha + token no celular), aumentando significativamente a segurança do acesso a sistemas.",
    resposta: "CERTO",
    explicacao:
      "2FA/MFA = algo que você sabe (senha) + algo que você tem (token/app) ou algo que você é (biometria). Reduz drasticamente risco de acesso indevido mesmo com senha vazada.",
    dificuldade: 1,
    tags: ["2FA", "MFA", "autenticação", "segurança de acesso", "token"],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação - Autenticação",
    ano: 2023,
  },
  {
    id: "inf-022",
    disciplina: "INFORMATICA",
    enunciado:
      "O backup completo copia todos os dados selecionados, enquanto o backup diferencial copia apenas os arquivos alterados desde o último backup completo, exigindo apenas o último completo + último diferencial para restauração.",
    resposta: "CERTO",
    explicacao:
      "Backup completo: tudo, lento, ocupa espaço. Diferencial: só mudanças desde o último completo. Restauração: completo + último diferencial. Mais rápido que incremental para recuperação.",
    dificuldade: 2,
    tags: [
      "backup completo",
      "backup diferencial",
      "restauração",
      "estratégia de backup",
    ],
    banca_referencia: "FCC",
    assunto: "Segurança da Informação - Backup",
    ano: 2024,
  },
  {
    id: "inf-023",
    disciplina: "INFORMATICA",
    enunciado:
      "A LGPD (Lei Geral de Proteção de Dados) aplica-se a qualquer operação de tratamento de dados pessoais realizada no Brasil, independentemente de o controlador estar sediado no país ou no exterior.",
    resposta: "CERTO",
    explicacao:
      "Art. 3º da Lei 13.709/2018: LGPD tem aplicação extraterritorial. Aplica-se se: operação ocorrer no Brasil, dados coletados no Brasil, ou tratamento visar oferta de bens/serviços a pessoas no Brasil.",
    dificuldade: 3,
    tags: [
      "LGPD",
      "Lei 13.709/2018",
      "tratamento de dados",
      "aplicação extraterritorial",
    ],
    fonte_legal: ["Art. 3º, Lei 13.709/2018"],
    banca_referencia: "FGV",
    assunto: "Segurança da Informação - LGPD",
    ano: 2024,
  },
  {
    id: "inf-024",
    disciplina: "INFORMATICA",
    enunciado:
      "O firewall de próxima geração (NGFW) combina funcionalidades tradicionais de filtragem de pacotes com inspeção profunda de pacotes (DPI), controle de aplicativos e prevenção de intrusões (IPS).",
    resposta: "CERTO",
    explicacao:
      "NGFW = evolução do firewall tradicional. Inclui: DPI (analisa conteúdo, não só cabeçalho), controle por aplicativo (bloqueia Facebook, Torrent), IPS (detecta/expulsa ataques), integração com threat intelligence.",
    dificuldade: 3,
    tags: ["firewall", "NGFW", "DPI", "IPS", "segurança de rede"],
    banca_referencia: "VUNESP",
    assunto: "Segurança da Informação - Firewalls",
    ano: 2023,
  },

  // ============================================================
  // QUESTÕES DE FIXAÇÃO E ATUALIZAÇÃO TECNOLÓGICA
  // ============================================================
  {
    id: "inf-025",
    disciplina: "INFORMATICA",
    enunciado:
      "A função =PROCH(A1;B1:D10;3;FALSO) no Excel realiza uma busca horizontal na primeira linha do intervalo B1:D10, retornando o valor da terceira linha da coluna correspondente ao valor de A1.",
    resposta: "ERRADO",
    explicacao:
      "PROCH (PROcura Horizontal) busca na PRIMEIRA LINHA (não coluna) e retorna valor de uma LINHA abaixo. Sintaxe: PROCH(valor; matriz; num_linha; [aproximado]). Para busca vertical, usar PROCV.",
    dificuldade: 3,
    tags: ["Excel", "PROCH", "HLOOKUP", "busca horizontal", "função"],
    banca_referencia: "CEBRASPE",
    assunto: "Planilhas Eletrônicas - Funções de Busca",
    ano: 2024,
  },
  {
    id: "inf-026",
    disciplina: "INFORMATICA",
    enunciado:
      "O modo de exibição 'Leitura' no Microsoft Word otimiza a visualização do documento em telas, ocultando barras de ferramentas e ajustando o layout para leitura contínua, sem alterar o conteúdo.",
    resposta: "CERTO",
    explicacao:
      "Modo Leitura (View > Read Mode): foco no conteúdo, navegação por páginas, sem distrações de edição. Ideal para revisão. Não altera formatação ou estrutura do documento.",
    dificuldade: 1,
    tags: ["Word", "modo leitura", "visualização", "produtividade"],
    banca_referencia: "FCC",
    assunto: "Editores de Texto - Modos de Exibição",
    ano: 2023,
  },
  {
    id: "inf-027",
    disciplina: "INFORMATICA",
    enunciado:
      "O ataque de engenharia social explora a psicologia humana para manipular vítimas a revelar informações confidenciais ou realizar ações que comprometem a segurança, sem necessariamente usar ferramentas técnicas sofisticadas.",
    resposta: "CERTO",
    explicacao:
      "Engenharia social = manipulação psicológica. Exemplos: phishing, pretexting, baiting. Defesa: treinamento, política de segurança, verificação de identidade, desconfiar de urgência/pressão.",
    dificuldade: 2,
    tags: [
      "engenharia social",
      "phishing",
      "segurança comportamental",
      "conscientização",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Segurança da Informação - Engenharia Social",
    ano: 2024,
  },
  {
    id: "inf-028",
    disciplina: "INFORMATICA",
    enunciado:
      "A criptografia de disco completo (ex: BitLocker no Windows, FileVault no macOS) protege os dados em repouso, exigindo autenticação antes do carregamento do sistema operacional.",
    resposta: "CERTO",
    explicacao:
      "Criptografia de disco: transforma todos os dados do disco em texto cifrado. Sem chave/senha, os dados são inacessíveis mesmo se o disco for removido. Essencial para proteção contra roubo físico.",
    dificuldade: 2,
    tags: [
      "criptografia de disco",
      "BitLocker",
      "FileVault",
      "dados em repouso",
    ],
    banca_referencia: "FGV",
    assunto: "Segurança da Informação - Criptografia",
    ano: 2023,
  },
  {
    id: "inf-029",
    disciplina: "INFORMATICA",
    enunciado:
      "O atalho Ctrl+Shift+S no Microsoft Word abre a caixa de diálogo 'Salvar Como', permitindo salvar o documento com novo nome, formato ou localização, sem substituir o arquivo original.",
    resposta: "CERTO",
    explicacao:
      "Ctrl+Shift+S = Salvar Como (Save As). Útil para criar versões, mudar formato (.docx para .pdf), ou salvar em local diferente. Ctrl+S = Salvar (sobrescreve o atual).",
    dificuldade: 1,
    tags: ["Word", "atalhos", "Salvar Como", "Ctrl+Shift+S"],
    banca_referencia: "CEBRASPE",
    assunto: "Editores de Texto - Atalhos",
    ano: 2022,
  },
  {
    id: "inf-030",
    disciplina: "INFORMATICA",
    enunciado:
      "O protocolo HTTPS utiliza a porta TCP 443 por padrão, enquanto o HTTP utiliza a porta 80, sendo que firewalls podem bloquear uma e permitir a outra para controle de tráfego web.",
    resposta: "CERTO",
    explicacao:
      "Portas padrão: HTTP = 80, HTTPS = 443, FTP = 21, SSH = 22. Firewalls filtram por porta/protocolo. Redirecionar HTTP para HTTPS é prática recomendada de segurança.",
    dificuldade: 2,
    tags: ["HTTPS", "HTTP", "portas TCP", "firewall", "segurança de rede"],
    banca_referencia: "FCC",
    assunto: "Internet - Protocolos e Portas",
    ano: 2024,
  },
  {
    id: "inf-031",
    disciplina: "INFORMATICA",
    enunciado:
      "A macro no Excel é um conjunto de comandos e funções armazenados em um módulo VBA (Visual Basic for Applications) que pode ser executado para automatizar tarefas repetitivas.",
    resposta: "CERTO",
    explicacao:
      "Macro = automação via VBA. Grava ações ou programa em VB. Cuidado: macros podem conter malware. Habilitar apenas de fontes confiáveis. Extensões .xlsm suportam macros; .xlsx não.",
    dificuldade: 2,
    tags: ["Excel", "macro", "VBA", "automação", "segurança"],
    banca_referencia: "VUNESP",
    assunto: "Planilhas Eletrônicas - Automação",
    ano: 2023,
  },
  {
    id: "inf-032",
    disciplina: "INFORMATICA",
    enunciado:
      "O navegador Google Chrome permite sincronizar favoritos, senhas, histórico e extensões entre dispositivos mediante login com conta Google, facilitando a continuidade da navegação.",
    resposta: "CERTO",
    explicacao:
      "Sincronização do Chrome: usa conta Google para replicar configurações entre dispositivos. Requer autenticação. Pode ser configurado para sincronizar seletivamente (ex: só favoritos, sem senhas).",
    dificuldade: 1,
    tags: [
      "Chrome",
      "sincronização",
      "conta Google",
      "navegação multiplataforma",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Navegadores Web - Recursos",
    ano: 2024,
  },
  {
    id: "inf-033",
    disciplina: "INFORMATICA",
    enunciado:
      "A assinatura digital baseada em certificado ICP-Brasil garante autenticidade, integridade e não repúdio de documentos eletrônicos, tendo a mesma validade jurídica que a assinatura manuscrita.",
    resposta: "CERTO",
    explicacao:
      "MP 2.200-2/2001 e Lei 14.063/2020: certificado digital ICP-Brasil tem fé pública. Garante: autoria (autenticidade), não alteração (integridade) e impossibilidade de negar autoria (não repúdio).",
    dificuldade: 2,
    tags: [
      "assinatura digital",
      "ICP-Brasil",
      "certificado digital",
      "validade jurídica",
    ],
    fonte_legal: ["MP 2.200-2/2001", "Lei 14.063/2020"],
    banca_referencia: "FGV",
    assunto: "Segurança da Informação - Assinatura Digital",
    ano: 2024,
  },
  {
    id: "inf-034",
    disciplina: "INFORMATICA",
    enunciado:
      "O recurso 'Controlar Alterações' no Microsoft Word registra edições feitas no documento, permitindo revisão colaborativa com aceitação ou rejeição individual de cada modificação.",
    resposta: "CERTO",
    explicacao:
      "Controlar Alterações (Review > Track Changes): marca inserções, exclusões e formatações. Ideal para revisão em equipe. Revisor pode aceitar/rejeitar mudanças individualmente ou em bloco.",
    dificuldade: 1,
    tags: [
      "Word",
      "controlar alterações",
      "revisão colaborativa",
      "track changes",
    ],
    banca_referencia: "CEBRASPE",
    assunto: "Editores de Texto - Colaboração",
    ano: 2023,
  },
];

export const totalQuestoesInformatica = questoesInformatica.length;
