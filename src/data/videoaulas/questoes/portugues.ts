// src/data/videoaulas/questoes/portugues.ts

import { DisciplinaVideo, Video } from "../tipos";

import { duracaoSegundos } from "@/utils/videoDuration";
import { getYouTubeThumbnail } from "@/utils/youtubeUtils";

const disciplina: DisciplinaVideo = "PORTUGUES";

const videosPortugues: Video[] = [
  {
    id: "port-1",
    disciplina,
    titulo: "Compreensão e Interpretação de Textos",
    descricao:
      "Estratégias para interpretar textos da CEBRASPE/CESPE. Aprenda a identificar ideias principais, inferências e pressupostos.",
    duracao: "52:30",
    duracaoSegundos: duracaoSegundos("52:30"),
    url: "https://www.youtube.com/watch?v=8Qn_spdM5Zg",
    thumbnail: getYouTubeThumbnail(
      "https://www.youtube.com/watch?v=8Qn_spdM5Zg",
    ),
    nivel: "iniciante",
    tags: ["interpretacao", "leitura", "compreensao"],
    autor: "Prof. André",
  },
  {
    id: "port-2",
    disciplina,
    titulo: "Ortografia e Acentuação Gráfica",
    descricao:
      "Regras essenciais com exercícios comentados. Domine as novas regras do acordo ortográfico.",
    duracao: "48:15",
    duracaoSegundos: duracaoSegundos("48:15"),
    url: "https://www.youtube.com/watch?v=2MOk7N9QJp8",
    thumbnail: getYouTubeThumbnail(
      "https://www.youtube.com/watch?v=2MOk7N9QJp8",
    ),
    nivel: "iniciante",
    tags: ["ortografia", "acentuacao", "gramatica"],
    autor: "Profa. Carla",
  },
  {
    id: "port-3",
    disciplina,
    titulo: "Crase: Dicas Definitivas",
    descricao:
      "Nunca mais erre crase na prova. Macetes e regras infalíveis para acertar todas as questões.",
    duracao: "35:40",
    duracaoSegundos: duracaoSegundos("35:40"),
    url: "https://www.youtube.com/watch?v=YQ8y7M0M8mI",
    thumbnail: getYouTubeThumbnail(
      "https://www.youtube.com/watch?v=YQ8y7M0M8mI",
    ),
    nivel: "intermediario",
    tags: ["crase", "gramatica", "acentuacao"],
    autor: "Prof. André",
  },
  {
    id: "port-4",
    disciplina,
    titulo: "Concordância Verbal e Nominal",
    descricao:
      "Tudo sobre concordância para a CEBRASPE. Casos especiais e questões comentadas.",
    duracao: "1h05min",
    duracaoSegundos: duracaoSegundos("1h05min"),
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: getYouTubeThumbnail(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    ),
    nivel: "intermediario",
    tags: ["concordancia", "gramatica", "sintaxe"],
    autor: "Profa. Carla",
  },
  {
    id: "port-5",
    disciplina,
    titulo: "Regência Verbal e Nominal",
    descricao:
      "Domine a regência e nunca mais erre questões sobre transitividade verbal e nominal.",
    duracao: "58:20",
    duracaoSegundos: duracaoSegundos("58:20"),
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: getYouTubeThumbnail(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    ),
    nivel: "avancado",
    tags: ["regencia", "gramatica", "sintaxe"],
    autor: "Prof. André",
  },
];

export default videosPortugues;
