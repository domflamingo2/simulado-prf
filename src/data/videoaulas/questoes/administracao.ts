// src/data/videoaulas/questoes/administracao.ts

import { DisciplinaVideo, Video } from "../tipos";

import { duracaoSegundos } from "@/utils/videoDuration";
import { getYouTubeThumbnail } from "@/utils/youtubeUtils";

const disciplina: DisciplinaVideo = "ADMINISTRACAO";

const videosAdministracao: Video[] = [
  {
    id: "adm-1",
    disciplina,
    titulo: "Processos Organizacionais",
    descricao:
      "Planejamento, organização, direção e controle nas organizações públicas.",
    duracao: "52:30",
    duracaoSegundos: duracaoSegundos("52:30"),
    url: "https://www.youtube.com/watch?v=exemplo1",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo1"),
    nivel: "iniciante",
    tags: ["processos", "planejamento", "organizacao"],
    autor: "Prof. Marcos",
  },
  {
    id: "adm-2",
    disciplina,
    titulo: "Gestão de Pessoas no Setor Público",
    descricao:
      "Liderança, motivação, comunicação e gestão de equipes na administração pública.",
    duracao: "48:20",
    duracaoSegundos: duracaoSegundos("48:20"),
    url: "https://www.youtube.com/watch?v=exemplo2",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo2"),
    nivel: "intermediario",
    tags: ["gestao-pessoas", "lideranca", "motivacao"],
    autor: "Profa. Beatriz",
  },
  {
    id: "adm-3",
    disciplina,
    titulo: "Teorias da Administração",
    descricao:
      "Escolas clássica, humanística, burocrática e teorias contemporâneas.",
    duracao: "1h10min",
    duracaoSegundos: duracaoSegundos("1h10min"),
    url: "https://www.youtube.com/watch?v=exemplo3",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo3"),
    nivel: "intermediario",
    tags: ["teorias", "administracao", "classica"],
    autor: "Prof. Marcos",
  },
];

export default videosAdministracao;
