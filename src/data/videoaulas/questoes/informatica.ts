// src/data/videoaulas/questoes/informatica.ts

import { DisciplinaVideo, Video } from "../tipos";

import { duracaoSegundos } from "@/utils/videoDuration";
import { getYouTubeThumbnail } from "@/utils/youtubeUtils";

const disciplina: DisciplinaVideo = "INFORMATICA";

const videosInformatica: Video[] = [
  {
    id: "info-1",
    disciplina,
    titulo: "Pacote Office (Word, Excel e PowerPoint)",
    descricao:
      "Principais atalhos e funções cobradas em concursos. Word, Excel e PowerPoint.",
    duracao: "1h05min",
    duracaoSegundos: duracaoSegundos("1h05min"),
    url: "https://www.youtube.com/watch?v=exemplo1",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo1"),
    nivel: "iniciante",
    tags: ["office", "word", "excel", "powerpoint"],
    autor: "Prof. Eduardo",
  },
  {
    id: "info-2",
    disciplina,
    titulo: "Segurança da Informação",
    descricao:
      "Malware, firewall, backup, criptografia e políticas de segurança.",
    duracao: "43:20",
    duracaoSegundos: duracaoSegundos("43:20"),
    url: "https://www.youtube.com/watch?v=exemplo2",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo2"),
    nivel: "intermediario",
    tags: ["seguranca", "malware", "criptografia"],
    autor: "Profa. Silvia",
  },
  {
    id: "info-3",
    disciplina,
    titulo: "Navegadores e Internet",
    descricao:
      "Navegadores, protocolos, segurança online e ferramentas da web.",
    duracao: "35:50",
    duracaoSegundos: duracaoSegundos("35:50"),
    url: "https://www.youtube.com/watch?v=exemplo3",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo3"),
    nivel: "iniciante",
    tags: ["navegadores", "internet", "protocolos"],
    autor: "Prof. Eduardo",
  },
  {
    id: "info-4",
    disciplina,
    titulo: "Hardware e Sistemas Operacionais",
    descricao:
      "Componentes de computador, periféricos, Windows e Linux para concursos.",
    duracao: "55:00",
    duracaoSegundos: duracaoSegundos("55:00"),
    url: "https://www.youtube.com/watch?v=exemplo4",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo4"),
    nivel: "intermediario",
    tags: ["hardware", "sistemas-operacionais", "windows"],
    autor: "Profa. Silvia",
  },
];

export default videosInformatica;
