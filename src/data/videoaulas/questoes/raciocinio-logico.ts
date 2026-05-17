// src/data/videoaulas/questoes/raciocinio-logico.ts

import { DisciplinaVideo, Video } from "../tipos";

import { duracaoSegundos } from "@/utils/videoDuration";
import { getYouTubeThumbnail } from "@/utils/youtubeUtils";

const disciplina: DisciplinaVideo = "RACIOCINIO_LOGICO";

const videosRaciocinioLogico: Video[] = [
  {
    id: "rl-1",
    disciplina,
    titulo: "Tabelas Verdade e Proposições",
    descricao:
      "Lógica sentencial para CEBRASPE. Proposições simples e compostas, conectivos lógicos.",
    duracao: "1h12min",
    duracaoSegundos: duracaoSegundos("1h12min"),
    url: "https://www.youtube.com/watch?v=exemplo1",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo1"),
    nivel: "iniciante",
    tags: ["logica", "tabelas-verdade", "proposicoes"],
    autor: "Prof. Carlos",
  },
  {
    id: "rl-2",
    disciplina,
    titulo: "Equivalências Lógicas e Leis de De Morgan",
    descricao:
      "Resolução rápida de questões com equivalências. Leis de De Morgan aplicadas.",
    duracao: "49:30",
    duracaoSegundos: duracaoSegundos("49:30"),
    url: "https://www.youtube.com/watch?v=exemplo2",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo2"),
    nivel: "intermediario",
    tags: ["equivalencias", "de-morgan", "logica"],
    autor: "Prof. Carlos",
  },
  {
    id: "rl-3",
    disciplina,
    titulo: "Probabilidade e Análise Combinatória",
    descricao:
      "Fórmulas e macetes para probabilidade, combinações, arranjos e permutações.",
    duracao: "58:45",
    duracaoSegundos: duracaoSegundos("58:45"),
    url: "https://www.youtube.com/watch?v=exemplo3",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo3"),
    nivel: "avancado",
    tags: ["probabilidade", "combinatoria", "matematica"],
    autor: "Profa. Mariana",
  },
  {
    id: "rl-4",
    disciplina,
    titulo: "Argumentação e Diagramas Lógicos",
    descricao:
      "Estrutura de argumentos, premissas, conclusões e diagramas de Venn.",
    duracao: "55:00",
    duracaoSegundos: duracaoSegundos("55:00"),
    url: "https://www.youtube.com/watch?v=exemplo4",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo4"),
    nivel: "intermediario",
    tags: ["argumentacao", "diagramas", "logica"],
    autor: "Prof. Carlos",
  },
  {
    id: "rl-5",
    disciplina,
    titulo: "Problemas de Raciocínio Quantitativo",
    descricao:
      "Regra de três, porcentagem, juros e problemas matemáticos para concursos.",
    duracao: "1h05min",
    duracaoSegundos: duracaoSegundos("1h05min"),
    url: "https://www.youtube.com/watch?v=exemplo5",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo5"),
    nivel: "avancado",
    tags: ["quantitativo", "porcentagem", "matematica"],
    autor: "Profa. Mariana",
  },
];

export default videosRaciocinioLogico;
