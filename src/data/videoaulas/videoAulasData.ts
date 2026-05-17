// src/data/videoaulas/VideoAulasData.ts
import {
  durationToSeconds,
  secondsToDuration,
  sumDurations,
} from "../../utils/videoDuration";
import { CategoriaVideo, DisciplinaVideo, NivelVideo, Video } from "./tipos";

// ============================================================
// IMPORTAÇÕES DOS VÍDEOS POR DISCIPLINA
// ============================================================

import videosAdministracao from "./questoes/administracao";
import videosArquivologia from "./questoes/arquivologia";
import videosDireitoAdministrativo from "./questoes/direito-administrativo";
import videosDireitoConstitucional from "./questoes/direito-constitucional";
import videosEtica from "./questoes/etica";
import videosInformatica from "./questoes/informatica";
import videosLegislacaoPRF from "./questoes/legislacao-prf";
import videosPortugues from "./questoes/portugues";
import videosRaciocinioLogico from "./questoes/raciocinio-logico";

// ============================================================
// BANCO DE VÍDEOS CONSOLIDADOS (com duração normalizada)
// ============================================================

// Função auxiliar para normalizar vídeos (garantir duracaoSegundos)
function normalizeVideo(video: Video): Video {
  if (!video.duracaoSegundos && video.duracao) {
    return {
      ...video,
      duracaoSegundos: durationToSeconds(video.duracao),
    };
  }
  return video;
}

// Aplica normalização em todas as listas
const normalizedPortugues = videosPortugues.map(normalizeVideo);
const normalizedEtica = videosEtica.map(normalizeVideo);
const normalizedRaciocinioLogico = videosRaciocinioLogico.map(normalizeVideo);
const normalizedDireitoConstitucional =
  videosDireitoConstitucional.map(normalizeVideo);
const normalizedDireitoAdministrativo =
  videosDireitoAdministrativo.map(normalizeVideo);
const normalizedAdministracao = videosAdministracao.map(normalizeVideo);
const normalizedArquivologia = videosArquivologia.map(normalizeVideo);
const normalizedInformatica = videosInformatica.map(normalizeVideo);
const normalizedLegislacaoPRF = videosLegislacaoPRF.map(normalizeVideo);

export const videoAulasData: Video[] = [
  ...normalizedPortugues,
  ...normalizedEtica,
  ...normalizedRaciocinioLogico,
  ...normalizedDireitoConstitucional,
  ...normalizedDireitoAdministrativo,
  ...normalizedAdministracao,
  ...normalizedArquivologia,
  ...normalizedInformatica,
  ...normalizedLegislacaoPRF,
];

// ============================================================
// CATEGORIAS AGRUPADAS
// ============================================================

export interface CategoriaVideoExport extends CategoriaVideo {
  totalDuracao: number;
  totalVideos: number;
}

function createCategoria(
  id: DisciplinaVideo,
  nome: string,
  icone: string,
  cor: string,
  videos: Video[],
  descricao?: string,
  peso?: number,
  dicas?: string[],
): CategoriaVideoExport {
  return {
    id,
    nome,
    icone,
    cor,
    corDestaque: cor.replace("from-", "from-").replace("to-", "to-"), // Simplificado, ajuste conforme necessário
    descricao,
    peso,
    videos,
    totalDuracao: sumDurations(videos),
    totalVideos: videos.length,
    dicas,
  };
}

export const categoriasVideo: CategoriaVideoExport[] = [
  createCategoria(
    "PORTUGUES",
    "Língua Portuguesa",
    "📖",
    "from-blue-500 to-cyan-500",
    normalizedPortugues,
    "Compreensão textual, gramática e interpretação para a CEBRASPE",
    10,
    [
      "Leia questões anteriores da CEBRASPE para se acostumar com o estilo",
      "Pratique interpretação de textos longos diariamente",
      "Foque em crase, regência e concordância",
    ],
  ),
  createCategoria(
    "ETICA",
    "Ética no Serviço Público",
    "✨",
    "from-emerald-500 to-green-500",
    normalizedEtica,
    "Princípios éticos e código de conduta do servidor público",
    6,
    [
      "Decore os artigos do Decreto 1.171/94",
      "Estude os princípios da administração",
      "Conheça as vedações aos servidores",
    ],
  ),
  createCategoria(
    "RACIOCINIO_LOGICO",
    "Raciocínio Lógico-Matemático",
    "🧠",
    "from-purple-500 to-pink-500",
    normalizedRaciocinioLogico,
    "Lógica, matemática e raciocínio analítico",
    9,
    [
      "Pratique tabelas verdade diariamente",
      "Aprenda as equivalências lógicas de cor",
      "Resolva questões de probabilidade com frequência",
    ],
  ),
  createCategoria(
    "DIREITO_CONSTITUCIONAL",
    "Direito Constitucional",
    "⚖️",
    "from-yellow-500 to-orange-500",
    normalizedDireitoConstitucional,
    "Direitos fundamentais, organização do Estado e Poderes",
    10,
    [
      "Decore os incisos do Art. 5º",
      "Estude remédios constitucionais",
      "Pratique questões sobre nacionalidade",
    ],
  ),
  createCategoria(
    "DIREITO_ADMINISTRATIVO",
    "Direito Administrativo",
    "🏛️",
    "from-slate-500 to-gray-500",
    normalizedDireitoAdministrativo,
    "Administração pública, atos, agentes e licitações",
    10,
    [
      "Decore os princípios da administração",
      "Estude a nova Lei de Licitações (14.133)",
      "Foque em improbidade administrativa",
    ],
  ),
  createCategoria(
    "ADMINISTRACAO",
    "Administração",
    "📊",
    "from-teal-500 to-cyan-500",
    normalizedAdministracao,
    "Processos organizacionais e gestão de pessoas",
    7,
    [
      "Estude as teorias da administração",
      "Foque em gestão de processos",
      "Conheça os tipos de liderança",
    ],
  ),
  createCategoria(
    "ARQUIVOLOGIA",
    "Arquivologia",
    "📂",
    "from-rose-500 to-pink-500",
    normalizedArquivologia,
    "Gestão de documentos e conservação",
    5,
    [
      "Entenda as fases do arquivo",
      "Estude os tipos de documentos",
      "Conheça protocolo e gestão",
    ],
  ),
  createCategoria(
    "INFORMATICA",
    "Informática",
    "💻",
    "from-indigo-500 to-blue-500",
    normalizedInformatica,
    "Conceitos de hardware, software e segurança",
    7,
    [
      "Foque em atalhos do pacote Office",
      "Estude os principais tipos de malware",
      "Conheça navegadores e protocolos de internet",
    ],
  ),
  createCategoria(
    "LEGISLACAO_PRF",
    "Legislação PRF",
    "🚗",
    "from-red-500 to-orange-500",
    normalizedLegislacaoPRF,
    "Código de Trânsito Brasileiro e legislação específica",
    10,
    [
      "Decore os valores de multas e pontos",
      "Estude as infrações gravíssimas",
      "Conheça o Sistema Nacional de Trânsito",
    ],
  ),
];

// ============================================================
// CONSTANTES CALCULADAS
// ============================================================

export const totalVideos = videoAulasData.length;
export const totalDuracaoGeral = sumDurations(videoAulasData);
export const totalDuracaoFormatada = secondsToDuration(totalDuracaoGeral);

export const videosPorNivel = {
  iniciante: videoAulasData.filter((v) => v.nivel === "iniciante").length,
  intermediario: videoAulasData.filter((v) => v.nivel === "intermediario")
    .length,
  avancado: videoAulasData.filter((v) => v.nivel === "avancado").length,
};

export const todasTags = [
  ...new Set(videoAulasData.flatMap((v) => v.tags || [])),
];

// ============================================================
// FUNÇÕES DE BUSCA
// ============================================================

export function getVideoById(id: string): Video | undefined {
  return videoAulasData.find((v) => v.id === id);
}

export function getVideosPorDisciplina(disciplina: DisciplinaVideo): Video[] {
  return videoAulasData.filter((v) => v.disciplina === disciplina);
}

export function getVideosPorNivel(nivel: NivelVideo): Video[] {
  return videoAulasData.filter((v) => v.nivel === nivel);
}

export function getVideosPorTag(tag: string): Video[] {
  return videoAulasData.filter((v) => v.tags?.includes(tag));
}

export function buscarVideos(termo: string): Video[] {
  const termoLower = termo.toLowerCase().trim();
  if (!termoLower) return [];

  return videoAulasData.filter(
    (v) =>
      v.titulo.toLowerCase().includes(termoLower) ||
      v.descricao.toLowerCase().includes(termoLower) ||
      v.tags?.some((tag) => tag.toLowerCase().includes(termoLower)),
  );
}

// ============================================================
// STATS POR CATEGORIA
// ============================================================

export function getStatsPorCategoria() {
  return categoriasVideo.map((cat) => ({
    id: cat.id,
    nome: cat.nome,
    icone: cat.icone,
    totalVideos: cat.totalVideos,
    totalDuracao: cat.totalDuracao,
    totalDuracaoFormatada: secondsToDuration(cat.totalDuracao),
    peso: cat.peso,
  }));
}

// ============================================================
// VALIDAÇÃO DE INTEGRIDADE
// ============================================================

export interface IntegridadeVideoBanco {
  valido: boolean;
  erros: string[];
  duplicados: string[];
  semDuracaoSegundos: string[];
  estatisticas: {
    totalVideos: number;
    videosComErro: number;
    videosDuplicados: number;
    videosSemDuracaoSegundos: number;
  };
}

export function validarIntegridadeBancoVideo(): IntegridadeVideoBanco {
  const ids = new Map<string, Video[]>();
  const duplicados: string[] = [];
  const erros: string[] = [];
  const semDuracaoSegundos: string[] = [];

  // Verifica duplicados
  for (const v of videoAulasData) {
    const existing = ids.get(v.id);
    if (existing) {
      if (!duplicados.includes(v.id)) duplicados.push(v.id);
      existing.push(v);
    } else {
      ids.set(v.id, [v]);
    }
  }

  // Verifica campos obrigatórios
  for (const v of videoAulasData) {
    if (!v.id?.trim()) erros.push(`Vídeo sem ID: ${JSON.stringify(v)}`);
    if (!v.titulo?.trim()) erros.push(`Vídeo ${v.id}: título vazio`);
    if (!v.url?.trim()) erros.push(`Vídeo ${v.id}: URL vazia`);
    if (!v.disciplina) erros.push(`Vídeo ${v.id}: disciplina inválida`);
    if (!v.duracaoSegundos && v.duracao) {
      semDuracaoSegundos.push(v.id);
    }
  }

  return {
    valido: erros.length === 0 && duplicados.length === 0,
    erros,
    duplicados,
    semDuracaoSegundos,
    estatisticas: {
      totalVideos: videoAulasData.length,
      videosComErro: erros.length,
      videosDuplicados: duplicados.length,
      videosSemDuracaoSegundos: semDuracaoSegundos.length,
    },
  };
}

// ============================================================
// METADADOS DO BANCO
// ============================================================

export const METADADOS_BANCO_VIDEO = {
  totalVideos,
  totalDuracao: totalDuracaoGeral,
  totalDuracaoFormatada,
  categorias: categoriasVideo.length,
  videosPorNivel,
  todasTags,
  ultimaAtualizacao: new Date().toISOString(),
  versao: "1.0.0",
  integridade: validarIntegridadeBancoVideo(),
} as const;

// ============================================================
// RE-EXPORT PARA COMPATIBILIDADE
// ============================================================

export {
  durationToSeconds,
  secondsToDuration,
} from "../../utils/videoDuration";
export {
  extractYouTubeId,
  getYouTubeThumbnail,
  isYouTubeUrl,
} from "../../utils/youtubeUtils";
export * from "./tipos";

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
  videoAulasData,
  categoriasVideo,
  totalVideos,
  totalDuracaoGeral,
  totalDuracaoFormatada,
  METADADOS_BANCO_VIDEO,
  getVideoById,
  getVideosPorDisciplina,
  getVideosPorNivel,
  getVideosPorTag,
  buscarVideos,
  getStatsPorCategoria,
  validarIntegridadeBancoVideo,
};
