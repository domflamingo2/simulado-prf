// src/data/videoaulas/questoes/etica.ts

import { DisciplinaVideo, Video } from "../tipos";

import { duracaoSegundos } from "@/utils/videoDuration";
import { getYouTubeThumbnail } from "@/utils/youtubeUtils";

const disciplina: DisciplinaVideo = "ETICA";

const videosEtica: Video[] = [
  {
    id: "et-1",
    disciplina,
    titulo: "Código de Ética do Servidor Público",
    descricao:
      "Análise completa do Decreto 1.171/94 com questões comentadas. Principais artigos e penalidades.",
    duracao: "50:20",
    duracaoSegundos: duracaoSegundos("50:20"),
    url: "https://www.youtube.com/watch?v=exemplo1",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo1"),
    nivel: "iniciante",
    tags: ["etica", "codigo", "decreto", "servidor"],
    autor: "Prof. Ricardo",
  },
  {
    id: "et-2",
    disciplina,
    titulo: "Princípios da Administração Pública",
    descricao:
      "Legalidade, impessoalidade, moralidade, publicidade e eficiência na prática.",
    duracao: "39:45",
    duracaoSegundos: duracaoSegundos("39:45"),
    url: "https://www.youtube.com/watch?v=exemplo2",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo2"),
    nivel: "iniciante",
    tags: ["principios", "administracao", "moralidade"],
    autor: "Profa. Fernanda",
  },
  {
    id: "et-3",
    disciplina,
    titulo: "Comissão de Ética e Processo Administrativo",
    descricao: "Funcionamento da comissão, sindicância e processo ético.",
    duracao: "45:10",
    duracaoSegundos: duracaoSegundos("45:10"),
    url: "https://www.youtube.com/watch?v=exemplo3",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo3"),
    nivel: "intermediario",
    tags: ["comissao", "processo", "sindicancia"],
    autor: "Prof. Ricardo",
  },
  {
    id: "et-4",
    disciplina,
    titulo: "Vedações e Deveres do Servidor",
    descricao:
      "O que o servidor público pode e não pode fazer. Implicações legais.",
    duracao: "52:30",
    duracaoSegundos: duracaoSegundos("52:30"),
    url: "https://www.youtube.com/watch?v=exemplo4",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo4"),
    nivel: "intermediario",
    tags: ["vedacoes", "deveres", "servidor"],
    autor: "Profa. Fernanda",
  },
];

export default videosEtica;
