// src/data/videoaulas/questoes/arquivologia.ts

import { DisciplinaVideo, Video } from "../tipos";

import { duracaoSegundos } from "@/utils/videoDuration";
import { getYouTubeThumbnail } from "@/utils/youtubeUtils";

const disciplina: DisciplinaVideo = "ARQUIVOLOGIA";

const videosArquivologia: Video[] = [
  {
    id: "arq-1",
    disciplina,
    titulo: "Gestão de Documentos e Protocolo",
    descricao:
      "Arquivo corrente, intermediário e permanente. Protocolo e tramitação documental.",
    duracao: "48:10",
    duracaoSegundos: duracaoSegundos("48:10"),
    url: "https://www.youtube.com/watch?v=exemplo1",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo1"),
    nivel: "iniciante",
    tags: ["gestao-documentos", "protocolo", "tramitacao"],
    autor: "Profa. Cristina",
  },
  {
    id: "arq-2",
    disciplina,
    titulo: "Classificação e Avaliação de Documentos",
    descricao:
      "Métodos de classificação, temporalidade e destinação de documentos.",
    duracao: "45:30",
    duracaoSegundos: duracaoSegundos("45:30"),
    url: "https://www.youtube.com/watch?v=exemplo2",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo2"),
    nivel: "intermediario",
    tags: ["classificacao", "avaliacao", "temporalidade"],
    autor: "Prof. Daniel",
  },
  {
    id: "arq-3",
    disciplina,
    titulo: "Conservação e Preservação de Documentos",
    descricao:
      "Técnicas de conservação, acondicionamento e preservação de acervos.",
    duracao: "52:15",
    duracaoSegundos: duracaoSegundos("52:15"),
    url: "https://www.youtube.com/watch?v=exemplo3",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo3"),
    nivel: "avancado",
    tags: ["conservacao", "preservacao", "acervo"],
    autor: "Profa. Cristina",
  },
];

export default videosArquivologia;
