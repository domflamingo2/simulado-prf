// src/constants/modosEstudo.ts

export const MODOS = [
  {
    icon: "Play",
    titulo: "Simulado Completo",
    descricao: "Experiência fiel à prova real da PRF",
    detalhes: [
      "60 questões",
      "4 horas de duração",
      "Mesma distribuição CEBRASPE",
      "Ambiente de prova real",
    ],
    cor: "blue", // ✅ agora é "blue", não "bg-blue-500"
    popular: true,
  },
  {
    icon: "Zap",
    titulo: "Modo Turbo",
    descricao: "Treino rápido para revisão intensiva",
    detalhes: [
      "50 questões aleatórias",
      "40 minutos",
      "Todas as disciplinas",
      "Foco em velocidade",
    ],
    cor: "orange", // ✅ "orange" – será mapeado para laranja no ModoCard
  },
  {
    icon: "BookOpen",
    titulo: "Treino Específico",
    descricao: "Foque na sua disciplina mais fraca",
    detalhes: [
      "Escolha a disciplina",
      "Explicação imediata",
      "Sem limite de tempo",
      "Aprendizado dirigido",
    ],
    cor: "emerald",
  },
  {
    icon: "XCircle",
    titulo: "Revisar Erros",
    descricao: "Banco inteligente de questões erradas",
    detalhes: [
      "Histórico de erros",
      "Repetição espaçada",
      "Foco em pontos fracos",
      "Remoção após acerto",
    ],
    cor: "rose",
  },
  {
    icon: "Brain",
    titulo: "Adaptativo IA",
    descricao: "Inteligência artificial personaliza seu treino",
    detalhes: [
      "Analisa seu desempenho",
      "Prioriza disciplinas fracas",
      "Maior probabilidade de erros",
      "Evolução contínua",
    ],
    cor: "purple",
  },
  {
    icon: "BarChart3",
    titulo: "Estatísticas",
    descricao: "Análise profunda do seu desempenho",
    detalhes: [
      "Gráficos de evolução",
      "Por disciplina",
      "Heatmap de estudos",
      "Comparativo temporal",
    ],
    cor: "cyan",
  },
];
