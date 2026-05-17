// src/utils/youtubeThumbnail.ts

export type YouTubeThumbnailQuality = "default" | "mq" | "hq" | "sd" | "maxres";

/**
 * Extrai o ID do vídeo do YouTube a partir de diferentes formatos de URL
 * Suporta:
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  // Valida se o ID tem 11 caracteres (formato padrão do YouTube)
  const videoId = match && match[2]?.length === 11 ? match[2] : null;

  return videoId;
}

/**
 * Gera a URL da thumbnail do YouTube
 * @param url - URL do vídeo do YouTube
 * @param quality - Qualidade da thumbnail (default, mq, hq, sd, maxres)
 * @returns URL da thumbnail ou placeholder padrão
 */
export function getYouTubeThumbnail(
  url: string,
  quality: YouTubeThumbnailQuality = "mq",
): string {
  const videoId = extractYouTubeId(url);

  // Placeholder padrão com gradiente elegante (pode ser substituído por uma imagem local)
  const placeholder = "/images/video-placeholder.svg";

  if (!videoId) {
    console.warn(`[YouTube Thumbnail] Invalid YouTube URL: ${url}`);
    return placeholder;
  }

  const qualities: Record<YouTubeThumbnailQuality, string> = {
    default: "default.jpg", // 120x90
    mq: "mqdefault.jpg", // 320x180
    hq: "hqdefault.jpg", // 480x360
    sd: "sddefault.jpg", // 640x480
    maxres: "maxresdefault.jpg", // 1920x1080
  };

  return `https://img.youtube.com/vi/${videoId}/${qualities[quality]}`;
}

/**
 * Obtém múltiplas qualidades de thumbnail de uma vez
 */
export function getYouTubeThumbnails(url: string): {
  default: string;
  mq: string;
  hq: string;
  sd: string;
  maxres: string;
} | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  return {
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  };
}

/**
 * Verifica se a thumbnail existe (útil para fallback)
 * Nota: Isso é uma chamada assíncrona para ser usada com fetch
 */
export async function checkThumbnailExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Gera URL da thumbnail com fallback automático
 * Tenta maxres primeiro, se não existir usa hq
 */
export async function getBestThumbnail(url: string): Promise<string> {
  const thumbnails = getYouTubeThumbnails(url);
  if (!thumbnails) return "/images/video-placeholder.svg";

  // Tenta maxres primeiro
  const maxresExists = await checkThumbnailExists(thumbnails.maxres);
  if (maxresExists) return thumbnails.maxres;

  // Fallback para hq
  return thumbnails.hq;
}
