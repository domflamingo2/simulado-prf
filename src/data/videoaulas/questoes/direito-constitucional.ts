// src/data/videoaulas/questoes/direito-constitucional.ts

import { DisciplinaVideo, Video } from "../tipos";

import { duracaoSegundos } from "@/utils/videoDuration";
import { getYouTubeThumbnail } from "@/utils/youtubeUtils";

const disciplina: DisciplinaVideo = "DIREITO_CONSTITUCIONAL";

const videosDireitoConstitucional: Video[] = [
  {
    id: "dc-1",
    disciplina,
    titulo: "Direitos e Garantias Fundamentais",
    descricao:
      "Art. 5º CF - interpretação para a PRF. Direitos individuais, coletivos e remédios constitucionais.",
    duracao: "1h20min",
    duracaoSegundos: duracaoSegundos("1h20min"),
    url: "https://www.youtube.com/watch?v=exemplo1",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo1"),
    nivel: "iniciante",
    tags: ["direitos-fundamentais", "art5", "garantias"],
    autor: "Prof. Dr. Roberto",
  },
  {
    id: "dc-2",
    disciplina,
    titulo: "Nacionalidade e Cidadania",
    descricao:
      "Diferenças entre nacionalidade originária e derivada. Direitos políticos e perda da cidadania.",
    duracao: "38:15",
    duracaoSegundos: duracaoSegundos("38:15"),
    url: "https://www.youtube.com/watch?v=exemplo2",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo2"),
    nivel: "intermediario",
    tags: ["nacionalidade", "cidadania", "direitos-politicos"],
    autor: "Profa. Luciana",
  },
  {
    id: "dc-3",
    disciplina,
    titulo: "Organização do Estado e Poderes",
    descricao:
      "Repartição de competências, organização político-administrativa e funções dos poderes.",
    duracao: "1h10min",
    duracaoSegundos: duracaoSegundos("1h10min"),
    url: "https://www.youtube.com/watch?v=exemplo3",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo3"),
    nivel: "intermediario",
    tags: ["organizacao-estado", "poderes", "competencias"],
    autor: "Prof. Dr. Roberto",
  },
];

export default videosDireitoConstitucional;