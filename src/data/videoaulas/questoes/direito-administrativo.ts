// src/data/videoaulas/questoes/direito-administrativo.ts

import { DisciplinaVideo, Video } from "../tipos";

import { duracaoSegundos } from "@/utils/videoDuration";
import { getYouTubeThumbnail } from "@/utils/youtubeUtils";

const disciplina: DisciplinaVideo = "DIREITO_ADMINISTRATIVO";

const videosDireitoAdministrativo: Video[] = [
  {
    id: "da-1",
    disciplina,
    titulo: "Ato Administrativo",
    descricao:
      "Atributos, classificação, elementos e teoria do ato administrativo para a PRF.",
    duracao: "1h15min",
    duracaoSegundos: duracaoSegundos("1h15min"),
    url: "https://www.youtube.com/watch?v=exemplo1",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo1"),
    nivel: "iniciante",
    tags: ["ato-administrativo", "teoria", "atributos"],
    autor: "Prof. Dr. Paulo",
  },
  {
    id: "da-2",
    disciplina,
    titulo: "Nova Lei de Licitações (14.133/2021)",
    descricao:
      "Principais mudanças em relação à Lei 8.666. Modalidades, fases e regras.",
    duracao: "55:40",
    duracaoSegundos: duracaoSegundos("55:40"),
    url: "https://www.youtube.com/watch?v=exemplo2",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo2"),
    nivel: "intermediario",
    tags: ["licitacoes", "14133", "contratos"],
    autor: "Profa. Adriana",
  },
  {
    id: "da-3",
    disciplina,
    titulo: "Improbidade Administrativa (Lei 14.230/2021)",
    descricao:
      "Atualizações e jurisprudência sobre improbidade. Tipos de atos e penalidades.",
    duracao: "42:10",
    duracaoSegundos: duracaoSegundos("42:10"),
    url: "https://www.youtube.com/watch?v=exemplo3",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo3"),
    nivel: "avancado",
    tags: ["improbidade", "14230", "penalidades"],
    autor: "Prof. Dr. Paulo",
  },
  {
    id: "da-4",
    disciplina,
    titulo: "Agentes Públicos e Cargos",
    descricao:
      "Classificação, provimento, vacância e regime jurídico dos servidores públicos.",
    duracao: "1h05min",
    duracaoSegundos: duracaoSegundos("1h05min"),
    url: "https://www.youtube.com/watch?v=exemplo4",
    thumbnail: getYouTubeThumbnail("https://www.youtube.com/watch?v=exemplo4"),
    nivel: "intermediario",
    tags: ["agentes-publicos", "cargos", "servidores"],
    autor: "Profa. Adriana",
  },
];

export default videosDireitoAdministrativo;
