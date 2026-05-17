// src/data/videoaulas/tipos.ts
import { z } from "zod";

// ============================================================
// ENUMS E CONSTANTES
// ============================================================

export type DisciplinaVideo =
  | "PORTUGUES"
  | "ETICA"
  | "RACIOCINIO_LOGICO"
  | "DIREITO_CONSTITUCIONAL"
  | "DIREITO_ADMINISTRATIVO"
  | "ADMINISTRACAO"
  | "ARQUIVOLOGIA"
  | "INFORMATICA"
  | "LEGISLACAO_PRF";

export const DISCIPLINAS_VIDEO = [
  "PORTUGUES",
  "ETICA",
  "RACIOCINIO_LOGICO",
  "DIREITO_CONSTITUCIONAL",
  "DIREITO_ADMINISTRATIVO",
  "ADMINISTRACAO",
  "ARQUIVOLOGIA",
  "INFORMATICA",
  "LEGISLACAO_PRF",
] as const;

export const DISCIPLINAS_VIDEO_NOME: Record<DisciplinaVideo, string> = {
  PORTUGUES: "Língua Portuguesa",
  ETICA: "Ética no Serviço Público",
  RACIOCINIO_LOGICO: "Raciocínio Lógico-Matemático",
  DIREITO_CONSTITUCIONAL: "Direito Constitucional",
  DIREITO_ADMINISTRATIVO: "Direito Administrativo",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Legislação PRF",
};

export const DISCIPLINAS_VIDEO_CORES: Record<DisciplinaVideo, string> = {
  PORTUGUES: "#3b82f6",
  ETICA: "#10b981",
  RACIOCINIO_LOGICO: "#8b5cf6",
  DIREITO_CONSTITUCIONAL: "#f59e0b",
  DIREITO_ADMINISTRATIVO: "#ef4444",
  ADMINISTRACAO: "#06b6d4",
  ARQUIVOLOGIA: "#ec4899",
  INFORMATICA: "#6366f1",
  LEGISLACAO_PRF: "#14b8a6",
};

export const DISCIPLINAS_VIDEO_ICONES: Record<DisciplinaVideo, string> = {
  PORTUGUES: "📖",
  ETICA: "✨",
  RACIOCINIO_LOGICO: "🧠",
  DIREITO_CONSTITUCIONAL: "⚖️",
  DIREITO_ADMINISTRATIVO: "🏛️",
  ADMINISTRACAO: "📊",
  ARQUIVOLOGIA: "📂",
  INFORMATICA: "💻",
  LEGISLACAO_PRF: "🚗",
};

export type NivelVideo = "iniciante" | "intermediario" | "avancado";
export type OrigemVideo = "youtube" | "vimeo" | "outro";

// ============================================================
// INTERFACES PRINCIPAIS
// ============================================================

export interface Video {
  id: string;
  disciplina: DisciplinaVideo;
  titulo: string;
  descricao: string;
  duracao: string; // Formato: "52:30" ou "1h30min"
  duracaoSegundos?: number; // Opcional, pode ser calculado
  url: string;
  thumbnail?: string;
  origem?: OrigemVideo;
  nivel?: NivelVideo;
  tags?: string[];
  autor?: string;
  dataAdicionado?: string;
  visualizacoes?: number;
  likeRatio?: number;
}

export interface CategoriaVideo {
  id: DisciplinaVideo;
  nome: string;
  icone: string;
  cor: string;
  corDestaque?: string;
  descricao?: string;
  peso?: number;
  videos: Video[];
  totalDuracao?: number;
  totalVideos?: number;
  dicas?: string[];
}

// ============================================================
// SCHEMAS ZOD (apenas tipos, sem funções)
// ============================================================

export const VideoSchema = z.object({
  id: z.string().min(1),
  disciplina: z.enum(DISCIPLINAS_VIDEO),
  titulo: z.string().min(1),
  descricao: z.string().min(1),
  duracao: z.string().min(1),
  duracaoSegundos: z.number().min(0).optional(),
  url: z.string().url(),
  thumbnail: z.string().url().optional(),
  origem: z.enum(["youtube", "vimeo", "outro"]).optional().default("youtube"),
  nivel: z.enum(["iniciante", "intermediario", "avancado"]).optional(),
  tags: z.array(z.string()).optional(),
  autor: z.string().optional(),
  dataAdicionado: z.string().datetime().optional(),
  visualizacoes: z.number().min(0).optional(),
  likeRatio: z.number().min(0).max(100).optional(),
});

export const CategoriaVideoSchema = z.object({
  id: z.enum(DISCIPLINAS_VIDEO),
  nome: z.string(),
  icone: z.string(),
  cor: z.string(),
  corDestaque: z.string().optional(),
  descricao: z.string().optional(),
  peso: z.number().min(0).max(10).optional(),
  videos: z.array(VideoSchema),
  totalDuracao: z.number().optional(),
  dicas: z.array(z.string()).optional(),
});
