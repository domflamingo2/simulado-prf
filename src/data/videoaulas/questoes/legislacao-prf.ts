// src/data/videoaulas/questoes/legislacao-prf.ts

import { DisciplinaVideo, Video } from "../tipos";

import { duracaoSegundos } from "@/utils/videoDuration";
import { getYouTubeThumbnail } from "@/utils/youtubeUtils";

const disciplina: DisciplinaVideo = "LEGISLACAO_PRF";

const videosLegislacaoPRF: Video[] = [
  {
    id: "leg-1",
    disciplina,
    titulo: "CTB - Infrações e Penalidades",
    descricao:
      "Tabela completa de infrações, pontuação e penalidades do Código de Trânsito Brasileiro.",
    duracao: "1h30min",
    duracaoSegundos: duracaoSegundos("1h30min"),
    url: "https://www.youtube.com/watch?v=exemplo1",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo1"),
    nivel: "iniciante",
    tags: ["ctb", "infracoes", "penalidades", "multas"],
    autor: "Prof. Rodrigo",
  },
  {
    id: "leg-2",
    disciplina,
    titulo: "Sistema Nacional de Trânsito",
    descricao:
      "Competências do CONTRAN, CETRAN, JARI, DENATRAN e PRF no sistema de trânsito.",
    duracao: "45:50",
    duracaoSegundos: duracaoSegundos("45:50"),
    url: "https://www.youtube.com/watch?v=exemplo2",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo2"),
    nivel: "intermediario",
    tags: ["sistema", "contrans", "orgaos"],
    autor: "Profa. Patricia",
  },
  {
    id: "leg-3",
    disciplina,
    titulo: "Medidas Administrativas e Recursos",
    descricao:
      "Medidas administrativas do CTB, prazos e recursos no processo de trânsito.",
    duracao: "52:20",
    duracaoSegundos: duracaoSegundos("52:20"),
    url: "https://www.youtube.com/watch?v=exemplo3",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo3"),
    nivel: "intermediario",
    tags: ["medidas", "recursos", "defesa"],
    autor: "Prof. Rodrigo",
  },
  {
    id: "leg-4",
    disciplina,
    titulo: "Sinalização de Trânsito",
    descricao:
      "Sinalização vertical, horizontal, dispositivos e gestos de agentes.",
    duracao: "48:30",
    duracaoSegundos: duracaoSegundos("48:30"),
    url: "https://www.youtube.com/watch?v=exemplo4",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo4"),
    nivel: "iniciante",
    tags: ["sinalizacao", "transito", "placas"],
    autor: "Profa. Patricia",
  },
  {
    id: "leg-5",
    disciplina,
    titulo: "Direção Defensiva e Primeiros Socorros",
    descricao:
      "Técnicas de direção defensiva, condutas em acidentes e primeiros socorros.",
    duracao: "1h15min",
    duracaoSegundos: duracaoSegundos("1h15min"),
    url: "https://www.youtube.com/watch?v=exemplo5",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo5"),
    nivel: "avancado",
    tags: ["direcao-defensiva", "primeiros-socorros", "acidentes"],
    autor: "Prof. Rodrigo",
  },
];

export default videosLegislacaoPRF;
