// src/utils/youtubeUtils.ts

export type YouTubeThumbnailQuality = "default" | "mq" | "hq" | "sd" | "maxres";

// Dimensões de referência por qualidade
const QUALITY_FILENAMES: Record<YouTubeThumbnailQuality, string> = {
  default: "default.jpg", // 120×90
  mq: "mqdefault.jpg", // 320×180
  hq: "hqdefault.jpg", // 480×360
  sd: "sddefault.jpg", // 640×480
  maxres: "maxresdefault.jpg", // 1920×1080
};

const THUMBNAIL_BASE = "https://img.youtube.com/vi";
const FALLBACK_IMAGE = "/images/video-placeholder.svg";

// ─── Extração de ID ───────────────────────────────────────────────────────────

/**
 * Extrai o ID do vídeo (11 chars) a partir de diferentes formatos de URL do YouTube.
 * Suporta:
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/watch?t=30&v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 *
 * Retorna `null` se a URL for inválida ou não reconhecida.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([^#&?]{11})/, // watch?v= (com ou sem params antes)
    /youtu\.be\/([^#&?]{11})/, // youtu.be/ID
    /youtube\.com\/embed\/([^#&?]{11})/, // embed/ID
    /youtube\.com\/v\/([^#&?]{11})/, // v/ID
    /youtube\.com\/shorts\/([^#&?]{11})/, // shorts/ID
    /youtube\.com\/live\/([^#&?]{11})/, // live/ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]?.length === 11) return match[1];
  }

  return null;
}

/**
 * Verifica se uma URL pertence ao YouTube e tem um ID válido.
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

// ─── Thumbnails síncronas ─────────────────────────────────────────────────────

/**
 * Gera a URL de thumbnail para um ID de vídeo conhecido.
 * Use quando você já tem o `videoId`; evita repetir a extração.
 */
export function getThumbnailById(
  videoId: string,
  quality: YouTubeThumbnailQuality = "mq",
): string {
  return `${THUMBNAIL_BASE}/${videoId}/${QUALITY_FILENAMES[quality]}`;
}

/**
 * Gera a URL de thumbnail a partir de uma URL do YouTube.
 * Retorna `null` se a URL for inválida (em vez de gerar `…/vi/null/…`).
 */
export function getYouTubeThumbnail(
  url: string,
  quality: YouTubeThumbnailQuality = "mq",
): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[YouTubeThumbnail] URL inválida ou não reconhecida: ${url}`,
      );
    }
    return null;
  }
  return getThumbnailById(videoId, quality);
}

/**
 * Retorna todas as qualidades de thumbnail para uma URL.
 * Retorna `null` se a URL for inválida.
 */
export function getAllYouTubeThumbnails(
  url: string,
): Record<YouTubeThumbnailQuality, string> | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  return (Object.keys(QUALITY_FILENAMES) as YouTubeThumbnailQuality[]).reduce(
    (acc, quality) => {
      acc[quality] = getThumbnailById(videoId, quality);
      return acc;
    },
    {} as Record<YouTubeThumbnailQuality, string>,
  );
}

// ─── Thumbnails assíncronas ───────────────────────────────────────────────────

/**
 * Verifica se uma thumbnail existe via requisição HEAD ou HTMLImageElement.
 * No browser, usa HTMLImageElement (imune a CORS) e detecta a imagem cinza de 120×90
 * que o YouTube serve para thumbnails inexistentes.
 * Em ambiente servidor (Next.js SSR / Node), usa fetch com HEAD.
 */
export async function checkThumbnailExists(url: string): Promise<boolean> {
  // Ambiente browser: usa HTMLImageElement (imune a CORS)
  if (typeof window !== "undefined" && typeof Image !== "undefined") {
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        img.onload = img.onerror = null;
        resolve(false);
      }, 4000);

      img.onload = () => {
        clearTimeout(timeout);
        // YouTube serve uma imagem 120×90 cinza para thumbnails inexistentes
        const isMissingPlaceholder =
          img.naturalWidth === 120 && img.naturalHeight === 90;
        resolve(!isMissingPlaceholder);
      };
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
      img.src = url;
    });
  }

  // Ambiente servidor (Next.js SSR / Node)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Tenta encontrar a melhor thumbnail disponível, do maior para o menor.
 * Retorna o fallback local se nenhuma qualidade for encontrada.
 */
export async function getBestYouTubeThumbnail(url: string): Promise<string> {
  const thumbnails = getAllYouTubeThumbnails(url);
  if (!thumbnails) return FALLBACK_IMAGE;

  const order: YouTubeThumbnailQuality[] = [
    "maxres",
    "sd",
    "hq",
    "mq",
    "default",
  ];

  for (const quality of order) {
    const exists = await checkThumbnailExists(thumbnails[quality]);
    if (exists) return thumbnails[quality];
  }

  // Se todas as verificações falharem, mq é a mais segura (sempre presente)
  return thumbnails.mq;
}

// ─── Duração de vídeos ─────────────────────────────────────────────────────────

/**
 * Converte string de duração para segundos
 * Suporta formatos:
 * - "52:30" -> 3150 segundos
 * - "1h30min" -> 5400 segundos
 * - "1:30:00" -> 5400 segundos
 * - "90min" -> 5400 segundos
 */
export function durationToSeconds(duration: string): number {
  if (!duration) return 0;

  // Formato: "1h30min" ou "1h 30min"
  const hMatch = duration.match(/(\d+)h\s*(?:(\d+)(?:min)?)?/);
  if (hMatch) {
    const hours = parseInt(hMatch[1]);
    const minutes = parseInt(hMatch[2] || "0");
    return hours * 3600 + minutes * 60;
  }

  // Formato: "90min"
  const minMatch = duration.match(/^(\d+)min$/);
  if (minMatch) return parseInt(minMatch[1]) * 60;

  // Formato: "MM:SS" ou "HH:MM:SS"
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  // Fallback: tenta converter diretamente
  const num = parseInt(duration);
  return isNaN(num) ? 0 : num;
}

// ALIAS para compatibilidade com código existente
export const duracaoSegundos = durationToSeconds;

/**
 * Converte segundos para string de duração formatada
 * @param seconds - Total de segundos
 * @param format - Formato de saída: 'full' (1h 30min), 'short' (1:30:00), 'compact' (1h30)
 */
export function secondsToDuration(
  seconds: number,
  format: "full" | "short" | "compact" = "full",
): string {
  if (seconds <= 0) return format === "short" ? "00:00" : "0min";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (format === "short") {
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  if (format === "compact") {
    if (hours > 0) return `${hours}h${minutes > 0 ? minutes : ""}`;
    return `${minutes}min`;
  }

  // Formato full (padrão)
  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
  }
  return `${minutes}min${secs > 0 ? ` ${secs}s` : ""}`;
}

/**
 * Soma durações de múltiplos vídeos
 */
export function sumDurations(
  videos: { duracaoSegundos?: number; duracao?: string }[],
): number {
  return videos.reduce((total, video) => {
    if (video.duracaoSegundos) return total + video.duracaoSegundos;
    if (video.duracao) return total + durationToSeconds(video.duracao);
    return total;
  }, 0);
}

/**
 * Formata duração total a partir de uma lista de vídeos
 */
export function formatTotalDuration(
  videos: { duracaoSegundos?: number; duracao?: string }[],
): string {
  const total = sumDurations(videos);
  return secondsToDuration(total);
}
